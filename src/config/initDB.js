import pool from "./db.js";
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync } from 'node:fs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const queryPath = join(__dirname, 'initDB.sql') 
const query = readFileSync(queryPath, 'utf8')

try {
  await pool.query(query)
  console.log("Database init completed");
} catch(e) {
  console.log('Init database error');
  console.log(e);
}