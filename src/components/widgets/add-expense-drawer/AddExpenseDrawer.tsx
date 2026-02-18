import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import { Plus } from 'lucide-react'
import type { Di } from '../../../lib/di'
import type { CreateExpenceParams } from '../../../api/add-expence/types'

export default function AddExpenseDrawer({ di }: { di: Di }) {
  const [open, setOpen] = useState(false)
  const [count, setCount] = useState('')
  const [categoryId, setCategoryId] = useState<string>('')
  const [validationErrors, setValidationErrors] = useState<{
    count?: string
    category?: string
  }>({})

  const { data: categories, isPending: isPendingCategories } = useQuery({
    ...di.getExpenseCategories.qo(),
  })

  const mutation = useMutation({
    ...di.addExpence.mo(),
    onSuccess: () => {
      di.getExpenses.invalidateCache()
      setOpen(false)
      setCount('')
      setCategoryId('')
      setValidationErrors({})
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errors: { count?: string; category?: string } = {}
    const countNum = count.trim() === '' ? NaN : Number(count)
    if (count.trim() === '' || Number.isNaN(countNum) || countNum <= 0) {
      errors.count = 'Введите сумму больше нуля'
    }
    if (!categoryId || categoryId === '') {
      errors.category = 'Выберите категорию'
    }
    setValidationErrors(errors)
    if (Object.keys(errors).length > 0) return
    const params: CreateExpenceParams = {
      count: countNum,
      category_id: Number(categoryId),
    }
    mutation.mutate(params)
  }

  function handleClose() {
    setOpen(false)
    setValidationErrors({})
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-primary hover:opacity-90"
      >
        <Plus className="size-4" aria-hidden />
        Добавить расход
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        className="relative z-50"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-foreground/20 transition duration-300 ease-out data-closed:opacity-0"
        />
        <div className="fixed inset-0 flex w-screen justify-end">
          <DialogPanel
            transition
            className="flex h-full w-full max-w-sm flex-col border-l border-surface-3 bg-surface-1 shadow-lg outline-none transition duration-300 ease-out data-closed:translate-x-full"
          >
            <div className="flex flex-1 flex-col p-4">
              <DialogTitle className="text-lg font-semibold text-foreground">
                Новый расход
              </DialogTitle>
              <Description className="sr-only">
                Заполните форму для добавления расхода
              </Description>
              <form
                onSubmit={handleSubmit}
                className="mt-4 flex flex-col gap-4"
              >
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium text-foreground">
                    Стоимость, ₽
                  </span>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={count}
                    onChange={(e) => {
                      setCount(e.target.value)
                      setValidationErrors((prev) => ({ ...prev, count: undefined }))
                    }}
                    className="rounded-md border border-surface-3 bg-surface-2 px-3 py-2 text-foreground placeholder:text-secondary focus:border-foreground focus:outline-none"
                    placeholder="0"
                    aria-invalid={!!validationErrors.count}
                  />
                  {validationErrors.count && (
                    <p className="text-sm text-danger">{validationErrors.count}</p>
                  )}
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium text-foreground">Категория</span>
                  <select
                    value={categoryId}
                    onChange={(e) => {
                      setCategoryId(e.target.value)
                      setValidationErrors((prev) => ({ ...prev, category: undefined }))
                    }}
                    disabled={isPendingCategories}
                    className="rounded-md border border-surface-3 bg-surface-2 px-3 py-2 text-foreground focus:border-foreground focus:outline-none disabled:opacity-50"
                    aria-invalid={!!validationErrors.category}
                  >
                    <option value="">— не выбрано —</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name ?? '—'}
                      </option>
                    ))}
                  </select>
                  {validationErrors.category && (
                    <p className="text-sm text-danger">{validationErrors.category}</p>
                  )}
                </label>
                {mutation.isError && (
                  <p className="text-sm text-danger">
                    {mutation.error instanceof Error
                      ? mutation.error.message
                      : 'Ошибка при сохранении'}
                  </p>
                )}
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 rounded-md border border-surface-3 bg-surface-2 px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-3"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    disabled={
                      mutation.isPending ||
                      !count.trim() ||
                      !categoryId ||
                      Number.isNaN(Number(count)) ||
                      Number(count) <= 0
                    }
                    className="flex-1 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-primary hover:opacity-90 disabled:opacity-50"
                  >
                    {mutation.isPending ? 'Сохранение…' : 'Сохранить'}
                  </button>
                </div>
              </form>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}
