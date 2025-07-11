import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid } from '@mui/material'

import RAMType from '../../../constant/objectTypes/RAMType'
import SelectElement from '../../common/components/SelectElement'
import { generateRAMSelectElement } from '../../common/utils/generateSelectElements'

import { RAM_FILTER_INIT_DATA } from '../data/FilterInitData'
import { generateRAMName } from '../../../utils/LabelHelper'
import { ComparisonObject } from '../data/ComparisonObject'
import { getLocalizedPriceNum } from '../../../utils/NumberHelper'
import HardwareSuggestion from './HardwarePage'

type RAMSuggestionProps = {
  ramList: RAMType[]
  isLoading: boolean
}

const RAMSuggestion = ({ ramList, isLoading }: RAMSuggestionProps) => {
  const { t } = useTranslation()
  const [filterLogic, setFilterLogic] = useState(RAM_FILTER_INIT_DATA)

  // 过滤逻辑
  const filteredList = useMemo(
    () =>
      ramList.filter((item) => {
        let isMatch = true

        // 型号过滤
        if (filterLogic.id) {
          isMatch = item.id === filterLogic.id
        }

        // 品牌过滤
        if (filterLogic.brand && isMatch) {
          isMatch = item.brand === filterLogic.brand
        }

        // 代际过滤
        if (filterLogic.generation && isMatch) {
          isMatch = item.type === filterLogic.generation
        }

        // 价格过滤
        if (filterLogic.price > 0 && isMatch) {
          isMatch = getLocalizedPriceNum(item) <= filterLogic.price
        }

        return isMatch
      }),
    [ramList, filterLogic]
  )

  // 比较对象生成
  const buildComparisonObjects = (
    selectedItems: RAMType[]
  ): ComparisonObject[] => {
    return selectedItems.map((item) => {
      const specs = {
        capacity: item.capacity,
        speed: item.speed,
        timing: item.timing,
        rgb: item.led,
      }

      // 获取比较基准值
      const maxCapacity = Math.max(...selectedItems.map((ram) => ram.capacity))
      const maxSpeed = Math.max(...selectedItems.map((ram) => ram.speed))
      const minTiming = Math.min(
        ...selectedItems.map((ram) => parseTiming(ram.timing))
      )

      return {
        img: item.img,
        name: generateRAMName(item),
        id: item.id,
        items: [
          {
            label: 'capacity',
            value: `${specs.capacity}GB`,
            isHighlight: specs.capacity === maxCapacity,
          },
          {
            label: 'ram-frequency',
            value: `${specs.speed}MHz`,
            isHighlight: specs.speed === maxSpeed,
          },
          {
            label: 'ram-timing',
            value: formatTiming(specs.timing),
            isHighlight: parseTiming(specs.timing) === minTiming,
          },
          {
            label: 'is-rgb',
            value: specs.rgb ? t('yes') : t('no'),
            isHighlight: !!specs.rgb,
          },
        ],
      }
    })
  }

  return (
    <HardwareSuggestion<RAMType>
      filteredList={filteredList}
      isLoading={isLoading}
      buildComparisonObjects={buildComparisonObjects}
      renderFilterForm={
        <Grid>
          <SelectElement
            label={t('ram')}
            options={generateRAMSelectElement(ramList)}
            selectChange={(id) => setFilterLogic((prev) => ({ ...prev, id }))}
            value={filterLogic.id}
            isLoading={isLoading}
          />
        </Grid>
      }
    />
  )
}

// 辅助函数
const parseTiming = (timing: string) => {
  const numbers = timing?.split('-').map(Number) || [99]
  return numbers.reduce((a, b) => a + b, 0)
}

const formatTiming = (timing?: string) => {
  return timing ? `CL${timing}` : '-'
}

export default RAMSuggestion
