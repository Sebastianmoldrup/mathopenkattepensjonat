'use client'

import { useRouter } from 'next/navigation'

export function PrintToolbar({ title }: { title: string }) {
  const router = useRouter()

  return (
    <div className="print-toolbar no-print">
      <span style={{ flex: 1, fontSize: '14px' }}>{title}</span>
      <button
        onClick={() => window.print()}
        style={{
          background: '#c9b99a',
          border: 'none',
          borderRadius: '6px',
          padding: '6px 16px',
          fontWeight: 600,
          cursor: 'pointer',
          fontSize: '13px',
        }}
      >
        🖨️ Skriv ut
      </button>
      <button
        onClick={() => router.back()}
        style={{
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '6px',
          padding: '6px 12px',
          color: 'white',
          cursor: 'pointer',
          fontSize: '13px',
        }}
      >
        ← Tilbake
      </button>
    </div>
  )
}
