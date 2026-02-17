import type { SupabaseClient } from '@supabase/supabase-js'
import type { QueryClient, QueryOptions } from '@tanstack/react-query'
import type { Expense } from './types'

export function createGetExpenses(deps: {
  apiClient: SupabaseClient
  queryClient: QueryClient
}) {
  function getQo() {
    return {
      queryKey: ['expense'],
      queryFn: async () => {
        const { data, error } = await deps.apiClient.from('expenses').select()

        if (error) {
          throw error
        }

        return data as Expense[]
      },
    } satisfies QueryOptions<Expense[], unknown, Expense[]>
  }

  async function query() {
    return deps.queryClient.ensureQueryData(getQo())
  }

  query.qo = getQo

  return query
}
