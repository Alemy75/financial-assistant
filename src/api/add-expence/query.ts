import type { SupabaseClient } from '@supabase/supabase-js'
import type { MutationOptions, QueryClient } from '@tanstack/react-query'
import type { CreateExpenceParams } from './types'
import type { Expense } from '../get-expences/types'

export function createAddExpenses(deps: {
  apiClient: SupabaseClient
  queryClient: QueryClient
}) {
  function getMo() {
    return {
      mutationKey: ['create_expence'],
      mutationFn: async (params: CreateExpenceParams) => {
        const { data, error } = await deps.apiClient
          .from('expenses')
          .insert(params)
          .select()

        if (error) {
          throw error
        }

        return data[0] as Expense
      },
    } satisfies MutationOptions<Expense, unknown, CreateExpenceParams>
  }

  async function mutate(params: CreateExpenceParams) {
    return deps.queryClient
      .getMutationCache()
      .build<
        Expense,
        unknown,
        CreateExpenceParams,
        unknown
      >(deps.queryClient, getMo())
      .execute(params)
  }

  mutate.mo = getMo

  return mutate
}
