import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import pg from 'pg'

dotenv.config({ path: fileURLToPath(new URL('../../.env', import.meta.url)) })

const schemaPath = fileURLToPath(new URL('../schema.sql', import.meta.url))
let schemaPromise

export function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required. Copy .env.example to .env and configure PostgreSQL.')
  }

  if (!globalThis.sidamaPool) {
    const { Pool } = pg
    globalThis.sidamaPool = new Pool({ connectionString: process.env.DATABASE_URL })
  }

  return globalThis.sidamaPool
}

export async function initializeDatabase() {
  if (!schemaPromise) {
    schemaPromise = readFile(schemaPath, 'utf8')
      .then((schema) => getPool().query(schema))
      .catch((error) => {
        schemaPromise = undefined
        throw error
      })
  }

  return schemaPromise
}
