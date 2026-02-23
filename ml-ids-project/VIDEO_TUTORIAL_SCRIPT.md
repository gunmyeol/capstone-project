# ML-IDS 프로젝트 설치 및 실행 비디오 튜토리얼 스크립트

## 📹 비디오 튜토리얼 제작 가이드

이 스크립트를 사용하여 OBS Studio, Camtasia, ScreenFlow 등의 화면 녹화 도구로 비디오 튜토리얼을 만들 수 있습니다.

---

## 🎬 Scene 1: 오프닝 (0:00 - 0:30)

### 화면 구성
- 배경: 검은색 또는 프로젝트 로고
- 텍스트: "ML-IDS 캡스톤 디자인 프로젝트"
- 자막: "로컬 환경에서 설치 및 실행하기"

### 나레이션 스크립트
```
안녕하세요! 이 튜토리얼에서는 ML-IDS 캡스톤 디자인 프로젝트를 
로컬 노트북에서 설치하고 실행하는 방법을 단계별로 보여드리겠습니다.

약 15분이 소요되며, 모든 필수 설정을 포함하고 있습니다.
시작해 볼까요?
```

---

## 🎬 Scene 2: 시스템 요구사항 확인 (0:30 - 2:00)

### 화면 구성
- 터미널 또는 PowerShell 열기
- 각 프로그램 버전 확인 명령어 실행

### 나레이션 스크립트
```
먼저 시스템에 필요한 프로그램들이 설치되어 있는지 확인하겠습니다.

필요한 프로그램:
1. Node.js (v18 이상)
2. Python (v3.8 이상)
3. Git
4. pnpm (Node.js 패키지 관리자)
```

### 실행할 명령어
```bash
# Node.js 버전 확인
node --version

# Python 버전 확인
python --version

# Git 버전 확인
git --version

# pnpm 설치 (설치되지 않은 경우)
npm install -g pnpm
```

### 예상 출력
```
v18.17.0
Python 3.11.0
git version 2.40.0
pnpm 8.0.0
```

---

## 🎬 Scene 3: 프로젝트 다운로드 (2:00 - 4:00)

### 화면 구성
- 터미널에서 GitHub 클론 명령어 실행
- 프로젝트 폴더 구조 표시

### 나레이션 스크립트
```
이제 GitHub에서 프로젝트를 다운로드하겠습니다.

두 가지 방법이 있습니다:
1. GitHub 클론 (권장) - 버전 관리 포함
2. ZIP 다운로드 - 간단하지만 Git 없음

GitHub 클론을 사용하겠습니다.
```

### 실행할 명령어
```bash
# GitHub에서 클론
git clone https://github.com/[your-username]/ml-ids-project.git
cd ml-ids-project

# 프로젝트 구조 확인
ls -la
```

### 화면 표시
- 프로젝트 폴더 구조:
  ```
  ml-ids-project/
  ├── client/           (프론트엔드)
  ├── server/           (백엔드)
  ├── drizzle/          (데이터베이스)
  ├── ml/               (머신러닝)
  ├── package.json
  └── SETUP_GUIDE.md
  ```

---

## 🎬 Scene 4: Node.js 의존성 설치 (4:00 - 6:00)

### 화면 구성
- 터미널에서 pnpm install 실행
- 설치 진행 상황 표시

### 나레이션 스크립트
```
다음으로 Node.js 의존성을 설치하겠습니다.

이 프로젝트는 pnpm을 사용합니다.
npm보다 빠르고 디스크 공간을 절약합니다.

설치에는 약 2-3분이 소요됩니다.
```

### 실행할 명령어
```bash
pnpm install
```

### 예상 출력
```
Packages: +450
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Progress: resolved 450, reused 440, downloaded 10, added 450, done
```

---

## 🎬 Scene 5: Python 의존성 설치 (6:00 - 8:30)

### 화면 구성
- 터미널에서 Python 가상 환경 생성
- pip install 실행

### 나레이션 스크립트
```
이제 Python 머신러닝 엔진을 위한 의존성을 설치하겠습니다.

먼저 Python 가상 환경을 생성합니다.
이렇게 하면 프로젝트별로 독립적인 Python 환경을 유지할 수 있습니다.
```

### 실행할 명령어

#### Windows
```bash
# 가상 환경 생성
python -m venv venv

# 가상 환경 활성화
venv\Scripts\activate

# Python 패키지 설치
pip install scikit-learn pandas numpy tensorflow
```

#### macOS / Linux
```bash
# 가상 환경 생성
python3 -m venv venv

# 가상 환경 활성화
source venv/bin/activate

# Python 패키지 설치
pip install scikit-learn pandas numpy tensorflow
```

### 예상 출력
```
Successfully installed scikit-learn-1.3.0 pandas-2.0.3 numpy-1.24.3 tensorflow-2.13.0
```

---

## 🎬 Scene 6: 환경 변수 설정 (8:30 - 10:00)

### 화면 구성
- 텍스트 에디터 (VS Code) 열기
- .env.local 파일 생성 및 편집

### 나레이션 스크립트
```
다음으로 환경 변수를 설정하겠습니다.

프로젝트 루트에 .env.local 파일을 생성합니다.
이 파일에는 데이터베이스 연결 정보와 보안 키가 포함됩니다.

주의: .env.local 파일은 절대 GitHub에 커밋하지 마세요!
```

### 실행할 명령어
```bash
# VS Code에서 프로젝트 열기
code .
```

### .env.local 파일 내용
```env
# 데이터베이스 (로컬 MySQL)
DATABASE_URL="mysql://root:password@localhost:3306/ml_ids"

# 인증 (보안 키)
JWT_SECRET="your-super-secret-jwt-key-12345678"

# OAuth (선택사항)
VITE_APP_ID="your-app-id"
OAUTH_SERVER_URL="https://api.manus.im"
VITE_OAUTH_PORTAL_URL="https://manus.im/login"

# OpenAI (선택사항)
OPENAI_API_KEY="sk-..."
```

### 화면 표시
- VS Code 편집기에서 파일 생성 과정
- 파일 저장 확인

---

## 🎬 Scene 7: 데이터베이스 마이그레이션 (10:00 - 11:30)

### 화면 구성
- 터미널에서 pnpm db:push 실행
- 데이터베이스 스키마 생성 과정

### 나레이션 스크립트
```
이제 데이터베이스를 설정하겠습니다.

pnpm db:push 명령어는:
1. Drizzle 스키마를 읽고
2. 데이터베이스 테이블을 생성하고
3. 마이그레이션 파일을 생성합니다

이 프로젝트는 7개의 테이블을 사용합니다:
- users (사용자)
- datasets (데이터셋)
- models (머신러닝 모델)
- experiments (실험)
- alerts (보안 경고)
- trafficLogs (트래픽 로그)
- featureEngineering (특성 공학)
```

### 실행할 명령어
```bash
pnpm db:push
```

### 예상 출력
```
✅ Database migration successful
✅ Created 7 tables
✅ Schema synchronized
```

---

## 🎬 Scene 8: 개발 서버 시작 (11:30 - 13:00)

### 화면 구성
- 터미널에서 pnpm dev 실행
- 서버 시작 로그 표시

### 나레이션 스크립트
```
이제 개발 서버를 시작하겠습니다!

pnpm dev 명령어는:
- Node.js 백엔드 서버를 포트 3000에서 시작하고
- React 프론트엔드를 자동으로 컴파일하고
- 파일 변경 시 자동으로 리로드합니다 (Hot Module Replacement)

서버가 준비되면 http://localhost:3000으로 접속할 수 있습니다.
```

### 실행할 명령어
```bash
pnpm dev
```

### 예상 출력
```
> ml-ids-project@1.0.0 dev
> NODE_ENV=development tsx watch server/_core/index.ts

[OAuth] Initialized with baseURL: https://api.manus.im
Server running on http://localhost:3000/
```

---

## 🎬 Scene 9: 웹 애플리케이션 접속 (13:00 - 14:30)

### 화면 구성
- 브라우저 열기
- http://localhost:3000 접속
- 웹 애플리케이션 화면 표시

### 나레이션 스크립트
```
이제 브라우저에서 애플리케이션에 접속하겠습니다.

http://localhost:3000을 주소창에 입력합니다.

보이는 것:
1. ML-IDS 대시보드 홈페이지
2. 타이포그래픽 브루탈리즘 디자인
3. 네비게이션 메뉴 (Datasets, Models, Alerts, Monitoring)

로그인하면 다음 기능을 사용할 수 있습니다:
- 데이터셋 업로드
- 머신러닝 모델 훈련
- 실시간 위협 탐지
- 공격 분석 및 리포트
```

### 화면 표시
- 홈페이지 로딩
- 주요 기능 소개
- 각 페이지 클릭 시연

---

## 🎬 Scene 10: 테스트 실행 (14:30 - 15:00)

### 화면 구성
- 터미널에서 pnpm test 실행
- 테스트 결과 표시

### 나레이션 스크립트
```
마지막으로 테스트를 실행하여 모든 것이 정상 작동하는지 확인하겠습니다.

이 프로젝트는 Vitest를 사용하여 단위 테스트를 작성했습니다.
모든 테스트가 통과하면 설치가 성공적으로 완료된 것입니다.
```

### 실행할 명령어
```bash
# 다른 터미널에서 실행 (pnpm dev는 계속 실행)
pnpm test
```

### 예상 출력
```
✓ src/pages/Monitoring.test.ts (8 tests)
✓ server/routers.test.ts (12 tests)

Test Files  2 passed (2)
Tests      20 passed (20)
```

---

## 🎬 Scene 11: 마무리 (15:00 - 15:30)

### 화면 구성
- 완성된 대시보드 화면
- 요약 텍스트 표시

### 나레이션 스크립트
```
축하합니다! ML-IDS 프로젝트를 성공적으로 설치하고 실행했습니다.

이제 다음을 할 수 있습니다:

1. 데이터셋 업로드
   - NSL-KDD 또는 CICIDS2017 데이터셋 사용

2. 머신러닝 모델 훈련
   - Random Forest, SVM, Neural Network 알고리즘 선택

3. 실시간 위협 탐지
   - 네트워크 트래픽 분석 및 공격 탐지

4. 공격 분석
   - LLM 기반 자동 리포트 생성

5. 코드 수정 및 배포
   - GitHub에 커밋하고 Manus 플랫폼에 배포

더 자세한 정보는 SETUP_GUIDE.md와 TECHNICAL_DOCUMENTATION.md를 참고하세요.

감사합니다!
```

---

## 📋 비디오 제작 체크리스트

### 촬영 전 준비
- [ ] 화면 해상도: 1920x1080 (Full HD)
- [ ] 폰트 크기: 터미널 18pt 이상
- [ ] 마이크: 고품질 외부 마이크 사용
- [ ] 배경음: 조용한 환경에서 촬영
- [ ] 화면 밝기: 충분한 명도 조정

### 촬영 중
- [ ] 각 Scene마다 일시 정지하여 설명
- [ ] 명령어 실행 전에 설명
- [ ] 예상 출력 확인
- [ ] 에러 발생 시 해결 과정 보여주기
- [ ] 자막 추가 (청각 장애인 접근성)

### 편집 후
- [ ] 자막 추가 (영어 + 한국어)
- [ ] 배경음악 추가 (저작권 무료)
- [ ] 장면 전환 효과 추가
- [ ] 마우스 커서 강조 표시
- [ ] 자막 동기화 확인

---

## 🎵 추천 배경음악

- YouTube Audio Library: "Upbeat" 카테고리
- Epidemic Sound: "Technology" 카테고리
- Pixabay Music: 무료 배경음악

---

## 📊 비디오 플랫폼별 권장 설정

### YouTube
- 해상도: 1080p
- 프레임레이트: 60fps
- 비트레이트: 8-16 Mbps
- 제목: "ML-IDS 캡스톤 프로젝트 - 로컬 설치 및 실행 튜토리얼"
- 설명: SETUP_GUIDE.md 내용 포함
- 태그: #ML #IDS #머신러닝 #캡스톤 #튜토리얼

### Discord
- 해상도: 720p (파일 크기 제한)
- 길이: 15분 이내
- 포맷: MP4

### GitHub (README.md에 임베드)
```markdown
## 📹 설치 튜토리얼

[![ML-IDS 설치 튜토리얼](https://img.youtube.com/vi/VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=VIDEO_ID)

위의 비디오를 시청하여 로컬 환경에서 프로젝트를 설치하고 실행하는 방법을 배우세요.
```

---

## 🎬 화면 녹화 도구 추천

| 도구 | 가격 | 플랫폼 | 특징 |
|:---|:---|:---|:---|
| OBS Studio | 무료 | Windows/Mac/Linux | 강력한 기능, 학습곡선 있음 |
| ScreenFlow | $99 | macOS | 사용하기 쉬움, Mac 최적화 |
| Camtasia | $99.99 | Windows/Mac | 편집 기능 포함, 초보자 친화적 |
| ShareX | 무료 | Windows | 가벼움, 기본 기능 |
| QuickTime | 무료 | macOS | 기본 녹화, 편집 불가 |

---

## 💡 팁과 트릭

### 1. 터미널 설정
```bash
# 터미널 폰트 크기 증가
# macOS: Command + Plus
# Windows PowerShell: Ctrl + Plus
# Linux: Ctrl + Plus
```

### 2. 화면 정리
```bash
# 터미널 화면 정리
clear  # macOS/Linux
cls    # Windows
```

### 3. 명령어 강조
```bash
# 중요한 명령어는 천천히 입력
# 또는 미리 작성한 스크립트 사용
```

### 4. 에러 처리
```bash
# 실제 에러 발생 시 해결 과정 보여주기
# 시청자에게 도움이 됨
```

---

## 📞 추가 지원

- **문제 발생 시**: GitHub Issues에 댓글
- **질문**: Discord 커뮤니티에 질문
- **피드백**: YouTube 댓글 섹션 확인

---

**마지막 업데이트**: 2026-02-22  
**스크립트 버전**: 1.0  
**예상 비디오 길이**: 15분
