import BuildConfig from '../constant/buildConfig';
import {
  MappedCPUType,
  MappedCaseType,
  MappedCoolerType,
} from '../constant/mappedObjectTypes'

export const selectBestCooler = (
  selectedCPU: MappedCPUType,
  selectedCase: MappedCaseType,
  coolerPool: MappedCoolerType[]
): MappedCoolerType | null => {
  // 1. 獲取所有推薦散熱器ID(平鋪所有預算等級的推薦)
  const suggestedCoolerIds = Object.values(BuildConfig.CPUCoolerFactor.CPUCoolerSuggestion)
    .flatMap(ids => ids);

  // 2. 從候選池篩選推薦散熱器並按價格排序
  const recommendedCoolers = coolerPool
    .filter(cooler => suggestedCoolerIds.includes(cooler.id) && cooler.price !== 0)
    .sort((a, b) => a.price - b.price);

  // 3. 優先檢查推薦散熱器的兼容性
  for (const recommended of recommendedCoolers) {
    if (validateCoolerCompatibility(recommended, selectedCPU, selectedCase)) {
      return recommended;
    }
  }

  // 4. 若無推薦散熱器可用，執行常規選擇邏輯
  const compatibleCoolers = coolerPool.filter(cooler => 
    validateCoolerCompatibility(cooler, selectedCPU, selectedCase)
  );

  return compatibleCoolers.sort((a, b) => a.price - b.price)[0] || null;
}

// 獨立兼容性驗證函式
const validateCoolerCompatibility = (
  cooler: MappedCoolerType,
  cpu: MappedCPUType,
  caze: MappedCaseType
): boolean => {
  // CPU插槽匹配驗證
  const socketMatch = cooler.sockets?.includes(cpu.socket) ?? false;

  // 機箱兼容性驗證
  let caseFit = true;
  if (cooler.isLiquidCooler) {
    caseFit = cooler.liquidCoolerSize <= caze.radiatorSupport;
  } else {
    caseFit = cooler.airCoolerHeight <= caze.maxCpuCoolorHeight;
  }

  return socketMatch && caseFit;
};