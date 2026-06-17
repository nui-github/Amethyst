'use client'
import { useState, useEffect } from 'react'
import {
  ChevronLeft, AlertTriangle, CheckCircle2, Mail, Clock,
  FileCheck2, Search, Filter, RotateCcw, Send, Upload, MessageSquare,
  TrendingUp, Package, Ban, Plus,
} from 'lucide-react'
import { AGENCY_LABEL, AGENCY_SHORT, STATUS_META } from '@/lib/mock/queue'
import { OcrProgress } from '@/components/chat/OcrProgress'
import { useOCRFlow }  from '@/hooks/useOCRFlow'
import type { Shipment, ShipmentStatus, DraftField } from '@/lib/types'

const FILTERS: { key: ShipmentStatus | 'all'; label: string }[] = [
  { key: 'all',            label: 'ทั้งหมด' },
  { key: 'needs_you',      label: 'รอคุณยืนยัน' },
  { key: 'email_outbox',   label: 'ร่างอีเมลรอส่ง' },
  { key: 'await_customer', label: 'รอลูกค้ายืนยัน' },
  { key: 'no_permit',      label: 'ไม่ต้องขอใบอนุญาต' },
  { key: 'submitted',      label: 'ยื่นกรมแล้ว' },
]

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
  const submitted = queue.filter(s => s.statusKey === 'submitted').length
  const total     = queue.length
  const avgConf   = total ? Math.round(queue.reduce((s, q) => s + q.conf, 0) / total) : 0

  return (
    <div className="flex-shrink-0" style={{ background: '#fff', borderBottom: '1px solid #E5E7EB' }}>
      {/* Top bar */}
      <div className="px-6 pt-5 pb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold" style={{ color: '#010136' }}>คิวงานขอใบอนุญาต</h1>
          </div>
          <p className="text-xs" style={{ color: '#9CA3AF' }}>{today}</p>
        </div>
        {/* Mini KPI strip */}
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #034DBA, #0463EF)', color: '#fff', boxShadow: '0 4px 14px rgba(4,99,239,0.3)' }}
          onMouseOver={e => { e.currentTarget.style.boxShadow = '0 6px 18px rgba(4,99,239,0.4)' }}
          onMouseOut={e => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(4,99,239,0.3)' }}
        >
          <Plus size={14} />
          เพิ่มรายการขอใบอนุญาต
        </button>
      </div>

      {/* Stat cards row */}
      <div className="px-6 pb-4 grid gap-3" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
        {/* All card */}
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
  queue, filter, onSelect, narrow, selectedId,
}: { queue: Shipment[]; filter: ShipmentStatus | 'all'; onSelect: (id: string) => void; narrow?: boolean; selectedId?: string | null }) {
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
      {/* Search bar */}
      <div className="px-5 py-3 flex-shrink-0" style={{ borderBottom: '1px solid #F3F4F6' }}>
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
            <Search size={13} style={{ color: '#9CA3AF', flexShrink: 0 }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="ค้นหา ref, ผู้นำเข้า, สินค้า..." className="flex-1 text-sm bg-transparent outline-none"
              style={{ color: '#374151' }}
            />
          </div>
        </div>
      </div>

      {/* Count label */}
      <div className="px-5 py-2 flex-shrink-0">
        <p className="text-[11px]" style={{ color: '#9CA3AF' }}>
          {rows.length} รายการ{filter !== 'all' ? ` · ${FILTERS.find(f => f.key === filter)?.label}` : ''}
        </p>
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2" style={{ color: '#9CA3AF' }}>
            <FileCheck2 size={28} style={{ opacity: 0.4 }} />
            <p className="text-sm">ไม่มีรายการ</p>
          </div>
        ) : rows.map(s => (
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
            <div className="flex-shrink-0 w-1 h-11 rounded-full mt-0.5" style={{ background: STATUS_META[s.statusKey].dot }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs font-bold" style={{ color: '#010136' }}>{s.customsNo}</span>
                {s.isNew && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: '#DBEAFE', color: '#1D4ED8' }}>
                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#0463EF' }} />
                    ใหม่
                  </span>
                )}
                {s.hthmRef && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-medium" style={{ background: '#EFF6FF', color: '#1D4ED8' }}>
                    {s.hthmRef}
                  </span>
                )}
                <span className="text-[9px] px-1.5 py-0.5 rounded font-medium" style={{ background: '#F3F4F6', color: '#6B7280' }}>
                  {AGENCY_SHORT[s.agency]}
                </span>
              </div>
              <p className="text-[11px] truncate mb-0.5" style={{ color: '#374151' }}>{s.customer}</p>
              <p className="text-[11px] truncate" style={{ color: '#9CA3AF' }}>{s.goods}</p>
            </div>
            <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
              <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: STATUS_META[s.statusKey].bg, color: STATUS_META[s.statusKey].text }}>
                <StatusIcon s={s.statusKey} />
                {STATUS_META[s.statusKey].label}
              </span>
              <ConfBar val={s.conf} size="sm" />
              <span className="text-[10px]" style={{ color: '#9CA3AF' }}>{s.importedAt}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Detail view ──────────────────────────────────────────────────────────────

function DetailView({
  shipment, onBack, onNavigateChat, updateShipment,
}: {
  shipment: Shipment
  onBack: () => void
  onNavigateChat?: () => void
  updateShipment: (id: string, patch: Partial<Shipment>) => void
}) {
  const needsOCR = shipment.draft.fields.length === 0 && shipment.statusKey === 'needs_you'
  const defaultTab = needsOCR ? 'upload' : 'assess'
  const [activeTab, setActiveTab] = useState<'upload' | 'assess' | 'draft' | 'email' | 'audit'>(defaultTab)
  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const { ocrProgress, ocrStages, isOCRing, startOCR } = useOCRFlow()
  const [ocrDone, setOcrDone] = useState(false)
  const [customerConfirmed, setCustomerConfirmed] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    setActiveTab(shipment.draft.fields.length === 0 && shipment.statusKey === 'needs_you' ? 'upload' : 'assess')
    setFormValues({})
    setOcrDone(false)
    setCustomerConfirmed(false)
    setShowPreview(false)
    setToast(null)
  }, [shipment.id])

  const handleOCR = async () => {
    const result = await startOCR([])
    const fields: DraftField[] = [
      { label: 'Invoice No.', value: result.invoiceNo ?? '' },
      { label: 'วันที่ Invoice', value: result.invoiceDate ?? '' },
      { label: 'ผู้นำเข้า', value: result.importer ?? shipment.customer },
      { label: 'ประเทศต้นทาง', value: result.countryOrigin ?? shipment.origin },
      { label: 'HS Code', value: result.hsCode ?? shipment.hs },
      { label: 'ปริมาณ', value: result.quantity ? `${result.quantity} กิโลกรัม` : '' },
      { label: 'Lot No.', value: result.lotNo ?? '' },
      { label: 'เลข U', value: result.uNo ?? '' },
    ]
    const vals: Record<string, string> = {}
    fields.forEach(f => { vals[f.label] = f.value })
    setFormValues(vals)
    setOcrDone(true)

    updateShipment(shipment.id, {
      draft: { fields },
      conf: 88,
      stage: 4,
      assess: {
        conf: 88,
        reason: `AI วิเคราะห์จากเอกสาร OCR — HS ${result.hsCode ?? shipment.hs} จัดเป็นยา/วัตถุดิบยา ต้องขออนุญาต RGoods จาก อย.`,
      },
      classify: {
        agency: 'fda',
        conf: 88,
        reason: 'วัตถุดิบยาอยู่ในอำนาจของ อย. ยื่นผ่านระบบ e-Submission',
        alt: [{ agency: 'dft', conf: 20 }],
      },
      audit: [
        ...shipment.audit,
        { time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }), text: 'OCR เอกสารเสร็จสิ้น — AI วิเคราะห์ 88%', by: 'AI' as const },
      ],
    })
    setTimeout(() => setActiveTab('draft'), 600)
  }

  const meta = STATUS_META[shipment.statusKey]
  const openFlags = shipment.flags.filter(f => !f.resolved)

  const tabs = [
    ...(shipment.statusKey === 'needs_you' ? [{ id: 'upload' as const, label: 'อัปโหลด / OCR' }] : []),
    { id: 'assess' as const, label: 'การประเมิน' },
    { id: 'draft' as const, label: `ร่างคำขอ${shipment.flags.length > 0 ? ` (${shipment.flags.length})` : ''}` },
    { id: 'email' as const, label: 'ร่างอีเมล' },
    { id: 'audit' as const, label: 'ประวัติ' },
  ]

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 flex-shrink-0" style={{ borderBottom: '1px solid #E5E7EB' }}>
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack} className="flex items-center gap-1 text-xs" style={{ color: '#6B7280' }}>
            <ChevronLeft size={13} /> กลับคิวงาน
          </button>
          {onNavigateChat && (
            <button onClick={onNavigateChat} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg"
              style={{ background: '#EFF6FF', color: '#1D4ED8' }}>
              <MessageSquare size={11} /> กลับแชท
            </button>
          )}
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-base font-bold" style={{ color: '#010136' }}>{shipment.customsNo}</h2>
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: meta.bg, color: meta.text }}>
                <StatusIcon s={shipment.statusKey} />
                {meta.label}
              </span>
            </div>
            <p className="text-xs" style={{ color: '#6B7280' }}>{shipment.customer} · {shipment.contact}</p>
            <p className="text-xs" style={{ color: '#9CA3AF' }}>{shipment.goods} · HS {shipment.hs}</p>
          </div>
          <ConfBar val={shipment.conf} />
        </div>

        {/* Progress steps */}
        <div className="mt-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          <div className="flex items-center" style={{ minWidth: 520 }}>
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
                {!isLast && <div className="flex-1 h-px mx-1 mb-3" style={{ background: done ? '#10B981' : '#E5E7EB', minWidth: 8 }} />}
              </div>
            )
          })}
          </div>
        </div>
      </div>

      {/* Flags banner */}
      {openFlags.length > 0 && (
        <div className="mx-6 mt-4 rounded-xl px-4 py-3 flex items-start gap-2 flex-shrink-0"
          style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
          <AlertTriangle size={15} style={{ color: '#F59E0B', flexShrink: 0, marginTop: 1 }} />
          <div>
            <p className="text-xs font-semibold mb-0.5" style={{ color: '#B45309' }}>พบ {openFlags.length} จุดที่ต้องตรวจสอบ</p>
            {openFlags.map(f => <p key={f.id} className="text-xs" style={{ color: '#92400E' }}>· {f.title}</p>)}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-0 px-6 mt-4 flex-shrink-0" style={{ borderBottom: '1px solid #E5E7EB' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className="px-4 py-2 text-xs font-semibold whitespace-nowrap"
            style={{
              color: activeTab === tab.id ? '#0463EF' : '#9CA3AF',
              borderBottom: activeTab === tab.id ? '2px solid #0463EF' : '2px solid transparent',
              marginBottom: -1,
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">

        {activeTab === 'upload' && (
          <div className="space-y-4">
            {isOCRing ? (
              <OcrProgress progress={ocrProgress} completedStages={ocrStages} />
            ) : ocrDone ? (
              <div className="rounded-xl p-4 text-center" style={{ background: '#ECFDF5', border: '1px solid #BBF7D0' }}>
                <CheckCircle2 size={28} style={{ color: '#10B981', margin: '0 auto 8px' }} />
                <p className="text-sm font-semibold" style={{ color: '#065F46' }}>OCR เสร็จสิ้น กำลังไปหน้าร่างคำขอ...</p>
              </div>
            ) : (
              <Section title="อัปโหลดเอกสารเพื่อ OCR">
                <div className="text-center py-6" style={{ border: '2px dashed #CCCCCC', borderRadius: 12, background: '#F9FAFB' }}>
                  <Upload size={28} style={{ color: '#9CA3AF', margin: '0 auto 8px' }} />
                  <p className="text-sm font-semibold" style={{ color: '#374151' }}>คลิกหรือลากไฟล์มาวาง</p>
                  <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>PDF, JPG, PNG · Invoice + ใบขน + COA + เลข U</p>
                </div>
                <button
                  onClick={handleOCR}
                  className="w-full mt-3 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg,#034DBA,#0463EF)' }}
                >
                  <Search size={14} /> เริ่ม OCR และวิเคราะห์เอกสาร
                </button>
              </Section>
            )}
          </div>
        )}

        {activeTab === 'assess' && (
          <div className="space-y-4">
            <Section title="ผลการประเมิน AI">
              {shipment.conf === 0 ? (
                <p className="text-xs py-2" style={{ color: '#9CA3AF' }}>ยังไม่ได้วิเคราะห์ — โปรดอัปโหลดเอกสาร OCR ก่อน</p>
              ) : (
                <>
                  <Row label="ต้องขออนุญาต" value={shipment.permitNeeded ? 'ใช่' : 'ไม่ใช่'} highlight={shipment.permitNeeded} />
                  <Row label="หน่วยงาน" value={AGENCY_LABEL[shipment.agency]} />
                  <Row label="แบบฟอร์ม" value={`${shipment.formCode} — ${shipment.formName}`} />
                  <div className="mt-2 p-3 rounded-lg text-xs leading-relaxed" style={{ background: '#F9FAFB', color: '#374151', border: '1px solid #E5E7EB' }}>
                    {shipment.assess.reason}
                  </div>
                </>
              )}
            </Section>

            {shipment.conf > 0 && (
              <Section title="การจัดประเภทหน่วยงาน">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold" style={{ color: '#010136' }}>{AGENCY_LABEL[shipment.classify.agency]}</span>
                  <ConfBar val={shipment.classify.conf} size="sm" />
                </div>
                <p className="text-xs mb-3" style={{ color: '#6B7280' }}>{shipment.classify.reason}</p>
                {shipment.classify.alt.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: '#9CA3AF' }}>ทางเลือกอื่น</p>
                    {shipment.classify.alt.map(a => (
                      <div key={a.agency} className="flex items-center justify-between">
                        <span className="text-xs" style={{ color: '#9CA3AF' }}>{AGENCY_LABEL[a.agency]}</span>
                        <ConfBar val={a.conf} size="sm" />
                      </div>
                    ))}
                  </div>
                )}
              </Section>
            )}
          </div>
        )}

        {activeTab === 'draft' && (
          <div className="space-y-4">
            <Section title="ข้อมูลในร่างคำขอ">
              {shipment.draft.fields.length === 0 ? (
                <p className="text-xs py-2" style={{ color: '#9CA3AF' }}>ยังไม่มีข้อมูล — โปรดอัปโหลดเอกสาร OCR ก่อน</p>
              ) : shipment.draft.fields.map((f, i) => {
                const flagObj = f.flag ? shipment.flags.find(fl => fl.id === f.flag) : null
                return (
                  <div key={i} className="flex items-start gap-2 py-1.5" style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <span className="text-xs flex-1" style={{ color: '#6B7280' }}>{f.label}</span>
                    <span className="text-xs font-medium text-right flex-1" style={{ color: '#010136' }}>{f.value}</span>
                    {flagObj && !flagObj.resolved && <AlertTriangle size={11} style={{ color: '#F59E0B', flexShrink: 0, marginTop: 2 }} />}
                    {flagObj && flagObj.resolved && <CheckCircle2 size={11} style={{ color: '#10B981', flexShrink: 0, marginTop: 2 }} />}
                  </div>
                )
              })}
            </Section>

            {shipment.flags.length > 0 && (
              <Section title="จุดตรวจสอบ (Flags)">
                <div className="space-y-2">
                  {shipment.flags.map(f => (
                    <div key={f.id} className="p-3 rounded-lg"
                      style={{ background: f.resolved ? '#F0FDF4' : '#FFFBEB', border: `1px solid ${f.resolved ? '#BBF7D0' : '#FDE68A'}` }}>
                      <div className="flex items-center gap-1.5 mb-1">
                        {f.resolved ? <CheckCircle2 size={12} style={{ color: '#10B981' }} /> : <AlertTriangle size={12} style={{ color: '#F59E0B' }} />}
                        <span className="text-xs font-semibold" style={{ color: f.resolved ? '#065F46' : '#92400E' }}>{f.title}</span>
                        <span className="ml-auto text-[10px]" style={{ color: f.resolved ? '#10B981' : '#F59E0B' }}>{f.conf}%</span>
                      </div>
                      <p className="text-xs" style={{ color: f.resolved ? '#065F46' : '#92400E' }}>{f.detail}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>
        )}

        {activeTab === 'email' && (
          <Section title="ร่างอีเมลถึงลูกค้า">
            {!shipment.email.to ? (
              <p className="text-xs" style={{ color: '#9CA3AF' }}>ไม่มีการส่งอีเมลสำหรับรายการนี้</p>
            ) : (
              <div className="space-y-3">
                <Row label="ถึง" value={`${shipment.email.toName} <${shipment.email.to}>`} />
                <Row label="หัวข้อ" value={shipment.email.subject} />
                {shipment.email.attName && <Row label="แนบไฟล์" value={shipment.email.attName} />}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: '#9CA3AF' }}>เนื้อหา</p>
                  <div className="p-3 rounded-lg text-xs leading-relaxed whitespace-pre-line"
                    style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#374151' }}>
                    {shipment.email.body}
                  </div>
                </div>
              </div>
            )}
          </Section>
        )}

        {activeTab === 'audit' && (
          <Section title="ประวัติการดำเนินการ">
            <div className="space-y-0">
              {shipment.audit.map((a, i) => (
                <div key={i} className="flex gap-3 pb-4 relative">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                      style={{
                        background: a.by === 'AI' ? 'linear-gradient(135deg,#010136,#0463EF)' : a.by === 'เจ้าหน้าที่' ? '#E0F2FE' : '#F3F4F6',
                        color: a.by === 'AI' ? '#fff' : a.by === 'เจ้าหน้าที่' ? '#0369A1' : '#6B7280',
                      }}>
                      {a.by === 'AI' ? 'AI' : a.by === 'เจ้าหน้าที่' ? '👤' : 'ระบบ'}
                    </div>
                    {i < shipment.audit.length - 1 && <div className="w-px flex-1 mt-1" style={{ background: '#E5E7EB' }} />}
                  </div>
                  <div className="pt-0.5 pb-1">
                    <p className="text-xs" style={{ color: '#374151' }}>{a.text}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: '#9CA3AF' }}>{a.time} น. · {a.by}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>

      {/* Action bar */}
      {shipment.statusKey === 'needs_you' && !isOCRing && shipment.draft.fields.length > 0 && (
        <div className="flex-shrink-0 px-6 py-4 flex gap-3" style={{ borderTop: '1px solid #E5E7EB', background: '#fff' }}>
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: '#F3F4F6', color: '#6B7280' }}>
            <RotateCcw size={14} /> ส่งกลับ AI
          </button>
          <button
            onClick={() => updateShipment(shipment.id, { statusKey: 'email_outbox', stage: 6 })}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg,#11BB7F,#16EA9E)' }}>
            <CheckCircle2 size={14} /> ยืนยันและดำเนินการต่อ
          </button>
        </div>
      )}
      {shipment.statusKey === 'email_outbox' && (
        <div className="flex-shrink-0 px-6 py-4" style={{ borderTop: '1px solid #E5E7EB', background: '#fff' }}>
          <button
            onClick={() => updateShipment(shipment.id, { statusKey: 'await_customer', stage: 7 })}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg,#034DBA,#0463EF)' }}>
            <Send size={14} /> ส่งอีเมลหาลูกค้า
          </button>
        </div>
      )}

      {shipment.statusKey === 'await_customer' && (
        <div className="flex-shrink-0 px-6 py-4 flex gap-2" style={{ borderTop: '1px solid #E5E7EB', background: '#fff' }}>
          <button
            onClick={() => { updateShipment(shipment.id, { statusKey: 'needs_you', stage: 1 }); setCustomerConfirmed(false) }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold flex-shrink-0"
            style={{ background: '#F3F4F6', color: '#6B7280' }}>
            <RotateCcw size={14} /> แก้ไขเอกสาร
          </button>
          {!customerConfirmed ? (
            <button
              onClick={() => setCustomerConfirmed(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg,#11BB7F,#16EA9E)' }}>
              <CheckCircle2 size={14} /> ลูกค้ายืนยันเอกสารแล้ว
            </button>
          ) : (
            <button
              onClick={() => setShowPreview(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg,#034DBA,#0463EF)' }}>
              <FileCheck2 size={14} /> ดูพรีวิวเอกสารก่อนยื่นกรม
            </button>
          )}
        </div>
      )}

      {/* Preview modal */}
      {showPreview && (
        <div className="absolute inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="w-full rounded-t-2xl flex flex-col" style={{ background: '#fff', maxHeight: '80%' }}>
            <div className="px-5 pt-5 pb-3 flex items-center justify-between flex-shrink-0" style={{ borderBottom: '1px solid #E5E7EB' }}>
              <div>
                <p className="text-sm font-bold" style={{ color: '#010136' }}>พรีวิวเอกสารก่อนยื่นกรม</p>
                <p className="text-[10px] mt-0.5" style={{ color: '#9CA3AF' }}>{shipment.customsNo}</p>
              </div>
              <button onClick={() => setShowPreview(false)} className="w-7 h-7 flex items-center justify-center rounded-lg" style={{ background: '#F3F4F6', color: '#6B7280' }}>✕</button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              <Section title="ข้อมูลผู้นำเข้า">
                <div className="space-y-1">
                  <Row label="ผู้ขออนุญาต" value={shipment.customer} />
                  <Row label="หน่วยงาน" value={AGENCY_LABEL[shipment.agency] ?? '—'} />
                  <Row label="เลขใบขน" value={shipment.customsNo} highlight />
                </div>
              </Section>
              <Section title="ข้อมูลสินค้า">
                <div className="space-y-1">
                  <Row label="ชื่อสินค้า" value={shipment.goods} />
                  <Row label="HS Code" value={shipment.hs} />
                  <Row label="ประเทศต้นทาง" value={shipment.origin} />
                </div>
              </Section>
              {shipment.draft.fields.length > 0 && (
                <Section title="ข้อมูลจากเอกสาร OCR">
                  <div className="space-y-1">
                    {shipment.draft.fields.map(f => <Row key={f.label} label={f.label} value={f.value} />)}
                  </div>
                </Section>
              )}
            </div>
            <div className="flex-shrink-0 px-5 py-4 flex gap-2" style={{ borderTop: '1px solid #E5E7EB' }}>
              <button
                onClick={() => setShowPreview(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: '#F3F4F6', color: '#6B7280' }}>
                ยังไม่ยื่นกรม
              </button>
              <button
                onClick={() => {
                  updateShipment(shipment.id, { statusKey: 'submitted', stage: 8 })
                  setShowPreview(false)
                  setToast('ยื่นเอกสารถึงกรมเรียบร้อยแล้ว')
                  setTimeout(() => setToast(null), 3000)
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: 'linear-gradient(135deg,#11BB7F,#16EA9E)' }}>
                <CheckCircle2 size={14} /> ยื่นกรม
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg flex items-center gap-2 whitespace-nowrap"
          style={{ background: 'linear-gradient(135deg,#0D8F61,#16EA9E)' }}>
          <CheckCircle2 size={14} /> {toast}
        </div>
      )}
    </div>
  )
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#9CA3AF' }}>{title}</p>
      <div className="rounded-xl p-3" style={{ background: '#fff', border: '1px solid #E5E7EB' }}>{children}</div>
    </div>
  )
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
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

export function QueuePage({ queue, updateShipment, initialActiveId, onNavigateChat }: QueuePageProps) {
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
      {/* Dashboard strip — only visible in list view */}
      {!selected && (
        <DashboardStrip queue={queue} activeFilter={filter} onFilter={handleFilter} />
      )}

      {/* Content */}
      <div className="flex flex-1 min-h-0">
        {/* Left list panel */}
        <div className="flex flex-col h-full overflow-hidden"
          style={{
            width: selected ? 300 : '100%',
            borderRight: selected ? '1px solid #E5E7EB' : 'none',
            background: '#fff',
            transition: 'width 0.2s',
            flexShrink: 0,
          }}>
          <ListView
            queue={queue} filter={filter} narrow={!!selected} selectedId={activeId}
            onSelect={id => {
              setActiveId(id)
              const item = queue.find(s => s.id === id)
              if (item?.isNew) updateShipment(id, { isNew: false })
            }}
          />
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="flex-1 min-w-0 h-full overflow-hidden" style={{ background: '#fff' }}>
            <DetailView
              shipment={selected}
              onBack={() => setActiveId(null)}
              onNavigateChat={onNavigateChat}
              updateShipment={updateShipment}
            />
          </div>
        )}
      </div>
    </div>
  )
}
