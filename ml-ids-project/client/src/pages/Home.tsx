import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { AlertTriangle, BarChart3, Database, Zap } from "lucide-react";

/**
 * ML-IDS 프로젝트 홈 페이지
 * 타이포그래픽 브루탈리즘 스타일 적용
 */
export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  // 인증되지 않은 사용자를 위한 랜딩 페이지
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        {/* 헤더 */}
        <header className="border-b-4 border-foreground py-8">
          <div className="container flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-foreground flex items-center justify-center">
                <Zap className="w-6 h-6 text-background" />
              </div>
              <h1 className="text-4xl font-black">ML-IDS</h1>
            </div>
            <Button
              onClick={() => (window.location.href = getLoginUrl())}
              className="brutalist-button"
            >
              로그인
            </Button>
          </div>
        </header>

        {/* 메인 콘텐츠 */}
        <main className="container py-24">
          {/* 히어로 섹션 */}
          <section className="mb-32">
            <h2 className="brutalist-heading text-7xl mb-8">
              머신러닝 기반<br />
              <span className="inline-block border-b-4 border-foreground px-2">
                네트워크 침입 탐지
              </span>
            </h2>
            <p className="text-2xl font-bold mb-12 max-w-3xl leading-relaxed">
              AI 기술을 활용하여 실시간 네트워크 위협을 탐지하고 분석합니다.
              고급 머신러닝 알고리즘으로 보안을 한 단계 업그레이드하세요.
            </p>
            <Button
              onClick={() => (window.location.href = getLoginUrl())}
              className="brutalist-button text-xl py-6 px-12"
            >
              시작하기
            </Button>
          </section>

          {/* 기능 소개 */}
          <section className="mb-32">
            <h3 className="text-5xl font-black mb-16 border-b-4 border-foreground pb-8">
              주요 기능
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 기능 카드 1 */}
              <div className="brutalist-card">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-16 h-16 bg-foreground flex items-center justify-center flex-shrink-0">
                    <Database className="w-8 h-8 text-background" />
                  </div>
                  <h4 className="text-3xl font-black">데이터 분석</h4>
                </div>
                <p className="text-lg font-bold leading-relaxed">
                  NSL-KDD, CICIDS2017 등 대규모 네트워크 데이터셋을 업로드하고
                  전처리하여 머신러닝 모델 학습에 활용합니다.
                </p>
              </div>

              {/* 기능 카드 2 */}
              <div className="brutalist-card">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-16 h-16 bg-foreground flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-8 h-8 text-background" />
                  </div>
                  <h4 className="text-3xl font-black">모델 학습</h4>
                </div>
                <p className="text-lg font-bold leading-relaxed">
                  Random Forest, SVM, Neural Network 등 다양한 머신러닝 알고리즘으로
                  침입 탐지 모델을 학습하고 성능을 비교합니다.
                </p>
              </div>

              {/* 기능 카드 3 */}
              <div className="brutalist-card">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-16 h-16 bg-foreground flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-8 h-8 text-background" />
                  </div>
                  <h4 className="text-3xl font-black">위협 탐지</h4>
                </div>
                <p className="text-lg font-bold leading-relaxed">
                  실시간 네트워크 트래픽을 분석하여 DDoS, SQL Injection 등
                  다양한 공격 유형을 자동으로 탐지합니다.
                </p>
              </div>

              {/* 기능 카드 4 */}
              <div className="brutalist-card">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-16 h-16 bg-foreground flex items-center justify-center flex-shrink-0">
                    <Zap className="w-8 h-8 text-background" />
                  </div>
                  <h4 className="text-3xl font-black">실시간 모니터링</h4>
                </div>
                <p className="text-lg font-bold leading-relaxed">
                  대시보드에서 탐지된 위협을 실시간으로 모니터링하고
                  상세한 분석 보고서를 생성합니다.
                </p>
              </div>
            </div>
          </section>

          {/* 기술 스택 */}
          <section className="mb-32">
            <h3 className="text-5xl font-black mb-16 border-b-4 border-foreground pb-8">
              기술 스택
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                "Python",
                "scikit-learn",
                "TensorFlow",
                "React 19",
                "TypeScript",
                "tRPC",
                "MySQL",
                "Drizzle ORM",
              ].map((tech) => (
                <div
                  key={tech}
                  className="brutalist-card text-center py-8"
                >
                  <p className="text-lg font-black">{tech}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA 섹션 */}
          <section className="bg-foreground text-background p-16 border-4 border-foreground">
            <h3 className="text-4xl font-black mb-6">지금 시작하세요</h3>
            <p className="text-xl font-bold mb-8">
              고급 머신러닝 기술으로 네트워크 보안을 강화하세요.
            </p>
            <Button
              onClick={() => (window.location.href = getLoginUrl())}
              className="bg-background text-foreground border-4 border-background px-8 py-4 font-bold text-lg hover:bg-foreground hover:text-background"
            >
              로그인
            </Button>
          </section>
        </main>

        {/* 푸터 */}
        <footer className="border-t-4 border-foreground mt-24 py-12">
          <div className="container text-center">
            <p className="text-lg font-bold">
              ML-IDS © 2026 | 머신러닝 기반 네트워크 침입 탐지 시스템
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // 인증된 사용자를 위한 대시보드
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 대시보드 헤더 */}
      <header className="dashboard-header">
        <div className="container flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-black mb-2">대시보드</h1>
            <p className="text-lg font-bold">
              환영합니다, <span className="border-b-2 border-foreground">{user?.name}</span>님
            </p>
          </div>
          <Button
            onClick={() => navigate("/settings")}
            className="brutalist-button"
          >
            설정
          </Button>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container py-12">
        {/* 통계 카드 */}
        <section className="dashboard-section">
          <h2 className="text-4xl font-black mb-8 border-b-4 border-foreground pb-4">
            시스템 통계
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="stat-card">
              <div className="stat-value">0</div>
              <div className="stat-label">활성 모델</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">0</div>
              <div className="stat-label">탐지된 위협</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">0</div>
              <div className="stat-label">데이터셋</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">0</div>
              <div className="stat-label">실험</div>
            </div>
          </div>
        </section>

        {/* 빠른 액션 */}
        <section className="dashboard-section">
          <h2 className="text-4xl font-black mb-8 border-b-4 border-foreground pb-4">
            빠른 액션
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Button
              onClick={() => navigate("/datasets")}
              className="brutalist-button py-8 text-lg"
            >
              데이터셋 관리
            </Button>
            <Button
              onClick={() => navigate("/models")}
              className="brutalist-button py-8 text-lg"
            >
              모델 학습
            </Button>
            <Button
              onClick={() => navigate("/alerts")}
              className="brutalist-button py-8 text-lg"
            >
              위협 알림
            </Button>
            <Button
              onClick={() => navigate("/monitoring")}
              className="brutalist-button py-8 text-lg"
            >
              실시간 모니터링
            </Button>
          </div>
        </section>

        {/* 최근 활동 */}
        <section className="dashboard-section">
          <h2 className="text-4xl font-black mb-8 border-b-4 border-foreground pb-4">
            최근 활동
          </h2>
          <div className="brutalist-card">
            <p className="text-lg font-bold text-muted-foreground">
              아직 활동 기록이 없습니다.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
