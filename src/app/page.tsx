'use client'
import { useState, useCallback, useEffect } from 'react'
import { Sidebar }    from '@/components/chat/Sidebar'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { ChatArea }   from '@/components/chat/ChatArea'
import { ChatInput }  from '@/components/chat/ChatInput'
import { QuickActionBar } from '@/components/chat/QuickActionBar'
import { PreviewModal, ConfirmModal } from '@/components/chat/Modals'
import { QueuePage } from '@/components/queue/QueuePage'
import { ChatMessage, ChatStep, FormData, UploadSlots, Shipment, SPNEntry } from '@/lib/types'
import { generateId, getTime } from '@/lib/utils'
import { fetchSPN as fetchSPNApi } from '@/lib/api/spn'
import { MOCK_QUEUE, STATUS_META, AGENCY_SHORT } from '@/lib/mock/queue'
import { MOCK_SPN_LIST } from '@/lib/mock/spn_list'
import { useOCRFlow, type OCRResult } from '@/hooks/useOCRFlow'

// ── BizX inline HTML helpers ─────────────────────────────────────────
const C = {
  navy:      '#010136',
  blue:      '#0463EF',
  blueDeep:  '#034DBA',
  teal:      '#16EA9E',
  tealMid:   '#11BB7F',
  tealDark:  '#0D8F61',
  n50:       '#F9F9F9',
  n100:      '#F0F0F0',
  n200:      '#E0E0E0',
  n300:      '#CCCCCC',
  n500:      '#999999',
  n600:      '#666666',
}

const btnPrimary  = `display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:10px;background:linear-gradient(135deg,${C.blueDeep},${C.blue});color:#fff;font-size:12px;font-weight:700;border:none;cursor:pointer;box-shadow:0 4px 12px rgba(4,99,239,0.28);transition:all .15s`
const btnSecondary= `display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:10px;background:${C.n100};color:${C.n600};font-size:12px;font-weight:600;border:1px solid ${C.n200};cursor:pointer;transition:all .15s`
const chipStyle   = `padding:5px 11px;border-radius:20px;border:1px solid rgba(4,99,239,0.25);background:rgba(4,99,239,0.08);color:${C.blue};font-size:11px;font-weight:600;cursor:pointer;transition:all .15s`
const cardWrap    = `border-radius:14px;border:1px solid ${C.n200};overflow:hidden;box-shadow:0 2px 10px rgba(1,1,54,0.06);margin-top:10px`
const cardHead    = `padding:8px 14px;background:${C.n100};border-bottom:1px solid ${C.n200};font-size:12px;font-weight:700;color:${C.navy}`
const cardBody    = `padding:12px 14px;background:#fff`
const rowStyle    = `display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px dashed ${C.n200};font-size:12px`
const badgeSPN    = `display:inline-flex;padding:2px 7px;border-radius:20px;font-size:10px;font-weight:700;background:rgba(4,99,239,0.10);color:${C.blue}`
const badgeOCR    = `display:inline-flex;padding:2px 7px;border-radius:20px;font-size:10px;font-weight:700;background:rgba(22,234,158,0.15);color:${C.tealDark}`
const badgeUser   = `display:inline-flex;padding:2px 7px;border-radius:20px;font-size:10px;font-weight:700;background:rgba(255,165,0,0.12);color:#B45309`
const badgeBlue   = `display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;background:rgba(4,99,239,0.10);color:${C.blue}`
const badgeAmber  = `display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;background:rgba(255,165,0,0.12);color:#B45309`
const badgeGreen  = `display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;background:rgba(22,234,158,0.15);color:${C.tealDark}`

// ── Inline SVG helpers (for dangerouslySetInnerHTML contexts) ────────
const ic = (path: string, size = 16, color = 'currentColor') =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;flex-shrink:0">${path}</svg>`

const icCheck   = (c='#0D8F61', s=16) => ic('<path d="M20 6 9 17l-5-5"/>', s, c)
const icX       = (c='#C0392B', s=16) => ic('<path d="M18 6 6 18M6 6l12 12"/>', s, c)
const icWarn    = (c='#B45309', s=16) => ic('<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>', s, c)
const icFile    = (c='#1565C0', s=16) => ic('<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>', s, c)
const icList    = (c='#0463EF', s=16) => ic('<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>', s, c)
const icPlus    = (c='#0D8F61', s=16) => ic('<path d="M5 12h14M12 5v14"/>', s, c)
const icFolder  = (c='#B45309', s=16) => ic('<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>', s, c)
const icFolderOpen = (c='#0463EF', s=32) => ic('<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>', s, c)
const icSearch  = (c='#0463EF', s=16) => ic('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>', s, c)
const icShip    = (c='#0D8F61', s=18) => ic('<path d="M18 18V5H6v13"/><path d="M2 18h20"/><path d="M12 12v6"/><path d="M12 5V2"/><path d="M8 12h8"/>', s, c)
const icUpload  = (c='#0463EF', s=32) => ic('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>', s, c)

const WELCOME: ChatMessage = { id: 'welcome', role: 'bot', content: 'welcome', time: '09:00', isHtml: true }

export default function Home() {
  const [sidebarActive, setSidebarActive] = useState('chatbot')
  const [queueOpenId, setQueueOpenId]     = useState<string | null>(null)
  const [queue, setQueue]                 = useState<Shipment[]>(MOCK_QUEUE)
  const [spnEntries, setSpnEntries]       = useState<SPNEntry[]>(MOCK_SPN_LIST)
  const [messages, setMessages]           = useState<ChatMessage[]>([WELCOME])
  const [isTyping, setIsTyping]           = useState(false)
  const [step, setStep]                   = useState<ChatStep>('idle')
  const [formData, setFormData]           = useState<Partial<FormData>>({})
  const [formValues, setFormValues]       = useState<Record<string, string>>({})
  const { ocrProgress, ocrStages, isOCRing, startOCR: runOCRFlow } = useOCRFlow()
  const [showPreview, setShowPreview]     = useState(false)
  const [showConfirm, setShowConfirm]     = useState(false)
  const [currentRef, setCurrentRef]       = useState('')
  const [isConnected, setIsConnected]     = useState(false)
  const [pendingRef, setPendingRef]        = useState('')

  const needsYouCount = queue.filter(s => s.statusKey === 'needs_you').length

  const updateShipment = useCallback((id: string, patch: Partial<Shipment>) =>
    setQueue(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s)), [])

  const addToQueue = useCallback((newItems: Shipment[]) =>
    setQueue(prev => {
      const existingIds = new Set(prev.map(s => s.id))
      return [...prev, ...newItems.filter(s => !existingIds.has(s.id))]
    }), [])

  const addMessage = useCallback((msg: Omit<ChatMessage,'id'|'time'>): ChatMessage => {
    const m: ChatMessage = { ...msg, id: generateId(), time: getTime() }
    setMessages(prev => [...prev, m])
    return m
  }, [])

  const botMsg  = useCallback((content: string) => addMessage({ role:'bot', content, isHtml:true }), [addMessage])
  const userMsg = useCallback((text: string)    => addMessage({ role:'user', content:text, isHtml:false }), [addMessage])

  const withTyping = useCallback((fn: () => void, delay = 1000) => {
    setIsTyping(true)
    setTimeout(() => { setIsTyping(false); fn() }, delay)
  }, [])

  // ── Expose to inline HTML buttons ─────────────────────────────
  useEffect(() => {
    (window as any).__chat = {
      sendQuick:          (t: string) => handleSend(t),
      triggerUpload:      () => withTyping(() => showUpload(), 300),
      triggerFullUpload:  () => { setStep('full_upload'); addMessage({ role:'bot', content:'show_full_upload', isHtml:true }) },
      startOCRDemo:       () => startOCR(),
      chooseXML:          () => withTyping(() => showXMLUpload(), 300),
      chooseInvoice:      () => withTyping(() => showInvoiceUpload(), 300),
      chooseFullUpload:   () => { setStep('full_upload'); addMessage({ role:'bot', content:'show_full_upload', isHtml:true }) },
      processXML:         () => withTyping(() => xmlDone(), 2000),
      processInvoice:     () => withTyping(() => showHsAnalysis(), 2500),
      proceedFromInvoice: () => withTyping(() => showFormFromInvoice(), 700),
      spnNotFoundBack:    () => withTyping(() => spnNotFound(currentRef), 300),
      onConnected:        (ref: string) => withTyping(() => showConnectOptions(ref), 600),
      triggerConnect:     () => showConnectPrompt(),
      showSPNList:        () => withTyping(() => showSPNListInChat(), 300),
      goToQueue:          (id: string) => { setQueueOpenId(id); setSidebarActive('queue') },
    }
  })

  // ── SPN LIST IN CHAT ───────────────────────────────────────────
  const showSPNListInChat = useCallback(() => {
    setStep('idle')
    addMessage({ role: 'bot', content: 'show_spn_list', isHtml: true })
  }, [addMessage])

  const addToQueueFromChat = useCallback((refs: string[]) => {
    const entries = spnEntries.filter(e => refs.includes(e.ref))
    const newShipments: Shipment[] = entries.map(e => ({
      id: e.ref.replace('HTHM', 'IMP-68-') + '-new',
      hthmRef: e.ref,
      customsNo: e.customsNo,
      type: 'IMP' as const,
      customer: e.importer,
      contact: '—',
      contactEmail: '',
      goods: e.goods,
      hs: e.hs,
      origin: e.origin,
      importedAt: e.date,
      owner: 'ปวีณา ส.',
      permitNeeded: true,
      agency: 'fda' as const,
      formCode: 'RGoods',
      formName: 'คำขออนุญาตนำเข้า — รอ AI วิเคราะห์',
      conf: 0,
      stage: 0,
      statusKey: 'needs_you' as const,
      assess: { conf: 0, reason: 'รอ OCR และ AI วิเคราะห์' },
      classify: { agency: 'fda' as const, conf: 0, reason: '', alt: [] },
      draft: { fields: [] },
      flags: [],
      audit: [{ time: getTime(), text: `รับงานจากแชท — ${refs.length > 1 ? 'multi-select' : 'single select'}`, by: 'เจ้าหน้าที่' as const }],
      email: { toName: '', to: '', subject: '', body: '', attName: '' },
    }))

    addToQueue(newShipments)

    // mark as inQueue in spnEntries
    setSpnEntries(prev => prev.map(e => refs.includes(e.ref) ? { ...e, inQueue: true } : e))

    const firstId = newShipments[0]?.id ?? ''
    withTyping(() => {
      botMsg(`<div style="display:flex;align-items:flex-start;gap:10px;padding:12px 14px;border-radius:12px;background:rgba(22,234,158,0.08);border:1px solid rgba(22,234,158,0.3)">
        ${icCheck(C.tealDark, 16)}
        <div style="flex:1">
          <p style="font-size:13px;font-weight:700;color:${C.tealDark};margin:0 0 4px">เพิ่มเข้าคิวงาน ${newShipments.length} รายการแล้ว</p>
          <p style="font-size:11px;color:${C.tealDark};margin:0 0 8px">รายการที่เลือกอยู่ในสถานะ "รอคุณยืนยัน" — ขั้นตอนต่อไปคือ อัปโหลดเอกสาร + OCR ในหน้าคิวงาน</p>
          <div style="display:flex;flex-wrap:wrap;gap:6px">
            ${newShipments.map(s =>
              `<span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;background:rgba(4,99,239,0.10);color:${C.blue}">${s.hthmRef}</span>`
            ).join('')}
          </div>
          <button onclick="window.__chat?.goToQueue('${firstId}')" style="${btnPrimary};margin-top:10px;font-size:12px">
            ${icList('#fff', 13)} ไปหน้าคิวงาน
          </button>
        </div>
      </div>`)
    }, 600)
  }, [spnEntries, addToQueue, botMsg, withTyping])

  // ── CONNECT PROMPT (from header pill click) ────────────────────
  const showConnectPrompt = useCallback(() => {
    setPendingRef('')
    withTyping(() => addMessage({ role:'bot', content:'show_connect', isHtml:true }), 300)
  }, [withTyping, addMessage])

  const showNotConnectedWarning = useCallback(() => {
    addMessage({ role:'bot', content:`<div style="display:flex;gap:10px;padding:12px 14px;border-radius:12px;background:#FFFBEB;border:1px solid #FDE68A">
      <span style="flex-shrink:0;display:flex;margin-top:1px">${icWarn('#B45309',16)}</span>
      <div>
        <p style="font-size:13px;font-weight:700;color:#B45309;margin:0 0 4px">ยังไม่ได้เชื่อมต่อ ShippingNet</p>
        <p style="font-size:12px;color:#92400E;margin:0 0 10px">คำสั่งนี้ต้องใช้ข้อมูลจาก ShippingNet กรุณาเชื่อมต่อก่อนดำเนินการ</p>
        <button onclick="window.__chat?.triggerConnect()" style="${btnPrimary};padding:7px 14px;font-size:12px;display:inline-flex;align-items:center;gap:5px">
          เชื่อมต่อ ShippingNet
        </button>
      </div>
    </div>`, isHtml:true })
  }, [addMessage])

  // ── SEND ────────────────────────────────────────────────────────
  const handleSend = useCallback((text: string) => {
    if (!text.trim()) return
    const lower = text.toLowerCase()
    userMsg(text)
    const refMatch = text.match(/HTHM\d+/i)

    if (refMatch && (lower.includes('สร้าง') || lower.includes('rgoods'))) {
      const ref = refMatch[0].toUpperCase()
      if (!isConnected) {
        setPendingRef(ref)
        withTyping(() => addMessage({ role:'bot', content:'show_connect', isHtml:true }), 400)
      } else {
        withTyping(() => fetchSPN(ref), 400)
      }
    } else if ((lower.includes('สร้าง') && lower.includes('rgoods')) || lower === 'สร้าง rgoods') {
      if (!isConnected) {
        withTyping(() => addMessage({ role:'bot', content:'show_connect', isHtml:true }), 400)
      } else {
        withTyping(() => showSPNListInChat(), 400)
      }
    } else if (lower.includes('อัปโหลด') || lower.includes('upload')) {
      withTyping(() => showUpload(), 500)
    } else if (lower.includes('ตรวจสอบสถานะ') || lower.includes('ดูสถานะ')) {
      if (!isConnected) {
        withTyping(() => showNotConnectedWarning(), 400)
      } else {
        withTyping(() => showStatus(), 700)
      }
    } else if (refMatch && step === 'idle') {
      if (!isConnected) {
        setPendingRef(refMatch[0].toUpperCase())
        withTyping(() => showNotConnectedWarning(), 400)
      } else {
        withTyping(() => fetchSPN(refMatch[0].toUpperCase()), 400)
      }
    } else {
      withTyping(() => botMsg(
        `ขอโทษครับ ไม่เข้าใจคำสั่ง กรุณาลองใหม่อีกครั้ง
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px">
          <button onclick="window.__chat?.sendQuick('สร้าง RGoods ด้วยใบขน Ref : HTHM000000003')" style="${chipStyle}">สร้าง RGoods</button>
          <button onclick="window.__chat?.sendQuick('อัปโหลดเอกสาร')" style="${chipStyle}">อัปโหลดเอกสาร</button>
        </div>`
      ), 700)
    }
  }, [step, isConnected, userMsg, botMsg, withTyping, showNotConnectedWarning, showSPNListInChat])

  // ── CONNECT OPTIONS (after login) ──────────────────────────────
  const showConnectOptions = useCallback((ref: string) => {
    setIsConnected(true)
    const hasRef = ref.length > 0
    botMsg(`<div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        ${icCheck('#0D8F61', 20)}
        <div>
          <p style="font-size:13px;font-weight:700;color:${C.navy};margin:0">เชื่อมต่อสำเร็จแล้ว!</p>
          <p style="font-size:11px;color:${C.n500};margin:0">${hasRef ? `ต้องการดำเนินการอะไรกับใบขน <strong>${ref}</strong>?` : 'ต้องการดำเนินการอะไรต่อไปครับ?'}</p>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px">
        <div onclick="window.__chat?.sendQuick('สร้าง RGoods${hasRef ? ` ด้วยใบขน Ref : ${ref}` : ''}')"
          style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:#fff;border:1.5px solid ${C.n200};border-radius:12px;cursor:pointer;transition:all .15s"
          onmouseover="this.style.borderColor='${C.teal}';this.style.background='rgba(22,234,158,0.04)'"
          onmouseout="this.style.borderColor='${C.n200}';this.style.background='#fff'">
          <div style="width:36px;height:36px;border-radius:10px;background:rgba(22,234,158,0.12);display:flex;align-items:center;justify-content:center;flex-shrink:0">${icPlus('#0D8F61',18)}</div>
          <div>
            <p style="font-size:13px;font-weight:700;color:${C.navy};margin:0">สร้าง RGoods ใหม่</p>
            <p style="font-size:11px;color:${C.n500};margin:0">${hasRef ? `สร้างใบอนุญาตใหม่จากใบขน ${ref}` : 'สร้างใบอนุญาตนำเข้าใหม่'}</p>
          </div>
        </div>
      </div>
    </div>`)
  }, [botMsg])

  // ── SPN NOT FOUND ───────────────────────────────────────────────
  const spnNotFound = useCallback((ref: string) => {
    setFormData({ ref, licenseType: 'RGoods' })
    setStep('not_found')
    const choiceCard = (onclick: string, iconBg: string, iconColor: string, icon: string, title: string, desc: string) =>
      `<div onclick="${onclick}" style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:#fff;border:1.5px solid ${C.n200};border-radius:12px;cursor:pointer;transition:all .18s;margin-bottom:8px"
        onmouseover="this.style.borderColor='${C.blue}';this.style.background='rgba(4,99,239,0.03)'"
        onmouseout="this.style.borderColor='${C.n200}';this.style.background='#fff'">
        <div style="width:42px;height:42px;border-radius:10px;background:${iconBg};color:${iconColor};display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">${icon}</div>
        <div style="flex:1">
          <div style="font-size:13px;font-weight:700;color:${C.navy};margin-bottom:3px">${title}</div>
          <div style="font-size:11px;color:${C.n500};line-height:1.5">${desc}</div>
        </div>
        <span style="color:${C.n300};font-size:18px">›</span>
      </div>`
    botMsg(`<span style="color:#B45309;font-weight:700;font-size:13px;display:inline-flex;align-items:center;gap:5px">${icWarn('#B45309',15)} ไม่พบข้อมูลใบขน ${ref} ใน ShippingNet</span>
      <div style="${cardWrap};border-color:#FDE68A;margin-bottom:10px">
        <div style="${cardHead};background:#FFFBEB;color:#B45309;border-color:#FDE68A;display:flex;align-items:center;gap:6px">${icX('#B45309',13)} SPN: ไม่พบข้อมูล</div>
        <div style="${cardBody}">
          <p style="font-size:12px;color:${C.n600};line-height:1.7">
            ไม่พบเลข Ref <strong>${ref}</strong> ในระบบ ShippingNet<br>
            อาจเกิดจากยังไม่ได้นำเข้าข้อมูล หรือเลข Ref ไม่ถูกต้อง
          </p>
        </div>
      </div>
      <p style="font-size:12px;font-weight:600;color:${C.navy};margin-bottom:8px">กรุณาเลือกวิธีดำเนินการต่อ:</p>
      ${choiceCard(`window.__chat?.chooseXML()`, 'rgba(21,101,192,0.1)', '#1565C0', icFile('#1565C0',18), 'อัปโหลดไฟล์ XML', 'ระบบนำเข้าข้อมูลจาก XML และสร้างใบ RGoods ได้ทันที ไม่ต้องกรอกข้อมูลเพิ่ม')}
      ${choiceCard(`window.__chat?.chooseInvoice()`, 'rgba(22,234,158,0.15)', C.tealDark, icList(C.tealDark,18), 'อัปโหลด Invoice', 'ระบบอ่าน Invoice แล้ววิเคราะห์ HS Code พร้อมแนะนำกรมที่ต้องขอใบอนุญาต')}
      ${choiceCard(`window.__chat?.chooseFullUpload()`, 'rgba(180,83,9,0.1)', '#B45309', icFolder('#B45309',18), 'อัปโหลดเอกสารครบชุด', 'อัปโหลด Invoice + ใบขนสินค้า + COA + ใบเลข U พร้อมกัน')}`)
  }, [botMsg])

  // ── FETCH SPN ───────────────────────────────────────────────────
  const fetchSPN = useCallback((ref: string) => {
    setCurrentRef(ref)
    setIsTyping(true)
    botMsg(`<span style="color:${C.blue};font-size:13px;display:inline-flex;align-items:center;gap:5px">${icSearch(C.blue,14)} กำลังดึงข้อมูลจาก ShippingNet สำหรับ <strong>${ref}</strong>...</span>`)
    fetchSPNApi(ref).then(({ found, data }) => {
      setIsTyping(false)
      if (!found || !data) { spnNotFound(ref); return }
      const merged = { ...data, ref }
      setFormData(merged)
      setStep('upload')
      botMsg(`<span style="color:${C.tealDark};font-weight:700;display:inline-flex;align-items:center;gap:5px">${icCheck(C.tealDark,15)} ดึงข้อมูลจาก SPN สำเร็จแล้วครับ</span>
        <div style="${cardWrap}">
          <div style="${cardHead};display:flex;align-items:center;gap:6px">${icList(C.navy,13)} ข้อมูลใบขน #${ref}</div>
          <div style="${cardBody}">
            <div style="${rowStyle};border-bottom:1px dashed ${C.n200}"><span style="color:${C.n600}">ผู้นำเข้า</span><span style="font-weight:700;color:${C.blue}">${merged.importer}</span></div>
            <div style="${rowStyle};border-bottom:1px dashed ${C.n200}"><span style="color:${C.n600}">ท่าเรือ</span><span style="font-weight:600;color:${C.navy}">${merged.port}</span></div>
            <div style="${rowStyle};border-bottom:1px dashed ${C.n200}"><span style="color:${C.n600}">วันที่ยื่น</span><span style="font-weight:600;color:${C.navy}">${merged.declarationDate}</span></div>
            <div style="${rowStyle};border-bottom:1px dashed ${C.n200}"><span style="color:${C.n600}">HS Code</span><span style="font-weight:600;color:${C.navy}">${merged.hsCode}</span></div>
            <div style="${rowStyle};border-bottom:1px dashed ${C.n200}"><span style="color:${C.n600}">ประเทศต้นทาง</span><span style="font-weight:600;color:${C.navy}">${merged.countryOrigin}</span></div>
            <div style="${rowStyle};border:none"><span style="color:${C.n600}">ประเภทใบอนุญาต</span><span style="${badgeBlue}">RGoods</span></div>
          </div>
        </div>
        <p style="font-size:12px;color:${C.n600};margin-top:10px">ขั้นตอนถัดไป: กรุณาอัปโหลดเอกสารประกอบครับ</p>
        <div style="display:flex;gap:6px;margin-top:8px">
          <button onclick="window.__chat?.sendQuick('อัปโหลดเอกสาร')" style="${chipStyle};display:inline-flex;align-items:center;gap:5px">${icUpload(C.blue,13)} อัปโหลดเอกสาร</button>
        </div>`)
    })
  }, [botMsg, spnNotFound])

  // ── XML FLOW ────────────────────────────────────────────────────
  const showXMLUpload = useCallback(() => {
    setStep('xml_upload')
    botMsg(`<span style="color:#1565C0;font-weight:700;display:inline-flex;align-items:center;gap:5px">${icFile('#1565C0',15)} อัปโหลดไฟล์ XML</span>
      <p style="font-size:12px;color:${C.n600};margin:6px 0 10px">ระบบจะแปลงข้อมูล XML เป็น RGoods โดยอัตโนมัติ ไม่ต้องกรอกข้อมูลเพิ่มเติม</p>
      <div style="border:2px dashed rgba(21,101,192,0.4);border-radius:12px;padding:20px;text-align:center;background:rgba(21,101,192,0.04)">
        <div style="display:flex;justify-content:center;margin-bottom:8px">${icFolderOpen('#1565C0',36)}</div>
        <p style="font-size:13px;font-weight:600;color:#1565C0">คลิกหรือลากไฟล์ XML มาวาง</p>
        <p style="font-size:11px;color:${C.n500};margin-top:3px">รองรับเฉพาะ .xml เท่านั้น</p>
      </div>
      <div style="display:flex;gap:8px;margin-top:10px">
        <button onclick="window.__chat?.processXML()" style="${btnPrimary};display:inline-flex;align-items:center;gap:5px">${icSearch(C.blue,13)} ประมวลผล XML</button>
        <button onclick="window.__chat?.spnNotFoundBack()" style="${btnSecondary}">← ย้อนกลับ</button>
      </div>`)
  }, [botMsg])

  const xmlDone = useCallback(() => {
    const data = {
      importer: 'บริษัท เฮลท์ฟาร์มา จำกัด',
      declarant: 'บริษัท ไทยเทรด จำกัด',
      port: 'ท่าเรือแหลมฉบัง',
      declarationDate: '10/06/2568',
      hsCode: '2941.10.00',
      countryOrigin: 'อินเดีย',
      goodsDesc: 'วัตถุดิบยา (Active Pharmaceutical Ingredient)',
      invoiceNo: 'INV-2024-8834',
      invoiceDate: '05/06/2568',
      quantity: '250',
      unit: 'กิโลกรัม',
      lotNo: 'LOT-2024-567',
      uNo: 'U-2568-00123',
      importDate: '10/06/2568',
      drugRegNo: '1A 234/50',
    }
    setFormData(prev => ({ ...prev, ...data }))
    setFormValues(data as Record<string, string>)
    setStep('preview_ready')
    botMsg(`<span style="color:${C.tealDark};font-weight:700;display:inline-flex;align-items:center;gap:5px">${icCheck(C.tealDark,15)} แปลงข้อมูล XML สำเร็จ!</span> ดึงข้อมูลครบทุกฟิลด์แล้ว ไม่ต้องกรอกเพิ่มเติม
      <div style="${cardWrap};border-color:rgba(22,234,158,0.3)">
        <div style="${cardHead};background:rgba(22,234,158,0.08);color:${C.tealDark};display:flex;align-items:center;gap:6px">${icFile(C.tealDark,13)} ข้อมูลจาก XML</div>
        <div style="${cardBody}">
          <div style="${rowStyle}"><span style="color:${C.n600}">ผู้นำเข้า</span><span style="font-weight:700;color:${C.blue}">${data.importer}</span></div>
          <div style="${rowStyle}"><span style="color:${C.n600}">HS Code</span><span style="font-weight:600;color:${C.navy}">${data.hsCode}</span></div>
          <div style="${rowStyle}"><span style="color:${C.n600}">รายละเอียดสินค้า</span><span style="font-weight:600;color:${C.navy}">${data.goodsDesc}</span></div>
          <div style="${rowStyle}"><span style="color:${C.n600}">จำนวน</span><span style="font-weight:600;color:${C.navy}">${data.quantity} ${data.unit}</span></div>
          <div style="${rowStyle}"><span style="color:${C.n600}">Invoice No.</span><span style="font-weight:600;color:${C.navy}">${data.invoiceNo}</span></div>
          <div style="${rowStyle}"><span style="color:${C.n600}">Lot No.</span><span style="font-weight:600;color:${C.navy}">${data.lotNo}</span></div>
          <div style="${rowStyle}"><span style="color:${C.n600}">เลข U</span><span style="font-weight:600;color:${C.navy}">${data.uNo}</span></div>
          <div style="${rowStyle};border:none"><span style="color:${C.n600}">เลขทะเบียนยา</span><span style="font-weight:600;color:${C.navy}">${data.drugRegNo}</span></div>
        </div>
      </div>
      <div style="margin-top:10px">
        <button onclick="window.__chat?.sendQuick('ดู Preview')" style="${btnPrimary};display:inline-flex;align-items:center;gap:5px">${icCheck(C.teal,13)} ดู Preview และส่งกรม</button>
      </div>`)
  }, [botMsg])

  // ── INVOICE OCR + HS ANALYSIS FLOW ──────────────────────────────
  const showInvoiceUpload = useCallback(() => {
    setStep('invoice_upload')
    botMsg(`<span style="color:${C.tealDark};font-weight:700;display:inline-flex;align-items:center;gap:5px">${icList(C.tealDark,15)} อัปโหลด Invoice เพื่อวิเคราะห์</span>
      <p style="font-size:12px;color:${C.n600};margin:6px 0 10px">ระบบจะ OCR Invoice → วิเคราะห์ HS Code → แนะนำกรมที่ต้องขอใบอนุญาต → สร้าง RGoods</p>
      <div style="border:2px dashed rgba(22,234,158,0.4);border-radius:12px;padding:20px;text-align:center;background:rgba(22,234,158,0.04)">
        <div style="display:flex;justify-content:center;margin-bottom:8px">${icUpload(C.tealDark,36)}</div>
        <p style="font-size:13px;font-weight:600;color:${C.tealDark}">คลิกหรือลากไฟล์ Invoice มาวาง</p>
        <p style="font-size:11px;color:${C.n500};margin-top:3px">รองรับ PDF, JPG, PNG, Excel</p>
      </div>
      <div style="display:flex;gap:8px;margin-top:10px">
        <button onclick="window.__chat?.processInvoice()" style="${btnPrimary};background:linear-gradient(135deg,${C.tealDark},${C.tealMid});display:inline-flex;align-items:center;gap:5px">${icSearch(C.teal,13)} OCR และวิเคราะห์ Invoice</button>
        <button onclick="window.__chat?.spnNotFoundBack()" style="${btnSecondary}">← ย้อนกลับ</button>
      </div>`)
  }, [botMsg])

  const showHsAnalysis = useCallback(() => {
    const invData = {
      importer: 'บริษัท เฮลท์ฟาร์มา จำกัด',
      declarant: 'บริษัท ไทยเทรด จำกัด',
      port: 'ท่าเรือแหลมฉบัง',
      goodsDesc: 'วัตถุดิบยา Amoxicillin Trihydrate',
      hsCode: '2941.10.00',
      countryOrigin: 'อินเดีย',
      invoiceNo: 'INV-2024-8834',
      invoiceDate: '05/06/2568',
      quantity: '250',
      unit: 'กิโลกรัม',
      lotNo: 'LOT-2024-567',
    }
    setFormData(prev => ({ ...prev, ...invData }))
    setStep('hs_analysis')

    const hsRow = (code: string, desc: string, pct: number, label: string, recommended: boolean) => {
      const barColor = pct > 80 ? C.tealDark : pct > 60 ? '#B45309' : C.n300
      return `<tr onclick="window.__chat?.sendQuick('เลือก HS Code ${code}')"
        style="cursor:pointer;${recommended ? `background:rgba(22,234,158,0.08);outline:2px solid ${C.tealMid};outline-offset:-2px;` : ''}"
        onmouseover="this.style.background='rgba(4,99,239,0.04)'" onmouseout="this.style.background='${recommended ? `rgba(22,234,158,0.08)` : ''}'">
        <td style="padding:8px 10px">
          <div style="font-weight:700;color:${C.navy};font-size:12px">${code}</div>
          <div style="font-size:11px;color:${C.n600};margin-top:2px">${desc}</div>
        </td>
        <td style="padding:8px 10px;text-align:center">
          <div style="height:5px;background:${C.n200};border-radius:3px;width:80px;margin:0 auto">
            <div style="height:100%;width:${pct}%;background:${barColor};border-radius:3px"></div>
          </div>
          <div style="font-size:10px;color:${C.n600};margin-top:3px">${pct}%</div>
        </td>
        <td style="padding:8px 10px;text-align:center">
          <span style="${pct > 80 ? badgeGreen : pct > 60 ? badgeAmber : badgeUser}">${label}</span>
          ${recommended ? `<div style="font-size:10px;color:${C.tealDark};margin-top:2px">⭐ แนะนำ</div>` : ''}
        </td>
      </tr>`
    }

    botMsg(`<span style="font-weight:700;display:inline-flex;align-items:center;gap:5px">${icSearch(C.blue,15)} วิเคราะห์ Invoice เสร็จแล้ว</span> — พบรายการสินค้าและวิเคราะห์ HS Code ดังนี้:
      <div style="${cardWrap}">
        <div style="${cardHead};background:rgba(100,0,200,0.06);color:#4527A0;display:flex;align-items:center;gap:5px">${icSearch('#4527A0',13)} ผลการวิเคราะห์ HS Code</div>
        <div style="padding:0">
          <div style="font-size:11px;color:${C.n500};padding:8px 12px 4px">คลิกเลือก HS Code ที่ต้องการใช้</div>
          <table style="width:100%;border-collapse:collapse">
            <thead><tr style="background:${C.n50};font-size:11px;color:${C.n500}">
              <th style="padding:7px 10px;text-align:left;font-weight:600">HS Code / รายละเอียด</th>
              <th style="padding:7px 10px;text-align:center;font-weight:600">ความแม่นยำ</th>
              <th style="padding:7px 10px;text-align:center;font-weight:600">ความเหมาะสม</th>
            </tr></thead>
            <tbody>
              ${hsRow('2941.10.00','Amoxicillin and its salts — วัตถุดิบยา กลุ่มเพนิซิลลิน',94,'สูง',true)}
              ${hsRow('2941.90.00','Other antibiotics — ยาปฏิชีวนะอื่นๆ',72,'ปานกลาง',false)}
              ${hsRow('3004.10.00','Medicaments containing penicillins — ยาสำเร็จรูป',48,'ต่ำ',false)}
            </tbody>
          </table>
        </div>
      </div>
      <div style="${cardWrap}">
        <div style="${cardHead};background:rgba(69,39,160,0.06);color:#4527A0;display:flex;align-items:center;gap:5px">${icList('#4527A0',13)} กรมที่ต้องขออนุญาต (ตาม HS 2941.10.00)</div>
        <div style="${cardBody};display:flex;flex-direction:column;gap:8px">
          <div style="display:flex;align-items:flex-start;gap:10px;padding:10px;background:${C.n50};border:1px solid ${C.n200};border-radius:8px">
            <div style="width:38px;height:38px;border-radius:8px;background:rgba(21,101,192,0.1);color:#1565C0;display:flex;align-items:center;justify-content:center;flex-shrink:0">${icFile('#1565C0',18)}</div>
            <div>
              <div style="font-size:13px;font-weight:700;color:${C.navy}">สำนักงานคณะกรรมการอาหารและยา (อย.)</div>
              <div style="font-size:12px;color:${C.n600};margin:2px 0;display:flex;align-items:center;gap:4px">${icFile(C.n600,12)} ใบอนุญาตนำเข้าวัตถุดิบยา (RGoods)</div>
              <div style="font-size:11px;color:${C.n500}">พ.ร.บ.ยา พ.ศ. 2510</div>
            </div>
          </div>
          <div style="display:flex;align-items:flex-start;gap:10px;padding:10px;background:${C.n50};border:1px solid ${C.n200};border-radius:8px">
            <div style="width:38px;height:38px;border-radius:8px;background:rgba(22,234,158,0.15);color:${C.tealDark};display:flex;align-items:center;justify-content:center;flex-shrink:0">${icShip(C.tealDark,18)}</div>
            <div>
              <div style="font-size:13px;font-weight:700;color:${C.navy}">กรมศุลกากร</div>
              <div style="font-size:12px;color:${C.n600};margin:2px 0;display:flex;align-items:center;gap:4px">${icFile(C.n600,12)} ใบขนสินค้าขาเข้า (กศก.99)</div>
              <div style="font-size:11px;color:${C.n500}">พ.ร.บ.ศุลกากร พ.ศ. 2560</div>
            </div>
          </div>
        </div>
      </div>
      <div style="${cardWrap};border-color:rgba(22,234,158,0.3)">
        <div style="${cardHead};background:rgba(22,234,158,0.08);color:${C.tealDark};display:flex;align-items:center;gap:5px">${icList(C.tealDark,13)} ข้อมูลที่ดึงได้จาก Invoice</div>
        <div style="${cardBody}">
          <div style="${rowStyle}"><span style="color:${C.n600}">ผู้นำเข้า</span><span style="font-weight:600;color:${C.navy}">${invData.importer}</span></div>
          <div style="${rowStyle}"><span style="color:${C.n600}">รายละเอียดสินค้า</span><span style="font-weight:600;color:${C.navy}">${invData.goodsDesc}</span></div>
          <div style="${rowStyle}"><span style="color:${C.n600}">ประเทศต้นทาง</span><span style="font-weight:600;color:${C.navy}">${invData.countryOrigin}</span></div>
          <div style="${rowStyle}"><span style="color:${C.n600}">จำนวน</span><span style="font-weight:600;color:${C.navy}">${invData.quantity} ${invData.unit}</span></div>
          <div style="${rowStyle}"><span style="color:${C.n600}">Invoice No.</span><span style="font-weight:600;color:${C.navy}">${invData.invoiceNo}</span></div>
          <div style="${rowStyle};border:none"><span style="color:${C.n600}">Lot No.</span><span style="font-weight:600;color:${C.navy}">${invData.lotNo}</span></div>
        </div>
      </div>
      <div style="margin-top:10px">
        <button onclick="window.__chat?.proceedFromInvoice()" style="${btnPrimary}">→ ดำเนินการสร้าง RGoods</button>
      </div>`)
  }, [botMsg])

  const showFormFromInvoice = useCallback(() => {
    setStep('form')
    addMessage({ role:'bot', content:'show_form', isHtml:true })
    setTimeout(() => {
      botMsg(`<div style="display:flex;gap:8px;padding:10px 12px;border-radius:12px;background:#FFFBEB;border:1px solid #FDE68A;font-size:12px">
        <span style="flex-shrink:0;display:flex">${icWarn('#B45309',16)}</span>
        <div>
          <strong style="color:#B45309">พบข้อมูลที่ยังขาด 3 รายการ</strong> กรุณากรอกให้ครบ:
          <div style="display:flex;gap:6px;margin-top:6px">
            <span style="${badgeAmber}">เลข U</span>
            <span style="${badgeAmber}">วันที่นำเข้า</span>
            <span style="${badgeAmber}">เลขทะเบียนยา</span>
          </div>
        </div>
      </div>`)
    }, 600)
  }, [addMessage, botMsg])

  const showUpload = useCallback(() => {
    setStep('upload')
    botMsg(`<p style="font-size:13px;font-weight:600;color:${C.navy};margin-bottom:8px;display:flex;align-items:center;gap:5px">${icFolder(C.navy,15)} กรุณาอัปโหลดเอกสารประกอบ:</p>
      <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:12px">
        <span style="${badgeAmber}">Invoice</span>
        <span style="${badgeGreen}">COA</span>
        <span style="${badgeBlue}">ใบเลข U</span>
      </div>
      <button onclick="window.__chat?.triggerUpload()"
        style="width:100%;border-radius:14px;border:2px dashed ${C.n300};background:${C.n50};padding:18px;text-align:center;cursor:pointer;display:block;transition:all .2s"
        onmouseover="this.style.borderColor='${C.blue}';this.style.background='rgba(4,99,239,0.04)'"
        onmouseout="this.style.borderColor='${C.n300}';this.style.background='${C.n50}'">
        <div style="display:flex;justify-content:center;margin-bottom:8px">${icUpload(C.blue,30)}</div>
        <p style="font-size:13px;font-weight:600;color:${C.navy}">คลิกหรือลากไฟล์มาวางที่นี่</p>
        <p style="font-size:11px;color:${C.n500};margin-top:3px">PDF, JPG, PNG, Excel (สูงสุด 20MB)</p>
      </button>
      <button onclick="window.__chat?.startOCRDemo()" style="${btnPrimary};margin-top:10px">
        ${icSearch('#fff',13)} OCR &amp; วิเคราะห์ไฟล์
      </button>`)
  }, [botMsg])

  const showStatus = useCallback(() => {
    botMsg(`<div style="${cardWrap}">
      <div style="${cardHead};display:flex;align-items:center;gap:5px">${icList(C.navy,13)} สถานะใบอนุญาต</div>
      <div style="${cardBody}">
        <div style="${rowStyle};border-bottom:1px dashed ${C.n200}">
          <span style="color:${C.n600}">HTHM000000003</span>
          <span style="${badgeGreen};display:inline-flex;align-items:center;gap:3px">${icCheck(C.tealDark,11)} อนุมัติแล้ว</span>
        </div>
        <div style="${rowStyle};border:none">
          <span style="color:${C.n600}">HTHM000000001</span>
          <span style="${badgeBlue};display:inline-flex;align-items:center;gap:3px">${icSearch(C.blue,11)} รอการอนุมัติ</span>
        </div>
      </div>
    </div>`)
  }, [botMsg])

  // ── QUEUE STATUS IN CHAT ────────────────────────────────────────
  const showQueueStatusInChat = useCallback(() => {
    userMsg('ดูสถานะใบขน')
    const rows = queue.map(s => {
      const meta = STATUS_META[s.statusKey] ?? { label: s.statusKey, bg: '#F3F4F6', text: '#666', dot: '#999' }
      const agency = AGENCY_SHORT[s.agency] ?? '—'
      return `<div onclick="window.__chat?.goToQueue('${s.id}')"
        style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;border-bottom:1px solid ${C.n100};cursor:pointer;transition:.15s;border-radius:8px"
        onmouseover="this.style.background='rgba(4,99,239,0.04)'"
        onmouseout="this.style.background='transparent'">
        <div style="min-width:0;flex:1">
          <div style="display:flex;align-items:center;gap:6px">
            <span style="font-size:11px;font-weight:700;color:${C.blue}">${s.customsNo}</span>
            <span style="font-size:10px;color:${C.n500};background:${C.n100};padding:1px 6px;border-radius:4px">${agency}</span>
          </div>
          <p style="font-size:11px;color:${C.n600};margin:2px 0 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:240px">${s.goods}</p>
        </div>
        <span style="font-size:10px;font-weight:600;color:${meta.text};background:${meta.bg};padding:3px 8px;border-radius:20px;flex-shrink:0;margin-left:8px">${meta.label}</span>
      </div>`
    }).join('')
    botMsg(`<div>
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
        ${icList(C.navy, 14)}
        <span style="font-size:13px;font-weight:700;color:${C.navy}">สถานะคิวงานทั้งหมด</span>
        <span style="font-size:10px;color:${C.n500};background:${C.n100};padding:2px 8px;border-radius:20px">${queue.length} รายการ</span>
      </div>
      <div style="border:1px solid ${C.n200};border-radius:10px;overflow:hidden">
        ${rows}
      </div>
      <p style="font-size:10px;color:${C.n500};margin-top:6px">กดที่รายการเพื่อดูรายละเอียดในหน้าคิวงาน</p>
    </div>`)
  }, [queue, botMsg, userMsg])

  // ── OCR ─────────────────────────────────────────────────────────
  const startOCR = useCallback((files: { name: string }[] = []) => {
    userMsg(files.length > 0 ? `ส่งไฟล์ ${files.length} ไฟล์เพื่อ OCR` : 'ส่งไฟล์ 3 ไฟล์เพื่อ OCR')
    setStep('ocr')
    addMessage({ role:'bot', content:'ocr_progress', isHtml:true })
    setIsTyping(true)
    runOCRFlow(files).then(result => {
      setIsTyping(false)
      setTimeout(() => showForm(result), 600)
    })
  }, [userMsg, addMessage, runOCRFlow])

  const handleFullUploadOCR = useCallback((slots: UploadSlots) => {
    const files = Object.values(slots).flat()
    startOCR(files)
  }, [startOCR])

  // ── FORM ────────────────────────────────────────────────────────
  const showForm = useCallback((ocrResult?: OCRResult) => {
    const ocr = ocrResult ?? {} as OCRResult
    const merged = { ...formData, ...ocr }
    setFormData(merged)
    setFormValues({
      invoiceNo:     ocr.invoiceNo     ?? '',
      invoiceDate:   ocr.invoiceDate   ?? '',
      quantity:      ocr.quantity      ?? '',
      lotNo:         ocr.lotNo         ?? '',
      uNo:           ocr.uNo           ?? '',
      goodsDesc:     ocr.goodsDesc     ?? '',
      declarant:     ocr.declarant     ?? '',
      importer:      ocr.importer      ?? '',
      port:          ocr.port          ?? '',
      hsCode:        ocr.hsCode        ?? '',
      countryOrigin: ocr.countryOrigin ?? '',
    })
    setStep('form')
    addMessage({ role:'bot', content:'show_form', isHtml:true })
    setTimeout(() => {
      botMsg(`<div style="display:flex;gap:8px;padding:10px 12px;border-radius:12px;background:#FFFBEB;border:1px solid #FDE68A;font-size:12px">
        <span style="flex-shrink:0;display:flex">${icWarn('#B45309',16)}</span>
        <div>
          <strong style="color:#B45309">พบข้อมูลที่ยังขาด 2 รายการ</strong> กรุณากรอกให้ครบ:
          <div style="display:flex;gap:6px;margin-top:6px">
            <span style="${badgeAmber}">วันที่นำเข้า</span>
            <span style="${badgeAmber}">เลขทะเบียนยา</span>
          </div>
        </div>
      </div>`)
    }, 600)
  }, [formData, addMessage, botMsg])

  const handleFormChange = useCallback((key: string, val: string) =>
    setFormValues(prev => ({ ...prev, [key]: val })), [])

  const handlePreview = useCallback(() => {
    const missing: string[] = []
    if (!formValues.importDate) missing.push('วันที่นำเข้า')
    if (!formValues.drugRegNo)  missing.push('เลขทะเบียนยา')
    if (missing.length > 0) {
      userMsg('ขอดู Preview')
      withTyping(() => botMsg(`<span style="color:#C0392B;font-weight:600;display:inline-flex;align-items:center;gap:5px">${icX('#C0392B',15)} ยังไม่สามารถดำเนินการได้ กรุณากรอกข้อมูลที่ขาด: <strong>${missing.join(', ')}</strong></span>`), 300)
      return
    }
    setShowPreview(true)
  }, [formValues, userMsg, botMsg, withTyping])

  const handleConfirmSubmit = useCallback(() => { setShowPreview(false); setShowConfirm(true) }, [])

  const handleSubmit = useCallback(() => {
    setShowConfirm(false)
    userMsg('ยืนยันส่งข้อมูลเข้ากรม')
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const refNo = `RG-2568-${Math.floor(Math.random() * 90000 + 10000)}`
      botMsg(`<span style="color:${C.tealDark};font-weight:700;font-size:13px;display:inline-flex;align-items:center;gap:5px">${icCheck(C.tealDark,15)} ส่งข้อมูลสำเร็จแล้วครับ!</span>
        <div style="${cardWrap};border-color:rgba(22,234,158,0.3)">
          <div style="${cardHead};background:rgba(22,234,158,0.08);color:${C.tealDark};border-color:rgba(22,234,158,0.3)">ผลการส่งข้อมูลเข้ากรม</div>
          <div style="${cardBody}">
            <div style="${rowStyle};border-bottom:1px dashed ${C.n200}"><span style="color:${C.n600}">เลขอ้างอิง</span><span style="font-weight:700;color:${C.blue}">${formData.ref}</span></div>
            <div style="${rowStyle};border-bottom:1px dashed ${C.n200}"><span style="color:${C.n600}">เลขใบอนุญาต (ชั่วคราว)</span><span style="font-weight:700;color:${C.blue}">${refNo}</span></div>
            <div style="${rowStyle};border-bottom:1px dashed ${C.n200}"><span style="color:${C.n600}">วันที่ส่ง</span><span style="font-weight:600;color:${C.navy}">${new Date().toLocaleDateString('th-TH')}</span></div>
            <div style="${rowStyle};border-bottom:1px dashed ${C.n200}"><span style="color:${C.n600}">สถานะ</span><span style="${badgeBlue};display:inline-flex;align-items:center;gap:3px">${icSearch(C.blue,11)} รอการอนุมัติ</span></div>
            <div style="${rowStyle};border:none"><span style="color:${C.n600}">คาดว่าอนุมัติ</span><span style="font-weight:600;color:${C.navy}">3-5 วันทำการ</span></div>
          </div>
        </div>
        <p style="font-size:12px;color:${C.n600};margin-top:10px">ต้องการดำเนินการอื่นเพิ่มเติมไหมครับ?</p>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">
          <button onclick="window.__chat?.sendQuick('ตรวจสอบสถานะใบอนุญาต')" style="${chipStyle}">ตรวจสอบสถานะ</button>
          <button onclick="window.__chat?.sendQuick('สร้าง RGoods ใหม่')" style="${chipStyle}">สร้างใบใหม่</button>
          <button onclick="window.__chat?.sendQuick('พิมพ์ใบอนุญาต')" style="${chipStyle}">พิมพ์ใบอนุญาต</button>
        </div>`)
      setStep('done')
    }, 2200)
  }, [formData, userMsg, botMsg])

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#F2F2F2' }}>
      <ChatHeader
        isConnected={isConnected}
        onDisconnect={() => {
          setIsConnected(false)
          withTyping(() => botMsg(`<div style="display:flex;gap:10px;padding:10px 12px;border-radius:12px;background:rgba(220,38,38,0.06);border:1px solid rgba(220,38,38,0.2)">
            ${icX('#DC2626',15)}
            <span style="font-size:12px;color:#991B1B;font-weight:600">ตัดการเชื่อมต่อ ShippingNet เรียบร้อยแล้ว</span>
          </div>`), 300)
        }}
        onConnectClick={showConnectPrompt}
      />
      <div className="flex flex-1 overflow-hidden">
      <Sidebar activeItem={sidebarActive} onSelect={(id) => { setSidebarActive(id); if (id !== 'queue') setQueueOpenId(null) }} needsYouCount={needsYouCount} />
      {sidebarActive === 'queue' ? (
        <div className="flex-1 overflow-hidden">
          <QueuePage
            queue={queue}
            updateShipment={updateShipment}
            initialActiveId={queueOpenId}
            onNavigateChat={() => { setSidebarActive('chatbot'); setQueueOpenId(null) }}
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatArea
            messages={messages} isTyping={isTyping}
            ocrProgress={ocrProgress} ocrStages={ocrStages}
            formValues={formValues} currentStep={step}
            pendingRef={pendingRef}
            spnEntries={spnEntries}
            onFormChange={handleFormChange} onPreview={handlePreview}
            onFullUploadOCR={handleFullUploadOCR} onQuickSend={handleSend}
            onConnected={showConnectOptions}
            onRequestPermit={addToQueueFromChat}
          />
          <QuickActionBar
            onCreateRGoods={() => handleSend('สร้าง RGoods')}
            onShowQueueStatus={showQueueStatusInChat}
            onGoToQueue={() => setSidebarActive('queue')}
            onUpload={() => handleSend('upload เอกสาร Invoice')}
          />
          <ChatInput onSend={handleSend} disabled={isTyping} />
        </div>
      )}
      </div>

      {showPreview && (
        <PreviewModal
          formData={formData} formValues={formValues}
          onConfirm={handleConfirmSubmit}
          onEdit={() => setShowPreview(false)}
          onClose={() => setShowPreview(false)}
        />
      )}
      {showConfirm && (
        <ConfirmModal
          ref={formData.ref || ''}
          onConfirm={handleSubmit}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  )
}
