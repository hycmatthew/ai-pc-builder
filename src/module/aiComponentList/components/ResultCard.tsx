import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid2 as Grid,
  Box,
} from '@mui/material'
import {
  CPUType,
  GPUType,
  MotherboardType,
  RAMType,
  SSDType,
  CaseType,
  PSUType,
  CoolerType,
} from '../../../constant/objectTypes'
import CusTypography from '../../common/components/CusTypography'

// 硬件数据类型定义
interface ComponentDisplayProps {
  components: {
    cpu?: CPUType
    gpu?: GPUType
    motherboard?: MotherboardType
    ram?: RAMType
    ssd?: SSDType
    pcCase?: CaseType
    psu?: PSUType
    cooler?: CoolerType
  }
}

// 硬件属性映射配置
const componentConfig = {
  cpu: {
    title: 'cpu',
    properties: [
      { label: 'brand', key: 'Brand' },
      //{ label: 'name', key: 'Name' },
      //{ label: 'image', key: 'Img' },
      { label: 'socket', key: 'Socket' },
      { label: 'Cores', key: 'Cores' },
      { label: 'Threads', key: 'Threads' },
      { label: 'GPU', key: 'GPU' },
      { label: 'SingleCoreScore', key: 'SingleCoreScore' },
      { label: 'multiCoreScore', key: 'MultiCoreScore' },
      { label: 'power', key: 'Power' },
    ],
  },
  gpu: {
    title: 'gpu',
    properties: [
      { label: 'brand', key: 'Brand' },
      //{ label: 'name', key: 'Name' },
      //{ label: 'image', key: 'Img' },
      { label: 'socket', key: 'Manufacturer' },
      { label: 'Cores', key: 'Generation' },
      { label: 'Threads', key: 'MemorySize' },
      { label: 'GPU', key: 'OcClock' },
      { label: 'SingleCoreScore', key: 'Benchmark' },
      { label: 'multiCoreScore', key: 'Power' },
      { label: 'power', key: 'Length' },
    ],
  },
  motherboard: {
    title: 'motherboard',
    properties: [
      { label: 'brand', key: 'Brand' },
      //{ label: 'name', key: 'Name' },
      //{ label: 'image', key: 'Img' },
      { label: 'socket', key: 'Socket' },
      { label: 'Chipset', key: 'Chipset' },
      { label: 'RamSlot', key: 'RamSlot' },
      { label: 'RamSupport', key: 'RamSupport' },
      { label: 'M2Slot', key: 'M2Slot' },
      { label: 'FormFactor', key: 'FormFactor' },
      { label: 'Wireless', key: 'Wireless' },
    ],
  },
  ram: {
    title: 'ram',
    properties: [
      { label: 'brand', key: 'Brand' },
      //{ label: 'name', key: 'Name' },
      //{ label: 'image', key: 'Img' },
      { label: 'Capacity', key: 'Capacity' },
      { label: 'Type', key: 'Type' },
      { label: 'Speed', key: 'Speed' },
      { label: 'Latency', key: 'Latency' },
      { label: 'Timing', key: 'Timing' },
      { label: 'Channel', key: 'Channel' },
      { label: 'Profile', key: 'Profile' },
    ],
  },
  ssd: {
    title: 'ssd',
    properties: [
      { label: 'brand', key: 'Brand' },
      //{ label: 'name', key: 'Name' },
      //{ label: 'image', key: 'Img' },
      { label: 'Capacity', key: 'Capacity' },
      { label: 'MaxRead', key: 'MaxRead' },
      { label: 'MaxWrite', key: 'MaxWrite' },
      { label: 'Interface', key: 'Interface' },
      { label: 'FormFactor', key: 'FormFactor' },
    ],
  },
  psu: {
    title: 'power-supply',
    properties: [
      { label: 'brand', key: 'Brand' },
      //{ label: 'name', key: 'Name' },
      //{ label: 'image', key: 'Img' },
      { label: 'Wattage', key: 'Wattage' },
      { label: 'Standard', key: 'Standard' },
      { label: 'Modular', key: 'Modular' },
      { label: 'Efficiency', key: 'Efficiency' },
    ],
  },
  pcCase: {
    title: 'pc-case',
    properties: [
      { label: 'brand', key: 'Brand' },
      //{ label: 'name', key: 'Name' },
      //{ label: 'image', key: 'Img' },
      { label: 'CaseSize', key: 'CaseSize' },
      { label: 'Dimensions', key: 'Dimensions' },
      { label: 'MaxVGAlength', key: 'MaxVGAlength' },
      { label: 'RadiatorSupport', key: 'RadiatorSupport' },
    ],
  },
  cooler: {
    title: 'cooler',
    properties: [
      { label: 'brand', key: 'Brand' },
      //{ label: 'name', key: 'Name' },
      //{ label: 'image', key: 'Img' },
      { label: 'Sockets', key: 'Sockets' },
      { label: 'IsLiquidCooler', key: 'IsLiquidCooler' },
      { label: 'AirCoolerHeight', key: 'AirCoolerHeight' },
      { label: 'NoiseLevel', key: 'NoiseLevel' },
      { label: 'FanSpeed', key: 'FanSpeed' },
      { label: 'Airflow', key: 'Airflow' },
      // { label: 'Pressure', key: 'Pressure' },
    ],
  },
}

const ResultCard: React.FC<{
  type: keyof typeof componentConfig
  price: string
  data?: any
}> = ({ type, data }) => {
  const config = componentConfig[type]

  if (!data) return null

  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        title={config.title}
        subheader={data.Name}
        sx={{
          // 标题样式
          '& .MuiCardHeader-title': {
            fontSize: '1.25rem', // 自定义字体大小
            fontWeight: 600, // 字重
          },
          // 副标题样式
          '& .MuiCardHeader-subheader': {
            fontSize: '0.875rem',
          },
        }}
      />
      <Box
        component="img"
        sx={{
          width: '100%',
          height: 200, // 统一高度
          objectFit: 'cover', // 关键属性：保持比例填充容器
          objectPosition: 'center', // 聚焦图片中心区域
          display: 'block', // 消除图片底部间隙
          backgroundColor: 'grey.100', // 加载前的背景色
        }}
        alt="The house from the offer."
        src={data.Img}
      />
      <CardContent>
        <Grid container spacing={2}>
          {config.properties.map((prop) => (
            <Grid>
              <CusTypography variant="h6" color="text.secondary">
                {prop.label}
              </CusTypography>
              <CusTypography variant="caption">{data[prop.key]}</CusTypography>
            </Grid>
          ))}
          <Grid>
            <CusTypography variant="h6" color="primary"></CusTypography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ResultCard
