export const containStrUtil = (s: string, sub: string) => {
  return s.toUpperCase().includes(sub.toUpperCase())
}

export function getMapValue<T>(
  map: Record<string, T>,
  key: string,
  defaultKey: string = '_default'
): T {
  // 将键转换为小写并去除空格
  const normalizedKey = key.toLowerCase().trim()

  // 检查是否存在精确匹配
  if (map[normalizedKey] !== undefined) {
    return map[normalizedKey]
  }

  // 返回默认值
  return map[defaultKey]
}
