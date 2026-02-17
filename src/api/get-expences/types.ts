import type { Database } from "../database.types";

export type Expense =
  Database['public']['Tables']['expenses']['Row']
