import React from 'react'
import Box from '@mui/material/Box'
import { Link } from 'react-router-dom'
import { SxProps, Theme } from '@mui/material/styles'
import CusTypography from './CusTypography' // 请根据实际路径调整
import CustomButton from './CustomButton' // 请根据实际路径调整
import { useLinkHandler } from '../../../utils/LinkHelper'

interface HeroBannerProps {
  /**
   * 背景图片的URL
   */
  imageUrl: string

  /**
   * 图片高度（像素）
   * @default 320
   */
  imageHeight?: number

  /**
   * 显示在横幅中的标题文字
   */
  titleText?: React.ReactNode

  /**
   * 按钮显示的文字
   */
  buttonText?: string

  /**
   * 按钮点击后的跳转链接
   */
  buttonLink?: string

  /**
   * 图片的alt描述文本
   * @default "Banner background"
   */
  imageAlt?: string

  /**
   * 自定义内容区域的样式
   */
  contentSx?: SxProps<Theme>

  /**
   * 自定义标题的样式
   */
  titleSx?: SxProps<Theme>

  /**
   * 自定义按钮的样式
   */
  buttonSx?: SxProps<Theme>
}

const HeroBanner: React.FC<HeroBannerProps> = ({
  imageUrl,
  imageHeight = 320,
  titleText,
  buttonText,
  buttonLink,
  imageAlt = 'Banner background',
  contentSx,
  titleSx,
  buttonSx,
}) => {
  const linkHandler = useLinkHandler()
  return (
    <Box
      component="div"
      sx={{
        position: 'relative',
        width: '100%',
        height: imageHeight,
        overflow: 'hidden',
      }}
    >
      {/* 背景图片 */}
      <Box
        component="img"
        sx={{
          width: '100%',
          height: imageHeight,
          objectFit: 'cover',
          backgroundPosition: 'center center',
          filter: 'blur(4px) brightness(0.6)',
          transform: 'scale(1.05)',
          transition: 'filter 0.3s ease',
        }}
        alt={imageAlt}
        src={imageUrl}
      />

      {/* 居中内容 */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          color: 'white',
          zIndex: 2,
          p: 2,
          ...contentSx,
        }}
      >
        {/* 标题文字 */}
        {titleText && (
          <CusTypography
            variant="h5"
            sx={{
              maxWidth: '600px',
              mb: 3,
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              ...titleSx,
            }}
          >
            {titleText}
          </CusTypography>
        )}

        {/* 按钮 */}
        {buttonText && (
          <CustomButton
            component={Link}
            variant="outlined"
            // @ts-expect-error: 'to' prop is valid when using react-router Link as component
            to={linkHandler(buttonLink ?? '')}
            sx={{
              py: 1,
              px: 4,
              fontSize: '1rem',
              textTransform: 'none',
              border: '1px solid #fff',
              color: '#2d2d2d',
              backgroundColor: '#fff',
              borderRadius: '0px',
              '&:hover': {
                backgroundColor: '#fff',
                color: '#2d2d2d',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s',
              ...buttonSx,
            }}
          >
            {buttonText}
          </CustomButton>
        )}
      </Box>
    </Box>
  )
}

export default HeroBanner
