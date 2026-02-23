// @ts-expect-error: pg does not have types installed
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export default pool;
