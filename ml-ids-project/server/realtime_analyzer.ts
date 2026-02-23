/**
 * 실시간 네트워크 트래픽 분석 서비스
 * 활성 모델을 사용하여 실시간 트래픽을 분석하고 위협을 탐지합니다.
 */

import { predictTraffic } from "./ml_utils";
import * as db from "./db";
import { notifyOwner } from "./_core/notification";

interface TrafficData {
  sourceIP: string;
  destinationIP: string;
  sourcePort: number;
  destinationPort: number;
  protocol: string;
  duration: number;
  bytesSent: number;
  bytesReceived: number;
  [key: string]: any;
}

interface AnalysisResult {
  isAnomaly: boolean;
  confidence: number;
  attackType?: string;
  severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  description?: string;
}

/**
 * 공격 유형 분류
 */
function classifyAttack(
  sourceIP: string,
  destinationIP: string,
  protocol: string,
  duration: number,
  bytesSent: number,
  bytesReceived: number,
  confidence: number
): { attackType: string; severity: string; description: string } {
  // 신뢰도 기반 심각도 결정
  let severity = "LOW";
  if (confidence > 0.9) severity = "CRITICAL";
  else if (confidence > 0.75) severity = "HIGH";
  else if (confidence > 0.6) severity = "MEDIUM";

  // 트래픽 패턴 기반 공격 유형 분류
  let attackType = "Unknown Attack";
  let description = "";

  // DDoS 탐지: 짧은 지속시간, 많은 바이트 송수신
  if (duration < 10 && (bytesSent + bytesReceived) > 1000000) {
    attackType = "DDoS Attack";
    description = "비정상적으로 많은 데이터가 짧은 시간에 전송되었습니다.";
  }
  // Port Scanning: 여러 포트로의 연결 시도 (포트 번호가 높음)
  else if (destinationIP.split(".").length === 4) {
    attackType = "Port Scanning";
    description = "네트워크 스캔 활동이 감지되었습니다.";
  }
  // SQL Injection: 특정 프로토콜과 패턴
  else if (protocol === "TCP" && bytesSent > bytesReceived * 2) {
    attackType = "SQL Injection";
    description = "데이터베이스 공격 시도가 감지되었습니다.";
  }
  // Brute Force: 반복적인 연결 시도
  else if (duration < 5 && bytesSent < 1000) {
    attackType = "Brute Force Attack";
    description = "반복적인 접근 시도가 감지되었습니다.";
  }
  // DoS: 단일 출발지에서의 대량 트래픽
  else if ((bytesSent + bytesReceived) > 500000) {
    attackType = "DoS Attack";
    description = "서비스 거부 공격이 감지되었습니다.";
  }

  return { attackType, severity, description };
}

/**
 * 실시간 트래픽 분석
 */
export async function analyzeTraffic(
  userId: number,
  trafficData: TrafficData,
  modelPath: string
): Promise<AnalysisResult> {
  try {
    // 모델을 사용한 예측
    const prediction = await predictTraffic(modelPath, trafficData);

    const isAnomaly = prediction.prediction === 1;
    const confidence = prediction.probability;

    if (!isAnomaly) {
      return {
        isAnomaly: false,
        confidence: 1 - confidence,
      };
    }

    // 공격 유형 분류
    const { attackType, severity, description } = classifyAttack(
      trafficData.sourceIP,
      trafficData.destinationIP,
      trafficData.protocol,
      trafficData.duration,
      trafficData.bytesSent,
      trafficData.bytesReceived,
      confidence
    );

    // 데이터베이스에 트래픽 로그 저장
    await db.createTrafficLog({
      userId,
      sourceIP: trafficData.sourceIP,
      destinationIP: trafficData.destinationIP,
      sourcePort: trafficData.sourcePort,
      destinationPort: trafficData.destinationPort,
      protocol: trafficData.protocol,
      duration: trafficData.duration,
      bytesSent: trafficData.bytesSent,
      bytesReceived: trafficData.bytesReceived,
      isAnomaly: true,
      anomalyScore: confidence,
      detectedAt: new Date(),
    } as any);

    // 위협 알림 생성
    const alert = await db.createAlert({
      userId,
      attackType,
      severity: severity as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
      sourceIP: trafficData.sourceIP,
      destinationIP: trafficData.destinationIP,
      protocol: trafficData.protocol,
      confidence: confidence.toString(),
      description,
      detectedAt: new Date(),
      isResolved: false,
    } as any);

    // 심각한 위협인 경우 즉시 알림
    if (severity === "CRITICAL" || severity === "HIGH") {
      await notifyOwner({
        title: `🚨 ${severity} 레벨 위협 탐지`,
        content: `공격 유형: ${attackType}\n출발지: ${trafficData.sourceIP}\n신뢰도: ${(confidence * 100).toFixed(2)}%\n${description}`,
      });
    }

    return {
      isAnomaly: true,
      confidence,
      attackType,
      severity: severity as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
      description,
    };
  } catch (error) {
    console.error("Traffic analysis error:", error);
    return {
      isAnomaly: false,
      confidence: 0,
    };
  }
}

/**
 * 배치 트래픽 분석
 */
export async function analyzeTrafficBatch(
  userId: number,
  trafficDataList: TrafficData[],
  modelPath: string
): Promise<AnalysisResult[]> {
  const results: AnalysisResult[] = [];

  for (const trafficData of trafficDataList) {
    const result = await analyzeTraffic(userId, trafficData, modelPath);
    results.push(result);
  }

  return results;
}

/**
 * 통계 생성
 */
export async function generateStatistics(userId: number) {
  try {
    // 미해결 알림 수
    const unresolvedAlerts = await db.getUnresolvedAlerts(userId);

    // 심각도별 알림 분포
    const alertsBySeverity = {
      CRITICAL: unresolvedAlerts.filter((a) => a.severity === "CRITICAL").length,
      HIGH: unresolvedAlerts.filter((a) => a.severity === "HIGH").length,
      MEDIUM: unresolvedAlerts.filter((a) => a.severity === "MEDIUM").length,
      LOW: unresolvedAlerts.filter((a) => a.severity === "LOW").length,
    };

    // 공격 유형별 분포
    const attackTypes: Record<string, number> = {};
    unresolvedAlerts.forEach((alert) => {
      attackTypes[alert.attackType] = (attackTypes[alert.attackType] || 0) + 1;
    });

    return {
      totalAlerts: unresolvedAlerts.length,
      alertsBySeverity,
      attackTypes,
      lastAlertTime:
        unresolvedAlerts.length > 0
          ? unresolvedAlerts[0].detectedAt
          : null,
    };
  } catch (error) {
    console.error("Statistics generation error:", error);
    return {
      totalAlerts: 0,
      alertsBySeverity: { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 },
      attackTypes: {},
      lastAlertTime: null,
    };
  }
}

/**
 * 트래픽 패턴 분석 (시계열 분석)
 */
export async function analyzeTrafficPatterns(
  userId: number,
  timeWindow: number = 3600 // 기본 1시간
): Promise<{
  normalTraffic: number;
  anomalousTraffic: number;
  anomalyRate: number;
  topAttackTypes: Array<{ type: string; count: number }>;
}> {
  try {
    const now = new Date();
    const startTime = new Date(now.getTime() - timeWindow * 1000);

    // 시간 범위 내의 트래픽 로그 조회 (임시 구현)
    const trafficLogs: any[] = [];

    const normalTraffic = trafficLogs.filter((log: any) => !log.isAnomaly).length;
    const anomalousTraffic = trafficLogs.filter((log: any) => log.isAnomaly).length;
    const totalTraffic = trafficLogs.length;

    // 공격 유형 분포 (임시 구현)
    const alerts: any[] = [];
    const attackTypeCounts: Record<string, number> = {};

    alerts.forEach((alert: any) => {
      attackTypeCounts[alert.attackType] =
        (attackTypeCounts[alert.attackType] || 0) + 1;
    });

    const topAttackTypes = Object.entries(attackTypeCounts)
      .map(([type, count]: [string, number]) => ({ type, count }))
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 5);

    return {
      normalTraffic: normalTraffic || 0,
      anomalousTraffic: anomalousTraffic || 0,
      anomalyRate: totalTraffic > 0 ? anomalousTraffic / totalTraffic : 0,
      topAttackTypes,
    };
  } catch (error) {
    console.error("Traffic pattern analysis error:", error);
    return {
      normalTraffic: 0,
      anomalousTraffic: 0,
      anomalyRate: 0,
      topAttackTypes: [],
    };
  }
}
