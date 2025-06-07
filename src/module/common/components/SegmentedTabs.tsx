import { Tabs, Tab, TabsProps, TabProps, styled } from '@mui/material'
import { ReactNode } from 'react'

// 類型定義
type SegmentedTabValue = string | number

type SegmentedTabOption = {
  label: ReactNode
  value: SegmentedTabValue
}

type SegmentedTabsProps = TabsProps & {
  value: SegmentedTabValue
  onChange: (event: React.SyntheticEvent, newValue: SegmentedTabValue) => void
  tabs: SegmentedTabOption[]
}

// 樣式組件
const CustomTabs = styled(Tabs)({
  '& .MuiTabs-indicator': {
    display: 'none',
  },
  '& .MuiTabs-flexContainer': {
    gap: '4px',
    position: 'relative',
  },
})

const IosSegmentedTab = styled(Tab)<TabProps>(() => ({
  zIndex: 1,
  minHeight: '32px',
  minWidth: '120px',
  borderRadius: '8px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  fontSize: '14px',
  fontWeight: 500,
  textTransform: 'none',
  color: '#3c3c43',
  border: 'none',

  '&:not(.Mui-selected)': {
    '&:hover': {
      backgroundColor: '#F7FAFC',
    },
  },

  '&.Mui-selected': {
    color: '#000',
    backgroundColor: '#F7FAFC',
    '&:hover': {
      backgroundColor: '#E8EDF5',
    },
  },
  '&:focus': {
    outline: 'none',
    boxShadow: 'none',
  },

  '&.Mui-focusVisible': {
    outline: 'none',
  },
}))

const SegmentedTabs = ({
  value,
  onChange,
  tabs,
  ...props
}: SegmentedTabsProps) => {
  return (
    <CustomTabs
      value={value}
      onChange={onChange}
      aria-label="segmented tabs"
      {...props}
    >
      {tabs.map((tab) => (
        <IosSegmentedTab key={tab.value} label={tab.label} value={tab.value} />
      ))}
    </CustomTabs>
  )
}

export default SegmentedTabs
