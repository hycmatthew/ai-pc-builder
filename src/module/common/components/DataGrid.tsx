import { styled } from '@mui/material/styles'
import React, { useState, useMemo, CSSProperties } from 'react'
import SwapVerticalCircleIcon from '@mui/icons-material/SwapVerticalCircle'
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown'
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import Box from '@mui/material/Box'
import CusTypography from './CusTypography'

// 类型定义
type SortDirection = 'asc' | 'desc' | null

export type ColumnType<T = any> = {
  field: keyof T
  headerName: string
  width?: number
  sortable?: boolean
  renderCell?: (params: {
    row: T
    value: T[keyof T]
    field: string
  }) => React.ReactNode
}

type DataGridProps<T> = {
  rows: T[]
  columns: ColumnType<T>[]
  pageSize?: number
  style?: CSSProperties
  className?: string
  onSort?: (field: keyof T, direction: SortDirection) => void
  onRowClick?: (rowData: T) => void
  onColumnHeaderClick?: (field: keyof T) => void // 新增点击事件
}

// 样式化排序图标组件
const SortIconContainer = styled('div')<{ active: boolean }>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginLeft: 2,
  transition: theme.transitions.create(['transform'], {
    duration: theme.transitions.duration.short,
  }),
}))

const RotatingIcon = styled('div')<{ direction: SortDirection }>(
  ({ theme, direction }) => ({
    display: 'inline-flex',
    transform: direction === 'asc' ? 'rotate(180deg)' : 'none',
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    color: direction ? theme.palette.primary.main : 'inherit',
  })
)

// 样式化组件优化
const GridContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '60vh', // 必须设置有效高度
  overflow: 'hidden',
})

const HeaderRow = styled('div')({
  display: 'flex',
  background: '#f5f5f5',
  borderBottom: '1px solid #ddd',
  padding: '8px 0',
  flexShrink: 0,
})

const BodyContainer = styled('div')({
  flex: 1,
  overflow: 'hidden',
})

const RowWrapper = styled('div')({
  display: 'flex',
  borderBottom: '1px solid #eee',
  '&:hover': {
    backgroundColor: '#fafafa',
  },
})

const Cell = styled('div')<{ width?: number }>(({ width }) => ({
  padding: '8px 16px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  width: width || 150,
  flexShrink: 0,
}))

// 核心组件
function DataGrid<T extends { id: string | number }>({
  rows,
  columns,
  style,
  className,
  onSort,
  onRowClick,
  onColumnHeaderClick,
}: DataGridProps<T>) {
  // 状态管理
  const [sortField, setSortField] = useState<keyof T | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  // 处理排序
  const sortedRows = useMemo(() => {
    if (!sortField || !sortDirection) return rows

    return [...rows].sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
      }

      return (
        String(aValue).localeCompare(String(bValue)) *
        (sortDirection === 'asc' ? 1 : -1)
      )
    })
  }, [rows, sortField, sortDirection])

  // 處理表頭點擊
  const handleHeaderClick = (field: keyof T) => {
    console.log(field)
    onColumnHeaderClick?.(field)
  }

  const handleSorting = (field: keyof T) => {
    const col = columns.find((c) => c.field === field)
    const isSortable = col?.sortable ?? true

    if (!isSortable) return
    const newDirection: SortDirection =
      sortField !== field ? 'asc' : sortDirection === 'asc' ? 'desc' : null

    setSortField(newDirection ? field : null)
    setSortDirection(newDirection)
    onSort?.(field, newDirection)
  }

  // 渲染排序圖標
  const renderSortIcon = (sortable: boolean | undefined, field: keyof T) => {
    const isSortable = sortable ?? true
    const isActive = sortField === field && isSortable
    const direction = isActive ? sortDirection : null

    if (!isSortable) return null

    return (
      <SortIconContainer
        onClick={() => handleSorting(field)}
        active={!!direction}
      >
        {direction ? (
          <RotatingIcon direction={direction}>
            <ExpandCircleDownIcon fontSize="small" />
          </RotatingIcon>
        ) : (
          <SwapVerticalCircleIcon fontSize="small" sx={{ opacity: 0.25 }} />
        )}
      </SortIconContainer>
    )
  }

  // 创建行渲染器
  const Row = ({
    index,
    style: rowStyle,
  }: {
    index: number
    style: CSSProperties
  }) => {
    const row = sortedRows[index]
    return (
      <RowWrapper style={rowStyle} onClick={() => onRowClick?.(row)} role="row">
        {columns.map((col) => {
          const value = row[col.field]
          const params = { row, value, field: col.field }

          return (
            <Cell key={String(col.field)} width={col.width} role="gridcell">
              {col.renderCell ? (
                col.renderCell({ ...params, field: String(col.field) })
              ) : (
                <CusTypography variant="h6">{String(value)}</CusTypography>
              )}
            </Cell>
          )
        })}
      </RowWrapper>
    )
  }

  return (
    <GridContainer
      className={`data-grid ${className}`}
      style={style}
      role="grid"
    >
      {/* 表头 */}
      <HeaderRow role="rowgroup">
        {columns.map((col) => (
          <Cell
            key={String(col.field)}
            width={col.width}
            role="columnheader"
            onClick={() => handleHeaderClick(col.field)}
            style={{
              cursor: col.sortable ? 'pointer' : 'default',
              userSelect: 'none',
            }}
          >
            <Box display="flex" alignItems="center">
              {col.headerName}
              {renderSortIcon(col.sortable, col.field)}
            </Box>
          </Cell>
        ))}
      </HeaderRow>

      {/* 虚拟化表格内容 */}
      <BodyContainer>
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              width={width}
              itemCount={sortedRows.length}
              itemSize={48} // 根据实际行高调整
              overscanCount={5}
            >
              {Row}
            </List>
          )}
        </AutoSizer>
      </BodyContainer>
    </GridContainer>
  )
}

// 配套样式优化（使用CSS-in-JS）
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,

  '& .header-cell': {
    fontWeight: theme.typography.fontWeightMedium,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))

export default StyledDataGrid
