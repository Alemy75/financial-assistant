import { ExpensesList } from './components/widgets/expenses-list'
import { AddExpenseDrawer } from './components/widgets/add-expense-drawer'
import { createDi } from './lib/di'
import { QueryClientProvider } from '@tanstack/react-query'

export default function App() {
  const di = createDi()

  return (
    <QueryClientProvider client={di.queryClient}>
      <main className="p-4 max-w-[600px] mx-auto">
        <div className="mb-4 flex items-center justify-end">
          <AddExpenseDrawer di={di} />
        </div>
        <ExpensesList di={di} />
      </main>
    </QueryClientProvider>
  )
}
