import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Upload, Trash2, Eye } from "lucide-react";
import { useState } from "react";

/**
 * 데이터셋 관리 페이지
 */
export default function Datasets() {
  const [, navigate] = useLocation();
  const { data: datasets, isLoading } = trpc.dataset.list.useQuery();
  const deleteDataset = trpc.dataset.delete.useMutation();

  const handleDelete = async (id: number) => {
    if (confirm("이 데이터셋을 삭제하시겠습니까?")) {
      await deleteDataset.mutateAsync({ id });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 헤더 */}
      <header className="dashboard-header">
        <div className="container flex items-center justify-between">
          <h1 className="text-5xl font-black">데이터셋 관리</h1>
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
        {/* 업로드 섹션 */}
        <section className="dashboard-section mb-16">
          <h2 className="text-4xl font-black mb-8 border-b-4 border-foreground pb-4">
            새 데이터셋 업로드
          </h2>
          <div className="brutalist-card">
            <div className="flex items-center gap-8">
              <div className="w-24 h-24 bg-foreground flex items-center justify-center flex-shrink-0">
                <Upload className="w-12 h-12 text-background" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black mb-2">파일 업로드</h3>
                <p className="text-lg font-bold mb-6">
                  CSV 형식의 네트워크 트래픽 데이터셋을 업로드하세요.
                </p>
                <Button className="brutalist-button">
                  파일 선택
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 데이터셋 목록 */}
        <section className="dashboard-section">
          <h2 className="text-4xl font-black mb-8 border-b-4 border-foreground pb-4">
            업로드된 데이터셋
          </h2>

          {isLoading ? (
            <div className="brutalist-card">
              <p className="text-lg font-bold">로딩 중...</p>
            </div>
          ) : !datasets || datasets.length === 0 ? (
            <div className="brutalist-card">
              <p className="text-lg font-bold text-muted-foreground">
                업로드된 데이터셋이 없습니다.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {datasets.map((dataset) => (
                <div
                  key={dataset.id}
                  className="brutalist-card"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-2xl font-black mb-2">
                        {dataset.name}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-bold text-muted-foreground">
                            타입
                          </p>
                          <p className="text-lg font-black">
                            {dataset.datasetType}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-muted-foreground">
                            레코드 수
                          </p>
                          <p className="text-lg font-black">
                            {dataset.totalRecords?.toLocaleString() || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-muted-foreground">
                            특징 수
                          </p>
                          <p className="text-lg font-black">
                            {dataset.features || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-muted-foreground">
                            파일 크기
                          </p>
                          <p className="text-lg font-black">
                            {dataset.fileSize
                              ? `${(dataset.fileSize / 1024 / 1024).toFixed(2)} MB`
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                      {dataset.description && (
                        <p className="text-lg font-bold mb-4">
                          {dataset.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-4 flex-shrink-0">
                      <Button className="brutalist-button py-4 px-6">
                        <Eye className="w-5 h-5" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(dataset.id)}
                        className="bg-destructive text-destructive-foreground border-4 border-destructive px-6 py-4 font-bold"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
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
