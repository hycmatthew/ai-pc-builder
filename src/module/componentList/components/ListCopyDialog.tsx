import { Box, InputAdornment, TextField } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { getSelectItemListText } from '../../../utils/PCPartUtil'
import { useEffect, useState } from 'react'
import { SelectedItemType } from '../../../store/rawDataReducer'
import { useTranslation } from 'react-i18next'
import CustomDialog from '../../common/components/CustomDialog'
import CustomIconButton from '../../common/components/CustomIconButton'
import CustomSnackbar from '../../common/components/CustomSnackbar'
import SegmentedTabs from '../../common/components/SegmentedTabs'

type NotifyButtonProps = {
  copyVal: string
}

type ListCopyModalProps = {
  selectedItems: SelectedItemType
  open: boolean
  onClose: () => void
}

function NotifyButton({ copyVal }: NotifyButtonProps) {
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(copyVal)
      .then(() => {
        setSnackbarOpen(true)
      })
      .catch((err) => {
        console.log(err.message)
      })
  }

  const handleClose = () => setSnackbarOpen(false)

  return (
    <>
      <CustomIconButton
        sx={{
          height: '50px',
          padding: '0 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 0, // 移除圓角
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: 'transparent',
          },
        }}
        aria-label="content copy"
        onClick={copyToClipboard}
      >
        <ContentCopyIcon
          sx={{
            '&:hover': {
              color: '#0F1563',
            },
          }}
        />
      </CustomIconButton>
      <CustomSnackbar
        open={snackbarOpen}
        onClose={handleClose}
        message="操作成功完成！"
        severity="success"
      />
    </>
  )
}

const ListCopyDialog = ({
  selectedItems,
  open,
  onClose: handleClose,
}: ListCopyModalProps) => {
  const { t } = useTranslation()
  const [displayPrice, setDisplayPrice] = useState(true)
  const [copyValue, setCopyValue] = useState('')

  const tabs = [
    { label: t('display-price'), value: true },
    { label: t('no-display-price'), value: false },
  ]

  useEffect(() => {
    if (open) {
      setCopyValue(getSelectItemListText(selectedItems, displayPrice))
    }
  }, [open, displayPrice])

  const handleTextFieldValueChange = (event: any) => {
    setCopyValue(event.target.value)
  }

  const handleDisplayPriceChange = () => {
    setDisplayPrice(!displayPrice)
  }

  return (
    <CustomDialog
      open={open}
      onClose={handleClose}
      title={t('pc-part-list')} // 添加标题
      size="large"
    >
      <Box sx={{ maxWidth: '100%' }}>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between' }}
          paddingBottom={1}
        >
          <Box>
            <SegmentedTabs
              value={displayPrice}
              onChange={handleDisplayPriceChange}
              tabs={tabs}
              centered
            />
          </Box>
          <NotifyButton copyVal={copyValue} />
        </Box>
        <TextField
          id="outlined-multiline-static"
          label={t('pc-part-list')}
          disabled
          multiline
          rows={10}
          sx={{ width: '100%' }}
          value={getSelectItemListText(selectedItems, displayPrice)}
          defaultValue={getSelectItemListText(selectedItems, displayPrice)}
          onChange={handleTextFieldValueChange}
          variant="filled"
          slotProps={{
            input: {
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <NotifyButton copyVal={copyValue} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>
    </CustomDialog>
  )
}

export default ListCopyDialog
