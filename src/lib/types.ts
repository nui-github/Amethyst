export type MessageRole = 'bot' | 'user'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  time: string
  isHtml?: boolean
}

export interface FormData {
  ref: string
  declarant: string
  importer: string
  port: string
  declarationDate: string
  goodsDesc: string
  hsCode: string
  countryOrigin: string
  quantity: string
  unit: string
  licenseType: string
  invoiceNo: string
  invoiceDate: string
  lotNo: string
  uNo: string
  drugRegNo?: string
  importDate?: string
}

export type ChatStep =
  | 'idle'
  | 'upload'
  | 'full_upload'
  | 'not_found'
  | 'xml_upload'
  | 'invoice_upload'
  | 'hs_analysis'
  | 'preview_ready'
  | 'ocr'
  | 'form'
  | 'preview'
  | 'done'

export interface UploadSlots {
  invoice: File[]
  customs: File[]
  coa: File[]
  ulicense: File[]
}

export type SlotKey = keyof UploadSlots

export interface SidebarItem {
  id: string
  label: string
  icon: string
  section?: 'main' | 'history' | 'bottom'
}
