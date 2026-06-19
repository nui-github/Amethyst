'use client'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import {
  MessageSquareText, FileCheck2, Package, FileText,
  Settings, ChevronDown, ChevronRight,
  BarChart2, LayoutDashboard, ListChecks, Bot,
  Clock3, Plus, MoreHorizontal,
} from 'lucide-react'

interface SidebarProps {
  activeItem: string
  onSelect: (id: string) => void
  needsYouCount?: number
  collapsed?: boolean
}

const L = {
  bg:         '#FFFFFF',
  border:     '#E8E8E8',
  label:      '#999999',
  text:       '#555555',
  textDark:   '#111111',
  hover:      '#F5F5F7',
  activeText: '#0463EF',
  activeBg:   'rgba(4,99,239,0.07)',
}

const ALL_NAV = [
  { id: 'chatbot',   label: 'Chatbot',    icon: MessageSquareText },
  { id: 'queue',     label: 'คิวงาน',    icon: ListChecks },
  { id: 'dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { id: 'license',   label: 'ใบอนุญาต',  icon: FileCheck2 },
  { id: 'rgoods',    label: 'RGoods',     icon: Package },
  { id: 'customs',   label: 'ใบขน',       icon: FileText },
  { id: 'analytics', label: 'Analytics',  icon: BarChart2 },
  { id: 'settings',  label: 'ตั้งค่า',    icon: Settings },
]

const DOCS = [
  { id: 'license',   label: 'ใบอนุญาต',  icon: FileCheck2 },
  { id: 'rgoods',    label: 'RGoods',     icon: Package },
  { id: 'customs',   label: 'ใบขน',       icon: FileText },
  { id: 'analytics', label: 'Analytics',  icon: BarChart2 },
]

const HISTORY = [
  { id: 'HTHM000000003', label: 'HTHM000000003' },
  { id: 'HTHM000000001', label: 'HTHM000000001' },
]

// Tooltip rendered via portal so it escapes the narrow sidebar
function Tooltip({ label, anchorY }: { label: string; anchorY: number }) {
  return createPortal(
    <div
      className="pointer-events-none"
      style={{
        position: 'fixed',
        left: 52,
        top: anchorY,
        transform: 'translateY(-50%)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: 0,
      }}
    >
      {/* Arrow */}
      <div style={{
        width: 0, height: 0,
        borderTop: '5px solid transparent',
        borderBottom: '5px solid transparent',
        borderRight: '6px solid #1A1A2E',
      }} />
      {/* Label */}
      <div style={{
        background: '#1A1A2E',
        color: '#fff',
        fontSize: 12,
        fontWeight: 600,
        padding: '5px 10px',
        borderRadius: 8,
        whiteSpace: 'nowrap',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        letterSpacing: '0.01em',
      }}>
        {label}
      </div>
    </div>,
    document.body,
  )
}

function NavItem({
  id, label, icon: Icon, isActive, badge, expandable, expanded, onToggleExpand, onClick,
}: {
  id: string; label: string; icon: React.ElementType
  isActive: boolean; badge?: number
  expandable?: boolean; expanded?: boolean
  onToggleExpand?: () => void; onClick: () => void
}) {
  const baseStyle = {
    padding: '6px 8px',
    background: isActive ? L.activeBg : 'transparent',
    color: isActive ? L.activeText : L.text,
  }
  return (
    <div
      className="w-full flex items-center gap-2.5 rounded-lg transition-all duration-100"
      style={baseStyle}
      onMouseOver={e => { if (!isActive) { e.currentTarget.style.background = L.hover; e.currentTarget.style.color = L.textDark } }}
      onMouseOut={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isActive ? L.activeText : L.text } }}
    >
      <button onClick={onClick} className="flex items-center gap-2.5 flex-1 text-left min-w-0">
        <Icon size={15} className="flex-shrink-0" />
        <span className="flex-1 text-[13px] font-medium truncate">{label}</span>
      </button>
      {badge != null && badge > 0 && (
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
          style={{ background: '#DC2626', color: '#fff', minWidth: 18, textAlign: 'center' }}>
          {badge}
        </span>
      )}
      {expandable && (
        <button onClick={onToggleExpand} className="flex-shrink-0 p-0.5 opacity-50 hover:opacity-100">
          {expanded
            ? <ChevronDown size={13} />
            : <ChevronRight size={13} />}
        </button>
      )}
    </div>
  )
}

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-[11px] font-semibold px-2 pt-4 pb-1 tracking-wide uppercase truncate"
      style={{ color: L.label }}>
      {label}
    </p>
  )
}

// Icon-rail shown when sidebar is collapsed
function CollapsedRail({
  activeItem, onSelect, needsYouCount,
}: { activeItem: string; onSelect: (id: string) => void; needsYouCount: number }) {
  const [tooltip, setTooltip] = useState<{ id: string; y: number } | null>(null)
  const tip = tooltip ? ALL_NAV.find(n => n.id === tooltip.id) : null

  return (
    <aside
      className="flex-shrink-0 flex flex-col h-full"
      style={{ width: 48, background: L.bg, borderRight: `1px solid ${L.border}` }}
    >
      {tip && <Tooltip label={tip.label} anchorY={tooltip!.y} />}

      {/* Logo icon */}
      <div className="flex items-center justify-center h-12 flex-shrink-0"
        style={{ borderBottom: `1px solid ${L.border}` }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(90deg, #0463EF, #16EA9E)' }}>
          <Bot size={14} color="#fff" strokeWidth={1.75} />
        </div>
      </div>

      {/* Icons */}
      <nav className="flex-1 flex flex-col items-center py-2 gap-0.5 overflow-y-auto">
        {ALL_NAV.filter(n => n.id !== 'settings').map(({ id, icon: Icon }) => {
          const isActive = activeItem === id
          return (
            <div key={id} className="relative w-full flex justify-center"
              onMouseEnter={e => {
                const rect = e.currentTarget.getBoundingClientRect()
                setTooltip({ id, y: rect.top + rect.height / 2 })
              }}
              onMouseLeave={() => setTooltip(null)}
            >
              <button
                onClick={() => onSelect(id)}
                className="relative w-9 h-9 flex items-center justify-center rounded-lg transition-all"
                style={{
                  background: isActive ? L.activeBg : 'transparent',
                  color: isActive ? L.activeText : L.text,
                }}
                onMouseOver={e => { if (!isActive) { e.currentTarget.style.background = L.hover; e.currentTarget.style.color = L.textDark } }}
                onMouseOut={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isActive ? L.activeText : L.text } }}
              >
                <Icon size={15} />
                {id === 'queue' && needsYouCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 flex items-center justify-center rounded-full text-[8px] font-bold"
                    style={{ background: '#DC2626', color: '#fff' }}>
                    {needsYouCount}
                  </span>
                )}
              </button>
            </div>
          )
        })}
      </nav>

      {/* Settings */}
      <div className="flex-shrink-0 flex justify-center py-2" style={{ borderTop: `1px solid ${L.border}` }}>
        <div className="relative w-full flex justify-center"
          onMouseEnter={e => {
            const rect = e.currentTarget.getBoundingClientRect()
            setTooltip({ id: 'settings', y: rect.top + rect.height / 2 })
          }}
          onMouseLeave={() => setTooltip(null)}
        >
          <button
            onClick={() => onSelect('settings')}
            className="w-9 h-9 flex items-center justify-center rounded-lg transition-all"
            style={{ color: activeItem === 'settings' ? L.activeText : L.text }}
            onMouseOver={e => { e.currentTarget.style.background = L.hover; e.currentTarget.style.color = L.textDark }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = activeItem === 'settings' ? L.activeText : L.text }}
          >
            <Settings size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}

export function Sidebar({ activeItem, onSelect, needsYouCount = 0, collapsed = false }: SidebarProps) {
  const [chatbotExpanded, setChatbotExpanded] = useState(true)

  if (collapsed) {
    return <CollapsedRail activeItem={activeItem} onSelect={onSelect} needsYouCount={needsYouCount} />
  }

  return (
    <aside
      className="flex-shrink-0 flex flex-col h-full overflow-hidden"
      style={{ width: 224, background: L.bg, borderRight: `1px solid ${L.border}` }}
    >
      {/* Company header — h-12 to match content breadcrumb bar */}
      <div className="flex items-center gap-2.5 px-3 h-12 flex-shrink-0"
        style={{ borderBottom: `1px solid ${L.border}` }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(90deg, #0463EF, #16EA9E)', boxShadow: '0 2px 8px rgba(4,99,239,0.3)' }}>
          <Bot size={14} color="#fff" strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold leading-tight truncate" style={{ color: L.textDark }}>Netbay Agent</p>
          <p className="text-[11px] leading-tight truncate" style={{ color: L.label }}>Assistant</p>
        </div>
        <ChevronDown size={13} className="flex-shrink-0" style={{ color: L.label }} />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-2">
        {/* New Chat button */}
        <button
          onClick={() => onSelect('chatbot')}
          className="w-full flex items-center gap-2 rounded-lg mb-2 transition-all"
          style={{ padding: '7px 8px', background: 'transparent', color: L.text, border: `1px solid ${L.border}` }}
          onMouseOver={e => { e.currentTarget.style.background = L.hover; e.currentTarget.style.color = L.textDark }}
          onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = L.text }}
        >
          <Plus size={13} className="flex-shrink-0" />
          <span className="text-[13px] font-medium">New Chat</span>
        </button>

        <SectionLabel label="เครื่องมือ" />

        {/* Chatbot */}
        <NavItem
          id="chatbot" label="Chatbot" icon={MessageSquareText}
          isActive={activeItem === 'chatbot'}
          onClick={() => onSelect('chatbot')}
        />


        {/* คิวงาน */}
        <NavItem
          id="queue" label="คิวงาน" icon={ListChecks}
          isActive={activeItem === 'queue'}
          badge={needsYouCount}
          onClick={() => onSelect('queue')}
        />

        {/* Dashboard */}
        <NavItem
          id="dashboard" label="Dashboard" icon={LayoutDashboard}
          isActive={activeItem === 'dashboard'}
          expandable expanded={false}
          onToggleExpand={() => {}}
          onClick={() => onSelect('dashboard')}
        />

        <SectionLabel label="เอกสาร" />

        {DOCS.map(({ id, label, icon }) => (
          <NavItem key={id}
            id={id} label={label} icon={icon}
            isActive={activeItem === id}
            expandable expanded={false}
            onToggleExpand={() => {}}
            onClick={() => onSelect(id)}
          />
        ))}

        <button
          className="w-full flex items-center gap-2.5 rounded-lg text-left transition-all mt-0.5"
          style={{ padding: '6px 8px', color: L.label }}
          onMouseOver={e => { e.currentTarget.style.background = L.hover; e.currentTarget.style.color = L.textDark }}
          onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = L.label }}
        >
          <MoreHorizontal size={15} className="flex-shrink-0" />
          <span className="text-[13px] font-medium">More</span>
        </button>
      </nav>

      {/* Settings footer */}
      <div className="flex-shrink-0 px-2 py-2" style={{ borderTop: `1px solid ${L.border}` }}>
        <NavItem
          id="settings" label="ตั้งค่า" icon={Settings}
          isActive={activeItem === 'settings'}
          onClick={() => onSelect('settings')}
        />
      </div>
    </aside>
  )
}
