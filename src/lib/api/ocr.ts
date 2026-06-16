import { MOCK_OCR_FULL } from '@/lib/mock/ocr'

export type OcrResult = typeof MOCK_OCR_FULL

// TODO (dev): แทนที่ด้วย real OCR service (AWS Textract / Google Vision / Azure)
// const formData = new FormData()
// files.forEach(f => formData.append('files', f))
// const res = await fetch('/api/ocr', { method: 'POST', body: formData })
// return res.json()
export async function runOCR(_files: { name: string }[]): Promise<OcrResult> {
  await delay(2800)
  return MOCK_OCR_FULL
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
