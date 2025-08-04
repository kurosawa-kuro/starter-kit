#!/usr/bin/env node
// cli.js — Minimal Neon Todo CLI (no external CLI libraries)
// ==========================================================
// Usage:
//   node cli.js list
//   node cli.js add "買い物へ行く"
//
// Requirements:
//   Node.js ≥18 (top‑level await + fetch)
//   npm install @neondatabase/serverless dotenv
//
// .env (project root):
//   DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require
// -----------------------------------------------------------

import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error("❌  DATABASE_URL is not set in .env");
  process.exit(1);
}

// Tagged‑template SQL client
const sql = neon(process.env.DATABASE_URL);

// Ensure table exists
await sql`CREATE TABLE IF NOT EXISTS todo (
  id    SERIAL PRIMARY KEY,
  title TEXT NOT NULL
);`;

// -----------------------------------------------------------
// Simple argv parsing (no external deps)
// -----------------------------------------------------------
const [, , command, ...rest] = process.argv;

switch (command) {
  case "list": {
    const rows = await sql`SELECT id, title FROM todo ORDER BY id`;
    if (rows.length === 0) {
      console.log("(no todos)");
    } else {
      rows.forEach(r => console.log(`${r.id}: ${r.title}`));
    }
    break;
  }

  case "add": {
    const title = rest.join(" ").trim();
    if (!title) {
      console.error("Usage: node cli.js add <title>");
      process.exit(1);
    }
    const [{ id }] = await sql`INSERT INTO todo (title) VALUES (${title}) RETURNING id`;
    console.log(`✔ Added todo #${id}`);
    break;
  }

  default:
    console.log(`Usage:\n  node cli.js list\n  node cli.js add <title>`);
}
