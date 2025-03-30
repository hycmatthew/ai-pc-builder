import DataGrid, { ColumnType } from '../../common/components/DataGrid';

type BenchmarksDataGridProps = {
  rows: any[]
  columns: ColumnType[]
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
          headerClick(param)
        }}
        // onSort={(field, direction) => console.log('Sort:', field, direction)}
      />
    </div>
  )
}

export default BenchmarksDataGrid
