'use client'
import {
  MessageSquareText, FileCheck2, Package, FileText,
  Clock3, Settings, Plus, ChevronRight,
  BarChart2, LayoutDashboard, ListChecks,
} from 'lucide-react'

interface SidebarProps {
  activeItem: string
  onSelect: (id: string) => void
}

const mainItems = [
  { id: 'chatbot',   label: 'Chatbot',    icon: MessageSquareText },
  { id: 'queue',     label: 'คิวงาน',    icon: ListChecks },
  { id: 'dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { id: 'license',   label: 'ใบอนุญาต',  icon: FileCheck2 },
  { id: 'rgoods',    label: 'RGoods',     icon: Package },
  { id: 'customs',   label: 'ใบขน',       icon: FileText },
  { id: 'analytics', label: 'Analytics',  icon: BarChart2 },
]

const historyItems = [
  { id: 'HTHM000000003', label: 'HTHM000000003' },
  { id: 'HTHM000000001', label: 'HTHM000000001' },
]

const L = {
  bg:           '#FFFFFF',
  border:       '#E8E8E8',
  borderDash:   '#D0D0D0',
  label:        '#AAAAAA',
  text:         '#666666',
  textDark:     '#333333',
  hover:        '#F5F5F5',
  activeText:   '#0463EF',
  activeBg:     'rgba(4,99,239,0.08)',
  histActive:   '#0D8F61',
  histActiveBg: 'rgba(22,234,158,0.10)',
}

export function Sidebar({ activeItem, onSelect }: SidebarProps) {
  return (
    <aside
      className="w-56 flex-shrink-0 flex flex-col"
      style={{
        background: L.bg,
        borderRight: `1px solid ${L.border}`,
      }}
    >
      {/* New Chat button */}
      <div className="flex-shrink-0 px-3 pt-3 pb-1">
        <button
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-colors"
          style={{ border: `1.5px dashed ${L.borderDash}`, color: L.text, background: 'transparent' }}
          onMouseOver={e => { e.currentTarget.style.background = L.hover; e.currentTarget.style.borderColor = '#0463EF'; e.currentTarget.style.color = '#0463EF' }}
          onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = L.borderDash; e.currentTarget.style.color = L.text }}
        >
          <Plus size={13} />
          สนทนาใหม่
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        <p className="text-[9px] font-bold uppercase tracking-widest px-2 py-1.5 mt-1" style={{ color: L.label }}>
          เมนูหลัก
        </p>

        {mainItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeItem === id
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-all duration-150"
              style={{
                background: isActive ? L.activeBg : 'transparent',
                color: isActive ? L.activeText : L.text,
              }}
              onMouseOver={e => { if (!isActive) { e.currentTarget.style.background = L.hover; e.currentTarget.style.color = L.textDark } }}
              onMouseOut={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = L.text } }}
            >
              <Icon size={15} className="flex-shrink-0" />
              <span className="truncate text-xs font-semibold">{label}</span>
              {isActive && <ChevronRight size={11} className="ml-auto opacity-60" />}
            </button>
          )
        })}

        <div className="my-2" style={{ borderTop: `1px solid ${L.border}` }} />

        <p className="text-[9px] font-bold uppercase tracking-widest px-2 py-1.5" style={{ color: L.label }}>
          ประวัติ
        </p>

        {historyItems.map(({ id, label }) => {
          const isActive = activeItem === id
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left transition-all"
              style={{
                color: isActive ? L.histActive : L.label,
                background: isActive ? L.histActiveBg : 'transparent',
              }}
              onMouseOver={e => { if (!isActive) { e.currentTarget.style.background = L.hover; e.currentTarget.style.color = L.textDark } }}
              onMouseOut={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = L.label } }}
            >
              <Clock3 size={12} className="flex-shrink-0 opacity-60" />
              <span className="truncate font-mono text-[10px]">{label}</span>
            </button>
          )
        })}
      </nav>

      {/* Settings */}
      <div className="px-2 flex-shrink-0" style={{ borderTop: `1px solid ${L.border}`, padding: '17px 8px' }}>
        <button
          onClick={() => onSelect('settings')}
          className="w-full h-10 flex items-center gap-2.5 px-2.5 rounded-xl text-left transition-all"
          style={{ color: activeItem === 'settings' ? L.activeText : L.text }}
          onMouseOver={e => { e.currentTarget.style.background = L.hover; e.currentTarget.style.color = L.textDark }}
          onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = activeItem === 'settings' ? L.activeText : L.text }}
        >
          <Settings size={14} />
          <span className="text-xs font-semibold">ตั้งค่า</span>
        </button>
      </div>
    </aside>
  )
}
