export const QUERY_PARAM = {
  restaurandId: 'r',
  tableId: 't',
} as const

export type QueryParam = keyof typeof QUERY_PARAM
