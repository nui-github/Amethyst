'use client'
import { useState, useRef, KeyboardEvent } from 'react'
import { Send, Paperclip } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

interface ChatInputProps {
  onSend: (text: string) => void
  onAttach?: () => void
  disabled?: boolean
}

export function ChatInput({ onSend, onAttach, disabled }: ChatInputProps) {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

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
    el.style.height = Math.min(el.scrollHeight, 100) + 'px'
  }

  return (
    <div
      className="px-4 py-3 flex gap-3 items-end"
      style={{ background: '#FFFFFF', borderTop: '1px solid #E8E8E8' }}
    >
      {/* Input wrapper */}
      <div
        ref={wrapRef}
        className="flex-1 flex items-end gap-2 px-4 py-2.5 rounded-2xl transition-all duration-200"
        style={{ background: '#FFFFFF', border: '1px solid #E0E0E0' }}
        onFocus={e => {
          const el = e.currentTarget
          el.style.borderColor = '#0463EF'
          el.style.background = '#fff'
          el.style.boxShadow = '0 0 0 3px rgba(4,99,239,0.10)'
        }}
        onBlur={e => {
          const el = e.currentTarget
          el.style.borderColor = '#E0E0E0'
          el.style.background = '#FFFFFF'
          el.style.boxShadow = 'none'
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
          className="flex-1 bg-transparent text-sm outline-none leading-relaxed border-0 ring-0 focus-visible:ring-0 focus-visible:border-0 p-0 min-h-[20px] max-h-[100px] resize-none"
          style={{ color: '#010136', height: '20px' }}
        />
        <button
          onClick={onAttach}
          className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 transition-colors"
          style={{ color: '#CCCCCC' }}
          onMouseOver={e => { e.currentTarget.style.color = '#0463EF'; e.currentTarget.style.background = 'rgba(4,99,239,0.08)' }}
          onMouseOut={e => { e.currentTarget.style.color = '#CCCCCC'; e.currentTarget.style.background = 'transparent' }}
        >
          <Paperclip size={15} />
        </button>
      </div>

      {/* Send button */}
      <button
        onClick={handleSend}
        disabled={!text.trim() || disabled}
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: 'linear-gradient(135deg, #034DBA, #0463EF)',
          color: '#fff',
          boxShadow: '0 4px 14px rgba(4,99,239,0.3)',
        }}
        onMouseOver={e => { if (!disabled) e.currentTarget.style.boxShadow = '0 6px 18px rgba(4,99,239,0.4)' }}
        onMouseOut={e => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(4,99,239,0.3)' }}
      >
        <Send size={16} />
      </button>
    </div>
  )
}
