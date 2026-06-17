'use client'
import { useState } from 'react'
import { ChevronLeft, AlertTriangle, CheckCircle2, Mail, Clock, FileCheck2, Search, Filter, RotateCcw, Send } from 'lucide-react'
import { MOCK_QUEUE, AGENCY_LABEL, AGENCY_SHORT, STATUS_META } from '@/lib/mock/queue'
import type { Shipment, ShipmentStatus } from '@/lib/types'

const FILTERS: { key: ShipmentStatus | 'all'; label: string }[] = [
  { key: 'all',           label: 'ทั้งหมด' },
  { key: 'needs_you',     label: 'รอคุณยืนยัน' },
  { key: 'email_outbox',  label: 'ร่างอีเมลรอส่ง' },
  { key: 'await_customer',label: 'รอลูกค้ายืนยัน' },
  { key: 'no_permit',     label: 'ไม่ต้องขอใบอนุญาต' },
  { key: 'submitted',     label: 'ยื่นกรมแล้ว' },
]

const STAGE_LABELS = ['', 'ตรวจรับใบขน', 'วิเคราะห์ HS', 'จัดประเภทหน่วยงาน', 'ร่างใบอนุญาต', 'ตรวจ flag', 'ยืนยันร่าง', 'แจ้งลูกค้า', 'ยื่นกรม']

function StatusIcon({ s }: { s: ShipmentStatus }) {
  if (s === 'needs_you')     return <AlertTriangle size={13} style={{ color: '#F59E0B' }} />
  if (s === 'email_outbox')  return <Mail size={13} style={{ color: '#3B82F6' }} />
  if (s === 'await_customer')return <Clock size={13} style={{ color: '#7C3AED' }} />
  if (s === 'submitted')     return <CheckCircle2 size={13} style={{ color: '#10B981' }} />
  return <FileCheck2 size={13} style={{ color: '#9CA3AF' }} />
}

function ConfBar({ val, size = 'md' }: { val: number; size?: 'sm' | 'md' }) {
  const h = size === 'sm' ? 4 : 6
  const color = val >= 85 ? '#10B981' : val >= 70 ? '#F59E0B' : '#EF4444'
  return (
    <div className="flex items-center gap-1.5">
      <div style={{ height: h, width: size === 'sm' ? 48 : 64, background: '#E5E7EB', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${val}%`, background: color, borderRadius: 99, transition: 'width .4s' }} />
      </div>
      <span style={{ fontSize: 11, color, fontWeight: 600 }}>{val}%</span>
    </div>
  )
}

// ── List view ────────────────────────────────────────────────────────────────

function ListView({ filter, search, onSelect }: { filter: ShipmentStatus | 'all'; search: string; onSelect: (id: string) => void }) {
  const needs = MOCK_QUEUE.filter(s => s.statusKey === 'needs_you').length
  const outbox = MOCK_QUEUE.filter(s => s.statusKey === 'email_outbox').length

  const rows = MOCK_QUEUE.filter(s => {
    if (filter !== 'all' && s.statusKey !== filter) return false
    if (!search) return true
    const q = search.toLowerCase()
    return (
      s.id.toLowerCase().includes(q) ||
      s.customer.toLowerCase().includes(q) ||
      s.goods.toLowerCase().includes(q) ||
      (s.hthmRef ?? '').toLowerCase().includes(q)
    )
  })

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex-shrink-0" style={{ borderBottom: '1px solid #E5E7EB' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold" style={{ color: '#010136' }}>คิวงานพิธีการ</h2>
            <p className="text-xs" style={{ color: '#999' }}>วันนี้ {MOCK_QUEUE.length} รายการ · ประมวลผลโดย AI อัตโนมัติ</p>
          </div>
          <div className="flex items-center gap-2">
            {needs > 0 && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{ background: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A' }}>
                <AlertTriangle size={11} /> {needs} รอคุณ
              </span>
            )}
            {outbox > 0 && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' }}>
                <Mail size={11} /> {outbox} ร่างอีเมล
              </span>
            )}
          </div>
        </div>

        {/* Search + filter */}
        <div className="flex gap-3">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
            <Search size={13} style={{ color: '#9CA3AF', flexShrink: 0 }} />
            <input
              type="text" readOnly placeholder="ค้นหา..." className="flex-1 text-sm bg-transparent outline-none"
              style={{ color: '#374151' }}
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm"
            style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#6B7280' }}>
            <Filter size={13} />
            ตัวกรอง
          </button>
        </div>
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
            key={s.id}
            onClick={() => onSelect(s.id)}
            className="w-full text-left px-6 py-4 flex items-start gap-4 hover:bg-blue-50 transition-colors"
            style={{ borderBottom: '1px solid #F3F4F6' }}
          >
            {/* Left accent */}
            <div className="flex-shrink-0 w-1 h-12 rounded-full mt-0.5"
              style={{ background: STATUS_META[s.statusKey].dot }} />

            {/* Main */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-bold" style={{ color: '#010136' }}>{s.id}</span>
                {s.hthmRef && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: '#EFF6FF', color: '#1D4ED8' }}>
                    {s.hthmRef}
                  </span>
                )}
                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: '#F3F4F6', color: '#6B7280' }}>
                  {AGENCY_SHORT[s.agency]}
                </span>
              </div>
              <p className="text-xs truncate mb-1" style={{ color: '#374151' }}>{s.customer}</p>
              <p className="text-xs truncate" style={{ color: '#9CA3AF' }}>{s.goods}</p>
            </div>

            {/* Right */}
            <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
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

function DetailView({ shipment, onBack }: { shipment: Shipment; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'assess' | 'draft' | 'email' | 'audit'>('assess')
  const meta = STATUS_META[shipment.statusKey]
  const openFlags = shipment.flags.filter(f => !f.resolved)
  const resolvedFlags = shipment.flags.filter(f => f.resolved)

  return (
    <div className="flex flex-col h-full">
      {/* Breadcrumb + status */}
      <div className="px-6 pt-5 pb-4 flex-shrink-0" style={{ borderBottom: '1px solid #E5E7EB' }}>
        <button onClick={onBack} className="flex items-center gap-1 text-xs mb-3" style={{ color: '#6B7280' }}>
          <ChevronLeft size={13} /> กลับคิวงาน
        </button>

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-base font-bold" style={{ color: '#010136' }}>{shipment.id}</h2>
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
        <div className="flex items-center gap-1 mt-4 overflow-x-auto pb-1">
          {STAGE_LABELS.slice(1).map((label, i) => {
            const step = i + 1
            const done = step < shipment.stage
            const active = step === shipment.stage
            return (
              <div key={step} className="flex items-center gap-1 flex-shrink-0">
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                    style={{
                      background: done ? '#10B981' : active ? '#0463EF' : '#E5E7EB',
                      color: done || active ? '#fff' : '#9CA3AF',
                    }}>
                    {done ? '✓' : step}
                  </div>
                  <span className="text-[9px] text-center whitespace-nowrap" style={{ color: done ? '#10B981' : active ? '#0463EF' : '#9CA3AF' }}>
                    {label}
                  </span>
                </div>
                {i < 7 && <div className="w-4 h-px flex-shrink-0 mb-3" style={{ background: done ? '#10B981' : '#E5E7EB' }} />}
              </div>
            )
          })}
        </div>
      </div>

      {/* Flags banner */}
      {openFlags.length > 0 && (
        <div className="mx-6 mt-4 rounded-xl px-4 py-3 flex items-start gap-2 flex-shrink-0"
          style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
          <AlertTriangle size={15} style={{ color: '#F59E0B', flexShrink: 0, marginTop: 1 }} />
          <div>
            <p className="text-xs font-semibold mb-0.5" style={{ color: '#B45309' }}>
              พบ {openFlags.length} จุดที่ต้องตรวจสอบ
            </p>
            {openFlags.map(f => (
              <p key={f.id} className="text-xs" style={{ color: '#92400E' }}>· {f.title}</p>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-0 px-6 mt-4 flex-shrink-0" style={{ borderBottom: '1px solid #E5E7EB' }}>
        {([
          { id: 'assess', label: 'การประเมิน' },
          { id: 'draft',  label: `ร่างคำขอ${shipment.flags.length > 0 ? ` (${shipment.flags.length})` : ''}` },
          { id: 'email',  label: 'ร่างอีเมล' },
          { id: 'audit',  label: 'ประวัติ' },
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-4 py-2 text-xs font-semibold"
            style={{
              color: activeTab === tab.id ? '#0463EF' : '#9CA3AF',
              borderBottom: activeTab === tab.id ? '2px solid #0463EF' : '2px solid transparent',
              marginBottom: -1,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">

        {activeTab === 'assess' && (
          <div className="space-y-4">
            {/* AI Assessment */}
            <Section title="ผลการประเมิน AI">
              <Row label="ต้องขออนุญาต" value={shipment.permitNeeded ? 'ใช่' : 'ไม่ใช่'} highlight={shipment.permitNeeded} />
              <Row label="หน่วยงานที่รับผิดชอบ" value={AGENCY_LABEL[shipment.agency]} />
              <Row label="แบบฟอร์ม" value={`${shipment.formCode} — ${shipment.formName}`} />
              <div className="mt-2 p-3 rounded-lg text-xs leading-relaxed" style={{ background: '#F9FAFB', color: '#374151', border: '1px solid #E5E7EB' }}>
                {shipment.assess.reason}
              </div>
            </Section>

            {/* Classification */}
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
          </div>
        )}

        {activeTab === 'draft' && (
          <div className="space-y-4">
            <Section title="ข้อมูลในร่างคำขอ">
              {shipment.draft.fields.length === 0
                ? <p className="text-xs" style={{ color: '#9CA3AF' }}>ไม่มีร่างคำขอ</p>
                : shipment.draft.fields.map((f, i) => {
                    const flagObj = f.flag ? shipment.flags.find(fl => fl.id === f.flag) : null
                    return (
                      <div key={i} className="flex items-start gap-2 py-1.5" style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <span className="text-xs flex-1" style={{ color: '#6B7280' }}>{f.label}</span>
                        <span className="text-xs font-medium text-right flex-1" style={{ color: '#010136' }}>{f.value}</span>
                        {flagObj && !flagObj.resolved && (
                          <AlertTriangle size={11} style={{ color: '#F59E0B', flexShrink: 0, marginTop: 2 }} />
                        )}
                        {flagObj && flagObj.resolved && (
                          <CheckCircle2 size={11} style={{ color: '#10B981', flexShrink: 0, marginTop: 2 }} />
                        )}
                      </div>
                    )
                  })}
            </Section>

            {shipment.flags.length > 0 && (
              <Section title="จุดตรวจสอบ (Flags)">
                <div className="space-y-2">
                  {shipment.flags.map(f => (
                    <div key={f.id} className="p-3 rounded-lg" style={{
                      background: f.resolved ? '#F0FDF4' : '#FFFBEB',
                      border: `1px solid ${f.resolved ? '#BBF7D0' : '#FDE68A'}`
                    }}>
                      <div className="flex items-center gap-1.5 mb-1">
                        {f.resolved
                          ? <CheckCircle2 size={12} style={{ color: '#10B981' }} />
                          : <AlertTriangle size={12} style={{ color: '#F59E0B' }} />
                        }
                        <span className="text-xs font-semibold" style={{ color: f.resolved ? '#065F46' : '#92400E' }}>{f.title}</span>
                        <span className="ml-auto text-[10px]" style={{ color: f.resolved ? '#10B981' : '#F59E0B' }}>{f.conf}%</span>
                      </div>
                      <p className="text-xs" style={{ color: f.resolved ? '#065F46' : '#92400E' }}>{f.detail}</p>
                      {f.resolved && (
                        <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: '#D1FAE5', color: '#065F46' }}>
                          แก้ไขแล้ว
                        </span>
                      )}
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
                {shipment.email.attName && (
                  <Row label="แนบไฟล์" value={shipment.email.attName} />
                )}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: '#9CA3AF' }}>เนื้อหา</p>
                  <div className="p-3 rounded-lg text-xs leading-relaxed whitespace-pre-line"
                    style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#374151' }}>
                    {shipment.email.body}
                  </div>
                </div>
                <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white mt-2"
                  style={{ background: 'linear-gradient(135deg, #034DBA, #0463EF)' }}>
                  <Send size={14} /> ส่งอีเมล
                </button>
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
                    {i < shipment.audit.length - 1 && (
                      <div className="w-px flex-1 mt-1" style={{ background: '#E5E7EB' }} />
                    )}
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
      {shipment.statusKey === 'needs_you' && (
        <div className="flex-shrink-0 px-6 py-4 flex gap-3" style={{ borderTop: '1px solid #E5E7EB', background: '#fff' }}>
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: '#F3F4F6', color: '#6B7280' }}>
            <RotateCcw size={14} /> ส่งกลับ AI
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #11BB7F, #16EA9E)' }}>
            <CheckCircle2 size={14} /> ยืนยันและดำเนินการต่อ
          </button>
        </div>
      )}
      {shipment.statusKey === 'email_outbox' && (
        <div className="flex-shrink-0 px-6 py-4 flex gap-3" style={{ borderTop: '1px solid #E5E7EB', background: '#fff' }}>
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #034DBA, #0463EF)' }}>
            <Send size={14} /> ส่งอีเมลหาลูกค้า
          </button>
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
      <div className="rounded-xl p-3" style={{ background: '#fff', border: '1px solid #E5E7EB' }}>
        {children}
      </div>
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

export function QueuePage() {
  const [filter, setFilter] = useState<ShipmentStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [activeId, setActiveId] = useState<string | null>(null)

  const selected = activeId ? MOCK_QUEUE.find(s => s.id === activeId) ?? null : null

  return (
    <div className="flex h-full" style={{ background: '#F9FAFB' }}>
      {/* Sidebar — filter tabs */}
      <div className="w-48 flex-shrink-0 h-full overflow-y-auto py-4" style={{ borderRight: '1px solid #E5E7EB', background: '#fff' }}>
        <p className="px-4 text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#9CA3AF' }}>สถานะ</p>
        {FILTERS.map(f => {
          const count = f.key === 'all' ? MOCK_QUEUE.length : MOCK_QUEUE.filter(s => s.statusKey === f.key).length
          return (
            <button
              key={f.key}
              onClick={() => { setFilter(f.key); setActiveId(null) }}
              className="w-full flex items-center justify-between px-4 py-2 text-xs text-left"
              style={{
                background: filter === f.key ? '#EFF6FF' : 'transparent',
                color: filter === f.key ? '#1D4ED8' : '#6B7280',
                fontWeight: filter === f.key ? 600 : 400,
                borderRight: filter === f.key ? '2px solid #0463EF' : '2px solid transparent',
              }}
            >
              {f.label}
              <span className="text-[10px] px-1.5 py-0.5 rounded-full"
                style={{ background: filter === f.key ? '#DBEAFE' : '#F3F4F6', color: filter === f.key ? '#1D4ED8' : '#9CA3AF' }}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Main panel */}
      <div className="flex-1 min-w-0 h-full overflow-hidden">
        {selected
          ? <DetailView shipment={selected} onBack={() => setActiveId(null)} />
          : <ListView filter={filter} search={search} onSelect={setActiveId} />
        }
      </div>
    </div>
  )
}
