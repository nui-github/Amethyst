'use client'
import { useState, useRef, KeyboardEvent } from 'react'
import { Paperclip, CornerDownLeft } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

interface ChatInputProps {
  onSend: (text: string) => void
  onAttach?: () => void
  disabled?: boolean
}

export function ChatInput({ onSend, onAttach, disabled }: ChatInputProps) {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    const val = text.trim()
    if (!val || disabled) return
    onSend(val)
    setText('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const handleInput = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }

  return (
    <div
      className="px-4 py-3 flex justify-center"
      style={{ background: 'transparent' }}
    >
      <div style={{ width: '100%', maxWidth: '680px' }}>
        <div
          className="flex items-end gap-2 px-4 py-3 rounded-2xl transition-all duration-200"
          style={{ background: '#FFFFFF', border: '1px solid #E0E0E0', boxShadow: '0 2px 8px rgba(1,1,54,0.06)' }}
          onFocus={e => {
            const el = e.currentTarget
            el.style.borderColor = '#0463EF'
            el.style.boxShadow = '0 0 0 3px rgba(4,99,239,0.10)'
          }}
          onBlur={e => {
            const el = e.currentTarget
            el.style.borderColor = '#E0E0E0'
            el.style.boxShadow = '0 2px 8px rgba(1,1,54,0.06)'
          }}
        >
          <Textarea
            ref={textareaRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKey}
            onInput={handleInput}
            rows={1}
            placeholder="พิมพ์คำสั่ง เช่น สร้าง RGoods ด้วยใบขน Ref : HTHM000000003..."
            className="flex-1 bg-transparent text-sm outline-none leading-relaxed border-0 ring-0 focus-visible:ring-0 focus-visible:border-0 p-0 min-h-[20px] max-h-[120px] resize-none"
            style={{ color: '#010136', height: '20px' }}
          />
          {/* Attach */}
          <button
            onClick={onAttach}
            className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 transition-colors"
            style={{ color: '#CCCCCC' }}
            onMouseOver={e => { e.currentTarget.style.color = '#0463EF'; e.currentTarget.style.background = 'rgba(4,99,239,0.08)' }}
            onMouseOut={e => { e.currentTarget.style.color = '#CCCCCC'; e.currentTarget.style.background = 'transparent' }}
          >
            <Paperclip size={15} />
          </button>
          {/* Enter hint */}
          <div
            className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg"
            style={{ background: text.trim() ? 'rgba(4,99,239,0.08)' : '#F2F2F2', transition: 'background .15s' }}
          >
            <CornerDownLeft size={12} style={{ color: text.trim() ? '#0463EF' : '#CCCCCC' }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: text.trim() ? '#0463EF' : '#CCCCCC', lineHeight: 1 }}>
              ส่ง
            </span>
          </div>
        </div>
        <p className="text-center mt-1.5" style={{ fontSize: 10, color: '#CCCCCC' }}>
          กด Enter เพื่อส่ง · Shift+Enter ขึ้นบรรทัดใหม่
        </p>
      </div>
    </div>
  )
}
