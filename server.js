require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 5000;

const validApiKey = process.env.API_KEY;

const corsOptions = {
  origin: 'https://smu-server-status-viewer.vercel.app/',
  methods: ['GET'],
};
  
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20, // 1분에 최대 20번
  message: 'Too many requests from this IP, please try again a minute later.',
});

app.use(cors(corsOptions));
app.use(limiter);
app.use(express.json());

// API 키 인증 미들웨어
function authenticateApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key']; // 요청 헤더에서 API 키를 가져옵니다.
  
  if (!apiKey) {
    return res.status(400).json({ message: 'API key is missing' });
  }
  
  if (apiKey !== validApiKey) {
    return res.status(403).json({ message: 'Forbidden: Invalid API key' });
  }
  
  next();
}

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
        responseTime: duration,
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
app.get('/status/home', authenticateApiKey, async (req, res) => {
  const result = await checkServiceStatus(serviceURL.HOME);
  res.json(result);
});

app.get('/status/notice', authenticateApiKey, async (req, res) => {
  const result = await checkServiceStatus(serviceURL.NOTICE);
  res.json(result);
});

/*
app.get('/status/sammul', authenticateApiKey, async (req, res) => {
  const result = await checkServiceStatus(serviceURL.SAMMUL);
  res.json(result);
});
*/

app.get('/status/ecampus', authenticateApiKey, async (req, res) => {
  const result = await checkServiceStatus(serviceURL.ECAMPUS);
  res.json(result);
});

// 서버 실행
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});