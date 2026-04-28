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

/** 개조타입 표시명 매핑 */
export const upgradeTypeDisplayMap = {
  'HSW': 'HSW',
  '드리프트': 'Drift',
  '아레나': 'Arena',
  '베니즈 커스텀': "Benny's"
}

/** 개조타입 표시 텍스트 생성 */
export function formatUpgradeType(upgradeType)
{
  if (!upgradeType || upgradeType.trim() === '') {
    return ''
  }

  const labels = upgradeType
    .split(',')
    .map((item) => {
      return item.trim()
    })
    .filter((item) => {
      return item !== ''
    })
    .map((item) => {
      if (item === '일반') {
        return ''
      }

      return upgradeTypeDisplayMap[item] ?? ''
    })
    .filter((item) => {
      return item !== ''
    })

  if (labels.length === 0) {
    return ''
  }

  return labels.join(' / ')
}

/** 서버에 저장된 이미지 상대경로를 전체 URL로 변환 */
export function resolveImageUrl(imageUrl)
{
  if (!imageUrl) {
    return ''
  }

  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }

  return import.meta.env.VITE_FILE_BASE_URL + imageUrl
}