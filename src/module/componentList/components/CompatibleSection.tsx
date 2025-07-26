import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import WarningRoundedIcon from '@mui/icons-material/WarningRounded'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import styled from '@emotion/styled'
import { Grid } from '@mui/material'

import { SelectedItemType } from '../../../store/rawDataReducer'
import { getTotalPower } from '../../../utils/NumberHelper'
import {
  cpuIncompatibleWithMotherboard,
  motherboardIncompatibleWithRam,
  psuPowerNotEnough,
  gpuIncompatibleWithCase,
  motherboardIncompatibleWithCase,
  aioIncompatibleWithCase,
  airCoolerIncompatibleWithCase,
} from '../../../logic/CompatibleLogic/incompatibleLogic'
import {
  gpuMatchcpuSuggestion,
  motherboardChipsetSuggestion,
  motherboardIncompatibleWithRamSpeed,
  motherboardOverclockSuggestion
} from '../../../logic/CompatibleLogic/suggestionLogic'
import { useMemo } from 'react'
import { psuWithATX3 } from '../../../logic/CompatibleLogic/successLogic'

type CompatibleSectionProps = {
  selectedItems: SelectedItemType
  systemError?: string // 新增可选系统错误参数
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

type SuggestionConfig = {
  condition: boolean
  messageKey: string
  type: 'warning' | 'suggestion' | 'success'
  interpolation?: Record<string, unknown>
}

const CompatibleSection = ({
  selectedItems,
  systemError,
}: CompatibleSectionProps) => {
  const { t } = useTranslation()
  const { cpu, gpu, motherboard, ram, psu, pcCase, cooler } = selectedItems

  // 使用 useMemo 缓存计算结果
  const suggestions = useMemo(() => {
    // 如果存在系统错误，优先返回系统错误信息
    if (systemError) {
      return [
        {
          value: systemError,
          type: 'warning', // 强制使用警告类型
        },
      ]
    }
    // 集中管理校验规则配置
    const validationRules: SuggestionConfig[] = [
      // 警告类规则
      {
        condition: cpuIncompatibleWithMotherboard(cpu, motherboard),
        messageKey: 'warning-motherboard-cpu-incompatible',
        type: 'warning',
      },
      {
        condition:
          Boolean(psu) &&
          psuPowerNotEnough(psu!.wattage, getTotalPower(selectedItems)),
        messageKey: 'warning-power-not-enough',
        type: 'warning',
      },
      {
        condition: gpuIncompatibleWithCase(pcCase, gpu),
        messageKey: 'warning-gpu-case-incompatible',
        type: 'warning',
        interpolation: {
          gpu: gpu?.length,
          case: pcCase?.max_vga_length,
        },
      },
      {
        condition: motherboardIncompatibleWithCase(pcCase, motherboard),
        messageKey: 'warning-motherboard-case-incompatible',
        type: 'warning',
        interpolation: {
          mb: motherboard?.form_factor,
        },
      },
      {
        condition: aioIncompatibleWithCase(cooler, pcCase),
        messageKey: 'warning-aio-cooler-case-incompatible',
        type: 'warning',
      },
      {
        condition: airCoolerIncompatibleWithCase(cooler, pcCase),
        messageKey: 'warning-air-cooler-case-incompatible',
        type: 'warning',
      },
      {
        condition: motherboardIncompatibleWithRam(motherboard, ram),
        messageKey: 'warning-ram-motherboard-incompatible',
        type: 'warning',
        interpolation: {
          ram: ram?.type,
        },
      },

      // 建议类规则
      // Motherboard Overclock Suggestion
      {
        condition: motherboardOverclockSuggestion(cpu, motherboard),
        messageKey: 'suggestion-motherboard-overclock',
        type: 'suggestion',
      },
      {
        condition: motherboardChipsetSuggestion(cpu, motherboard),
        messageKey: 'suggestion-motherboard-type',
        type: 'suggestion',
      },
      {
        condition: motherboardIncompatibleWithRamSpeed(motherboard, ram),
        messageKey: 'suggestion-ram-motherboard-incompatible-speed',
        type: 'suggestion',
        interpolation: {
          ram: ram?.speed,
        },
      },
      {
        condition: gpuMatchcpuSuggestion(gpu, cpu),
        messageKey: 'suggestion-gpu-cpu-not-match',
        type: 'suggestion',
      },
      /*
      {
        condition: ramSizeSuggestion(ram),
        messageKey: 'suggestion-ram-capacity',
        type: 'suggestion',
      },
      */
      // Success规则
      {
        condition: psuWithATX3(psu),
        messageKey: 'success-psu-atx3',
        type: 'success',
      },
    ]

    return validationRules.reduce<SuggestionType[]>((acc, rule) => {
      if (rule.condition) {
        acc.push({
          value: t(rule.messageKey, rule.interpolation),
          type: rule.type,
        })
      }
      return acc
    }, [])
  }, [selectedItems, t, systemError])

  // 统一渲染消息组件
  const renderMessage = (item: SuggestionType) => {
    let IconComponent = CheckCircleIcon
    let StackComponent = GreenStack
    switch (item.type) {
      case 'warning':
        IconComponent = CancelRoundedIcon
        StackComponent = ErrorStack
        break
      case 'suggestion':
        IconComponent = WarningRoundedIcon
        StackComponent = WarningStack
        break
      default:
        IconComponent = CheckCircleIcon
        StackComponent = GreenStack
    }

    return (
      <StackComponent
        direction="row"
        alignItems="flex-start"
        spacing={2}
        key={`${item.type}-${item.value}`}
      >
        <IconComponent fontSize="small" sx={{ mt: '3px' }} />
        <Typography
          variant="body2"
          dangerouslySetInnerHTML={{ __html: item.value }}
          sx={{ lineHeight: 1.4 }}
        />
      </StackComponent>
    )
  }

  return (
    <CustomContainer>
      <Grid container spacing={2}>
        <Grid size={12}>
          {suggestions.map(renderMessage)}

          {!systemError && suggestions.length === 0 && (
            <GreenStack direction="row" alignItems="flex-start" spacing={2}>
              <CheckCircleIcon fontSize="small" sx={{ mt: '3px' }} />
              <Typography variant="body2">{t('no-suggestion')}</Typography>
            </GreenStack>
          )}
        </Grid>
      </Grid>
    </CustomContainer>
  )
}

export default CompatibleSection
