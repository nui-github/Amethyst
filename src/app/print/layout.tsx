export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ height: 'auto', overflow: 'auto', minHeight: '100vh' }}>
      {children}
    </div>
  )
}
