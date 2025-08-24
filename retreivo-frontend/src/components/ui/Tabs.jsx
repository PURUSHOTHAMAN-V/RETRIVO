import React, { useState } from 'react'

export default function Tabs({ tabs = [], defaultIndex = 0, onChange }) {
  const [index, setIndex] = useState(defaultIndex)
  const active = tabs[index] || {}
  return (
    <div>
      <div style={{display:'flex', gap:8, borderBottom:'1px solid #e2e8f0'}}>
        {tabs.map((t, i) => (
          <button key={t.label} className="btn" style={{background: i===index? 'linear-gradient(135deg, var(--primary), var(--primary-700))':'#e2e8f0', color: i===index? '#fff':'#0f172a'}} onClick={() => { setIndex(i); onChange && onChange(i) }}>{t.label}</button>
        ))}
      </div>
      <div style={{marginTop:12}}>
        {active.content}
      </div>
    </div>
  )
}






