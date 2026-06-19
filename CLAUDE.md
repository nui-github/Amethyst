# ShippingNet Assistant — Claude Code Handoff

## Project Overview
Web-based AI chatbot for creating import licenses (RGoods) and managing customs documents.
Built with Next.js 14 App Router + TypeScript + Tailwind CSS + Lucide React.

---

## Tech Stack
- **Framework**: Next.js 14 (App Router, `src/` directory)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui + inline `style={}` for BizX brand colors
- **Component Library**: shadcn/ui (style: `base-nova`, primitives: `@base-ui/react`) — installed on top of Tailwind
- **Icons**: Lucide React v0.383.0 (React components in `.tsx`; inline SVG strings in bot HTML messages via `ic()` helpers)
- **Font**: IBM Plex Sans Thai (loaded via `<link>` in layout.tsx)
- **Toast**: Sonner (`<Toaster>` in layout.tsx; call via `import { toast } from 'sonner'`)
- **Utilities**: clsx + tailwind-merge (`cn()` helper in `src/lib/utils.ts`)

---

## BizX Design System

> Full design reference (colors, typography, components, gradients, shadows, Do/Don't rules) is in **[DESIGN.md](./DESIGN.md)**.

Key things to know here:
- All brand colors as inline `style={}` hex — never Tailwind color classes
- `C` object at top of `page.tsx` — use `${C.blue}` etc. in all bot HTML string templates
- Raw `<button>` with inline gradient for CTAs — not shadcn Button
- No emoji in bot messages — use SVG helpers (`icCheck`, `icX`, etc.)

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

- **ChatHeader**: slim inner breadcrumb bar (`h-12`), contains sidebar toggle + breadcrumb + connection status pill + action icons
- **Sidebar**: collapsible (224px expanded / 48px icon rail when collapsed), white light theme (see `L` color object in Sidebar.tsx)
  - Company header: `h-12` with logo + "Netbay Agent" + "Assistant" subtitle (no chevron)
  - "New Chat" button at top of nav (above section groups)
  - Section "เครื่องมือ": Chatbot (plain nav, no chevron), คิวงาน (with needsYouCount badge), Dashboard
  - Section "เอกสาร": ใบอนุญาต, RGoods, ใบขน, Analytics, More
  - Settings footer (no borderTop): ตั้งค่า → light divider → BizX logo (links to bizx-uat.devnetbay.com in new tab)
  - Collapsed state: `CollapsedRail` (48px) shows icon-only buttons with portal tooltip on hover
- **Queue badge**: red circle on คิวงาน sidebar item, shows `needsYouCount` from `queue.filter(s => s.isNew === true).length`
- **QuickActionBar**: centered chips (max-width 680px, no bg) between ChatArea and ChatInput; only renders on chat view
- **ChatInput**: no bg/border-top, centered at max-width 680px; Enter to send (no send button); ↵ hint badge inside input

---

## File Structure
```
src/
├── app/
│   ├── layout.tsx          ← Root layout, IBM Plex Sans Thai font
│   ├── globals.css         ← Tailwind + shadcn CSS vars (BizX hex values) + .ocr-fill + .msg-appear
│   │                          NOTE: sets body { overflow: hidden } — override in sub-routes with !important
│   ├── page.tsx            ← ALL state + ALL chat logic + inline HTML helpers
│   └── print/
│       ├── layout.tsx      ← Print route layout — overrides body overflow:hidden from globals.css
│       └── license/
│           └── page.tsx    ← Draft license print page (A4, auto window.print(), read from sessionStorage)
├── components/
│   ├── chat/
│   │   ├── Sidebar.tsx          ← Light white sidebar (L color object), fixed w-56, needsYouCount badge
│   │   ├── ChatHeader.tsx       ← Full-width white header, logo left, teal status pill
│   │   ├── ChatArea.tsx         ← Routes special content keys to React components
│   │   │                           readOnly prop: disables pointer-events on HTML, shows static cards for live keys
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
│   │   └── QueuePage.tsx        ← Full queue UI: ListView (left) + ShipmentChatView (right)
│   │                               Chat history uses <ChatArea readOnly> for consistent rendering
│   └── ui/                  ← shadcn/ui components (generated via `npx shadcn add`)
│       ├── button.tsx           ← shadcn Button (variants: default/outline/ghost/secondary/destructive)
│       ├── badge.tsx            ← shadcn Badge
│       ├── dialog.tsx           ← shadcn Dialog (replaces custom fixed-inset modals)
│       ├── input.tsx            ← shadcn Input
│       ├── textarea.tsx         ← shadcn Textarea (used in ChatInput.tsx)
│       ├── tabs.tsx             ← shadcn Tabs with variant="line" (used in QueuePage DetailView)
│       ├── checkbox.tsx         ← shadcn Checkbox (used in SPNListPanel.tsx)
│       ├── scroll-area.tsx      ← shadcn ScrollArea
│       ├── progress.tsx         ← shadcn Progress
│       ├── separator.tsx        ← shadcn Separator
│       └── sonner.tsx           ← Toaster wrapper for sonner (mounted in layout.tsx)
├── hooks/
│   └── useOCRFlow.ts       ← Shared OCR hook (used by both chat page.tsx and QueuePage)
└── lib/
    ├── types.ts            ← ChatMessage, FormData, ChatStep, UploadSlots, SlotKey, SPNEntry, Shipment, AgencyKey, ShipmentStatus
    │                          Shipment now includes: chatName?, isNew?
    ├── utils.ts            ← generateId, getTime, KNOWN_REFS, MOCK_FORM_DATA, MOCK_OCR_FULL
    └── mock/
        ├── queue.ts        ← MOCK_QUEUE (6 Shipment objects), AGENCY_LABEL, AGENCY_SHORT, STATUS_META
        └── spn_list.ts     ← MOCK_SPN_LIST (12 SPNEntry objects, HTHM000000001–HTHM000000012)
```

---

## Inline SVG Icon Helpers (page.tsx)

Bot messages use `dangerouslySetInnerHTML` — Lucide React components cannot be used inside them.
Use `icCheck`, `icX`, `icWarn`, `icFile`, `icList`, `icPlus`, `icFolder`, `icFolderOpen`, `icSearch`, `icShip`, `icUpload` helpers defined at module level in `page.tsx`.

Full signatures and usage in **[DESIGN.md → Inline SVG Icon Helpers](./DESIGN.md)**.

---

## Chat Flow Architecture

```
handleSend(text)
  ├─ "สร้าง rgoods" (no ref) → !isConnected → ConnectPanel → showSPNListInChat()
  │     └─ SPNListPanel: select refs → onRequestPermit(refs) → addToQueueFromChat(refs)
  ├─ HTHM ref + "สร้าง/rgoods"
  │     ├─ !isConnected → setPendingRef(ref) → show_connect → ConnectPanel
  │     └─ isConnected → fetchSPN(ref)
  │           ├─ ref in KNOWN_REFS → SPN card + step:'upload'
  │           └─ not found → spnNotFound() → showImportLicenseMenu()
  └─ unknown → fallback + chips

showImportLicenseMenu() → 3 cards:
  ├─ "ใบขนสินค้า"          → chooseCustomsDocs() → single upload box (PDF/JPG/PNG/XML)
  │                               → processInvoiceFirst() → OCR → showOCRResultsInChat()
  │                               → flags (individual confirm) → proceedAfterFlags()
  │                               → 2 choices: "ต้องการส่งอีเมล" | "ตรวจสอบข้อมูลก่อนส่งกรม"
  │                                     ├─ showEmailDraftInChat() → editable To/Subject/Body
  │                                     │     → ส่งอีเมล (enable เมื่อ To+Subject+Body ครบ)
  │                                     │     → customerConfirmedInChat() → showPreviewInChat()
  │                                     └─ showPreviewInChat() → ยืนยันส่งกรม → step:'done'
  ├─ "ใบ Invoice"           → chooseInvoiceFirst() → showInvoiceFirstUpload()
  │                               → processInvoiceFirst() → OCR → showOCRResultsInChat()
  └─ "เอกสารชุดสำหรับการขอใบอนุญาตนำเข้า" → chooseDocs() → show_full_upload (FullUploadPanel)
                                  → onFullUploadOCR() → OCR → showForm()

Flag confirm flow:
  - setConfirmedFlagIds([]) + setConfirmedFlagValues({}) + pendingFlagValues.current={} on new flags
  - Each flag generation gets unique prefix via flagsGen ref (e.g. fg1_, fg2_) to avoid DOM ID collisions
  - "ยืนยัน" button (teal/green) starts disabled; enabled only after user selects qty OR types GMP value
  - confirmFlag(id): stores value → setConfirmedFlagIds + setConfirmedFlagValues
  - unconfirmFlag(id): restores interactive area DOM + removes from state (reversible until ถัดไป)
  - applyConfirmedFlags(ids, suffix, values) in ChatArea: swaps _interactive ↔ _confirmed_display, shows value label
  - "ถัดไป →" button id="${g}_flags_next_btn" disabled until all N flags confirmed

After ถัดไป → 2-choice card:
  ├─ "ต้องการส่งอีเมล" → showEmailDraftInChat()
  └─ "ตรวจสอบข้อมูลก่อนส่งกรม" → showPreviewInChat()

After "ส่งอีเมล" sent → emailSent() shows:
  ├─ "ลูกค้ายืนยันเอกสารแล้ว" → customerConfirmedInChat() → showPreviewInChat()
  └─ "แก้ไขเอกสาร" → editDocsFromEmail() → show_full_upload

Email draft (showEmailDraftInChat):
  - Each call generates unique prefix via emailGen ref (e.g. em1_, em2_) to avoid DOM ID collisions
  - "ถึง" field: placeholder only (user fills email)
  - "หัวข้อ" field: AI pre-filled, user can edit
  - "เนื้อหา": AI pre-filled textarea, scrollable, user can edit
  - "ส่งอีเมล" button: disabled until To+Subject+Body all non-empty — checkEmailReady(eg) uses prefixed IDs
```

### ChatStep states
`idle` → `upload` / `not_found` → `ocr` → `form` → `preview` → `done`
`full_upload` = multi-slot FullUploadPanel upload
`invoice_upload` = invoice-first single upload path

### ShippingNet Connect Flow
- State: `isConnected: boolean`, `pendingRef: string` in `page.tsx`
- When user triggers RGoods while `!isConnected`: saves ref to `pendingRef`, shows `show_connect` message
- `ConnectPanel` renders in ChatArea for `show_connect` key; calls `onConnected(pendingRef)` after mock auth (1200ms)
- `showConnectOptions(ref)` sets `isConnected = true` and presents 2 choice cards

### KNOWN_REFS (พบใน SPN — ใช้ Flow ปกติ)
`HTHM000000001` ถึง `HTHM000000005` — ref อื่น (เช่น HTHM000000099) → not_found flow

### Special message content keys (ChatArea.tsx)
| Key | Live render | readOnly render |
|-----|-------------|-----------------|
| `'welcome'` | Welcome message + 4 quick chips | static summary card |
| `'ocr_progress'` | OcrProgress component (live animation) | "OCR เสร็จสิ้นแล้ว" card |
| `'show_form'` | FormPanel component | "ฟอร์มกรอกข้อมูล — บันทึกแล้ว" card |
| `'show_full_upload'` | FullUploadPanel component | "อัปโหลดเอกสารชุด — ประมวลผลแล้ว" card |
| `'show_connect'` | ConnectPanel component | "เชื่อมต่อ ShippingNet — สำเร็จแล้ว" card |
| `'show_spn_list'` | SPNListPanel component | "รายการ SPN — เลือกแล้ว" card |
| anything else (isHtml=true) | `dangerouslySetInnerHTML` | same HTML, wrapped `pointer-events:none` |

**`readOnly` mode rules:**
- Pass only `messages` prop — all other props are optional with safe defaults
- Use `<ChatArea messages={msgs} readOnly />` in QueuePage history view
- Never call `applyConfirmedFlags` in readOnly mode (no live DOM to mutate)

---

## Queue Page Architecture

### State (all in page.tsx, passed as props)
```ts
queue: Shipment[]                        // all shipments
queueOpenId: string | null               // pre-select a shipment when navigating to queue
spnEntries: SPNEntry[]                   // SPN list shown in chat, tracks inQueue flag
needsYouCount = queue.filter(s => s.isNew === true).length  // unseen items only
updateShipment(id, patch)                // partial update helper
addToQueue(newItems)                     // append new Shipment objects
flowStartMsgIdx: useRef<number>          // index into messages[] where the current permit flow began
submittedRefNo: string                   // last RG-2568-XXXXX generated by handleSubmit (used by print page)
```

### QueuePage flow (src/components/queue/QueuePage.tsx)
```
Header
  ← title "คิวงานขอใบอนุญาต" + "เพิ่มรายการขอใบอนุญาต" primary button (top-right)
  ← stat cards: 6-column responsive grid, clickable filter by status

ListView (left panel, width 300px when detail open, full-width otherwise)
  ← live search input (filters customsNo / customer / goods / hthmRef on keypress)
  ← each row: selected row highlighted blue-left-border + #EFF6FF bg
  ← primary label: chatName (auto-generated) or customsNo as fallback
  ← secondary line: goods description; if chatName exists, shows customsNo as subtitle
  ← isNew rows show blue "ใหม่" badge inline in label
  ← on row click: updateShipment(id, { isNew: false }) → sidebar badge decrements

ShipmentChatView (right panel, opens on row click)
  ← header: customsNo + status badge + step progress bar (8 steps)
  ← chat history: <ChatArea messages={localMessages} readOnly />
      → same bubble style as main chat, buttons non-interactive (pointer-events:none)
      → live special keys (show_form, ocr_progress etc.) shown as static summary cards
  ← live OCR progress appended below history when isOCRing
  ← OCR upload prompt shown when needsOCR + !isOCRing

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

### chatName — Auto-generated display name
`Shipment.chatName?: string` — set by `handleSubmit` and `onRequestPermit` in page.tsx

Priority chain (first non-empty wins):
1. HTHM ref (e.g. `HTHM000000003`) — when flow started with a ref
2. Invoice No (e.g. `INV-2024-8834`) — from OCR formData
3. Importer · Goods (e.g. `เฮลท์ฟาร์มา · Amoxicillin`) — always available after OCR
4. Timestamp fallback `ขอใบ DD MMM YYYY`

ListView shows `chatName` as primary label; `customsNo` as subtitle below goods line.
Mock queue items (no chatName) fall back to showing `customsNo` as primary.

### isNew — Unseen badge & sidebar count
- `Shipment.isNew?: boolean` — `true` = ยังไม่เคยเปิดดู → แสดง blue "ใหม่" badge ใน ListView
- `needsYouCount` (sidebar badge) = `queue.filter(s => s.isNew === true).length`
- เมื่อกดเปิดรายการ: `updateShipment(id, { isNew: false })` → badge ลดทันที
- รายการจาก mock: `needs_you` items เริ่มด้วย `isNew: true`
- รายการใหม่จาก chat: สร้างด้วย `isNew: true` เสมอ

### Chat history tracking per permit flow
- `flowStartMsgIdx` ref (in page.tsx) — set to `messages.length` at every flow entry point:
  `fetchSPN`, `spnNotFound`, `chooseCustomsDocs`, `chooseInvoiceFirst`, `chooseDocs`
- On `handleSubmit`: slice `messages.slice(flowStartMsgIdx.current)` → store as `Shipment.messages`
- On `onRequestPermit` (SPNListPanel): create one Shipment per ref, each with messages snapshot
- Each new flow in the same chat session overwrites `flowStartMsgIdx` → messages are correctly partitioned

### AgencyKey values (AGENCY_LABEL / AGENCY_SHORT in mock/queue.ts)
`dld`=กรมปศุสัตว์ | `fda`=อย. | `dft`=กรมการค้าต่างประเทศ | `doa`=กษ. | `diw`=วอ. | `none`=ไม่ระบุ

---

## Global Bridge (window.__chat)
Bot messages contain inline HTML with `onclick`. Page exposes:
```ts
(window as any).__chat = {
  sendQuick:              (t: string) => handleSend(t),
  triggerUpload:          () => withTyping(() => showUpload(), 300),
  triggerFullUpload:      () => { setStep('full_upload'); addMessage({...}) },
  startOCRDemo:           () => startOCR(),
  onConnected:            (ref: string) => withTyping(() => showConnectOptions(ref), 600),
  triggerConnect:         () => { ... },
  showSPNList:            () => showSPNListInChat(),
  goToQueue:              (id: string) => { setQueueOpenId(id); setSidebarActive('queue') },
  chooseCustomsDocs:      () => single upload box for ใบขนสินค้า,
  chooseInvoiceFirst:     () => invoice-first upload,
  chooseDocs:             () => full_upload panel,
  proceedAfterFlags:      () => show 2-choice card (email / preview),
  // Flag confirm (unique prefix eg. fg1_flag_qty per flagsGen)
  setPendingFlagValue:    (id, val) => pendingFlagValues.current[id] = val,
  selectQty:              (val) => highlight qty btn + store pendingFlagValue + enable confirm btn,
  confirmFlag:            (id) => read pendingFlagValues → setConfirmedFlagIds + setConfirmedFlagValues,
  unconfirmFlag:          (id) => restore interactive DOM + remove from state,
  // Email draft (unique prefix eg. em1_ per emailGen)
  showEmailDraftInChat:   () => renders draft with eg-prefixed IDs,
  checkEmailReady:        (eg) => check eg_email_to/subject/body → enable/disable eg_send_email_btn,
  emailSent:              (eg) => userMsg + show 2-choice (ลูกค้ายืนยัน / แก้ไขเอกสาร),
  customerConfirmedInChat:() => userMsg + showPreviewInChat(),
  editDocsFromEmail:      () => userMsg + show_full_upload,
  showPreviewInChat:      () => preview + ยืนยันส่งกรม → handleSubmit(),
  confirmSubmitFromChat:  () => userMsg + handleSubmit(),
  editAndReupload:        () => userMsg + show_full_upload,
}
```

**ID collision prevention**: `flagsGen` ref (flagsGen.current++) and `emailGen` ref (emailGen.current++) generate unique prefixes per card generation. `getElementById` always returns the first match, so all DOM queries must use the generation-specific prefixed ID.

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

### Design rules → see [DESIGN.md](./DESIGN.md) for full detail
1. **BizX colors only** — never use Tailwind color classes for brand colors; use inline `style={{ color: '#0463EF' }}` or `C.*` constants in page.tsx
2. **IBM Plex Sans Thai** — loaded via `<link>` in layout.tsx, not `next/font`
3. **New bot HTML messages** — use `C.*` constants + `btnPrimary`, `chipStyle` etc. helper strings from top of page.tsx
4. **No emoji in bot messages** — use SVG helpers (`icCheck`, `icX`, `icWarn` etc.) from page.tsx
5. **BizX gradient buttons** — raw `<button>` with inline gradient style; do not use shadcn Button for gradient CTAs
6. **shadcn theming** — CSS vars in `globals.css :root {}` stay as hex (`--primary: #0463EF`); never change to oklch
7. **Toast** — `import { toast } from 'sonner'`; `<Toaster>` already in layout.tsx

### Architecture rules
8. **New chat commands** — add to `handleSend()` in page.tsx before the fallback branch
9. **New sidebar items** — add to `mainItems` array in Sidebar.tsx
10. **New special message types** — add content key + React component branch in ChatArea.tsx
11. **State is centralized** — all useState in page.tsx, pass down as props
12. **TypeScript strict** — no `any` except for `window.__chat` bridge
13. **Animations** — defined in globals.css (slideUp, bounce-dot, pulse-dot) and tailwind.config.js; OCR bar uses `.ocr-fill`
14. **Shared OCR logic** — always use `useOCRFlow` hook; never duplicate OCR state in components
15. **Queue state** — `queue: Shipment[]` lives in page.tsx; mutate only via `updateShipment()` and `addToQueue()`
16. **TypeScript Set spread** — use `Array.from(new Set([...]))` not `[...new Set([...])]` (ES target compatibility)
17. **shadcn/ui components** — use from `src/components/ui/`; available: `button`, `badge`, `dialog`, `input`, `textarea`, `tabs`, `scroll-area`, `progress`, `checkbox`, `separator`, `sonner`

---

## Shipment ID vs customsNo
- `id` (e.g. `IMP-68-008912`) — internal system ID, used for React keys, `updateShipment()`, and `goToQueue()` navigation only
- `customsNo` (e.g. `A012-25680617-00891`) — official customs document number from กรมศุลกากร, always shown to the user in both QueuePage ListView/DetailView and chat status messages

**Rule**: display `customsNo` everywhere in UI; use `id` only for internal references.

---

## Print License Page (src/app/print/license/page.tsx)

Opens in a new tab when user clicks "พิมพ์ใบอนุญาต" chip after submission.

**Data flow:**
```
handleSend('พิมพ์ใบอนุญาต')
  → build printData from formData + submittedRefNo
  → sessionStorage.setItem('__printLicenseData', JSON.stringify(printData))
  → window.open('/print/license', '_blank')
```

**Page behaviour:**
- Reads `sessionStorage.__printLicenseData` on mount
- Auto-calls `window.print()` after 600ms
- Renders A4-formatted draft with 3 sections: ผู้นำเข้า / รายละเอียดสินค้า / เอกสารอ้างอิง
- Shows DRAFT watermark badge + "พิมพ์ / บันทึก PDF" button (hidden on print)
- `src/app/print/layout.tsx` overrides `body { overflow: hidden }` from globals.css with `!important`

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

### Recently completed
- [x] Print license page (`/print/license`) — A4 draft PDF, auto-print, opens from "พิมพ์ใบอนุญาต" chip
- [x] Chat history per permit flow — `flowStartMsgIdx` partitions messages; `handleSubmit` creates Shipment with snapshot
- [x] `chatName` auto-naming — priority chain: HTHM ref → invoiceNo → importer·goods → timestamp
- [x] `ChatArea readOnly` mode — QueuePage history uses same component; buttons non-interactive, live keys show static cards
- [x] `isNew` field added to Shipment type (was used in code but missing from type definition)
