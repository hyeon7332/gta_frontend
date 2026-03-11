export function formatNumber(n)
{
  const num = Number(n)
  if (!Number.isFinite(num)) {
    return '-'
  }
  return num.toLocaleString()
}

export function formatDate(yyyyMmDd)
{
  if (!yyyyMmDd) {
    return '-'
  }
  return String(yyyyMmDd)
}