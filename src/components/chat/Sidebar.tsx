'use client'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import {
  MessageSquareText, FileCheck2, Package, FileText,
  Clock3, Settings, Plus,
  BarChart2, LayoutDashboard, ListChecks,
  PanelLeftClose, PanelLeftOpen,
} from 'lucide-react'

interface SidebarProps {
  activeItem: string
  onSelect: (id: string) => void
  needsYouCount?: number
}

const mainItems = [
  { id: 'chatbot',   label: 'Chatbot',    tooltip: 'แชทบอท',           icon: MessageSquareText },
  { id: 'queue',     label: 'คิวงาน',    tooltip: 'คิวงาน',           icon: ListChecks },
  { id: 'dashboard', label: 'Dashboard',  tooltip: 'แดชบอร์ด',         icon: LayoutDashboard },
  { id: 'license',   label: 'ใบอนุญาต',  tooltip: 'ใบอนุญาต',         icon: FileCheck2 },
  { id: 'rgoods',    label: 'RGoods',     tooltip: 'สร้าง RGoods',     icon: Package },
  { id: 'customs',   label: 'ใบขน',       tooltip: 'ใบขนสินค้า',       icon: FileText },
  { id: 'analytics', label: 'Analytics',  tooltip: 'วิเคราะห์ข้อมูล',  icon: BarChart2 },
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

function TooltipPortal({ label, y }: { label: string; y: number }) {
  return createPortal(
    <div
      className="pointer-events-none whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-semibold shadow-lg"
      style={{
        position: 'fixed',
        left: 68,
        top: y,
        transform: 'translateY(-50%)',
        background: '#1A1A2E',
        color: '#fff',
        letterSpacing: '0.01em',
        zIndex: 9999,
      }}
    >
      <span
        className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent"
        style={{ borderRightColor: '#1A1A2E' }}
      />
      {label}
    </div>,
    document.body,
  )
}

export function Sidebar({ activeItem, onSelect, needsYouCount = 0 }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [tooltip, setTooltip] = useState<{ id: string; y: number } | null>(null)

  const allTooltips = [
    ...mainItems.map(({ id, tooltip }) => ({ id, label: tooltip })),
    { id: 'settings', label: 'ตั้งค่า' },
  ]

  return (
    <aside
      className="flex-shrink-0 flex flex-col transition-all duration-200"
      style={{
        width: collapsed ? 56 : 224,
        background: L.bg,
        borderRight: `1px solid ${L.border}`,
        overflow: 'hidden',
      }}
    >
      {collapsed && tooltip && (() => {
        const tip = allTooltips.find(t => t.id === tooltip.id)
        return tip ? <TooltipPortal label={tip.label} y={tooltip.y} /> : null
      })()}
      {/* Top bar: new chat + collapse toggle */}
      <div className="flex-shrink-0 px-2 pt-3 pb-1 flex items-center gap-1">
        {!collapsed && (
          <button
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-colors"
            style={{ border: `1.5px dashed ${L.borderDash}`, color: L.text, background: 'transparent' }}
            onMouseOver={e => { e.currentTarget.style.background = L.hover; e.currentTarget.style.borderColor = '#0463EF'; e.currentTarget.style.color = '#0463EF' }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = L.borderDash; e.currentTarget.style.color = L.text }}
          >
            <Plus size={13} />
            สนทนาใหม่
          </button>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl transition-colors"
          style={{ color: L.label }}
          onMouseOver={e => { e.currentTarget.style.background = L.hover; e.currentTarget.style.color = L.textDark }}
          onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = L.label }}
        >
          {collapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-1.5 py-2 space-y-0.5 overflow-y-auto overflow-x-visible">
        {!collapsed && (
          <p className="text-[9px] font-bold uppercase tracking-widest px-2 py-1.5 mt-1 whitespace-nowrap" style={{ color: L.label }}>
            เมนูหลัก
          </p>
        )}

        {mainItems.map(({ id, label, tooltip: tipLabel, icon: Icon }) => {
          const isActive = activeItem === id
          return (
            <div key={id} className="relative"
              onMouseEnter={e => collapsed && setTooltip({ id, y: e.currentTarget.getBoundingClientRect().top + e.currentTarget.getBoundingClientRect().height / 2 })}
              onMouseLeave={() => setTooltip(null)}
            >
              <button
                onClick={() => onSelect(id)}
                className="w-full flex items-center gap-2.5 rounded-xl text-left transition-all duration-150"
                style={{
                  padding: collapsed ? '8px 0' : '8px 10px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  background: isActive ? L.activeBg : 'transparent',
                  color: isActive ? L.activeText : L.text,
                }}
                onMouseOver={e => { if (!isActive) { e.currentTarget.style.background = L.hover; e.currentTarget.style.color = L.textDark } }}
                onMouseOut={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = L.text } }}
              >
                <div className="relative flex-shrink-0">
                  <Icon size={15} />
                  {collapsed && id === 'queue' && needsYouCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 flex items-center justify-center rounded-full text-[8px] font-bold"
                      style={{ background: '#DC2626', color: '#fff' }}>
                      {needsYouCount}
                    </span>
                  )}
                </div>
                {!collapsed && (
                  <>
                    <span className="truncate text-xs font-semibold flex-1 whitespace-nowrap">{label}</span>
                    {id === 'queue' && needsYouCount > 0 && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: '#DC2626', color: '#fff', minWidth: 16, textAlign: 'center' }}>
                        {needsYouCount}
                      </span>
                    )}
                  </>
                )}
              </button>
            </div>
          )
        })}

        {!collapsed && (
          <>
            <div className="my-2 mx-2" style={{ borderTop: `1px solid ${L.border}` }} />
            <p className="text-[9px] font-bold uppercase tracking-widest px-2 py-1.5 whitespace-nowrap" style={{ color: L.label }}>
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
          </>
        )}
      </nav>

      {/* Settings */}
      <div className="flex-shrink-0" style={{ borderTop: `1px solid ${L.border}`, padding: collapsed ? '12px 6px' : '17px 8px' }}>
        <div className="relative"
          onMouseEnter={e => collapsed && setTooltip({ id: 'settings', y: e.currentTarget.getBoundingClientRect().top + e.currentTarget.getBoundingClientRect().height / 2 })}
          onMouseLeave={() => setTooltip(null)}
        >
          <button
            onClick={() => onSelect('settings')}
            className="w-full h-10 flex items-center rounded-xl transition-all"
            style={{
              gap: collapsed ? 0 : 10,
              paddingLeft: collapsed ? 0 : 10,
              justifyContent: collapsed ? 'center' : 'flex-start',
              color: activeItem === 'settings' ? L.activeText : L.text,
            }}
            onMouseOver={e => { e.currentTarget.style.background = L.hover; e.currentTarget.style.color = L.textDark }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = activeItem === 'settings' ? L.activeText : L.text }}
          >
            <Settings size={14} className="flex-shrink-0" />
            {!collapsed && <span className="text-xs font-semibold">ตั้งค่า</span>}
          </button>
        </div>
      </div>
    </aside>
  )
}
