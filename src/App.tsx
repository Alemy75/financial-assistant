import { ExpensesList } from './components/widgets/expenses-list'
import { createDi } from './lib/di'
import { QueryClientProvider } from '@tanstack/react-query'

export default function App() {
  const di = createDi()

  return (
    <QueryClientProvider client={di.queryClient}>
      <main className="p-4 max-w-[600px] mx-auto">
        <ExpensesList di={di} />
      </main>
    </QueryClientProvider>
  )
}
