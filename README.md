<div align="center">

# 🗄️ SMU Server Status Viewer — 백엔드 (Express)

**스뮤온(상명대 서버 상태 확인) 1세대 버전**

<img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js">
<img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white" alt="Express">

</div>

> [!IMPORTANT]
> 이 저장소는 더 이상 개발되지 않습니다. 프론트엔드와 백엔드는 커밋 이력을 보존한 채 모노레포 **[smu-server-status-viewer](https://github.com/jiwonsudo/smu-server-status-viewer)** 로 합쳐졌고, 이후 Next.js + Go로 다시 작성되었습니다.

## 소개

상명대학교 이캠퍼스 등 주요 웹서비스의 접속 상태를 보여주던 서비스 **스뮤온(SMUON)** 의 초기 백엔드 (Express) 코드입니다.
Express 서버가 각 서비스에 요청을 보내 응답 여부와 속도를 확인하고, 프론트엔드에 결과를 전달했습니다. `express-rate-limit`으로 과도한 요청을 막았습니다.

| 버전 | 프론트엔드 | 백엔드 |
|---|---|---|
| 1세대 (이 저장소) | Create React App | Express |
| 현재 | Next.js (ISR · SSE) | Go 표준 라이브러리 + PostgreSQL + AI 장애 분석 |

👉 최신 버전: **https://www.issmuok.site**
