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
    <Box sx={{ height: 900, width: '100%', background: '#fff' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={100}
        rowsPerPageOptions={[5]}
        experimentalFeatures={{ newEditingApi: true }}
        onColumnHeaderClick={(param) => {
          headerClick(param.field)
        }}
        sortingOrder={['desc', 'asc', null]}
        hideFooter
      />
    </Box>
  )
}

export default BenchmarksDataGrid
