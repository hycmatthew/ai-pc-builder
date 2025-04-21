import SvgIcon from '@mui/material/SvgIcon'
import AmazonLogo from '../../../assets/amazon_buy_logo.svg?react'
import NeweggLogo from '../../../assets/newegg_buy_logo.svg?react'

// 平台图标组件
interface PlatformIconProps {
  platform: string;
  size?: number; // 默认大小
  [key: string]: any; // 其他 SVG 属性（如 className、style）
}

const PlatformIcon = ({
  platform,
  size = 32, // 默认大小
  ...props // 其他 SVG 属性（如 className、style）
}: PlatformIconProps) => {
  const finalWidth = size
  const finalHeight = size

  switch (platform.toLowerCase()) {
    case 'amazon':
      return (
        <SvgIcon sx={{ width: finalWidth, height: finalHeight }} {...props}>
          <AmazonLogo />
        </SvgIcon>
      )
    case 'newegg':
      return (
        <SvgIcon sx={{ width: finalWidth, height: finalHeight }} {...props}>
          <NeweggLogo />
        </SvgIcon>
      )
    default:
      return (
        <SvgIcon sx={{ width: finalWidth, height: finalHeight }} {...props}>
          <AmazonLogo />
        </SvgIcon>
      )
  }
}

export default PlatformIcon
