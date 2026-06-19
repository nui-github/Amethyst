'use client'
import { useState, useEffect, useRef } from 'react'
import {
  ChevronLeft, AlertTriangle, CheckCircle2, Mail, Clock,
  FileCheck2, Search, RotateCcw, Send,
  TrendingUp, Package, Ban, Plus,
} from 'lucide-react'
import { toast as sonnerToast } from 'sonner'
import { AGENCY_LABEL, AGENCY_SHORT, STATUS_META } from '@/lib/mock/queue'
import { OcrProgress } from '@/components/chat/OcrProgress'
import { useOCRFlow }  from '@/hooks/useOCRFlow'
import type { Shipment, ShipmentStatus, ChatMessage } from '@/lib/types'
import { generateId, getTime } from '@/lib/utils'

const STAGE_LABELS = ['','ตรวจรับใบขน','วิเคราะห์ HS','จัดประเภทหน่วยงาน','ร่างใบอนุญาต','ตรวจ flag','ยืนยันร่าง','แจ้งลูกค้า','ยื่นกรม']

function StatusIcon({ s }: { s: ShipmentStatus }) {
  if (s === 'needs_you')      return <AlertTriangle size={13} style={{ color: '#F59E0B' }} />
  if (s === 'email_outbox')   return <Mail size={13} style={{ color: '#3B82F6' }} />
  if (s === 'await_customer') return <Clock size={13} style={{ color: '#7C3AED' }} />
  if (s === 'submitted')      return <CheckCircle2 size={13} style={{ color: '#10B981' }} />
  return <FileCheck2 size={13} style={{ color: '#9CA3AF' }} />
}

function ConfBar({ val, size = 'md' }: { val: number; size?: 'sm' | 'md' }) {
  const h = size === 'sm' ? 4 : 6
  const color = val >= 85 ? '#10B981' : val >= 70 ? '#F59E0B' : val === 0 ? '#E5E7EB' : '#EF4444'
  return (
    <div className="flex items-center gap-1.5">
      <div style={{ height: h, width: size === 'sm' ? 48 : 64, background: '#E5E7EB', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${val}%`, background: color, borderRadius: 99, transition: 'width .4s' }} />
      </div>
      <span style={{ fontSize: 11, color: val === 0 ? '#9CA3AF' : color, fontWeight: 600 }}>{val > 0 ? `${val}%` : '—'}</span>
    </div>
  )
}

// ── Dashboard Strip ───────────────────────────────────────────────────────────

const STAT_CARDS = [
  { key: 'needs_you'      as ShipmentStatus, label: 'รอคุณยืนยัน',       icon: AlertTriangle, iconColor: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A', text: '#B45309', dot: '#F59E0B' },
  { key: 'email_outbox'   as ShipmentStatus, label: 'ร่างอีเมลรอส่ง',    icon: Mail,          iconColor: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE', text: '#1D4ED8', dot: '#3B82F6' },
  { key: 'await_customer' as ShipmentStatus, label: 'รอลูกค้ายืนยัน',    icon: Clock,         iconColor: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE', text: '#6D28D9', dot: '#7C3AED' },
  { key: 'submitted'      as ShipmentStatus, label: 'ยื่นกรมแล้ว',        icon: CheckCircle2,  iconColor: '#10B981', bg: '#ECFDF5', border: '#BBF7D0', text: '#065F46', dot: '#10B981' },
  { key: 'no_permit'      as ShipmentStatus, label: 'ไม่ต้องขอใบอนุญาต', icon: Ban,           iconColor: '#9CA3AF', bg: '#F3F4F6', border: '#E5E7EB', text: '#6B7280', dot: '#9CA3AF' },
]

function DashboardStrip({
  queue, activeFilter, onFilter,
}: { queue: Shipment[]; activeFilter: ShipmentStatus | 'all'; onFilter: (k: ShipmentStatus | 'all') => void }) {
  const today = new Date().toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const total  = queue.length

  return (
    <div className="flex-shrink-0" style={{ background: '#fff', borderBottom: '1px solid #E5E7EB' }}>
      <div className="px-6 pt-5 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold mb-1" style={{ color: '#010136' }}>คิวงานขอใบอนุญาต</h1>
          <p className="text-xs" style={{ color: '#9CA3AF' }}>{today}</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
          style={{ background: '#0463EF', color: '#fff' }}
        >
          <Plus size={14} />
          เพิ่มรายการ
        </button>
      </div>

      <div className="px-6 pb-4 grid gap-3" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
        <button
          onClick={() => onFilter('all')}
          className="flex items-center gap-2.5 px-4 py-3 rounded-xl transition-all w-full"
          style={{
            background: activeFilter === 'all' ? '#010136' : '#F9FAFB',
            border: `1px solid ${activeFilter === 'all' ? '#010136' : '#E5E7EB'}`,
          }}
        >
          <Package size={15} style={{ color: activeFilter === 'all' ? '#16EA9E' : '#9CA3AF', flexShrink: 0 }} />
          <div className="text-left">
            <p className="text-lg font-bold leading-none" style={{ color: activeFilter === 'all' ? '#fff' : '#010136' }}>{total}</p>
            <p className="text-[10px] mt-0.5" style={{ color: activeFilter === 'all' ? '#8080A5' : '#9CA3AF' }}>ทั้งหมด</p>
          </div>
        </button>

        {STAT_CARDS.map(({ key, label, icon: Icon, iconColor, bg, border, text, dot }) => {
          const count = queue.filter(s => s.statusKey === key).length
          const isActive = activeFilter === key
          return (
            <button
              key={key}
              onClick={() => onFilter(key)}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl transition-all w-full"
              style={{
                background: isActive ? bg : '#F9FAFB',
                border: `1px solid ${isActive ? border : '#E5E7EB'}`,
                boxShadow: isActive ? `0 0 0 2px ${dot}30` : 'none',
              }}
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: isActive ? bg : '#F0F0F0' }}>
                <Icon size={14} style={{ color: isActive ? iconColor : '#9CA3AF' }} />
              </div>
              <div className="text-left">
                <p className="text-lg font-bold leading-none" style={{ color: isActive ? text : '#374151' }}>{count}</p>
                <p className="text-[10px] mt-0.5 whitespace-nowrap" style={{ color: isActive ? text : '#9CA3AF' }}>{label}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── List view ────────────────────────────────────────────────────────────────

function ListView({
  queue, filter, onSelect, selectedId,
}: { queue: Shipment[]; filter: ShipmentStatus | 'all'; onSelect: (id: string) => void; selectedId?: string | null }) {
  const [search, setSearch] = useState('')

  const rows = queue.filter(s => {
    if (filter !== 'all' && s.statusKey !== filter) return false
    if (!search) return true
    const q = search.toLowerCase()
    return (
      s.id.toLowerCase().includes(q) ||
      s.customsNo.toLowerCase().includes(q) ||
      s.customer.toLowerCase().includes(q) ||
      s.goods.toLowerCase().includes(q) ||
      (s.hthmRef ?? '').toLowerCase().includes(q)
    )
  })

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-3 flex-shrink-0" style={{ borderBottom: '1px solid #F3F4F6' }}>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
          <Search size={13} style={{ color: '#9CA3AF', flexShrink: 0 }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="ค้นหา ref, ผู้นำเข้า, สินค้า..." className="flex-1 text-sm bg-transparent outline-none"
            style={{ color: '#374151' }}
          />
        </div>
      </div>

      <div className="px-5 py-2 flex-shrink-0">
        <p className="text-[11px]" style={{ color: '#9CA3AF' }}>
          {rows.length} บทสนทนา{filter !== 'all' ? ` · ${STAT_CARDS.find(f => f.key === filter)?.label}` : ''}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2" style={{ color: '#9CA3AF' }}>
            <FileCheck2 size={28} style={{ opacity: 0.4 }} />
            <p className="text-sm">ไม่มีรายการ</p>
          </div>
        ) : rows.map(s => {
          const lastMsg = s.messages?.[s.messages.length - 1]
          return (
            <button
              key={s.id} onClick={() => onSelect(s.id)}
              className="w-full text-left px-5 py-3.5 flex items-start gap-3 transition-colors"
              style={{
                borderBottom: '1px solid #F3F4F6',
                background: selectedId === s.id ? '#EFF6FF' : 'transparent',
                borderLeft: selectedId === s.id ? '3px solid #0463EF' : '3px solid transparent',
              }}
              onMouseOver={e => { if (selectedId !== s.id) e.currentTarget.style.background = '#F9FAFB' }}
              onMouseOut={e => { e.currentTarget.style.background = selectedId === s.id ? '#EFF6FF' : 'transparent' }}
            >
              {/* AI avatar */}
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5"
                style={{ background: 'linear-gradient(135deg,#010136,#0463EF)', color: '#fff' }}>
                AI
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs font-bold truncate" style={{ color: '#010136' }}>{s.chatName ?? s.customsNo}</span>
                    {s.isNew && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-bold flex-shrink-0" style={{ background: '#EFF6FF', color: '#0463EF' }}>ใหม่</span>
                    )}
                  </div>
                  <span className="text-[10px] flex-shrink-0" style={{ color: '#9CA3AF' }}>{s.importedAt.split(' ')[0]}</span>
                </div>
                <p className="text-[11px] truncate mb-0.5" style={{ color: '#374151' }}>{s.goods}</p>
                {s.chatName && <p className="text-[10px] truncate mb-0.5" style={{ color: '#9CA3AF' }}>{s.customsNo}</p>}
                {lastMsg && (
                  <p className="text-[11px] truncate" style={{ color: '#9CA3AF' }}>
                    {lastMsg.role === 'user' ? 'คุณ: ' : 'AI: '}{lastMsg.content.split('\n')[0]}
                  </p>
                )}
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: STATUS_META[s.statusKey].bg, color: STATUS_META[s.statusKey].text }}>
                    <StatusIcon s={s.statusKey} />
                    {STATUS_META[s.statusKey].label}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-medium" style={{ background: '#F3F4F6', color: '#6B7280' }}>
                    {AGENCY_SHORT[s.agency]}
                  </span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Shipment Chat View ────────────────────────────────────────────────────────

function ShipmentChatView({
  shipment, onBack, updateShipment,
}: {
  shipment: Shipment
  onBack: () => void
  updateShipment: (id: string, patch: Partial<Shipment>) => void
}) {
  const [input, setInput] = useState('')
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>(shipment.messages ?? [])
  const [showPreview, setShowPreview] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { ocrProgress, ocrStages, isOCRing, startOCR } = useOCRFlow()

  useEffect(() => {
    setLocalMessages(shipment.messages ?? [])
    setInput('')
    setShowPreview(false)
  }, [shipment.id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [localMessages, isOCRing])

  const pushMessages = (msgs: ChatMessage[], patch?: Partial<Shipment>) => {
    const updated = [...localMessages, ...msgs]
    setLocalMessages(updated)
    updateShipment(shipment.id, { messages: updated, ...patch })
  }

  const sendUserMessage = (text: string) => {
    const time = getTime()
    pushMessages([{ id: generateId(), role: 'user', content: text, time }])
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleConfirm = () => {
    const time = getTime()
    pushMessages([
      { id: generateId(), role: 'user', content: 'ยืนยันและดำเนินการต่อ', time },
      { id: generateId(), role: 'bot', content: `ยืนยันแล้ว ✓ ร่างอีเมลถึง ${shipment.email.toName} (${shipment.email.to}) พร้อมส่งแล้ว`, time },
    ], { statusKey: 'email_outbox', stage: 6 })
  }

  const handleSendEmail = () => {
    const time = getTime()
    pushMessages([
      { id: generateId(), role: 'user', content: 'ส่งอีเมลหาลูกค้า', time },
      { id: generateId(), role: 'bot', content: `ส่งอีเมลถึง ${shipment.email.toName} (${shipment.email.to}) เรียบร้อยแล้ว — รอลูกค้ายืนยันข้อมูลเอกสาร`, time },
    ], { statusKey: 'await_customer', stage: 7 })
  }

  const handleCustomerConfirmed = () => {
    const time = getTime()
    pushMessages([
      { id: generateId(), role: 'user', content: 'ลูกค้ายืนยันเอกสารแล้ว', time },
      { id: generateId(), role: 'bot', content: 'รับทราบ — ตรวจสอบพรีวิวก่อนยื่นกรมได้เลย', time },
    ])
    setTimeout(() => setShowPreview(true), 400)
  }

  const handleSubmit = () => {
    const time = getTime()
    const newMsg: ChatMessage = { id: generateId(), role: 'bot', content: `ยื่นเอกสารถึงกรมเรียบร้อยแล้ว ✓\n\nแบบฟอร์ม: ${shipment.formCode} — ${shipment.customsNo}`, time }
    const updated = [...localMessages, newMsg]
    setLocalMessages(updated)
    updateShipment(shipment.id, { statusKey: 'submitted', stage: 8, messages: updated })
    setShowPreview(false)
    sonnerToast.success('ยื่นเอกสารถึงกรมเรียบร้อยแล้ว')
  }

  const handleOCR = async () => {
    const time = getTime()
    const startMsg: ChatMessage = { id: generateId(), role: 'user', content: 'เริ่ม OCR และวิเคราะห์เอกสาร', time }
    setLocalMessages(prev => [...prev, startMsg])
    await startOCR([])
    const doneTime = getTime()
    const doneMsg: ChatMessage = { id: generateId(), role: 'bot', content: 'OCR เสร็จสมบูรณ์ ✓ — AI วิเคราะห์ความมั่นใจ 88%\n\nร่างคำขออนุญาตพร้อมแล้ว — โปรดตรวจสอบและยืนยัน', time: doneTime }
    const updated = [...localMessages, startMsg, doneMsg]
    setLocalMessages(updated)
    updateShipment(shipment.id, { conf: 88, stage: 4, messages: updated })
  }

  const meta = STATUS_META[shipment.statusKey]
  const needsOCR = shipment.draft.fields.length === 0 && shipment.statusKey === 'needs_you'
  const openFlagsCount = shipment.flags.filter(f => !f.resolved).length

  return (
    <div className="flex flex-col h-full relative" style={{ background: '#fff' }}>
      {/* Header */}
      <div className="px-5 pt-4 pb-3 flex-shrink-0" style={{ borderBottom: '1px solid #E5E7EB' }}>
        <div className="flex items-center gap-2 mb-2">
          <button onClick={onBack} className="flex items-center gap-1 text-xs" style={{ color: '#6B7280' }}>
            <ChevronLeft size={13} /> กลับ
          </button>
        </div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <h2 className="text-sm font-bold" style={{ color: '#010136' }}>{shipment.customsNo}</h2>
              <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                style={{ background: meta.bg, color: meta.text }}>
                <StatusIcon s={shipment.statusKey} />
                {meta.label}
              </span>
              {openFlagsCount > 0 && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: '#FFFBEB', color: '#B45309' }}>
                  ⚠ {openFlagsCount} จุดตรวจสอบ
                </span>
              )}
            </div>
            <p className="text-[11px] truncate" style={{ color: '#9CA3AF' }}>{shipment.goods} · {shipment.customer}</p>
          </div>
          <ConfBar val={shipment.conf} />
        </div>

        {/* Step progress */}
        <div className="mt-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <div className="flex items-center" style={{ minWidth: 480 }}>
            {STAGE_LABELS.slice(1).map((label, i) => {
              const step = i + 1
              const done = step < shipment.stage
              const active = step === shipment.stage
              const isLast = i === 7
              return (
                <div key={step} className="flex items-center" style={{ flex: isLast ? '0 0 auto' : '1 1 0', minWidth: 0 }}>
                  <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                      style={{ background: done ? '#10B981' : active ? '#0463EF' : '#E5E7EB', color: done || active ? '#fff' : '#9CA3AF' }}>
                      {done ? '✓' : step}
                    </div>
                    <span className="text-[9px] text-center whitespace-nowrap" style={{ color: done ? '#10B981' : active ? '#0463EF' : '#9CA3AF' }}>
                      {label}
                    </span>
                  </div>
                  {!isLast && <div className="flex-1 h-px mx-1 mb-3" style={{ background: done ? '#10B981' : '#E5E7EB', minWidth: 6 }} />}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3" style={{ background: '#F9FAFB' }}>
        {localMessages.map(msg => (
          <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'bot' && (
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5"
                style={{ background: 'linear-gradient(135deg,#010136,#0463EF)', color: '#fff' }}>
                AI
              </div>
            )}
            <div style={{ maxWidth: '75%' }}>
              <div className="px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap"
                style={{
                  background: msg.role === 'user' ? 'linear-gradient(135deg,#034DBA,#0463EF)' : '#fff',
                  color: msg.role === 'user' ? '#fff' : '#374151',
                  border: msg.role === 'bot' ? '1px solid #E5E7EB' : 'none',
                  borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                }}>
                {msg.isHtml
                  ? <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                  : msg.content}
              </div>
              <p className="text-[9px] mt-0.5 px-1" style={{ color: '#BCBCBC', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                {msg.time} น.
              </p>
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5"
                style={{ background: 'linear-gradient(135deg,#40406A,#0463EF)', color: '#fff' }}>
                ปว
              </div>
            )}
          </div>
        ))}

        {/* OCR progress inside chat */}
        {isOCRing && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#010136,#0463EF)', color: '#fff' }}>AI</div>
            <div style={{ maxWidth: '75%' }}>
              <OcrProgress progress={ocrProgress} completedStages={ocrStages} />
            </div>
          </div>
        )}

        {/* OCR upload prompt if no draft yet */}
        {needsOCR && !isOCRing && localMessages.length > 0 && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5"
              style={{ background: 'linear-gradient(135deg,#010136,#0463EF)', color: '#fff' }}>AI</div>
            <div className="flex-1" style={{ maxWidth: '75%' }}>
              <div className="px-3 py-2.5 text-xs" style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '4px 18px 18px 18px' }}>
                <p className="mb-2" style={{ color: '#374151' }}>กรุณาอัปโหลดเอกสารเพื่อเริ่ม OCR</p>
                <button onClick={handleOCR}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg,#034DBA,#0463EF)' }}>
                  <Search size={12} /> เริ่ม OCR และวิเคราะห์
                </button>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Action bar */}
      {shipment.statusKey === 'needs_you' && !needsOCR && !isOCRing && (
        <div className="flex-shrink-0 px-4 py-3 flex gap-2" style={{ borderTop: '1px solid #E5E7EB', background: '#fff' }}>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold flex-shrink-0"
            style={{ background: '#F3F4F6', color: '#6B7280' }}>
            <RotateCcw size={12} /> ส่งกลับ AI
          </button>
          <button onClick={handleConfirm}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white"
            style={{ background: '#0463EF' }}>
            <CheckCircle2 size={13} /> ยืนยันและดำเนินการต่อ
          </button>
        </div>
      )}
      {shipment.statusKey === 'email_outbox' && (
        <div className="flex-shrink-0 px-4 py-3" style={{ borderTop: '1px solid #E5E7EB', background: '#fff' }}>
          <button onClick={handleSendEmail}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white"
            style={{ background: '#0463EF' }}>
            <Send size={13} /> ส่งอีเมลหาลูกค้า
          </button>
        </div>
      )}
      {shipment.statusKey === 'await_customer' && (
        <div className="flex-shrink-0 px-4 py-3 flex gap-2" style={{ borderTop: '1px solid #E5E7EB', background: '#fff' }}>
          <button onClick={() => updateShipment(shipment.id, { statusKey: 'needs_you', stage: 1 })}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold flex-shrink-0"
            style={{ background: '#F3F4F6', color: '#6B7280' }}>
            <RotateCcw size={12} /> แก้ไขเอกสาร
          </button>
          <button onClick={handleCustomerConfirmed}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white"
            style={{ background: '#0463EF' }}>
            <CheckCircle2 size={13} /> ลูกค้ายืนยันเอกสารแล้ว
          </button>
        </div>
      )}

      {/* Chat input — always shown */}
      <div className="flex-shrink-0 px-4 py-3 flex gap-2 items-end" style={{ borderTop: '1px solid #E5E7EB', background: '#fff' }}>
        <div className="flex-1 flex items-end gap-2 px-3 py-2 rounded-2xl transition-all"
          style={{ border: '1px solid #E0E0E0', background: '#F9FAFB' }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                if (input.trim()) sendUserMessage(input.trim())
              }
            }}
            onInput={() => {
              const el = textareaRef.current
              if (!el) return
              el.style.height = 'auto'
              el.style.height = Math.min(el.scrollHeight, 80) + 'px'
            }}
            rows={1}
            placeholder="พิมพ์ข้อความ..."
            className="flex-1 text-xs bg-transparent outline-none resize-none leading-relaxed"
            style={{ color: '#010136', minHeight: 18, maxHeight: 80 }}
          />
        </div>
        <button
          onClick={() => { if (input.trim()) sendUserMessage(input.trim()) }}
          disabled={!input.trim()}
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-all hover:scale-105 active:scale-95"
          style={{ background: '#0463EF', color: '#fff' }}>
          <Send size={13} />
        </button>
      </div>

      {/* Preview modal */}
      {showPreview && (
        <div className="absolute inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="w-full rounded-t-2xl flex flex-col" style={{ background: '#fff', maxHeight: '80%' }}>
            <div className="px-5 pt-5 pb-3 flex items-center justify-between flex-shrink-0" style={{ borderBottom: '1px solid #E5E7EB' }}>
              <div>
                <p className="text-sm font-bold" style={{ color: '#010136' }}>พรีวิวก่อนยื่นกรม</p>
                <p className="text-[10px] mt-0.5" style={{ color: '#9CA3AF' }}>{shipment.customsNo}</p>
              </div>
              <button onClick={() => setShowPreview(false)} className="w-7 h-7 flex items-center justify-center rounded-lg" style={{ background: '#F3F4F6', color: '#6B7280' }}>✕</button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              <PreviewSection title="ข้อมูลผู้นำเข้า">
                <PreviewRow label="ผู้ขออนุญาต" value={shipment.customer} />
                <PreviewRow label="หน่วยงาน" value={AGENCY_LABEL[shipment.agency] ?? '—'} />
                <PreviewRow label="เลขใบขน" value={shipment.customsNo} highlight />
              </PreviewSection>
              <PreviewSection title="ข้อมูลสินค้า">
                <PreviewRow label="ชื่อสินค้า" value={shipment.goods} />
                <PreviewRow label="HS Code" value={shipment.hs} />
                <PreviewRow label="ประเทศต้นทาง" value={shipment.origin} />
              </PreviewSection>
              {shipment.draft.fields.length > 0 && (
                <PreviewSection title="ร่างคำขอ">
                  {shipment.draft.fields.map(f => <PreviewRow key={f.label} label={f.label} value={f.value} />)}
                </PreviewSection>
              )}
            </div>
            <div className="flex-shrink-0 px-5 py-4 flex gap-2" style={{ borderTop: '1px solid #E5E7EB' }}>
              <button onClick={() => setShowPreview(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: '#F3F4F6', color: '#6B7280' }}>
                ยังไม่ยื่นกรม
              </button>
              <button onClick={handleSubmit}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: '#0463EF' }}>
                <CheckCircle2 size={14} /> ยื่นกรม
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function PreviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#9CA3AF' }}>{title}</p>
      <div className="rounded-xl p-3" style={{ background: '#fff', border: '1px solid #E5E7EB' }}>{children}</div>
    </div>
  )
}

function PreviewRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1" style={{ borderBottom: '1px solid #F3F4F6' }}>
      <span className="text-xs flex-shrink-0" style={{ color: '#9CA3AF' }}>{label}</span>
      <span className="text-xs font-medium text-right" style={{ color: highlight ? '#0463EF' : '#374151' }}>{value}</span>
    </div>
  )
}

// ── Main export ──────────────────────────────────────────────────────────────

interface QueuePageProps {
  queue: Shipment[]
  updateShipment: (id: string, patch: Partial<Shipment>) => void
  initialActiveId?: string | null
  onNavigateChat?: () => void
}

export function QueuePage({ queue, updateShipment, initialActiveId }: QueuePageProps) {
  const [filter, setFilter] = useState<ShipmentStatus | 'all'>('all')
  const [activeId, setActiveId] = useState<string | null>(initialActiveId ?? null)

  useEffect(() => {
    if (initialActiveId) setActiveId(initialActiveId)
  }, [initialActiveId])

  const selected = activeId ? queue.find(s => s.id === activeId) ?? null : null

  const handleFilter = (k: ShipmentStatus | 'all') => {
    setFilter(k)
    setActiveId(null)
  }

  return (
    <div className="flex flex-col h-full" style={{ background: '#F9FAFB' }}>
      {!selected && (
        <DashboardStrip queue={queue} activeFilter={filter} onFilter={handleFilter} />
      )}

      <div className="flex flex-1 min-h-0">
        <div className="flex flex-col h-full overflow-hidden"
          style={{
            width: selected ? 300 : '100%',
            borderRight: selected ? '1px solid #E5E7EB' : 'none',
            background: '#fff',
            transition: 'width 0.2s',
            flexShrink: 0,
          }}>
          <ListView
            queue={queue} filter={filter} selectedId={activeId}
            onSelect={id => setActiveId(id)}
          />
        </div>

        {selected && (
          <div className="flex-1 min-w-0 h-full overflow-hidden" style={{ background: '#fff' }}>
            <ShipmentChatView
              shipment={selected}
              onBack={() => setActiveId(null)}
              updateShipment={updateShipment}
            />
          </div>
        )}
      </div>
    </div>
  )
}
