import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {  CaseType, CoolerType, CPUType, FanType, GPUType, MotherboardType, PSUType, RAMType, SSDType } from '../constant/objectTypes'
import { RawDataAPI } from '../utils/HttpHelper'

export interface SelectedItemType {
  cpu: CPUType | null
  motherboard: MotherboardType | null
  gpu: GPUType | null
  ram: RAMType | null
  psu: PSUType | null
  pcCase: CaseType | null
  ssd: SSDType | null
  cooler: CoolerType | null
  // fan: FanType | null
}

export interface DataState {
  selectedItems: SelectedItemType
  cpuList: CPUType[]
  gpuList: GPUType[]
  motherboardList: MotherboardType[]
  ramList: RAMType[]
  psuList: PSUType[]
  caseList: CaseType[]
  coolerList: CoolerType[]
  ssdList: SSDType[]
  fanList: FanType[]
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
    cooler: null,
    ssd: null,
  },
  cpuList: [],
  gpuList: [],
  motherboardList: [],
  ramList: [],
  psuList: [],
  caseList: [],
  coolerList: [],
  ssdList: [],
  fanList: [],
  isLoading: false,
}

export const fetchData = createAsyncThunk(
  'data/fetch',
  async ({ url, type }: { url: string, type: string }) => {
    const response = await RawDataAPI.get(url);
    return { type, data: response };
  }
);

export const fetchCPUData = () => fetchData({ url: 'cpu_data.json', type: 'cpu' });
export const fetchGPUData = () => fetchData({ url: 'gpu_data.json', type: 'gpu' });
export const fetchMotherboardData = () => fetchData({ url: 'motherboard_data.json', type: 'motherboard' });
export const fetchRAMData = () => fetchData({ url: 'ram_data.json', type: 'ram' });
export const fetchPSUData = () => fetchData({ url: 'power_data.json', type: 'psu' });
export const fetchCaseData = () => fetchData({ url: 'pc_case_data.json', type: 'case' });
export const fetchCoolerData = () => fetchData({ url: 'cooler_data.json', type: 'cooler' });
export const fetchSSDData = () => fetchData({ url: 'ssd_data.json', type: 'ssd' });
// 依此类推，为每种硬件类型定义

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
    updateSelectedCooler: (state, action) => {
      state.selectedItems.cooler = action.payload
    },
    updateSelectedSSD: (state, action) => {
      state.selectedItems.ssd = action.payload
    },
    clearSelectedItem: (state) => {
      state.selectedItems = initialState.selectedItems
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchData.fulfilled,
      (state, { payload }) => {
        state.isLoading = false;
        const { type, data } = payload;
        switch (type) {
          case 'cpu':
            state.cpuList = data;
            break;
          case 'gpu':
            state.gpuList = data;
            break;
          case 'motherboard':
            state.motherboardList = data;
            break;
          case 'ram':
            state.ramList = data;
            break;
          case 'psu':
            state.psuList = data;
            break;
          case 'case':
            state.caseList = data;
            break;
          case 'cooler':
            state.coolerList = data;
            break;
          case 'ssd':
            state.ssdList = data;
            break;
          default:
            break;
        }
      }
    )
    builder.addCase(
      fetchData.pending,
      (state) => {
        state.isLoading = true;
      }
    )
    builder.addCase(
      fetchData.rejected,
      (state) => {
        state.isLoading = false;
      }
    )
  },
})

// Action creators are generated for each case reducer function
export const sliceActions = counterSlice.actions

export default counterSlice.reducer
