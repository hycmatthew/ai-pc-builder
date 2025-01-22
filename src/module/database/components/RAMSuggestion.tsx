import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isEmpty, max, min } from 'lodash'
import {
  Badge,
  Button,
  Grid,
} from '@mui/material'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'

import RAMType from '../../../constant/objectTypes/RAMType'
import SelectElement from '../../common/components/SelectElement'
import { generateRAMSelectElement } from '../../common/utils/generateSelectElements'
import SelectFilter from '../../common/components/SelectFilter'
import { getRAMBrand, getRAMGeneration } from '../../../utils/GroupCategoryHelper'

import { RAM_FILTER_INIT_DATA } from '../data/FilterInitData'
import { generateRAMName } from '../../../utils/LabelHelper'
import ItemCard from './ItemCard'
import { ComparisonObject, ComparisonSubItem } from '../data/ComparisonObject'
import ComparisonModal from './ComparisonModal'
import { getCurrentPrice, getSelectedCurrency, stringToNumber } from '../../../utils/NumberHelper'
import PriceSlider from '../../common/components/PriceSlider'

type RAMSuggestionProps = {
  ramList: RAMType[]
  isLoading: boolean
}

const RAMSuggestion = ({
  ramList,
  isLoading,
}: RAMSuggestionProps) => {
  const { t } = useTranslation()
  const [filterLogic, setfilterLogic] = useState(RAM_FILTER_INIT_DATA)
  const [selectedItems, setSelectedItems] = useState<RAMType[]>([])
  const [openCompare, setOpenCompare] = useState(false)

  const brandOptions = getRAMBrand(ramList)
  const generationOptions = getRAMGeneration(ramList)

  const addComparison = (item: RAMType) => {
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

  const updateFilterGeneration = (generation: string) => {
    setfilterLogic({ ...filterLogic, generation })
  }

  const handleClose = () => {
    setOpenCompare(false)
  }

  const removeComparison = (model: string) => {
    const updatedList: RAMType[] = selectedItems.filter(
      (element: RAMType) => element.Model !== model
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
      const imgStr = item.Img
      const itemModel = item.Model
      const itemName = generateRAMName(item)

      const capacity: ComparisonSubItem = {
        label: 'capacity',
        value: item.Capacity,
        isHighlight: item.Capacity === max(selectedItems.map((element) => element.Capacity)),
      }

      const speed: ComparisonSubItem = {
        label: 'ram-frequency',
        value: item.Speed.toString(),
        isHighlight: item.Speed === max(selectedItems.map((element) => element.Speed)),
      }

      const timing: ComparisonSubItem = {
        label: 'ram-timing',
        value: item.Timing || '-',
        isHighlight: item.Timing === min(selectedItems.map((element) => element.Timing)),
      }

      const rgb: ComparisonSubItem = {
        label: 'is-rgb',
        value: item.LED ? 'RGB' : '-',
        isHighlight: false,
      }

      const result: ComparisonObject = {
        img: imgStr,
        name: itemName,
        model: itemModel,
        items: [
          capacity,
          speed,
          timing,
          rgb
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

  const updatedList = ramList.filter((item) => {
    let isMatch = true
    if (filterLogic.model) {
      isMatch = item.Model === filterLogic.model
    }
    if (filterLogic.brand && isMatch) {
      isMatch = (item.Brand === filterLogic.brand)
    }
    if (filterLogic.generation && isMatch) {
      isMatch = (item.Type === filterLogic.generation)
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
            label={t('ram')}
            options={generateRAMSelectElement(ramList)}
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
            label={t('generations')}
            options={generationOptions}
            selectChange={updateFilterGeneration}
          />
        </Grid>
      </Grid>
      <Grid sx={{ paddingTop: 10 }} container spacing={2} columns={{ xs: 6, md: 12 }}>
        {updatedList.map((item) => (
          <ItemCard
            itemLabel={generateRAMName(item)}
            priceLabel={getCurrentPrice(item)}
            imgSrc={item.Img}
            disable={selectedItems.includes(item)}
            addComparsion={() => addComparison(item)}
            removeComparsion={() => removeComparison(item.Model)}
          />
        ))}
      </Grid>
    </>
  )
}

export default RAMSuggestion
