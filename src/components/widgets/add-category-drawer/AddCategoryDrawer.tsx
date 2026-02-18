import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import {
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import { FolderPlus } from 'lucide-react'
import type { Di } from '../../../lib/di'
import type { CreateCategoryParams } from '../../../api/add-category/types'

export default function AddCategoryDrawer({ di }: { di: Di }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  const mutation = useMutation({
    ...di.addCategory.mo(),
    onSuccess: () => {
      di.getExpenseCategories.invalidateCache()
      setOpen(false)
      setName('')
      setValidationError(null)
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setValidationError(null)
    const trimmed = name.trim()
    if (!trimmed) {
      setValidationError('Введите название категории')
      return
    }
    const params: CreateCategoryParams = {
      name: trimmed,
    }
    mutation.mutate(params)
  }

  function handleClose() {
    setOpen(false)
    setValidationError(null)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md border border-surface-3 bg-surface-2 px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-3"
      >
        <FolderPlus className="size-4" aria-hidden />
        Добавить категорию
      </button>
      <Dialog open={open} onClose={handleClose} className="relative z-50">
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
                Новая категория
              </DialogTitle>
              <Description className="sr-only">
                Введите название категории расходов
              </Description>
              <form
                onSubmit={handleSubmit}
                className="mt-4 flex flex-col gap-4"
              >
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium text-foreground">Название</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      setValidationError(null)
                    }}
                    className="rounded-md border border-surface-3 bg-surface-2 px-3 py-2 text-foreground placeholder:text-secondary focus:border-foreground focus:outline-none"
                    placeholder="Например: Продукты"
                    aria-invalid={!!validationError}
                  />
                </label>
                {validationError && (
                  <p className="text-sm text-danger">{validationError}</p>
                )}
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
                    disabled={mutation.isPending || !name.trim()}
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
