import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { max, min } from 'lodash'
import { Badge, Button, Grid } from '@mui/material'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'

import AirCoolerType from '../../../constant/objectTypes/AirCoolerType'
import SelectElement from '../../common/components/SelectElement'
import { generateAirCoolerSelectElement } from '../../common/utils/generateSelectElements'
import SelectFilter from '../../common/components/SelectFilter'

import { AIR_COOLER_FILTER_INIT_DATA } from '../data/FilterInitData'
import { generateItemName } from '../../../utils/LabelHelper'
import ItemCard from './ItemCard'
import { ComparisonObject, ComparisonSubItem } from '../data/ComparisonObject'
import ComparisonModal from './ComparisonModal'
import {
  getCurrentPrice,
  getSelectedCurrency,
  stringToNumber,
} from '../../../utils/NumberHelper'
import PriceSlider from '../../common/components/PriceSlider'
import { getAirCoolerBrand } from '../../../utils/GroupCategoryHelper'

type AirCoolerSuggestionProps = {
  airCoolerList: AirCoolerType[]
  isLoading: boolean
}

const AirCoolerSuggestion = ({
  airCoolerList,
  isLoading,
}: AirCoolerSuggestionProps) => {
  const { t } = useTranslation()
  const [filterLogic, setfilterLogic] = useState(AIR_COOLER_FILTER_INIT_DATA)
  const [selectedItems, setSelectedItems] = useState<AirCoolerType[]>([])
  const [openCompare, setOpenCompare] = useState(false)

  const brandOptions = getAirCoolerBrand(airCoolerList)

  const addComparison = (item: AirCoolerType) => {
    if (selectedItems.length < 4) {
      setSelectedItems([...selectedItems, item])
    }
  }

  const updateSelectedItem = (item: any) => {
    setfilterLogic({ ...filterLogic, model: item })
  }

  const updateMaxPrice = (price: number) => {
    setfilterLogic({ ...filterLogic, price })
  }

  const updateFilterBrand = (brand: string) => {
    setfilterLogic({ ...filterLogic, brand })
  }

  const handleClose = () => {
    setOpenCompare(false)
  }

  const removeComparison = (model: string) => {
    const updatedList: AirCoolerType[] = selectedItems.filter(
      (element: AirCoolerType) => element.model !== model
    )
    if (updatedList.length === 0) {
      handleClose()
    }
    setSelectedItems([...updatedList])
  }

  const openCompareLogic = () => {
    if (selectedItems.length > 0) {
      setOpenCompare(true)
    }
  }

  const openComparison = () => {
    let comparsionObjects: ComparisonObject[] = []
    comparsionObjects = selectedItems.map((item) => {
      const imgStr = item.img
      const itemModel = item.model
      const itemName = generateItemName(item.brand, item.model)

      const fanAirflow: ComparisonSubItem = {
        label: 'fanAirflow',
        value: item.fanAirflow,
        isHighlight:
          item.fanAirflow === max(selectedItems.map((element) => element.fanAirflow)),
      }

      const fanNoise: ComparisonSubItem = {
        label: 'fanNoise',
        value: item.fanNoise,
        isHighlight:
          item.fanNoise === max(selectedItems.map((element) => element.fanNoise)),
      }

      const fanSpeed: ComparisonSubItem = {
        label: 'fanSpeed',
        value: item.fanSpeed,
        isHighlight:
          item.fanSpeed === max(selectedItems.map((element) => element.fanSpeed)),
      }

      const maxCoolerHeight: ComparisonSubItem = {
        label: 'maxCoolerHeight',
        value: item.maxCoolerHeight.toString(),
        isHighlight:
          item.maxCoolerHeight === min(selectedItems.map((element) => element.maxCoolerHeight)),
      }

      const led: ComparisonSubItem = {
        label: 'led',
        value: item.led || '-',
        isHighlight: false,
      }

      const result: ComparisonObject = {
        img: imgStr,
        name: itemName,
        model: itemModel,
        items: [fanAirflow, fanNoise, fanSpeed, maxCoolerHeight, led],
      }

      return result
    })

    return (
      <ComparisonModal
        comparisonObjects={comparsionObjects}
        isOpen={openCompare}
        handleClose={handleClose}
        handleRemove={removeComparison}
      />
    )
  }

  const updatedList = airCoolerList.filter((item) => {
    let isMatch = true
    if (filterLogic.model) {
      isMatch = item.model === filterLogic.model
    }
    if (filterLogic.brand && isMatch) {
      isMatch = item.brand === filterLogic.brand
    }
    if (filterLogic.price !== 0 && isMatch) {
      isMatch = stringToNumber(item[getSelectedCurrency()]) < filterLogic.price
    }
    return isMatch
  })

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={9}>
          <SelectElement
            label={t('airCooler')}
            options={generateAirCoolerSelectElement(airCoolerList)}
            selectChange={updateSelectedItem}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={3}>
          <Badge badgeContent={selectedItems.length} color="error">
            <Button
              startIcon={<CompareArrowsIcon />}
              variant="contained"
              disabled={selectedItems.length === 0}
              onClick={() => openCompareLogic()}
            >
              {t('compare')}
            </Button>
          </Badge>
        </Grid>
        {openComparison()}
        <Grid item xs={9}>
          <PriceSlider selectChange={updateMaxPrice} />
        </Grid>
        <Grid item xs={6}>
          <SelectFilter
            label={t('brand')}
            options={brandOptions}
            selectChange={updateFilterBrand}
          />
        </Grid>
      </Grid>
      <Grid
        sx={{ paddingTop: 10 }}
        container
        spacing={2}
        columns={{ xs: 6, md: 12 }}
      >
        {updatedList.map((item) => (
          <ItemCard
            itemLabel={generateItemName(item.brand, item.model)}
            priceLabel={getCurrentPrice(item)}
            imgSrc={item.img}
            disable={selectedItems.includes(item)}
            addComparsion={() => addComparison(item)}
            removeComparsion={() => removeComparison(item.model)}
          />
        ))}
      </Grid>
    </>
  )
}

export default AirCoolerSuggestion
