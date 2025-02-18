import {
  MappedMotherboardType,
  MappedGPUType,
  MappedCaseType,
  MappedCoolerType,
} from '../constant/mappedObjectTypes'

export const selectBestCase = (
  selectedMB: MappedMotherboardType,
  selectedGPU: MappedGPUType | undefined,
  selectedCooler: MappedCoolerType | null,
  casePool: MappedCaseType[]
): MappedCaseType | null => {
  const compatibleCases = casePool.filter((caze) => {
    // 主板尺寸兼容性
    const mbFit = caze.compatibility.includes(selectedMB.formFactor)

    // 顯卡長度兼容性
    const gpuFit = selectedGPU ? selectedGPU.length <= caze.maxVGAlength : true

    let coolerFit = true
    if (selectedCooler && !selectedCooler.isLiquidCooler) {
      coolerFit = caze.maxCpuCoolorHeight >= selectedCooler.airCoolerHeight
    }
    if (selectedCooler && selectedCooler.isLiquidCooler) {
      coolerFit = caze.radiatorSupport >= selectedCooler.liquidCoolerSize
    }

    return mbFit && gpuFit && coolerFit
  })

  // 返回最便宜且兼容的機箱
  return compatibleCases.sort((a, b) => a.price - b.price)[0] || null
}
