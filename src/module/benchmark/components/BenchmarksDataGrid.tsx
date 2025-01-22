import React from 'react'
import { Box } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

type BenchmarksDataGridProps = {
  rows: any[]
  columns: GridColDef[]
  headerClick: (fieldName: string) => void
}

function BenchmarksDataGrid({
  rows,
  columns,
  headerClick,
}: BenchmarksDataGridProps) {
  return (
    <div style={{ width: '100%', background: '#fff' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        onColumnHeaderClick={(param) => {
          headerClick(param.field)
        }}
        sortingOrder={['desc', 'asc', null]}
        hideFooter
      />
    </div>
  )
}

export default BenchmarksDataGrid
