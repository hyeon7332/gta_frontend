/** 숫자를 3자리 콤마 형식으로 변환 */
export function formatNumber(n)
{
  const num = Number(n)
  if (!Number.isFinite(num)) {
    return '-'
  }
  return num.toLocaleString()
}

/** 금액을 달러($) + 3자리 콤마 형식으로 변환 */
export function formatCurrencyUSD(value)
{
  if (value === null || value === undefined || value === '') {
    return '-'
  }

  return '$' + Number(value).toLocaleString()
}

/** 날짜 + 시간을 yyyy-MM-dd HH:mm 형식으로 변환 */
export function formatDateTime(date)
{
  if (!date) {
    return '-'
  }

  return String(date).replace('T', ' ').substring(0, 16)
}

/** 날짜를 yyyy-MM-dd 형식으로 변환 */
export function formatDate(date)
{
  if (!date) {
    return '-'
  }

  return String(date).substring(0, 10)
}

/** 속도를 km/h 기준 소수점 2자리로 변환 */
export function formatSpeed(value)
{
  if (!value) {
    return '-'
  }

  const num = Number(value)

  if (!Number.isFinite(num)) {
    return '-'
  }

  return `${num.toFixed(2)} km/h`
}
