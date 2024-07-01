import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { max, min } from 'lodash'
import {
  Badge,
  Button,
  Grid,
} from '@mui/material'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'

import AIOType from '../../../constant/objectTypes/AIOType'
import SelectElement from '../../common/components/SelectElement'
import { generateAIOSelectElement } from '../../common/utils/generateSelectElements'
import SelectFilter from '../../common/components/SelectFilter'
import { getAIOBrand, getAIOSize } from '../../../utils/GroupCategoryHelper'

import { AIO_FILTER_INIT_DATA } from '../data/FilterInitData'
import { generateItemName } from '../../../utils/LabelHelper'
import ItemCard from './ItemCard'
import { ComparisonObject, ComparisonSubItem } from '../data/ComparisonObject'
import ComparisonModal from './ComparisonModal'
import { getCurrentPrice, getSelectedCurrency, stringToNumber } from '../../../utils/NumberHelper'
import PriceSlider from '../../common/components/PriceSlider'

type AIOSuggestionProps = {
  aioList: AIOType[]
  isLoading: boolean
}

const AIOSuggestion = ({
  aioList,
  isLoading,
}: AIOSuggestionProps) => {
  const { t } = useTranslation()
  const [filterLogic, setfilterLogic] = useState(AIO_FILTER_INIT_DATA)
  const [selectedItems, setSelectedItems] = useState<AIOType[]>([])
  const [openCompare, setOpenCompare] = useState(false)

  const brandOptions = getAIOBrand(aioList)
  const sizeOptions = getAIOSize(aioList)

  const addComparison = (item: AIOType) => {
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

  const updateFilterSize = (size: string) => {
    setfilterLogic({ ...filterLogic, size: Number(size) })
  }

  const handleClose = () => {
    setOpenCompare(false)
  }

  const removeComparison = (model: string) => {
    const updatedList: AIOType[] = selectedItems.filter(
      (element: AIOType) => element.model !== model
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

      const fanSize: ComparisonSubItem = {
        label: 'fan-size',
        value: item.fanSize.toString(),
        isHighlight: item.fanSize === max(selectedItems.map((element) => element.fanSize)),
      }

      const fanAirflow: ComparisonSubItem = {
        label: 'airflow',
        value: item.fanAirflow,
        isHighlight: item.fanAirflow === max(selectedItems.map((element) => element.fanAirflow)),
      }

      const fanNoise: ComparisonSubItem = {
        label: 'noise',
        value: item.fanNoise.toString(),
        isHighlight: item.fanNoise === min(selectedItems.map((element) => element.fanNoise)),
      }

      const fanSpeed: ComparisonSubItem = {
        label: 'fan-speed',
        value: item.fanSpeed,
        isHighlight: false,
      }

      const led: ComparisonSubItem = {
        label: 'is-rgb',
        value: item.led || '-',
        isHighlight: false,
      }

      const result: ComparisonObject = {
        img: imgStr,
        name: itemName,
        model: itemModel,
        items: [
          fanSize,
          fanAirflow,
          fanNoise,
          fanSpeed,
          led,
        ],
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

  const updatedList = aioList.filter((item) => {
    let isMatch = true
    if (filterLogic.model) {
      isMatch = item.model === filterLogic.model
    }
    if (filterLogic.brand && isMatch) {
      isMatch = (item.brand === filterLogic.brand)
    }
    if (filterLogic.size && isMatch) {
      isMatch = (item.fanSize === filterLogic.size)
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
            label={t('aio')}
            options={generateAIOSelectElement(aioList)}
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
        <Grid item xs={6}>
          <SelectFilter
            label={t('size')}
            options={sizeOptions}
            selectChange={updateFilterSize}
          />
        </Grid>
      </Grid>
      <Grid sx={{ paddingTop: 10 }} container spacing={2} columns={{ xs: 6, md: 12 }}>
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

export default AIOSuggestion
