const camelToSnake = (key: string) => key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
const snakeToCamel = (key: string) => key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase())

export function keysToSnake(value: unknown): unknown {
  if (value instanceof Date) return value.toISOString()
  if (Array.isArray(value)) return value.map(keysToSnake)
  if (!value || typeof value !== "object") return value
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [camelToSnake(key), keysToSnake(item)]))
}

export function keysToCamel(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(keysToCamel)
  if (!value || typeof value !== "object") return value
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [snakeToCamel(key), keysToCamel(item)]))
}
