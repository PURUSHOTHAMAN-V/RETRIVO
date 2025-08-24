import React from 'react'

export default function VideoBackground({ src = '', overlay = true, children, poster }) {
  const isAudio = typeof src === 'string' && /(\.mp3|\.wav|\.ogg)$/i.test(src)

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {!isAudio ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={poster}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        >
          {src && <source src={src} />}
        </video>
      ) : (
        <>
          {/* Audio-only background: keep gradient/overlay for visual */}
          <audio src={src} autoPlay loop preload="auto" />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #111827, #1f2937)' }} />
        </>
      )}
      {overlay && (
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(2,6,23,0.55), rgba(2,6,23,0.25))' }} />
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}






