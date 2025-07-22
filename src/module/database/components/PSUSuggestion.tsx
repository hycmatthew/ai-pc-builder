import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid } from '@mui/material'

import PSUType from '../../../constant/objectTypes/PSUType'
import SelectElement from '../../common/components/SelectElement'
import { generatePSUSelectElement } from '../../common/utils/generateSelectElements'

import { PSU_FILTER_INIT_DATA } from '../data/FilterInitData'
import { generateItemName } from '../../../utils/LabelHelper'
import {
  getLocalizedPriceNum,
} from '../../../utils/NumberHelper'
import { ComparisonObject } from '../data/ComparisonObject'
import HardwareSuggestion from './HardwarePage'

type PSUSuggestionProps = {
  psuList: PSUType[]
  isLoading: boolean
}

const PSUSuggestion = ({ psuList, isLoading }: PSUSuggestionProps) => {
  const { t } = useTranslation()
  const [filterLogic, setFilterLogic] = useState(PSU_FILTER_INIT_DATA)

  // 过滤逻辑
  const filteredList = useMemo(
    () =>
      psuList.filter((item) => {
        let isMatch = true

        // 型号过滤
        if (filterLogic.id) {
          isMatch = item.id === filterLogic.id
        }

        // 品牌过滤
        if (filterLogic.brand && isMatch) {
          isMatch = item.brand === filterLogic.brand
        }

        // 功率过滤
        if (filterLogic.power > 0 && isMatch) {
          isMatch = item.wattage >= filterLogic.power
        }

        // 价格过滤
        if (filterLogic.price > 0 && isMatch) {
          isMatch = getLocalizedPriceNum(item) <= filterLogic.price
        }

        return isMatch
      }),
    [psuList, filterLogic]
  )

  // 比较对象生成
  const buildComparisonObjects = (
    selectedItems: PSUType[]
  ): ComparisonObject[] => {
    return selectedItems.map((item) => {
      const specs = {
        type: item.size,
        wattage: item.wattage,
        efficiency: item.efficiency,
        modular: item.modular,
        length: item.length,
      }

      // 比较基准值
      const maxWattage = Math.max(...selectedItems.map((psu) => psu.wattage))
      const maxEfficiency = Math.max(
        ...selectedItems.map((psu) => efficiencyToNumber(psu.efficiency))
      )
      const minLength = Math.min(...selectedItems.map((psu) => psu.length))

      return {
        img: item.img,
        name: generateItemName(item.brand, item.name),
        id: item.id,
        items: [
          {
            label: 'psu-size',
            value: specs.type,
            isHighlight: false,
          },
          {
            label: 'psu-wattage',
            value: `${specs.wattage}W`,
            isHighlight: specs.wattage === maxWattage,
          },
          {
            label: 'efficiency',
            value: specs.efficiency,
            isHighlight: efficiencyToNumber(specs.efficiency) === maxEfficiency,
          },
          {
            label: 'modular-design',
            value: t(specs.modular.toLowerCase()),
            isHighlight: specs.modular === 'Full',
          },
          {
            label: 'length',
            value: `${specs.length}mm`,
            isHighlight: specs.length === minLength,
          },
        ],
      }
    })
  }

  return (
    <HardwareSuggestion<PSUType>
      filteredList={filteredList}
      isLoading={isLoading}
      buildComparisonObjects={buildComparisonObjects}
      renderFilterForm={
        <Grid>
          <SelectElement
            label={t('psu')}
            options={generatePSUSelectElement(psuList)}
            selectChange={(id) =>
              setFilterLogic((prev) => ({ ...prev, id }))
            }
            isLoading={isLoading}
            value={filterLogic.id}
          />
        </Grid>
      }
    />
  )
}

// 辅助函数
const efficiencyToNumber = (rating: string) => {
  const map: Record<string, number> = {
    '80plus': 80,
    bronze: 85,
    silver: 88,
    gold: 90,
    platinum: 92,
    titanium: 94,
  }
  return map[rating.toLowerCase()] || 0
}

export default PSUSuggestion
