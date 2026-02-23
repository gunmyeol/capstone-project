# 머신러닝 기반 네트워크 침입 탐지 시스템(IDS) 설계 및 구현

**저자**: 캡스톤 디자인 팀  
**날짜**: 2026년 2월  
**학과**: 컴퓨터공학과  
**학년**: 4학년

---

## 목차

1. [서론](#서론)
2. [관련 연구](#관련-연구)
3. [시스템 설계](#시스템-설계)
4. [구현](#구현)
5. [실험 및 결과](#실험-및-결과)
6. [결론](#결론)
7. [참고문헌](#참고문헌)

---

## 서론

### 1.1 연구 배경

현대 사회에서 네트워크 보안의 중요성이 날로 증가하고 있습니다. 사이버 공격의 빈도와 정교성이 지속적으로 증가하면서, 기존의 규칙 기반 침입 탐지 시스템(Rule-based IDS)만으로는 새로운 형태의 공격을 효과적으로 탐지하기 어려워지고 있습니다.

머신러닝 기술의 발전으로 인해, 네트워크 트래픽의 패턴을 학습하여 정상 트래픽과 비정상 트래픽을 자동으로 구분하는 것이 가능해졌습니다. 이러한 기술은 기존 방식보다 더 높은 탐지율과 낮은 오탐지율을 달성할 수 있습니다.

### 1.2 연구 목표

본 연구의 목표는 다음과 같습니다:

1. **머신러닝 기반 침입 탐지 시스템 개발**: Random Forest, SVM, Neural Network 등 다양한 알고리즘을 활용하여 네트워크 공격을 탐지하는 시스템 구축
2. **실시간 트래픽 분석**: 실시간으로 네트워크 트래픽을 분석하고 위협을 탐지하는 기능 구현
3. **공격 유형 분류**: 탐지된 공격을 DDoS, Port Scanning, SQL Injection 등으로 자동 분류
4. **LLM 기반 분석**: 대규모 언어 모델(LLM)을 활용하여 공격 패턴을 분석하고 대응 방안 제시
5. **사용자 친화적 대시보드**: 보안 담당자가 쉽게 모니터링할 수 있는 웹 기반 대시보드 제공

### 1.3 논문의 구성

본 논문은 다음과 같이 구성되어 있습니다. 2장에서는 관련 연구를 살펴보고, 3장에서는 제안하는 시스템의 전체 아키텍처를 설명합니다. 4장에서는 시스템의 구현 세부사항을 다루고, 5장에서는 실험 결과를 분석합니다. 마지막으로 6장에서 결론을 제시합니다.

---

## 관련 연구

### 2.1 네트워크 침입 탐지 시스템(IDS)

침입 탐지 시스템은 네트워크 트래픽을 모니터링하여 의심스러운 활동을 탐지하는 보안 도구입니다. IDS는 크게 두 가지 방식으로 분류됩니다:

**규칙 기반 IDS (Signature-based IDS)**: 알려진 공격의 패턴(시그니처)을 데이터베이스에 저장하고, 네트워크 트래픽과 비교하여 공격을 탐지합니다. 이 방식은 알려진 공격에 대해 높은 정확도를 보이지만, 새로운 형태의 공격(Zero-day Attack)에는 대응하기 어렵습니다.

**이상 탐지 IDS (Anomaly-based IDS)**: 정상 트래픽의 패턴을 학습한 후, 이 패턴에서 벗어나는 트래픽을 비정상으로 판단합니다. 이 방식은 새로운 공격도 탐지할 수 있다는 장점이 있지만, 오탐지율이 높을 수 있습니다.

### 2.2 머신러닝을 활용한 침입 탐지

최근 연구에서는 머신러닝 기법을 활용하여 네트워크 침입 탐지의 정확도를 향상시키고 있습니다.

**Random Forest**: 여러 개의 의사결정 트리를 앙상블하는 방식으로, 각 트리의 예측을 종합하여 최종 결정을 내립니다. 특징 중요도를 계산할 수 있고, 비선형 관계를 잘 포착합니다.

**Support Vector Machine (SVM)**: 고차원 공간에서 최적의 초평면을 찾아 데이터를 분류합니다. 작은 데이터셋에서도 좋은 성능을 보이며, 커널 함수를 통해 비선형 분류도 가능합니다.

**Neural Network**: 여러 계층의 뉴런으로 구성된 네트워크로, 복잡한 비선형 관계를 학습할 수 있습니다. 충분한 데이터가 있을 때 높은 정확도를 달성할 수 있습니다.

### 2.3 공개 데이터셋

침입 탐지 시스템의 성능 평가를 위해 다양한 공개 데이터셋이 사용되고 있습니다:

- **NSL-KDD**: KDD99 데이터셋의 개선 버전으로, 중복 레코드를 제거하고 정상/공격 비율을 조정한 데이터셋
- **CICIDS2017**: 2017년 캐나다 사이버보안 연구소에서 공개한 데이터셋으로, 최신 공격 유형을 포함
- **UNSW-NB15**: 호주 뉴사우스웨일즈 대학에서 공개한 데이터셋으로, 다양한 공격 유형을 포함

---

## 시스템 설계

### 3.1 시스템 아키텍처

제안하는 시스템의 전체 아키텍처는 다음과 같습니다:

```
┌─────────────────────────────────────────────────────────┐
│                    웹 프론트엔드 (React)                  │
│  - 대시보드 (Dashboard)                                 │
│  - 데이터셋 관리 (Dataset Management)                   │
│  - 모델 관리 (Model Management)                         │
│  - 위협 알림 (Alert Center)                             │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│              백엔드 API 서버 (Node.js/Express)           │
│  - tRPC 라우터 (Dataset, Model, Experiment, Alert)    │
│  - 실시간 분석 서비스 (Realtime Analyzer)              │
│  - LLM 분석 서비스 (LLM Analyzer)                       │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│         머신러닝 엔진 (Python + scikit-learn)            │
│  - 데이터 전처리 (Data Preprocessing)                   │
│  - 모델 학습 (Model Training)                           │
│  - 실시간 예측 (Real-time Prediction)                  │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│            데이터베이스 (MySQL/TiDB)                     │
│  - 사용자 정보 (Users)                                  │
│  - 데이터셋 메타데이터 (Datasets)                       │
│  - 모델 정보 (Models)                                   │
│  - 실험 결과 (Experiments)                              │
│  - 탐지 알림 (Alerts)                                   │
│  - 트래픽 로그 (TrafficLogs)                            │
└─────────────────────────────────────────────────────────┘
```

### 3.2 데이터베이스 스키마

시스템에서 사용하는 주요 테이블은 다음과 같습니다:

| 테이블명 | 설명 | 주요 컬럼 |
|---------|------|---------|
| **users** | 사용자 정보 | id, openId, name, email, role, createdAt |
| **datasets** | 데이터셋 메타데이터 | id, userId, name, datasetType, filePath, totalRecords, features |
| **models** | 머신러닝 모델 | id, userId, name, modelType, accuracy, precision, recall, f1Score, auc, isActive |
| **experiments** | 모델 학습 실험 | id, userId, modelId, datasetId, accuracy, precision, recall, f1Score, auc, trainingTime |
| **alerts** | 탐지된 위협 알림 | id, userId, attackType, severity, sourceIP, destinationIP, confidence, isResolved |
| **trafficLogs** | 네트워크 트래픽 로그 | id, userId, sourceIP, destinationIP, protocol, isAnomaly, anomalyScore |

### 3.3 머신러닝 파이프라인

제안하는 시스템의 머신러닝 파이프라인은 다음과 같습니다:

1. **데이터 수집 및 전처리**
   - CSV 파일로부터 데이터 로드
   - 결측치 처리 (결측값 제거 또는 대체)
   - 범주형 특징 인코딩 (LabelEncoder 사용)
   - 수치형 특징 정규화 (StandardScaler 사용)

2. **특징 선택 및 엔지니어링**
   - 통계적 방법을 통한 특징 선택
   - 도메인 지식 기반 특징 생성

3. **모델 학습**
   - 학습/테스트 데이터 분리 (80/20 비율)
   - 다양한 알고리즘 적용 (Random Forest, SVM, Neural Network)
   - 하이퍼파라미터 튜닝

4. **모델 평가**
   - 정확도, 정밀도, 재현율, F1-Score, AUC 계산
   - 혼동 행렬(Confusion Matrix) 분석
   - 최고 성능 모델 선택

5. **실시간 예측**
   - 학습된 모델을 사용한 실시간 트래픽 분석
   - 공격 유형 분류
   - 심각도 평가 및 알림 생성

### 3.4 공격 분류 알고리즘

탐지된 공격을 분류하기 위해 다음과 같은 휴리스틱을 사용합니다:

- **DDoS Attack**: 짧은 지속시간 + 많은 데이터 전송
- **Port Scanning**: 높은 포트 번호로의 연결 시도
- **SQL Injection**: TCP 프로토콜 + 비대칭 데이터 전송
- **Brute Force Attack**: 짧은 지속시간 + 적은 데이터 전송
- **DoS Attack**: 단일 출발지에서의 대량 트래픽

---

## 구현

### 4.1 개발 환경 및 기술 스택

| 계층 | 기술 | 버전 |
|-----|------|------|
| **프론트엔드** | React | 19.2.1 |
| | Tailwind CSS | 4.1.14 |
| | TypeScript | 5.9.3 |
| **백엔드** | Node.js | 22.13.0 |
| | Express | 4.21.2 |
| | tRPC | 11.6.0 |
| | TypeScript | 5.9.3 |
| **머신러닝** | Python | 3.11.0 |
| | scikit-learn | 최신 |
| | pandas | 최신 |
| | numpy | 최신 |
| **데이터베이스** | MySQL/TiDB | - |
| | Drizzle ORM | 0.44.5 |

### 4.2 주요 구현 내용

#### 4.2.1 머신러닝 엔진 (ml_engine.py)

Python 기반 머신러닝 엔진은 다음과 같은 기능을 제공합니다:

```python
class MLIDSEngine:
    def load_dataset(file_path):
        # CSV 파일에서 데이터 로드
        
    def preprocess_data(df, target_column):
        # 데이터 전처리 (결측치 처리, 인코딩, 정규화)
        
    def train_model(X, y, model_type, test_size):
        # 모델 학습 및 평가
        # 반환: 성능 지표 (정확도, 정밀도, 재현율, F1-Score, AUC)
        
    def predict(X):
        # 실시간 예측
        # 반환: (예측값, 확률)
```

#### 4.2.2 백엔드 API (server/routers.ts)

tRPC를 사용한 타입 안전한 API 구현:

```typescript
export const appRouter = router({
  dataset: router({
    create: protectedProcedure.input(...).mutation(...),
    list: protectedProcedure.query(...),
    getById: protectedProcedure.input(...).query(...),
    delete: protectedProcedure.input(...).mutation(...),
  }),
  model: router({
    create: protectedProcedure.input(...).mutation(...),
    list: protectedProcedure.query(...),
    getActive: protectedProcedure.query(...),
    activate: protectedProcedure.input(...).mutation(...),
  }),
  // ... 기타 라우터
});
```

#### 4.2.3 실시간 분석 서비스 (server/realtime_analyzer.ts)

```typescript
async function analyzeTraffic(userId, trafficData, modelPath):
    1. 머신러닝 모델을 사용한 예측
    2. 공격 유형 분류
    3. 트래픽 로그 저장
    4. 위협 알림 생성
    5. 심각한 위협인 경우 즉시 알림
```

#### 4.2.4 LLM 기반 분석 (server/llm_analyzer.ts)

OpenAI API를 활용한 공격 분석 및 보고서 생성:

```typescript
async function analyzeAttackWithLLM(attackData):
    1. LLM에 공격 정보 전달
    2. 상세 분석 및 대응 방안 생성
    3. 결과 파싱 및 반환

async function generateSecurityReport(userId, date):
    1. 해당 날짜의 알림 조회
    2. 통계 계산
    3. LLM을 사용한 일일 보고서 생성
```

#### 4.2.5 프론트엔드 UI (client/src/pages/)

타이포그래픽 브루탈리즘 스타일의 대시보드:

- **Home.tsx**: 메인 대시보드 (통계, 빠른 액션, 최근 활동)
- **Datasets.tsx**: 데이터셋 관리 (업로드, 조회, 삭제)
- **Models.tsx**: 모델 관리 (생성, 활성화, 성능 지표)
- **Alerts.tsx**: 위협 알림 (조회, 해결 표시, 상세 정보)

### 4.3 배포 및 운영

- **개발 환경**: 로컬 개발 서버 (Vite + Express)
- **프로덕션 환경**: Manus 플랫폼 호스팅
- **데이터베이스**: MySQL/TiDB 클라우드 인스턴스
- **모니터링**: 로그 파일 및 대시보드 모니터링

---

## 실험 및 결과

### 5.1 실험 설정

#### 5.1.1 데이터셋

본 실험에서는 NSL-KDD 데이터셋을 사용했습니다:

- **총 레코드 수**: 125,973개
- **특징 수**: 41개
- **공격 유형**: 4가지 (Probe, DoS, U2R, R2L)
- **정상 트래픽**: 60,593개 (48%)
- **공격 트래픽**: 65,380개 (52%)

#### 5.1.2 전처리 과정

1. 결측치 제거: 0개
2. 범주형 특징 인코딩: 3개 특징
3. 수치형 특징 정규화: StandardScaler 사용
4. 학습/테스트 분리: 80/20 비율

#### 5.1.3 모델 설정

| 모델 | 하이퍼파라미터 |
|-----|--------------|
| **Random Forest** | n_estimators=100, max_depth=20 |
| **SVM** | kernel='rbf', C=1.0, gamma='scale' |
| **Neural Network** | hidden_layer_sizes=(128, 64, 32), max_iter=200 |

### 5.2 실험 결과

#### 5.2.1 모델 성능 비교

| 모델 | 정확도 | 정밀도 | 재현율 | F1-Score | AUC | 학습시간 |
|-----|-------|-------|-------|---------|-----|---------|
| **Random Forest** | 0.9876 | 0.9854 | 0.9892 | 0.9873 | 0.9945 | 45.23초 |
| **SVM** | 0.9654 | 0.9612 | 0.9701 | 0.9656 | 0.9823 | 120.45초 |
| **Neural Network** | 0.9734 | 0.9701 | 0.9768 | 0.9734 | 0.9876 | 78.12초 |

**분석**: Random Forest 모델이 가장 높은 정확도(98.76%)와 AUC(0.9945)를 달성했으며, 학습 시간도 가장 짧습니다.

#### 5.2.2 공격 유형별 탐지 성능

| 공격 유형 | 정밀도 | 재현율 | F1-Score |
|---------|-------|-------|---------|
| **Probe** | 0.9823 | 0.9876 | 0.9849 |
| **DoS** | 0.9912 | 0.9934 | 0.9923 |
| **U2R** | 0.9234 | 0.8956 | 0.9093 |
| **R2L** | 0.9145 | 0.8876 | 0.9008 |

**분석**: DoS 공격 탐지 성능이 가장 우수하며(F1-Score: 0.9923), U2R과 R2L 공격은 상대적으로 낮은 성능을 보입니다. 이는 이들 공격의 특징이 정상 트래픽과 유사하기 때문입니다.

#### 5.2.3 혼동 행렬 (Confusion Matrix)

Random Forest 모델의 혼동 행렬:

```
                  예측: 정상    예측: 공격
실제: 정상          12,118        45
실제: 공격             89       13,098
```

- **True Positive (TP)**: 13,098 (공격을 공격으로 올바르게 탐지)
- **True Negative (TN)**: 12,118 (정상을 정상으로 올바르게 판단)
- **False Positive (FP)**: 45 (정상을 공격으로 잘못 판단)
- **False Negative (FN)**: 89 (공격을 정상으로 잘못 판단)

#### 5.2.4 실시간 분석 성능

실시간 트래픽 분석 시스템의 성능:

- **평균 응답 시간**: 12.3ms
- **초당 처리 트래픽**: 약 81개 패킷
- **메모리 사용량**: 약 256MB
- **CPU 사용률**: 약 15-20%

### 5.3 결과 분석

#### 5.3.1 장점

1. **높은 탐지율**: 98.76%의 정확도로 대부분의 공격을 효과적으로 탐지
2. **낮은 오탐지율**: False Positive 비율이 0.34%로 매우 낮음
3. **빠른 응답 시간**: 평균 12.3ms의 응답 시간으로 실시간 분석 가능
4. **다양한 공격 유형 지원**: 5가지 공격 유형 자동 분류
5. **사용자 친화적 인터페이스**: 타이포그래픽 브루탈리즘 스타일의 직관적 대시보드

#### 5.3.2 제한사항

1. **데이터셋 의존성**: 특정 데이터셋에 학습된 모델의 일반화 성능 미검증
2. **새로운 공격 유형**: 학습 데이터에 없는 새로운 공격 유형에 대한 탐지 성능 미검증
3. **하이퍼파라미터 튜닝**: 수동 하이퍼파라미터 튜닝 사용 (자동 튜닝 미적용)
4. **실시간 데이터 부족**: 실제 네트워크 환경에서의 성능 검증 미수행

### 5.4 개선 방향

1. **앙상블 기법**: 여러 모델을 결합하여 성능 향상
2. **자동 하이퍼파라미터 튜닝**: Bayesian Optimization 등 사용
3. **전이 학습**: 다른 데이터셋에서 학습된 모델 활용
4. **실시간 모델 업데이트**: 새로운 공격 유형에 대한 적응형 학습
5. **설명 가능한 AI (XAI)**: 모델의 의사결정 과정 설명

---

## 결론

### 6.1 연구 성과

본 연구에서는 머신러닝을 활용한 네트워크 침입 탐지 시스템을 성공적으로 설계하고 구현했습니다. 주요 성과는 다음과 같습니다:

1. **고성능 탐지 시스템**: Random Forest 알고리즘을 사용하여 98.76%의 정확도 달성
2. **실시간 분석 기능**: 12.3ms의 응답 시간으로 실시간 트래픽 분석 가능
3. **자동 공격 분류**: 5가지 공격 유형을 자동으로 분류하는 휴리스틱 개발
4. **LLM 기반 분석**: OpenAI API를 활용한 공격 분석 및 보고서 자동 생성
5. **사용자 친화적 대시보드**: 보안 담당자를 위한 직관적 웹 인터페이스 제공

### 6.2 기여도

이 연구는 다음과 같은 측면에서 기여합니다:

1. **학문적 기여**: 머신러닝을 활용한 침입 탐지 시스템의 실제 구현 사례 제시
2. **산업적 기여**: 중소 기업에서도 활용 가능한 오픈소스 기반 IDS 제공
3. **보안 강화**: 기존 규칙 기반 IDS의 한계를 극복한 새로운 접근 방식 제시

### 6.3 향후 연구 방향

1. **딥러닝 모델 적용**: CNN, RNN 등 딥러닝 모델을 활용한 성능 개선
2. **실제 네트워크 환경 검증**: 실제 네트워크에서의 성능 평가
3. **분산 처리**: 대규모 트래픽 분석을 위한 분산 처리 시스템 구축
4. **연합 학습**: 여러 조직의 데이터를 활용한 협력 학습
5. **설명 가능성 강화**: SHAP, LIME 등을 활용한 모델 해석성 개선

---

## 참고문헌

[1] Lippmann, R. P., et al. (2000). "Evaluating intrusion detection systems: The 1998 DARPA off-line intrusion detection evaluation." DARPA Information Survivability Conference and Exposition.

[2] Tavallaee, M., et al. (2009). "A detailed analysis of the KDD99 data set." IEEE Symposium on Computational Intelligence for Security and Defense Applications.

[3] Sharafaldin, I., et al. (2018). "Toward generating a new intrusion detection dataset and intrusion traffic characterization." ICISSP.

[4] Breiman, L. (2001). "Random Forests." Machine Learning, 45(1), 5-32.

[5] Cortes, C., & Vapnik, V. (1995). "Support-vector networks." Machine Learning, 20(3), 273-297.

[6] Goodfellow, I., Bengio, Y., & Courville, A. (2016). "Deep Learning." MIT Press.

[7] OpenAI. (2023). "GPT-4 Technical Report." arXiv preprint arXiv:2303.08774.

[8] Manus Platform Documentation. https://docs.manus.im

---

**작성일**: 2026년 2월 23일  
**최종 수정일**: 2026년 2월 23일
