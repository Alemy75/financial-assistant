import { createClient } from '@supabase/supabase-js'

export function createDi() {
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY
  )

  return {
    supabase,
  }
}
