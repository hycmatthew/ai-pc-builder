import React from 'react'
import { useTranslation } from 'react-i18next'

import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import ReactCountryFlag from 'react-country-flag'
import langOptions from '../../../constant/supportedLang'

const LanguageButtons = () => {
  const { t, i18n } = useTranslation()

  const changeLanguageHandler = (lang: string) => (_event: React.MouseEvent<HTMLButtonElement>) => {
    i18n.changeLanguage(lang)
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Stack direction="column" justifyContent="flex-end">
        {langOptions.map((option) => (
          <Button
            key={option.lang}
            onClick={changeLanguageHandler(option.lang)}
            sx={{
              my: 0.5,
              color: 'black',
              display: 'block',
              textAlign: 'left',
              textTransform: 'none',
            }}
          >
            <ReactCountryFlag
              countryCode={option.code}
              style={{
                fontSize: '1.5em',
                marginRight: '4px',
                borderRadius: '6px',
              }}
              svg
            />
            {t(option.label)}
          </Button>
        ))}
      </Stack>
    </Box>
  )
}

export default LanguageButtons
