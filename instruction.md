# ShippingNet Assistant — Developer Instruction

> Next.js 14 · Tailwind CSS · Lucide React · IBM Plex Sans Thai  
> Design System: **BizX** (Business Exchange)  
> Last updated: June 2026 | Version 2.0.0

---

## 📦 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | `14.2.5` |
| Styling | Tailwind CSS | `3.4.x` |
| Icons | Lucide React | `0.383.0` |
| Font | IBM Plex Sans Thai (Google Fonts via `<link>`) | — |
| Language | TypeScript | `5.x` |
| Utilities | clsx + tailwind-merge | Latest |

---

## 🚀 Quick Start

```bash
cd shippingnet-chatbot
npm install
npm run dev
# → http://localhost:3000
```

### Production build
```bash
npm run build
npm start
```

---

## 🎨 BizX Color Reference (Quick Copy)

```ts
// Primary Navy
const NAVY = '#010136'   // sidebar bg, primary text, headings
const NAVY_MID = '#40406A'  // dividers, user avatar gradient
const NAVY_LIGHT = '#8080A5' // sidebar muted text

// Secondary Blue  
const BLUE = '#0463EF'   // active items, CTA buttons, links
const BLUE_DEEP = '#034DBA'  // button gradient start

// Accent Teal
const TEAL = '#16EA9E'   // success, status dot, OCR checkmarks
const TEAL_MID = '#11BB7F'   // confirm button gradient start
const TEAL_DARK = '#0D8F61'  // success text, OCR filled text

// Neutrals
const N_BG = '#F0F0F0'   // app / chat area background
const N_CARD = '#F9F9F9' // card hover / lightest bg
const N_BORDER = '#E0E0E0' // borders and dividers
const N_DASHED = '#CCCCCC'  // dashed borders
const N_500 = '#999999'  // timestamps, helper text
const N_600 = '#666666'  // labels, secondary text

// Gradients
const GRAD_PRIMARY = 'linear-gradient(135deg, #034DBA, #0463EF)'
const GRAD_TEAL    = 'linear-gradient(135deg, #11BB7F, #16EA9E)'
const GRAD_LOGO    = 'linear-gradient(135deg, #010136, #0463EF)'
const GRAD_BX      = 'linear-gradient(135deg, #0463EF, #16EA9E)'  // BX badge
```

### Inline HTML helper strings (used in `page.tsx`)
```ts
const btnPrimary   // blue gradient button
const btnSecondary // light grey button
const chipStyle    // blue pill chip
const cardWrap     // card container
const cardHead     // card header row
const cardBody     // card body padding
const badgeSPN / badgeOCR / badgeUser  // source badges
const badgeBlue / badgeAmber / badgeGreen  // semantic badges
```

---

## 🗂️ Project Structure

```
shippingnet-chatbot/
├── src/
│   ├── app/
│   │   ├── layout.tsx          ← Root layout (IBM Plex Sans Thai via <link>)
│   │   ├── globals.css         ← Tailwind + BizX CSS vars + .ocr-fill .msg-appear
│   │   └── page.tsx            ← All state, all inline HTML uses BizX C.* constants
│   ├── components/
│   │   ├── chat/
│   │   │   ├── Sidebar.tsx          ← Navy dark sidebar (#010136)
│   │   │   ├── ChatHeader.tsx       ← White header + teal status pill
│   │   │   ├── ChatArea.tsx         ← #F0F0F0 bg, routes to special content
│   │   │   ├── ChatInput.tsx        ← #F0F0F0 → white focus, blue send btn
│   │   │   ├── TypingIndicator.tsx  ← Navy→blue gradient AI avatar + blue dots
│   │   │   ├── FormPanel.tsx        ← Teal filled / blue soft missing fields
│   │   │   ├── FullUploadPanel.tsx  ← Per-slot file upload (blue/teal accents)
│   │   │   ├── OcrProgress.tsx      ← Stage rows + blue→teal gradient bar
│   │   │   ├── QuickChips.tsx       ← Blue pill chips → solid blue hover
│   │   │   └── Modals.tsx           ← PreviewModal (blue) + ConfirmModal (teal)
│   │   └── ui/
│   │       ├── Badge.tsx            ← Reusable badge (SPN/OCR/user variants)
│   │       └── Button.tsx           ← Reusable button (primary/teal/secondary)
│   └── lib/
│       ├── types.ts            ← ChatMessage, FormData, ChatStep, UploadSlots
│       └── utils.ts            ← generateId, getTime, KNOWN_REFS, mock data
├── Design.md                   ← BizX design system reference
├── instruction.md              ← This file
├── tailwind.config.js          ← navy/blue/teal/neutral tokens + animations
├── globals.css                 ← BizX CSS variables, .ocr-fill, .msg-appear
├── postcss.config.js
├── tsconfig.json
├── next.config.js
└── package.json
```

---

## 🔄 Chat Flow Architecture

All state and logic lives in `src/app/page.tsx`.

```
handleSend(text)
    │
    ├─ Contains "HTHM + สร้าง/rgoods" → fetchSPN(ref)
    │       ├─ In KNOWN_REFS   → SPN data card  → step:'upload'
    │       └─ Not found       → spnNotFound()  → step:'not_found'
    │
    ├─ 'อัปโหลด' / 'upload'   → showUpload()   → step:'upload'
    │
    ├─ 'ตรวจสอบสถานะ'        → showStatus()
    │
    └─ Unknown                → fallback with chips

Upload / OCR:
  startOCR() → animates 4 stages (700ms each)
    └─ showForm() → step:'form' → renders FormPanel in ChatArea

Form:
  handlePreview() → validate importDate + drugRegNo
    └─ setShowPreview(true) → PreviewModal

PreviewModal:
  onConfirm → setShowConfirm(true) → ConfirmModal
    └─ handleSubmit() → success message → step:'done'

Full Upload (not-found flow):
  triggerFullUpload() → renders FullUploadPanel
  handleFullUploadOCR(slots) → startOCR()
```

### ChatStep States

| State | Description |
|-------|-------------|
| `idle` | Waiting for first command |
| `upload` | Show upload zone (known ref path) |
| `full_upload` | Multi-slot upload (not-found path) |
| `not_found` | SPN ref not found in KNOWN_REFS |
| `ocr` | OCR animation running (4 stages) |
| `form` | Form rendered, waiting for missing fields |
| `preview` | PreviewModal open |
| `done` | Submitted successfully |

---

## 🌐 Global Bridge (`window.__chat`)

Bot messages contain inline HTML with `onclick` handlers.
The page exposes a bridge in `useEffect`:

```ts
(window as any).__chat = {
  sendQuick:         (t: string) => handleSend(t),
  triggerUpload:     () => withTyping(() => showUpload(), 300),
  triggerFullUpload: () => { setStep('full_upload'); addMessage({...}) },
  startOCRDemo:      () => startOCR(),
}
```

Usage in inline HTML:
```html
<button onclick="window.__chat?.sendQuick('สร้าง RGoods')">...</button>
<button onclick="window.__chat?.triggerFullUpload()">...</button>
<button onclick="window.__chat?.startOCRDemo()">...</button>
```

---

## 🧩 Special Message Content Keys

In `ChatArea.tsx → MessageRow`, these string values trigger React components:

| Content key | Renders |
|-------------|---------|
| `'welcome'` | `<WelcomeMessage />` with 4 quick chips |
| `'ocr_progress'` | `<OcrProgress />` with live stage + bar animation |
| `'show_form'` | `<FormPanel />` with teal-filled / blue-missing fields |
| `'show_full_upload'` | `<FullUploadPanel />` with 4 drag-drop slots |
| Anything else (isHtml=true) | `dangerouslySetInnerHTML` |
| Anything else (isHtml=false) | Plain text |

---

## 🧪 Testing All Flows

### ✅ Happy Path (Known Ref)
1. Type: `สร้าง RGoods ด้วยใบขน Ref : HTHM000000003`
2. Bot fetches SPN data (1.8s delay)
3. Click chip: `📎 อัปโหลดเอกสาร`
4. Click: `🔍 OCR & วิเคราะห์ไฟล์`
5. OCR animates 4 stages
6. Form appears — fill `วันที่นำเข้า` + `เลขทะเบียนยา`
7. Click: `ดู Preview ก่อนส่ง`
8. Preview modal — click: `ยืนยันส่งข้อมูลเข้ากรม`
9. Confirm modal — click: `ยืนยันส่ง`
10. ✅ Success card with temp RG license number

### ⚠️ Not-Found Path (Unknown Ref)
1. Type: `สร้าง RGoods ด้วยใบขน Ref : HTHM999999999`
2. Not-found card appears (amber border)
3. Click: `📤 อัปโหลดเพื่อ OCR`
4. FullUploadPanel renders (4 slots: Invoice, ใบขน, COA, ใบเลข U)
5. Click: `เริ่ม OCR เอกสารทั้งหมด`
6. Continue from step 5 of Happy Path

### 📋 Status Check
1. Type: `ตรวจสอบสถานะใบอนุญาต`
2. Shows status card for HTHM000000003 / HTHM000000001

---

## 🔧 Extending the Project

### Add a new chat command
In `page.tsx → handleSend()`:
```ts
} else if (lower.includes('your-keyword')) {
  withTyping(() => yourNewFunction(), 600)
}
```

### Add a new sidebar menu item
In `Sidebar.tsx → mainItems`:
```ts
{ id: 'tracking', label: 'ติดตามสินค้า', icon: MapPin }
```

### Add a new special message type
1. Add content key: `'show_tracking'`
2. In `ChatArea.tsx → MessageRow`:
```tsx
{msg.content === 'show_tracking' && <TrackingPanel ... />}
```
3. Create `src/components/chat/TrackingPanel.tsx`

### Replace mock data with real API
In `src/lib/utils.ts`, update:
- `KNOWN_REFS` → fetch from `/api/refs`
- `MOCK_FORM_DATA` → response from SPN API
- `MOCK_OCR_FULL` → response from OCR service

---

## 🎯 Mock Data Reference

```
Known SPN Refs (happy path):
  HTHM000000001 → HTHM000000005

Unknown ref → not-found flow (manual multi-slot upload)

OCR Output (MOCK_OCR_FULL):
  invoiceNo:     'INV-2024-8834'
  invoiceDate:   '05/06/2568'
  quantity:      '250'
  lotNo:         'LOT-2024-567'
  uNo:           'U-2568-00123'
  importer:      'บริษัท เฮลท์ฟาร์มา จำกัด'
  port:          'ท่าเรือแหลมฉบัง'
  hsCode:        '2941.10.00'
  countryOrigin: 'อินเดีย'

User-required fields (form validation):
  - importDate  (วันที่นำเข้า)  — required, initially empty
  - drugRegNo   (เลขทะเบียนยา) — required, initially empty
```

---

## 🔮 Future Enhancements

- [ ] Real SPN API integration (replace `KNOWN_REFS` + `MOCK_FORM_DATA`)
- [ ] Real OCR service (replace animation with actual API)
- [ ] File upload to storage (S3 / GCS)
- [ ] Mobile responsive sidebar (collapse to icon rail at < 768px)
- [ ] Dark mode variant (BizX has deep navy — natural dark mode candidate)
- [ ] Persistent chat history (localStorage or backend sessions)
- [ ] Multi-ref batch processing
- [ ] PDF preview inline in chat
- [ ] Notification system for license approvals

---

## 📝 Update Log

| Date | Version | Changes |
|------|---------|---------|
| June 2026 | 1.0.0 | Initial release — **Amethyst** purple design system |
| June 2026 | 2.0.0 | **Design system migrated to BizX** — Navy `#010136` + Blue `#0463EF` + Teal `#16EA9E`. All components, inline HTML, globals.css, tailwind.config updated. Design.md and instruction.md fully rewritten. |
