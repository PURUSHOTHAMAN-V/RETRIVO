import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div>
      <section className="hero">
        <div className="hero-inner container">
          <h1 className="title">Find What Matters, Faster</h1>
          <p className="subtitle">AI-powered lost & found matching for citizens and hubs.</p>
          <div style={{display:'flex', gap:12, marginTop:12}}>
            <Link className="btn" to="/login-user">Login as User</Link>
            <Link className="btn" to="/login-hub">Login as Hub</Link>
          </div>
        </div>
      </section>

      <div className="container" style={{marginTop:24}}>
        <div className="grid grid-2">
          <div className="card">
            <h3>Smart Matching</h3>
            <p>Image and text similarity search powered by ML.</p>
          </div>
          <div className="card">
            <h3>Verified Claims</h3>
            <p>Secure workflows with OTP and DigiLocker.</p>
          </div>
        </div>
      </div>
    </div>
  )
}






