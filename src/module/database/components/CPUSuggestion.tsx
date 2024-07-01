import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Badge,
  Button,
  Grid,
} from '@mui/material'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import { motion, Variants } from 'framer-motion'
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
      (element: CPUType) => element.name !== name
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
      const imgStr = item.img
      const itemModel = item.name
      const itemName = generateItemName(item.brand, item.name)

      const cpuSocket: ComparisonSubItem = {
        label: 'cpu-socket',
        value: item.socket,
        isHighlight: false,
      }

      const cpuCores: ComparisonSubItem = {
        label: 'cpu-cores',
        value: item.cores,
        isHighlight:
          getCoresNumber(item.cores) === max(selectedItems.map((element) => getCoresNumber(element.cores))),
      }

      const cpuDisplay: ComparisonSubItem = {
        label: 'integrated-graphics',
        value: item.gpu ? item.gpu : '-',
        isHighlight: item.gpu !== '',
      }

      const singleScore: ComparisonSubItem = {
        label: 'single-core',
        value: item.singleCoreScore.toString(),
        isHighlight:
          item.singleCoreScore === max(selectedItems.map((element) => element.singleCoreScore)),
      }

      const multiScore: ComparisonSubItem = {
        label: 'multi-core',
        value: item.multiCoreScore.toString(),
        isHighlight:
          item.multiCoreScore === max(selectedItems.map((element) => element.multiCoreScore)),
      }

      const power: ComparisonSubItem = {
        label: 'power',
        value: item.power.toString(),
        isHighlight:
          item.power === min(selectedItems.map((element) => element.power)),
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
      isMatch = item.name === filterLogic.model
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
            itemLabel={generateItemName(item.brand, item.name)}
            priceLabel={getCurrentPrice(item)}
            imgSrc={item.img}
            disable={selectedItems.includes(item)}
            addComparsion={() => addComparison(item)}
            removeComparsion={() => removeComparison(item.name)}
          />
        ))}
      </Grid>
    </>
  )
}

export default CPUSuggestion
