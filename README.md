# 몇대몇 (vsmdm)

Vite + React 프론트엔드, Vercel Functions API, Supabase Postgres로 구성된 게시판입니다.

## 서비스 구성

- Frontend: React + Vite
- API: Vercel Functions (`api/[...path].js`)
- Database: Supabase 프로젝트 `vsmdm`
- Local API: Express (`server.js`)

## 로컬 설치

```bash
npm install
```

## 로컬 실행

터미널 1에서 API 서버를 실행합니다.

```bash
npm run backend
```

터미널 2에서 프론트엔드를 실행합니다.

```bash
npm run frontend
```

브라우저에서 아래 주소를 엽니다.

```text
http://127.0.0.1:5173?page=1
```

## 빌드

```bash
npm run build
```

## 배포

Vercel은 `vercel.json`을 사용해 Vite 앱과 `api/`의 Serverless Function을 함께 배포합니다.
Supabase 연결 정보는 publishable key만 사용하며, 쓰기 작업과 댓글 비밀번호 검증은 제한된 Postgres RPC 함수에서 처리합니다.

## 데이터베이스

- `mdae_boards`: 게시글, 조회수, 좋아요, 투표, 마감일
- `mdae_comments`: 댓글과 해시된 댓글 비밀번호

기존 로컬 MySQL 데이터는 새 Supabase `vsmdm` 프로젝트로 이전되었습니다.
