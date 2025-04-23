import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid2 as Grid } from '@mui/material'

import CoolerType from '../../../constant/objectTypes/CoolerType'
import SelectElement from '../../common/components/SelectElement'
import { generateAIOSelectElement } from '../../common/utils/generateSelectElements'
import SelectFilter from '../../common/components/SelectFilter'
import { getAIOSize } from '../../../utils/GroupCategoryHelper'

import { AIO_FILTER_INIT_DATA } from '../data/FilterInitData'
import { generateItemName } from '../../../utils/LabelHelper'
import { ComparisonObject } from '../data/ComparisonObject'
import {
  convertLocalizedPrice,
  getLocalizedPriceNum,
} from '../../../utils/NumberHelper'
import HardwareSuggestion from './HardwarePage'

type CoolerSuggestionProps = {
  coolerList: CoolerType[]
  isLoading: boolean
}

const CoolerSuggestion = ({ coolerList, isLoading }: CoolerSuggestionProps) => {
  const { t } = useTranslation()
  const [filterLogic, setFilterLogic] = useState(AIO_FILTER_INIT_DATA)

  // 过滤逻辑
  const filteredList = useMemo(
    () =>
      coolerList.filter((item) => {
        let isMatch = true

        if (filterLogic.model) {
          isMatch = item.Name === filterLogic.model
        }
        if (filterLogic.brand && isMatch) {
          isMatch = item.Brand === filterLogic.brand
        }
        if (filterLogic.size && isMatch) {
          isMatch = item.LiquidCoolerSize === filterLogic.size
        }
        if (filterLogic.price > 0 && isMatch) {
          isMatch = getLocalizedPriceNum(item) <= filterLogic.price
        }
        return isMatch
      }),
    [coolerList, filterLogic]
  )

  // 比较对象生成
  const buildComparisonObjects = (
    selectedItems: CoolerType[]
  ): ComparisonObject[] => {
    return selectedItems.map((item) => {
      const specs = {
        size: item.LiquidCoolerSize,
        airflow: item.FanSpeed,
        noise: item.NoiseLevel,
        speed: item.FanSpeed,
        isLiquid: item.IsLiquidCooler,
      }

      const maxSize = Math.max(...selectedItems.map((c) => c.LiquidCoolerSize))

      return {
        img: item.Img,
        name: generateItemName(item.Brand, item.Name),
        model: item.Name,
        items: [
          {
            label: 'fan-size',
            value: `${specs.size}mm`,
            isHighlight: specs.size === maxSize,
          },
          {
            label: 'airflow',
            value: `${specs.airflow} CFM`,
            isHighlight: false,
          },
          {
            label: 'noise',
            value: `${specs.noise} dB`,
            isHighlight: false,
          },
          {
            label: 'fan-speed',
            value: `${specs.speed} RPM`,
            isHighlight: false,
          },
          {
            label: 'is-liquid',
            value: specs.isLiquid ? t('yes') : t('no'),
            isHighlight: false,
          },
        ],
      }
    })
  }

  return (
    <HardwareSuggestion<CoolerType>
      filteredList={filteredList}
      isLoading={isLoading}
      buildComparisonObjects={buildComparisonObjects}
      renderFilterForm={
        <>
          <Grid size={9}>
            <SelectElement
              label={t('aio')}
              options={generateAIOSelectElement(coolerList)}
              selectChange={(model) =>
                setFilterLogic((prev) => ({ ...prev, model }))
              }
              isLoading={isLoading}
            />
          </Grid>
          <Grid size={6}>
            <SelectFilter
              label={t('size')}
              options={getAIOSize(coolerList)}
              selectChange={(size) =>
                setFilterLogic((prev) => ({
                  ...prev,
                  size: Number(size),
                }))
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

export default CoolerSuggestion
