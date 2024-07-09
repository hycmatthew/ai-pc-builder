import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'

type ButtonType = {
  label: string
  isSelected?: boolean
  clickedFunc: () => void
}

const StyledButton = styled(Button)({
  width: '100%',
  color: '#a6a6a6',
  borderColor: '#a6a6a6',
})

const CusButton = ({ label, isSelected, clickedFunc }: ButtonType) => {
  const { t } = useTranslation()

  return (
    <StyledButton
      variant="outlined"
      className={isSelected ? 'selected-button' : ''}
      onClick={clickedFunc}
    >
      {t(label)}
    </StyledButton>
  )
}

export default CusButton
