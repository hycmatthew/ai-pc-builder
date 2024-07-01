import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Badge,
  Button,
  Grid,
} from '@mui/material'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import { max, min } from 'lodash'

import GPUType from '../../../constant/objectTypes/GPUType'
import SelectElement from '../../common/components/SelectElement'
import PriceSlider from '../../common/components/PriceSlider'
import { generateGPUSelectElement } from '../../common/utils/generateSelectElements'
import SelectFilter from '../../common/components/SelectFilter'
import { getGPUBrand, getGPUManufacturer, getGPUType } from '../../../utils/GroupCategoryHelper'
import { stringToNumber, getSelectedCurrency, getCurrentPrice } from '../../../utils/NumberHelper'
import ItemCard from './ItemCard'

import { GPU_FILTER_INIT_DATA } from '../data/FilterInitData'
import { generateItemName, lengthLabelHandler } from '../../../utils/LabelHelper'
import { ComparisonObject, ComparisonSubItem } from '../data/ComparisonObject'
import ComparisonModal from './ComparisonModal'

type GPUSuggestionProps = {
  gpuList: GPUType[]
  isLoading: boolean
}

const GPUSuggestion = ({
  gpuList,
  isLoading,
}: GPUSuggestionProps) => {
  const { t } = useTranslation()
  const [filterLogic, setfilterLogic] = useState(GPU_FILTER_INIT_DATA)
  const [selectedItems, setSelectedItems] = useState<GPUType[]>([])
  const [openCompare, setOpenCompare] = useState(false)

  const brandOptions = getGPUBrand(gpuList)
  const manufacturerOptions = getGPUManufacturer(gpuList)
  const gpuOptions = getGPUType(gpuList)

  const addComparison = (item: GPUType) => {
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

  const updateFilterManufacturer = (manufacturer: string) => {
    setfilterLogic({ ...filterLogic, manufacturer })
  }

  const updateGPUType = (gpu: string) => {
    setfilterLogic({ ...filterLogic, gpu })
  }

  const handleClose = () => {
    setOpenCompare(false)
  }

  const removeComparison = (model: string) => {
    const updatedList: GPUType[] = selectedItems.filter(
      (element: GPUType) => element.model !== model
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

  const getRamNumber = (numStr: string) => {
    return numStr.split(' ')[0] || 0
  }

  const openComparison = () => {
    let comparsionObjects: ComparisonObject[] = []
    comparsionObjects = selectedItems.map((item) => {
      const imgStr = item.img
      const itemModel = item.model
      const itemName = generateItemName(item.brand, item.model)

      const gpuMemorySize: ComparisonSubItem = {
        label: 'gpu-memory-size',
        value: item.memorySize,
        isHighlight: getRamNumber(item.memorySize) === max(selectedItems.map((element) => getRamNumber(element.memorySize))),
      }

      const gpuMemoryType: ComparisonSubItem = {
        label: 'gpu-memory-type',
        value: item.memoryType,
        isHighlight: false
      }

      const gpuMemoryInterface: ComparisonSubItem = {
        label: 'gpu-memory-interface',
        value: item.memoryInterface,
        isHighlight: getRamNumber(item.memoryInterface) === max(selectedItems.map((element) => getRamNumber(element.memoryInterface))),
      }

      const cudaCores: ComparisonSubItem = {
        label: 'cuda-cores',
        value: item.cudaCores.toString(),
        isHighlight: item.cudaCores === max(selectedItems.map((element) => element.cudaCores)),
      }

      const timespyScore: ComparisonSubItem = {
        label: 'TimeSpy Score',
        value: item.timespyScore.toString(),
        isHighlight:
          item.timespyScore === max(selectedItems.map((element) => element.timespyScore)),
      }

      const firestrikeScore: ComparisonSubItem = {
        label: 'FireStrike Score',
        value: item.firestrikeScore.toString(),
        isHighlight: item.firestrikeScore === max(selectedItems.map((element) => element.firestrikeScore)),
      }

      const power: ComparisonSubItem = {
        label: 'power',
        value: item.power.toString(),
        isHighlight: item.power === min(selectedItems.map((element) => element.power)),
      }

      const gpuLength: ComparisonSubItem = {
        label: 'gpu-length',
        value: lengthLabelHandler(item.length),
        isHighlight: item.length === min(selectedItems.map((element) => element.length)),
      }

      const result: ComparisonObject = {
        img: imgStr,
        name: itemName,
        model: itemModel,
        items: [
          gpuMemorySize,
          gpuMemoryType,
          gpuMemoryInterface,
          cudaCores,
          timespyScore,
          firestrikeScore,
          power,
          gpuLength,
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

  const updatedList = gpuList.filter((item) => {
    let isMatch = true
    if (filterLogic.model) {
      isMatch = item.model === filterLogic.model
    }
    if (filterLogic.brand && isMatch) {
      isMatch = (item.brand === filterLogic.brand)
    }
    if (filterLogic.manufacturer && isMatch) {
      isMatch = (item.manufacturer === filterLogic.manufacturer)
    }
    if (filterLogic.gpu && isMatch) {
      isMatch = (item.gpu === filterLogic.gpu)
    }
    if (filterLogic.price !== 0 && isMatch) {
      isMatch = (stringToNumber(item[getSelectedCurrency()]) < filterLogic.price)
    }
    return isMatch
  })

  return (
    <>
      <Grid container spacing={3} columns={{ xs: 6, md: 12 }}>
        <Grid item xs={9}>
          <SelectElement
            label={t('graphic-card')}
            options={generateGPUSelectElement(gpuList)}
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
            label={t('manufacturer')}
            options={manufacturerOptions}
            selectChange={updateFilterManufacturer}
          />
        </Grid>
        <Grid item xs={6}>
          <SelectFilter
            label={t('graphics-processing-unit')}
            options={gpuOptions}
            selectChange={updateGPUType}
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

export default GPUSuggestion
