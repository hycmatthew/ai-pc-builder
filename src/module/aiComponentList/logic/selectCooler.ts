import {
  MappedCPUType,
  MappedCaseType,
  MappedCoolerType,
} from '../constant/mappedObjectTypes'

export const selectBestCooler = (
  selectedCPU: MappedCPUType,
  selectedCase: MappedCaseType, // 需先選擇機箱
  coolerPool: MappedCoolerType[]
): MappedCoolerType | null => {
  const compatibleCoolers = coolerPool.filter((cooler) => {
    // 基礎條件：CPU插槽匹配
    const socketMatch = cooler.sockets
      ? cooler.sockets.includes(selectedCPU.socket)
      : false

    // 機箱兼容性驗證
    let caseFit = true
    if (cooler.isLiquidCooler) {
      caseFit = cooler.liquidCoolerSize <= selectedCase.radiatorSupport
    } else {
      caseFit = cooler.airCoolerHeight <= selectedCase.maxCpuCoolorHeight
    }
    return socketMatch && caseFit
  })

  // 返回最便宜且兼容的散熱器（轉換價格為數字）
  return compatibleCoolers.sort((a, b) => a.price - b.price)[0] || null
}
