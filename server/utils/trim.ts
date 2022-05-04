export default function trimForm<T>(form: Record<string, unknown>): T {
  return Object.keys(form).reduce((acc, curr) => {
    acc[curr] = trimItem(form[curr])
    return acc
  }, {} as T)
}

function trimItem(value: unknown): unknown {
  if (typeof value === 'string') {
    return value.trim()
  }
  if (Array.isArray(value)) {
    return value.map(item => trimItem(item))
  }
  if (typeof value === 'object') {
    return trimForm(value as Record<string, unknown>)
  }
  return value
}
