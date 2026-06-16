import { FormData } from '@/lib/types'
import { KNOWN_REFS, MOCK_FORM_DATA } from '@/lib/mock/spn'

export interface SPNResult {
  found: boolean
  data?: Omit<FormData, 'ref'>
}

// TODO (dev): แทนที่ด้วย real API call
// const res = await fetch(`/api/spn/${ref}`)
// const json = await res.json()
// return { found: json.found, data: json.data }
export async function fetchSPN(ref: string): Promise<SPNResult> {
  await delay(1800)
  if (!KNOWN_REFS.includes(ref)) return { found: false }
  return { found: true, data: MOCK_FORM_DATA }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
