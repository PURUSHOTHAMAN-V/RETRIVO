import React from 'react'

export default function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null
  return (
    <div style={{position:'fixed', inset:0, background:'rgba(2,6,23,0.5)', display:'grid', placeItems:'center', zIndex:1000}} onClick={onClose}>
      <div className="card" style={{width:'min(92vw, 560px)'}} onClick={e=>e.stopPropagation()}>
        {title && <div style={{fontWeight:700, fontSize:18, marginBottom:12}}>{title}</div>}
        <div>{children}</div>
        {footer && <div style={{marginTop:16, display:'flex', justifyContent:'flex-end', gap:8}}>{footer}</div>}
      </div>
    </div>
  )
}






