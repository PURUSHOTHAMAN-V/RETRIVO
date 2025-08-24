import React from 'react'

export default function OTPVerification() {
  return (
    <div className="container" style={{maxWidth: 420}}>
      <h2>Verify OTP</h2>
      <div className="card grid">
        <input className="input" placeholder="Enter 6-digit code" />
        <button className="btn">Verify</button>
      </div>
    </div>
  )
}






