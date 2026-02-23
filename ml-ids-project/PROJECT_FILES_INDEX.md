# ML-IDS 캡스톤 디자인 프로젝트 - 전체 파일 인덱스

## 📁 프로젝트 구조

```
ml-ids-project/
├── client/                          # 프론트엔드 (React + TypeScript)
│   ├── src/
│   │   ├── pages/                  # 페이지 컴포넌트
│   │   │   ├── Home.tsx            # 메인 대시보드
│   │   │   ├── Datasets.tsx        # 데이터셋 관리
│   │   │   ├── Models.tsx          # 모델 관리
│   │   │   ├── Alerts.tsx          # 위협 알림
│   │   │   ├── Monitoring.tsx      # 실시간 모니터링 (시계열 + 지도)
│   │   │   └── Monitoring.test.ts  # 모니터링 페이지 테스트
│   │   ├── components/             # 재사용 가능한 컴포넌트
│   │   ├── contexts/               # React Context
│   │   ├── hooks/                  # Custom Hooks
│   │   ├── lib/                    # 유틸리티 함수
│   │   ├── App.tsx                 # 메인 라우터
│   │   ├── main.tsx                # 진입점
│   │   └── index.css               # 글로벌 스타일 (타이포그래픽 브루탈리즘)
│   ├── public/                     # 정적 자산
│   └── index.html                  # HTML 템플릿
├── server/                          # 백엔드 (Node.js + Express + tRPC)
│   ├── routers.ts                  # tRPC 라우터 (API 엔드포인트)
│   ├── db.ts                       # 데이터베이스 쿼리 함수
│   ├── ml_engine.py                # 머신러닝 엔진 (Python)
│   ├── ml_utils.ts                 # ML 엔진 통합 유틸리티
│   ├── realtime_analyzer.ts        # 실시간 트래픽 분석
│   ├── llm_analyzer.ts             # LLM 기반 공격 분석
│   ├── auth.logout.test.ts         # 인증 테스트
│   └── _core/                      # 프레임워크 핵심 (수정 금지)
├── drizzle/                         # 데이터베이스 (Drizzle ORM)
│   ├── schema.ts                   # 데이터베이스 스키마
│   └── migrations/                 # 마이그레이션 파일
├── shared/                          # 공유 상수 및 타입
├── storage/                         # S3 파일 저장소 헬퍼
├── DESIGN.md                        # 프로젝트 설계 문서
├── THESIS.md                        # 학술 논문 초안
├── TECHNICAL_DOCUMENTATION.md       # 기술 문서
├── PRIVACY.md                       # 개인정보 보호정책
├── TERMS.md                         # 이용약관
├── todo.md                          # 프로젝트 진행 상황
├── package.json                     # 프로젝트 의존성
└── README.md                        # 프로젝트 소개

```

---

## 📄 핵심 파일 설명

### 프론트엔드 페이지 (client/src/pages/)

#### 1. **Home.tsx** - 메인 대시보드
- 인증되지 않은 사용자: 랜딩 페이지 (히어로, 기능 소개, 기술 스택)
- 인증된 사용자: 대시보드 (통계, 빠른 액션, 최근 활동)
- 타이포그래픽 브루탈리즘 스타일 적용

#### 2. **Datasets.tsx** - 데이터셋 관리
- 데이터셋 업로드 폼
- 업로드된 데이터셋 목록 조회
- 데이터셋 삭제 기능
- 메타데이터 표시 (타입, 레코드 수, 특징 수, 파일 크기)

#### 3. **Models.tsx** - 모델 관리
- 새 모델 생성 섹션
- 활성 모델 강조 표시
- 모델 성능 지표 (정확도, 정밀도, 재현율, F1-Score, AUC)
- 모델 활성화 기능

#### 4. **Alerts.tsx** - 위협 알림
- 알림 통계 (미해결, 심각, 높음, 전체)
- 탐지된 위협 목록
- 심각도별 색상 구분 (CRITICAL, HIGH, MEDIUM, LOW)
- 알림 해결 표시 기능

#### 5. **Monitoring.tsx** - 실시간 모니터링 (신규)
- **시계열 차트**: 시간대별 공격 탐지 수, 위협 수준
- **지도 시각화**: 공격 출발지 분포, 국가별 공격 통계
- **공격 유형 분석**: DDoS, Port Scanning, SQL Injection 등
- **최근 탐지 사항**: 실시간 알림
- **통계 카드**: 총 탐지 공격, 정확도, 응답 시간, 활성 모델

### 백엔드 API (server/)

#### 1. **routers.ts** - tRPC API 라우터
- Dataset Router (create, list, getById, delete)
- Model Router (create, list, getById, getActive, activate)
- Experiment Router (create, list, getById, getByModel, updateResults)
- Alert Router (create, list, getUnresolved, getById, resolve)
- TrafficLog Router (create, list, getById)
- FeatureEngineering Router (create, list, getByDataset)

#### 2. **db.ts** - 데이터베이스 쿼리 함수
- 모든 테이블에 대한 CRUD 작업
- 사용자별 데이터 필터링
- 관계 기반 쿼리

#### 3. **ml_engine.py** - 머신러닝 엔진
- 데이터 전처리 (결측치 처리, 범주형 인코딩, 정규화)
- 다양한 알고리즘 학습 (Random Forest, SVM, Neural Network)
- 모델 평가 (정확도, 정밀도, 재현율, F1-Score, AUC)
- 실시간 예측

#### 4. **ml_utils.ts** - ML 엔진 통합
- trainModel(): 모델 학습 실행
- predictTraffic(): 실시간 트래픽 예측
- analyzeDataset(): 데이터셋 통계 분석
- analyzeFeatureImportance(): 특징 중요도 분석
- batchPredict(): 배치 예측

#### 5. **realtime_analyzer.ts** - 실시간 트래픽 분석
- analyzeTraffic(): 개별 트래픽 분석 및 공격 분류
- classifyAttack(): 공격 유형 자동 분류 (5가지 유형)
- generateStatistics(): 실시간 통계 생성
- analyzeTrafficPatterns(): 시계열 패턴 분석

#### 6. **llm_analyzer.ts** - LLM 기반 공격 분석
- analyzeAttackWithLLM(): OpenAI를 사용한 공격 상세 분석
- generateSecurityReport(): 일일 보안 보고서 자동 생성
- generateThreatIntelligence(): 위협 인텔리전스 요약

### 데이터베이스 스키마 (drizzle/schema.ts)

#### 테이블 구조
1. **users** - 사용자 정보 및 인증
2. **datasets** - 네트워크 트래픽 데이터셋 메타데이터
3. **models** - 머신러닝 모델 정보
4. **experiments** - 모델 학습 실험 결과
5. **alerts** - 탐지된 침입 위협 알림
6. **trafficLogs** - 실시간 네트워크 트래픽 로그
7. **featureEngineering** - 특징 추출 및 전처리 기록

### 스타일 및 디자인 (client/src/index.css)

#### 타이포그래픽 브루탈리즘 특징
- 순백색 배경 (#FFFFFF)
- 극명한 검은색 텍스트 (#000000)
- 초대형 헤비웨이트 산세리프 (Inter, Helvetica)
- 굵은 기하학적 선 (4px 보더)
- 고대비 비대칭 레이아웃
- 풍부한 여백 (공백 활용)
- 투박하고 가공되지 않은 산업적 분위기

### 문서 (프로젝트 루트)

#### 1. **DESIGN.md** - 프로젝트 설계 문서
- 프로젝트 개요 및 시스템 아키텍처
- 데이터베이스 스키마 설계
- 10가지 필수 기능 명세
- 기술 스택 요약

#### 2. **THESIS.md** - 학술 논문 초안
- 서론 (연구 배경, 목표)
- 관련 연구 (IDS, 머신러닝, 공개 데이터셋)
- 시스템 설계 (아키텍처, DB 스키마, ML 파이프라인)
- 구현 (개발 환경, 주요 구현 내용)
- 실험 및 결과 (실험 설정, 성능 비교, 결과 분석)
- 결론 (연구 성과, 기여도, 향후 연구)
- 참고문헌

#### 3. **TECHNICAL_DOCUMENTATION.md** - 기술 문서
- 프로젝트 개요 및 주요 기능
- 상세 시스템 아키텍처
- 기술 스택 상세 설명
- 데이터베이스 설계
- 백엔드 API 구현
- 머신러닝 엔진
- 프론트엔드 구현
- 실시간 분석 시스템
- LLM 통합
- 배포 및 운영

#### 4. **PRIVACY.md** - 개인정보 보호정책
- 개인정보 수집 및 사용
- 데이터 보호 방침
- 사용자 권리

#### 5. **TERMS.md** - 이용약관
- 서비스 이용 조건
- 책임 제한
- 지적재산권

#### 6. **todo.md** - 프로젝트 진행 상황
- Phase별 완료 항목 체크리스트
- 8개 Phase 모두 완료 또는 진행 중

---

## 🔧 기술 스택

| 계층 | 기술 |
|:---|:---|
| **프론트엔드** | React 19, TypeScript, Tailwind CSS 4, Recharts, shadcn/ui |
| **백엔드** | Node.js, Express 4, tRPC 11, TypeScript |
| **데이터베이스** | MySQL/TiDB, Drizzle ORM |
| **머신러닝** | Python 3.11, scikit-learn, pandas, numpy |
| **LLM** | OpenAI API (GPT-4) |
| **인증** | Manus OAuth |
| **파일 저장** | AWS S3 |
| **테스트** | Vitest |
| **빌드** | Vite, esbuild |

---

## 📊 구현된 기능 요약

### ✅ 완료된 기능 (8개 Phase)

**Phase 1: 프로젝트 설계**
- ✅ 상세 요구사항 정의서 작성
- ✅ 시스템 아키텍처 설계
- ✅ 기술 스택 선정

**Phase 2: 데이터베이스 설계**
- ✅ Drizzle ORM 스키마 정의 (7개 테이블)
- ✅ 데이터베이스 마이그레이션 완료

**Phase 3: 백엔드 API 구현**
- ✅ 6개 tRPC 라우터 구현 (30+ API 엔드포인트)
- ✅ 데이터베이스 쿼리 함수 구현

**Phase 4: 프론트엔드 UI 구현**
- ✅ 타이포그래픽 브루탈리즘 스타일 적용
- ✅ 5개 페이지 구현 (Home, Datasets, Models, Alerts, Monitoring)

**Phase 5: 머신러닝 모델 통합**
- ✅ Python 기반 ML 엔진 구현
- ✅ 실시간 트래픽 분석 및 예측
- ✅ 공격 유형 자동 분류 (5가지)
- ✅ LLM 기반 공격 분석 및 보고서 생성

**Phase 6: 논문 및 기술 문서**
- ✅ 학술 논문 초안 작성
- ✅ 상세 기술 문서 작성

**Phase 7: 노션 증빙 자료**
- ✅ 노션 페이지 6개 생성 (설계, 기술, 개요, 일정, 팀, 리소스)

**Phase 8: 실시간 모니터링 고도화**
- ✅ 시계열 차트 구현 (Recharts)
- ✅ 지도 시각화 구현
- ✅ 공격 유형별 분석 차트
- ✅ 단위 테스트 작성 및 검증

---

## 🚀 배포 및 실행

### 개발 환경 실행
```bash
cd /home/ubuntu/ml-ids-project
pnpm install
pnpm dev
```

### 테스트 실행
```bash
pnpm test
```

### 빌드
```bash
pnpm build
pnpm start
```

---

## 📝 노션 페이지 구조

```
ML-IDS Capstone (부모 페이지)
├── 설계 문서 (Design Document)
├── 기술 문서 (Technical Documentation)
├── 프로젝트 개요
├── 개발 일정
├── 팀 정보
└── 리소스 및 참고자료
```

---

## 🎯 최종 결과물

- ✅ 완전히 작동하는 ML-IDS 웹 애플리케이션
- ✅ 학술 논문 및 기술 문서
- ✅ 노션 프로젝트 관리 페이지
- ✅ GitHub 저장소 준비 완료
- ✅ 체크포인트: `a33e24bb` (최신)

---

**프로젝트 버전**: 1.0.0  
**마지막 업데이트**: 2026-02-22  
**상태**: ✅ 완성 및 배포 준비 완료
