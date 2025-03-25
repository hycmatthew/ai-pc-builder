import { Box, Grid2 as Grid } from '@mui/material'
import { SelectedItemType } from '../../../store/rawDataReducer'
import ResultCard from './ResultCard'
import { getCurrentPrice } from '../../../utils/NumberHelper'
import { useMemo, useState } from 'react'
import CusTypography from '../../common/components/CusTypography'
import { useTranslation } from 'react-i18next'
import DetailDialog from './DetailDialog'
import { ComponentType } from '../constant/componentConfig'

type ResultComponentProps = {
  resultData: SelectedItemType
}

const COMPONENT_TYPES = [
  'cpu',
  'gpu',
  'motherboard',
  'ram',
  'ssd',
  'psu',
  'pcCase',
  'cooler',
] as const

// type ComponentType = (typeof COMPONENT_TYPES)[number]

function ResultComponent({ resultData }: ResultComponentProps) {
  const { t } = useTranslation()
  const [selectedData, setSelectedData] = useState<{
    type: ComponentType
    data: any
  } | null>(null)

  const handleCardClick = (type: ComponentType, data: any) => {
    setSelectedData({ type, data })
  }

  const isComplete = useMemo(
    () => Object.values(resultData).every((value) => value !== null),
    [resultData]
  )

  // 提前返回提升可读性
  if (!isComplete) return null

  return (
    <Box sx={{ paddingTop: 5 }}>
      <Grid container spacing={2}>
        <Grid size={3}>
          <CusTypography variant="h6">{t('score')}</CusTypography>
          <CusTypography variant="h4">123</CusTypography>
        </Grid>
      </Grid>
      <Grid container spacing={2} columns={{ xs: 6, md: 12 }}>
        {COMPONENT_TYPES.map((type) => (
          <Grid
            size={3}
            key={type}
            sx={{ display: 'flex' }} // 确保卡片高度统一
          >
            <ResultCard
              type={type}
              price={getCurrentPrice(resultData[type])}
              data={resultData[type]!} // 非空断言（因 isComplete 已验证）
              onClick={() => handleCardClick(type, resultData[type])}
            />
          </Grid>
        ))}
        {selectedData && (
          <DetailDialog
            open={!!selectedData}
            onClose={() => setSelectedData(null)}
            type={selectedData.type}
            data={selectedData.data}
            price={getCurrentPrice(selectedData.data)}
            size="large"
          />
        )}
      </Grid>
    </Box>
  )
}

export default ResultComponent
