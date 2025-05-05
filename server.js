require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: ['https://turbo-cod-7x5g9wj64452pjxv-3000.app.github.dev', 'https://smu-server-status-viewer.vercel.app'],
  methods: ['GET', 'OPTIONS'],
};
  
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: 'Too many requests from this IP, please try again a minute later.',
});

app.use(cors(corsOptions));
app.use(limiter);
app.use(express.json());

// 각 서비스 URL 설정
const serviceURL = {
  HOME: 'https://www.smu.ac.kr/kor/index.do',
  NOTICE: 'https://www.smu.ac.kr/kor/life/notice.do',
  SAMMUL: 'https://smsso.smu.ac.kr/',
  ECAMPUS: 'https://ecampus.smu.ac.kr/'
};

// 서버 상태 확인 함수
async function checkServiceStatus(url) {
  const start = Date.now();
  
  try {
    const response = await axios.head(url, { timeout: 5000, maxRedirects: 5 });
    const duration = Date.now() - start;  // 응답 시간 계산
    
    if (response.status === 200) {
      return { 
        status: 'ok', 
        responseTime: duration,
        message: '서비스가 정상입니다.' 
      };
    } else {
      return { 
        status: 'error', 
        responseTime: duration,
        message: `서비스 상태: ${response.status}` 
      };
    }
  } catch (error) {
    const duration = Date.now() - start;
    if (error.code === 'ECONNABORTED') {
      return { 
        status: 'timeout', 
        responseTime: 'N/A',
        message: '요청 시간이 초과되었습니다.' 
      };
    } else {
      return { 
        status: 'error', 
        responseTime: duration,
        message: '서비스 접속 실패', 
        error: error.message 
      };
    }
  }
}

// 상태 확인 엔드포인트들
app.get('/status/home', async (req, res) => {
  const result = await checkServiceStatus(serviceURL.HOME);
  res.json(result);
});

app.get('/status/notice', async (req, res) => {
  const result = await checkServiceStatus(serviceURL.NOTICE);
  res.json(result);
});

/*
app.get('/status/sammul', async (req, res) => {
  const result = await checkServiceStatus(serviceURL.SAMMUL);
  res.json(result);
});
*/

app.get('/status/ecampus', async (req, res) => {
  const result = await checkServiceStatus(serviceURL.ECAMPUS);
  res.json(result);
});

// 서버 실행
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});