import { styled } from '@mui/material/styles';
import { DataGrid, GridColDef } from '@mui/x-data-grid'

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  // 移除表头所有边框
  '& .MuiDataGrid-columnHeaders': {
    border: 'none',
    '& .MuiDataGrid-columnHeader, .MuiDataGrid-filler': {
      border: 'none', // 移除单个表头底部边框
      // 其他表头样式
    },
    '& .MuiDataGrid-columnSeparator': {
      display: 'none !important', // 移除列分隔线
    },
    '& .MuiDataGrid-row--borderBottom': {
      backgroundColor: '#eeeee4',
    }
  },
  // 可选：移除单元格边框
  '& .MuiDataGrid-cell': {
    borderBottom: 'none',
  },
  // 移除底部边框
  '& .MuiDataGrid-footerContainer': {
    borderTop: 'none',
  }
}));

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
      <StyledDataGrid
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
