'use client'
import { X, Send, Edit2, CheckCircle } from 'lucide-react'
import { FormData } from '@/lib/types'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

// ─── PREVIEW MODAL ─────────────────────────────────────────────
interface PreviewModalProps {
  formData: Partial<FormData>
  formValues: Record<string, string>
  onConfirm: () => void
  onEdit: () => void
  onClose: () => void
}

export function PreviewModal({ formData, formValues, onConfirm, onEdit, onClose }: PreviewModalProps) {
  const data = { ...formData, ...formValues }

  const importerRows = [
    { label: 'ผู้นำเข้า',       value: data.importer,      source: 'SPN' as const },
    { label: 'ผู้รับมอบอำนาจ', value: data.declarant,     source: 'SPN' as const },
    { label: 'ท่าเรือ',         value: data.port,           source: 'SPN' as const },
  ]
  const goodsRows = [
    { label: 'รายละเอียดสินค้า', value: data.goodsDesc,    source: 'SPN' as const },
    { label: 'HS Code',          value: data.hsCode,        source: 'SPN' as const },
    { label: 'ประเทศต้นทาง',    value: data.countryOrigin, source: 'SPN' as const },
    { label: 'จำนวน',           value: `${data.quantity} ${data.unit || 'กก.'}`, source: 'OCR' as const },
    { label: 'Lot Number',       value: data.lotNo,         source: 'OCR' as const },
  ]
  const docRows = [
    { label: 'เลข Invoice',    value: data.invoiceNo,       source: 'OCR'  as const },
    { label: 'วันที่ Invoice', value: data.invoiceDate,     source: 'OCR'  as const },
    { label: 'เลข U',         value: data.uNo,             source: 'OCR'  as const },
    { label: 'เลขทะเบียนยา', value: formValues.drugRegNo, source: 'user' as const },
    { label: 'วันที่นำเข้า',  value: formValues.importDate,source: 'user' as const },
  ]

  return (
    <Dialog open onOpenChange={open => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-lg max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-3xl"
        style={{ boxShadow: '0 20px 60px rgba(1,1,54,0.25)' }}
      >
        {/* Header */}
        <DialogHeader className="flex-row items-center justify-between px-6 py-4 sticky top-0 bg-white rounded-t-3xl z-10 border-b border-[#E0E0E0]">
          <DialogTitle className="text-base font-bold" style={{ color: '#010136' }}>
            Preview ก่อนส่งกรม
          </DialogTitle>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </DialogHeader>

        {/* Ref badge */}
        <div className="px-6 pt-4 pb-2">
          <div
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{ background: 'rgba(4,99,239,0.06)', border: '1px solid rgba(4,99,239,0.18)' }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #010136, #0463EF)', boxShadow: '0 2px 10px rgba(4,99,239,0.3)' }}
            >
              <CheckCircle size={15} className="text-white" />
            </div>
            <div>
              <p className="text-[11px]" style={{ color: '#999999' }}>ใบอนุญาต RGoods</p>
              <p className="text-sm font-bold" style={{ color: '#010136' }}>{data.ref}</p>
            </div>
          </div>
        </div>

        {/* Tables */}
        <div className="px-6 pb-4 space-y-4">
          <PreviewTable title="ข้อมูลผู้นำเข้า" rows={importerRows} />
          <PreviewTable title="ข้อมูลสินค้า"    rows={goodsRows} />
          <PreviewTable title="เอกสารอ้างอิง"   rows={docRows} />
        </div>

        {/* Footer */}
        <DialogFooter showCloseButton={false} className="px-6 py-4 gap-3 border-t border-[#E0E0E0] bg-white rounded-b-3xl sm:flex-row">
          <Button
            variant="outline"
            onClick={onEdit}
            className="flex-1 gap-2 rounded-xl py-2.5 text-sm font-semibold"
          >
            <Edit2 size={13} /> แก้ไขข้อมูล
          </Button>
          <button
            onClick={onConfirm}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, #11BB7F, #16EA9E)',
              boxShadow: '0 4px 14px rgba(22,234,158,0.3)',
              color: '#010136',
            }}
          >
            <Send size={13} /> ยืนยันส่งข้อมูลเข้ากรม
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Preview Table ──────────────────────────────────────────────
type SourceType = 'SPN' | 'OCR' | 'user'
interface TableRow { label: string; value?: string; source: SourceType }

const SOURCE_STYLE: Record<SourceType, { bg: string; color: string }> = {
  SPN:  { bg: 'rgba(4,99,239,0.10)',    color: '#0463EF' },
  OCR:  { bg: 'rgba(22,234,158,0.15)',  color: '#0D8F61' },
  user: { bg: 'rgba(255,165,0,0.12)',   color: '#B45309' },
}

function sourceTag(s: SourceType) {
  const st = SOURCE_STYLE[s]
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold"
      style={{ background: st.bg, color: st.color }}
    >
      {s}
    </span>
  )
}

function PreviewTable({ title, rows }: { title: string; rows: TableRow[] }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-[#999999] uppercase tracking-wider mb-2">{title}</p>
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #E0E0E0' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#F9F9F9', borderBottom: '1px solid #E0E0E0' }}>
              <th className="text-left px-3 py-2 text-[11px] font-bold" style={{ color: '#666666' }}>รายการ</th>
              <th className="text-left px-3 py-2 text-[11px] font-bold" style={{ color: '#666666' }}>ข้อมูล</th>
              <th className="text-left px-3 py-2 text-[11px] font-bold w-12" style={{ color: '#666666' }}>แหล่ง</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={{ borderBottom: i < rows.length - 1 ? '1px solid #F0F0F0' : 'none' }}>
                <td className="px-3 py-2 text-xs" style={{ color: '#666666' }}>{row.label}</td>
                <td className="px-3 py-2 text-xs font-semibold" style={{ color: '#010136' }}>{row.value || '—'}</td>
                <td className="px-3 py-2">{sourceTag(row.source)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── CONFIRM MODAL ──────────────────────────────────────────────
interface ConfirmModalProps {
  ref: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({ ref: refNo, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <Dialog open onOpenChange={open => !open && onCancel()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-sm rounded-3xl text-center p-6 gap-0"
        style={{ boxShadow: '0 20px 60px rgba(1,1,54,0.25)' }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: 'linear-gradient(135deg, #11BB7F, #16EA9E)', boxShadow: '0 4px 16px rgba(22,234,158,0.3)' }}
        >
          <Send size={24} style={{ color: '#010136' }} />
        </div>

        <DialogTitle className="text-base font-bold mb-2" style={{ color: '#010136' }}>
          ยืนยันส่งข้อมูลเข้ากรม
        </DialogTitle>
        <p className="text-sm mb-6" style={{ color: '#666666', lineHeight: '1.6' }}>
          คุณแน่ใจหรือไม่ว่าต้องการส่งข้อมูลใบอนุญาต RGoods<br />
          สำหรับใบขน <strong style={{ color: '#010136' }}>{refNo}</strong> เข้ากรมฯ?
        </p>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1 gap-2 rounded-xl py-2.5 text-sm font-semibold"
          >
            <X size={14} /> ยกเลิก
          </Button>
          <button
            onClick={onConfirm}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, #11BB7F, #16EA9E)',
              boxShadow: '0 4px 14px rgba(22,234,158,0.3)',
              color: '#010136',
            }}
          >
            <CheckCircle size={14} /> ยืนยันส่ง
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
