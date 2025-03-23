import { Box, IconButton, Switch, TextField } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { useNotifications } from '@toolpad/core/useNotifications'
import { getSelectItemListText } from '../../../utils/PCPartUtil'
import { useEffect, useState } from 'react'
import { SelectedItemType } from '../../../store/rawDataReducer'
import { useTranslation } from 'react-i18next'
import CustomDialog from '../../common/components/CustomDialog'

type NotifyButtonProps = {
  copyVal: string
}

type ListCopyModalProps = {
  selectedItems: SelectedItemType
  open: boolean
  onClose: () => void
}

function NotifyButton({ copyVal }: NotifyButtonProps) {
  const notifications = useNotifications()

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(copyVal)
      .then(() => {
        notifications.show('You are now online', {
          severity: 'success',
          autoHideDuration: 3000,
        })
      })
      .catch((err) => {
        console.log(err.message)
      })
  }

  return (
    <IconButton
      sx={{
        background: '#edf7ed',
        '&:focus': {
          outline: 'none',
          boxShadow: 'none',
        },
      }}
      color="success"
      aria-label="content copy"
      onClick={copyToClipboard}
    >
      <ContentCopyIcon />
    </IconButton>
  )
}

const ListCopyModal = ({
  selectedItems,
  open,
  onClose: handleClose,
}: ListCopyModalProps) => {
  const { t } = useTranslation()
  const [displayPrice, setDisplayPrice] = useState(true)
  const [copyValue, setCopyValue] = useState('')

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
            <Switch
              checked={displayPrice}
              onChange={handleDisplayPriceChange}
              defaultChecked
            />
            {t('display-price')}
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
        />
      </Box>
    </CustomDialog>
  )
}

export default ListCopyModal
