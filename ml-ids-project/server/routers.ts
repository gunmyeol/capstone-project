import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ==================== Dataset Router ====================
  dataset: router({
    // 데이터셋 생성
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        datasetType: z.enum(["NSL-KDD", "CICIDS2017", "UNSW-NB15", "KDD99", "CUSTOM"]),
        filePath: z.string(),
        fileSize: z.number().optional(),
        totalRecords: z.number().optional(),
        features: z.number().optional(),
        trainingRecords: z.number().optional(),
        testingRecords: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          await db.createDataset({
            userId: ctx.user.id,
            ...input,
          } as any);
          return { success: true, message: "Dataset created successfully" };
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create dataset",
          });
        }
      }),

    // 사용자의 모든 데이터셋 조회
    list: protectedProcedure.query(async ({ ctx }) => {
      try {
        return await db.getUserDatasets(ctx.user.id);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch datasets",
        });
      }
    }),

    // 특정 데이터셋 조회
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        try {
          const dataset = await db.getDatasetById(input.id, ctx.user.id);
          if (!dataset) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Dataset not found",
            });
          }
          return dataset;
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch dataset",
          });
        }
      }),

    // 데이터셋 삭제
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        try {
          await db.deleteDataset(input.id, ctx.user.id);
          return { success: true, message: "Dataset deleted successfully" };
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete dataset",
          });
        }
      }),
  }),

  // ==================== Model Router ====================
  model: router({
    // 모델 생성
    create: protectedProcedure
      .input(z.object({
        datasetId: z.number(),
        name: z.string().min(1),
        description: z.string().optional(),
        modelType: z.enum(["RandomForest", "SVM", "NeuralNetwork", "GradientBoosting", "KNN", "DecisionTree", "Ensemble"]),
        modelPath: z.string(),
        hyperparameters: z.record(z.string(), z.any()).optional(),
        accuracy: z.string().optional(),
        precision: z.string().optional(),
        recall: z.string().optional(),
        f1Score: z.string().optional(),
        auc: z.string().optional(),
        trainingTime: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          await db.createModel({
            userId: ctx.user.id,
            ...input,
          } as any);
          return { success: true, message: "Model created successfully" };
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create model",
          });
        }
      }),

    // 사용자의 모든 모델 조회
    list: protectedProcedure.query(async ({ ctx }) => {
      try {
        return await db.getUserModels(ctx.user.id);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch models",
        });
      }
    }),

    // 특정 모델 조회
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        try {
          const model = await db.getModelById(input.id, ctx.user.id);
          if (!model) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Model not found",
            });
          }
          return model;
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch model",
          });
        }
      }),

    // 활성 모델 조회
    getActive: protectedProcedure.query(async ({ ctx }) => {
      try {
        return await db.getActiveModel(ctx.user.id);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch active model",
        });
      }
    }),

    // 모델 활성화
    activate: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        try {
          // 기존 활성 모델 비활성화
          const activeModel = await db.getActiveModel(ctx.user.id);
          if (activeModel) {
            await db.updateModel(activeModel.id, ctx.user.id, { isActive: false });
          }

          // 새 모델 활성화
          await db.updateModel(input.id, ctx.user.id, { isActive: true });
          return { success: true, message: "Model activated successfully" };
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to activate model",
          });
        }
      }),
  }),

  // ==================== Experiment Router ====================
  experiment: router({
    // 실험 생성
    create: protectedProcedure
      .input(z.object({
        modelId: z.number(),
        datasetId: z.number(),
        experimentName: z.string().min(1),
        description: z.string().optional(),
        hyperparameters: z.record(z.string(), z.any()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          await db.createExperiment({
            userId: ctx.user.id,
            status: "PENDING",
            ...input,
          } as any);
          return { success: true, message: "Experiment created successfully" };
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create experiment",
          });
        }
      }),

    // 사용자의 모든 실험 조회
    list: protectedProcedure.query(async ({ ctx }) => {
      try {
        return await db.getUserExperiments(ctx.user.id);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch experiments",
        });
      }
    }),

    // 특정 실험 조회
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        try {
          const experiment = await db.getExperimentById(input.id, ctx.user.id);
          if (!experiment) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Experiment not found",
            });
          }
          return experiment;
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch experiment",
          });
        }
      }),

    // 모델의 모든 실험 조회
    getByModel: protectedProcedure
      .input(z.object({ modelId: z.number() }))
      .query(async ({ ctx, input }) => {
        try {
          return await db.getModelExperiments(input.modelId, ctx.user.id);
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch model experiments",
          });
        }
      }),

    // 실험 결과 업데이트
    updateResults: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["PENDING", "RUNNING", "COMPLETED", "FAILED"]),
        results: z.record(z.string(), z.any()).optional(),
        confusionMatrix: z.record(z.string(), z.any()).optional(),
        featureImportance: z.record(z.string(), z.any()).optional(),
        trainingTime: z.number().optional(),
        completedAt: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          const { id, ...updateData } = input;
          await db.updateExperiment(id, ctx.user.id, updateData as any);
          return { success: true, message: "Experiment updated successfully" };
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update experiment",
          });
        }
      }),
  }),

  // ==================== Alert Router ====================
  alert: router({
    // 알림 생성
    create: protectedProcedure
      .input(z.object({
        modelId: z.number(),
        severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
        attackType: z.enum(["DDoS", "PortScanning", "SQLInjection", "BufferOverflow", "Backdoor", "Reconnaissance", "Exploitation", "Unknown"]),
        sourceIP: z.string().optional(),
        destinationIP: z.string().optional(),
        sourcePort: z.number().optional(),
        destinationPort: z.number().optional(),
        protocol: z.string().optional(),
        confidence: z.string().optional(),
        description: z.string().optional(),
        trafficData: z.record(z.string(), z.any()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          await db.createAlert({
            userId: ctx.user.id,
            detectedAt: new Date(),
            ...input,
          } as any);
          return { success: true, message: "Alert created successfully" };
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create alert",
          });
        }
      }),

    // 사용자의 모든 알림 조회
    list: protectedProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        try {
          return await db.getUserAlerts(ctx.user.id, input.limit || 100);
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch alerts",
          });
        }
      }),

    // 미해결 알림만 조회
    getUnresolved: protectedProcedure.query(async ({ ctx }) => {
      try {
        return await db.getUnresolvedAlerts(ctx.user.id);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch unresolved alerts",
        });
      }
    }),

    // 특정 알림 조회
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        try {
          const alert = await db.getAlertById(input.id, ctx.user.id);
          if (!alert) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Alert not found",
            });
          }
          return alert;
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch alert",
          });
        }
      }),

    // 알림 해결 표시
    resolve: protectedProcedure
      .input(z.object({ id: z.number(), notes: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        try {
          await db.updateAlert(input.id, ctx.user.id, {
            isResolved: true,
            resolvedAt: new Date(),
            notes: input.notes,
          });
          return { success: true, message: "Alert resolved successfully" };
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to resolve alert",
          });
        }
      }),
  }),

  // ==================== TrafficLog Router ====================
  trafficLog: router({
    // 트래픽 로그 생성
    create: protectedProcedure
      .input(z.object({
        modelId: z.number().optional(),
        sourceIP: z.string(),
        destinationIP: z.string(),
        sourcePort: z.number().optional(),
        destinationPort: z.number().optional(),
        protocol: z.string().optional(),
        packetCount: z.number().optional(),
        byteCount: z.number().optional(),
        duration: z.string().optional(),
        features: z.record(z.string(), z.any()).optional(),
        prediction: z.enum(["NORMAL", "ANOMALY"]).optional(),
        confidence: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          await db.createTrafficLog({
            userId: ctx.user.id,
            timestamp: new Date(),
            ...input,
          } as any);
          return { success: true, message: "Traffic log created successfully" };
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create traffic log",
          });
        }
      }),

    // 사용자의 모든 트래픽 로그 조회
    list: protectedProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        try {
          return await db.getUserTrafficLogs(ctx.user.id, input.limit || 1000);
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch traffic logs",
          });
        }
      }),

    // 특정 트래픽 로그 조회
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        try {
          const log = await db.getTrafficLogById(input.id, ctx.user.id);
          if (!log) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Traffic log not found",
            });
          }
          return log;
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch traffic log",
          });
        }
      }),
  }),

  // ==================== FeatureEngineering Router ====================
  featureEngineering: router({
    // 특징 엔지니어링 기록 생성
    create: protectedProcedure
      .input(z.object({
        datasetId: z.number(),
        name: z.string().min(1),
        description: z.string().optional(),
        originalFeatures: z.number().optional(),
        processedFeatures: z.number().optional(),
        preprocessingSteps: z.record(z.string(), z.any()).optional(),
        normalizationMethod: z.string().optional(),
        featureSelection: z.record(z.string(), z.any()).optional(),
        scalingMethod: z.string().optional(),
        missingValueHandling: z.string().optional(),
        outlierHandling: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          await db.createFeatureEngineering({
            userId: ctx.user.id,
            ...input,
          } as any);
          return { success: true, message: "Feature engineering record created successfully" };
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create feature engineering record",
          });
        }
      }),

    // 사용자의 모든 특징 엔지니어링 기록 조회
    list: protectedProcedure.query(async ({ ctx }) => {
      try {
        return await db.getUserFeatureEngineering(ctx.user.id);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch feature engineering records",
        });
      }
    }),

    // 특정 데이터셋의 특징 엔지니어링 기록 조회
    getByDataset: protectedProcedure
      .input(z.object({ datasetId: z.number() }))
      .query(async ({ ctx, input }) => {
        try {
          return await db.getFeatureEngineeringByDataset(input.datasetId, ctx.user.id);
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch feature engineering record",
          });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
