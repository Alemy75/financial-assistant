import type { Database } from '../database.types'

export type CreateCategoryParams = Omit<
  Database['public']['Tables']['expense_categories']['Insert'],
  'id'
>
