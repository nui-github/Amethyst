# ShippingNet Assistant

AI chatbot สำหรับสร้างใบอนุญาตนำเข้า (RGoods) และจัดการเอกสารศุลกากร  
Built with Next.js 14 · TypeScript · Tailwind CSS · BizX Design System

---

## Quick Start

```bash
# 1. ติดตั้ง dependencies
npm install

# 2. รัน dev server
npm run dev
# → http://localhost:3000

# 3. Type check
npm run build

# 4. Lint
npm run lint
```

**Node version**: 20.x (ใช้ `nvm use v20.12.0`)

---

## ภาพรวมระบบ

ระบบแบ่งเป็น 2 ส่วนหลัก:

| ส่วน | คำอธิบาย |
|---|---|
| **Chatbot** | User คุยกับ AI เพื่อสร้างใบอนุญาตนำเข้า ผ่าน natural language |
| **คิวงาน (Queue)** | เจ้าหน้าที่ติดตาม/ยืนยันใบอนุญาตทุกใบ พร้อม chat history ต่อใบ |

### User Flow หลัก

```
User พิมพ์ ref ใบขน (HTHM...)
  → ระบบดึงข้อมูลจาก ShippingNet (SPN)
  → User อัปโหลดเอกสาร (Invoice / ใบขน / ชุดเอกสาร)
  → AI OCR ดึงข้อมูล → แสดงฟอร์มให้ตรวจสอบ
  → User ยืนยัน flag → ส่งอีเมลหาลูกค้า (optional)
  → ยืนยันส่งกรมศุลกากร → บันทึกใน Queue → พิมพ์ร่างใบอนุญาต
```

---

## โครงสร้างโปรเจค

```
src/
├── app/
│   ├── page.tsx              ← state ทั้งหมด + chat logic
│   ├── globals.css           ← Tailwind + BizX CSS vars
│   └── print/license/        ← หน้าพิมพ์ร่างใบอนุญาต (A4)
├── components/
│   ├── chat/                 ← Sidebar, ChatArea, ChatInput, FormPanel ฯลฯ
│   └── queue/                ← QueuePage (ListView + ShipmentChatView)
├── hooks/
│   └── useOCRFlow.ts         ← OCR state hook (shared)
└── lib/
    ├── types.ts              ← TypeScript interfaces
    ├── api/                  ← fetchSPN, runOCR (mock → ต้องแทนด้วย real API)
    └── mock/                 ← MOCK_QUEUE, MOCK_SPN_LIST, MOCK_OCR_FULL
```

ดูรายละเอียดทั้งหมดใน [CLAUDE.md](./CLAUDE.md)

---

## ไฟล์ที่ต้องแก้ก่อน production

**แก้เพียง 2 ไฟล์เท่านั้น** — ส่วนอื่นไม่ต้องแตะ:

| ไฟล์ | สิ่งที่ต้องทำ |
|---|---|
| `src/lib/api/spn.ts` | แทน mock delay ด้วย `fetch('/api/spn/:ref')` |
| `src/lib/api/ocr.ts` | แทน mock ด้วย AWS Textract / Google Vision |

ดูรายละเอียด contract ใน [API.md](./API.md)

---

## Environment Variables

ยังไม่มี `.env` ที่จำเป็น — ทุกอย่างยังเป็น mock  
เมื่อ connect real API ให้สร้าง `.env.local`:

```env
SHIPPINGNET_API_URL=https://...
SHIPPINGNET_API_KEY=...
OCR_SERVICE_URL=https://...
OCR_API_KEY=...
```

---

## เอกสารอ้างอิง

| ไฟล์ | เนื้อหา |
|---|---|
| [CLAUDE.md](./CLAUDE.md) | Architecture, state, chat flows, coding rules |
| [DESIGN.md](./DESIGN.md) | Colors, typography, components, Do/Don't |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System diagram, data flow, decision log |
| [API.md](./API.md) | API contracts, request/response shapes, mock → real guide |
