import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid2 as Grid } from '@mui/material'
import SSDType from '../../../constant/objectTypes/SSDType'
import SelectElement from '../../common/components/SelectElement'
import { generateSSDSelectElement } from '../../common/utils/generateSelectElements'
import SelectFilter from '../../common/components/SelectFilter'
import { getSSDBrand, getSSDCapacity } from '../../../utils/GroupCategoryHelper'

import { SSD_FILTER_INIT_DATA } from '../data/FilterInitData'
import { generateSSDName } from '../../../utils/LabelHelper'
import { ComparisonObject } from '../data/ComparisonObject'
import {
  convertLocalizedPrice,
  getLocalizedPriceNum,
} from '../../../utils/NumberHelper'
import HardwareSuggestion from './HardwarePage'

type SSDSuggestionProps = {
  ssdList: SSDType[]
  isLoading: boolean
}

const SSDSuggestion = ({ ssdList, isLoading }: SSDSuggestionProps) => {
  const { t } = useTranslation()
  const [filterLogic, setFilterLogic] = useState(SSD_FILTER_INIT_DATA)

  // 過濾邏輯
  const filteredList = useMemo(
    () =>
      ssdList.filter((item) => {
        let isMatch = true

        // 型號過濾
        if (filterLogic.model) {
          isMatch = item.Model === filterLogic.model
        }

        // 品牌過濾
        if (filterLogic.brand && isMatch) {
          isMatch = item.Brand === filterLogic.brand
        }

        // 容量過濾
        if (filterLogic.capacity && isMatch) {
          isMatch = item.Capacity === filterLogic.capacity
        }

        // 價格過濾
        if (filterLogic.price > 0 && isMatch) {
          isMatch = getLocalizedPriceNum(item) <= filterLogic.price
        }

        return isMatch
      }),
    [ssdList, filterLogic]
  )

  // 比較對象生成
  const buildComparisonObjects = (
    selectedItems: SSDType[]
  ): ComparisonObject[] => {
    return selectedItems.map((item) => {
      const specs = {
        capacity: item.Capacity,
        type: item.FlashType,
        interface: item.Interface,
        formFactor: item.FormFactor,
        readSpeed: item.MaxRead,
        writeSpeed: item.MaxWrite,
      }

      // 獲取比較基準值
      const maxRead = Math.max(...selectedItems.map((ssd) => ssd.MaxRead))
      const maxWrite = Math.max(...selectedItems.map((ssd) => ssd.MaxWrite))

      return {
        img: item.Img,
        name: generateSSDName(item),
        model: item.Model,
        items: [
          {
            label: 'capacity',
            value: `${specs.capacity}GB`,
            isHighlight: false,
          },
          {
            label: 'memory-type',
            value: specs.type,
            isHighlight: false,
          },
          {
            label: 'interface',
            value: specs.interface,
            isHighlight: specs.interface.includes('PCIe 4.0'),
          },
          {
            label: 'type',
            value: specs.formFactor,
            isHighlight: false,
          },
          {
            label: 'read-speed',
            value: diskSpeedLabelHandler(specs.readSpeed),
            isHighlight: specs.readSpeed === maxRead,
          },
          {
            label: 'write-speed',
            value: diskSpeedLabelHandler(specs.writeSpeed),
            isHighlight: specs.writeSpeed === maxWrite,
          },
        ],
      }
    })
  }

  return (
    <HardwareSuggestion<SSDType>
      filteredList={filteredList}
      isLoading={isLoading}
      buildComparisonObjects={buildComparisonObjects}
      renderFilterForm={
        <>
          <Grid size={9}>
            <SelectElement
              label={t('ssd')}
              options={generateSSDSelectElement(ssdList)}
              selectChange={(model) =>
                setFilterLogic((prev) => ({ ...prev, model }))
              }
              isLoading={isLoading}
            />
          </Grid>
          <Grid size={6}>
            <SelectFilter
              label={t('brand')}
              options={getSSDBrand(ssdList)}
              selectChange={(brand) =>
                setFilterLogic((prev) => ({ ...prev, brand }))
              }
            />
          </Grid>
          <Grid size={6}>
            <SelectFilter
              label={t('capacity')}
              options={getSSDCapacity(ssdList)}
              selectChange={(capacity) =>
                setFilterLogic((prev) => ({
                  ...prev,
                  capacity: capacity,
                }))
              }
            />
          </Grid>
        </>
      }
      getItemLabel={(item) => generateSSDName(item)}
      getPriceLabel={(item) => convertLocalizedPrice(item)}
      getImgSrc={(item) => item.Img}
      getItemIdentifier={(item) => item.Model}
    />
  )
}

// 速度格式化輔助函數
const diskSpeedLabelHandler = (speed: number) => {
  return speed >= 1000 ? `${(speed / 1000).toFixed(1)}GB/s` : `${speed}MB/s`
}

export default SSDSuggestion
