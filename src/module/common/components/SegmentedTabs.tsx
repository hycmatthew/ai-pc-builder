import { Tabs, Tab, TabsProps, TabProps, styled } from '@mui/material'
import { ReactNode } from 'react'

// 類型定義
type SegmentedTabValue = string | number

type SegmentedTabOption = {
  label: ReactNode
  value: SegmentedTabValue | null
}

type SegmentedTabsProps = TabsProps & {
  value: SegmentedTabValue | null
  onChange: (event: React.SyntheticEvent, newValue: SegmentedTabValue) => void
  tabs: SegmentedTabOption[]
}

// 樣式組件
const CustomTabs = styled(Tabs)({
  minHeight: '32px',
  width: 'fit-content',
  padding: 8,
  backgroundColor: '#F7FAFC',
  borderRadius: '10px',
  '& .MuiTabs-indicator': {
    display: 'none',
  },
  '& .MuiTabs-flexContainer': {
    gap: '4px',
    position: 'relative',
  },
})

const CustomSegmentedTab = styled(Tab)<TabProps>(() => ({
  zIndex: 1,
  minHeight: '32px',
  minWidth: '120px',
  borderRadius: '10px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  fontSize: '14px',
  fontWeight: 500,
  textTransform: 'none',
  color: '#3c3c43',
  border: 'none',

  '&:not(.Mui-selected)': {
    '&:hover': {
      backgroundColor: '#E8EDF5',
    },
  },

  '&.Mui-selected': {
    color: '#fff',
    backgroundColor: '#0F1563',
    '&:hover': {
      backgroundColor: '#383D7E',
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
      value={value ?? false}
      onChange={onChange}
      aria-label="segmented tabs"
      {...props}
      
    >
      {tabs.map((tab) => (
        <CustomSegmentedTab
          key={tab.value}
          label={tab.label}
          value={tab.value}
        />
      ))}
    </CustomTabs>
  )
}

export default SegmentedTabs
