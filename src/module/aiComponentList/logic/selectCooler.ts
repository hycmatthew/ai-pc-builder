import {
  MappedCPUType,
  MappedCaseType,
  MappedCoolerType,
} from '../constant/mappedObjectTypes'

export const selectCooler = (
  selectedCPU: MappedCPUType,
  selectedCase: MappedCaseType, // 需先選擇機箱
  coolerPool: MappedCoolerType[]
): MappedCoolerType | null => {
  const compatibleCoolers = coolerPool.filter((cooler) => {
    // 基礎條件：CPU插槽匹配
    const socketMatch = cooler.sockets.includes(selectedCPU.socket)

    // 機箱兼容性驗證
    if (cooler.isLiquidCooler) {
      return cooler.liquidCoolerSize <= selectedCase.radiatorSupport
    } else {
      return cooler.airCoolerHeight <= selectedCase.maxCpuCoolorHeight
    }
  })

  // 返回最便宜且兼容的散熱器（轉換價格為數字）
  return (
    compatibleCoolers.sort((a, b) => a.price - b.price)[0] || null
  )
}
