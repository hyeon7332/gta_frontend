// 응답 객체에서 배열 목록만 안전하게 추출
export function extractList(data)
{
  return (
    (Array.isArray(data?.items) && data.items) ||
    (Array.isArray(data?.list) && data.list) ||
    (Array.isArray(data?.content) && data.content) ||
    (Array.isArray(data?.data) && data.data) ||
    (Array.isArray(data) && data) ||
    []
  )
}

// 보유 이동수단 응답 1건을 화면용 구조로 변환
export function normalizeOwnedTransport(x)
{
  return {
    id: x.id ?? x.ownedTransportId ?? x.ownedId ?? x.transportId,
    garageId: x.garageId ?? x.garage_id ?? null,
    garage: x.garageName ?? x.garage_name ?? x.garage ?? x.storage ?? '-',
    slot: x.slot ?? x.slotNo ?? x.slot_no ?? null,
    storageType: x.storageType ?? x.storage_type ?? '',
    remark: x.remark ?? x.memo ?? x.note ?? '',
    manufacturer: x.manufacturer ?? x.maker ?? x.brand ?? x.manufacturerName ?? '-',
    name: x.name ?? x.modelName ?? x.transportName ?? '-',
    upgradeType: x.upgradeType ?? x.upgrade_type ?? '',
    upgradeLocation: x.upgradeLocation ?? x.upgrade_location ?? '',
    category: x.category ?? x.transportCategory ?? x.className ?? x.class ?? '-',
    price: x.price ?? x.priceNumber ?? x.cost ?? null,
    releaseDate: x.releaseDate ?? x.release_date ?? '-',
    lapTime: x.lapTime ?? x.lap_time ?? null,
    topSpeed: x.topSpeed ?? x.top_speed ?? null,
    lapRank: x.lapRank ?? x.lap_rank ?? null,
    speedRank: x.speedRank ?? x.speed_rank ?? null,
    lapCategoryRank: x.lapCategoryRank ?? x.lap_category_rank ?? null,
    speedCategoryRank: x.speedCategoryRank ?? x.speed_category_rank ?? null,
    lapTotalCount: x.lapTotalCount ?? x.lap_total_count ?? null,
    lapCategoryTotalCount: x.lapCategoryTotalCount ?? x.lap_category_total_count ?? null,
    speedTotalCount: x.speedTotalCount ?? x.speed_total_count ?? null,
    speedCategoryTotalCount: x.speedCategoryTotalCount ?? x.speed_category_total_count ?? null,
    source: x.source ?? x.source_name ?? x.obtainSource ?? '-',
    weight: x.weight ?? x.weight_kg ?? null,
    driveTrain: x.driveTrain ?? x.drive_train ?? '-',
    seats: x.seats ?? null,
    features: x.features ?? ''
  }
}

// 차고 응답 1건을 화면용 구조로 변환
export function normalizeGarage(x)
{
  return {
    garageId: x.garageId ?? x.id ?? x.garage_id,
    garageName: x.garageName ?? x.name ?? x.garage ?? x.garage_name ?? '-',
    slotCount: Number(x.slotCount ?? x.slot_count ?? x.totalSlots ?? x.capacity ?? 0),

    alias: x.alias ?? null,
    description: x.description ?? null,
    collapsedYn: x.collapsedYn ?? x.collapsed_yn ?? 'N'
  }
}

// 이동수단 옵션 응답 1건을 화면용 구조로 변환
export function normalizeTransportModel(x)
{
  return {
    modelId: x.modelId ?? x.model_id ?? x.id ?? null,
    manufacturer: x.manufacturer ?? x.maker ?? x.brand ?? '',
    name: x.name ?? x.modelName ?? x.transportName ?? '',
    upgradeType: x.upgradeType ?? x.upgrade_type ?? '',
    features: x.features ?? ''
  }
}