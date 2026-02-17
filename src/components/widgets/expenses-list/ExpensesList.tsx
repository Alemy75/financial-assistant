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
  const { data } = useQuery({ ...di.getExpenses.qo() })

  return (
    <>
      <div className="overflow-x-auto border border-surface-3 rounded-md">
        {data && data.length > 0 ? (
          <table className="w-full border-collapse bg-surface-2">
            <thead>
              <tr className="text-left bg-surface-3">
                <th className="p-2 font-normal">Дата</th>
                <th className="p-2 font-normal">Стоимость</th>
                <th className="p-2 font-normal">Название</th>
              </tr>
            </thead>
            <tbody>
              {data.map((expense) => (
                <tr key={expense.id} className="border-t border-surface-3">
                  <td className="p-2">{formatDate(expense.created_at)}</td>
                  <td className="p-2">
                    {expense.count != null ? `${expense.count} ₽` : '—'}
                  </td>
                  <td className="p-2">{expense.name ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-slate-500">Нет расходов</p>
        )}
      </div>
    </>
  )
}
