# ML-IDS 캡스톤 디자인 프로젝트 - 로컬 실행 가이드

## 🚀 시스템 요구사항

### 필수 설치 프로그램

- **Node.js** (v18 이상) - [다운로드](https://nodejs.org/)

- **Python** (v3.8 이상) - [다운로드](https://www.python.org/)

- **Git** - [다운로드](https://git-scm.com/)

- **pnpm** (Node.js 패키지 관리자)

### 권장 사양

- **OS**: Windows 10/11, macOS 10.15+, Ubuntu 20.04+

- **RAM**: 8GB 이상

- **디스크**: 5GB 이상 (node_modules 포함)

---

## 📥 Step 1: 프로젝트 다운로드

### 옵션 A: GitHub에서 클론 (권장)

```bash
git clone https://github.com/[your-username]/ml-ids-project.git
cd ml-ids-project
```

### 옵션 B: 수동으로 다운로드

1. GitHub에서 프로젝트를 ZIP으로 다운로드

1. 압축 해제

1. 터미널/명령 프롬프트에서 프로젝트 폴더로 이동

```bash
cd ml-ids-project
```

---

## 🔧 Step 2: 의존성 설치

### 2.1 Node.js 의존성 설치

```bash
# pnpm 설치 (처음 한 번만 )
npm install -g pnpm

# 프로젝트 의존성 설치
pnpm install
```

### 2.2 Python 의존성 설치

```bash
# Python 가상 환경 생성 (권장)
python -m venv venv

# 가상 환경 활성화
# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

# Python 패키지 설치
pip install -r requirements.txt
```

### 2.3 requirements.txt 생성 (첫 실행 시)

만약 `requirements.txt`가 없다면 다음 명령으로 생성:

```bash
pip install scikit-learn pandas numpy tensorflow
```

---

## 🗄️ Step 3: 데이터베이스 설정

### 3.1 MySQL/TiDB 연결 설정

**환경 변수 파일 생성** (`.env.local`)

```bash
# 프로젝트 루트에 .env.local 파일 생성
DATABASE_URL="mysql://username:password@localhost:3306/ml_ids"
JWT_SECRET="your-secret-key-here"
```

### 3.2 데이터베이스 마이그레이션

```bash
pnpm db:push
```

이 명령은 다음을 수행합니다:

- Drizzle 스키마 생성

- 데이터베이스 테이블 생성

- 마이그레이션 파일 생성

---

## 🏃 Step 4: 개발 서버 실행

### 4.1 개발 모드 시작

```bash
pnpm dev
```

**예상 출력:**

```
> ml-ids-project@1.0.0 dev
> NODE_ENV=development tsx watch server/_core/index.ts

[OAuth]: https://api.manus.im "Initialized with baseURL:"
Server running on http://localhost:3000/
```

### 4.2 브라우저에서 접속

```
http://localhost:3000
```

---

## 🧪 Step 5: 테스트 실행

### 단위 테스트 실행

```bash
pnpm test
```

### 특정 테스트 파일만 실행

```bash
pnpm test -- Monitoring.test.ts
```

### 테스트 감시 모드 (파일 변경 시 자동 실행 )

```bash
pnpm test -- --watch
```

---

## 🏗️ Step 6: 프로덕션 빌드

### 빌드 실행

```bash
pnpm build
```

### 빌드 결과 확인

```
dist/
├── index.js          # 백엔드 서버
└── client/           # 프론트엔드 정적 파일
```

### 프로덕션 모드로 실행

```bash
pnpm start
```

---

## 📂 프로젝트 구조

```
ml-ids-project/
├── client/                 # 프론트엔드 (React)
│   ├── src/
│   │   ├── pages/         # 페이지 컴포넌트
│   │   ├── components/    # 재사용 컴포넌트
│   │   ├── App.tsx        # 메인 라우터
│   │   └── index.css      # 글로벌 스타일
│   └── index.html         # HTML 템플릿
├── server/                # 백엔드 (Node.js + tRPC)
│   ├── routers.ts         # API 라우터
│   ├── db.ts              # 데이터베이스 함수
│   ├── ml_engine.py       # 머신러닝 엔진
│   ├── realtime_analyzer.ts
│   └── llm_analyzer.ts
├── drizzle/               # 데이터베이스 스키마
│   └── schema.ts
├── package.json           # Node.js 의존성
├── pnpm-lock.yaml         # 의존성 잠금 파일
└── .env.local             # 환경 변수 (생성 필요)
```

---

## 🔐 환경 변수 설정

### .env.local 파일 예시

```
# 데이터베이스
DATABASE_URL="mysql://root:password@localhost:3306/ml_ids"

# 인증
JWT_SECRET="your-super-secret-jwt-key-change-this"

# OAuth (Manus - 선택사항)
VITE_APP_ID="your-app-id"
OAUTH_SERVER_URL="https://api.manus.im"
VITE_OAUTH_PORTAL_URL="https://manus.im/login"

# LLM (OpenAI - 선택사항 )
OPENAI_API_KEY="sk-..."

# S3 파일 저장소 (선택사항)
AWS_ACCESS_KEY_ID="your-key"
AWS_SECRET_ACCESS_KEY="your-secret"
AWS_REGION="ap-northeast-1"
```

---

## 🐛 문제 해결

### 문제 1: "pnpm: command not found"

```bash
npm install -g pnpm
```

### 문제 2: "DATABASE_URL not found"

- `.env.local` 파일이 프로젝트 루트에 있는지 확인

- 데이터베이스 연결 문자열이 올바른지 확인

### 문제 3: "Python module not found"

```bash
# 가상 환경 활성화 확인
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# 패키지 재설치
pip install -r requirements.txt
```

### 문제 4: "Port 3000 already in use"

```bash
# 다른 포트 사용
PORT=3001 pnpm dev
```

### 문제 5: "TypeScript 컴파일 에러"

```bash
# 타입 체크 실행
pnpm check

# 캐시 삭제 후 재설치
rm -rf node_modules
pnpm install
```

---

## 📊 개발 워크플로우

### 1. 기능 개발

```bash
# 개발 서버 시작
pnpm dev

# 다른 터미널에서 파일 변경 감시
pnpm test -- --watch
```

### 2. 데이터베이스 스키마 변경

```bash
# drizzle/schema.ts 수정 후
pnpm db:push
```

### 3. API 추가

```bash
# server/routers.ts에 새로운 라우터 추가
# 자동으로 tRPC 타입 생성됨
```

### 4. 프론트엔드 페이지 추가

```bash
# client/src/pages/NewPage.tsx 생성
# client/src/App.tsx에 라우트 추가
```

### 5. 테스트 작성

```bash
# server/newfeature.test.ts 또는 client/src/pages/NewPage.test.ts 생성
pnpm test
```

---

## 🚀 배포 준비

### 1. 프로덕션 환경 변수 설정

```bash
# .env.production 파일 생성
DATABASE_URL="production-database-url"
JWT_SECRET="production-secret-key"
```

### 2. 빌드 및 테스트

```bash
pnpm build
pnpm test
```

### 3. 배포

```bash
# Manus 플랫폼에 배포 (UI에서 Publish 버튼 클릭)
# 또는 Docker/Railway/Vercel 등에 배포
```

---

## 📚 유용한 명령어

| 명령어 | 설명 |
| --- | --- |
| `pnpm dev` | 개발 서버 시작 |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm start` | 프로덕션 서버 실행 |
| `pnpm test` | 테스트 실행 |
| `pnpm check` | TypeScript 타입 체크 |
| `pnpm format` | 코드 포맷팅 |
| `pnpm db:push` | 데이터베이스 마이그레이션 |

---

## 🔗 유용한 링크

- [Node.js 공식 문서](https://nodejs.org/docs/)

- [pnpm 공식 문서](https://pnpm.io/)

- [React 공식 문서](https://react.dev/)

- [tRPC 공식 문서](https://trpc.io/)

- [Drizzle ORM 공식 문서](https://orm.drizzle.team/)

- [Tailwind CSS 공식 문서](https://tailwindcss.com/)

---

## ✅ 첫 실행 체크리스트

- [ ] Node.js 설치 확인 (`node --version`)

- [ ] Python 설치 확인 (`python --version`)

- [ ] Git 설치 확인 (`git --version`)

- [ ] 프로젝트 클론/다운로드

- [ ] `pnpm install` 실행

- [ ] `.env.local` 파일 생성 및 설정

- [ ] `pnpm db:push` 실행

- [ ] `pnpm dev` 실행

- [ ] `http://localhost:3000` 접속 확인

---

## 🆘 추가 도움말

문제가 발생하면:

1. **에러 메시지 확인** - 터미널의 에러 메시지를 읽고 검색

1. **로그 확인** - `.manus-logs/` 디렉토리의 로그 파일 확인

1. **GitHub Issues** - 프로젝트의 Issues 탭에서 유사한 문제 검색

1. **Discord/커뮤니티** - 개발자 커뮤니티에 질문

---

**마지막 업데이트**: 2026-02-22**프로젝트 버전**: 1.0.0**상태**: ✅ 로컬 실행 준비 완료

