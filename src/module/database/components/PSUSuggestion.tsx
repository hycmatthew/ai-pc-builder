import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isEmpty, max, min } from 'lodash'
import {
  Badge,
  Button,
  Grid,
} from '@mui/material'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'

import PSUType from '../../../constant/objectTypes/PSUType'
import SelectElement from '../../common/components/SelectElement'
import { generatePSUSelectElement } from '../../common/utils/generateSelectElements'
import SelectFilter from '../../common/components/SelectFilter'
import { getPSUBrand } from '../../../utils/GroupCategoryHelper'

import { PSU_FILTER_INIT_DATA } from '../data/FilterInitData'
import { generateItemName, lengthLabelHandler } from '../../../utils/LabelHelper'
import { getCurrentPrice, getSelectedCurrency, stringToNumber } from '../../../utils/NumberHelper'
import ItemCard from './ItemCard'
import { ComparisonObject, ComparisonSubItem } from '../data/ComparisonObject'
import ComparisonModal from './ComparisonModal'
import PriceSlider from '../../common/components/PriceSlider'

type PSUSuggestionProps = {
  psuList: PSUType[]
  isLoading: boolean
}

const PSUSuggestion = ({
  psuList,
  isLoading,
}: PSUSuggestionProps) => {
  const { t } = useTranslation()
  const [filterLogic, setfilterLogic] = useState(PSU_FILTER_INIT_DATA)
  const [selectedItems, setSelectedItems] = useState<PSUType[]>([])
  const [openCompare, setOpenCompare] = useState(false)

  const brandOptions = getPSUBrand(psuList)

  const addComparison = (item: PSUType) => {
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

  const updateFilterPower = (power: number) => {
    setfilterLogic({ ...filterLogic, power })
  }

  const handleClose = () => {
    setOpenCompare(false)
  }

  const removeComparison = (model: string) => {
    const updatedList: PSUType[] = selectedItems.filter(
      (element: PSUType) => element.Name !== model
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
      const itemModel = item.Name
      const itemName = generateItemName(item.Brand, item.Name)

      const type: ComparisonSubItem = {
        label: 'type',
        value: item.Size,
        isHighlight: false,
      }

      const psuPower: ComparisonSubItem = {
        label: 'power',
        value: item.Wattage.toString(),
        isHighlight: false,
      }

      const efficiency: ComparisonSubItem = {
        label: 'efficiency',
        value: item.Efficiency,
        isHighlight: item.Efficiency === max(selectedItems.map((element) => element.Efficiency)),
      }

      const moduleType: ComparisonSubItem = {
        label: 'modular-design',
        value: item.Modular,
        isHighlight: item.Modular.includes('Full'),
      }

      const length: ComparisonSubItem = {
        label: 'length',
        value: lengthLabelHandler(item.Length),
        isHighlight: item.Length === min(selectedItems.map((element) => element.Length)),
      }

      const result: ComparisonObject = {
        img: imgStr,
        name: itemName,
        model: itemModel,
        items: [
          type,
          psuPower,
          efficiency,
          moduleType,
          length
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

  const updatedList = psuList.filter((item) => {
    let isMatch = true
    if (filterLogic.model) {
      isMatch = item.Name === filterLogic.model
    }
    if (!isEmpty(filterLogic.brand) && isMatch) {
      isMatch = (item.Brand === filterLogic.brand)
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
            label={t('psu')}
            options={generatePSUSelectElement(psuList)}
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
      <Grid sx={{ paddingTop: 10 }} container spacing={2} columns={{ xs: 6, md: 12 }}>
        {updatedList.map((item) => (
          <ItemCard
            itemLabel={generateItemName(item.Brand, item.Name)}
            priceLabel={getCurrentPrice(item)}
            imgSrc={item.Img}
            disable={selectedItems.includes(item)}
            addComparsion={() => addComparison(item)}
            removeComparsion={() => removeComparison(item.Name)}
          />
        ))}
      </Grid>
    </>
  )
}

export default PSUSuggestion
