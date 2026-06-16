'use client'

interface QuickChipsProps {
  chips: { label: string; value: string }[]
  onSelect: (value: string) => void
}

export function QuickChips({ chips, onSelect }: QuickChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {chips.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => onSelect(value)}
          className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150"
          style={{
            background: 'rgba(4,99,239,0.08)',
            border: '1px solid rgba(4,99,239,0.25)',
            color: '#0463EF',
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = '#0463EF'
            e.currentTarget.style.color = '#fff'
            e.currentTarget.style.borderColor = '#0463EF'
            e.currentTarget.style.boxShadow = '0 2px 10px rgba(4,99,239,0.25)'
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = 'rgba(4,99,239,0.08)'
            e.currentTarget.style.color = '#0463EF'
            e.currentTarget.style.borderColor = 'rgba(4,99,239,0.25)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
