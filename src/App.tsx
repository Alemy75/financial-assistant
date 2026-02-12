/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { createDi } from './lib/di'
import { type Database } from '../database.types'

export default function App() {
  const di = createDi()
  const [expenseCategories, setExpenseCategories] = useState<
    Database['public']['Tables']['expense_categories']['Row'][]
  >([])

  const fetchExpenseCategories = async () => {
    const { data, error } = await di.supabase
      .from('expense_categories')
      .select()

    if (error) {
      console.error('Supabase error:', error.message, error.details)
    }
    if (data) {
      setExpenseCategories(data)
    }
  }

  useEffect(() => {
    void fetchExpenseCategories()
  }, [])

  return (
    <div>
      {expenseCategories.map((category) => (
        <div key={category.id}>{category.name}</div>
      ))}
    </div>
  )
}
