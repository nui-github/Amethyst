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

const TOOLS = [
  { id: 'chatbot',   label: 'Chatbot',    icon: MessageSquareText, expandable: true },
  { id: 'queue',     label: 'คิวงาน',    icon: ListChecks,        expandable: false },
  { id: 'dashboard', label: 'Dashboard',  icon: LayoutDashboard,   expandable: false },
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

function NavItem({
  id, label, icon: Icon, isActive, badge, expandable, expanded, onToggleExpand, onClick,
}: {
  id: string; label: string; icon: React.ElementType
  isActive: boolean; badge?: number
  expandable?: boolean; expanded?: boolean
  onToggleExpand?: () => void; onClick: () => void
}) {
  return (
    <button
      onClick={expandable ? onToggleExpand : onClick}
      className="w-full flex items-center gap-2.5 rounded-lg text-left transition-all duration-100"
      style={{
        padding: '6px 8px',
        background: isActive ? L.activeBg : 'transparent',
        color: isActive ? L.activeText : L.text,
      }}
      onMouseOver={e => { if (!isActive) { e.currentTarget.style.background = L.hover; e.currentTarget.style.color = L.textDark } }}
      onMouseOut={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isActive ? L.activeText : L.text } }}
    >
      <Icon size={15} className="flex-shrink-0" />
      <span className="flex-1 text-[13px] font-medium truncate">{label}</span>
      {badge != null && badge > 0 && (
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
          style={{ background: '#DC2626', color: '#fff', minWidth: 18, textAlign: 'center' }}>
          {badge}
        </span>
      )}
      {expandable && (
        expanded
          ? <ChevronDown size={13} className="flex-shrink-0 opacity-50" />
          : <ChevronRight size={13} className="flex-shrink-0 opacity-50" />
      )}
    </button>
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

export function Sidebar({ activeItem, onSelect, needsYouCount = 0, collapsed = false }: SidebarProps) {
  const [chatbotExpanded, setChatbotExpanded] = useState(true)

  if (collapsed) return null

  return (
    <aside
      className="flex-shrink-0 flex flex-col h-full overflow-hidden"
      style={{ width: 224, background: L.bg, borderRight: `1px solid ${L.border}` }}
    >
      {/* Company header */}
      <div className="flex items-center gap-2.5 px-3 py-3.5 flex-shrink-0"
        style={{ borderBottom: `1px solid ${L.border}` }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #010136, #0463EF)', boxShadow: '0 2px 8px rgba(4,99,239,0.3)' }}>
          <Bot size={14} color="#fff" strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold leading-tight truncate" style={{ color: L.textDark }}>ShippingNet</p>
          <p className="text-[11px] leading-tight truncate" style={{ color: L.label }}>Assistant</p>
        </div>
        <ChevronDown size={13} className="flex-shrink-0" style={{ color: L.label }} />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-2">

        {/* Tools section */}
        <SectionLabel label="เครื่องมือ" />

        {/* Chatbot — expandable */}
        <NavItem
          id="chatbot" label="Chatbot" icon={MessageSquareText}
          isActive={activeItem === 'chatbot'}
          expandable expanded={chatbotExpanded}
          onToggleExpand={() => setChatbotExpanded(v => !v)}
          onClick={() => onSelect('chatbot')}
        />

        {chatbotExpanded && (
          <div className="ml-5 mt-0.5 space-y-0.5">
            <button
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-all"
              style={{ color: L.label, fontSize: 12 }}
              onClick={() => onSelect('chatbot')}
              onMouseOver={e => { e.currentTarget.style.background = L.hover; e.currentTarget.style.color = L.textDark }}
              onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = L.label }}
            >
              <Plus size={11} className="flex-shrink-0 opacity-60" />
              สนทนาใหม่
            </button>
            {HISTORY.map(({ id, label }) => (
              <button key={id}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-all"
                style={{
                  fontSize: 12,
                  color: activeItem === id ? L.activeText : L.label,
                  background: activeItem === id ? L.activeBg : 'transparent',
                }}
                onClick={() => onSelect(id)}
                onMouseOver={e => { if (activeItem !== id) { e.currentTarget.style.background = L.hover; e.currentTarget.style.color = L.textDark } }}
                onMouseOut={e => { if (activeItem !== id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = L.label } }}
              >
                <Clock3 size={11} className="flex-shrink-0 opacity-50" />
                <span className="truncate font-mono">{label}</span>
              </button>
            ))}
          </div>
        )}

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

        {/* Docs section */}
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

        {/* More */}
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
