import pool from "./db.js";
import { writeFileSync } from 'node:fs'

const query = writeFileSync('initDB.sql')
try {
  await pool.query(query)
} catch(e) {
  console.log('Init database error');
  console.log(e);
}