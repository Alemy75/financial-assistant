import type { SupabaseClient } from '@supabase/supabase-js'
import type { MutationOptions, QueryClient } from '@tanstack/react-query'
import type { CreateCategoryParams } from './types'
import type { ExpenseCategory } from '../get-expence-categories/types'

export function createAddCategory(deps: {
  apiClient: SupabaseClient
  queryClient: QueryClient
}) {
  function getMo() {
    return {
      mutationKey: ['create_category'],
      mutationFn: async (params: CreateCategoryParams) => {
        const { data, error } = await deps.apiClient
          .from('expense_categories')
          .insert(params)
          .select()

        if (error) {
          throw error
        }

        return data[0] as ExpenseCategory
      },
    } satisfies MutationOptions<
      ExpenseCategory,
      unknown,
      CreateCategoryParams
    >
  }

  async function mutate(params: CreateCategoryParams) {
    return deps.queryClient
      .getMutationCache()
      .build<
        ExpenseCategory,
        unknown,
        CreateCategoryParams,
        unknown
      >(deps.queryClient, getMo())
      .execute(params)
  }

  mutate.mo = getMo

  return mutate
}
