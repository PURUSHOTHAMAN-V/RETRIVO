import React, { useRef } from 'react'

export default function OTPInput({ length = 6, value = '', onChange }) {
  const inputs = Array.from({ length })
  const refs = useRef([])
  const vals = (value || '').padEnd(length, ' ').slice(0, length).split('')

  const setChar = (i, ch) => {
    const next = (value || '').split('')
    next[i] = ch
    const joined = next.join('').replace(/\s+/g, '')
    onChange && onChange(joined)
    if (ch && refs.current[i+1]) refs.current[i+1].focus()
  }

  return (
    <div style={{display:'flex', gap:8}}>
      {inputs.map((_, i) => (
        <input
          key={i}
          ref={el => refs.current[i] = el}
          value={vals[i] === ' ' ? '' : vals[i]}
          onChange={e => setChar(i, e.target.value.replace(/\D/g, '').slice(-1))}
          onKeyDown={e => { if (e.key === 'Backspace' && !vals[i] && refs.current[i-1]) refs.current[i-1].focus() }}
          inputMode="numeric"
          className="input"
          style={{width:44, textAlign:'center', fontSize:18}}
          maxLength={1}
        />
      ))}
    </div>
  )
}






