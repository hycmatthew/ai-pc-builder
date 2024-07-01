import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { max, min } from 'lodash'
import { Badge, Button, Grid } from '@mui/material'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'

import PriceSlider from '../../common/components/PriceSlider'
import ItemCard from './ItemCard'
import CaseType from '../../../constant/objectTypes/CaseType'
import SelectElement from '../../common/components/SelectElement'
import { generateCaseSelectElement } from '../../common/utils/generateSelectElements'
import SelectFilter from '../../common/components/SelectFilter'

import { CASE_FILTER_INIT_DATA } from '../data/FilterInitData'
import { generateItemName } from '../../../utils/LabelHelper'
import { ComparisonObject, ComparisonSubItem } from '../data/ComparisonObject'
import ComparisonModal from './ComparisonModal'
import {
  getCurrentPrice,
  getSelectedCurrency,
  stringToNumber,
} from '../../../utils/NumberHelper'
import { getCaseBrand, getCaseSize } from '../../../utils/GroupCategoryHelper'

type CaseSuggestionProps = {
  caseList: CaseType[]
  isLoading: boolean
}

const CaseSuggestion = ({ caseList, isLoading }: CaseSuggestionProps) => {
  const { t } = useTranslation()
  const [filterLogic, setfilterLogic] = useState(CASE_FILTER_INIT_DATA)
  const [selectedItems, setSelectedItems] = useState<CaseType[]>([])
  const [openCompare, setOpenCompare] = useState(false)

  const brandOptions = getCaseBrand(caseList)
  const typeOptions = getCaseSize(caseList)

  const addComparison = (item: CaseType) => {
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
    setfilterLogic({ ...filterLogic, size })
  }

  const handleClose = () => {
    setOpenCompare(false)
  }

  const removeComparison = (model: string) => {
    const updatedList: CaseType[] = selectedItems.filter(
      (element: CaseType) => element.model !== model
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

      const size: ComparisonSubItem = {
        label: 'size',
        value:
          item.size.length > 2
            ? `${item.size[0]} * ${item.size[1]} * ${item.size[2]}`
            : '',
        isHighlight: false,
      }

      const weight: ComparisonSubItem = {
        label: 'weight',
        value: item.weight,
        isHighlight: false,
      }

      const color: ComparisonSubItem = {
        label: 'color',
        value: item.color,
        isHighlight: false,
      }

      const maxGPULength: ComparisonSubItem = {
        label: 'max-gpu-length',
        value: item.maxGPULength.toString(),
        isHighlight:
          item.maxGPULength === max(selectedItems.map((element) => element.maxGPULength)),
      }

      const maxPSULength: ComparisonSubItem = {
        label: 'max-psu-length',
        value: item.maxPSULength.toString(),
        isHighlight: item.maxPSULength === max(selectedItems.map((element) => element.maxPSULength)),
      }

      const motherboardCompatibility: ComparisonSubItem = {
        label: 'motherboard-compatibility',
        value: item.motherboardCompatibility.toString() || '-',
        isHighlight:
          item.motherboardCompatibility.length === max(selectedItems.map((element) => element.motherboardCompatibility.length)),
      }

      const result: ComparisonObject = {
        img: imgStr,
        name: itemName,
        model: itemModel,
        items: [
          size,
          weight,
          color,
          maxGPULength,
          maxPSULength,
          motherboardCompatibility,
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

  const updatedList = caseList.filter((item) => {
    let isMatch = true
    if (filterLogic.model) {
      isMatch = item.model === filterLogic.model
    }
    if (filterLogic.brand && isMatch) {
      isMatch = item.brand === filterLogic.brand
    }
    if (filterLogic.size && isMatch) {
      isMatch = item.type === filterLogic.size
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
            label={t('computer-case')}
            options={generateCaseSelectElement(caseList)}
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
            options={typeOptions}
            selectChange={updateFilterSize}
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

export default CaseSuggestion
