import React, { useEffect, useState } from 'react'
import { Box, Card, Grid } from '@mui/material'
import { useAppDispatch } from '../../store/store'
import { sliceActions, BuildLogicState } from '../store/aiLogicReducer'
import { DataState, SelectedItemType } from '../../store/rawDataReducer'
import ResultCard from './ResultCard'
import {
  selectCPULogic,
  selectGPULogic,
  selectMotherboardLogic,
  selectRAMLogic,
  selectSSDLogic,
  selectPSULogic
} from '../../../logic/SelectComponent'

type ResultComponentProps = {
  logicState: BuildLogicState
  rawData: DataState
}

function ResultComponent({ logicState, rawData }: ResultComponentProps) {
  const dispatch = useAppDispatch()
  const [result, setResult] = useState<SelectedItemType>(
    logicState.preSelectedItem
  )

  const getResult = () => {
    let updatedState = logicState
    let updatedItem = logicState.preSelectedItem

    const selectCPU = logicState.preSelectedItem.cpu || selectCPULogic(logicState, rawData.cpuList)
    updatedItem = { ...updatedItem, cpu: selectCPU }
    updatedState = { ...updatedState, preSelectedItem: updatedItem }

    const selectMotherboard = logicState.preSelectedItem.motherboard || selectMotherboardLogic(updatedState, rawData.motherboardList)
    updatedItem = { ...updatedItem, motherboard: selectMotherboard }
    updatedState = { ...updatedState, preSelectedItem: updatedItem }

    const selectRAM = logicState.preSelectedItem.ram || selectRAMLogic(updatedState, rawData.ramList)
    updatedItem = { ...updatedItem, ram: selectRAM }
    updatedState = { ...updatedState, preSelectedItem: updatedItem }

    const selectSSD = logicState.preSelectedItem.ssd || selectSSDLogic(updatedState, rawData.ssdList)
    updatedItem = { ...updatedItem, ssd: selectSSD }
    updatedState = { ...updatedState, preSelectedItem: updatedItem }

    const selectPSU = logicState.preSelectedItem.psu || selectPSULogic(updatedState, rawData.psuList)
    updatedItem = { ...updatedItem, psu: selectPSU }
    updatedState = { ...updatedState, preSelectedItem: updatedItem }

    const selectGPU = logicState.preSelectedItem.gpu || selectGPULogic(updatedState, rawData.gpuList)
    updatedItem = { ...updatedItem, gpu: selectGPU }
    updatedState = { ...updatedState, preSelectedItem: updatedItem }

    setResult({
      ...result,
      cpu: selectCPU,
      motherboard: selectMotherboard,
      ram: selectRAM,
      ssd: selectSSD,
      psu: selectPSU,
      gpu: selectGPU
    })
  }

  useEffect(() => {
    getResult()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box sx={{ paddingTop: 5 }}>
      <Grid container spacing={2} columns={{ xs: 6, md: 12 }}>
        {result.cpu && (
          <ResultCard
            nameLabel={result.cpu.name}
            priceLabel={result.cpu.priceHK.toString()}
            imgSrc={result.cpu.img}
          />
        )}
        {result.motherboard && (
          <ResultCard
            nameLabel={result.motherboard.model}
            priceLabel={result.motherboard.priceHK.toString()}
            imgSrc={result.motherboard.img}
          />
        )}
        {result.gpu && (
          <ResultCard
            nameLabel={result.gpu.model}
            priceLabel={result.gpu.priceHK.toString()}
            imgSrc={result.gpu.img}
          />
        )}
        {result.ram && (
          <ResultCard
            nameLabel={result.ram.model}
            priceLabel={result.ram.priceHK.toString()}
            imgSrc={result.ram.img}
          />
        )}
        {result.ssd && (
          <ResultCard
            nameLabel={result.ssd.model}
            priceLabel={result.ssd.priceHK.toString()}
            imgSrc={result.ssd.img}
          />
        )}
        {result.psu && (
          <ResultCard
            nameLabel={result.psu.model}
            priceLabel={result.psu.priceHK.toString()}
            imgSrc={result.psu.img}
          />
        )}
      </Grid>
    </Box>
  )
}

export default ResultComponent
