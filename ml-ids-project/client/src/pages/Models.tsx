import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Plus, CheckCircle, Circle } from "lucide-react";

/**
 * 모델 관리 페이지
 */
export default function Models() {
  const [, navigate] = useLocation();
  const { data: models, isLoading } = trpc.model.list.useQuery();
  const { data: activeModel } = trpc.model.getActive.useQuery();
  const activateModel = trpc.model.activate.useMutation();

  const handleActivate = async (id: number) => {
    await activateModel.mutateAsync({ id });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 헤더 */}
      <header className="dashboard-header">
        <div className="container flex items-center justify-between">
          <h1 className="text-5xl font-black">모델 관리</h1>
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
        {/* 새 모델 생성 */}
        <section className="dashboard-section mb-16">
          <h2 className="text-4xl font-black mb-8 border-b-4 border-foreground pb-4">
            새 모델 생성
          </h2>
          <div className="brutalist-card">
            <div className="flex items-center gap-8">
              <div className="w-24 h-24 bg-foreground flex items-center justify-center flex-shrink-0">
                <Plus className="w-12 h-12 text-background" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black mb-2">
                  머신러닝 모델 학습
                </h3>
                <p className="text-lg font-bold mb-6">
                  데이터셋을 선택하고 알고리즘을 설정하여 새로운 침입 탐지 모델을 학습합니다.
                </p>
                <Button className="brutalist-button">
                  모델 생성
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 활성 모델 */}
        {activeModel && (
          <section className="dashboard-section mb-16">
            <h2 className="text-4xl font-black mb-8 border-b-4 border-foreground pb-4">
              활성 모델
            </h2>
            <div className="bg-accent text-accent-foreground border-4 border-accent p-8">
              <div className="flex items-start gap-6">
                <CheckCircle className="w-12 h-12 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-3xl font-black mb-2">
                    {activeModel.name}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-bold opacity-75">
                        알고리즘
                      </p>
                      <p className="text-lg font-black">
                        {activeModel.modelType}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-bold opacity-75">
                        정확도
                      </p>
                      <p className="text-lg font-black">
                        {activeModel.accuracy
                          ? `${(parseFloat(activeModel.accuracy) * 100).toFixed(2)}%`
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-bold opacity-75">
                        F1-Score
                      </p>
                      <p className="text-lg font-black">
                        {activeModel.f1Score
                          ? parseFloat(activeModel.f1Score).toFixed(4)
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-bold opacity-75">
                        AUC
                      </p>
                      <p className="text-lg font-black">
                        {activeModel.auc
                          ? parseFloat(activeModel.auc).toFixed(4)
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 모델 목록 */}
        <section className="dashboard-section">
          <h2 className="text-4xl font-black mb-8 border-b-4 border-foreground pb-4">
            모든 모델
          </h2>

          {isLoading ? (
            <div className="brutalist-card">
              <p className="text-lg font-bold">로딩 중...</p>
            </div>
          ) : !models || models.length === 0 ? (
            <div className="brutalist-card">
              <p className="text-lg font-bold text-muted-foreground">
                생성된 모델이 없습니다.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {models.map((model) => (
                <div
                  key={model.id}
                  className={`brutalist-card ${
                    model.isActive ? "border-accent" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-6 flex-1">
                      <div className="mt-1">
                        {model.isActive ? (
                          <CheckCircle className="w-8 h-8" />
                        ) : (
                          <Circle className="w-8 h-8" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-black mb-2">
                          {model.name}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-bold text-muted-foreground">
                              알고리즘
                            </p>
                            <p className="text-lg font-black">
                              {model.modelType}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-muted-foreground">
                              정확도
                            </p>
                            <p className="text-lg font-black">
                              {model.accuracy
                                ? `${(parseFloat(model.accuracy) * 100).toFixed(2)}%`
                                : "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-muted-foreground">
                              정밀도
                            </p>
                            <p className="text-lg font-black">
                              {model.precision
                                ? parseFloat(model.precision).toFixed(4)
                                : "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-muted-foreground">
                              재현율
                            </p>
                            <p className="text-lg font-black">
                              {model.recall
                                ? parseFloat(model.recall).toFixed(4)
                                : "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-muted-foreground">
                              학습 시간
                            </p>
                            <p className="text-lg font-black">
                              {model.trainingTime
                                ? `${model.trainingTime}s`
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                        {model.description && (
                          <p className="text-lg font-bold mb-4">
                            {model.description}
                          </p>
                        )}
                      </div>
                    </div>
                    {!model.isActive && (
                      <Button
                        onClick={() => handleActivate(model.id)}
                        className="brutalist-button flex-shrink-0"
                      >
                        활성화
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
