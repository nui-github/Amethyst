'use client'
import { Bell, Zap, User, Activity } from 'lucide-react'

export function ChatHeader() {
  return (
    <header
      className="h-14 flex items-center px-5 gap-4 flex-shrink-0 z-10"
      style={{ background: '#fff', borderBottom: '1px solid #E0E0E0' }}
    >
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
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full flex-shrink-0"
        style={{
          background: 'rgba(22,234,158,0.10)',
          border: '1px solid rgba(22,234,158,0.35)',
        }}
      >
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: '#16EA9E', animation: 'pulse-dot 2s ease-in-out infinite' }}
        />
        <span className="text-[11px] font-semibold whitespace-nowrap" style={{ color: '#0D8F61' }}>
          เชื่อมต่อ SPN แล้ว
        </span>
      </div>

      {/* Action icons */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
          style={{ color: '#999999' }}
          onMouseOver={e => { e.currentTarget.style.background = '#F0F0F0'; e.currentTarget.style.color = '#0463EF' }}
          onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#999999' }}
        >
          <Bell size={16} />
        </button>
        <button
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
          style={{ color: '#999999' }}
          onMouseOver={e => { e.currentTarget.style.background = '#F0F0F0'; e.currentTarget.style.color = '#0463EF' }}
          onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#999999' }}
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
