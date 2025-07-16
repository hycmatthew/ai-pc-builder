import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import MotherboardType from '../../../constant/objectTypes/MotherboardType'
import SelectElement from '../../common/components/SelectElement'
import { generateMotherboardSelectElement } from '../../common/utils/generateSelectElements'
import { MOTHERBOARD_FILTER_INIT_DATA } from '../data/FilterInitData'
import { generateItemName } from '../../../utils/LabelHelper'
import { ComparisonObject } from '../data/ComparisonObject'
import { getLocalizedPriceNum } from '../../../utils/NumberHelper'
import HardwareSuggestion from './HardwarePage'

type MotherboardSuggestionProps = {
  motherboardList: MotherboardType[]
  isLoading: boolean
}

const MotherboardSuggestion = ({
  motherboardList,
  isLoading,
}: MotherboardSuggestionProps) => {
  const { t } = useTranslation()
  const [filterLogic, setFilterLogic] = useState(MOTHERBOARD_FILTER_INIT_DATA)

  // 过滤逻辑
  const filteredList = useMemo(
    () =>
      motherboardList.filter((item) => {
        let isMatch = true

        if (filterLogic.id) {
          isMatch = item.id === filterLogic.id
        }
        if (filterLogic.brand && isMatch) {
          isMatch = item.brand === filterLogic.brand
        }
        if (filterLogic.chipset && isMatch) {
          isMatch = item.chipset === filterLogic.chipset
        }
        if (filterLogic.price > 0 && isMatch) {
          isMatch = getLocalizedPriceNum(item) <= filterLogic.price
        }
        return isMatch
      }),
    [motherboardList, filterLogic]
  )

  // 比较对象生成
  const buildComparisonObjects = (
    selectedItems: MotherboardType[]
  ): ComparisonObject[] => {
    return selectedItems.map((item) => {
      const specs = {
        socket: item.socket,
        chipset: item.chipset,
        ramType: item.ram_type,
        formFactor: item.form_factor,
        pcieSlots: item.pcie_4_slot,
        m2Slots: item.m2_slot,
      }

      return {
        img: item.img,
        name: generateItemName(item.brand, item.name),
        id: item.id,
        items: [
          {
            label: 'socket',
            value: specs.socket,
            isHighlight: false,
          },
          {
            label: 'chipset',
            value: specs.chipset,
            isHighlight: false,
          },
          {
            label: 'memory-type',
            value: specs.ramType,
            isHighlight: false,
          },
          {
            label: 'form-factor',
            value: specs.formFactor,
            isHighlight: false,
          },
          {
            label: 'pcie-slots',
            value: specs.pcieSlots.toString(),
            isHighlight:
              specs.pcieSlots ===
              Math.max(...selectedItems.map((mb) => mb.pcie_4_slot)),
          },
          {
            label: 'm2-slots',
            value: specs.m2Slots.toString(),
            isHighlight:
              specs.m2Slots ===
              Math.max(...selectedItems.map((mb) => mb.m2_slot)),
          },
        ],
      }
    })
  }

  return (
    <HardwareSuggestion<MotherboardType>
      filteredList={filteredList}
      isLoading={isLoading}
      buildComparisonObjects={buildComparisonObjects}
      renderFilterForm={
        <SelectElement
          label={t('motherboard')}
          options={generateMotherboardSelectElement(motherboardList)}
          selectChange={(id) => setFilterLogic((prev) => ({ ...prev, id }))}
          isLoading={isLoading}
        />
      }
    />
  )
}

export default MotherboardSuggestion
