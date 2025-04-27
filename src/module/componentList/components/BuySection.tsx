import { useTranslation } from 'react-i18next'
import { Box, Divider, Grid2 as Grid } from '@mui/material'

import { DataState, SelectedItemType } from '../../../store/rawDataReducer'
import {
  addCurrencySign,
  getAllPriceByRegion,
} from '../../../utils/NumberHelper'
import CusTypography from '../../common/components/CusTypography'
import CustomButton from '../../common/components/CustomButton'
import PlatformIcon from '../../common/components/PlatformIcon'
import BuyButton from '../../common/components/BuyButton'
import { useState } from 'react'
import ListCopyDialog from './ListCopyDialog'
import Calculator from './Calculator'

type BuySectioProps = {
  dataState: DataState
}

const HardwareSection = ({
  item,
}: {
  item: NonNullable<SelectedItemType[keyof SelectedItemType]>
}) => {
  const { t } = useTranslation()
  const SectionHeight = 128

  // 过滤当前区域的价格信息
  const currentPrices = item ? getAllPriceByRegion(item.Prices) : []
  if (currentPrices.length === 0) return null

  return (
    <Grid
      size={6}
      container
      bgcolor={'#fbfbfb'}
      borderRadius={4}
      height={SectionHeight}
      padding={0}
      spacing={2}
    >
      {/* 标题行 */}
      <Grid size="auto">
        <Box
          component="img"
          sx={{
            width: 220,
            height: SectionHeight,
            objectFit: 'cover',
            backgroundColor: 'grey.100',
            borderRadius: '16px 0 0 16px',
          }}
          alt={item.Name}
          src={
            item.Img ||
            `https://placehold.co/600x400?text=${item.Brand}+${item.Name}`
          }
        />
      </Grid>
      <Grid size="grow">
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          paddingY={1}
        >
          <CusTypography variant="h5" component="div">
            {item.Name}
          </CusTypography>
        </Grid>
        {/* 价格列表 */}
        <Grid size={12}>
          <Grid container spacing={1}>
            {currentPrices.map((price, index) => (
              <Grid size={12} key={`${item.Name}-price-${index}`}>
                <Grid container spacing={1}>
                  <Grid size="auto">
                    <PlatformIcon platform={price.Platform} />
                  </Grid>
                  <Grid size="auto">
                    <CusTypography variant="h6" lineHeight={2}>
                      {t(price.Platform)}
                    </CusTypography>
                  </Grid>
                  <Grid size="auto">
                    <CusTypography variant="h6" lineHeight={2}>
                      {addCurrencySign(price.Price)}
                    </CusTypography>
                  </Grid>
                  <Grid size="grow" paddingRight={2}>
                    <BuyButton
                      href={currentPrices[0].PriceLink}
                      variant="contained"
                      color="primary"
                    >
                      {t('buyNow')}
                    </BuyButton>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

const BuySection = ({ dataState }: BuySectioProps) => {
  const selectedItems = dataState.selectedItems
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const handleClose = () => setOpen(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const hardwareEntries = (
    Object.entries(selectedItems) as unknown as [
      keyof SelectedItemType,
      SelectedItemType[keyof SelectedItemType],
    ][]
  ).filter(([, item]) => item != null)

  const hasHardware = hardwareEntries.length > 0

  return (
    hasHardware && (
      <>
        <Divider sx={{ paddingTop: '2rem' }} />
        <Grid container paddingTop={2} spacing={2}>
          <Grid size="grow">
            <Calculator selectedItems={dataState.selectedItems} />
          </Grid>
          <Grid size="auto">
            <ListCopyDialog
              selectedItems={dataState.selectedItems}
              open={open}
              onClose={handleClose}
            />
            <CustomButton onClick={handleOpen} fullWidth>
              {t('open')}
            </CustomButton>
          </Grid>
        </Grid>
        <Grid container paddingTop={4} spacing={2}>
          {hardwareEntries.map(([key, item]) => (
            <HardwareSection item={item!} key={key} />
          ))}
        </Grid>
      </>
    )
  )
}

export default BuySection
