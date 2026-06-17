'use client'
import { useEffect, useRef } from 'react'
import { ChatMessage, UploadSlots } from '@/lib/types'
import { TypingIndicator }   from './TypingIndicator'
import { FormPanel }         from './FormPanel'
import { FullUploadPanel }   from './FullUploadPanel'
import { OcrProgress }       from './OcrProgress'
import { QuickChips }        from './QuickChips'
import { User }              from 'lucide-react'

interface ChatAreaProps {
  messages: ChatMessage[]
  isTyping: boolean
  ocrProgress: number
  ocrStages: string[]
  formValues: Record<string, string>
  currentStep: string
  onFormChange: (key: string, val: string) => void
  onPreview: () => void
  onFullUploadOCR: (slots: UploadSlots) => void
  onQuickSend: (text: string) => void
}

const WELCOME_CHIPS = [
  { label: 'สร้าง RGoods',    value: 'สร้าง RGoods ด้วยใบขน Ref : HTHM000000003' },
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
  formValues, currentStep,
  onFormChange, onPreview, onFullUploadOCR, onQuickSend,
}: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping])

  return (
    <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4" style={{ background: '#F2F2F2' }}>
      {messages.map(msg => (
        <MessageRow
          key={msg.id} msg={msg}
          ocrProgress={ocrProgress} ocrStages={ocrStages}
          formValues={formValues} currentStep={currentStep}
          onFormChange={onFormChange} onPreview={onPreview}
          onFullUploadOCR={onFullUploadOCR} onQuickSend={onQuickSend}
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
  onFormChange: (k: string, v: string) => void
  onPreview: () => void
  onFullUploadOCR: (slots: UploadSlots) => void
  onQuickSend: (text: string) => void
}

function MessageRow({ msg, ocrProgress, ocrStages, formValues, onFormChange, onPreview, onFullUploadOCR, onQuickSend }: MessageRowProps) {
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

  // Bot bubble — special content types
  const SPECIALS = ['welcome','ocr_progress','show_form','show_full_upload']
  return (
    <div className="flex items-end gap-2.5 msg-appear">
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #010136, #0463EF)', boxShadow: '0 3px 10px rgba(4,99,239,0.28)' }}
      >
        AI
      </div>
      <div className="max-w-[85%]">
        <div
          className="rounded-2xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed"
          style={{ background: '#fff', border: '1px solid #DDE1F8', boxShadow: '0 2px 10px rgba(4,10,80,0.06)', color: '#010136' }}
        >
          {msg.content === 'welcome' && <WelcomeMessage onQuickSend={onQuickSend} />}
          {msg.content === 'ocr_progress' && <OcrProgress progress={ocrProgress} completedStages={ocrStages} />}
          {msg.content === 'show_form' && (
            <>
              <div className="flex items-center gap-2 text-sm font-semibold mb-2" style={{ color: '#0D8F61' }}>
                ✅ OCR อ่านข้อมูลได้แล้วครับ กรุณาตรวจสอบและกรอกข้อมูลที่ขาด:
              </div>
              <FormPanel formValues={formValues} onChange={onFormChange} onPreview={onPreview} />
            </>
          )}
          {msg.content === 'show_full_upload' && (
            <>
              <p className="text-sm font-semibold mb-1" style={{ color: '#010136' }}>
                📂 <strong>อัปโหลดเอกสารทั้งหมด</strong> เพื่อให้ระบบ OCR ดึงข้อมูลแทนการค้นหาจาก SPN
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
