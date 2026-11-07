import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const sql = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

