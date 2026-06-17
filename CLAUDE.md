# ShippingNet Assistant — Claude Code Handoff

## Project Overview
Web-based AI chatbot for creating import licenses (RGoods) and managing customs documents.
Built with Next.js 14 App Router + TypeScript + Tailwind CSS + Lucide React.

---

## Tech Stack
- **Framework**: Next.js 14 (App Router, `src/` directory)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + inline `style={}` for BizX brand colors
- **Icons**: Lucide React v0.383.0 (React components in `.tsx`; inline SVG strings in bot HTML messages via `ic()` helpers)
- **Font**: IBM Plex Sans Thai (loaded via `<link>` in layout.tsx)
- **Utilities**: clsx + tailwind-merge

---

## BizX Design System (CRITICAL — always follow)

### Color tokens (use these hex values directly in inline styles)
```
Navy (Primary):   #010136 (bg), #40406A (mid), #8080A5 (muted text)
Blue (Action):    #0463EF (active/CTA), #034DBA (gradient start), #B0D0FF (light)
Teal (Success):   #16EA9E (accent), #11BB7F (mid), #0D8F61 (text on light)
Neutral:          #F2F2F2 (app bg), #F9F9F9 (card lightest), #E0E0E0 (borders)
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

## Layout Structure

```
<div flex-col h-screen>          ← #F2F2F2 bg
  <ChatHeader />                 ← full-width, h-14, white, borderBottom #E8E8E8
  <div flex flex-1>
    <Sidebar />                  ← fixed w-56, white, light theme
    <div flex-1 flex-col>
      {activeItem === 'queue'
        ? <QueuePage />          ← full-height queue view, replaces chat area
        : <>
            <ChatArea />         ← scrollable, #F2F2F2 bg
            <ChatInput />        ← h-75px, white, borderTop #E8E8E8
          </>
      }
    </div>
  </div>
</div>
```

- **ChatHeader**: full-width across entire screen, contains logo + brand + title + status pill + action icons
- **Sidebar**: no collapse, fixed width `w-56`, light white theme (see `L` color object in Sidebar.tsx)
- **Settings section** in sidebar: `padding: '17px 8px'` to match ChatInput bar height (75px)
- **Queue badge**: red circle on คิวงาน sidebar item, shows `needsYouCount` from `queue.filter(s => s.statusKey === 'needs_you').length`
- **QuickActionBar**: always-visible chip bar between ChatArea and ChatInput; only renders on chat view (not queue view)

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
│   │   ├── Sidebar.tsx          ← Light white sidebar (L color object), fixed w-56, needsYouCount badge
│   │   ├── ChatHeader.tsx       ← Full-width white header, logo left, teal status pill
│   │   ├── ChatArea.tsx         ← Routes special content keys to React components
│   │   ├── ChatInput.tsx        ← Textarea + blue send button, white bg
│   │   ├── ConnectPanel.tsx     ← ShippingNet login form (username/password) with Lucide icons
│   │   ├── TypingIndicator.tsx  ← 3-dot bounce, navy→blue AI avatar
│   │   ├── FormPanel.tsx        ← OCR form: teal=filled, blue-soft=missing
│   │   ├── FullUploadPanel.tsx  ← 4-slot drag-drop (invoice/customs/coa/ulicense)
│   │   ├── OcrProgress.tsx      ← Stage rows + blue→teal gradient bar
│   │   ├── QuickChips.tsx       ← Blue pill chips, hover fills solid blue
│   │   ├── Modals.tsx           ← PreviewModal + ConfirmModal (teal confirm)
│   │   ├── SPNListPanel.tsx     ← SPN list table: checkbox multi-select, pagination (5/page), "ขอใบอนุญาต" per row
│   │   └── QuickActionBar.tsx   ← 4-chip bar above ChatInput: สร้าง RGoods / ดูสถานะใบขน / จัดการคิวงาน / อัปโหลดเอกสาร
│   ├── queue/
│   │   └── QueuePage.tsx        ← Full queue UI: ListView (left) + DetailView (right), OCR + draft + email tabs
│   └── ui/
│       ├── Badge.tsx            ← Reusable badge variants
│       └── Button.tsx           ← Reusable button variants
├── hooks/
│   └── useOCRFlow.ts       ← Shared OCR hook (used by both chat page.tsx and QueuePage)
└── lib/
    ├── types.ts            ← ChatMessage, FormData, ChatStep, UploadSlots, SlotKey, SPNEntry, Shipment, AgencyKey, ShipmentStatus
    ├── utils.ts            ← generateId, getTime, KNOWN_REFS, MOCK_FORM_DATA, MOCK_OCR_FULL
    └── mock/
        ├── queue.ts        ← MOCK_QUEUE (6 Shipment objects), AGENCY_LABEL, AGENCY_SHORT, STATUS_META
        └── spn_list.ts     ← MOCK_SPN_LIST (12 SPNEntry objects, HTHM000000001–HTHM000000012)
```

---

## Inline SVG Icon Helpers (page.tsx)

Bot messages use `dangerouslySetInnerHTML` — Lucide React components cannot be used inside them.
Instead, use these helper functions defined at module level in `page.tsx`:

```ts
const ic = (path: string, size = 16, color = 'currentColor') => `<svg ...>${path}</svg>`
const icCheck      = (c='#0D8F61', s=16) => ic('<path d="M20 6 9 17l-5-5"/>', s, c)
const icX          = (c='#C0392B', s=16) => ic('<path d="M18 6 6 18M6 6l12 12"/>', s, c)
const icWarn       = (c='#B45309', s=16) => ic('...triangle...', s, c)
const icFile       = (c='#1565C0', s=16) => ic('...file...', s, c)
const icList       = (c='#0463EF', s=16) => ic('...list...', s, c)
const icPlus       = (c='#0D8F61', s=16) => ic('...plus...', s, c)
const icFolder     = (c='#B45309', s=16) => ic('...folder...', s, c)
const icFolderOpen = (c='#0463EF', s=32) => ic('...folder...', s, c)
const icSearch     = (c='#0463EF', s=16) => ic('...search...', s, c)
const icShip       = (c='#0D8F61', s=18) => ic('...ship...', s, c)
const icUpload     = (c='#0463EF', s=32) => ic('...upload...', s, c)
```

Use these in template literals: `${icCheck(C.tealDark, 15)}` etc.
For inline flex alignment, wrap the element: `style="display:inline-flex;align-items:center;gap:5px"`.

**Never use emoji (🚢 📂 ✅ ❌ ⚠️ etc.) in bot messages** — use SVG helpers instead.

---

## Chat Flow Architecture

```
handleSend(text)
  ├─ "สร้าง rgoods" (no ref) → !isConnected → ConnectPanel → showSPNListInChat()
  │     └─ SPNListPanel: select refs → onRequestPermit(refs) → addToQueueFromChat(refs)
  │           └─ addToQueueFromChat: creates Shipment(needs_you), shows success + "ไปหน้าคิวงาน" btn
  ├─ HTHM ref + "สร้าง/rgoods"
  │     ├─ !isConnected → setPendingRef(ref) → show_connect → ConnectPanel
  │     │     └─ onConnect() → showConnectOptions(ref) → 2 choice cards
  │     │           ├─ "ดูสถานะ" → showStatus()
  │     │           └─ "สร้างใหม่" → fetchSPN(ref)
  │     └─ isConnected → fetchSPN(ref)
  │           ├─ ref in KNOWN_REFS → SPN card + step:'upload'          [Flow ปกติ]
  │           └─ not found         → spnNotFound() + step:'not_found'  [Flow broker]
  │                 ├─ chooseXML()       → showXMLUpload() + step:'xml_upload'
  │                 │     └─ processXML() → xmlDone() + step:'preview_ready'
  │                 ├─ chooseInvoice()   → showInvoiceUpload() + step:'invoice_upload'
  │                 │     └─ processInvoice() → showHsAnalysis() + step:'hs_analysis'
  │                 │           └─ proceedFromInvoice() → showFormFromInvoice() + step:'form'
  │                 └─ chooseFullUpload() → step:'full_upload' → OCR → form
  ├─ "อัปโหลด/upload"   → showUpload() + step:'upload'
  ├─ "ตรวจสอบสถานะ"    → showStatus()
  └─ unknown             → fallback + chips

startOCR() → 4-stage animation (700ms each) → showForm() → step:'form'
handlePreview() → validate importDate + drugRegNo → PreviewModal
handleConfirmSubmit() → ConfirmModal → handleSubmit() → success → step:'done'
```

### ChatStep states
`idle` → `upload` / `not_found` → `ocr` → `form` → `preview` → `done`
`full_upload` = not_found path with multi-slot upload
`xml_upload` → `preview_ready` = not_found XML path (all fields pre-filled)
`invoice_upload` → `hs_analysis` = not_found Invoice path (HS Code analysis)

### ShippingNet Connect Flow
- State: `isConnected: boolean`, `pendingRef: string` in `page.tsx`
- When user triggers RGoods while `!isConnected`: saves ref to `pendingRef`, shows `show_connect` message
- `ConnectPanel` renders in ChatArea for `show_connect` key; calls `onConnected(pendingRef)` after mock auth (1200ms)
- `showConnectOptions(ref)` sets `isConnected = true` and presents 2 choice cards

### KNOWN_REFS (พบใน SPN — ใช้ Flow ปกติ)
`HTHM000000001` ถึง `HTHM000000005` — ref อื่น (เช่น HTHM000000099) → not_found flow

### Special message content keys (ChatArea.tsx)
| Key | Renders |
|-----|---------|
| `'welcome'` | Welcome message + 4 quick chips |
| `'ocr_progress'` | OcrProgress component (live animation) |
| `'show_form'` | FormPanel component |
| `'show_full_upload'` | FullUploadPanel component |
| `'show_connect'` | ConnectPanel component (ShippingNet login) |
| `'show_spn_list'` | SPNListPanel component (SPN list with checkboxes + pagination) |
| anything else (isHtml=true) | `dangerouslySetInnerHTML` |

---

## Queue Page Architecture

### State (all in page.tsx, passed as props)
```ts
queue: Shipment[]                        // all shipments
queueOpenId: string | null               // pre-select a shipment when navigating to queue
spnEntries: SPNEntry[]                   // SPN list shown in chat, tracks inQueue flag
needsYouCount = queue.filter(s => s.statusKey === 'needs_you').length
updateShipment(id, patch)                // partial update helper
addToQueue(newItems)                     // append new Shipment objects
```

### QueuePage flow (src/components/queue/QueuePage.tsx)
```
Header
  ← title "คิวงานขอใบอนุญาต" + "เพิ่มรายการขอใบอนุญาต" primary button (top-right)
  ← stat cards: 6-column responsive grid, clickable filter by status

ListView (left panel, width 300px when detail open, full-width otherwise)
  ← live search input (filters customsNo / customer / goods / hthmRef on keypress)
  ← each row: selected row highlighted blue-left-border + #EFF6FF bg
  ← each row shows status badge, shipment ref, goods, agency

DetailView (right panel, opens on row click)
  Tabs: อัปโหลด/OCR | การประเมิน | ร่างคำขอ | ร่างอีเมล | ประวัติ
  Step bar: 8-step progress bar, full-width with flex+minWidth, horizontal scroll when narrow

  "อัปโหลด/OCR" tab (visible only when statusKey === 'needs_you')
    → dropzone → click "เริ่ม OCR และวิเคราะห์เอกสาร"
    → useOCRFlow.startOCR() → 4-stage animation
    → on complete: updateShipment(id, { draft, conf:88, stage:4, ... })
    → auto-switch to "ร่างคำขอ" tab

  Action bars (per status):
    needs_you:      "ส่งกลับ AI" + "ยืนยันและดำเนินการต่อ" → email_outbox (stage:6)
    email_outbox:   "ส่งอีเมลหาลูกค้า" → await_customer (stage:7)
    await_customer: "แก้ไขเอกสาร" (→ needs_you) + "ลูกค้ายืนยันเอกสารแล้ว"
                    → after confirm: "ดูพรีวิวเอกสารก่อนยื่นกรม"
                    → preview modal: all license fields + "ยื่นกรม" / "ยังไม่ยื่นกรม"
                    → "ยื่นกรม" → submitted (stage:8) + toast notification
```

### Shipment status flow
```
needs_you → (OCR + confirm) → email_outbox → (send email) → await_customer → submitted
no_permit = ไม่ต้องขอใบอนุญาต (HPLC etc.)
```

### ShipmentStatus values & labels (STATUS_META in mock/queue.ts)
| statusKey | label | color |
|---|---|---|
| `needs_you` | รอคุณยืนยัน | orange |
| `no_permit` | ไม่ต้องขอใบอนุญาต | gray |
| `email_outbox` | ร่างอีเมลรอส่ง | blue |
| `await_customer` | รอลูกค้ายืนยัน | purple |
| `submitted` | ยื่นแล้ว | teal |

### AgencyKey values (AGENCY_LABEL / AGENCY_SHORT in mock/queue.ts)
`dld`=กรมปศุสัตว์ | `fda`=อย. | `dft`=กรมการค้าต่างประเทศ | `doa`=กษ. | `diw`=วอ. | `none`=ไม่ระบุ

---

## Global Bridge (window.__chat)
Bot messages contain inline HTML with `onclick`. Page exposes:
```ts
(window as any).__chat = {
  sendQuick:          (t: string) => handleSend(t),
  triggerUpload:      () => withTyping(() => showUpload(), 300),
  triggerFullUpload:  () => { setStep('full_upload'); addMessage({...}) },
  startOCRDemo:       () => startOCR(),
  onConnected:        (ref: string) => withTyping(() => showConnectOptions(ref), 600),
  triggerConnect:     () => { ... },            // show ConnectPanel
  showSPNList:        () => showSPNListInChat(),      // show SPNListPanel in chat
  goToQueue:          (id: string) => { setQueueOpenId(id); setSidebarActive('queue') },
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

## Shared Hook: useOCRFlow (src/hooks/useOCRFlow.ts)

Both `page.tsx` (chat) and `QueuePage` use the same OCR hook:
```ts
export type OCRResult = Awaited<ReturnType<typeof runOCR>>
export function useOCRFlow() {
  return { ocrProgress, ocrStages, isOCRing, startOCR, resetOCR }
}
```
- `startOCR(files)` runs 4 stages × 700ms each, returns `OCRResult` (mock data)
- `QueuePage` calls `useOCRFlow()` inside `DetailView` per-shipment
- `page.tsx` calls `useOCRFlow()` at root level for chat OCR

---

## API Layer (สำหรับ dev ส่งมอบ)

```
src/lib/
├── api/
│   ├── spn.ts   ← fetchSPN(ref) — แทนที่ด้วย real HTTP call
│   └── ocr.ts   ← runOCR(files) — แทนที่ด้วย Textract/Vision
└── mock/
    ├── spn.ts      ← KNOWN_REFS, MOCK_FORM_DATA
    ├── ocr.ts      ← MOCK_OCR_FULL
    ├── queue.ts    ← MOCK_QUEUE (6 Shipment), STATUS_META, AGENCY_LABEL, AGENCY_SHORT
    └── spn_list.ts ← MOCK_SPN_LIST (12 SPNEntry)
```

**dev ต้องแก้เพียง 2 ไฟล์:** `src/lib/api/spn.ts` และ `src/lib/api/ocr.ts`
ลบ delay mock ออก และแทนที่ด้วย fetch/axios call จริง — `page.tsx` ไม่ต้องแตะ

## Mock Data (src/lib/mock/)
```
KNOWN_REFS: HTHM000000001 → HTHM000000005  (trigger happy path)
Any other ref (e.g. HTHM000000099) → triggers not-found flow

MOCK_SPN_LIST: HTHM000000001 → HTHM000000012 (12 entries, pharma/medical context)

MOCK_QUEUE (6 shipments):
  IMP-68-008912: Amoxicillin,        อย.,  needs_you,      2 flags
  IMP-68-008915: Insulin,            อย.,  needs_you,      1 flag
  IMP-68-008920: Surgical Gloves,    อย.,  email_outbox,   1 resolved flag
  IMP-68-008923: Glyphosate,         กษ.,  await_customer, no flags
  IMP-68-008928: HPLC Column,        none, no_permit,      no flags
  IMP-68-008931: Ethanol,            วอ.,  submitted,      no flags

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
4. **No emoji in bot messages** — use inline SVG helpers (`icCheck`, `icX`, `icWarn`, `icFile`, etc.) defined at module level in page.tsx
5. **New chat commands** — add to `handleSend()` in page.tsx before the fallback branch
6. **New sidebar items** — add to `mainItems` array in Sidebar.tsx
7. **New special message types** — add content key + React component branch in ChatArea.tsx
8. **State is centralized** — all useState in page.tsx, pass down as props
9. **TypeScript strict** — no `any` except for `window.__chat` bridge
10. **Animations** — defined in globals.css (slideUp, bounce-dot, pulse-dot) and tailwind.config.js
11. **OCR progress bar** — uses `.ocr-fill` class from globals.css (blue→teal gradient)
12. **Shared OCR logic** — always use `useOCRFlow` hook; never duplicate OCR state in components
13. **Queue state** — `queue: Shipment[]` lives in page.tsx; mutate only via `updateShipment()` and `addToQueue()`
14. **TypeScript Set spread** — use `Array.from(new Set([...]))` not `[...new Set([...])]` (ES target compatibility)

---

## Shipment ID vs customsNo
- `id` (e.g. `IMP-68-008912`) — internal system ID, used for React keys, `updateShipment()`, and `goToQueue()` navigation only
- `customsNo` (e.g. `A012-25680617-00891`) — official customs document number from กรมศุลกากร, always shown to the user in both QueuePage ListView/DetailView and chat status messages

**Rule**: display `customsNo` everywhere in UI; use `id` only for internal references.

---

## QuickActionBar (src/components/chat/QuickActionBar.tsx)
4 pill chips rendered between ChatArea and ChatInput, always visible on chat page:
| Chip | Color | Action |
|---|---|---|
| สร้าง RGoods | Blue `#0463EF` | `handleSend('สร้าง RGoods')` → login → SPN list |
| ดูสถานะใบขน | Teal `#0D8F61` | `showQueueStatusInChat()` → renders all queue items as clickable cards in chat |
| จัดการคิวงาน | Purple `#7C3AED` | `setSidebarActive('queue')` → navigate to queue page |
| อัปโหลดเอกสาร | Orange `#B45309` | `handleSend('upload เอกสาร Invoice')` → show upload module |

`showQueueStatusInChat()` reads live `queue` state and renders each `Shipment` with `customsNo`, goods name, agency badge, and status badge; each row has `onclick="window.__chat?.goToQueue(id)"`.

---

## Suggested Next Steps
- [ ] Replace `KNOWN_REFS` + `MOCK_FORM_DATA` with real SPN API calls
- [ ] Replace mock ShippingNet auth in ConnectPanel with real API login
- [ ] Replace OCR animation with real OCR service (AWS Textract / Google Vision)
- [ ] Replace `MOCK_SPN_LIST` with real SPN list API (paginated, sorted by date desc)
- [ ] Add file upload to storage (S3 / GCS) in FullUploadPanel + QueuePage dropzone
- [ ] Mobile responsive: collapse sidebar to icon rail at <768px
- [ ] Dark mode using BizX navy as background
- [ ] Persistent chat history (localStorage or backend sessions)
- [ ] PDF inline preview in chat bubbles
- [ ] Real-time license status notifications
- [ ] Multi-select bulk action in SPNListPanel → batch queue creation
