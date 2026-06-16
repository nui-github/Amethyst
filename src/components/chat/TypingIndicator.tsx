'use client'

export function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5 msg-appear">
      {/* AI Avatar */}
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
        style={{
          background: 'linear-gradient(135deg, #010136 0%, #0463EF 100%)',
          boxShadow: '0 3px 10px rgba(4,99,239,0.3)',
        }}
      >
        AI
      </div>

      {/* Bubble */}
      <div
        className="px-4 py-3 rounded-2xl rounded-bl-sm"
        style={{ background: '#fff', border: '1px solid #E0E0E0', boxShadow: '0 2px 8px rgba(1,1,54,0.06)' }}
      >
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                background: '#0463EF',
                opacity: 0.45,
                animation: `bounce-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
