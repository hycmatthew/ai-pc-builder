import BuildConfig from '../constant/buildConfig'
import {
  MappedMotherboardType,
  MappedGPUType,
  MappedCaseType,
  MappedCoolerType,
} from '../constant/mappedObjectTypes'

export const selectBestCase = (
  selectedMB: MappedMotherboardType,
  selectedGPU: MappedGPUType | null,
  selectedCooler: MappedCoolerType | null,
  casePool: MappedCaseType[]
): MappedCaseType | null => {
  // 1. 获取所有推荐机箱ID
  const tempData = BuildConfig.CaseFactor.CaseSuggestion
  const suggestedCaseIds = [...tempData.ATX, ...tempData.mATX, ...tempData.EATX]

  // 2. 从候选池筛选出推荐机箱并按价格排序
  const recommendedCases = casePool
    .filter(
      (caseItem) =>
        suggestedCaseIds.includes(caseItem.id) && caseItem.price !== 0
    )
    .sort((a, b) => a.price - b.price)

  // 3. 优先检查推荐机箱的兼容性
  for (const recommendedCase of recommendedCases) {
    if (
      validateCaseCompatibility(
        recommendedCase,
        selectedMB,
        selectedGPU,
        selectedCooler
      )
    ) {
      return recommendedCase // 返回第一个通过验证的推荐机箱
    }
  }

  // 4. 如果没有推荐机箱通过验证，执行常规选择逻辑
  const compatibleCases = casePool.filter((caze) =>
    validateCaseCompatibility(caze, selectedMB, selectedGPU, selectedCooler)
  )

  // 返回最便宜的兼容机箱
  return compatibleCases.sort((a, b) => a.price - b.price)[0] || null
}

const validateCaseCompatibility = (
  caze: MappedCaseType,
  selectedMB: MappedMotherboardType,
  selectedGPU: MappedGPUType | null,
  selectedCooler: MappedCoolerType | null
): boolean => {
  // 主板尺寸验证
  const isMBCompatible =
    caze.compatibility?.includes(selectedMB.formFactor) ?? false

  // 显卡长度验证
  const isGPUCompatible = selectedGPU
    ? selectedGPU.length <= caze.maxVGAlength
    : true

  // 散热器验证
  let isCoolerCompatible = true
  if (selectedCooler) {
    if (selectedCooler.isLiquidCooler) {
      isCoolerCompatible =
        caze.radiatorSupport >= selectedCooler.liquidCoolerSize
    } else {
      isCoolerCompatible =
        caze.maxCpuCoolorHeight >= selectedCooler.airCoolerHeight
    }
  }

  return isMBCompatible && isGPUCompatible && isCoolerCompatible
}
