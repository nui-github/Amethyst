'use client'
import { Eye, RefreshCw } from 'lucide-react'

interface FormPanelProps {
  formValues: Record<string, string>
  onChange: (key: string, value: string) => void
  onPreview: () => void
}

const fields = [
  { id: 'invoiceNo',   label: 'เลข Invoice',      filled: true, source: 'OCR' },
  { id: 'invoiceDate', label: 'วันที่ Invoice',    filled: true, source: 'OCR' },
  { id: 'lotNo',       label: 'Lot Number',        filled: true, source: 'OCR' },
  { id: 'uNo',         label: 'เลข U',             filled: true, source: 'OCR' },
  { id: 'quantity',    label: 'จำนวน (กก.)',       filled: true, source: 'OCR' },
  { id: 'importDate',  label: 'วันที่นำเข้า',      required: true, placeholder: 'เช่น 10/06/2568' },
  { id: 'drugRegNo',   label: 'เลขทะเบียนยา',     required: true, placeholder: 'เช่น 1A 234/50' },
  { id: 'declarant',   label: 'ผู้รับมอบอำนาจ',   filled: true, source: 'SPN' },
  { id: 'goodsDesc',   label: 'รายละเอียดสินค้า', fullWidth: true, filled: true, source: 'SPN' },
]

function SourceTag({ source }: { source: string }) {
  const isSPN = source === 'SPN'
  return (
    <span
      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1"
      style={{
        background: isSPN ? 'rgba(4,99,239,0.10)' : 'rgba(22,234,158,0.15)',
        color: isSPN ? '#0463EF' : '#0D8F61',
      }}
    >
      ✓ {source}
    </span>
  )
}

export function FormPanel({ formValues, onChange, onPreview }: FormPanelProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden mt-3"
      style={{ border: '1px solid #E0E0E0', boxShadow: '0 2px 10px rgba(1,1,54,0.06)' }}
    >
      {/* Header */}
      <div
        className="px-4 py-2.5 flex items-center gap-2 text-sm font-semibold border-b"
        style={{ background: '#F0F0F0', borderColor: '#E0E0E0', color: '#010136' }}
      >
        <svg className="w-4 h-4" style={{ color: '#0463EF' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        กรอกข้อมูลใบอนุญาต RGoods
      </div>

      {/* Body */}
      <div className="p-4 bg-white">
        <div className="grid grid-cols-2 gap-3">
          {fields.map(field => {
            const val = formValues[field.id] || ''
            const isOcrFilled = !!field.filled && !!val
            const isMissing = !!field.required && !val

            let bg = '#fff', border = '#CCCCCC', color = '#010136'
            if (isOcrFilled) { bg = 'rgba(22,234,158,0.07)'; border = '#16EA9E'; color = '#0D8F61' }
            else if (isMissing) { bg = 'rgba(4,99,239,0.04)'; border = '#70A0F0' }

            return (
              <div key={field.id} className={field.fullWidth ? 'col-span-2' : ''}>
                <label className="text-[11px] font-semibold block mb-1" style={{ color: '#666666' }}>
                  {field.label}
                  {field.required && <span style={{ color: '#0463EF' }} className="ml-0.5 font-bold">*</span>}
                  {field.source && <SourceTag source={field.source} />}
                </label>
                <input
                  type="text"
                  value={val}
                  onChange={e => onChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 text-sm rounded-xl outline-none transition-all duration-150"
                  style={{ background: bg, border: `1px solid ${border}`, color }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = '#0463EF'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(4,99,239,0.12)'
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = border
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>
            )
          })}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={onPreview}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #034DBA, #0463EF)',
              boxShadow: '0 4px 14px rgba(4,99,239,0.28)',
            }}
          >
            <Eye size={14} />
            ดู Preview ก่อนส่ง
          </button>
          <button
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{ background: '#F0F0F0', color: '#666666', border: '1px solid #E0E0E0' }}
            onMouseOver={e => { e.currentTarget.style.background = '#E0E0E0' }}
            onMouseOut={e => { e.currentTarget.style.background = '#F0F0F0' }}
          >
            <RefreshCw size={14} />
            เคลียร์
          </button>
        </div>
      </div>
    </div>
  )
}
