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
      (element: PSUType) => element.model !== model
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

      const type: ComparisonSubItem = {
        label: 'type',
        value: item.type,
        isHighlight: false,
      }

      const psuPower: ComparisonSubItem = {
        label: 'power',
        value: item.watt.toString(),
        isHighlight: false,
      }

      const efficiency: ComparisonSubItem = {
        label: 'efficiency',
        value: item.efficiency,
        isHighlight: item.efficiency === max(selectedItems.map((element) => element.efficiency)),
      }

      const moduleType: ComparisonSubItem = {
        label: 'modular-design',
        value: item.module,
        isHighlight: item.module.includes('Full'),
      }

      const fans: ComparisonSubItem = {
        label: 'fan-size',
        value: item.fans || '-',
        isHighlight: false,
      }

      const length: ComparisonSubItem = {
        label: 'length',
        value: lengthLabelHandler(item.length),
        isHighlight: item.length === min(selectedItems.map((element) => element.length)),
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
          fans,
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
      isMatch = item.model === filterLogic.model
    }
    if (!isEmpty(filterLogic.brand) && isMatch) {
      isMatch = (item.brand === filterLogic.brand)
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

export default PSUSuggestion
