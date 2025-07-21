import { Box, Grid } from '@mui/material'
import { SelectedItemType } from '../../../store/rawDataReducer'
import ResultCard from './ResultCard'
import {
  addCurrencySign,
  getCurrentPriceWithSign,
} from '../../../utils/NumberHelper'
import { useMemo, useState } from 'react'
import CusTypography from '../../common/components/CusTypography'
import { useTranslation } from 'react-i18next'
import DetailDialog from './DetailDialog'
import { ComponentType } from '../constant/componentConfig'

type ResultComponentProps = {
  resultData: SelectedItemType
  totalPrice: number
  totalScore: number
}

const BASE_COMPONENT_TYPES: ComponentType[] = [
  'cpu',
  'motherboard',
  'ram',
  'ssd',
  'psu',
  'pcCase',
  'cooler',
] as const

function ResultComponent({
  resultData,
  totalPrice,
  totalScore,
}: ResultComponentProps) {
  const { t } = useTranslation()
  const [selectedData, setSelectedData] = useState<{
    type: ComponentType
    data: any
  } | null>(null)

  const handleCardClick = (type: ComponentType, data: any) => {
    setSelectedData({ type, data })
  }

  const displayComponents = useMemo(() => {
    return resultData.gpu
      ? ['gpu', ...BASE_COMPONENT_TYPES]
      : [...BASE_COMPONENT_TYPES]
  }, [resultData.gpu])

  // 检查除GPU外的必需组件是否完整
  const isComplete = useMemo(
    () => BASE_COMPONENT_TYPES.every((type) => resultData[type] !== null),
    [resultData]
  )

  // 提前返回提升可读性
  if (!isComplete) return null

  return (
    <Box sx={{ paddingTop: 5 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <CusTypography variant="h6">{t('price')}</CusTypography>
          <CusTypography variant="h4">
            {addCurrencySign(totalPrice.toFixed(2))}
          </CusTypography>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <CusTypography variant="h6">{t('score')}</CusTypography>
          <CusTypography variant="h4">{totalScore}</CusTypography>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={2}
        columns={{ xs: 4, sm: 8, md: 12 }}
        sx={{ pt: 3 }}
      >
        {displayComponents.map((type) => (
          <Grid mb={1} size={{ xs: 12, sm: 4, md: 3 }} key={type}>
            <ResultCard
              type={type as ComponentType}
              price={getCurrentPriceWithSign(
                resultData[type as ComponentType]!
              )}
              data={resultData[type as ComponentType]!} // 非空断言（因 isComplete 已验证）
              onClick={() =>
                handleCardClick(
                  type as ComponentType,
                  resultData[type as ComponentType]
                )
              }
            />
          </Grid>
        ))}
      </Grid>

      {selectedData && (
        <DetailDialog
          open={!!selectedData}
          onClose={() => setSelectedData(null)}
          type={selectedData.type}
          data={selectedData.data}
          size="large"
        />
      )}
    </Box>
  )
}

export default ResultComponent
