'use client'

import { useEffect, useState } from 'react'

interface LicenseData {
  ref: string
  refNo: string
  importer: string
  declarant: string
  port: string
  hsCode: string
  countryOrigin: string
  quantity: string
  unit: string
  invoiceNo: string
  invoiceDate: string
  lotNo: string
  uNo: string
  drugRegNo: string
  importDate: string
  goodsDesc: string
  licenseType: string
  printedAt: string
}

export default function PrintLicensePage() {
  const [data, setData] = useState<LicenseData | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('__printLicenseData')
    if (stored) {
      setData(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    if (data) {
      setTimeout(() => window.print(), 600)
    }
  }, [data])

  if (!data) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'IBM Plex Sans Thai, sans-serif', color: '#666' }}>
        กำลังโหลดข้อมูล...
      </div>
    )
  }

  const field = (label: string, value: string, wide = false) => (
    <div style={{
      gridColumn: wide ? 'span 2' : 'span 1',
      padding: '8px 0',
      borderBottom: '1px solid #E0E0E0',
    }}>
      <div style={{ fontSize: 10, color: '#888', marginBottom: 2, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 12, color: '#010136', fontWeight: 600 }}>{value || '—'}</div>
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: auto !important; overflow: visible !important; overflow-y: auto !important; }
        body { font-family: 'IBM Plex Sans Thai', sans-serif; background: #f5f5f5; }
        @media print {
          @page { size: A4; margin: 15mm 15mm 15mm 20mm; }
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      {/* Print button — hidden on print */}
      <div className="no-print" style={{
        position: 'fixed', top: 12, right: 16, zIndex: 100,
        display: 'flex', gap: 8,
      }}>
        <button onClick={() => window.print()} style={{
          padding: '7px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg, #034DBA, #0463EF)', color: '#fff',
          fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
        }}>
          พิมพ์ / บันทึก PDF
        </button>
        <button onClick={() => window.close()} style={{
          padding: '7px 14px', borderRadius: 8, border: '1px solid #ccc', cursor: 'pointer',
          background: '#fff', color: '#555', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
        }}>
          ปิด
        </button>
      </div>

      {/* Document */}
      <div style={{ maxWidth: 794, margin: '0 auto', padding: '32px 24px', background: '#fff', minHeight: '100vh' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24, borderBottom: '2px solid #010136', paddingBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 8 }}>
            {/* BizX logo mark */}
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'linear-gradient(135deg, #0463EF, #16EA9E)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 14, letterSpacing: '-0.5px' }}>BX</span>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 11, color: '#8080A5', fontWeight: 500 }}>ระบบ BizX — Netbay Agent</div>
              <div style={{ fontSize: 10, color: '#aaa' }}>shippingnet.netbay.co.th</div>
            </div>
          </div>

          <div style={{ fontSize: 16, fontWeight: 700, color: '#010136', marginBottom: 2 }}>
            ใบอนุญาตนำเข้า (ร่าง)
          </div>
          <div style={{ fontSize: 12, color: '#0463EF', fontWeight: 600 }}>
            แบบ {data.licenseType || 'RGoods'} — ร่างสำหรับยื่นกรมศุลกากร
          </div>

          {/* Watermark badge */}
          <div style={{
            display: 'inline-block', marginTop: 8,
            padding: '3px 14px', borderRadius: 20,
            background: 'rgba(4,99,239,0.08)', border: '1px solid rgba(4,99,239,0.25)',
            fontSize: 11, color: '#0463EF', fontWeight: 600,
          }}>
            DRAFT — ยังไม่ได้รับการอนุมัติจากกรม
          </div>
        </div>

        {/* Reference row */}
        <div style={{
          display: 'flex', gap: 12, marginBottom: 20,
          padding: '10px 14px', borderRadius: 10,
          background: 'rgba(4,99,239,0.04)', border: '1px solid rgba(4,99,239,0.15)',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: '#888', fontWeight: 500 }}>เลขอ้างอิงใบขนสินค้า</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#010136' }}>{data.ref || '—'}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: '#888', fontWeight: 500 }}>เลขใบอนุญาต (ชั่วคราว)</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0463EF' }}>{data.refNo || '—'}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: '#888', fontWeight: 500 }}>วันที่พิมพ์</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#010136' }}>{data.printedAt}</div>
          </div>
        </div>

        {/* Section: ผู้นำเข้า */}
        <div style={{ marginBottom: 20 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: 0.3,
            background: '#010136', borderRadius: '6px 6px 0 0',
            padding: '5px 12px',
          }}>ข้อมูลผู้นำเข้า</div>
          <div style={{
            border: '1px solid #E0E0E0', borderTop: 'none',
            borderRadius: '0 0 6px 6px', padding: '12px 14px',
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px',
          }}>
            {field('ชื่อผู้นำเข้า / Importer', data.importer, true)}
            {field('ผู้ดำเนินพิธีการ / Declarant', data.declarant)}
            {field('ท่าเรือ / Port of Entry', data.port)}
          </div>
        </div>

        {/* Section: สินค้า */}
        <div style={{ marginBottom: 20 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: 0.3,
            background: '#0463EF', borderRadius: '6px 6px 0 0',
            padding: '5px 12px',
          }}>รายละเอียดสินค้า</div>
          <div style={{
            border: '1px solid #E0E0E0', borderTop: 'none',
            borderRadius: '0 0 6px 6px', padding: '12px 14px',
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px',
          }}>
            {field('รายละเอียดสินค้า / Goods Description', data.goodsDesc, true)}
            {field('พิกัดศุลกากร / HS Code', data.hsCode)}
            {field('ประเทศต้นทาง / Country of Origin', data.countryOrigin)}
            {field('ปริมาณ / Quantity', `${data.quantity} ${data.unit}`.trim())}
            {field('เลขล็อต / Lot No.', data.lotNo)}
            {field('เลข U / U No.', data.uNo)}
          </div>
        </div>

        {/* Section: เอกสาร */}
        <div style={{ marginBottom: 20 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: 0.3,
            background: '#11BB7F', borderRadius: '6px 6px 0 0',
            padding: '5px 12px',
          }}>ข้อมูลเอกสารอ้างอิง</div>
          <div style={{
            border: '1px solid #E0E0E0', borderTop: 'none',
            borderRadius: '0 0 6px 6px', padding: '12px 14px',
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px',
          }}>
            {field('เลข Invoice / Invoice No.', data.invoiceNo)}
            {field('วันที่ Invoice / Invoice Date', data.invoiceDate)}
            {field('เลขทะเบียนยา / Drug Reg. No.', data.drugRegNo)}
            {field('วันที่นำเข้า / Import Date', data.importDate)}
          </div>
        </div>

        {/* Signature section */}
        <div style={{
          marginTop: 32, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20,
          borderTop: '1px dashed #CCCCCC', paddingTop: 20,
        }}>
          {['ผู้จัดทำ / Prepared by', 'ผู้ตรวจสอบ / Checked by', 'ผู้อนุมัติ / Approved by'].map(label => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ height: 48, borderBottom: '1px solid #CCCCCC', marginBottom: 6 }} />
              <div style={{ fontSize: 10, color: '#888' }}>{label}</div>
              <div style={{ fontSize: 10, color: '#bbb', marginTop: 2 }}>วันที่ ........................</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 24, paddingTop: 12, borderTop: '1px solid #F0F0F0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ fontSize: 9, color: '#bbb' }}>
            สร้างโดย Netbay Agent (BizX) · เอกสารนี้เป็นร่างที่ยังไม่ได้รับการอนุมัติ
          </div>
          <div style={{ fontSize: 9, color: '#bbb' }}>
            พิมพ์เมื่อ {data.printedAt}
          </div>
        </div>
      </div>
    </>
  )
}
