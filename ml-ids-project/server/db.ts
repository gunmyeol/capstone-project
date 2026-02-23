import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, datasets, models, experiments, alerts, trafficLogs, featureEngineering } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ==================== Dataset Queries ====================

export async function createDataset(data: typeof datasets.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(datasets).values(data);
  return result;
}

export async function getUserDatasets(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(datasets).where(eq(datasets.userId, userId)).orderBy(desc(datasets.createdAt));
}

export async function getDatasetById(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(datasets).where(and(eq(datasets.id, id), eq(datasets.userId, userId))).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function deleteDataset(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.delete(datasets).where(and(eq(datasets.id, id), eq(datasets.userId, userId)));
}

// ==================== Model Queries ====================

export async function createModel(data: typeof models.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(models).values(data);
  return result;
}

export async function getUserModels(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(models).where(eq(models.userId, userId)).orderBy(desc(models.createdAt));
}

export async function getModelById(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(models).where(and(eq(models.id, id), eq(models.userId, userId))).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateModel(id: number, userId: number, data?: Partial<typeof models.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(models).set(data || {}).where(and(eq(models.id, id), eq(models.userId, userId)));
}

export async function getActiveModel(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(models).where(and(eq(models.userId, userId), eq(models.isActive, true))).limit(1);
  return result.length > 0 ? result[0] : null;
}

// ==================== Experiment Queries ====================

export async function createExperiment(data: typeof experiments.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(experiments).values(data);
  return result;
}

export async function getUserExperiments(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(experiments).where(eq(experiments.userId, userId)).orderBy(desc(experiments.createdAt));
}

export async function getExperimentById(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(experiments).where(and(eq(experiments.id, id), eq(experiments.userId, userId))).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateExperiment(id: number, userId: number, data?: Partial<typeof experiments.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(experiments).set(data || {}).where(and(eq(experiments.id, id), eq(experiments.userId, userId)));
}

export async function getModelExperiments(modelId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(experiments).where(and(eq(experiments.modelId, modelId), eq(experiments.userId, userId))).orderBy(desc(experiments.createdAt));
}

// ==================== Alert Queries ====================

export async function createAlert(data: typeof alerts.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(alerts).values(data);
  return result;
}

export async function getUserAlerts(userId: number, limit: number = 100) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(alerts).where(eq(alerts.userId, userId)).orderBy(desc(alerts.detectedAt)).limit(limit);
}

export async function getAlertById(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(alerts).where(and(eq(alerts.id, id), eq(alerts.userId, userId))).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateAlert(id: number, userId: number, data?: Partial<typeof alerts.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(alerts).set(data || {}).where(and(eq(alerts.id, id), eq(alerts.userId, userId)));
}

export async function getUnresolvedAlerts(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(alerts).where(and(eq(alerts.userId, userId), eq(alerts.isResolved, false))).orderBy(desc(alerts.detectedAt));
}

// ==================== TrafficLog Queries ====================

export async function createTrafficLog(data: typeof trafficLogs.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(trafficLogs).values(data);
  return result;
}

export async function getUserTrafficLogs(userId: number, limit: number = 1000) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(trafficLogs).where(eq(trafficLogs.userId, userId)).orderBy(desc(trafficLogs.timestamp)).limit(limit);
}

export async function getTrafficLogById(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(trafficLogs).where(and(eq(trafficLogs.id, id), eq(trafficLogs.userId, userId))).limit(1);
  return result.length > 0 ? result[0] : null;
}

// ==================== FeatureEngineering Queries ====================

export async function createFeatureEngineering(data: typeof featureEngineering.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(featureEngineering).values(data);
  return result;
}

export async function getUserFeatureEngineering(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(featureEngineering).where(eq(featureEngineering.userId, userId)).orderBy(desc(featureEngineering.createdAt));
}

export async function getFeatureEngineeringByDataset(datasetId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(featureEngineering).where(and(eq(featureEngineering.datasetId, datasetId), eq(featureEngineering.userId, userId))).orderBy(desc(featureEngineering.createdAt));
  return result.length > 0 ? result[0] : null;
}
