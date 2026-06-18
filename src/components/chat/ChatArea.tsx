'use client'
import { useEffect, useRef } from 'react'

const CONFIRMED_BTN_HTML = `<span style="display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:700;color:#0D8F61;padding:5px 12px;border-radius:10px;background:rgba(22,234,158,0.15)">✓ ยืนยันแล้ว</span>`

function applyConfirmedFlags(ids: string[]) {
  for (const id of ids) {
    const el = document.getElementById(id)
    if (el) { el.style.background = 'rgba(22,234,158,0.06)'; el.style.border = '1.5px solid rgba(22,234,158,0.4)' }
    const btn = document.getElementById(id + '_btn')
    if (btn && !btn.innerHTML.includes('ยืนยันแล้ว')) btn.innerHTML = CONFIRMED_BTN_HTML
  }
}
import { ChatMessage, UploadSlots, SPNEntry } from '@/lib/types'
import { TypingIndicator }   from './TypingIndicator'
import { FormPanel }         from './FormPanel'
import { FullUploadPanel }   from './FullUploadPanel'
import { OcrProgress }       from './OcrProgress'
import { QuickChips }        from './QuickChips'
import { ConnectPanel }      from './ConnectPanel'
import { SPNListPanel }      from './SPNListPanel'
import { User }              from 'lucide-react'

interface ChatAreaProps {
  messages: ChatMessage[]
  isTyping: boolean
  ocrProgress: number
  ocrStages: string[]
  formValues: Record<string, string>
  currentStep: string
  pendingRef: string
  confirmedFlagIds: string[]
  spnEntries: SPNEntry[]
  onFormChange: (key: string, val: string) => void
  onPreview: () => void
  onFullUploadOCR: (slots: UploadSlots) => void
  onQuickSend: (text: string) => void
  onConnected: (ref: string) => void
  onRequestPermit: (refs: string[]) => void
}

const WELCOME_CHIPS = [
  { label: 'สร้าง RGoods',    value: 'สร้าง RGoods' },
  { label: 'ดูสถานะใบขน',    value: 'ดูสถานะใบขน HTHM000000003' },
  { label: 'ใบอนุญาตนำเข้า', value: 'สร้างใบอนุญาตนำเข้า' },
  { label: 'อัปโหลดเอกสาร',  value: 'upload เอกสาร Invoice' },
]

function WelcomeMessage({ onQuickSend }: { onQuickSend: (v: string) => void }) {
  return (
    <div>
      <p className="text-sm leading-relaxed" style={{ color: '#010136' }}>
        สวัสดีครับ! ผมคือ <strong>ShippingNet Assistant</strong> 👋<br />
        ช่วยท่านสร้างใบอนุญาต, RGoods, และจัดการเอกสารศุลกากรได้ครับ
      </p>
      <p className="text-[11px] font-bold uppercase tracking-wider mt-3 mb-1" style={{ color: '#999999' }}>
        สิ่งที่ทำได้:
      </p>
      <QuickChips chips={WELCOME_CHIPS} onSelect={onQuickSend} />
    </div>
  )
}

export function ChatArea({
  messages, isTyping, ocrProgress, ocrStages,
  formValues, currentStep, pendingRef, spnEntries, confirmedFlagIds,
  onFormChange, onPreview, onFullUploadOCR, onQuickSend, onConnected, onRequestPermit,
}: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping])
  useEffect(() => { applyConfirmedFlags(confirmedFlagIds) }, [messages, confirmedFlagIds])

  return (
    <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4" style={{ background: '#F2F2F2' }}>
      {messages.map(msg => (
        <MessageRow
          key={msg.id} msg={msg}
          ocrProgress={ocrProgress} ocrStages={ocrStages}
          formValues={formValues} currentStep={currentStep}
          pendingRef={pendingRef} spnEntries={spnEntries}
          onFormChange={onFormChange} onPreview={onPreview}
          onFullUploadOCR={onFullUploadOCR} onQuickSend={onQuickSend}
          onConnected={onConnected} onRequestPermit={onRequestPermit}
        />
      ))}
      {isTyping && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  )
}

interface MessageRowProps {
  msg: ChatMessage
  ocrProgress: number; ocrStages: string[]
  formValues: Record<string, string>; currentStep: string
  pendingRef: string
  spnEntries: SPNEntry[]
  onFormChange: (k: string, v: string) => void
  onPreview: () => void
  onFullUploadOCR: (slots: UploadSlots) => void
  onQuickSend: (text: string) => void
  onConnected: (ref: string) => void
  onRequestPermit: (refs: string[]) => void
}

function MessageRow({ msg, ocrProgress, ocrStages, formValues, onFormChange, onPreview, onFullUploadOCR, onQuickSend, pendingRef, spnEntries, onConnected, onRequestPermit }: MessageRowProps) {
  // User bubble
  if (msg.role === 'user') {
    return (
      <div className="flex items-end gap-2.5 flex-row-reverse msg-appear">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #40406A, #0463EF)', boxShadow: '0 2px 8px rgba(4,99,239,0.25)' }}
        >
          <User size={14} />
        </div>
        <div>
          <div
            className="text-sm px-4 py-2.5 rounded-2xl rounded-br-sm text-white max-w-xs"
            style={{ background: 'linear-gradient(135deg, #034DBA, #0463EF)', boxShadow: '0 4px 14px rgba(4,99,239,0.25)' }}
          >
            {msg.content}
          </div>
          <p className="text-[10px] mt-1 text-right" style={{ color: '#999999' }}>{msg.time}</p>
        </div>
      </div>
    )
  }

  // Bot bubble — centered full-width card
  const SPECIALS = ['welcome','ocr_progress','show_form','show_full_upload','show_connect','show_spn_list']
  return (
    <div className="flex flex-col items-center w-full msg-appear">
      <div className="w-full" style={{ maxWidth: '680px' }}>
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #010136, #0463EF)', boxShadow: '0 2px 8px rgba(4,99,239,0.28)' }}
          >AI</div>
          <span className="text-[11px] font-semibold" style={{ color: '#8080A5' }}>ShippingNet Assistant</span>
        </div>
        <div
          className="rounded-2xl px-5 py-4 leading-relaxed w-full"
          style={{ background: '#fff', border: '1px solid #DDE1F8', boxShadow: '0 2px 12px rgba(4,10,80,0.07)', color: '#010136', fontSize: '13px' }}
        >
          {msg.content === 'welcome' && <WelcomeMessage onQuickSend={onQuickSend} />}
          {msg.content === 'ocr_progress' && <OcrProgress progress={ocrProgress} completedStages={ocrStages} />}
          {msg.content === 'show_form' && (
            <>
              <div className="flex items-center gap-2 text-sm font-semibold mb-2" style={{ color: '#0D8F61' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0D8F61" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                OCR อ่านข้อมูลได้แล้วครับ กรุณาตรวจสอบและกรอกข้อมูลที่ขาด:
              </div>
              <FormPanel formValues={formValues} onChange={onFormChange} onPreview={onPreview} />
            </>
          )}
          {msg.content === 'show_connect' && (
            <ConnectPanel onConnect={() => onConnected(pendingRef)} />
          )}
          {msg.content === 'show_spn_list' && (
            <SPNListPanel entries={spnEntries} onRequestPermit={onRequestPermit} />
          )}
          {msg.content === 'show_full_upload' && (
            <>
              <p className="text-sm font-semibold mb-1 flex items-center gap-1.5" style={{ color: '#010136' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                <strong>อัปโหลดเอกสารทั้งหมด</strong> เพื่อให้ระบบ OCR ดึงข้อมูลแทนการค้นหาจาก SPN
              </p>
              <FullUploadPanel onStartOCR={onFullUploadOCR} />
            </>
          )}
          {!SPECIALS.includes(msg.content) && msg.isHtml  && <div dangerouslySetInnerHTML={{ __html: msg.content }} />}
          {!SPECIALS.includes(msg.content) && !msg.isHtml && msg.content}
        </div>
        <p className="text-[10px] mt-1 ml-1" style={{ color: '#999999' }}>{msg.time}</p>
      </div>
    </div>
  )
}
