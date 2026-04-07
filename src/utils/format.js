export function formatNumber(n)
{
  const num = Number(n)
  if (!Number.isFinite(num)) {
    return '-'
  }
  return num.toLocaleString()
}

export function formatDate(date)
{
  if (!date) {
    return '-'
  }

  return String(date).replace('T', ' ').substring(0, 16)
}