import { createClient } from '@supabase/supabase-js'
import { QueryClient } from '@tanstack/react-query'
import { createGetExpenseCategories, createGetExpenses } from '../api'

export type Di = ReturnType<typeof createDi>

export function createDi() {
  const apiClient = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY
  )

  const queryClient = new QueryClient()

  const getExpenseCategories = createGetExpenseCategories({
    apiClient,
    queryClient,
  })

  const getExpenses = createGetExpenses({
    apiClient,
    queryClient,
  })

  return {
    apiClient,
    queryClient,
    getExpenseCategories,
    getExpenses,
  }
}
