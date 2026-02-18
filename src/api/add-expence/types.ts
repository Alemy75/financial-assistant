import type { Database } from '../database.types'

export type CreateExpenceParams = Omit<
  Database['public']['Tables']['expenses']['Insert'],
  'created_at' | 'id'
>
