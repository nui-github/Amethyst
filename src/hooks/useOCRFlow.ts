import { useState, useCallback } from 'react'
import { runOCR } from '@/lib/api/ocr'

export type OCRResult = Awaited<ReturnType<typeof runOCR>>

const STAGES = ['invoice', 'customs', 'coa', 'ulicense']

export function useOCRFlow() {
  const [ocrProgress, setOcrProgress] = useState(0)
  const [ocrStages, setOcrStages]     = useState<string[]>([])
  const [isOCRing, setIsOCRing]       = useState(false)

  const startOCR = useCallback(async (files: { name: string }[] = []): Promise<OCRResult> => {
    setIsOCRing(true)
    setOcrProgress(0)
    setOcrStages([])

    let idx = 0
    const iv = setInterval(() => {
      if (idx < STAGES.length) {
        setOcrStages(prev => [...prev, STAGES[idx]])
        idx++
        setOcrProgress(Math.round((idx / STAGES.length) * 100))
      } else {
        clearInterval(iv)
      }
    }, 700)

    const result = await runOCR(files)
    clearInterval(iv)
    setOcrProgress(100)
    setOcrStages(STAGES)
    setIsOCRing(false)
    return result
  }, [])

  const resetOCR = useCallback(() => {
    setOcrProgress(0)
    setOcrStages([])
    setIsOCRing(false)
  }, [])

  return { ocrProgress, ocrStages, isOCRing, startOCR, resetOCR }
}
