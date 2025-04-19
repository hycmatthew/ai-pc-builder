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
import { convertLocalizedPrice, getLocalizedPriceNum } from '../../../utils/NumberHelper'
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
      (element: CaseType) => element.Name !== model
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

      const size: ComparisonSubItem = {
        label: 'size',
        value:
          item.CaseSize.length > 2
            ? `${item.CaseSize[0]} * ${item.CaseSize[1]} * ${item.CaseSize[2]}`
            : '',
        isHighlight: false,
      }

      const color: ComparisonSubItem = {
        label: 'color',
        value: item.Color,
        isHighlight: false,
      }

      const maxGPULength: ComparisonSubItem = {
        label: 'max-gpu-length',
        value: item.MaxVGAlength.toString(),
        isHighlight:
          item.MaxVGAlength ===
          max(selectedItems.map((element) => element.MaxVGAlength)),
      }

      // tbc
      const motherboardCompatibility: ComparisonSubItem = {
        label: 'motherboard-compatibility',
        value: item.Compatibility.toString() || '-',
        isHighlight:
          item.Compatibility.length ===
          max(selectedItems.map((element) => element.Compatibility.length)),
      }

      const result: ComparisonObject = {
        img: imgStr,
        name: itemName,
        model: itemModel,
        items: [size, color, maxGPULength, motherboardCompatibility],
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
      isMatch = item.Name === filterLogic.model
    }
    if (filterLogic.brand && isMatch) {
      isMatch = item.Brand === filterLogic.brand
    }
    if (filterLogic.size && isMatch) {
      isMatch = item.CaseSize === filterLogic.size
    }
    if (filterLogic.price !== 0 && isMatch) {
      isMatch = getLocalizedPriceNum(item) < filterLogic.price
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
            itemLabel={generateItemName(item.Brand, item.Name)}
            priceLabel={convertLocalizedPrice(item)}
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

export default CaseSuggestion
