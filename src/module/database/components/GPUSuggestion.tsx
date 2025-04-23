import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid2 as Grid } from '@mui/material'

import GPUType from '../../../constant/objectTypes/GPUType'
import SelectElement from '../../common/components/SelectElement'
import { generateGPUSelectElement } from '../../common/utils/generateSelectElements'
import SelectFilter from '../../common/components/SelectFilter'
import {
  getGPUManufacturer,
  getGPUType,
} from '../../../utils/GroupCategoryHelper'
import {
  convertLocalizedPrice,
  getLocalizedPriceNum,
} from '../../../utils/NumberHelper'

import { GPU_FILTER_INIT_DATA } from '../data/FilterInitData'
import { generateItemName } from '../../../utils/LabelHelper'
import { ComparisonObject } from '../data/ComparisonObject'
import HardwareSuggestion from './HardwarePage'

type GPUSuggestionProps = {
  gpuList: GPUType[]
  isLoading: boolean
}

const GPUSuggestion = ({ gpuList, isLoading }: GPUSuggestionProps) => {
  const { t } = useTranslation()
  const [filterLogic, setFilterLogic] = useState(GPU_FILTER_INIT_DATA)

  // 過濾邏輯
  const filteredList = useMemo(
    () =>
      gpuList.filter((item) => {
        let isMatch = true

        // 型號過濾
        if (filterLogic.model) {
          isMatch = item.Name === filterLogic.model
        }

        // 品牌過濾
        if (filterLogic.brand && isMatch) {
          isMatch = item.Brand === filterLogic.brand
        }

        // 製造商過濾
        if (filterLogic.manufacturer && isMatch) {
          isMatch = item.Manufacturer === filterLogic.manufacturer
        }

        // GPU類型過濾
        if (filterLogic.gpu && isMatch) {
          isMatch = item.Series === filterLogic.gpu
        }

        // 價格過濾
        if (filterLogic.price > 0 && isMatch) {
          isMatch = getLocalizedPriceNum(item) <= filterLogic.price
        }

        return isMatch
      }),
    [gpuList, filterLogic]
  )

  // 比較對象生成
  const buildComparisonObjects = (
    selectedItems: GPUType[]
  ): ComparisonObject[] => {
    return selectedItems.map((item) => {
      const specs = {
        memorySize: item.MemorySize,
        memoryType: item.MemoryType,
        memoryBus: item.MemoryBus,
        benchmark: item.Benchmark,
        power: item.Power,
        length: item.Length,
      }

      // 獲取比較基準值
      const maxMemory = Math.max(...selectedItems.map((gpu) => gpu.MemorySize))
      const maxBus = Math.max(
        ...selectedItems.map((gpu) => parseMemoryBus(gpu.MemoryBus))
      )
      const maxBenchmark = Math.max(
        ...selectedItems.map((gpu) => gpu.Benchmark)
      )
      const minPower = Math.min(...selectedItems.map((gpu) => gpu.Power))
      const minLength = Math.min(...selectedItems.map((gpu) => gpu.Length))

      return {
        img: item.Img,
        name: generateItemName(item.Brand, item.Name),
        model: item.Name,
        items: [
          {
            label: 'gpu-memory-size',
            value: `${specs.memorySize}GB`,
            isHighlight: specs.memorySize === maxMemory,
          },
          {
            label: 'gpu-memory-type',
            value: specs.memoryType,
            isHighlight: false,
          },
          {
            label: 'gpu-memory-interface',
            value: specs.memoryBus,
            isHighlight: parseMemoryBus(specs.memoryBus) === maxBus,
          },
          {
            label: 'benchmark',
            value: `${specs.benchmark} pts`,
            isHighlight: specs.benchmark === maxBenchmark,
          },
          {
            label: 'power',
            value: `${specs.power}W`,
            isHighlight: specs.power === minPower,
          },
          {
            label: 'gpu-length',
            value: `${specs.length}mm`,
            isHighlight: specs.length === minLength,
          },
        ],
      }
    })
  }

  return (
    <HardwareSuggestion<GPUType>
      filteredList={filteredList}
      isLoading={isLoading}
      buildComparisonObjects={buildComparisonObjects}
      renderFilterForm={
        <>
          <Grid size={9}>
            <SelectElement
              label={t('graphic-card')}
              options={generateGPUSelectElement(gpuList)}
              selectChange={(model) =>
                setFilterLogic((prev) => ({ ...prev, model }))
              }
              isLoading={isLoading}
            />
          </Grid>
          <Grid size={6}>
            <SelectFilter
              label={t('manufacturer')}
              options={getGPUManufacturer(gpuList)}
              selectChange={(manufacturer) =>
                setFilterLogic((prev) => ({ ...prev, manufacturer }))
              }
            />
          </Grid>
          <Grid size={6}>
            <SelectFilter
              label={t('graphics-processing-unit')}
              options={getGPUType(gpuList)}
              selectChange={(gpu) =>
                setFilterLogic((prev) => ({ ...prev, gpu }))
              }
            />
          </Grid>
        </>
      }
      getItemLabel={(item) => generateItemName(item.Brand, item.Name)}
      getPriceLabel={(item) => convertLocalizedPrice(item)}
      getImgSrc={(item) => item.Img}
      getItemIdentifier={(item) => item.Name}
    />
  )
}

// 輔助函數
const parseMemoryBus = (bus: string) => {
  const match = bus.match(/\d+/)
  return match ? parseInt(match[0], 10) : 0
}

export default GPUSuggestion
