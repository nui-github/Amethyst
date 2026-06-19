'use client'
import { Plus, Activity, ListChecks, Upload } from 'lucide-react'

interface QuickActionBarProps {
  onCreateRGoods: () => void
  onShowQueueStatus: () => void
  onGoToQueue: () => void
  onUpload: () => void
}

const chips = [
  { id: 'rgoods',  label: 'สร้าง RGoods',    Icon: Plus,        blue: '#0463EF', bg: 'rgba(4,99,239,0.08)',  hover: 'rgba(4,99,239,0.15)' },
  { id: 'status',  label: 'ดูสถานะใบขน',    Icon: Activity,    blue: '#0D8F61', bg: 'rgba(13,143,97,0.08)', hover: 'rgba(13,143,97,0.15)' },
  { id: 'queue',   label: 'จัดการคิวงาน',   Icon: ListChecks,  blue: '#7C3AED', bg: 'rgba(124,58,237,0.08)',hover: 'rgba(124,58,237,0.15)' },
  { id: 'upload',  label: 'อัปโหลดเอกสาร',  Icon: Upload,      blue: '#B45309', bg: 'rgba(180,83,9,0.08)',  hover: 'rgba(180,83,9,0.15)' },
]

export function QuickActionBar({ onCreateRGoods, onShowQueueStatus, onGoToQueue, onUpload }: QuickActionBarProps) {
  const handlers: Record<string, () => void> = {
    rgoods: onCreateRGoods,
    status: onShowQueueStatus,
    queue:  onGoToQueue,
    upload: onUpload,
  }

  return (
    <div
      className="px-4 pt-2 pb-1 flex justify-center overflow-x-auto"
      style={{ background: 'transparent', scrollbarWidth: 'none' }}
    >
      <div className="flex items-center justify-center gap-2" style={{ width: '100%', maxWidth: '680px' }}>
      {chips.map(({ id, label, Icon, blue, bg, hover }) => (
        <button
          key={id}
          onClick={handlers[id]}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 transition-all"
          style={{ background: bg, color: blue, border: `1px solid transparent` }}
          onMouseOver={e => {
            e.currentTarget.style.background = hover
            e.currentTarget.style.borderColor = blue + '40'
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = bg
            e.currentTarget.style.borderColor = 'transparent'
          }}
        >
          <Icon size={12} strokeWidth={2.5} />
          {label}
        </button>
      ))}
      </div>
    </div>
  )
}
