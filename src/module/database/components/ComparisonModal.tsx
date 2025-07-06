import { useTranslation } from 'react-i18next'
import {
  Grid,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { ComparisonObject, ComparisonSubItem } from '../data/ComparisonObject'
import { EMPTY_IMG_DATA } from '../../../constant/EmptyImage'
import CustomDialog from '../../common/components/CustomDialog'
import { useMemo } from 'react'

type ComparisonModalProp = {
  comparisonObjects: ComparisonObject[]
  isOpen: boolean
  handleClose: () => void
  handleRemove: (name: string) => void
}

const style = {
  textAlign: 'center',
}

const boxStyle = {
  backgroundColor: '#f7fafc',
  borderRadius: '8px',
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
      <Typography
        sx={mainTypographyStyle}
        color={isHighlight ? '#00b359' : '#000'}
      >
        {value}
      </Typography>
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
      size="large"
      sx={style}
    >
      <Grid container spacing={2} direction="column">
        {/* 硬件展示行 */}
        <Grid container spacing={3} justifyContent="center">
          {comparisonObjects.map((comparisonObject) => (
            <Grid key={comparisonObject.id} size={3}>
              <CardMedia
                component="img"
                image={comparisonObject.img || EMPTY_IMG_DATA}
                alt={comparisonObject.name}
                sx={{ maxHeight: 120, objectFit: 'contain' }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={nameTypographyStyle}>
                  {comparisonObject.name}
                </Typography>
              </Box>
              <Button
                startIcon={<ClearIcon />}
                color="error"
                variant="outlined"
                onClick={() => handleRemove(comparisonObject.id)}
                fullWidth
                sx={{ mb: 2 }}
              >
                {t('remove')}
              </Button>
            </Grid>
          ))}
        </Grid>

        {/* 参数对比区域 */}
        {allParameterLabels.map((label) => (
          <Box style={boxStyle}>
            <Grid container key={label} spacing={2}>
              {/* 参数名称表头 */}
              <Grid size={12}>
                <Typography>{t(label)}</Typography>
              </Grid>

              {/* 硬件参数值 */}
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
        ))}
      </Grid>
    </CustomDialog>
  )
}

export default ComparisonModal
