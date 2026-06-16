import { FormData } from '@/lib/types'

// Refs ที่มีข้อมูลใน SPN (dev: แทนที่ด้วย API call จริง)
export const KNOWN_REFS = [
  'HTHM000000001',
  'HTHM000000002',
  'HTHM000000003',
  'HTHM000000004',
  'HTHM000000005',
]

// ข้อมูลใบขนจาก SPN (dev: แทนที่ด้วย response จาก GET /api/spn/:ref)
export const MOCK_FORM_DATA: Omit<FormData, 'ref'> = {
  declarant:       'บริษัท ไทยเทรด จำกัด',
  importer:        'บริษัท เฮลท์ฟาร์มา จำกัด',
  port:            'ท่าเรือแหลมฉบัง',
  declarationDate: '10/06/2568',
  goodsDesc:       'วัตถุดิบยา (Active Pharmaceutical Ingredient)',
  hsCode:          '2941.10.00',
  countryOrigin:   'อินเดีย',
  quantity:        '',
  unit:            'กิโลกรัม',
  licenseType:     'RGoods',
  invoiceNo:       '',
  invoiceDate:     '',
  lotNo:           '',
  uNo:             '',
}
