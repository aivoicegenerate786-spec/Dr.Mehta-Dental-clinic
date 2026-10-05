import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool = databaseUrl 
  ? (globalForDb.__arenaNextJsPostgresqlPool ?? new Pool({ connectionString: databaseUrl }))
  : ({} as Pool);

if (process.env.NODE_ENV !== "production" && databaseUrl) {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

// Mock DB implementation for local preview when no database is configured
const mockDb = {
  select: () => mockDb,
  from: () => mockDb,
  where: () => mockDb,
  orderBy: () => mockDb,
  limit: () => [],
  insert: () => mockDb,
  values: () => mockDb,
  set: () => mockDb,
  returning: () => [],
  then: (resolve: any) => resolve([]),
  transaction: async (cb: any) => cb(mockDb),
};

export const db = databaseUrl ? drizzle(pool) : (mockDb as any);
