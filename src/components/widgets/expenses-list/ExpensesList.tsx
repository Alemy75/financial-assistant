import { useQuery } from '@tanstack/react-query'
import type { Di } from '../../../lib/di'

function formatDate(iso: string): string {
  const d = new Date(iso)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}.${month}.${year}`
}

export default function ExpensesList({ di }: { di: Di }) {
  const { data: expenses, isPending: isPendingExpenses } = useQuery({
    ...di.getExpenses.qo(),
  })

  const { data: categories, isPending: isPendingCategories } = useQuery({
    ...di.getExpenseCategories.qo(),
  })

  function getCategoryName(categoryId: number | null): string {
    return (
      categories?.find((category) => category.id === categoryId)?.name ?? '—'
    )
  }

  return (
    <>
      <div className="overflow-x-auto border border-surface-3 rounded-md text-sm">
        <table className="min-w-lg w-full border-collapse bg-surface-2">
          <thead>
            <tr className="text-left bg-surface-3">
              <th className="p-2 leading-5 font-semibold whitespace-nowrap">Дата</th>
              <th className="p-2 leading-5 font-semibold whitespace-nowrap">Стоимость</th>
              <th className="p-2 leading-5 font-semibold whitespace-nowrap">Название</th>
              <th className="p-2 leading-5 font-semibold whitespace-nowrap">Категория</th>
            </tr>
          </thead>
          <tbody>
            {(isPendingExpenses || isPendingCategories) &&
              [...new Array(5)].map((_, i) => (
                <tr key={i} className="border-t border-surface-3">
                  <td className="p-2">
                    <div className="h-5 w-2/3 bg-surface-3 rounded-md animate-pulse" />
                  </td>
                  <td className="p-2">
                    <div className="h-5 w-1/2 bg-surface-3 rounded-md animate-pulse" />
                  </td>
                  <td className="p-2">
                    <div className="h-5 w-1/2 bg-surface-3 rounded-md animate-pulse" />
                  </td>
                  <td className="p-2">
                    <div className="h-5 w-1/2 bg-surface-3 rounded-md animate-pulse" />
                  </td>
                </tr>
              ))}
            {expenses &&
              expenses.length > 0 &&
              expenses.map((expense) => (
                <tr key={expense.id} className="border-t border-surface-3">
                  <td className="p-2 leading-5 whitespace-nowrap">
                    {formatDate(expense.created_at)}
                  </td>
                  <td className="p-2 leading-5 whitespace-nowrap">
                    {expense.count != null ? `${expense.count} ₽` : '—'}
                  </td>
                  <td className="p-2 leading-5">
                    {expense.name ?? '—'}
                  </td>
                  <td className="p-2 leading-5">
                    {getCategoryName(expense.category_id)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
