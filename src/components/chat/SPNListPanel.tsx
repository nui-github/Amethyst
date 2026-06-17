'use client'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, CheckSquare, Square, FileCheck2, Plus } from 'lucide-react'
import type { SPNEntry } from '@/lib/types'

const PAGE_SIZE = 5

interface SPNListPanelProps {
  entries: SPNEntry[]
  onRequestPermit: (refs: string[]) => void
}

export function SPNListPanel({ entries, onRequestPermit }: SPNListPanelProps) {
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState<string[]>([])

  const totalPages = Math.ceil(entries.length / PAGE_SIZE)
  const pageEntries = entries.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const pageRefs = pageEntries.filter(e => !e.inQueue).map(e => e.ref)
  const allPageSelected = pageRefs.length > 0 && pageRefs.every(r => selected.includes(r))

  const toggle = (ref: string) =>
    setSelected(prev => prev.includes(ref) ? prev.filter(r => r !== ref) : [...prev, ref])

  const togglePage = () =>
    setSelected(prev =>
      allPageSelected
        ? prev.filter(r => !pageRefs.includes(r))
        : Array.from(new Set([...prev, ...pageRefs]))
    )

  return (
    <div>
      <p className="text-xs font-semibold mb-2" style={{ color: '#010136' }}>
        รายการใบขนสินค้าใน ShippingNet — เลือกรายการที่ต้องการขอใบอนุญาต
      </p>

      {/* Bulk action bar */}
      {selected.length > 0 && (
        <div className="flex items-center justify-between mb-2 px-3 py-2 rounded-xl"
          style={{ background: 'rgba(4,99,239,0.08)', border: '1px solid rgba(4,99,239,0.2)' }}>
          <span className="text-xs font-semibold" style={{ color: '#0463EF' }}>
            เลือก {selected.length} รายการ
          </span>
          <button
            onClick={() => onRequestPermit(selected)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#034DBA,#0463EF)' }}
          >
            <Plus size={11} /> ขอใบอนุญาตทั้งหมด
          </button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #E0E0E0' }}>
        {/* Header */}
        <div className="flex items-center px-3 py-2 gap-2" style={{ background: '#F0F0F0', borderBottom: '1px solid #E0E0E0' }}>
          <button onClick={togglePage} className="flex-shrink-0">
            {allPageSelected
              ? <CheckSquare size={14} style={{ color: '#0463EF' }} />
              : <Square size={14} style={{ color: '#CCCCCC' }} />
            }
          </button>
          <span className="text-[10px] font-bold uppercase tracking-wide flex-shrink-0" style={{ color: '#999', width: 88 }}>Ref / ใบขน</span>
          <span className="text-[10px] font-bold uppercase tracking-wide flex-1" style={{ color: '#999' }}>สินค้า / ผู้นำเข้า</span>
          <span className="text-[10px] font-bold uppercase tracking-wide flex-shrink-0" style={{ color: '#999', width: 56 }}>วันที่</span>
          <span style={{ width: 72 }} />
        </div>

        {/* Rows */}
        {pageEntries.map(entry => {
          const isSel = selected.includes(entry.ref)
          const inQueue = !!entry.inQueue
          return (
            <div
              key={entry.ref}
              className="flex items-center px-3 py-2.5 gap-2"
              style={{
                borderBottom: '1px solid #F3F4F6',
                background: isSel ? 'rgba(4,99,239,0.04)' : '#fff',
                opacity: inQueue ? 0.55 : 1,
              }}
            >
              {/* Checkbox */}
              <button
                onClick={() => !inQueue && toggle(entry.ref)}
                className="flex-shrink-0"
                disabled={inQueue}
              >
                {isSel
                  ? <CheckSquare size={14} style={{ color: '#0463EF' }} />
                  : <Square size={14} style={{ color: inQueue ? '#E0E0E0' : '#CCCCCC' }} />
                }
              </button>

              {/* Ref */}
              <div className="flex-shrink-0" style={{ width: 88 }}>
                <p className="text-[10px] font-bold" style={{ color: '#0463EF' }}>{entry.ref}</p>
                <p className="text-[9px]" style={{ color: '#999' }}>{entry.hs}</p>
              </div>

              {/* Goods / importer */}
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold truncate" style={{ color: '#010136' }}>{entry.goods}</p>
                <p className="text-[10px] truncate" style={{ color: '#999' }}>{entry.importer}</p>
              </div>

              {/* Date */}
              <span className="text-[10px] flex-shrink-0" style={{ color: '#999', width: 56 }}>{entry.date}</span>

              {/* Action */}
              <div style={{ width: 72 }} className="flex justify-end flex-shrink-0">
                {inQueue ? (
                  <span className="flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ background: '#ECFDF5', color: '#065F46' }}>
                    <FileCheck2 size={9} /> ในคิว
                  </span>
                ) : (
                  <button
                    onClick={() => onRequestPermit([entry.ref])}
                    className="text-[10px] font-bold px-2 py-1 rounded-lg"
                    style={{ background: 'rgba(4,99,239,0.10)', color: '#0463EF' }}
                  >
                    ขอใบอนุญาต
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px]" style={{ color: '#999' }}>
          แสดง {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, entries.length)} จาก {entries.length} รายการ
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={page === 0}
            className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: page === 0 ? '#F3F4F6' : '#fff', border: '1px solid #E0E0E0', color: page === 0 ? '#CCCCCC' : '#666' }}
          >
            <ChevronLeft size={12} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className="w-6 h-6 rounded-lg text-[10px] font-bold"
              style={{
                background: page === i ? '#0463EF' : '#fff',
                border: `1px solid ${page === i ? '#0463EF' : '#E0E0E0'}`,
                color: page === i ? '#fff' : '#666',
              }}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page === totalPages - 1}
            className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: page === totalPages - 1 ? '#F3F4F6' : '#fff', border: '1px solid #E0E0E0', color: page === totalPages - 1 ? '#CCCCCC' : '#666' }}
          >
            <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}
