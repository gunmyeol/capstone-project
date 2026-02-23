/**
 * ML-IDS: 머신러닝 엔진 통합 유틸리티
 * Python 머신러닝 엔진과 Node.js 백엔드를 연결합니다.
 */

import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { promisify } from "util";

const exec = promisify(require("child_process").exec);

/**
 * 머신러닝 모델 학습
 */
export async function trainModel(
  datasetPath: string,
  modelType: "random_forest" | "svm" | "neural_network",
  outputPath: string
): Promise<{
  modelType: string;
  trainingTime: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
  confusionMatrix: number[][];
  classificationReport: Record<string, any>;
  totalRecords: number;
  trainingRecords: number;
  testingRecords: number;
}> {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, "ml_engine.py");
    const python = spawn("python3", [
      pythonScript,
      "train",
      datasetPath,
      modelType,
      outputPath,
    ]);

    let stdout = "";
    let stderr = "";

    python.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    python.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    python.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Python process exited with code ${code}: ${stderr}`));
        return;
      }

      try {
        // JSON 결과 추출 (마지막 JSON 객체)
        const jsonMatch = stdout.match(/\{[\s\S]*\}$/);
        if (!jsonMatch) {
          reject(new Error("No JSON output from Python script"));
          return;
        }

        const result = JSON.parse(jsonMatch[0]);
        resolve(result);
      } catch (error) {
        reject(new Error(`Failed to parse Python output: ${error}`));
      }
    });
  });
}

/**
 * 실시간 트래픽 예측
 */
export async function predictTraffic(
  modelPath: string,
  trafficData: Record<string, number | string>
): Promise<{
  prediction: 0 | 1; // 0: 정상, 1: 공격
  probability: number;
  timestamp: string;
}> {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, "ml_engine.py");
    const dataJson = JSON.stringify(trafficData);

    const python = spawn("python3", [
      pythonScript,
      "predict",
      modelPath,
      dataJson,
    ]);

    let stdout = "";
    let stderr = "";

    python.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    python.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    python.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Python process exited with code ${code}: ${stderr}`));
        return;
      }

      try {
        const jsonMatch = stdout.match(/\{[\s\S]*\}$/);
        if (!jsonMatch) {
          reject(new Error("No JSON output from Python script"));
          return;
        }

        const result = JSON.parse(jsonMatch[0]);
        resolve(result);
      } catch (error) {
        reject(new Error(`Failed to parse Python output: ${error}`));
      }
    });
  });
}

/**
 * 데이터셋 통계 계산
 */
export async function analyzeDataset(
  datasetPath: string
): Promise<{
  totalRecords: number;
  totalFeatures: number;
  missingValues: Record<string, number>;
  attackDistribution: Record<string, number>;
}> {
  return new Promise((resolve, reject) => {
    const pythonCode = `
import pandas as pd
import json
import sys

try:
    df = pd.read_csv('${datasetPath}')
    
    # 공격 분포 계산 (label 컬럼 기준)
    attack_dist = {}
    if 'label' in df.columns:
        attack_dist = df['label'].value_counts().to_dict()
    
    result = {
        'totalRecords': len(df),
        'totalFeatures': len(df.columns),
        'missingValues': df.isnull().sum().to_dict(),
        'attackDistribution': attack_dist
    }
    
    print(json.dumps(result))
except Exception as e:
    print(json.dumps({'error': str(e)}), file=sys.stderr)
    sys.exit(1)
`;

    const python = spawn("python3", ["-c", pythonCode]);

    let stdout = "";
    let stderr = "";

    python.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    python.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    python.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Python process exited with code ${code}: ${stderr}`));
        return;
      }

      try {
        const result = JSON.parse(stdout);
        if (result.error) {
          reject(new Error(result.error));
        } else {
          resolve(result);
        }
      } catch (error) {
        reject(new Error(`Failed to parse Python output: ${error}`));
      }
    });
  });
}

/**
 * 특징 중요도 분석 (Random Forest 모델용)
 */
export async function analyzeFeatureImportance(
  modelPath: string
): Promise<Array<{ feature: string; importance: number }>> {
  return new Promise((resolve, reject) => {
    const pythonCode = `
import joblib
import json

try:
    model = joblib.load('${modelPath}.model')
    
    if hasattr(model, 'feature_importances_'):
        # Random Forest의 경우
        importances = model.feature_importances_
        feature_names = joblib.load('${modelPath}.feature_names.pkl')
        
        features = [
            {'feature': name, 'importance': float(imp)}
            for name, imp in zip(feature_names, importances)
        ]
        features.sort(key=lambda x: x['importance'], reverse=True)
        
        print(json.dumps(features[:20]))  # 상위 20개 특징
    else:
        print(json.dumps([]))
except Exception as e:
    print(json.dumps({'error': str(e)}), file=sys.stderr)
    sys.exit(1)
`;

    const python = spawn("python3", ["-c", pythonCode]);

    let stdout = "";
    let stderr = "";

    python.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    python.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    python.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Python process exited with code ${code}: ${stderr}`));
        return;
      }

      try {
        const result = JSON.parse(stdout);
        if (result.error) {
          reject(new Error(result.error));
        } else {
          resolve(result);
        }
      } catch (error) {
        reject(new Error(`Failed to parse Python output: ${error}`));
      }
    });
  });
}

/**
 * 배치 예측 (여러 트래픽 데이터 한 번에 예측)
 */
export async function batchPredict(
  modelPath: string,
  trafficDataList: Array<Record<string, number | string>>
): Promise<
  Array<{
    prediction: 0 | 1;
    probability: number;
    timestamp: string;
  }>
> {
  const predictions: Array<{
    prediction: 0 | 1;
    probability: number;
    timestamp: string;
  }> = [];

  for (const trafficData of trafficDataList) {
    try {
      const prediction = await predictTraffic(modelPath, trafficData);
      predictions.push(prediction);
    } catch (error) {
      console.error("Prediction error:", error);
      predictions.push({
        prediction: 0,
        probability: 0,
        timestamp: new Date().toISOString(),
      });
    }
  }

  return predictions;
}
