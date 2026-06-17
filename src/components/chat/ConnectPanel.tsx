'use client'
import { useState } from 'react'
import { LogIn, Eye, EyeOff, Loader2 } from 'lucide-react'

interface ConnectPanelProps {
  onConnect: (username: string, password: string) => void
}

export function ConnectPanel({ onConnect }: ConnectPanelProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass]  = useState(false)
  const [loading, setLoading]    = useState(false)
  const [error, setError]        = useState('')

  const handleSubmit = () => {
    if (!username.trim() || !password.trim()) {
      setError('กรุณากรอก Username และ Password')
      return
    }
    setError('')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onConnect(username.trim(), password)
    }, 1200)
  }

  const inputBase: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: 10,
    border: '1px solid #E0E0E0',
    fontSize: 13,
    outline: 'none',
    background: '#F9F9F9',
    color: '#333',
    boxSizing: 'border-box',
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10, flexShrink: 0,
          background: 'linear-gradient(135deg,#034DBA,#0463EF)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <LogIn size={15} color="#fff" strokeWidth={2} />
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#010136', margin: 0 }}>เชื่อมต่อ ShippingNet</p>
          <p style={{ fontSize: 11, color: '#999', margin: 0 }}>กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: '#666', display: 'block', marginBottom: 4 }}>Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="กรอก Username"
            style={inputBase}
            onFocus={e => { e.target.style.borderColor = '#0463EF'; e.target.style.background = '#fff' }}
            onBlur={e => { e.target.style.borderColor = '#E0E0E0'; e.target.style.background = '#F9F9F9' }}
          />
        </div>

        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: '#666', display: 'block', marginBottom: 4 }}>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="กรอก Password"
              style={{ ...inputBase, paddingRight: 36 }}
              onFocus={e => { e.target.style.borderColor = '#0463EF'; e.target.style.background = '#fff' }}
              onBlur={e => { e.target.style.borderColor = '#E0E0E0'; e.target.style.background = '#F9F9F9' }}
            />
            <button
              type="button"
              onClick={() => setShowPass(v => !v)}
              style={{
                position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: 0,
              }}
            >
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        {error && (
          <p style={{ fontSize: 11, color: '#E53E3E', margin: 0 }}>{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            marginTop: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '9px 0', borderRadius: 10, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            background: 'linear-gradient(135deg,#034DBA,#0463EF)',
            color: '#fff', fontSize: 13, fontWeight: 700,
            opacity: loading ? 0.75 : 1,
            boxShadow: '0 4px 12px rgba(4,99,239,0.28)',
            transition: 'opacity .15s',
          }}
        >
          {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <LogIn size={14} />}
          {loading ? 'กำลังเชื่อมต่อ...' : 'เชื่อมต่อ ShippingNet'}
        </button>
      </div>
    </div>
  )
}
