export interface ComparisonObject {
  id: string
  img: string
  name: string
  items: ComparisonSubItem[]
}

export interface ComparisonSubItem {
  label: string
  value: string
  isHighlight: boolean
}
