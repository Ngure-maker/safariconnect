import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig: any = {
  user: process.env.DB_USER || 'postgres',
  database: process.env.DB_NAME || 'safariconnect',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbPassword = process.env.DB_PASSWORD;

if (dbHost) dbConfig.host = dbHost;
if (dbPort) dbConfig.port = parseInt(dbPort);
if (dbPassword) dbConfig.password = dbPassword;

const pool = new Pool(dbConfig);

export const getConnection = async () => {
  return pool.connect();
};

export const query = async (text: string, params?: any[]) => {
  if (params && params.length > 0) {
    let idx = 0;
    text = text.replace(/\?/g, () => `$${++idx}`);
  }
  const result = await pool.query(text, params);
  const wrapper = result.rows as any;
  wrapper.rowCount = result.rowCount;
  if (result.rows.length > 0 && result.rows[0]?.id) {
    wrapper.insertId = result.rows[0].id;
  }
  return wrapper;
};

export default pool;
