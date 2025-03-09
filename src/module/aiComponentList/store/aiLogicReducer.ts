import { createSlice } from '@reduxjs/toolkit'
import { SelectedItemType } from '../../../store/rawDataReducer'

export interface BuildLogicState {
  step: number
  budget: number
  gamingUsage: number
  normalUsage: number
  preSelectedItem: SelectedItemType
  lockItem: {
    cpu: boolean
    motherboard: boolean
    gpu: boolean
    ram: boolean
    ssd: boolean
    psu: boolean
    pcCase: boolean
    cooler: boolean
  }
}

const initialState: BuildLogicState = {
  step: 0,
  budget: 0,
  gamingUsage: 0,
  normalUsage: 0,
  preSelectedItem: {
    cpu: null,
    motherboard: null,
    gpu: null,
    ram: null,
    ssd: null,
    psu: null,
    pcCase: null,
    cooler: null,
  },
  lockItem: {
    cpu: false,
    motherboard: false,
    gpu: false,
    ram: false,
    ssd: false,
    psu: false,
    pcCase: false,
    cooler: false,
  }
}

export const aiLogicSlice = createSlice({
  name: 'aiLogic',
  initialState,
  reducers: {
    clearAllLogic: (state, action) => {
      /* eslint-disable no-param-reassign */
      state.step = 0
    },
    updateStep: (state, action) => {
      state.step = action.payload
    },
    updateBudget: (state, action) => {
      state.budget = action.payload
    },
    updateBuildUsage: (state, action) => {
      state.gamingUsage = action.payload
    },
    updatePreSelectedCPU: (state, action) => {
      state.preSelectedItem.cpu = action.payload
    },
    updatePreSelectedMotherboard: (state, action) => {
      state.preSelectedItem.motherboard = action.payload
    },
    updatePreSelectedGPU: (state, action) => {
      state.preSelectedItem.gpu = action.payload
    },
    updatePreSelectedRAM: (state, action) => {
      state.preSelectedItem.ram = action.payload
    },
    updatePreSelectedSSD: (state, action) => {
      state.preSelectedItem.ssd = action.payload
    },
    updatePreSelectedPSU: (state, action) => {
      state.preSelectedItem.psu = action.payload
    },
    updatePreSelectedCooler: (state, action) => {
      state.preSelectedItem.cooler = action.payload
    },
    updatePreSelectedCase: (state, action) => {
      state.preSelectedItem.pcCase = action.payload
    },
    updateCPULock: (state, action) => {
      state.lockItem.cpu = action.payload
    },
    updateMotherboardLock: (state, action) => {
      state.lockItem.motherboard = action.payload
    },
    updateGPULock: (state, action) => {
      state.lockItem.gpu = action.payload
    },
    updateRAMLock: (state, action) => {
      state.lockItem.ram = action.payload
    },
    updateSSDLock: (state, action) => {
      state.lockItem.ssd = action.payload
    },
    updatePSULock: (state, action) => {
      state.lockItem.psu = action.payload
    },
    updateCaseLock: (state, action) => {
      state.lockItem.pcCase = action.payload
    },
    updateCoolerLock: (state, action) => {
      state.lockItem.cooler = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const sliceActions = aiLogicSlice.actions

export default aiLogicSlice.reducer
