import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { AlertTriangle, Check } from "lucide-react";

/**
 * 위협 알림 페이지
 */
export default function Alerts() {
  const [, navigate] = useLocation();
  const { data: alerts, isLoading } = trpc.alert.list.useQuery({ limit: 100 });
  const resolveAlert = trpc.alert.resolve.useMutation();

  const handleResolve = async (id: number) => {
    await resolveAlert.mutateAsync({ id, notes: "관리자가 해결함" });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-destructive text-destructive-foreground";
      case "HIGH":
        return "bg-foreground text-background";
      case "MEDIUM":
        return "bg-secondary text-foreground";
      case "LOW":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-secondary text-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 헤더 */}
      <header className="dashboard-header">
        <div className="container flex items-center justify-between">
          <h1 className="text-5xl font-black">위협 알림</h1>
          <Button
            onClick={() => navigate("/")}
            className="brutalist-button"
          >
            돌아가기
          </Button>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container py-12">
        {/* 통계 */}
        <section className="dashboard-section mb-16">
          <h2 className="text-4xl font-black mb-8 border-b-4 border-foreground pb-4">
            알림 통계
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="stat-card">
              <div className="stat-value">
                {alerts?.filter((a) => !a.isResolved).length || 0}
              </div>
              <div className="stat-label">미해결</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {alerts?.filter((a) => a.severity === "CRITICAL").length || 0}
              </div>
              <div className="stat-label">심각</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {alerts?.filter((a) => a.severity === "HIGH").length || 0}
              </div>
              <div className="stat-label">높음</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{alerts?.length || 0}</div>
              <div className="stat-label">전체</div>
            </div>
          </div>
        </section>

        {/* 알림 목록 */}
        <section className="dashboard-section">
          <h2 className="text-4xl font-black mb-8 border-b-4 border-foreground pb-4">
            탐지된 위협
          </h2>

          {isLoading ? (
            <div className="brutalist-card">
              <p className="text-lg font-bold">로딩 중...</p>
            </div>
          ) : !alerts || alerts.length === 0 ? (
            <div className="brutalist-card">
              <p className="text-lg font-bold text-muted-foreground">
                탐지된 위협이 없습니다.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`brutalist-card ${
                    alert.isResolved ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-start gap-6">
                    <div
                      className={`w-16 h-16 flex items-center justify-center flex-shrink-0 border-4 border-foreground ${getSeverityColor(
                        alert.severity
                      )}`}
                    >
                      <AlertTriangle className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-2xl font-black">
                          {alert.attackType}
                        </h3>
                        <span
                          className={`px-4 py-2 font-black text-sm border-2 border-foreground ${getSeverityColor(
                            alert.severity
                          )}`}
                        >
                          {alert.severity}
                        </span>
                        {alert.isResolved && (
                          <span className="px-4 py-2 font-black text-sm border-2 border-foreground bg-accent text-accent-foreground">
                            해결됨
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-bold text-muted-foreground">
                            출발지 IP
                          </p>
                          <p className="text-lg font-black">
                            {alert.sourceIP || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-muted-foreground">
                            목적지 IP
                          </p>
                          <p className="text-lg font-black">
                            {alert.destinationIP || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-muted-foreground">
                            프로토콜
                          </p>
                          <p className="text-lg font-black">
                            {alert.protocol || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-muted-foreground">
                            신뢰도
                          </p>
                          <p className="text-lg font-black">
                            {alert.confidence
                              ? `${(parseFloat(alert.confidence) * 100).toFixed(2)}%`
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                      {alert.description && (
                        <p className="text-lg font-bold mb-4">
                          {alert.description}
                        </p>
                      )}
                      <div className="text-sm font-bold text-muted-foreground">
                        탐지 시간:{" "}
                        {new Date(alert.detectedAt).toLocaleString("ko-KR")}
                      </div>
                    </div>
                    {!alert.isResolved && (
                      <Button
                        onClick={() => handleResolve(alert.id)}
                        className="brutalist-button flex-shrink-0"
                      >
                        <Check className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
