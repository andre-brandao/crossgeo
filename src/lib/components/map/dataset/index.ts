// dataset.ts
export type Operator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'lt'
  | 'gte'
  | 'lte'
  | 'contains'
  | 'and'
  | 'or'

export interface SimpleQuery {
  field: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
  operator: Operator | string
}

export interface ComplexQuery {
  operator: 'and' | 'or'
  queries: Query[]
}

// export type Query = SimpleQuery | ComplexQuery
export type Query = SimpleQuery 

export type Dataset = Array<Record<string, unknown>>

function evaluateSimpleQuery(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: Record<string, any>,
  query: SimpleQuery,
): boolean {
  switch (query.operator) {
    case 'eq':
      return item[query.field] === query.value
    case 'neq':
      return item[query.field] !== query.value
    case 'gt':
      return item[query.field] > query.value
    case 'lt':
      return item[query.field] < query.value
    case 'gte':
      return item[query.field] >= query.value
    case 'lte':
      return item[query.field] <= query.value
    case 'contains':
      return (
        typeof item[query.field] === 'string' &&
        item[query.field].includes(query.value)
      )
    default:
      return false
  }
}

export function applyFilters(dataset: Dataset, query: Query): Dataset {
  switch (true) {
    case 'field' in query:
      return dataset.filter(item =>
        evaluateSimpleQuery(item, query as SimpleQuery),
      )
    case query.operator === 'and':
      return dataset.filter(item =>
        (query as ComplexQuery).queries.every(
          q => applyFilters([item], q).length > 0,
        ),
      )
    case query.operator === 'or':
      return dataset.filter(item =>
        (query as ComplexQuery).queries.some(
          q => applyFilters([item], q).length > 0,
        ),
      )
    default:
      return dataset
  }
}
