import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()
const baseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "")
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!baseUrl || !serviceKey) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for the one-time import")

const definitions = [
  ["projects", "project"], ["skills", "skill"], ["journey_timeline", "journeyItem"],
  ["contact_links", "contactLink"], ["floating_cards", "floatingCard"], ["messages", "message"],
  ["profile_settings", "profileSettings"],
] as const

const toCamel = (key: string) => key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase())
function normalize(row: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(row).filter(([key]) => key !== "updated_at").map(([key, value]) => [toCamel(key), value]))
}

async function fetchTable(table: string) {
  const response = await fetch(`${baseUrl}/rest/v1/${table}?select=*`, {
    headers: { apikey: serviceKey!, Authorization: `Bearer ${serviceKey}` },
  })
  if (response.status === 404) return []
  if (!response.ok) throw new Error(`Could not export ${table}: ${response.status} ${await response.text()}`)
  return await response.json() as Record<string, unknown>[]
}

async function main() {
  for (const [table, delegateName] of definitions) {
    const rows = await fetchTable(table)
    const delegate = (db as any)[delegateName]
    for (const raw of rows) {
      const data = normalize(raw)
      await delegate.upsert({ where: { id: data.id }, create: data, update: data })
    }
    console.log(`Imported ${rows.length} rows from ${table}`)
  }
}

main().finally(() => db.$disconnect())
