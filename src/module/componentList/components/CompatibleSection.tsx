import React from 'react'
import { useTranslation } from 'react-i18next'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import WarningRoundedIcon from '@mui/icons-material/WarningRounded'
import styled from '@emotion/styled'

import { SelectedItemType } from '../../store/rawDataReducer'
import { getTotalPower } from '../../../utils/NumberHelper'
import {
  motherboardIncompatibleWithCPU,
  ramIncompatibleWithCPU,
  ramIncompatibleWithMotherboard,
  psuPowerNotEnough,
  caseIncompatibleWithGPU,
  caseIncompatibleWithMotherboard,
  caseIncompatibleWithAIO,
} from '../../../logic/incompatibleLogic'
import { gpuMatchcpuSuggestion, ramProfileIsNotMatchCPU, ramSizeSuggestion } from '../../../logic/suggestionLogic'

type CompatibleSectionProps = {
  selectedItems: SelectedItemType
}

const CustomContainer = styled(Container)({
  backgroundColor: '#ffffff',
  padding: '8px',
  borderRadius: '6px',
  marginTop: '16px',
})

const WarningStack = styled(Stack)({
  padding: '12px 0px',
  color: '#f44336',
})

const SuggectStack = styled(Stack)({
  padding: '12px 0px',
  color: '#ff9100',
})

type SuggestionType = {
  name: string
  type: string
}

const CompatibleSection = ({ selectedItems }: CompatibleSectionProps) => {
  const { t } = useTranslation()

  const {
    cpu,
    gpu,
    motherboard,
    ram,
    psu,
    pcCase,
    aio
  } = selectedItems

  const createSuggestion = () => {
    const suggestion: SuggestionType[] = []
    if (motherboardIncompatibleWithCPU(motherboard, cpu)) {
      suggestion.push({
        name: 'warning-motherboard-cpu-incompatible',
        type: 'warning',
      })
    }
    if (ram && ramIncompatibleWithCPU(ram, cpu)) {
      suggestion.push({ name: 'warning-ram-incompatible', type: 'warning' })
    }
    if (ram && ramIncompatibleWithMotherboard(ram, motherboard)) {
      suggestion.push({
        name: 'warning-ram-motherboard-incompatible',
        type: 'warning',
      })
    }
    if (psu && psuPowerNotEnough(psu.watt, getTotalPower(selectedItems))) {
      suggestion.push({ name: 'warning-power-not-enough', type: 'warning' })
    }
    if (pcCase && caseIncompatibleWithGPU(pcCase, gpu)) {
      suggestion.push({
        name: 'warning-gpu-case-incompatible',
        type: 'warning',
      })
    }
    if (pcCase && caseIncompatibleWithMotherboard(pcCase, motherboard)) {
      suggestion.push({
        name: 'warning-motherboard-case-incompatible',
        type: 'warning',
      })
    }
    if (pcCase && caseIncompatibleWithAIO(pcCase, aio)) {
      suggestion.push({
        name: 'warning-air-cooler-case-incompatible',
        type: 'warning',
      })
    }

    // suggestion
    if (ram && ramProfileIsNotMatchCPU(ram, cpu)) {
      suggestion.push({
        name: 'suggestion-ram-profile-not-match',
        type: 'suggestion',
      })
    }
    if ((gpu && cpu) && gpuMatchcpuSuggestion(gpu, cpu)) {
      suggestion.push({
        name: 'suggestion-gpu-cpu-not-match',
        type: 'suggestion',
      })
    }

    if (ram && ramSizeSuggestion(ram)) {
      suggestion.push({
        name: 'suggestion-ram-capacity',
        type: 'suggestion',
      })
    }
    return suggestion
  }

  const suggestions = createSuggestion()

  return (
    <CustomContainer>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          {suggestions.map((item: SuggestionType) => (
            item.type === 'warning' ? (
              <WarningStack
                direction="row"
                alignItems="center"
                spacing={2}
                key={item.name}
              >
                <CancelRoundedIcon />
                <Typography>{t(item.name)}</Typography>
              </WarningStack>
            ) : (
              <SuggectStack
                direction="row"
                alignItems="center"
                spacing={2}
                key={item.name}
              >
                <WarningRoundedIcon />
                <Typography>{t(item.name)}</Typography>
              </SuggectStack>
            )
          ))}
          {suggestions.length === 0 && (
            <SuggectStack
              direction="row"
              alignItems="center"
              spacing={2}
            >
              <WarningRoundedIcon />
              <Typography>{t('no-suggestion')}</Typography>
            </SuggectStack>
          )}
        </Grid>
      </Grid>
    </CustomContainer>
  )
}

export default CompatibleSection
