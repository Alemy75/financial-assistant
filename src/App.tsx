import { createDi, type Di } from './lib/di'
import { QueryClientProvider, useQuery } from '@tanstack/react-query'

function ExpenseCategories({ di }: { di: Di }) {
  const { data } = useQuery({ ...di.getExpenseCategories.qo() })

  return (
    <>
      {data && (
        <div>
          {data.map((category) => (
            <div key={category.id}>{category.name}</div>
          ))}
        </div>
      )}
    </>
  )
}

export default function App() {
  const di = createDi()

  return (
    <QueryClientProvider client={di.queryClient}>
      <ExpenseCategories di={di} />
    </QueryClientProvider>
  )
}
