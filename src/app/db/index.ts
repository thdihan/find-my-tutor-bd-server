import pg from 'pg';
import { config } from '../config/index.js';

const { Pool } = pg;

export const dbPool = new Pool({
  connectionString: config.databaseUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const query = async <T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<pg.QueryResult<T>> => {
  const start = Date.now();
  const res = await dbPool.query<T>(text, params);
  const duration = Date.now() - start;
  if (config.env === 'development') {
    console.log('[Database Query]', { text: text.trim().slice(0, 100), duration: `${duration}ms`, rows: res.rowCount });
  }
  return res;
};

export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    const result = await dbPool.query('SELECT 1 + 1 AS result');
    return result.rowCount !== null && result.rowCount > 0;
  } catch {
    if (config.env === 'development') {
      console.warn('[Database Notice]: PostgreSQL connection not established yet. Ensure PostgreSQL & PostGIS are running.');
    }
    return false;
  }
};
