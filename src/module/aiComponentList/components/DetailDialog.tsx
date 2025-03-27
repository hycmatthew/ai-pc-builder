import { Grid2 as Grid, Box, Chip, Avatar } from '@mui/material'
import CusTypography from '../../common/components/CusTypography'
import CustomDialog from '../../common/components/CustomDialog'
import { componentConfig } from '../constant/componentConfig'
import { useTranslation } from 'react-i18next'

type HardwareType = keyof typeof componentConfig

interface DetailDialogProps {
  open: boolean
  onClose: () => void
  type: HardwareType
  data?: any
  price?: string
  link?: string
  size?: 'small' | 'medium' | 'large' | 'xlarge'
}

const DetailDialog = ({
  open,
  onClose,
  type,
  data,
  price,
  link,
  size = 'large',
}: DetailDialogProps) => {
  if (!data) return null

  const { t } = useTranslation()
  const config = componentConfig[type]

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      title={`${t(data.Brand)} ${data.Name}`}
      size={size}
    >
      <Grid container spacing={3}>
        {/* 图片展示区域 */}
        <Grid size={12}>
          <Box
            component="img"
            sx={{
              width: '100%',
              height: 300,
              objectFit: 'contain',
              borderRadius: 2,
              backgroundColor: '#fbfbfb',
            }}
            alt={`${t(data.Brand)} ${data.Name}`}
            src={
              data.Img ||
              `https://placehold.co/600x400?text=${data.Brand}+${data.Name}`
            }
          />
          {price && (
            <Box mt={2} textAlign="right">
              <Chip
                avatar={<Avatar alt="Natacha" src="/static/images/avatar/1.jpg" />}
                label={`${price}`}
                color="success"
                component="a"
                href={link}
                target='_blank'
                clickable
              />
            </Box>
          )}
        </Grid>

        {/* 参数详情区域 */}
        <Grid size={12}>
          <Box
            sx={{
              maxHeight: '60vh',
              overflowY: 'auto',
              pr: 1,
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                borderRadius: '8px',
                backgroundColor: '#fbfbfb',
              },
            }}
          >
            <Grid container spacing={2}>
              {config.properties.detail.map((prop: any, index) => (
                <Grid size={12} key={`${type}-${prop.key}-${index}`}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: '#fbfbfb',
                    }}
                  >
                    <CusTypography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      {t(prop.label)}
                    </CusTypography>
                    <CusTypography variant="body1">
                      {prop.formatter
                        ? prop.formatter(data)
                        : data[prop.key] || '-'}
                    </CusTypography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>

      {/* 分隔线装饰
      <Divider
        sx={{
          my: 3,
          '&::before, &::after': {
            borderColor: 'divider',
          },
        }}
      >
        <Typography variant="overline">产品详情</Typography>
      </Divider>

      <Box sx={{ columnCount: { xs: 1, sm: 2 }, columnGap: 4 }}>
        <CusTypography variant="body2" paragraph>
          {data.Description || '暂无详细描述'}
        </CusTypography>
      </Box>
      */}
    </CustomDialog>
  )
}

export default DetailDialog
