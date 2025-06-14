import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid } from '@mui/material'
import SSDType from '../../../constant/objectTypes/SSDType'
import SelectElement from '../../common/components/SelectElement'
import { generateSSDSelectElement } from '../../common/utils/generateSelectElements'

import { SSD_FILTER_INIT_DATA } from '../data/FilterInitData'
import { generateSSDName } from '../../../utils/LabelHelper'
import { ComparisonObject } from '../data/ComparisonObject'
import {
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
          isMatch = item.model === filterLogic.model
        }

        // 品牌過濾
        if (filterLogic.brand && isMatch) {
          isMatch = item.brand === filterLogic.brand
        }

        // 容量過濾
        if (filterLogic.capacity && isMatch) {
          isMatch = item.capacity === filterLogic.capacity
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
        capacity: item.capacity,
        type: item.flash_type,
        interface: item.interface,
        formFactor: item.form_factor,
        readSpeed: item.max_read,
        writeSpeed: item.max_write,
      }

      // 獲取比較基準值
      const maxRead = Math.max(...selectedItems.map((ssd) => ssd.max_read))
      const maxWrite = Math.max(...selectedItems.map((ssd) => ssd.max_write))

      return {
        img: item.img,
        name: generateSSDName(item),
        id: item.id,
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
          <Grid>
            <SelectElement
              label={t('ssd')}
              options={generateSSDSelectElement(ssdList)}
              selectChange={(model) =>
                setFilterLogic((prev) => ({ ...prev, model }))
              }
              isLoading={isLoading}
            />
          </Grid>
      }
    />
  )
}

// 速度格式化輔助函數
const diskSpeedLabelHandler = (speed: number) => {
  return speed >= 1000 ? `${(speed / 1000).toFixed(1)}GB/s` : `${speed}MB/s`
}

export default SSDSuggestion
