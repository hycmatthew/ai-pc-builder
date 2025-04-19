import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge, Box, Button, Grid2 as Grid, Pagination } from '@mui/material'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import { max, min } from 'lodash'

import CPUType from '../../../constant/objectTypes/CPUType'
import SelectElement from '../../common/components/SelectElement'
import { generateCPUSelectElement } from '../../common/utils/generateSelectElements'
import ItemCard from './ItemCard'

import { CPU_FILTER_INIT_DATA } from '../data/FilterInitData'
import {
  convertLocalizedPrice,
  getLocalizedPriceNum,
} from '../../../utils/NumberHelper'
import { generateItemName } from '../../../utils/LabelHelper'
import ComparisonModal from './ComparisonModal'
import { ComparisonObject, ComparisonSubItem } from '../data/ComparisonObject'
import ProductEnum from '../../../constant/ProductEnum'
import CustomButton from '../../common/components/CustomButton'

type CPUSuggestionProps = {
  cpuList: CPUType[]
  isLoading: boolean
}

const CPUSuggestion = ({ cpuList, isLoading }: CPUSuggestionProps) => {
  const { t } = useTranslation()
  const [filterLogic, setfilterLogic] = useState(CPU_FILTER_INIT_DATA)
  const [selectedItem, setSelectedItem] = useState<string | undefined>(
    undefined
  )
  const [selectedItems, setSelectedItems] = useState<CPUType[]>([])
  const [openCompare, setOpenCompare] = useState(false)

  const addComparison = (item: CPUType) => {
    if (selectedItems.length < 4) {
      setSelectedItems([...selectedItems, item])
    }
  }

  const updateSelectedItem = (item: string) => {
    setSelectedItem(item)
    setfilterLogic({ ...filterLogic, model: item })
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
          item.SingleCoreScore ===
          max(selectedItems.map((element) => element.SingleCoreScore)),
      }

      const multiScore: ComparisonSubItem = {
        label: 'multi-core',
        value: item.MultiCoreScore.toString(),
        isHighlight:
          item.MultiCoreScore ===
          max(selectedItems.map((element) => element.MultiCoreScore)),
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
      isMatch = getLocalizedPriceNum(item) < filterLogic.price
    }
    return isMatch
  })

  const [page, setPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20) // 每页显示数量

  const paginatedList = useMemo(() => {
    const start = (page - 1) * itemsPerPage
    const end = start + itemsPerPage
    return updatedList.slice(start, end)
  }, [updatedList, page, itemsPerPage])

  return (
    <>
      <Grid container spacing={3} columns={{ xs: 6, md: 12 }}>
        <Grid size={9}>
          <SelectElement
            label={ProductEnum.CPU}
            options={generateCPUSelectElement(cpuList)}
            selectChange={updateSelectedItem}
            isLoading={isLoading}
            value={selectedItem}
          />
        </Grid>
        <Grid size={3}>
          <Badge badgeContent={selectedItems.length} color="error">
            <CustomButton
              startIcon={<CompareArrowsIcon />}
              variant="contained"
              disabled={selectedItems.length === 0}
              onClick={() => openCompareLogic()}
              sx={{ height: '54px' }}
            >
              {t('confirm')}
            </CustomButton>
          </Badge>
        </Grid>
        {openComparison()}
      </Grid>
      <Grid
        sx={{ paddingTop: 4 }}
        container
        spacing={2}
        columns={{ xs: 6, md: 12 }}
      >
        {paginatedList.map((item) => (
          <Grid size={3} key={generateItemName(item.Brand, item.Name)}>
            <ItemCard
              itemLabel={generateItemName(item.Brand, item.Name)}
              priceLabel={convertLocalizedPrice(item)}
              imgSrc={item.Img}
              disable={selectedItems.includes(item)}
              addComparsion={() => addComparison(item)}
              removeComparsion={() => removeComparison(item.Name)}
            />
          </Grid>
        ))}
      </Grid>
      {/* 分页控制器 */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          py: 3,
        }}
      >
        <Pagination
          count={Math.ceil(updatedList.length / itemsPerPage)}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>
    </>
  )
}

export default CPUSuggestion
