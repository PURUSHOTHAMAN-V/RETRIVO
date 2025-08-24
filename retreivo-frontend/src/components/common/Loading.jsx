import React from 'react'

export default function Loading({ label = 'Loading...' }) {
  return (
    <div style={{display:'flex', alignItems:'center', gap:10}}>
      <span style={{width:16, height:16, border:'2px solid #cbd5e1', borderTopColor:'#2563eb', borderRadius:'50%', display:'inline-block', animation:'spin 0.8s linear infinite'}} />
      <span>{label}</span>
      <style>{'@keyframes spin { to { transform: rotate(360deg) } }'}</style>
    </div>
  )
}






