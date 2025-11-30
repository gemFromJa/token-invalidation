#!/usr/bin/env node

// importJsonToPostgres.js
// Requires: `pg` (`npm install pg`)
require("dotenv").config({
  path: [".env.local", ".env"],
});

const { Pool } = require("pg");
const fs = require("fs");

// ---- CONFIG ----
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT),
});

// Path to JSON file (or pass via CLI: node script.js ./data.json)
const jsonFile = process.argv[2];

if (!jsonFile) {
  console.log(
    "Error: missing argument [file]\n\nusage:",
    "node",
    __filename,
    "/path/to/file"
  );
  process.exit(1);
}

(async () => {
  try {
    // load JSON
    const raw = fs.readFileSync(jsonFile, "utf8");
    const data = JSON.parse(raw);

    if (!Array.isArray(data)) {
      throw new Error("JSON root must be an array of objects.");
    }

    console.log(`Loaded ${data.length} records.`);

    // Example insert (modify to match your schema)
    // Assuming table: my_table(id, name, value)
    const insertQuery = `
      INSERT INTO public.sales_team (first_name, last_name, email, calls, average_ratings)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO NOTHING;
    `;

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      for (const record of data) {
        const { first_name, last_name, email, calls, average_rating } = record;

        // Basic validation
        if (!first_name || !last_name || !email || !calls || !average_rating) {
          console.warn("Skipping invalid record:", record);
          continue;
        }

        await client.query(insertQuery, [
          first_name,
          last_name,
          email,
          calls,
          average_rating,
        ]);
      }

      await client.query("COMMIT");
      console.log("Import completed successfully.");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await pool.end();
  }
})();
