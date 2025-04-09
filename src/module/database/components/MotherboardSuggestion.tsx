import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Badge,
  Button,
  Grid2 as Grid,
} from '@mui/material'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'

import MotherboardType from '../../../constant/objectTypes/MotherboardType'
import SelectElement from '../../common/components/SelectElement'
import PriceSlider from '../../common/components/PriceSlider'
import { generateMotherboardSelectElement } from '../../common/utils/generateSelectElements'
import SelectFilter from '../../common/components/SelectFilter'
import { getMotherboardBrand, getMotherboardChipset } from '../../../utils/GroupCategoryHelper'
import ComparisonModal from './ComparisonModal'
import ItemCard from './ItemCard'

import { MOTHERBOARD_FILTER_INIT_DATA } from '../data/FilterInitData'
import { generateItemName } from '../../../utils/LabelHelper'
import { ComparisonObject, ComparisonSubItem } from '../data/ComparisonObject'
import { convertLocalizedPrice, getSelectedCurrency, stringToNumber } from '../../../utils/NumberHelper'
import { FixedSizeGrid } from 'react-window'

type MotherboardSuggestionProps = {
  motherboardList: MotherboardType[]
  isLoading: boolean
}

const MotherboardSuggestion = ({
  motherboardList,
  isLoading,
}: MotherboardSuggestionProps) => {
  const { t } = useTranslation()
  const [filterLogic, setfilterLogic] = useState(MOTHERBOARD_FILTER_INIT_DATA)
  const [selectedItems, setSelectedItems] = useState<MotherboardType[]>([])
  const [openCompare, setOpenCompare] = useState(false)

  const brandOptions = getMotherboardBrand(motherboardList)
  const chipsetOptions = getMotherboardChipset(motherboardList)

  const addComparison = (item: MotherboardType) => {
    setSelectedItems([...selectedItems, item])
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

  const updateFilterChipset = (chipset: string) => {
    setfilterLogic({ ...filterLogic, chipset })
  }

  const openCompareLogic = () => {
    if (selectedItems.length > 0) {
      setOpenCompare(true)
    }
  }

  const handleClose = () => {
    setOpenCompare(false)
  }

  const removeComparison = (model: string) => {
    const updatedList: MotherboardType[] = selectedItems.filter(
      (element: MotherboardType) => element.Name !== model
    )
    if (updatedList.length === 0) {
      handleClose()
    }
    setSelectedItems([...updatedList])
  }

  const openComparison = () => {
    let comparsionObjects: ComparisonObject[] = []
    comparsionObjects = selectedItems.map((item) => {
      const imgStr = item.Img
      const itemModel = item.Name
      const itemName = generateItemName(item.Brand, item.Name)

      const motherboardSocket: ComparisonSubItem = {
        label: 'cpu-socket',
        value: item.Socket,
        isHighlight: false,
      }

      const motherboardChipset: ComparisonSubItem = {
        label: 'chipset',
        value: item.Chipset,
        isHighlight: false,
      }

      const motherboardRamType: ComparisonSubItem = {
        label: 'memory-type',
        value: item.RamType,
        isHighlight: false,
      }
      /*
      const motherboardSupporedRam: ComparisonSubItem = {
        label: 'motherboard-ram',
        value: item.supportedRam,
        isHighlight: false,
      }
      */
      const sizeType: ComparisonSubItem = {
        label: 'form-factor',
        value: item.FormFactor,
        isHighlight: false,
      }

      const result: ComparisonObject = {
        img: imgStr,
        name: itemName,
        model: itemModel,
        items: [
          motherboardSocket,
          motherboardChipset,
          motherboardRamType,
          sizeType,
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

  const updatedList = motherboardList.filter((item) => {
    let isMatch = true
    if (filterLogic.model) {
      isMatch = item.Name === filterLogic.model
    }
    if (filterLogic.brand && isMatch) {
      isMatch = item.Brand === filterLogic.brand
    }
    if (filterLogic.chipset && isMatch) {
      isMatch = item.Chipset === filterLogic.chipset
    }
    if (filterLogic.price !== 0 && isMatch) {
      isMatch = stringToNumber(item[getSelectedCurrency()]) < filterLogic.price
    }
    return isMatch
  })

  return (
    <>
      <Grid container spacing={3} columns={{ xs: 6, md: 12 }}>
        <Grid size={9}>
          <SelectElement
            label={t('motherboard')}
            options={generateMotherboardSelectElement(motherboardList)}
            selectChange={updateSelectedItem}
            isLoading={isLoading}
          />
        </Grid>
        <Grid size={3}>
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
        <Grid size={9}>
          <PriceSlider selectChange={updateMaxPrice} />
        </Grid>
        <Grid size={6}>
          <SelectFilter
            label={t('brand')}
            options={brandOptions}
            selectChange={updateFilterBrand}
          />
        </Grid>
        <Grid size={6}>
          <SelectFilter
            label={t('chipset')}
            options={chipsetOptions}
            selectChange={updateFilterChipset}
          />
        </Grid>
      </Grid>
      <Grid
        sx={{ paddingTop: 10 }}
        container
        spacing={2}
        columns={{ xs: 6, md: 12 }}
      >
        <Grid
          style={{
            height: '100%',
            width: '100%',
            padding: '8px', // 补偿间距
          }}
        >
          <FixedSizeGrid
            columnCount={4} // 12 / 3 = 4 columns
            columnWidth={192} // 根据实际卡片宽度调整
            rowCount={Math.ceil(updatedList.length / 4)}
            rowHeight={300} // 根据实际卡片高度调整
            height={800} // 容器高度
            width={800} // 容器宽度
            itemData={updatedList} // 传递数据
          >
            {({ columnIndex, rowIndex, style }) => {
              const index = rowIndex * 4 + columnIndex
              const item = updatedList[index]

              if (!item) return null

              return (
                <div
                  style={{
                    ...style,
                    padding: 8, // 补偿间距
                  }}
                >
                  <ItemCard
                    key={generateItemName(item.Brand, item.Name)}
                    itemLabel={generateItemName(item.Brand, item.Name)}
                    priceLabel={convertLocalizedPrice(item)}
                    imgSrc={item.Img}
                    disable={selectedItems.includes(item)}
                    addComparsion={() => addComparison(item)}
                    removeComparsion={() => removeComparison(item.Name)}
                  />
                </div>
              )
            }}
          </FixedSizeGrid>
        </Grid>
      </Grid>
    </>
  )
}

export default MotherboardSuggestion
