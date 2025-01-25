import {
  Backdrop,
  Box,
  Fade,
  IconButton,
  Modal,
  Switch,
  TextField,
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { useNotifications } from '@toolpad/core/useNotifications'
import { getSelectItemListText } from '../../../utils/PCPartUtil'
import { useEffect, useState } from 'react'
import { SelectedItemType } from '../../../store/rawDataReducer'
import { useTranslation } from 'react-i18next'

type NotifyButtonProps = {
  copyVal: string
}

type ListCopyModalProps = {
  selectedItems: SelectedItemType
  open: boolean
  handleClose?: () => void
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
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
      sx={{ background: '#edf7ed' }}
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
  handleClose,
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
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 300,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
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
        </Box>
      </Fade>
    </Modal>
  )
}

export default ListCopyModal
