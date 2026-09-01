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

/** 리스트용 썸네일 URL */
export function resolveThumbnailUrl(imageUrl)
{
  if (!imageUrl) {
    return ''
  }

  let url = imageUrl

  if (!(url.startsWith('http://') || url.startsWith('https://'))) {
    url = import.meta.env.VITE_FILE_BASE_URL + url
  }

  const dot = url.lastIndexOf('.')

  if (dot === -1) {
    return url
  }

  return url.substring(0, dot) + '_thumb' + url.substring(dot)
}

/** 특징 코드 배지 표시명 매핑 */
export const featureBadgeDisplayMap = {
  HSW: 'HSW',
  DRF: 'Drift',
  ARE: 'Arena',
  BEN: "Benny's"
}

/** 특징 코드에서 리스트/상세용 배지 목록 생성 */
export function formatFeatureBadges(features)
{
  if (!features || features.trim() === '') {
    return []
  }

  return features
    .split(',')
    .map((item) => {
      return item.trim()
    })
    .filter((item) => {
      return featureBadgeDisplayMap[item]
    })
    .map((item) => {
      return featureBadgeDisplayMap[item]
    })
}

/** 다중 선택 콤보박스 표시 형식 */
export function formatMultiSelectLabel(list, defaultLabel) {
  if (!list || list.length === 0) {
    return defaultLabel
  }

  if (list.length === 1) {
    return list[0]
  }

  return `${list[0]} 외 ${list.length - 1}건`
}