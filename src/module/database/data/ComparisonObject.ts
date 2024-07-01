export interface ComparisonObject {
  img: string
  name: string
  model: string
  items: ComparisonSubItem[]
}

export interface ComparisonSubItem {
  label: string
  value: string
  isHighlight: boolean
}
