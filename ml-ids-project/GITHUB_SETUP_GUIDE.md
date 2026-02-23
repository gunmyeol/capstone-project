# GitHub에 ML-IDS 프로젝트 연동하기 - 완전 가이드

## 📋 상황 정리

- ✅ 로컬 저장소: `project/my_app` 폴더
- ✅ GitHub 계정: 연동 완료
- ✅ Git 설정: 완료
- 🎯 목표: Manus 샌드박스의 ML-IDS 파일 → GitHub의 `my_app` 폴더 → 로컬 노트북

---

## 🚀 Step 1: 현재 상황 확인 (로컬 노트북)

### 1.1 로컬 저장소 상태 확인
```bash
cd ~/project
git status
```

**예상 출력:**
```
On branch main
nothing to commit, working tree clean
```

### 1.2 my_app 폴더 구조 확인
```bash
ls -la my_app/
```

---

## 📥 Step 2: 파일 준비 (Manus 샌드박스)

현재 Manus 샌드박스에서 `/home/ubuntu/ml-ids-project`의 모든 파일을 준비합니다.

### 2.1 필요한 파일 목록

**핵심 파일:**
```
ml-ids-project/
├── client/                    # React 프론트엔드
├── server/                    # Node.js 백엔드
├── drizzle/                   # 데이터베이스 스키마
├── shared/                    # 공유 타입
├── package.json               # Node.js 의존성
├── tsconfig.json              # TypeScript 설정
├── vite.config.ts             # Vite 설정
├── vitest.config.ts           # 테스트 설정
├── drizzle.config.ts          # Drizzle 설정
├── .gitignore                 # Git 무시 파일
├── .prettierrc                # 코드 포맷팅
├── .prettierignore
├── components.json            # shadcn/ui 설정
└── 문서 파일들:
    ├── DESIGN.md
    ├── THESIS.md
    ├── TECHNICAL_DOCUMENTATION.md
    ├── SETUP_GUIDE.md
    ├── VIDEO_TUTORIAL_SCRIPT.md
    ├── PRIVACY.md
    └── TERMS.md
```

**제외할 파일 (이미 .gitignore에 포함됨):**
```
node_modules/          # npm 의존성
dist/                  # 빌드 결과
.manus-logs/           # 로그 파일
.webdev/               # Manus 내부 파일
pnpm-lock.yaml         # 잠금 파일 (필요시 포함)
```

---

## 🔗 Step 3: GitHub 저장소 설정

### 3.1 GitHub에서 저장소 생성 (선택사항)
만약 `my_app` 저장소가 아직 없다면:

1. GitHub 로그인
2. "New repository" 클릭
3. Repository name: `my_app`
4. Description: "ML-based Network Intrusion Detection System"
5. Public 선택 (캡스톤 프로젝트이므로)
6. "Create repository" 클릭

### 3.2 로컬 저장소에 원격 추가 (이미 되어있으면 스킵)
```bash
cd ~/project
git remote -v
```

**출력 예시:**
```
origin  https://github.com/your-username/project.git (fetch)
origin  https://github.com/your-username/project.git (push)
```

---

## 📂 Step 4: 파일 복사 및 구성

### 4.1 방법 A: 직접 복사 (권장)

#### Windows PowerShell:
```powershell
# Manus 샌드박스에서 파일 다운로드 후
# ~/project/my_app 폴더에 복사

# 1. 기존 my_app 폴더 백업
Copy-Item -Path "C:\Users\YourName\project\my_app" -Destination "C:\Users\YourName\project\my_app.backup" -Recurse

# 2. my_app 폴더 비우기
Remove-Item -Path "C:\Users\YourName\project\my_app\*" -Recurse -Force

# 3. 다운로드한 파일 복사
Copy-Item -Path "C:\Users\YourName\Downloads\ml-ids-project\*" -Destination "C:\Users\YourName\project\my_app" -Recurse
```

#### macOS / Linux:
```bash
# 1. 기존 my_app 폴더 백업
cp -r ~/project/my_app ~/project/my_app.backup

# 2. my_app 폴더 비우기
rm -rf ~/project/my_app/*

# 3. 다운로드한 파일 복사
cp -r ~/Downloads/ml-ids-project/* ~/project/my_app/
```

### 4.2 방법 B: Git 클론 (고급)

```bash
# 임시 폴더에 클론
git clone https://github.com/your-username/ml-ids-project.git /tmp/ml-ids-temp

# 파일 복사
cp -r /tmp/ml-ids-temp/* ~/project/my_app/

# 정리
rm -rf /tmp/ml-ids-temp
```

---

## 🔧 Step 5: 로컬 환경 설정

### 5.1 my_app 폴더로 이동
```bash
cd ~/project/my_app
```

### 5.2 Git 초기화 (my_app이 별도 저장소인 경우)

**만약 my_app이 독립적인 저장소라면:**
```bash
git init
git add .
git commit -m "Initial commit: ML-IDS 캡스톤 프로젝트"
git branch -M main
git remote add origin https://github.com/your-username/my_app.git
git push -u origin main
```

**만약 my_app이 project의 하위 폴더라면:**
```bash
cd ~/project
git add my_app/
git commit -m "feat: ML-IDS 캡스톤 프로젝트 추가"
git push origin main
```

### 5.3 .env.local 파일 생성
```bash
cd ~/project/my_app
cat > .env.local << 'EOF'
# 데이터베이스
DATABASE_URL="mysql://root:password@localhost:3306/ml_ids"

# 인증
JWT_SECRET="your-super-secret-jwt-key-12345678"

# OAuth (선택사항)
VITE_APP_ID="your-app-id"
OAUTH_SERVER_URL="https://api.manus.im"
VITE_OAUTH_PORTAL_URL="https://manus.im/login"

# OpenAI (선택사항)
OPENAI_API_KEY="sk-..."
EOF
```

### 5.4 의존성 설치
```bash
# Node.js 의존성
pnpm install

# Python 의존성
python -m venv venv
source venv/bin/activate  # macOS/Linux
# 또는
venv\Scripts\activate     # Windows

pip install scikit-learn pandas numpy tensorflow
```

### 5.5 데이터베이스 마이그레이션
```bash
pnpm db:push
```

---

## 🚀 Step 6: 개발 서버 실행

### 6.1 서버 시작
```bash
cd ~/project/my_app
pnpm dev
```

**예상 출력:**
```
> ml-ids-project@1.0.0 dev
> NODE_ENV=development tsx watch server/_core/index.ts

[OAuth] Initialized with baseURL: https://api.manus.im
Server running on http://localhost:3000/
```

### 6.2 브라우저에서 접속
```
http://localhost:3000
```

---

## 📤 Step 7: GitHub에 푸시

### 7.1 상태 확인
```bash
cd ~/project
git status
```

### 7.2 변경사항 커밋
```bash
git add .
git commit -m "feat: ML-IDS 캡스톤 프로젝트 추가

- React 프론트엔드 (5개 페이지)
- Node.js 백엔드 (tRPC API)
- Python ML 엔진
- 데이터베이스 스키마 (7개 테이블)
- 학술 논문 및 기술 문서"
```

### 7.3 GitHub에 푸시
```bash
git push origin main
```

---

## ✅ Step 8: 검증

### 8.1 GitHub에서 확인
1. GitHub 로그인
2. `my_app` 또는 `project` 저장소 접속
3. 모든 파일이 업로드되었는지 확인

### 8.2 로컬에서 테스트
```bash
cd ~/project/my_app

# 테스트 실행
pnpm test

# 빌드 확인
pnpm build
```

---

## 🔄 Step 9: 다른 컴퓨터에서 클론하기

다른 노트북에서 프로젝트를 받으려면:

```bash
# 저장소 클론
git clone https://github.com/your-username/project.git
cd project/my_app

# 의존성 설치
pnpm install

# Python 환경 설정
python -m venv venv
source venv/bin/activate
pip install scikit-learn pandas numpy tensorflow

# 환경 변수 설정
cat > .env.local << 'EOF'
DATABASE_URL="mysql://root:password@localhost:3306/ml_ids"
JWT_SECRET="your-secret-key"
EOF

# 데이터베이스 마이그레이션
pnpm db:push

# 서버 실행
pnpm dev
```

---

## 📋 커밋 메시지 가이드

### 좋은 커밋 메시지 예시
```
feat: 실시간 모니터링 대시보드 추가
- Recharts를 사용한 시계열 차트
- 지도 시각화 (Google Maps)
- 공격 유형별 분석

fix: 데이터베이스 연결 오류 해결

docs: SETUP_GUIDE.md 업데이트

test: 모니터링 페이지 테스트 추가
```

### 커밋 메시지 형식
```
<type>: <subject>

<body>

<footer>
```

**Type 종류:**
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 스타일 변경 (기능 없음)
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가
- `chore`: 빌드, 의존성 등

---

## 🐛 문제 해결

### 문제 1: "fatal: not a git repository"
```bash
cd ~/project
git status
```

### 문제 2: "Permission denied (publickey)"
```bash
# SSH 키 생성 및 GitHub에 등록
ssh-keygen -t ed25519 -C "your-email@example.com"
cat ~/.ssh/id_ed25519.pub  # 복사 후 GitHub Settings에 등록
```

### 문제 3: "Merge conflict"
```bash
# 충돌 파일 확인
git status

# 충돌 해결 후
git add .
git commit -m "Resolve merge conflicts"
git push origin main
```

### 문제 4: "pnpm: command not found"
```bash
npm install -g pnpm
```

### 문제 5: "DATABASE_URL not found"
- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- 파일명이 정확한지 확인 (`.env.local`, `.env` 아님)

---

## 📊 파일 구조 최종 확인

```
~/project/
├── .git/                      # Git 저장소
├── my_app/                    # ML-IDS 프로젝트
│   ├── client/                # React 프론트엔드
│   ├── server/                # Node.js 백엔드
│   ├── drizzle/               # 데이터베이스
│   ├── package.json
│   ├── .env.local             # 로컬 환경 변수 (Git 무시)
│   ├── node_modules/          # 의존성 (Git 무시)
│   └── 문서 파일들
├── .git/
├── .gitignore
└── README.md
```

---

## 🎯 다음 단계

1. ✅ GitHub에 프로젝트 업로드
2. ✅ 로컬 노트북에서 실행 확인
3. 📊 실제 데이터셋 업로드 및 모델 훈련
4. 📝 논문 최종 작성
5. 🚀 Manus 플랫폼에 배포
6. 📤 GitHub, Notion, Discord에 제출

---

## 💡 팁

### 빠른 커밋 명령어
```bash
# 모든 변경사항 스테이징 및 커밋
git add .
git commit -m "your message"
git push

# 한 줄로
git add . && git commit -m "your message" && git push
```

### 최근 커밋 수정
```bash
# 마지막 커밋 메시지 수정
git commit --amend -m "new message"

# 마지막 커밋에 파일 추가
git add forgotten_file.txt
git commit --amend --no-edit
```

### 커밋 히스토리 확인
```bash
git log --oneline -10
```

---

## 📞 추가 도움말

- **Git 공식 문서**: https://git-scm.com/doc
- **GitHub 가이드**: https://docs.github.com/
- **pnpm 문서**: https://pnpm.io/

---

**마지막 업데이트**: 2026-02-23  
**가이드 버전**: 1.0  
**상태**: ✅ 준비 완료
