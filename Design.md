# BizX Design System — UI Reference

> Source of truth for colors, typography, spacing, components, and visual rules.  
> See `CLAUDE.md` for architecture, state, and coding rules. See `API.md` for backend contracts.

---

## Color Tokens

Use hex values directly in inline `style={}`. **Never use Tailwind color classes for brand colors.**

### Navy (Primary)
| Token | Hex | Usage |
|---|---|---|
| navy | `#010136` | Headings, strong text, dark backgrounds |
| navy-mid | `#40406A` | Secondary text, user avatar gradient |
| navy-light | `#8080A5` | Muted text, sidebar labels, agent name |

### Blue (Action)
| Token | Hex | Usage |
|---|---|---|
| blue | `#0463EF` | CTA buttons, active state, links, focus rings |
| blue-deep | `#034DBA` | Gradient start, darker primary |
| blue-light | `#B0D0FF` | Light tint, hover backgrounds |

### Teal (Success / Accent)
| Token | Hex | Usage |
|---|---|---|
| teal | `#16EA9E` | Accent, success highlights |
| teal-mid | `#11BB7F` | Submit button gradient, OCR stage done |
| teal-dark | `#0D8F61` | Success text on light bg, checkmarks |

### Neutral
| Hex | Usage |
|---|---|
| `#F2F2F2` | App background (chat area) |
| `#F9F9F9` | Card lightest background |
| `#E0E0E0` | Borders, dividers |
| `#CCCCCC` | Dashed borders |
| `#999999` | Muted / placeholder / timestamps |
| `#666666` | Label text |
| `#333333` | Dark body text |
| `#ffffff` | Cards, panels, sidebar, header |

### Semantic
| Intent | Background | Text |
|---|---|---|
| Success / Confirm | `rgba(22,234,158,0.15)` | `#0D8F61` |
| Warning | `rgba(255,165,0,0.12)` | `#B45309` |
| Error | `rgba(220,38,38,0.06)` | `#991B1B` |
| Info | `rgba(4,99,239,0.08)` | `#0463EF` |
| SPN source tag | `rgba(4,99,239,0.10)` | `#0463EF` |
| OCR source tag | `rgba(22,234,158,0.15)` | `#0D8F61` |
| User-edited tag | `rgba(255,165,0,0.12)` | `#B45309` |

### Status badge colors (QueuePage)
| Status | bg | text |
|---|---|---|
| รอคุณยืนยัน | `#FFFBEB` | `#B45309` |
| ร่างอีเมลรอส่ง | `#EFF6FF` | `#1D4ED8` |
| รอลูกค้ายืนยัน | `#F5F3FF` | `#6D28D9` |
| ยื่นแล้ว | `#ECFDF5` | `#065F46` |
| ไม่ต้องขอใบอนุญาต | `#F3F4F6` | `#6B7280` |

---

## `C` Constant (page.tsx)

All inline HTML bot messages use this object — never hardcode hex values directly:

```ts
const C = {
  navy:     '#010136',
  blue:     '#0463EF',
  blueDeep: '#034DBA',
  teal:     '#16EA9E',
  tealMid:  '#11BB7F',
  tealDark: '#0D8F61',
  n50:      '#F9F9F9',
  n100:     '#F2F2F2',
  n200:     '#E0E0E0',
  n300:     '#CCCCCC',
  n500:     '#999999',
  n600:     '#666666',
}
```

Usage: `` `color:${C.blue}` ``, `` `background:${C.n100}` ``

---

## Gradients

```
Primary CTA:   linear-gradient(135deg, #034DBA, #0463EF)
Teal CTA:      linear-gradient(135deg, #11BB7F, #16EA9E)
AI avatar:     linear-gradient(90deg,  #0463EF, #16EA9E)   ← same as OCR progress bar
Sidebar logo:  linear-gradient(90deg,  #0463EF, #16EA9E)
BX badge:      linear-gradient(135deg, #0463EF, #16EA9E)
User avatar:   linear-gradient(135deg, #40406A, #0463EF)
Profile icon:  #0463EF solid
```

---

## Typography

**Font**: IBM Plex Sans Thai — loaded via `<link>` in `layout.tsx` (not `next/font`)  
**Weights**: 300, 400, 500, 600, 700

| Role | Size | Weight | Color |
|---|---|---|---|
| Page / card heading | 14–16px | 700 | `#010136` |
| Body / chat message | 13–14px | 400 | `#010136` |
| Bot message content | 13px | 400 | `#010136` |
| Label | 11–12px | 600 | `#666666` |
| Caption / timestamp | 10px | 400 | `#999999` |
| Badge / tag | 10–11px | 600–700 | varies |
| Agent name label | 11px | 600 | `#8080A5` |

---

## Spacing & Layout

| Property | Value |
|---|---|
| App background | `#F2F2F2` |
| Card/panel background | `#ffffff` |
| Max content width (chat) | `680px` centered |
| Sidebar expanded | `224px` (w-56) |
| Sidebar collapsed | `48px` icon rail |
| Header height | `h-12` (48px) |
| Card border-radius | `rounded-2xl` (16px) |
| Button border-radius | `rounded-xl` (12px) |
| Chip border-radius | `rounded-full` (20px) |
| Card border | `1px solid #DDE1F8` |
| Card shadow | `0 2px 12px rgba(4,10,80,0.07)` |

---

## Components

### Sidebar (white light theme)
```
Background:    #ffffff
Active item:   bg #EFF6FF, left border 3px solid #0463EF, text #010136
Inactive item: text #374151, hover bg #F9FAFB
Section label: text #999999, font-size 10px, uppercase, tracking-wider
Logo badge:    gradient(90deg, #0463EF, #16EA9E), rounded-xl
Collapsed:     48px icon rail with portal tooltip on hover
```

### ChatHeader
```
Background:      #ffffff
Bottom border:   1px solid #E8E8E8
Status pill:     bg rgba(22,234,158,0.10), border rgba(22,234,158,0.35), dot #16EA9E (pulse)
Breadcrumb text: #010136 bold / #999999 separator
```

### AI Message Bubble
```
Max-width:   680px, centered
Background:  #ffffff
Border:      1px solid #DDE1F8
Shadow:      0 2px 12px rgba(4,10,80,0.07)
Radius:      rounded-2xl
Avatar:      24×24px gradient(90deg, #0463EF, #16EA9E), text "AI", 9px bold
Agent label: "Netbay Agent" — 11px, #8080A5
```

### User Message Bubble
```
Background:  linear-gradient(135deg, #034DBA, #0463EF)
Color:       #ffffff
Radius:      rounded-2xl rounded-br-sm
Max-width:   max-w-xs (320px)
Avatar:      32×32px gradient(135deg, #40406A, #0463EF), Lucide <User size={14} />
```

### Buttons

> **Rule**: Use raw `<button>` with inline gradient for CTA — never shadcn `Button` for gradient styles.

| Variant | Style |
|---|---|
| Primary (blue) | `background: linear-gradient(135deg, #034DBA, #0463EF)`, color white, rounded-xl |
| Teal / success | `background: linear-gradient(135deg, #11BB7F, #16EA9E)`, color white, rounded-xl |
| Ghost / secondary | `background: #F3F4F6`, color `#6B7280`, rounded-xl |
| Danger | `background: rgba(220,38,38,0.06)`, border `rgba(220,38,38,0.2)`, color `#991B1B` |

All buttons: `font-weight: 700`, `font-size: 13px`, `cursor: pointer`, `transition: all .15s`

### Helper strings in page.tsx

These are pre-built inline style strings for bot HTML messages:

```ts
btnPrimary   // blue gradient <button> with flex+gap
btnSecondary // ghost/gray <button>
chipStyle    // blue pill chip: padding, border-radius, blue tint bg/border/text
badgeBlue    // inline blue rounded badge
cardWrap     // card outer: border #E8E8F8, radius 14px
cardHead     // card header: bg #F5F6FF, navy bold text
cardBody     // card content: white bg, padding
rowStyle     // label:value flex row with dashed bottom border
```

### Quick Chips
```
Default: bg rgba(4,99,239,0.08), border 1px solid rgba(4,99,239,0.25), color #0463EF, radius 20px
Hover:   bg #0463EF, color #fff, shadow 0 2px 10px rgba(4,99,239,0.25)
```

### Form Fields (FormPanel)
| State | Border | Background |
|---|---|---|
| Default | `#CCCCCC` | `#ffffff` |
| Filled (OCR) | `#16EA9E` | `rgba(22,234,158,0.07)` |
| Filled (SPN) | `#0463EF` | `rgba(4,99,239,0.10)` |
| Missing (required) | `#70A0F0` | `rgba(4,99,239,0.04)` |
| Focus | `#0463EF` + ring | `#ffffff` |

### OCR Progress Bar
```
Track:   #E0E0E0
Fill:    .ocr-fill class → gradient(90deg, #0463EF, #16EA9E)  (defined in globals.css)
Height:  8px, border-radius: 9999px
```

### Upload Panel (FullUploadPanel)
```
4 slots: invoice / customs / coa / ulicense
Dropzone:    border 2px dashed rgba(4,99,239,0.3), bg rgba(4,99,239,0.04)
Hover:       border #0463EF, bg rgba(4,99,239,0.08)
Filled slot: border #16EA9E, bg rgba(22,234,158,0.06)
```

---

## shadcn/ui Components

Installed in `src/components/ui/`. Use for non-gradient, non-branded elements.

| Component | Use for |
|---|---|
| `Button` | Ghost, outline, secondary (non-gradient) actions |
| `Badge` | Status tags, counters |
| `Dialog` | Modals and confirmation dialogs |
| `Input` | Text inputs in standard forms |
| `Textarea` | Multi-line input (ChatInput uses this) |
| `Tabs` | Tab navigation with `variant="line"` |
| `Checkbox` | Multi-select lists (SPNListPanel) |
| `ScrollArea` | Scrollable regions |
| `Progress` | Progress bars |
| `Separator` | Dividers |
| `Toaster` (sonner) | Toast notifications — already mounted in layout.tsx |

**CSS vars** in `globals.css @layer base :root {}` map to BizX hex:
`--primary: #0463EF`, `--accent: #16EA9E` — never change these to oklch or other formats.

**Toast usage:**
```ts
import { toast } from 'sonner'
toast.success('ส่งสำเร็จ')
toast.error('เกิดข้อผิดพลาด')
```

---

## Inline SVG Icon Helpers (page.tsx)

Bot messages render via `dangerouslySetInnerHTML` — Lucide JSX cannot be used inside them.
Use these helpers instead (defined at module level in `page.tsx`):

```ts
const ic = (path: string, size = 16, color = 'currentColor') =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"
    stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    style="display:inline-block;vertical-align:middle">${path}</svg>`

icCheck      (c='#0D8F61', s=16)  → ✓ checkmark
icX          (c='#C0392B', s=16)  → ✗ close / error
icWarn       (c='#B45309', s=16)  → ⚠ triangle warning
icFile       (c='#1565C0', s=16)  → document / file
icList       (c='#0463EF', s=16)  → list lines
icPlus       (c='#0D8F61', s=16)  → + add
icFolder     (c='#B45309', s=16)  → folder closed
icFolderOpen (c='#0463EF', s=32)  → folder open (large upload area)
icSearch     (c='#0463EF', s=16)  → search / magnifier / OCR
icShip       (c='#0D8F61', s=18)  → ship / vessel
icUpload     (c='#0463EF', s=32)  → upload arrow (large)
```

Usage in template literal: `` `${icCheck(C.tealDark, 15)} ส่งสำเร็จ` ``  
For flex alignment: `` `style="display:inline-flex;align-items:center;gap:5px"` ``

---

## Animations

Defined in `globals.css` and `tailwind.config.js`:

| Class / keyframe | Effect | Used in |
|---|---|---|
| `.msg-appear` | slide-up + fade-in on mount | Every chat bubble |
| `bounce-dot` | 3-dot typing bounce (staggered) | TypingIndicator |
| `pulse-dot` | slow pulse glow | Status dot in header |
| `.ocr-fill` | blue→teal gradient fill (animated width) | OcrProgress bar |

---

## Shadows

| Usage | Value |
|---|---|
| Primary button | `0 4px 14px rgba(4,99,239,0.25)` |
| Teal button | `0 4px 14px rgba(22,234,158,0.30)` |
| Bot bubble / card | `0 2px 12px rgba(4,10,80,0.07)` |
| Modal | `0 20px 60px rgba(1,1,54,0.22)` |
| Sidebar active item | `0 2px 12px rgba(4,99,239,0.35)` |

---

## Design Rules (Do / Don't)

| ✅ Do | ❌ Don't |
|---|---|
| `style={{ color: '#0463EF' }}` for brand colors | `className="text-blue-500"` for brand colors |
| Raw `<button>` with inline gradient for CTAs | shadcn `Button` for gradient CTAs (strips styles) |
| `C.*` constants in all bot HTML string templates | Hardcode hex values directly in template literals |
| `icCheck`, `icX` etc. for icons in bot messages | Lucide JSX inside `dangerouslySetInnerHTML` |
| IBM Plex Sans Thai via `<link>` in layout.tsx | `next/font` for this font (not compatible) |
| `toast` from `sonner` for notifications | Custom toast state |
| shadcn CSS vars stay as hex values | Change vars to oklch or hsl formats |
