import React, { useEffect, useState } from 'react'

export default function Counter({ to = 1000, duration = 1200, prefix = '', suffix = '' }) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let raf
    const start = performance.now()
    const step = (now) => {
      const p = Math.min(1, (now - start) / duration)
      setValue(Math.floor(p * to))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [to, duration])
  return <span>{prefix}{value.toLocaleString()}{suffix}</span>
}






