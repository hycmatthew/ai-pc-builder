import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid2 as Grid, Badge, Button, Box, Pagination } from '@mui/material'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import ItemCard from './ItemCard'
import ComparisonModal from './ComparisonModal'
import { ComparisonObject } from '../data/ComparisonObject'
import { AllType } from '../../../constant/objectTypes'

interface HardwareSuggestionProps<T> {
  filteredList: T[]
  isLoading: boolean
  buildComparisonObjects: (selectedItems: T[]) => ComparisonObject[]
  renderFilterForm: React.ReactNode
  itemsPerPage?: number
}

const HardwareSuggestion = <T extends AllType>({
  filteredList,
  buildComparisonObjects,
  renderFilterForm,
  itemsPerPage = 20,
}: HardwareSuggestionProps<T>) => {
  const { t } = useTranslation()
  const [selectedItems, setSelectedItems] = useState<T[]>([])
  const [openCompare, setOpenCompare] = useState(false)
  const [page, setPage] = useState(1)

  const paginatedList = useMemo(() => {
    const start = (page - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredList.slice(start, end)
  }, [filteredList, page, itemsPerPage])

  console.log('paginatedList', paginatedList)

  const addComparison = (item: T) => {
    if (selectedItems.length < 4) {
      setSelectedItems([...selectedItems, item])
    }
  }

  const removeComparison = (identifier: string) => {
    const updatedList = selectedItems.filter(
      (element) => element.id !== identifier
    )
    setSelectedItems(updatedList)
    if (updatedList.length === 0) setOpenCompare(false)
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 9 }}>{renderFilterForm}</Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Badge badgeContent={selectedItems.length} color="error">
            <Button
              startIcon={<CompareArrowsIcon />}
              variant="contained"
              disabled={selectedItems.length === 0}
              onClick={() => setOpenCompare(true)}
              sx={{ height: 54 }}
            >
              {t('compare')}
            </Button>
          </Badge>
        </Grid>
      </Grid>

      <ComparisonModal
        comparisonObjects={buildComparisonObjects(selectedItems)}
        isOpen={openCompare}
        handleClose={() => setOpenCompare(false)}
        handleRemove={removeComparison}
      />

      <Grid container spacing={2} sx={{ pt: 4 }}>
        {paginatedList.map((item) => (
          <Grid size={{ xs: 6, md: 3 }} key={item.id}>
            <ItemCard
              item={item}
              disable={selectedItems.some(
                (selected) => selected.id === item.id
              )}
              addComparsion={() => addComparison(item)}
              removeComparsion={() => removeComparison(item.id)}
            />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
        <Pagination
          count={Math.ceil(filteredList.length / itemsPerPage)}
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

export default HardwareSuggestion
