import React from 'react'

export default function Stepper({ steps = [], current = 0 }) {
  return (
    <div style={{display:'flex', gap:16, alignItems:'center', flexWrap:'wrap'}}>
      {steps.map((label, i) => (
        <div key={label} style={{display:'flex', alignItems:'center', gap:8}}>
          <div style={{width:28, height:28, borderRadius:999, display:'grid', placeItems:'center', fontWeight:700, background: i<=current ? 'var(--primary)' : '#e2e8f0', color: i<=current? '#fff':'#0f172a'}}>{i+1}</div>
          <div style={{fontWeight: i===current? 700:500}}>{label}</div>
          {i < steps.length - 1 && <div style={{width:40, height:2, background:'#e2e8f0'}} />}
        </div>
      ))}
    </div>
  )
}






