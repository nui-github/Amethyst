'use client'
import { FileText, Ship, FlaskConical, BadgeCheck, CheckCircle } from 'lucide-react'

interface OcrProgressProps {
  progress: number
  completedStages: string[]
}

const STAGES = [
  { id: 'invoice',  label: 'Invoice',     icon: FileText,     accent: '#0463EF' },
  { id: 'customs',  label: 'ใบขนสินค้า', icon: Ship,         accent: '#034DBA' },
  { id: 'coa',      label: 'COA',         icon: FlaskConical, accent: '#11BB7F' },
  { id: 'ulicense', label: 'ใบเลข U',    icon: BadgeCheck,   accent: '#16EA9E' },
]

export function OcrProgress({ progress, completedStages }: OcrProgressProps) {
  const label =
    progress < 25  ? 'กำลังอ่าน Invoice...' :
    progress < 50  ? 'กำลังอ่านใบขนสินค้า...' :
    progress < 75  ? 'กำลังอ่าน COA...' :
    progress < 100 ? 'กำลังอ่านใบเลข U...' : 'เสร็จสิ้น ✓'

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
        <div
          className="w-4 h-4 rounded-full border-2 flex-shrink-0"
          style={{ borderColor: '#E0E0E0', borderTopColor: '#0463EF', animation: 'spin 1s linear infinite' }}
        />
        กำลัง OCR เอกสาร...
      </div>

      {/* Body */}
      <div className="p-4 bg-white">
        <div className="space-y-2 mb-4">
          {STAGES.map(({ id, label: sl, icon: Icon, accent }) => {
            const done = completedStages.includes(id)
            return (
              <div
                key={id}
                className="flex items-center gap-3 p-2.5 rounded-xl transition-all"
                style={{
                  background: done ? 'rgba(22,234,158,0.07)' : '#F9F9F9',
                  border: `1px solid ${done ? 'rgba(22,234,158,0.3)' : '#E0E0E0'}`,
                }}
              >
                <Icon size={14} style={{ color: done ? '#0D8F61' : accent, opacity: done ? 1 : 0.6 }} />
                <span
                  className="text-xs flex-1"
                  style={{ color: done ? '#0D8F61' : '#666666', fontWeight: done ? 600 : 400 }}
                >
                  {sl}
                </span>
                {done ? (
                  <CheckCircle size={14} style={{ color: '#16EA9E' }} />
                ) : (
                  <div
                    className="w-4 h-4 rounded-full border-2 flex-shrink-0"
                    style={{ borderColor: '#E0E0E0', borderTopColor: '#0463EF', animation: 'spin 1s linear infinite' }}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Progress bar */}
        <div className="h-2 rounded-full overflow-hidden" style={{ background: '#E0E0E0' }}>
          <div className="h-full ocr-fill rounded-full" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-[11px] mt-1.5" style={{ color: '#999999' }}>
          {label} ({progress}%)
        </p>
      </div>
    </div>
  )
}
