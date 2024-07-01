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
import { generateItemName, generateRAMName } from '../../../utils/LabelHelper'
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
      (element: RAMType) => element.model !== model
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
      const itemName = generateRAMName(item)

      const ramChipset: ComparisonSubItem = {
        label: 'chipset',
        value: item.chipset,
        isHighlight: false,
      }

      const capacity: ComparisonSubItem = {
        label: 'capacity',
        value: item.capacity,
        isHighlight: item.capacityNum === max(selectedItems.map((element) => element.capacityNum)),
      }

      const speed: ComparisonSubItem = {
        label: 'ram-frequency',
        value: item.speed.toString(),
        isHighlight: item.speed === max(selectedItems.map((element) => element.speed)),
      }

      const cl: ComparisonSubItem = {
        label: 'latency',
        value: item.cl.toString(),
        isHighlight: item.cl === min(selectedItems.map((element) => element.cl)),
      }

      const timing: ComparisonSubItem = {
        label: 'ram-timing',
        value: item.timing || '-',
        isHighlight: item.cl === min(selectedItems.map((element) => element.cl)),
      }

      const rgb: ComparisonSubItem = {
        label: 'is-rgb',
        value: item.rgb ? 'RGB' : '-',
        isHighlight: false,
      }

      const result: ComparisonObject = {
        img: imgStr,
        name: itemName,
        model: itemModel,
        items: [
          ramChipset,
          capacity,
          speed,
          cl,
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
      isMatch = item.model === filterLogic.model
    }
    if (filterLogic.brand && isMatch) {
      isMatch = (item.brand === filterLogic.brand)
    }
    if (filterLogic.generation && isMatch) {
      isMatch = (item.type === filterLogic.generation)
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

export default RAMSuggestion
