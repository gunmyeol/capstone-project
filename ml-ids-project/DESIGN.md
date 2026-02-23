# ML-based Network Intrusion Detection System (IDS) - 설계 문서

## 1. 프로젝트 개요

본 프로젝트는 머신러닝 기술을 활용하여 네트워크 트래픽의 비정상적인 접근 패턴을 자동으로 탐지하는 웹 기반 침입 탐지 시스템(Intrusion Detection System, IDS)입니다. 사이버 보안 전문가와 데이터 과학자가 협력하여 네트워크 위협을 분석하고 대응할 수 있는 통합 플랫폼을 제공합니다.

---

## 2. 시스템 아키텍처

### 2.1 전체 아키텍처 다이어그램

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React 19)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Dashboard | Data Upload | Model Training | Analytics │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    tRPC API Gateway
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  Backend (Express + Node.js)                  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Data Processing | ML Model Training | Real-time Analysis│  │
│  │ LLM Integration | Alert System                         │  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              Database (MySQL/TiDB)                            │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Users | Datasets | Models | Experiments | Alerts      │  │
│  │ Logs | TrafficData | PredictionResults                │  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 주요 컴포넌트

| 컴포넌트 | 설명 | 기술 스택 |
| :--- | :--- | :--- |
| **Frontend** | 사용자 인터페이스 및 데이터 시각화 | React 19, Tailwind CSS 4, Recharts |
| **Backend** | 데이터 처리, 모델 학습, API 제공 | Express.js, Node.js, tRPC |
| **ML Pipeline** | 데이터 전처리, 모델 학습, 예측 | Python (scikit-learn, TensorFlow) |
| **Database** | 데이터 저장 및 관리 | MySQL/TiDB, Drizzle ORM |
| **LLM Integration** | 공격 패턴 분석 및 보고서 생성 | OpenAI API |
| **Notification** | 실시간 알림 | Manus Built-in Notification API |

---

## 3. 데이터베이스 스키마

### 3.1 주요 테이블 설계

#### Users 테이블 (기존)
사용자 인증 정보 및 프로필 관리

#### Datasets 테이블
업로드된 네트워크 트래픽 데이터셋 메타데이터 저장

```sql
CREATE TABLE datasets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  datasetType ENUM('NSL-KDD', 'CICIDS2017', 'UNSW-NB15', 'CUSTOM'),
  fileKey VARCHAR(255) NOT NULL,  -- S3 file reference
  fileSize INT,
  recordCount INT,
  features JSON,  -- List of feature names
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

#### Models 테이블
학습된 머신러닝 모델 저장

```sql
CREATE TABLE models (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  datasetId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  modelType ENUM('RandomForest', 'SVM', 'NeuralNetwork', 'GradientBoosting'),
  modelPath VARCHAR(255),  -- S3 path to serialized model
  hyperparameters JSON,
  trainingAccuracy DECIMAL(5,4),
  testAccuracy DECIMAL(5,4),
  precision DECIMAL(5,4),
  recall DECIMAL(5,4),
  f1Score DECIMAL(5,4),
  trainingTime INT,  -- in seconds
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (datasetId) REFERENCES datasets(id)
);
```

#### Experiments 테이블
모델 학습 실험 기록

```sql
CREATE TABLE experiments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  datasetId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  modelIds JSON,  -- Array of model IDs used in experiment
  parameters JSON,  -- Experiment parameters
  results JSON,  -- Experiment results
  status ENUM('pending', 'running', 'completed', 'failed'),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completedAt TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (datasetId) REFERENCES datasets(id)
);
```

#### Alerts 테이블
탐지된 침입 위협 기록

```sql
CREATE TABLE alerts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  modelId INT NOT NULL,
  threatType ENUM('DDoS', 'SQLInjection', 'PortScanning', 'Anomaly', 'Unknown'),
  severity ENUM('Low', 'Medium', 'High', 'Critical'),
  sourceIP VARCHAR(45),
  destinationIP VARCHAR(45),
  trafficData JSON,  -- Original traffic features
  predictionConfidence DECIMAL(5,4),
  reportGenerated BOOLEAN DEFAULT FALSE,
  reportContent TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (modelId) REFERENCES models(id)
);
```

#### TrafficLogs 테이블
실시간 네트워크 트래픽 로그

```sql
CREATE TABLE trafficLogs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  sourceIP VARCHAR(45),
  destinationIP VARCHAR(45),
  sourcePort INT,
  destinationPort INT,
  protocol VARCHAR(10),
  packetSize INT,
  duration INT,
  features JSON,  -- Extracted features
  label VARCHAR(50),  -- Attack type or 'Normal'
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

---

## 4. 기능 명세

### 4.1 핵심 기능

#### 1. 데이터셋 관리
- NSL-KDD, CICIDS2017, UNSW-NB15 등 공개 데이터셋 지원
- CSV/JSON 형식의 사용자 정의 데이터셋 업로드
- 데이터 전처리 (정규화, 결측치 처리, 특징 추출)
- 데이터셋 통계 및 분포 시각화

#### 2. 모델 학습 및 평가
- Random Forest, SVM, Neural Network 등 다양한 알고리즘 지원
- 하이퍼파라미터 조정 및 그리드 서치 기능
- K-fold 교차 검증
- 성능 지표 계산 (정확도, 정밀도, 재현율, F1-score, ROC-AUC)
- 모델 저장 및 버전 관리

#### 3. 실시간 트래픽 분석
- 네트워크 트래픽 실시간 수집 및 분석
- 학습된 모델을 이용한 실시간 예측
- 이상 행위 탐지 및 분류
- 탐지 결과 실시간 대시보드 표시

#### 4. 공격 유형 분류
- DDoS 공격 탐지
- SQL Injection 탐지
- Port Scanning 탐지
- 기타 비정상 행위 탐지
- 공격 심각도 평가 (Low, Medium, High, Critical)

#### 5. 시각화 및 분석
- 네트워크 트래픽 시계열 차트
- 공격 유형별 분포 파이 차트
- 모델 성능 비교 바 차트
- Confusion Matrix 시각화
- ROC Curve 및 AUC 시각화
- 특징 중요도(Feature Importance) 시각화

#### 6. 알림 및 보고서
- 침입 탐지 시 프로젝트 소유자에게 실시간 알림
- LLM을 활용한 자동 보고서 생성
- 공격 패턴 분석 및 대응 방안 제시
- 이메일 및 인앱 알림 지원

---

## 5. 프론트엔드 디자인 가이드

### 5.1 타이포그래픽 브루탈리즘 스타일

**색상 팔레트**
- 배경: 순백색 (#FFFFFF)
- 텍스트: 극명한 검은색 (#000000)
- 강조: 진한 회색 (#1A1A1A)
- 경고/위험: 진한 빨강 (#D32F2F)

**타이포그래피**
- 주 폰트: 헤비웨이트 산세리프 (예: Inter Bold, Helvetica Neue Bold)
- 제목: 초대형 (48px 이상)
- 부제목: 대형 (24px 이상)
- 본문: 중형 (16px)

**레이아웃 원칙**
- 고대비 비대칭 구조
- 굵은 기하학적 선 (브래킷, 밑줄)
- 초대형 텍스트 주변 풍부한 여백
- 투박하고 가공되지 않은 산업적 분위기
- 단순함과 스케일을 통한 강렬한 주목

### 5.2 페이지 구조

| 페이지 | 설명 |
| :--- | :--- |
| **Dashboard** | 실시간 트래픽 분석, 최근 위협, 모델 상태 표시 |
| **Datasets** | 데이터셋 업로드, 관리, 전처리 |
| **Models** | 모델 학습, 평가, 비교 |
| **Analytics** | 공격 유형별 분석, 시각화 |
| **Alerts** | 탐지된 위협 로그, 필터링, 상세 정보 |
| **Reports** | LLM 기반 자동 보고서, 다운로드 |
| **Settings** | 사용자 설정, 알림 설정 |

---

## 6. 백엔드 API 설계

### 6.1 주요 tRPC 프로시저

#### Dataset Management
- `datasets.upload()` - 데이터셋 업로드
- `datasets.list()` - 사용자 데이터셋 목록 조회
- `datasets.preprocess()` - 데이터 전처리 실행
- `datasets.getStatistics()` - 데이터셋 통계 조회

#### Model Training
- `models.train()` - 모델 학습 시작
- `models.list()` - 학습된 모델 목록 조회
- `models.evaluate()` - 모델 성능 평가
- `models.predict()` - 실시간 예측

#### Traffic Analysis
- `traffic.analyze()` - 트래픽 분석
- `traffic.detectAnomalies()` - 이상 행위 탐지
- `traffic.getHistory()` - 트래픽 히스토리 조회

#### Alerts & Reports
- `alerts.list()` - 알림 목록 조회
- `alerts.getDetail()` - 알림 상세 정보
- `reports.generate()` - LLM 기반 보고서 생성
- `reports.list()` - 생성된 보고서 목록

---

## 7. 머신러닝 모델 파이프라인

### 7.1 데이터 전처리
1. 결측치 처리 (평균값 대체 또는 제거)
2. 범주형 데이터 인코딩 (One-hot encoding)
3. 특징 정규화 (StandardScaler 또는 MinMaxScaler)
4. 특징 선택 (상관관계 분석, 특징 중요도)

### 7.2 모델 학습
1. 데이터 분할 (Train 70%, Test 30%)
2. K-fold 교차 검증 (k=5)
3. 하이퍼파라미터 튜닝 (Grid Search)
4. 모델 학습 및 저장

### 7.3 성능 평가
- 정확도 (Accuracy)
- 정밀도 (Precision)
- 재현율 (Recall)
- F1-score
- ROC-AUC

---

## 8. 기술 스택 요약

| 계층 | 기술 |
| :--- | :--- |
| **Frontend** | React 19, Tailwind CSS 4, Recharts, Shadcn/UI |
| **Backend** | Express.js, Node.js, tRPC 11 |
| **Database** | MySQL/TiDB, Drizzle ORM |
| **ML** | Python, scikit-learn, TensorFlow, Pandas, NumPy |
| **LLM** | OpenAI API (GPT-4) |
| **Storage** | AWS S3 |
| **Testing** | Vitest |
| **Deployment** | Manus Hosting |

---

## 9. 개발 일정 (예상)

| 단계 | 기간 | 주요 작업 |
| :--- | :--- | :--- |
| **설계** | 1주 | 요구사항 분석, 아키텍처 설계, DB 스키마 |
| **백엔드** | 2주 | API 구현, 데이터 처리, 모델 학습 |
| **프론트엔드** | 2주 | UI 구현, 데이터 시각화, 통합 |
| **테스트** | 1주 | 단위 테스트, 통합 테스트, 성능 테스트 |
| **문서화** | 1주 | 논문 작성, README, 사용 설명서 |

---

## 10. 성공 기준

1. **기능 완성도**: 10개 필수 기능 100% 구현
2. **모델 성능**: 테스트 정확도 90% 이상
3. **사용자 경험**: 직관적인 UI, 반응 시간 < 2초
4. **안정성**: 버그 없는 안정적인 운영
5. **문서화**: 완전한 기술 문서 및 논문 작성

---

## 11. 참고 자료

- NSL-KDD Dataset: https://www.unb.ca/cic/datasets/nsl.html
- CICIDS2017 Dataset: https://www.unb.ca/cic/datasets/ids-2017.html
- scikit-learn Documentation: https://scikit-learn.org/
- TensorFlow Documentation: https://www.tensorflow.org/
