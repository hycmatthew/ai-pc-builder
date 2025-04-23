import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid2 as Grid } from '@mui/material'

import PSUType from '../../../constant/objectTypes/PSUType'
import SelectElement from '../../common/components/SelectElement'
import { generatePSUSelectElement } from '../../common/utils/generateSelectElements'

import { PSU_FILTER_INIT_DATA } from '../data/FilterInitData'
import { generateItemName } from '../../../utils/LabelHelper'
import {
  convertLocalizedPrice,
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
        if (filterLogic.model) {
          isMatch = item.Name === filterLogic.model
        }

        // 品牌过滤
        if (filterLogic.brand && isMatch) {
          isMatch = item.Brand === filterLogic.brand
        }

        // 功率过滤
        if (filterLogic.power > 0 && isMatch) {
          isMatch = item.Wattage >= filterLogic.power
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
        type: item.Size,
        wattage: item.Wattage,
        efficiency: item.Efficiency,
        modular: item.Modular,
        length: item.Length,
      }

      // 比较基准值
      const maxWattage = Math.max(...selectedItems.map((psu) => psu.Wattage))
      const maxEfficiency = Math.max(
        ...selectedItems.map((psu) => efficiencyToNumber(psu.Efficiency))
      )
      const minLength = Math.min(...selectedItems.map((psu) => psu.Length))

      return {
        img: item.Img,
        name: generateItemName(item.Brand, item.Name),
        model: item.Name,
        items: [
          {
            label: 'psu-type',
            value: specs.type,
            isHighlight: false,
          },
          {
            label: 'wattage',
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
        <>
          <Grid size={9}>
            <SelectElement
              label={t('psu')}
              options={generatePSUSelectElement(psuList)}
              selectChange={(model) =>
                setFilterLogic((prev) => ({ ...prev, model }))
              }
              isLoading={isLoading}
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
