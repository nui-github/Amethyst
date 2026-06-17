'use client'
import { Bell, User, Activity, Bot, Unplug } from 'lucide-react'
import { useState } from 'react'

interface ChatHeaderProps {
  isConnected: boolean
  onDisconnect: () => void
  onConnectClick: () => void
}

export function ChatHeader({ isConnected, onDisconnect, onConnectClick }: ChatHeaderProps) {
  const [disconnectHover, setDisconnectHover] = useState(false)
  return (
    <header
      className="h-14 flex items-center px-4 gap-4 flex-shrink-0 z-10 w-full"
      style={{ background: '#FFFFFF', borderBottom: '1px solid #E8E8E8' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #0463EF 0%, #16EA9E 100%)', boxShadow: '0 3px 12px rgba(4,99,239,0.35)' }}
        >
          <Bot size={17} color="#fff" strokeWidth={1.75} />
        </div>
        <div>
          <p className="text-xs font-bold leading-tight" style={{ color: '#010136' }}>ShippingNet</p>
          <p className="text-[10px] font-medium leading-tight" style={{ color: '#0463EF' }}>Assistant</p>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-6 flex-shrink-0" style={{ background: '#E8E8E8' }} />

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-bold truncate" style={{ color: '#010136' }}>
          ShippingNet Assistant
        </h1>
        <p className="text-[11px] truncate" style={{ color: '#999999' }}>
          ระบบสร้างใบอนุญาต / RGoods &amp; Customs
        </p>
      </div>

      {/* Status pill */}
      {isConnected ? (
        <button
          onClick={onDisconnect}
          onMouseEnter={() => setDisconnectHover(true)}
          onMouseLeave={() => setDisconnectHover(false)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full flex-shrink-0 transition-all"
          style={{
            background: disconnectHover ? 'rgba(220,38,38,0.08)' : 'rgba(22,234,158,0.10)',
            border: disconnectHover ? '1px solid rgba(220,38,38,0.35)' : '1px solid rgba(22,234,158,0.35)',
            cursor: 'pointer',
          }}
        >
          {disconnectHover ? (
            <Unplug size={11} style={{ color: '#DC2626', flexShrink: 0 }} />
          ) : (
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: '#16EA9E', animation: 'pulse-dot 2s ease-in-out infinite' }}
            />
          )}
          <span
            className="text-[11px] font-semibold whitespace-nowrap"
            style={{ color: disconnectHover ? '#DC2626' : '#0D8F61' }}
          >
            {disconnectHover ? 'Disconnect' : 'เชื่อมต่อ SPN แล้ว'}
          </span>
        </button>
      ) : (
        <button
          onClick={onConnectClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full flex-shrink-0 transition-all"
          style={{
            background: 'rgba(153,153,153,0.10)',
            border: '1px solid rgba(153,153,153,0.30)',
            cursor: 'pointer',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(4,99,239,0.08)'
            e.currentTarget.style.borderColor = 'rgba(4,99,239,0.35)'
            e.currentTarget.querySelector('span:first-child')!.setAttribute('style', 'width:8px;height:8px;border-radius:9999px;flex-shrink:0;background:#0463EF')
            e.currentTarget.querySelector('span:last-child')!.setAttribute('style', 'font-size:11px;font-weight:600;white-space:nowrap;color:#0463EF')
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(153,153,153,0.10)'
            e.currentTarget.style.borderColor = 'rgba(153,153,153,0.30)'
            e.currentTarget.querySelector('span:first-child')!.setAttribute('style', 'width:8px;height:8px;border-radius:9999px;flex-shrink:0;background:#CCCCCC')
            e.currentTarget.querySelector('span:last-child')!.setAttribute('style', 'font-size:11px;font-weight:600;white-space:nowrap;color:#999999')
          }}
        >
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#CCCCCC' }} />
          <span className="text-[11px] font-semibold whitespace-nowrap" style={{ color: '#999999' }}>
            ยังไม่เชื่อมต่อ SPN
          </span>
        </button>
      )}

      {/* Action icons */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
          style={{ color: '#999999' }}
          onMouseOver={e => { e.currentTarget.style.background = '#E6E9FF'; e.currentTarget.style.color = '#0463EF' }}
          onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8892B8' }}
        >
          <Bell size={16} />
        </button>
        <button
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
          style={{ color: '#8892B8' }}
          onMouseOver={e => { e.currentTarget.style.background = '#E6E9FF'; e.currentTarget.style.color = '#0463EF' }}
          onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8892B8' }}
        >
          <Activity size={16} />
        </button>

        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-xl ml-1 flex items-center justify-center text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #010136 0%, #0463EF 100%)', boxShadow: '0 2px 10px rgba(4,99,239,0.3)' }}
        >
          <User size={14} />
        </div>
      </div>
    </header>
  )
}
