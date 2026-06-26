'use client'

import { useRouter } from 'next/navigation'

export function PrintToolbar({ title }: { title: string }) {
  const router = useRouter()

  return (
    <div className="print-toolbar no-print">
      <button
        onClick={() => router.back()}
        style={{
          background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '6px',
          padding: '6px 14px',
          color: 'white',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: 500,
        }}
      >
        ← Tilbake
      </button>
      <span style={{ flex: 1, fontSize: '14px', color: 'rgba(255,255,255,0.8)', paddingLeft: '8px' }}>
        {title}
      </span>
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
          color: '#3d2e1e',
        }}
      >
        🖨️ Skriv ut
      </button>
    </div>
  )
}
