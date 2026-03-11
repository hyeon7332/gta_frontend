import { http } from './http'

/**
 * 보유 리스트 조회
 * params:
 *  - keyword
 *  - category
 *  - sortKey (createdDesc | priceAsc | priceDesc | releaseDesc)
 *  - page (1부터)
 *  - size
 */
export function fetchOwnedList(params)
{
  return http.get('/api/owned-transports', { params })
}

export function deleteOwned(id)
{
  return http.delete(`/api/owned-transports/${id}`)
}