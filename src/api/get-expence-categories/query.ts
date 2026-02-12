import type { SupabaseClient } from '@supabase/supabase-js'
import type { QueryClient, QueryOptions } from '@tanstack/react-query'
import type { ExpenseCategory } from './types'

export function createGetExpenseCategories(deps: {
  apiClient: SupabaseClient
  queryClient: QueryClient
}) {
  function getQo() {
    return {
      queryKey: ['expense-categories'],
      queryFn: async () => {
        const { data, error } = await deps.apiClient
          .from('expense_categories')
          .select()

        if (error) {
          throw error
        }

        return data as ExpenseCategory[]
      },
    } satisfies QueryOptions<ExpenseCategory[], unknown, ExpenseCategory[]>
  }

  async function query() {
    return deps.queryClient.ensureQueryData(getQo())
  }

  query.qo = getQo

  return query
}
