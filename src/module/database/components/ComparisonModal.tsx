import { useTranslation } from 'react-i18next'
import { Grid, Typography, Box } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { ComparisonObject, ComparisonSubItem } from '../data/ComparisonObject'
import CustomDialog from '../../common/components/CustomDialog'
import { useMemo } from 'react'
import CusTypography from '../../common/components/CusTypography'
import PlaceholdImage from '../../common/components/PlaceholdImage'
import CustomButton from '../../common/components/CustomButton'

type ComparisonModalProp = {
  comparisonObjects: ComparisonObject[]
  isOpen: boolean
  handleClose: () => void
  handleRemove: (name: string) => void
}

const style = {
  padding: '12px 40px',
  textAlign: 'center',
}

const headerStyle = {
  paddingTop: '8px',
  color: '#666',
}

const boxStyle = {
  width: '100%',
  backgroundColor: '#f7fafc',
  borderRadius: '8px',
  padding: '16px',
}

const nameTypographyStyle = {
  fontSize: '14px',
  color: '#999',
  paddingTop: '4px',
}

const mainTypographyStyle = {
  fontSize: '15px',
}

type ComparisonTypographyProps = {
  item: ComparisonSubItem | undefined
}

const ComparisonValue = ({ item }: ComparisonTypographyProps) => {
  if (!item) return <Typography>-</Typography>

  const { value, isHighlight } = item

  return (
    <Box>
      <CusTypography
        sx={mainTypographyStyle}
        fontWeight={isHighlight ? 'bold' : 'normal'}
        variant={'caption'}
      >
        {value}
      </CusTypography>
    </Box>
  )
}

const ComparisonModal = ({
  comparisonObjects,
  isOpen,
  handleClose,
  handleRemove,
}: ComparisonModalProp) => {
  const { t } = useTranslation()

  // 获取所有参数的唯一标签（作为表头）
  const allParameterLabels = useMemo(() => {
    const labels = new Set<string>()
    comparisonObjects.forEach((obj) => {
      obj.items.forEach((item) => labels.add(item.label))
    })
    return Array.from(labels)
  }, [comparisonObjects])

  return (
    <CustomDialog
      open={isOpen}
      onClose={handleClose}
      title={t('pc-part-list')}
      size="xlarge"
    >
      <Grid
        container
        spacing={2}
        direction="column"
        sx={style}
      >
        {/* 硬件展示行 */}
        <Grid container spacing={3} justifyContent="center">
          {comparisonObjects.map((comparisonObject) => (
            <Grid key={comparisonObject.id} size={3}>
              <Box sx={{ padding: 2 }}>
                <PlaceholdImage data={comparisonObject} />
                <Box sx={{ alignItems: 'center' }}>
                  <CusTypography variant="h6" sx={nameTypographyStyle}>
                    {comparisonObject.name}
                  </CusTypography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} justifyContent="center" paddingBottom={1}>
          {comparisonObjects.map((comparisonObject) => (
            <Grid key={comparisonObject.id} size={3}>
              <CustomButton
                startIcon={<ClearIcon />}
                variant="outlined"
                onClick={() => handleRemove(comparisonObject.id)}
              >
                {t('remove')}
              </CustomButton>
            </Grid>
          ))}
        </Grid>

        {/* 参数对比区域 */}
        {allParameterLabels.map((label) => (
          <Grid container key={label} spacing={2}>
            {/* 参数名称表头 */}
            <Grid size={12}>
              <Box style={headerStyle}>
                <CusTypography variant="h5">{t(label)}</CusTypography>
              </Box>
            </Grid>

            {/* 硬件参数值 */}
            <Box style={boxStyle}>
              <Grid container spacing={2} justifyContent={'center'}>
                {comparisonObjects.map((obj) => {
                  const item = obj.items.find((i) => i.label === label)
                  return (
                    <Grid size={3} key={`${obj.id}-${label}`}>
                      <ComparisonValue item={item} />
                    </Grid>
                  )
                })}
              </Grid>
            </Box>
          </Grid>
        ))}
      </Grid>
    </CustomDialog>
  )
}

export default ComparisonModal
