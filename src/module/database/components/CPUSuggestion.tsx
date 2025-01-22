import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Badge,
  Button,
  Grid,
} from '@mui/material'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import { max, min, sum } from 'lodash'

import CPUType from '../../../constant/objectTypes/CPUType'
import SelectElement from '../../common/components/SelectElement'
import PriceSlider from '../../common/components/PriceSlider'
import { generateCPUSelectElement } from '../../common/utils/generateSelectElements'
import SelectFilter from '../../common/components/SelectFilter'
import { getCPUBrand } from '../../../utils/GroupCategoryHelper'
import ItemCard from './ItemCard'

import { CPU_FILTER_INIT_DATA } from '../data/FilterInitData'
import {
  getCurrentPrice,
  getSelectedCurrency,
  stringToNumber,
} from '../../../utils/NumberHelper'
import { generateItemName } from '../../../utils/LabelHelper'
import ComparisonModal from './ComparisonModal'
import { ComparisonObject, ComparisonSubItem } from '../data/ComparisonObject'

type CPUSuggestionProps = {
  cpuList: CPUType[]
  isLoading: boolean
}

const CPUSuggestion = ({ cpuList, isLoading }: CPUSuggestionProps) => {
  const { t } = useTranslation()
  const [filterLogic, setfilterLogic] = useState(CPU_FILTER_INIT_DATA)
  const [selectedItems, setSelectedItems] = useState<CPUType[]>([])
  const [openCompare, setOpenCompare] = useState(false)

  const brandOptions = getCPUBrand(cpuList)

  const addComparison = (item: CPUType) => {
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

  const handleClose = () => {
    setOpenCompare(false)
  }

  const removeComparison = (name: string) => {
    const updatedList: CPUType[] = selectedItems.filter(
      (element: CPUType) => element.Name !== name
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

  const getCoresNumber = (coreStr: string) => {
    const coreList = coreStr.split('/').map((item) => Number(item))
    return sum(coreList)
  }

  const openComparison = () => {
    let comparsionObjects: ComparisonObject[] = []
    comparsionObjects = selectedItems.map((item) => {
      const imgStr = item.Img
      const itemModel = item.Name
      const itemName = generateItemName(item.Brand, item.Name)

      const cpuSocket: ComparisonSubItem = {
        label: 'cpu-socket',
        value: item.Socket,
        isHighlight: false,
      }

      const cpuCores: ComparisonSubItem = {
        label: 'cpu-cores',
        value: item.Cores.toString(),
        isHighlight:
        item.Cores === max(selectedItems.map((element) => element.Cores)),
      }

      const cpuDisplay: ComparisonSubItem = {
        label: 'integrated-graphics',
        value: item.GPU ? item.GPU : '-',
        isHighlight: item.GPU !== '',
      }

      const singleScore: ComparisonSubItem = {
        label: 'single-core',
        value: item.SingleCoreScore.toString(),
        isHighlight:
          item.SingleCoreScore === max(selectedItems.map((element) => element.SingleCoreScore)),
      }

      const multiScore: ComparisonSubItem = {
        label: 'multi-core',
        value: item.MultiCoreScore.toString(),
        isHighlight:
          item.MultiCoreScore === max(selectedItems.map((element) => element.MultiCoreScore)),
      }

      const power: ComparisonSubItem = {
        label: 'power',
        value: item.Power.toString(),
        isHighlight:
          item.Power === min(selectedItems.map((element) => element.Power)),
      }

      const result: ComparisonObject = {
        img: imgStr,
        name: itemName,
        model: itemModel,
        items: [
          cpuSocket,
          cpuCores,
          cpuDisplay,
          singleScore,
          multiScore,
          power,
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

  const updatedList = cpuList.filter((item) => {
    let isMatch = true
    if (filterLogic.model) {
      isMatch = item.Name === filterLogic.model
    }
    if (filterLogic.brand && isMatch) {
      isMatch = item.Brand === filterLogic.brand
    }
    if (filterLogic.price !== 0 && isMatch) {
      isMatch = stringToNumber(item[getSelectedCurrency()]) < filterLogic.price
    }
    return isMatch
  })

  return (
    <>
      <Grid container spacing={3} columns={{ xs: 6, md: 12 }}>
        <Grid item xs={9}>
          <SelectElement
            label={t('cpu')}
            options={generateCPUSelectElement(cpuList)}
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

export default CPUSuggestion
