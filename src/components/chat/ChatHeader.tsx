'use client'
import { Bell, User, Activity, Unplug, PanelLeftClose, PanelLeftOpen, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'

interface ChatHeaderProps {
  isConnected: boolean
  onDisconnect: () => void
  onConnectClick: () => void
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
  currentPage: string
}

const PAGE_LABELS: Record<string, string> = {
  chatbot:   'Chatbot',
  queue:     'คิวงาน',
  dashboard: 'Dashboard',
  license:   'ใบอนุญาต',
  rgoods:    'RGoods',
  customs:   'ใบขน',
  analytics: 'Analytics',
  settings:  'ตั้งค่า',
}

export function ChatHeader({
  isConnected, onDisconnect, onConnectClick,
  sidebarCollapsed, onToggleSidebar, currentPage,
}: ChatHeaderProps) {
  const [hover, setHover] = useState(false)
  useEffect(() => { setHover(false) }, [isConnected])

  const pageLabel = PAGE_LABELS[currentPage] ?? currentPage

  return (
    <header
      className="h-12 flex items-center px-3 gap-3 flex-shrink-0"
      style={{ background: '#FFFFFF', borderBottom: '1px solid #E8E8E8' }}
    >
      {/* Sidebar toggle */}
      <button
        onClick={onToggleSidebar}
        className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 transition-colors"
        style={{ color: '#AAAAAA' }}
        onMouseOver={e => { e.currentTarget.style.background = '#F5F5F7'; e.currentTarget.style.color = '#333' }}
        onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#AAAAAA' }}
      >
        {sidebarCollapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
      </button>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        <span className="text-[13px] font-medium truncate" style={{ color: '#888888' }}>Netbay Agent</span>
        <ChevronRight size={12} style={{ color: '#CCCCCC', flexShrink: 0 }} />
        <span className="text-[13px] font-semibold truncate" style={{ color: '#111111' }}>{pageLabel}</span>
      </div>

      {/* Connection status */}
      {isConnected ? (
        <button
          onClick={onDisconnect}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full flex-shrink-0 transition-all"
          style={{
            background: hover ? 'rgba(220,38,38,0.08)' : 'rgba(22,234,158,0.10)',
            border: hover ? '1px solid rgba(220,38,38,0.35)' : '1px solid rgba(22,234,158,0.35)',
          }}
        >
          {hover
            ? <Unplug size={10} style={{ color: '#DC2626', flexShrink: 0 }} />
            : <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#16EA9E', animation: 'pulse-dot 2s ease-in-out infinite' }} />
          }
          <span className="text-[11px] font-semibold whitespace-nowrap"
            style={{ color: hover ? '#DC2626' : '#0D8F61' }}>
            {hover ? 'Disconnect' : 'เชื่อมต่อ SPN แล้ว'}
          </span>
        </button>
      ) : (
        <button
          onClick={onConnectClick}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full flex-shrink-0 transition-all"
          style={{
            background: hover ? 'rgba(4,99,239,0.08)' : 'rgba(153,153,153,0.10)',
            border: hover ? '1px solid rgba(4,99,239,0.35)' : '1px solid rgba(153,153,153,0.30)',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: hover ? '#0463EF' : '#CCCCCC', transition: 'background .15s' }} />
          <span className="text-[11px] font-semibold whitespace-nowrap"
            style={{ color: hover ? '#0463EF' : '#999999' }}>
            ยังไม่เชื่อมต่อ SPN
          </span>
        </button>
      )}

      {/* Action icons */}
      <div className="flex items-center gap-0.5 flex-shrink-0">
        <button className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors" style={{ color: '#AAAAAA' }}
          onMouseOver={e => { e.currentTarget.style.background = '#F0F4FF'; e.currentTarget.style.color = '#0463EF' }}
          onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#AAAAAA' }}>
          <Bell size={14} />
        </button>
        <button className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors" style={{ color: '#AAAAAA' }}
          onMouseOver={e => { e.currentTarget.style.background = '#F0F4FF'; e.currentTarget.style.color = '#0463EF' }}
          onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#AAAAAA' }}>
          <Activity size={14} />
        </button>
        <div className="w-7 h-7 rounded-lg ml-0.5 flex items-center justify-center text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #010136, #0463EF)', boxShadow: '0 2px 8px rgba(4,99,239,0.25)' }}>
          <User size={12} />
        </div>
      </div>
    </header>
  )
}
