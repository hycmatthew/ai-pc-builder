import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import WarningRoundedIcon from '@mui/icons-material/WarningRounded'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import styled from '@emotion/styled'
import { Grid2 as Grid } from '@mui/material'

import { SelectedItemType } from '../../../store/rawDataReducer'
import { getTotalPower } from '../../../utils/NumberHelper'
import {
  cpuIncompatibleWithMotherboard,
  motherboardIncompatibleWithRam,
  psuPowerNotEnough,
  gpuIncompatibleWithCase,
  motherboardIncompatibleWithCase,
  caseIncompatibleWithAIO,
} from '../../../logic/CompatibleLogic/incompatibleLogic'
import {
  gpuMatchcpuSuggestion,
  ramProfileIsNotMatchCPU,
  ramSizeSuggestion,
} from '../../../logic/CompatibleLogic/suggestionLogic'

type CompatibleSectionProps = {
  selectedItems: SelectedItemType
}

const CustomContainer = styled(Container)({
  backgroundColor: '#ffffff',
  padding: '8px',
})

const ErrorStack = styled(Stack)({
  padding: '12px 0px',
  color: '#f44336',
})

const WarningStack = styled(Stack)({
  padding: '12px 0px',
  color: '#ff9100',
})

const GreenStack = styled(Stack)({
  padding: '12px 0px',
  color: '#04aa6d',
})

type SuggestionType = {
  value: string
  type: string
}

const CompatibleSection = ({ selectedItems }: CompatibleSectionProps) => {
  const { t } = useTranslation()

  const { cpu, gpu, motherboard, ram, psu, pcCase, cooler } = selectedItems

  const createSuggestion = () => {
    const suggestion: SuggestionType[] = []
    if (cpuIncompatibleWithMotherboard(cpu, motherboard)) {
      suggestion.push({
        value: t('warning-motherboard-cpu-incompatible'),
        type: 'warning',
      })
    }
    if (psu && psuPowerNotEnough(psu.Wattage, getTotalPower(selectedItems))) {
      suggestion.push({ value: t('warning-power-not-enough'), type: 'warning' })
    }
    if (pcCase && gpuIncompatibleWithCase(pcCase, gpu)) {
      suggestion.push({
        value: t('warning-gpu-case-incompatible', { gpu: gpu?.Length , case: pcCase.MaxVGAlength }),
        type: 'warning',
      })
    }
    if (pcCase && motherboardIncompatibleWithCase(pcCase, motherboard)) {
      suggestion.push({
        value: t('warning-motherboard-case-incompatible', { mb: motherboard?.FormFactor }),
        type: 'warning',
      })
    }
    if (pcCase && caseIncompatibleWithAIO(pcCase, cooler)) {
      suggestion.push({
        value: t('warning-air-cooler-case-incompatible'),
        type: 'warning',
      })
    }

    // suggestion
    if (ram && motherboardIncompatibleWithRam(motherboard, ram)) {
      suggestion.push({
        value: t('suggestion-ram-motherboard-incompatible', { ram: ram?.Speed }),
        type: 'suggestion',
      })
    }
    if (ram && ramProfileIsNotMatchCPU(ram, cpu)) {
      suggestion.push({
        value: t('suggestion-ram-profile-not-match'),
        type: 'suggestion',
      })
    }
    if (gpu && cpu && gpuMatchcpuSuggestion(gpu, cpu)) {
      suggestion.push({
        value: t('suggestion-gpu-cpu-not-match'),
        type: 'suggestion',
      })
    }

    if (ram && ramSizeSuggestion(ram)) {
      suggestion.push({
        value: t('suggestion-ram-capacity'),
        type: 'suggestion',
      })
    }
    return suggestion
  }

  const suggestions = createSuggestion()

  return (
    <CustomContainer>
      <Grid container spacing={2}>
        <Grid size={12}>
          {suggestions.map((item: SuggestionType) =>
            item.type === 'warning' ? (
              <ErrorStack
                direction="row"
                alignItems="center"
                spacing={2}
                key={item.value}
              >
                <CancelRoundedIcon style={{ alignSelf: "flex-start" }} />
                <Typography variant="body2" dangerouslySetInnerHTML={{ __html: item.value }}></Typography>
              </ErrorStack>
            ) : (
              <WarningStack
                direction="row"
                alignItems="center"
                spacing={2}
                key={item.value}
              >
                <WarningRoundedIcon style={{ alignSelf: "flex-start" }} />
                <Typography variant="body2" dangerouslySetInnerHTML={{ __html: item.value }}></Typography>
              </WarningStack>
            )
          )}
          {suggestions.length === 0 && (
            <GreenStack direction="row" alignItems="center" spacing={2}>
              <CheckCircleIcon style={{ alignSelf: "flex-start" }} />
              <Typography variant="body2">{t('no-suggestion')}</Typography>
            </GreenStack>
          )}
        </Grid>
      </Grid>
    </CustomContainer>
  )
}

export default CompatibleSection
