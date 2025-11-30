import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({ path: [".env, .env.local"] });

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT),
  // Optional: Set a max size for the pool
  max: 20,
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
});

// The pool will automatically use a ready connection for each query.
// You can also add event listeners for monitoring, e.g.,
pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export default {
  query: (text: string, params: any) => pool.query(text, params),
  pool, // Export the pool itself if needed
};
