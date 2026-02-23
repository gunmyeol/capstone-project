/**
 * LLM 기반 공격 패턴 분석 및 보고서 생성
 * OpenAI API를 활용하여 탐지된 공격을 분석하고 대응 방안을 제시합니다.
 */

import { invokeLLM } from "./_core/llm";
import * as db from "./db";

interface AttackAnalysisRequest {
  attackType: string;
  sourceIP: string;
  destinationIP: string;
  protocol: string;
  severity: string;
  confidence: number;
  description: string;
}

interface AttackAnalysisResponse {
  summary: string;
  riskAssessment: string;
  recommendedActions: string[];
  preventionStrategies: string[];
  detailedAnalysis: string;
}

/**
 * LLM을 사용한 공격 분석
 */
export async function analyzeAttackWithLLM(
  attackData: AttackAnalysisRequest
): Promise<AttackAnalysisResponse> {
  const prompt = `
당신은 사이버 보안 전문가입니다. 다음 네트워크 공격을 분석하고 대응 방안을 제시하세요.

공격 정보:
- 공격 유형: ${attackData.attackType}
- 출발지 IP: ${attackData.sourceIP}
- 목적지 IP: ${attackData.destinationIP}
- 프로토콜: ${attackData.protocol}
- 심각도: ${attackData.severity}
- 신뢰도: ${(attackData.confidence * 100).toFixed(2)}%
- 설명: ${attackData.description}

다음 형식으로 분석 결과를 제공하세요:

## 요약 (Summary)
[공격의 간단한 요약]

## 위험 평가 (Risk Assessment)
[위험도 평가 및 잠재적 영향]

## 권장 조치 (Recommended Actions)
1. [첫 번째 조치]
2. [두 번째 조치]
3. [세 번째 조치]

## 예방 전략 (Prevention Strategies)
1. [첫 번째 예방 방법]
2. [두 번째 예방 방법]
3. [세 번째 예방 방법]

## 상세 분석 (Detailed Analysis)
[공격의 기술적 세부사항 및 대응 방안]
`;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content:
            "You are a cybersecurity expert analyzing network attacks. Provide detailed analysis in Korean.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content =
      typeof response.choices[0].message.content === "string"
        ? response.choices[0].message.content
        : "분석 실패";

    // 응답 파싱
    const summaryMatch = content.match(/## 요약[\s\S]*?\n([\s\S]*?)(?=##|$)/);
    const riskMatch = content.match(/## 위험 평가[\s\S]*?\n([\s\S]*?)(?=##|$)/);
    const actionsMatch = content.match(/## 권장 조치[\s\S]*?\n([\s\S]*?)(?=##|$)/);
    const preventionMatch = content.match(
      /## 예방 전략[\s\S]*?\n([\s\S]*?)(?=##|$)/
    );
    const detailedMatch = content.match(
      /## 상세 분석[\s\S]*?\n([\s\S]*?)(?=##|$)/
    );

    const parseActions = (text: string): string[] => {
      return text
        .split("\n")
        .filter((line) => line.match(/^\d+\./))
        .map((line) => line.replace(/^\d+\.\s*/, "").trim());
    };

    return {
      summary: summaryMatch ? summaryMatch[1].trim() : "분석 불가",
      riskAssessment: riskMatch ? riskMatch[1].trim() : "평가 불가",
      recommendedActions: actionsMatch
        ? parseActions(actionsMatch[1])
        : [],
      preventionStrategies: preventionMatch
        ? parseActions(preventionMatch[1])
        : [],
      detailedAnalysis: detailedMatch ? detailedMatch[1].trim() : "분석 불가",
    };
  } catch (error) {
    console.error("LLM analysis error:", error);
    return {
      summary: "LLM 분석 실패",
      riskAssessment: "평가 불가",
      recommendedActions: [],
      preventionStrategies: [],
      detailedAnalysis: "기술적 오류로 인해 분석할 수 없습니다.",
    };
  }
}

/**
 * 일일 보안 보고서 생성
 */
export async function generateSecurityReport(
  userId: number,
  date: Date
): Promise<string> {
  try {
    // 해당 날짜의 알림 조회
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // 임시 구현 - 실제로는 DB에서 조회
    const alerts: any[] = []; // 실제 구현에서는 DB 쿼리 사용

    // 공격 유형별 통계
    const attackStats: Record<string, number> = {};
    const severityStats: Record<string, number> = {
      CRITICAL: 0,
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0,
    };

    alerts.forEach((alert: any) => {
      attackStats[alert.attackType] = (attackStats[alert.attackType] || 0) + 1;
      severityStats[alert.severity] = (severityStats[alert.severity] || 0) + 1;
    });

    // LLM을 사용한 보고서 생성
    const dateStr = date.toLocaleDateString("ko-KR");
    const attackStatsStr = Object.entries(attackStats)
      .map(([type, count]) => `- ${type}: ${count}건`)
      .join("\n");
    const reportPrompt = `
당신은 사이버 보안 분석가입니다. 다음 일일 보안 보고서를 작성하세요.

날짜: ${dateStr}

탐지된 공격 통계:
- 총 공격 수: ${alerts.length}
- 심각도별:
  - CRITICAL: ${severityStats.CRITICAL}
  - HIGH: ${severityStats.HIGH}
  - MEDIUM: ${severityStats.MEDIUM}
  - LOW: ${severityStats.LOW}

공격 유형별 분포:
${attackStatsStr}

다음 형식으로 보고서를 작성하세요:

## 일일 보안 보고서
날짜: ${dateStr}

### 요약
[오늘의 보안 상황 요약]

### 주요 위협
[가장 심각한 위협 3가지]

### 통계
[공격 통계 및 트렌드]

### 권장사항
[내일을 위한 보안 강화 방안]

### 결론
[전체 평가 및 다음 조치]
`;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content:
            "You are a cybersecurity analyst writing a daily security report in Korean.",
        },
        {
          role: "user",
          content: reportPrompt,
        },
      ],
    });

    const reportContent = response.choices[0].message.content;
    return typeof reportContent === "string" ? reportContent : "보고서 생성 실패";
  } catch (error) {
    console.error("Report generation error:", error);
    return "보고서 생성 중 오류가 발생했습니다.";
  }
}

/**
 * 위협 인텔리전스 요약
 */
export async function generateThreatIntelligence(
  userId: number,
  timeWindow: number = 86400 // 기본 24시간
): Promise<{
  topThreats: Array<{ type: string; count: number; severity: string }>;
  trends: string;
  recommendations: string[];
}> {
  try {
    // 임시 구현
    const topThreats = [
      { type: "DDoS Attack", count: 15, severity: "HIGH" },
      { type: "Port Scanning", count: 8, severity: "MEDIUM" },
      { type: "SQL Injection", count: 3, severity: "CRITICAL" },
    ];

    const threatsStr = topThreats
      .map((t) => `- ${t.type}: ${t.count}건 (심각도: ${t.severity})`)
      .join("\n");
    const trendsPrompt = `
다음 위협 데이터를 분석하여 현재의 사이버 위협 트렌드를 요약하세요:

주요 위협:
${threatsStr}

한국어로 간단한 트렌드 분석을 제공하세요.
`;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content:
            "You are a cybersecurity threat analyst. Analyze threat trends and provide recommendations in Korean.",
        },
        {
          role: "user",
          content: trendsPrompt,
        },
      ],
    });

    const trendsContent = response.choices[0].message.content;
    const trends =
      typeof trendsContent === "string" ? trendsContent : "분석 불가";

    return {
      topThreats,
      trends,
      recommendations: [
        "방화벽 규칙 검토 및 업데이트",
        "IDS/IPS 서명 업데이트",
        "직원 보안 교육 강화",
      ],
    };
  } catch (error) {
    console.error("Threat intelligence error:", error);
    return {
      topThreats: [],
      trends: "분석 불가",
      recommendations: [],
    };
  }
}
