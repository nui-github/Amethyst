# ShippingNet Assistant — Claude Code Handoff

## Project Overview
Web-based AI chatbot for creating import licenses (RGoods) and managing customs documents.
Built with Next.js 14 App Router + TypeScript + Tailwind CSS + Lucide React.

---

## Tech Stack
- **Framework**: Next.js 14 (App Router, `src/` directory)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + inline `style={}` for BizX brand colors
- **Icons**: Lucide React v0.383.0
- **Font**: IBM Plex Sans Thai (loaded via `<link>` in layout.tsx)
- **Utilities**: clsx + tailwind-merge

---

## BizX Design System (CRITICAL — always follow)

### Color tokens (use these hex values directly in inline styles)
```
Navy (Primary):   #010136 (bg), #40406A (mid), #8080A5 (muted text)
Blue (Action):    #0463EF (active/CTA), #034DBA (gradient start), #B0D0FF (light)
Teal (Success):   #16EA9E (accent), #11BB7F (mid), #0D8F61 (text on light)
Neutral:          #F0F0F0 (app bg), #F9F9F9 (card lightest), #E0E0E0 (borders)
                  #CCCCCC (dashed), #999999 (muted), #666666 (labels), #333333 (dark)
```

### Gradients
```
Primary btn:  linear-gradient(135deg, #034DBA, #0463EF)
Teal btn:     linear-gradient(135deg, #11BB7F, #16EA9E)
AI avatar:    linear-gradient(135deg, #010136, #0463EF)
BX badge:     linear-gradient(135deg, #0463EF, #16EA9E)
User avatar:  linear-gradient(135deg, #40406A, #0463EF)
```

### Color constant `C` in page.tsx
All inline HTML bot messages use the `C` object at the top of `page.tsx`:
```ts
const C = { navy, blue, blueDeep, teal, tealMid, tealDark, n50, n100, n200, n300, n500, n600 }
```
Always use `${C.blue}` etc. when writing new inline HTML bot messages.

---

## File Structure
```
src/
├── app/
│   ├── layout.tsx          ← Root layout, IBM Plex Sans Thai font
│   ├── globals.css         ← Tailwind + BizX CSS vars + .ocr-fill + .msg-appear
│   └── page.tsx            ← ALL state + ALL chat logic + inline HTML helpers
├── components/
│   ├── chat/
│   │   ├── Sidebar.tsx          ← Navy (#010136) sidebar, Bot icon, active=blue
│   │   ├── ChatHeader.tsx       ← White header, teal status pill
│   │   ├── ChatArea.tsx         ← Routes special content keys to React components
│   │   ├── ChatInput.tsx        ← Textarea + blue send button
│   │   ├── TypingIndicator.tsx  ← 3-dot bounce, navy→blue AI avatar
│   │   ├── FormPanel.tsx        ← OCR form: teal=filled, blue-soft=missing
│   │   ├── FullUploadPanel.tsx  ← 4-slot drag-drop (invoice/customs/coa/ulicense)
│   │   ├── OcrProgress.tsx      ← Stage rows + blue→teal gradient bar
│   │   ├── QuickChips.tsx       ← Blue pill chips, hover fills solid blue
│   │   └── Modals.tsx           ← PreviewModal + ConfirmModal (teal confirm)
│   └── ui/
│       ├── Badge.tsx            ← Reusable badge variants
│       └── Button.tsx           ← Reusable button variants
└── lib/
    ├── types.ts            ← ChatMessage, FormData, ChatStep, UploadSlots, SlotKey
    └── utils.ts            ← generateId, getTime, KNOWN_REFS, MOCK_FORM_DATA, MOCK_OCR_FULL
```

---

## Chat Flow Architecture

```
handleSend(text)
  ├─ HTHM ref + "สร้าง/rgoods"  → fetchSPN(ref)
  │     ├─ ref in KNOWN_REFS     → SPN card + step:'upload'          [Flow ปกติ]
  │     └─ not found             → spnNotFound() + step:'not_found'  [Flow broker/ไม่มีใบขน]
  │           ├─ chooseXML()       → showXMLUpload() + step:'xml_upload'
  │           │     └─ processXML() → xmlDone() + step:'preview_ready' → Preview → done
  │           ├─ chooseInvoice()   → showInvoiceUpload() + step:'invoice_upload'
  │           │     └─ processInvoice() → showHsAnalysis() + step:'hs_analysis'
  │           │           └─ proceedFromInvoice() → showFormFromInvoice() + step:'form'
  │           └─ chooseFullUpload() → step:'full_upload' → OCR → form
  ├─ "อัปโหลด/upload"           → showUpload() + step:'upload'
  ├─ "ตรวจสอบสถานะ"             → showStatus()
  └─ unknown                     → fallback + chips

startOCR() → 4-stage animation (700ms each) → showForm() → step:'form'
handlePreview() → validate importDate + drugRegNo → PreviewModal
handleConfirmSubmit() → ConfirmModal → handleSubmit() → success → step:'done'
```

### ChatStep states
`idle` → `upload` / `not_found` → `ocr` → `form` → `preview` → `done`
`full_upload` = not_found path with multi-slot upload
`xml_upload` → `preview_ready` = not_found XML path (all fields pre-filled)
`invoice_upload` → `hs_analysis` = not_found Invoice path (HS Code analysis)

### KNOWN_REFS (พบใน SPN — ใช้ Flow ปกติ)
`HTHM000000001` ถึง `HTHM000000005` — ref อื่น (เช่น HTHM000000099) → not_found flow

### Special message content keys (ChatArea.tsx)
| Key | Renders |
|-----|---------|
| `'welcome'` | Welcome message + 4 quick chips |
| `'ocr_progress'` | OcrProgress component (live animation) |
| `'show_form'` | FormPanel component |
| `'show_full_upload'` | FullUploadPanel component |
| anything else (isHtml=true) | `dangerouslySetInnerHTML` |

---

## Global Bridge (window.__chat)
Bot messages contain inline HTML with `onclick`. Page exposes:
```ts
(window as any).__chat = {
  sendQuick:          (t: string) => handleSend(t),
  triggerUpload:      () => withTyping(() => showUpload(), 300),
  triggerFullUpload:  () => { setStep('full_upload'); addMessage({...}) },
  startOCRDemo:       () => startOCR(),
  // Not-found flow choices
  chooseXML:          () => withTyping(() => showXMLUpload(), 300),
  chooseInvoice:      () => withTyping(() => showInvoiceUpload(), 300),
  chooseFullUpload:   () => { setStep('full_upload'); addMessage({...}) },
  // Not-found sub-steps
  processXML:         () => withTyping(() => xmlDone(), 2000),
  processInvoice:     () => withTyping(() => showHsAnalysis(), 2500),
  proceedFromInvoice: () => withTyping(() => showFormFromInvoice(), 700),
  spnNotFoundBack:    () => withTyping(() => spnNotFound(currentRef), 300),
}
```

---

## API Layer (สำหรับ dev ส่งมอบ)

```
src/lib/
├── api/
│   ├── spn.ts   ← fetchSPN(ref) — แทนที่ด้วย real HTTP call
│   └── ocr.ts   ← runOCR(files) — แทนที่ด้วย Textract/Vision
└── mock/
    ├── spn.ts   ← KNOWN_REFS, MOCK_FORM_DATA
    └── ocr.ts   ← MOCK_OCR_FULL
```

**dev ต้องแก้เพียง 2 ไฟล์:** `src/lib/api/spn.ts` และ `src/lib/api/ocr.ts`
ลบ delay mock ออก และแทนที่ด้วย fetch/axios call จริง — `page.tsx` ไม่ต้องแตะ

## Mock Data (src/lib/mock/)
```
KNOWN_REFS: HTHM000000001 → HTHM000000005  (trigger happy path)
Any other ref (e.g. HTHM000000099) → triggers not-found flow

MOCK_OCR_FULL fields:
  invoiceNo:     'INV-2024-8834'
  invoiceDate:   '05/06/2568'
  quantity:      '250'  (กิโลกรัม)
  lotNo:         'LOT-2024-567'
  uNo:           'U-2568-00123'
  importer:      'บริษัท เฮลท์ฟาร์มา จำกัด'
  port:          'ท่าเรือแหลมฉบัง'
  hsCode:        '2941.10.00'
  countryOrigin: 'อินเดีย'

Required user fields (form validation):
  importDate  (วันที่นำเข้า)   — starts empty
  drugRegNo   (เลขทะเบียนยา)  — starts empty
```

---

## Dev Commands
```bash
npm run dev    # Start dev server → http://localhost:3000
npm run build  # TypeScript check + production build
npm run lint   # ESLint
```

---

## Coding Rules (ALWAYS follow)
1. **BizX colors only** — never use Tailwind color classes (text-blue-500 etc.) for brand colors; always use inline `style={{ color: '#0463EF' }}` or the `C.*` constants in page.tsx
2. **IBM Plex Sans Thai** — font is loaded via `<link>` in layout.tsx, not next/font
3. **New bot HTML messages** — use template literals with `C.*` constants and `btnPrimary`, `chipStyle` etc. helper strings defined at top of page.tsx
4. **New chat commands** — add to `handleSend()` in page.tsx before the fallback branch
5. **New sidebar items** — add to `mainItems` array in Sidebar.tsx
6. **New special message types** — add content key + React component branch in ChatArea.tsx
7. **State is centralized** — all useState in page.tsx, pass down as props
8. **TypeScript strict** — no `any` except for `window.__chat` bridge
9. **Animations** — defined in globals.css (slideUp, bounce-dot, pulse-dot) and tailwind.config.js
10. **OCR progress bar** — uses `.ocr-fill` class from globals.css (blue→teal gradient)

---

## Suggested Next Steps
- [ ] Replace `KNOWN_REFS` + `MOCK_FORM_DATA` with real SPN API calls
- [ ] Replace OCR animation with real OCR service (AWS Textract / Google Vision)
- [ ] Add file upload to storage (S3 / GCS) in FullUploadPanel
- [ ] Mobile responsive: collapse sidebar to icon rail at <768px
- [ ] Dark mode using BizX navy as background
- [ ] Persistent chat history (localStorage or backend sessions)
- [ ] PDF inline preview in chat bubbles
- [ ] Real-time license status notifications
