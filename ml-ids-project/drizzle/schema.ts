import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, json, boolean, datetime, longtext } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Datasets table - 네트워크 트래픽 데이터셋 저장
 * NSL-KDD, CICIDS2017 등의 데이터셋 메타데이터 관리
 */
export const datasets = mysqlTable("datasets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  datasetType: mysqlEnum("datasetType", ["NSL-KDD", "CICIDS2017", "UNSW-NB15", "KDD99", "CUSTOM"]).notNull(),
  filePath: varchar("filePath", { length: 512 }).notNull(),
  fileSize: int("fileSize"), // bytes
  totalRecords: int("totalRecords"),
  features: int("features"), // 특징 개수
  trainingRecords: int("trainingRecords"),
  testingRecords: int("testingRecords"),
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Dataset = typeof datasets.$inferSelect;
export type InsertDataset = typeof datasets.$inferInsert;

/**
 * Models table - 머신러닝 모델 저장
 * Random Forest, SVM, Neural Network 등의 모델 메타데이터
 */
export const models = mysqlTable("models", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  datasetId: int("datasetId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  modelType: mysqlEnum("modelType", ["RandomForest", "SVM", "NeuralNetwork", "GradientBoosting", "KNN", "DecisionTree", "Ensemble"]).notNull(),
  modelPath: varchar("modelPath", { length: 512 }).notNull(), // S3 경로
  hyperparameters: json("hyperparameters"), // JSON 형식의 하이퍼파라미터
  accuracy: decimal("accuracy", { precision: 5, scale: 4 }),
  precision: decimal("precision", { precision: 5, scale: 4 }),
  recall: decimal("recall", { precision: 5, scale: 4 }),
  f1Score: decimal("f1Score", { precision: 5, scale: 4 }),
  auc: decimal("auc", { precision: 5, scale: 4 }),
  trainingTime: int("trainingTime"), // 초 단위
  isActive: boolean("isActive").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Model = typeof models.$inferSelect;
export type InsertModel = typeof models.$inferInsert;

/**
 * Experiments table - 모델 학습 실험 결과 저장
 * 서로 다른 파라미터로 진행한 실험들의 기록
 */
export const experiments = mysqlTable("experiments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  modelId: int("modelId").notNull(),
  datasetId: int("datasetId").notNull(),
  experimentName: varchar("experimentName", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["PENDING", "RUNNING", "COMPLETED", "FAILED"]).default("PENDING"),
  hyperparameters: json("hyperparameters"), // 실험에 사용된 하이퍼파라미터
  results: json("results"), // 실험 결과 (accuracy, precision, recall, f1, auc 등)
  confusionMatrix: json("confusionMatrix"), // 혼동 행렬
  featureImportance: json("featureImportance"), // 특징 중요도
  trainingTime: int("trainingTime"), // 초 단위
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Experiment = typeof experiments.$inferSelect;
export type InsertExperiment = typeof experiments.$inferInsert;

/**
 * Alerts table - 탐지된 침입 위협 알림
 * 실시간 분석 중 탐지된 비정상 트래픽
 */
export const alerts = mysqlTable("alerts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  modelId: int("modelId").notNull(),
  severity: mysqlEnum("severity", ["LOW", "MEDIUM", "HIGH", "CRITICAL"]).notNull(),
  attackType: mysqlEnum("attackType", ["DDoS", "PortScanning", "SQLInjection", "BufferOverflow", "Backdoor", "Reconnaissance", "Exploitation", "Unknown"]).notNull(),
  sourceIP: varchar("sourceIP", { length: 45 }),
  destinationIP: varchar("destinationIP", { length: 45 }),
  sourcePort: int("sourcePort"),
  destinationPort: int("destinationPort"),
  protocol: varchar("protocol", { length: 10 }),
  confidence: decimal("confidence", { precision: 5, scale: 4 }), // 0~1 사이의 신뢰도
  description: text("description"),
  trafficData: json("trafficData"), // 트래픽 특징 데이터
  isResolved: boolean("isResolved").default(false),
  resolvedAt: timestamp("resolvedAt"),
  notes: text("notes"),
  detectedAt: timestamp("detectedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = typeof alerts.$inferInsert;

/**
 * TrafficLogs table - 네트워크 트래픽 로그
 * 실시간 모니터링 중 수집된 트래픽 데이터
 */
export const trafficLogs = mysqlTable("trafficLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  modelId: int("modelId"),
  sourceIP: varchar("sourceIP", { length: 45 }).notNull(),
  destinationIP: varchar("destinationIP", { length: 45 }).notNull(),
  sourcePort: int("sourcePort"),
  destinationPort: int("destinationPort"),
  protocol: varchar("protocol", { length: 10 }),
  packetCount: int("packetCount"),
  byteCount: int("byteCount"),
  duration: decimal("duration", { precision: 10, scale: 4 }), // 초 단위
  features: json("features"), // 추출된 특징들
  prediction: mysqlEnum("prediction", ["NORMAL", "ANOMALY"]),
  confidence: decimal("confidence", { precision: 5, scale: 4 }),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TrafficLog = typeof trafficLogs.$inferSelect;
export type InsertTrafficLog = typeof trafficLogs.$inferInsert;

/**
 * FeatureEngineering table - 특징 추출 및 전처리 기록
 * 데이터 전처리 과정의 메타데이터 저장
 */
export const featureEngineering = mysqlTable("featureEngineering", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  datasetId: int("datasetId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  originalFeatures: int("originalFeatures"),
  processedFeatures: int("processedFeatures"),
  preprocessingSteps: json("preprocessingSteps"), // 전처리 단계들
  normalizationMethod: varchar("normalizationMethod", { length: 100 }),
  featureSelection: json("featureSelection"), // 선택된 특징들
  scalingMethod: varchar("scalingMethod", { length: 100 }),
  missingValueHandling: varchar("missingValueHandling", { length: 100 }),
  outlierHandling: varchar("outlierHandling", { length: 100 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FeatureEngineering = typeof featureEngineering.$inferSelect;
export type InsertFeatureEngineering = typeof featureEngineering.$inferInsert;