import { useTranslation } from 'react-i18next'
import {
  Divider,
  Grid,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DescriptionIcon from '@mui/icons-material/Description'

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
import PlaceholdImage from '../../common/components/PlaceholdImage'
import CustomTextField from '../../common/components/CustomTextField'
import { generateBuildPath } from '../../../utils/PCPartUtil'
import CustomIconButton from '../../common/components/CustomIconButton'
import CustomSnackbar from '../../common/components/CustomSnackbar'

type BuySectioProps = {
  dataState: DataState
}

const HardwareSection = ({
  item,
}: {
  item: NonNullable<SelectedItemType[keyof SelectedItemType]>
}) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.down('sm'))
  const SectionHeight = 128

  // 过滤当前区域的价格信息
  const currentPrices = item ? getAllPriceByRegion(item.prices) : []
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
      <Grid size={4}>
        <PlaceholdImage
          data={item}
          width="100%"
          height={SectionHeight}
          objectFit="cover"
          borderRadius="16px 0 0 16px"
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
            {item.name}
          </CusTypography>
        </Grid>
        {/* 价格列表 */}
        <Grid size={12}>
          <Grid container spacing={1}>
            {currentPrices.map((price, index) => (
              <Grid size={12} key={`${item.name}-price-${index}`}>
                <Grid container spacing={1}>
                  <Grid size="auto">
                    <PlatformIcon platform={price.platform} />
                  </Grid>
                  <Grid size="auto">
                    <CusTypography variant="h6" lineHeight={2}>
                      {t(price.platform)}
                    </CusTypography>
                  </Grid>
                  <Grid size="auto">
                    <CusTypography variant="h6" lineHeight={2}>
                      {addCurrencySign(price.price)}
                    </CusTypography>
                  </Grid>
                  <Grid size="grow" paddingRight={2}>
                    <BuyButton
                      href={currentPrices[0].price_link}
                      variant="contained"
                      color="primary"
                    >
                      {isXs ? (
                        <ShoppingCartIcon fontSize="small" />
                      ) : (
                        t('buyNow')
                      )}
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
  const [dialogOpen, setDialogOpen] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const copyPathToClipboard = () => {
    const copyVal = generateBuildPath(dataState.selectedItems)
    navigator.clipboard
      .writeText(copyVal)
      .then(() => {
        setSnackbarOpen(true)
      })
      .catch((err) => {
        console.log(err.message)
      })
  }

  const handleSnackbarClose = () => setSnackbarOpen(false)

  const handleDialogOpen = () => {
    setDialogOpen(true)
  }

  const handleDialogClose = () => setDialogOpen(false)

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
          <Grid container size={12} spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Calculator selectedItems={dataState.selectedItems} />
            </Grid>
            <Grid size={{ xs: 12, md: 'grow' }}>
              <CustomTextField
                width="100%"
                label="Keyword"
                value={generateBuildPath(dataState.selectedItems)}
                slotProps={{
                  input: {
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <CustomIconButton
                          sx={{ borderRadius: 2, backgroundColor: '#055c9d' }}
                          onClick={copyPathToClipboard}
                        >
                          <ContentCopyIcon />
                        </CustomIconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <CustomSnackbar
                open={snackbarOpen}
                onClose={handleSnackbarClose}
                message="Copy Path Success!"
                severity="success"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 'auto' }}>
              <ListCopyDialog
                selectedItems={dataState.selectedItems}
                open={dialogOpen}
                onClose={handleDialogClose}
              />
              <CustomButton
                onClick={handleDialogOpen}
                fullWidth
                sx={{ height: '48px' }}
              >
                <DescriptionIcon sx={{ paddingRight: 1 }} />
                {t('open')}
              </CustomButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid container paddingTop={4} spacing={2} columns={{ xs: 6, md: 12 }}>
          {hardwareEntries.map(([key, item]) => (
            <HardwareSection item={item!} key={key} />
          ))}
        </Grid>
      </>
    )
  )
}

export default BuySection
