import React, { useMemo } from 'react'

function scorePassword(pw) {
  let score = 0
  if (!pw) return 0
  if (pw.length >= 8) score += 1
  if (/[A-Z]/.test(pw)) score += 1
  if (/[a-z]/.test(pw)) score += 1
  if (/[0-9]/.test(pw)) score += 1
  if (/[^A-Za-z0-9]/.test(pw)) score += 1
  return Math.min(score, 5)
}

export default function PasswordStrength({ value = '' }) {
  const score = useMemo(() => scorePassword(value), [value])
  const colors = ['#e2e8f0', '#f87171', '#fbbf24', '#34d399', '#22c55e']
  const labels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong']
  return (
    <div>
      <div style={{display:'flex', gap:6, marginTop:6}}>
        {Array.from({ length:5 }).map((_, i) => (
          <div key={i} style={{flex:1, height:6, borderRadius:6, background: i < score ? colors[score-1] : '#e2e8f0'}} />
        ))}
      </div>
      <div style={{fontSize:12, color:'#475569', marginTop:4}}>{score ? labels[score-1] : 'Enter password'}</div>
    </div>
  )
}






