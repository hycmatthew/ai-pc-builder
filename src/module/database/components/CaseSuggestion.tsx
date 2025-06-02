import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import CaseType from '../../../constant/objectTypes/CaseType'
import SelectFilter from '../../common/components/SelectFilter'

import { CASE_FILTER_INIT_DATA } from '../data/FilterInitData'
import { generateItemName } from '../../../utils/LabelHelper'
import { ComparisonObject } from '../data/ComparisonObject'
import {
  convertLocalizedPrice,
  getLocalizedPriceNum,
} from '../../../utils/NumberHelper'
import { getCaseBrand, getCaseSize } from '../../../utils/GroupCategoryHelper'
import HardwareSuggestion from './HardwarePage'

type CaseSuggestionProps = {
  caseList: CaseType[]
  isLoading: boolean
}

const CaseSuggestion = ({ caseList, isLoading }: CaseSuggestionProps) => {
  const { t } = useTranslation()
  const [filterLogic, setFilterLogic] = useState(CASE_FILTER_INIT_DATA)
  const brandOptions = getCaseBrand(caseList)
  const sizeOptions = getCaseSize(caseList)

  // Case 过滤逻辑
  const filteredList = useMemo(
    () =>
      caseList.filter((item) => {
        let isMatch = true

        // 型号过滤
        if (filterLogic.model) {
          isMatch = item.name === filterLogic.model
        }

        // 品牌过滤
        if (filterLogic.brand && isMatch) {
          isMatch = item.brand === filterLogic.brand
        }

        // 机箱尺寸过滤
        if (filterLogic.size && isMatch) {
          isMatch = item.case_size === filterLogic.size
        }

        // 价格过滤
        if (filterLogic.price > 0 && isMatch) {
          isMatch = getLocalizedPriceNum(item) <= filterLogic.price
        }

        return isMatch
      }),
    [caseList, filterLogic]
  )

  // Case 比较对象生成逻辑
  const buildComparisonObjects = (
    selectedItems: CaseType[]
  ): ComparisonObject[] => {
    return selectedItems.map((item) => {
      const specs = {
        size: item.case_size,
        color: item.color || '-',
        maxVGALength: item.max_vga_length,
        compatibility: item.compatibility || [],
      }

      // 获取比较基准值
      const maxVGALength = Math.max(...selectedItems.map((c) => c.max_vga_length))
      const maxCompatibility = Math.max(
        ...selectedItems.map((c) => c.compatibility?.length || 0)
      )

      return {
        img: item.img,
        name: generateItemName(item.brand, item.name),
        model: item.name,
        items: [
          {
            label: 'case-size',
            value: specs.size,
            isHighlight: false,
          },
          {
            label: 'color',
            value: specs.color,
            isHighlight: specs.color !== '-',
          },
          {
            label: 'max-gpu-length',
            value: specs.maxVGALength.toString() + 'mm',
            isHighlight: specs.maxVGALength === maxVGALength,
          },
          {
            label: 'motherboard-compatibility',
            value: specs.compatibility.join(' / ') || '-',
            isHighlight:
              (specs.compatibility?.length || 0) === maxCompatibility,
          },
        ],
      }
    })
  }

  return (
    <HardwareSuggestion<CaseType>
      filteredList={filteredList}
      isLoading={isLoading}
      buildComparisonObjects={buildComparisonObjects}
      renderFilterForm={
        <>
          <SelectFilter
            label={t('brand')}
            options={brandOptions}
            selectChange={(brand) =>
              setFilterLogic((prev) => ({ ...prev, brand }))
            }
          />
          <SelectFilter
            label={t('size')}
            options={sizeOptions}
            selectChange={(size) =>
              setFilterLogic((prev) => ({ ...prev, size }))
            }
          />
        </>
      }
      getItemLabel={(item) => generateItemName(item.brand, item.name)}
      getPriceLabel={(item) => convertLocalizedPrice(item)}
      getImgSrc={(item) => item.img}
      getItemIdentifier={(item) => item.name}
    />
  )
}

export default CaseSuggestion
