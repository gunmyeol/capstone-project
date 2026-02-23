#!/usr/bin/env python3
"""
ML-IDS: 머신러닝 기반 네트워크 침입 탐지 시스템
Python 기반 머신러닝 엔진

주요 기능:
- 데이터 전처리 및 특징 추출
- 다양한 머신러닝 알고리즘 학습
- 모델 평가 및 성능 지표 계산
- 실시간 트래픽 분석 및 예측
"""

import json
import sys
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score, 
    roc_auc_score, confusion_matrix, classification_report
)
import joblib
import warnings
from datetime import datetime
import time

warnings.filterwarnings('ignore')


class MLIDSEngine:
    """ML-IDS 머신러닝 엔진"""
    
    def __init__(self):
        self.model = None
        self.scaler = None
        self.label_encoders = {}
        self.feature_names = []
        self.model_type = None
        self.training_time = 0
        
    def load_dataset(self, file_path):
        """
        데이터셋 로드
        
        Args:
            file_path: CSV 파일 경로
            
        Returns:
            DataFrame: 로드된 데이터
        """
        try:
            df = pd.read_csv(file_path)
            print(f"✓ 데이터셋 로드 완료: {len(df)} 레코드, {len(df.columns)} 특징")
            return df
        except Exception as e:
            print(f"✗ 데이터셋 로드 실패: {str(e)}")
            return None
    
    def preprocess_data(self, df, target_column='label'):
        """
        데이터 전처리
        
        Args:
            df: 원본 데이터프레임
            target_column: 타겟 컬럼명
            
        Returns:
            tuple: (X, y) 전처리된 특징과 타겟
        """
        try:
            # 결측치 처리
            df = df.dropna()
            print(f"✓ 결측치 처리 완료: {len(df)} 레코드 남음")
            
            # 특징과 타겟 분리
            X = df.drop(columns=[target_column])
            y = df[target_column]
            
            # 범주형 특징 인코딩
            categorical_features = X.select_dtypes(include=['object']).columns
            for col in categorical_features:
                le = LabelEncoder()
                X[col] = le.fit_transform(X[col].astype(str))
                self.label_encoders[col] = le
            
            # 특징명 저장
            self.feature_names = X.columns.tolist()
            
            # 타겟 인코딩
            if y.dtype == 'object':
                le = LabelEncoder()
                y = le.fit_transform(y)
                self.label_encoders['target'] = le
            
            print(f"✓ 데이터 전처리 완료: {len(X.columns)} 특징")
            return X, y
        except Exception as e:
            print(f"✗ 데이터 전처리 실패: {str(e)}")
            return None, None
    
    def train_model(self, X, y, model_type='random_forest', test_size=0.2, random_state=42):
        """
        모델 학습
        
        Args:
            X: 특징 데이터
            y: 타겟 데이터
            model_type: 모델 유형 ('random_forest', 'svm', 'neural_network')
            test_size: 테스트 셋 비율
            random_state: 난수 시드
            
        Returns:
            dict: 학습 결과 및 성능 지표
        """
        try:
            # 학습/테스트 데이터 분리
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=test_size, random_state=random_state, stratify=y
            )
            print(f"✓ 데이터 분리 완료: 학습={len(X_train)}, 테스트={len(X_test)}")
            
            # 데이터 정규화
            self.scaler = StandardScaler()
            X_train_scaled = self.scaler.fit_transform(X_train)
            X_test_scaled = self.scaler.transform(X_test)
            print(f"✓ 데이터 정규화 완료")
            
            # 모델 선택 및 학습
            self.model_type = model_type
            start_time = time.time()
            
            if model_type == 'random_forest':
                self.model = RandomForestClassifier(
                    n_estimators=100, max_depth=20, random_state=random_state,
                    n_jobs=-1, verbose=0
                )
            elif model_type == 'svm':
                self.model = SVC(kernel='rbf', C=1.0, gamma='scale', probability=True)
            elif model_type == 'neural_network':
                self.model = MLPClassifier(
                    hidden_layer_sizes=(128, 64, 32), max_iter=200,
                    random_state=random_state, early_stopping=True
                )
            else:
                raise ValueError(f"Unknown model type: {model_type}")
            
            # 학습
            self.model.fit(X_train_scaled, y_train)
            self.training_time = time.time() - start_time
            print(f"✓ 모델 학습 완료: {self.training_time:.2f}초")
            
            # 예측 및 평가
            y_pred = self.model.predict(X_test_scaled)
            y_pred_proba = self.model.predict_proba(X_test_scaled)[:, 1]
            
            # 성능 지표 계산
            results = {
                'model_type': model_type,
                'training_time': round(self.training_time, 2),
                'accuracy': round(accuracy_score(y_test, y_pred), 4),
                'precision': round(precision_score(y_test, y_pred, average='weighted'), 4),
                'recall': round(recall_score(y_test, y_pred, average='weighted'), 4),
                'f1_score': round(f1_score(y_test, y_pred, average='weighted'), 4),
                'auc': round(roc_auc_score(y_test, y_pred_proba), 4),
                'confusion_matrix': confusion_matrix(y_test, y_pred).tolist(),
                'classification_report': classification_report(y_test, y_pred, output_dict=True),
                'total_records': len(X),
                'training_records': len(X_train),
                'testing_records': len(X_test),
            }
            
            print(f"✓ 모델 평가 완료:")
            print(f"  - 정확도: {results['accuracy']}")
            print(f"  - 정밀도: {results['precision']}")
            print(f"  - 재현율: {results['recall']}")
            print(f"  - F1-Score: {results['f1_score']}")
            print(f"  - AUC: {results['auc']}")
            
            return results
        except Exception as e:
            print(f"✗ 모델 학습 실패: {str(e)}")
            return None
    
    def predict(self, X):
        """
        예측
        
        Args:
            X: 특징 데이터
            
        Returns:
            tuple: (예측값, 확률)
        """
        if self.model is None or self.scaler is None:
            raise ValueError("Model not trained yet")
        
        X_scaled = self.scaler.transform(X)
        predictions = self.model.predict(X_scaled)
        probabilities = self.model.predict_proba(X_scaled)
        
        return predictions, probabilities
    
    def save_model(self, model_path):
        """모델 저장"""
        try:
            joblib.dump(self.model, f"{model_path}.model")
            joblib.dump(self.scaler, f"{model_path}.scaler")
            joblib.dump(self.label_encoders, f"{model_path}.encoders")
            print(f"✓ 모델 저장 완료: {model_path}")
        except Exception as e:
            print(f"✗ 모델 저장 실패: {str(e)}")
    
    def load_model(self, model_path):
        """모델 로드"""
        try:
            self.model = joblib.load(f"{model_path}.model")
            self.scaler = joblib.load(f"{model_path}.scaler")
            self.label_encoders = joblib.load(f"{model_path}.encoders")
            print(f"✓ 모델 로드 완료: {model_path}")
        except Exception as e:
            print(f"✗ 모델 로드 실패: {str(e)}")


def main():
    """메인 함수"""
    if len(sys.argv) < 2:
        print("Usage: python ml_engine.py <command> [args...]")
        print("Commands:")
        print("  train <dataset_path> <model_type> <output_path>")
        print("  predict <model_path> <data_json>")
        sys.exit(1)
    
    command = sys.argv[1]
    engine = MLIDSEngine()
    
    if command == 'train':
        if len(sys.argv) < 5:
            print("Usage: python ml_engine.py train <dataset_path> <model_type> <output_path>")
            sys.exit(1)
        
        dataset_path = sys.argv[2]
        model_type = sys.argv[3]
        output_path = sys.argv[4]
        
        # 데이터셋 로드
        df = engine.load_dataset(dataset_path)
        if df is None:
            sys.exit(1)
        
        # 데이터 전처리
        X, y = engine.preprocess_data(df)
        if X is None:
            sys.exit(1)
        
        # 모델 학습
        results = engine.train_model(X, y, model_type=model_type)
        if results is None:
            sys.exit(1)
        
        # 모델 저장
        engine.save_model(output_path)
        
        # 결과 출력
        print(json.dumps(results, indent=2))
    
    elif command == 'predict':
        if len(sys.argv) < 4:
            print("Usage: python ml_engine.py predict <model_path> <data_json>")
            sys.exit(1)
        
        model_path = sys.argv[2]
        data_json = sys.argv[3]
        
        # 모델 로드
        engine.load_model(model_path)
        
        # 데이터 파싱
        data = json.loads(data_json)
        X = pd.DataFrame([data])
        
        # 예측
        predictions, probabilities = engine.predict(X)
        
        result = {
            'prediction': int(predictions[0]),
            'probability': float(probabilities[0][1]),
            'timestamp': datetime.now().isoformat()
        }
        
        print(json.dumps(result, indent=2))
    
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)


if __name__ == '__main__':
    main()
