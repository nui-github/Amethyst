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

// ── SPN list entry (raw data from ShippingNet) ──────────────────────────────

export interface SPNEntry {
  ref: string          // HTHM000000001
  customsNo: string    // A012-25680617-00XXX
  importer: string     // ชื่อผู้นำเข้า
  goods: string        // รายละเอียดสินค้า
  hs: string           // HS Code
  origin: string       // ประเทศต้นทาง
  date: string         // วันที่ใบขน
  inQueue?: boolean    // มีในคิวแล้วหรือยัง
}

// ── Queue / Shipment types ───────────────────────────────────────────────────

export type AgencyKey = 'dld' | 'fda' | 'dft' | 'doa' | 'diw' | 'none'

export type ShipmentStatus =
  | 'needs_you'       // รอคุณยืนยัน
  | 'no_permit'       // ไม่ต้องขอใบอนุญาต
  | 'email_outbox'    // ร่างอีเมลรอส่ง
  | 'await_customer'  // รอลูกค้ายืนยัน
  | 'submitted'       // ยื่นกรมแล้ว

export interface ShipmentFlag {
  id: string
  title: string
  detail: string
  conf: number
  resolved: boolean
}

export interface DraftField {
  label: string
  value: string
  flag?: string  // flag id
}

export interface AuditEntry {
  time: string
  text: string
  by: 'ระบบ' | 'AI' | 'เจ้าหน้าที่'
}

export interface Shipment {
  id: string            // IMP-68-XXXXXX (เลขใบขน)
  hthmRef?: string      // HTHM000000001 (เลข SPN อ้างอิง)
  isNew?: boolean       // true = ยังไม่ได้เปิดดู (แสดง dot + นับ badge)
  customsNo: string     // A012-25680617-00XXX (เลขใบขนสินค้า)
  type: 'IMP' | 'EXP'
  customer: string      // ชื่อบริษัทผู้นำเข้า
  contact: string       // ชื่อผู้ติดต่อ
  contactEmail: string
  goods: string         // รายละเอียดสินค้า
  hs: string            // HS Code
  origin: string        // ประเทศต้นทาง
  importedAt: string    // เวลานำเข้าระบบ
  owner: string         // เจ้าหน้าที่รับผิดชอบ
  permitNeeded: boolean
  agency: AgencyKey
  formCode: string      // รหัสแบบฟอร์ม เช่น แบบ ร.7
  formName: string      // ชื่อเต็มแบบฟอร์ม
  conf: number          // AI confidence 0–100
  stage: number         // 0–8 (progress steps)
  statusKey: ShipmentStatus
  assess: {
    conf: number
    reason: string
  }
  classify: {
    agency: AgencyKey
    conf: number
    reason: string
    alt: { agency: AgencyKey; conf: number }[]
  }
  draft: {
    fields: DraftField[]
  }
  flags: ShipmentFlag[]
  audit: AuditEntry[]
  email: {
    toName: string
    to: string
    subject: string
    body: string
    attName: string
  }
}
