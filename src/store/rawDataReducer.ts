import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AirCoolerType, SSDType } from '../constant/objectTypes'
import AIOType from '../constant/objectTypes/AIOType'
import CaseType from '../constant/objectTypes/CaseType'
import CPUType from '../constant/objectTypes/CPUType'
import GPUType from '../constant/objectTypes/GPUType'
import MotherboardType from '../constant/objectTypes/MotherboardType'
import PSUType from '../constant/objectTypes/PSUType'
import RAMType from '../constant/objectTypes/RAMType'
import { RawDataAPI } from '../utils/HttpHelper'

export interface SelectedItemType {
  cpu: CPUType | null
  motherboard: MotherboardType | null
  gpu: GPUType | null
  ram: RAMType | null
  psu: PSUType | null
  pcCase: CaseType | null
  aio: AIOType | null
  ssd: SSDType | null
  airCooler: AirCoolerType | null
}

export interface DataState {
  selectedItems: SelectedItemType
  cpuList: CPUType[]
  gpuList: GPUType[]
  motherboardList: MotherboardType[]
  ramList: RAMType[]
  psuList: PSUType[]
  caseList: CaseType[]
  aioList: AIOType[]
  ssdList: SSDType[]
  airCoolerList: AirCoolerType[]
  isLoading: boolean
}

const initialState: DataState = {
  selectedItems: {
    cpu: null,
    motherboard: null,
    gpu: null,
    ram: null,
    psu: null,
    pcCase: null,
    aio: null,
    ssd: null,
    airCooler: null
  },
  cpuList: [],
  gpuList: [],
  motherboardList: [],
  ramList: [],
  psuList: [],
  caseList: [],
  aioList: [],
  ssdList: [],
  airCoolerList: [],
  isLoading: false,
}
/*
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
*/

export const getCPUDataList:any = createAsyncThunk(
  'cpuList/fetchData',
  async () => {
    const response = await RawDataAPI.get('/cpuData.json')
    return response
  }
)

export const getGPUDataList:any = createAsyncThunk(
  'gpuList/fetchData',
  async () => {
    const response = await RawDataAPI.get('/gpuData.json')
    return response
  }
)

export const getMotherboardDataList:any = createAsyncThunk(
  'motherboardList/fetchData',
  async () => {
    const response = await RawDataAPI.get('/motherboardData.json')
    return response
  }
)

export const getRAMDataList:any = createAsyncThunk(
  'ramList/fetchData',
  async () => {
    const response = await RawDataAPI.get('/ramData.json')
    return response
  }
)

export const getPSUDataList:any = createAsyncThunk(
  'psuList/fetchData',
  async () => {
    const response = await RawDataAPI.get('/powerData.json')
    return response
  }
)

export const getCaseDataList:any = createAsyncThunk(
  'caseList/fetchData',
  async () => {
    const response = await RawDataAPI.get('/caseData.json')
    return response
  }
)

export const getAIODataList:any = createAsyncThunk(
  'aioList/fetchData',
  async () => {
    const response = await RawDataAPI.get('/coolerData.json')
    return response
  }
)

export const getSSDDataList:any = createAsyncThunk(
  'ssdList/fetchData',
  async () => {
    const response = await RawDataAPI.get('/ssdData.json')
    return response
  }
)

export const getAirCoolerDataList:any = createAsyncThunk(
  'airCoolerList/fetchData',
  async () => {
    const response = await RawDataAPI.get('/coolerData.json')
    return response
  }
)

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    updateSelectedCPU: (state, action) => {
      state.selectedItems.cpu = action.payload
    },
    updateSelectedMotherboard: (state, action) => {
      state.selectedItems.motherboard = action.payload
    },
    updateSelectedGPU: (state, action) => {
      state.selectedItems.gpu = action.payload
    },
    updateSelectedRAM: (state, action) => {
      state.selectedItems.ram = action.payload
    },
    updateSelectedPSU: (state, action) => {
      state.selectedItems.psu = action.payload
    },
    updateSelectedCase: (state, action) => {
      state.selectedItems.pcCase = action.payload
    },
    updateSelectedAIO: (state, action) => {
      state.selectedItems.aio = action.payload
    },
    updateSelectedSSD: (state, action) => {
      state.selectedItems.ssd = action.payload
    },
    updateSelectedAirCooler: (state, action) => {
      state.selectedItems.airCooler = action.payload
    },
    clearSelectedItem: (state) => {
      state.selectedItems = initialState.selectedItems
    },
  },
  extraReducers: (builder) => {
    // GET CPU
    builder.addCase(
      getCPUDataList.fulfilled,
      (state: DataState, { payload }) => {
        state.isLoading = false
        state.cpuList = payload
      }
    )
    builder.addCase(getCPUDataList.pending, (state: DataState, { payload }) => {
      console.log('isLoading')
      state.isLoading = true
    })
    builder.addCase(
      getCPUDataList.rejected,
      (state: DataState, { payload }) => {
        console.log('rejected')
        state.isLoading = false
      }
    )
    // GET GPU
    builder.addCase(
      getGPUDataList.fulfilled,
      (state: DataState, { payload }) => {
        state.isLoading = false
        state.gpuList = payload
      }
    )
    builder.addCase(getGPUDataList.pending, (state: DataState, { payload }) => {
      console.log('isLoading')
      state.isLoading = true
    })
    builder.addCase(
      getGPUDataList.rejected,
      (state: DataState, { payload }) => {
        console.log('rejected')
        state.isLoading = false
      }
    )
    // GET Motherboard
    builder.addCase(
      getMotherboardDataList.fulfilled,
      (state: DataState, { payload }) => {
        state.isLoading = false
        state.motherboardList = payload
      }
    )
    builder.addCase(
      getMotherboardDataList.pending,
      (state: DataState, { payload }) => {
        console.log('isLoading')
        state.isLoading = true
      }
    )
    builder.addCase(
      getMotherboardDataList.rejected,
      (state: DataState, { payload }) => {
        console.log('rejected')
        state.isLoading = false
      }
    )
    // GET RAM
    builder.addCase(
      getRAMDataList.fulfilled,
      (state: DataState, { payload }) => {
        state.isLoading = false
        state.ramList = payload
      }
    )
    builder.addCase(getRAMDataList.pending, (state: DataState, { payload }) => {
      console.log('isLoading')
      state.isLoading = true
    })
    builder.addCase(
      getRAMDataList.rejected,
      (state: DataState, { payload }) => {
        console.log('rejected')
        state.isLoading = false
      }
    )
    // GET PSU
    builder.addCase(
      getPSUDataList.fulfilled,
      (state: DataState, { payload }) => {
        state.isLoading = false
        state.psuList = payload
      }
    )
    builder.addCase(getPSUDataList.pending, (state: DataState, { payload }) => {
      console.log('isLoading')
      state.isLoading = true
    })
    builder.addCase(
      getPSUDataList.rejected,
      (state: DataState, { payload }) => {
        console.log('rejected')
        state.isLoading = false
      }
    )
    // GET PC CASE
    builder.addCase(
      getCaseDataList.fulfilled,
      (state: DataState, { payload }) => {
        state.isLoading = false
        state.caseList = payload
      }
    )
    builder.addCase(getCaseDataList.pending, (state: DataState, { payload }) => {
      console.log('isLoading')
      state.isLoading = true
    })
    builder.addCase(
      getCaseDataList.rejected,
      (state: DataState, { payload }) => {
        console.log('rejected')
        state.isLoading = false
      }
    )
    // GET AIO
    builder.addCase(
      getAIODataList.fulfilled,
      (state: DataState, { payload }) => {
        state.isLoading = false
        state.aioList = payload
      }
    )
    builder.addCase(getAIODataList.pending, (state: DataState, { payload }) => {
      console.log('isLoading')
      state.isLoading = true
    })
    builder.addCase(
      getAIODataList.rejected,
      (state: DataState, { payload }) => {
        console.log('rejected')
        state.isLoading = false
      }
    )
    // GET SSD
    builder.addCase(
      getSSDDataList.fulfilled,
      (state: DataState, { payload }) => {
        state.isLoading = false
        state.ssdList = payload
      }
    )
    builder.addCase(getSSDDataList.pending, (state: DataState, { payload }) => {
      console.log('isLoading')
      state.isLoading = true
    })
    builder.addCase(
      getSSDDataList.rejected,
      (state: DataState, { payload }) => {
        console.log('rejected')
        state.isLoading = false
      }
    )
    // GET Air Cooler
    builder.addCase(
      getAirCoolerDataList.fulfilled,
      (state: DataState, { payload }) => {
        state.isLoading = false
        state.airCoolerList = payload
      }
    )
    builder.addCase(getAirCoolerDataList.pending, (state: DataState, { payload }) => {
      console.log('isLoading')
      state.isLoading = true
    })
    builder.addCase(
      getAirCoolerDataList.rejected,
      (state: DataState, { payload }) => {
        console.log('rejected')
        state.isLoading = false
      }
    )
  },
})

// Action creators are generated for each case reducer function
export const sliceActions = counterSlice.actions

export default counterSlice.reducer
