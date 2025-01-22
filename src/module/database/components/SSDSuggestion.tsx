import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isEmpty, max } from 'lodash'
import {
  Badge,
  Button,
  Grid,
} from '@mui/material'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'

import SSDType from '../../../constant/objectTypes/SSDType'
import SelectElement from '../../common/components/SelectElement'
import { generateSSDSelectElement } from '../../common/utils/generateSelectElements'
import SelectFilter from '../../common/components/SelectFilter'
import { getSSDBrand, getSSDCapacity } from '../../../utils/GroupCategoryHelper'

import { SSD_FILTER_INIT_DATA } from '../data/FilterInitData'
import { diskSpeedLabelHandler, generateItemName, generateSSDName } from '../../../utils/LabelHelper'
import { ComparisonObject, ComparisonSubItem } from '../data/ComparisonObject'
import ComparisonModal from './ComparisonModal'
import ItemCard from './ItemCard'
import { getCurrentPrice, getSelectedCurrency, stringToNumber } from '../../../utils/NumberHelper'
import PriceSlider from '../../common/components/PriceSlider'

type SSDSuggestionProps = {
  ssdList: SSDType[]
  isLoading: boolean
}

const SSDSuggestion = ({ ssdList, isLoading }: SSDSuggestionProps) => {
  const { t } = useTranslation()
  const [filterLogic, setfilterLogic] = useState(SSD_FILTER_INIT_DATA)
  const [selectedItems, setSelectedItems] = useState<SSDType[]>([])
  const [openCompare, setOpenCompare] = useState(false)

  const brandOptions = getSSDBrand(ssdList)
  const capacityOptions = getSSDCapacity(ssdList)

  const addComparison = (item: SSDType) => {
    if (selectedItems.length < 4) {
      setSelectedItems([...selectedItems, item])
    }
  }

  const updateSelectedItem = (item: string) => {
    setfilterLogic({ ...filterLogic, model: item })
  }

  const updateMaxPrice = (price: number) => {
    setfilterLogic({ ...filterLogic, price })
  }

  const updateFilterBrand = (brand: string) => {
    setfilterLogic({ ...filterLogic, brand })
  }

  const updateFilterCapacity = (capacity: string) => {
    setfilterLogic({ ...filterLogic, capacity })
  }

  const handleClose = () => {
    setOpenCompare(false)
  }

  const removeComparison = (model: string) => {
    const updatedList: SSDType[] = selectedItems.filter(
      (element: SSDType) => element.Model !== model
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
      const itemName = generateSSDName(item)

      const capacity: ComparisonSubItem = {
        label: 'capacity',
        value: item.Capacity,
        isHighlight: false,
      }

      const memoryType: ComparisonSubItem = {
        label: 'memory-type',
        value: item.FlashType,
        isHighlight: false,
      }

      const ramInterface: ComparisonSubItem = {
        label: 'interface',
        value: item.Interface,
        isHighlight: false,
      }

      const sizeType: ComparisonSubItem = {
        label: 'type',
        value: item.FormFactor,
        isHighlight: false,
      }

      const readSpeed: ComparisonSubItem = {
        label: 'read-speed',
        value: diskSpeedLabelHandler(item.MaxRead),
        isHighlight: item.MaxRead === max(selectedItems.map((element) => element.MaxRead)),
      }

      const writeSpeed: ComparisonSubItem = {
        label: 'write-speed',
        value: diskSpeedLabelHandler(item.MaxWrite),
        isHighlight: item.MaxWrite === max(selectedItems.map((element) => element.MaxWrite)),
      }

      const result: ComparisonObject = {
        img: imgStr,
        name: itemName,
        model: itemModel,
        items: [
          capacity,
          memoryType,
          ramInterface,
          sizeType,
          readSpeed,
          writeSpeed,
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

  const updatedList = ssdList.filter((item) => {
    let isMatch = true
    if (filterLogic.model) {
      isMatch = item.Model === filterLogic.model
    }
    if (!isEmpty(filterLogic.brand) && isMatch) {
      isMatch = item.Brand === filterLogic.brand
    }
    if (!isEmpty(filterLogic.capacity) && isMatch) {
      isMatch = item.Capacity === filterLogic.capacity
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
            label={t('ssd')}
            options={generateSSDSelectElement(ssdList)}
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
            label={t('capacity')}
            options={capacityOptions}
            selectChange={updateFilterCapacity}
          />
        </Grid>
      </Grid>
      <Grid sx={{ paddingTop: 10 }} container spacing={2} columns={{ xs: 6, md: 12 }}>
        {updatedList.map((item) => (
          <ItemCard
            itemLabel={generateSSDName(item)}
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

export default SSDSuggestion
