import type { Database } from "../database.types";

export type ExpenseCategory =
  Database['public']['Tables']['expense_categories']['Row']
