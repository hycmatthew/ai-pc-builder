import {
  Dialog,
  DialogProps,
  DialogTitle,
  DialogContent,
  IconButton,
  styled,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { ReactNode } from 'react'

const StyledDialog = styled(Dialog, {
  shouldForwardProp: (prop) => prop !== 'size',
})<{ size?: DialogSize }>(({ theme, size = 'medium' }) => {
  const { minWidth, minHeight } = SIZE_MAP[size]

  return {
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
    '& .MuiDialog-paper': {
      borderRadius: '8px',
      minWidth,
      minHeight,
      // 響應式調整
      [theme.breakpoints.down('sm')]: {
        minWidth: '100% !important',
        minHeight: 'auto !important',
        margin: theme.spacing(2),
      },
    },
  }
})

// 尺寸配置类型
type SizeConfig = {
  minWidth: number | string
  minHeight: number | string
}

type DialogSize = 'small' | 'medium' | 'large' | 'xlarge'

// 尺寸對應表
const SIZE_MAP: Record<DialogSize, SizeConfig> = {
  small: {
    minWidth: 400,
    minHeight: 300,
  },
  medium: {
    minWidth: 480,
    minHeight: 360,
  },
  large: {
    minWidth: '50%',
    minHeight: '500px',
  },
  xlarge: {
    minWidth: '80%',
    minHeight: '80vh',
  },
}

type CustomDialogProps = DialogProps & {
  onClose: () => void
  title?: ReactNode
  size?: DialogSize
}

const CustomDialog = ({
  open,
  onClose,
  title,
  size = 'medium', // 預設中等尺寸
  children,
  ...props
}: CustomDialogProps) => {
  console.log(size)
  return (
    <StyledDialog {...props} open={open} onClose={onClose} size={size}>
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {title}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={(theme) => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
          '&:focus': {
            outline: 'none',
            boxShadow: 'none',
          },
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>{children}</DialogContent>
    </StyledDialog>
  )
}

export default CustomDialog
