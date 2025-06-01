import * as React from 'react'
import { styled } from '@mui/material/styles'
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import Zoom from '@mui/material/Zoom'

// 使用 MUI styled 自定义 Tooltip
const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
  [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
    {
      marginTop: '8px',
    },
}))

interface CustomTooltipProps {
  title: React.ReactNode
  placement?: TooltipProps['placement']
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  title,
  placement = 'bottom',
}) => {
  return (
    <HtmlTooltip
      title={
        <React.Fragment>
          {typeof title === 'string' ? (
            <Typography variant="body2">{title}</Typography>
          ) : (
            title
          )}
        </React.Fragment>
      }
      leaveDelay={250}
      placement={placement}
      slots={{
        transition: Zoom,
      }}
    >
      <InfoOutlinedIcon
        fontSize="small"
        sx={{
          paddingLeft: '4px',
          cursor: 'pointer',
          color: '#fa9409',
          '&:hover': {
            color: '#fba93a',
          },
        }}
      />
    </HtmlTooltip>
  )
}

export default CustomTooltip
