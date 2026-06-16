'use client'
import {
  MessageSquareText, FileCheck2, Package, FileText,
  Clock3, Settings, Plus, ChevronRight,
  BarChart2, LayoutDashboard, Bot,
} from 'lucide-react'

interface SidebarProps {
  activeItem: string
  onSelect: (id: string) => void
}

const mainItems = [
  { id: 'chatbot',   label: 'Chatbot',    icon: MessageSquareText },
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

export function Sidebar({ activeItem, onSelect }: SidebarProps) {
  return (
    <aside className="w-56 flex-shrink-0 flex flex-col" style={{ background: '#010136' }}>

      {/* Logo */}
      <div className="px-4 py-4" style={{ borderBottom: '1px solid #40406A' }}>
        <div className="flex items-center gap-2.5">
          {/* Bot icon badge */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #0463EF 0%, #16EA9E 100%)', boxShadow: '0 3px 12px rgba(4,99,239,0.35)' }}
          >
            <Bot size={20} color="#fff" strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white leading-tight">ShippingNet</p>
            <p className="text-[10px] font-medium leading-tight" style={{ color: '#70A0F0' }}>Assistant</p>
          </div>
        </div>
      </div>

      {/* New Chat button */}
      <div className="px-3 pt-3 pb-1">
        <button
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-colors"
          style={{ border: '1.5px dashed #40406A', color: '#70A0F0', background: 'transparent' }}
          onMouseOver={e => { e.currentTarget.style.background = '#00001A'; e.currentTarget.style.borderColor = '#70A0F0' }}
          onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#40406A' }}
        >
          <Plus size={13} />
          สนทนาใหม่
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        <p className="text-[9px] font-bold uppercase tracking-widest px-2 py-1.5 mt-1" style={{ color: '#8080A5' }}>
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
                background: isActive ? '#0463EF' : 'transparent',
                color: isActive ? '#fff' : '#8080A5',
                boxShadow: isActive ? '0 2px 12px rgba(4,99,239,0.35)' : 'none',
              }}
              onMouseOver={e => { if (!isActive) { e.currentTarget.style.background = '#00001A'; e.currentTarget.style.color = '#B0D0FF' } }}
              onMouseOut={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8080A5' } }}
            >
              <Icon size={15} className="flex-shrink-0" />
              <span className="truncate text-xs font-semibold">{label}</span>
              {isActive && <ChevronRight size={11} className="ml-auto opacity-80" />}
            </button>
          )
        })}

        <div className="my-2" style={{ borderTop: '1px solid #40406A' }} />

        <p className="text-[9px] font-bold uppercase tracking-widest px-2 py-1.5" style={{ color: '#8080A5' }}>
          ประวัติ
        </p>
        {historyItems.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left transition-all"
            style={{
              color: activeItem === id ? '#16EA9E' : '#8080A5',
              background: activeItem === id ? 'rgba(22,234,158,0.08)' : 'transparent',
            }}
            onMouseOver={e => { if (activeItem !== id) { e.currentTarget.style.background = '#00001A'; e.currentTarget.style.color = '#70E5C0' } }}
            onMouseOut={e => { if (activeItem !== id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8080A5' } }}
          >
            <Clock3 size={12} className="flex-shrink-0 opacity-60" />
            <span className="truncate font-mono text-[10px]">{label}</span>
          </button>
        ))}
      </nav>

      {/* Settings */}
      <div className="px-3 pb-3 pt-2" style={{ borderTop: '1px solid #40406A' }}>
        <button
          onClick={() => onSelect('settings')}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-all"
          style={{ color: activeItem === 'settings' ? '#B0D0FF' : '#8080A5' }}
          onMouseOver={e => { e.currentTarget.style.background = '#00001A'; e.currentTarget.style.color = '#B0D0FF' }}
          onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = activeItem === 'settings' ? '#B0D0FF' : '#8080A5' }}
        >
          <Settings size={14} />
          <span className="text-xs font-semibold">ตั้งค่า</span>
        </button>
      </div>
    </aside>
  )
}
