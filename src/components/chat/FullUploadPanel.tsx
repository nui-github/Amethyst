'use client'
import { useState } from 'react'
import { CloudUpload, FileText, Ship, FlaskConical, BadgeCheck, X, Play } from 'lucide-react'
import { UploadSlots, SlotKey } from '@/lib/types'

interface FullUploadPanelProps {
  onStartOCR: (slots: UploadSlots) => void
}

const SLOT_CONFIGS = [
  {
    key: 'invoice'  as SlotKey, label: 'Invoice',
    icon: FileText,    accent: '#0463EF', bg: 'rgba(4,99,239,0.08)',   border: 'rgba(4,99,239,0.3)',
  },
  {
    key: 'customs'  as SlotKey, label: 'ใบขนสินค้า',
    icon: Ship,        accent: '#034DBA', bg: 'rgba(3,77,186,0.08)',   border: 'rgba(3,77,186,0.3)',
  },
  {
    key: 'coa'      as SlotKey, label: 'COA (Certificate)',
    icon: FlaskConical,accent:'#11BB7F', bg: 'rgba(17,187,127,0.08)', border: 'rgba(17,187,127,0.3)',
  },
  {
    key: 'ulicense' as SlotKey, label: 'ใบเลข U',
    icon: BadgeCheck,  accent: '#16EA9E', bg: 'rgba(22,234,158,0.08)', border: 'rgba(22,234,158,0.3)',
  },
]

export function FullUploadPanel({ onStartOCR }: FullUploadPanelProps) {
  const [slots, setSlots] = useState<UploadSlots>({ invoice: [], customs: [], coa: [], ulicense: [] })
  const [dragging, setDragging] = useState<SlotKey | null>(null)

  const addFiles = (key: SlotKey, files: File[]) =>
    setSlots(prev => {
      const existing = prev[key].map(f => f.name)
      return { ...prev, [key]: [...prev[key], ...files.filter(f => !existing.includes(f.name))] }
    })

  const removeFile = (key: SlotKey, name: string) =>
    setSlots(prev => ({ ...prev, [key]: prev[key].filter(f => f.name !== name) }))

  const handleDrop = (e: React.DragEvent, key: SlotKey) => {
    e.preventDefault(); setDragging(null)
    addFiles(key, Array.from(e.dataTransfer.files))
  }

  const totalFiles = Object.values(slots).reduce((a, b) => a + b.length, 0)

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
        <CloudUpload size={15} style={{ color: '#0463EF' }} />
        เอกสารที่ต้องอัปโหลด
      </div>

      {/* Slots */}
      <div className="p-4 bg-white space-y-3">
        {SLOT_CONFIGS.map(({ key, label, icon: Icon, accent, bg, border }) => (
          <div key={key}>
            {/* Label row */}
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold"
                style={{ background: bg, color: accent, border: `1px solid ${border}` }}
              >
                <Icon size={10} />{label}
              </span>
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(4,99,239,0.08)', color: '#0463EF' }}
              >จำเป็น</span>
            </div>

            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragging(key) }}
              onDragLeave={() => setDragging(null)}
              onDrop={e => handleDrop(e, key)}
              onClick={() => {
                const input = document.createElement('input')
                input.type = 'file'; input.multiple = true; input.accept = '.pdf,.jpg,.jpeg,.png'
                input.onchange = (e: any) => addFiles(key, Array.from(e.target.files || []))
                input.click()
              }}
              className="rounded-xl border-2 border-dashed p-3 text-center cursor-pointer transition-all"
              style={{
                borderColor: slots[key].length > 0 ? '#16EA9E' : dragging === key ? '#0463EF' : '#CCCCCC',
                background:  slots[key].length > 0 ? 'rgba(22,234,158,0.05)' : dragging === key ? 'rgba(4,99,239,0.04)' : '#F9F9F9',
              }}
            >
              <Icon
                size={18}
                className="mx-auto mb-1"
                style={{ color: slots[key].length > 0 ? '#11BB7F' : accent }}
              />
              <p className="text-xs" style={{ color: '#666666' }}>คลิกหรือลากไฟล์ {label} มาวาง</p>
              <p className="text-[10px] mt-0.5" style={{ color: '#999999' }}>PDF, JPG, PNG</p>
            </div>

            {/* File chips */}
            {slots[key].length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {slots[key].map(f => (
                  <div
                    key={f.name}
                    className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-full"
                    style={{ background: 'rgba(4,99,239,0.08)', color: '#0463EF', border: '1px solid rgba(4,99,239,0.2)' }}
                  >
                    <span className="truncate max-w-[150px]">{f.name}</span>
                    <button onClick={() => removeFile(key, f.name)} className="transition-colors hover:text-red-500 flex-shrink-0">
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <p className="text-[11px]" style={{ color: '#999999' }}>
          ℹ️ อัปโหลดได้หลายไฟล์ต่อประเภท — ระบบจะ OCR ทุกไฟล์โดยอัตโนมัติ
        </p>

        {/* Start button */}
        <button
          onClick={() => onStartOCR(slots)}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.01] active:scale-[0.99]"
          style={{
            background: 'linear-gradient(135deg, #034DBA, #0463EF)',
            boxShadow: '0 4px 14px rgba(4,99,239,0.28)',
          }}
        >
          <Play size={13} />
          เริ่ม OCR เอกสารทั้งหมด {totalFiles > 0 && `(${totalFiles} ไฟล์)`}
        </button>
      </div>
    </div>
  )
}
