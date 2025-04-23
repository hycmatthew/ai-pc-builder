import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Grid2 as Grid,
  Badge,
  Button,
  Box,
  Pagination,
} from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ItemCard from './ItemCard';
import ComparisonModal from './ComparisonModal';
import { ComparisonObject } from '../data/ComparisonObject';

interface HardwareSuggestionProps<T> {
  filteredList: T[];
  isLoading: boolean;
  buildComparisonObjects: (selectedItems: T[]) => ComparisonObject[];
  renderFilterForm: React.ReactNode;
  getItemLabel: (item: T) => string;
  getPriceLabel: (item: T) => string;
  getImgSrc: (item: T) => string;
  getItemIdentifier: (item: T) => string;
  itemsPerPage?: number;
}

const HardwareSuggestion = <T extends unknown>({
  filteredList,
  isLoading,
  buildComparisonObjects,
  renderFilterForm,
  getItemLabel,
  getPriceLabel,
  getImgSrc,
  getItemIdentifier,
  itemsPerPage = 20,
}: HardwareSuggestionProps<T>) => {
  const { t } = useTranslation();
  const [selectedItems, setSelectedItems] = useState<T[]>([]);
  const [openCompare, setOpenCompare] = useState(false);
  const [page, setPage] = useState(1);

  const paginatedList = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredList.slice(start, end);
  }, [filteredList, page, itemsPerPage]);

  console.log('paginatedList', paginatedList);

  const addComparison = (item: T) => {
    if (selectedItems.length < 4) {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const removeComparison = (identifier: string) => {
    const updatedList = selectedItems.filter(
      (element) => getItemIdentifier(element) !== identifier
    );
    setSelectedItems(updatedList);
    if (updatedList.length === 0) setOpenCompare(false);
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid size={9}>
          {renderFilterForm}
        </Grid>
        <Grid size={3}>
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
          <Grid size={3} key={getItemIdentifier(item)}>
            <ItemCard
              itemLabel={getItemLabel(item)}
              priceLabel={getPriceLabel(item)}
              imgSrc={getImgSrc(item)}
              disable={selectedItems.some(
                (selected) => getItemIdentifier(selected) === getItemIdentifier(item)
              )}
              addComparsion={() => addComparison(item)}
              removeComparsion={() => removeComparison(getItemIdentifier(item))}
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
  );
};

export default HardwareSuggestion;