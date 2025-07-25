import { useMemo, useState } from 'react'
import CPUType from '../../../constant/objectTypes/CPUType'
import SelectElement from '../../common/components/SelectElement'
import { generateCPUSelectElement } from '../../common/utils/generateSelectElements'

import { CPU_FILTER_INIT_DATA } from '../data/FilterInitData'
import { getLocalizedPriceNum } from '../../../utils/NumberHelper'
import { generateItemName } from '../../../utils/LabelHelper'
import { ComparisonObject } from '../data/ComparisonObject'
import ProductEnum from '../../../constant/ProductEnum'
import HardwareSuggestion from './HardwarePage'

type CPUSuggestionProps = {
  cpuList: CPUType[]
  isLoading: boolean
}

const CPUSuggestion = ({ cpuList, isLoading }: CPUSuggestionProps) => {
  const [filterLogic, setFilterLogic] = useState(CPU_FILTER_INIT_DATA)

  // CPU 过滤逻辑
  const filteredList = useMemo(
    () =>
      cpuList.filter((item) => {
        let isMatch = true

        // 型号过滤
        if (filterLogic.id) {
          isMatch = item.id === filterLogic.id
        }

        // 品牌过滤
        if (filterLogic.brand && isMatch) {
          isMatch = item.brand === filterLogic.brand
        }

        // 价格过滤
        if (filterLogic.price > 0 && isMatch) {
          isMatch = getLocalizedPriceNum(item) <= filterLogic.price
        }

        return isMatch
      }),
    [cpuList, filterLogic]
  )

  // CPU 比较对象生成逻辑
  const buildComparisonObjects = (
    selectedItems: CPUType[]
  ): ComparisonObject[] => {
    return selectedItems.map((item) => {
      const specs = {
        socket: item.socket || '-',
        cores: item.cores,
        graphics: item.gpu || '-',
        singleScore: item.single_core_score,
        multiScore: item.multi_core_score,
        power: item.power,
      }

      // 获取比较基准值
      const maxCores = Math.max(...selectedItems.map((cpu) => cpu.cores))
      const maxSingle = Math.max(
        ...selectedItems.map((cpu) => cpu.single_core_score)
      )
      const maxMulti = Math.max(
        ...selectedItems.map((cpu) => cpu.multi_core_score)
      )
      const minPower = Math.min(...selectedItems.map((cpu) => cpu.power))

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
            label: 'cpu-cores',
            value: specs.cores.toString(),
            isHighlight: specs.cores === maxCores,
          },
          {
            label: 'integrated-graphics',
            value: specs.graphics,
            isHighlight: specs.graphics !== '-',
          },
          {
            label: 'single-core',
            value: specs.singleScore.toString(),
            isHighlight: specs.singleScore === maxSingle,
          },
          {
            label: 'multi-core',
            value: specs.multiScore.toString(),
            isHighlight: specs.multiScore === maxMulti,
          },
          {
            label: 'power',
            value: specs.power.toString(),
            isHighlight: specs.power === minPower,
          },
        ],
      }
    })
  }

  return (
    <HardwareSuggestion<CPUType>
      filteredList={filteredList}
      isLoading={isLoading}
      buildComparisonObjects={buildComparisonObjects}
      renderFilterForm={
        <SelectElement
          label={ProductEnum.CPU}
          options={generateCPUSelectElement(cpuList)}
          selectChange={(id) => setFilterLogic((prev) => ({ ...prev, id }))}
          isLoading={isLoading}
          value={filterLogic.id}
        />
      }
    />
  )
}

export default CPUSuggestion
