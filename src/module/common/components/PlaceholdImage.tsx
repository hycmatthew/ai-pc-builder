import { Box } from '@mui/material'
import { t } from 'i18next'

interface PlatformIconProps {
  data: any
  width?: number | string
  height?: number | string
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  borderRadius?: string | number
  backgroundColor?: string
  placeholderType?: 'width' | 'height'
  [key: string]: any // 允许其他属性
}

const PlaceholdImage = ({
  data,
  width = '100%', // 宽度优先使用width，其次size
  height = '100%', // 高度优先使用height，其次size
  objectFit = 'contain', // 默认contain
  borderRadius = 0,
  backgroundColor = '#fbfbfb', // 默认背景色
  placeholderType = 'width', // 默认使用宽度作为占位符
  ...props
}: PlatformIconProps) => {
  const placeholderSize = backgroundColor === 'width' ? '600x400' : '500x600'

  return (
    <Box
      component="img"
      sx={{
        width: width ?? '100%', // 如果未指定宽度，默认100%
        height: height, // 使用指定的高度
        objectFit: objectFit,
        backgroundColor: backgroundColor,
        borderRadius: borderRadius,
        ...props.sx, // 允许通过sx覆盖样式
      }}
      {...props}
      alt={`${t(data.brand)} ${data.name}`}
      src={
        data.img ||
        `https://placehold.co/${placeholderSize}?text=${data.brand}+${data.name}`
      }
    />
  )
}

export default PlaceholdImage
