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

      {/* Settings + BizX */}
      <div className="flex-shrink-0 flex flex-col items-center py-2 gap-1">
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
        <div style={{ height: 1, background: L.border, width: '75%' }} />
        <a
          href="https://bizx-uat.devnetbay.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 flex items-center justify-center rounded-lg transition-all"
          onMouseOver={e => { e.currentTarget.style.background = L.hover }}
          onMouseOut={e => { e.currentTarget.style.background = 'transparent' }}
        >
          <svg width="20" height="22" viewBox="332 0 446 496" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M595 143L645 74.5H675L363.5 496H332L495.5 274.5L452 74.5H579L595 143ZM777.5 0L612.5 220L655 422H528L514 355.5L462.5 422H432L746 0H777.5Z" fill="url(#bizx_grad_rail)"/>
            <defs>
              <linearGradient id="bizx_grad_rail" x1="730.169" y1="496.006" x2="304.246" y2="79.8729" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0463EF"/>
                <stop offset="1" stopColor="#16EA9E"/>
              </linearGradient>
            </defs>
          </svg>
        </a>
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
      <div className="flex-shrink-0 px-2 py-2">
        <NavItem
          id="settings" label="ตั้งค่า" icon={Settings}
          isActive={activeItem === 'settings'}
          onClick={() => onSelect('settings')}
        />
        {/* Divider */}
        <div style={{ height: 1, background: L.border, margin: '8px 0' }} />
        {/* BizX logo button */}
        <a
          href="https://bizx-uat.devnetbay.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full rounded-lg transition-all"
          style={{ padding: '6px 8px' }}
          onMouseOver={e => { e.currentTarget.style.background = L.hover }}
          onMouseOut={e => { e.currentTarget.style.background = 'transparent' }}
        >
          <svg width="72" height="46" viewBox="0 0 778 496" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M595 143L645 74.5H675L363.5 496H332L495.5 274.5L452 74.5H579L595 143ZM777.5 0L612.5 220L655 422H528L514 355.5L462.5 422H432L746 0H777.5Z" fill="url(#bizx_grad_side)"/>
            <path d="M315.245 307.751H383.721V347.649H261.2V309.166L326.847 229.655H261.766V189.758H382.307V228.24L315.245 307.751Z" fill="#010136"/>
            <path d="M210.855 173.347C202.367 173.347 195.387 170.895 189.916 165.99C184.635 160.897 181.994 154.672 181.994 147.315C181.994 139.77 184.635 133.544 189.916 128.64C195.387 123.547 202.367 121 210.855 121C219.155 121 225.946 123.547 231.228 128.64C236.699 133.544 239.434 139.77 239.434 147.315C239.434 154.672 236.699 160.897 231.228 165.99C225.946 170.895 219.155 173.347 210.855 173.347ZM234.907 189.759V347.65H186.521V189.759H234.907Z" fill="#010136"/>
            <path d="M120.257 245.787C131.764 248.24 141.008 253.993 147.987 263.048C154.967 271.914 158.457 282.1 158.457 293.607C158.457 310.208 152.609 323.412 140.913 333.222C129.406 342.842 113.278 347.652 92.5274 347.652H0V149.016H89.4149C109.599 149.016 125.351 153.637 136.669 162.881C148.176 172.124 153.929 184.668 153.929 200.514C153.929 212.21 150.817 221.925 144.592 229.659C138.555 237.393 130.444 242.769 120.257 245.787ZM48.3859 229.376H80.0772C88.0001 229.376 94.0365 227.678 98.1866 224.283C102.525 220.698 104.695 215.511 104.695 208.72C104.695 201.929 102.525 196.741 98.1866 193.157C94.0365 189.573 88.0001 187.781 80.0772 187.781H48.3859V229.376ZM84.0387 308.604C92.1501 308.604 98.3752 306.812 102.714 303.228C107.241 299.455 109.505 294.079 109.505 287.099C109.505 280.12 107.147 274.649 102.431 270.688C97.9036 266.726 91.5842 264.746 83.4727 264.746H48.3859V308.604H84.0387Z" fill="#010136"/>
            <defs>
              <linearGradient id="bizx_grad_side" x1="730.169" y1="496.006" x2="304.246" y2="79.8729" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0463EF"/>
                <stop offset="1" stopColor="#16EA9E"/>
              </linearGradient>
            </defs>
          </svg>
        </a>
      </div>
    </aside>
  )
}
