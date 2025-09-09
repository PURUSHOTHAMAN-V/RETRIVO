import React from 'react'
import { Link } from 'react-router-dom'
import VideoBackground from '../components/ui/VideoBackground'
import Counter from '../components/ui/Counter'
import { FiCpu, FiShield, FiShare2, FiChevronDown } from 'react-icons/fi'
import { FaCoins } from 'react-icons/fa'

export default function LandingPage() {
  return (
    <div>
      <section style={{height:'85vh', position:'relative'}}>
        <VideoBackground src="/assets/video.webM">
          <div style={{position:'absolute', inset:0, display:'grid', placeItems:'center', textAlign:'center', color:'white', padding:24}}>
            <div style={{maxWidth: 900}}>
              <h1 style={{fontSize:48, margin:0}}>AI-Powered Lost & Found System</h1>
              <p style={{opacity:0.9, fontSize:18, margin:'12px 0 20px'}}>Connecting communities to reunite people with their belongings</p>
              <div style={{marginTop:24, opacity:0.85}}><FiChevronDown size={28} /></div>
            </div>
          </div>
        </VideoBackground>
      </section>

      {/* Feature Cards Section */}
      <section style={{
        marginTop: '40px',
        padding: '0 24px 48px',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          '@media(maxWidth: 768px)': {
            gridTemplateColumns: '1fr',
            gap: '20px'
          }
        }}>
          <div className="card" style={{
            textAlign: 'center',
            padding: '32px 24px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}>
            <div style={{marginBottom: '16px'}}>
              <FiCpu size={32} style={{color: '#2563eb'}} />
            </div>
            <h3 style={{margin: '0 0 12px 0', fontSize: '20px', fontWeight: '600', color: '#111827'}}>AI-Powered Matching</h3>
            <p style={{margin: 0, color: '#6b7280', lineHeight: '1.6'}}>Advanced image and text similarity to find best matches.</p>
          </div>
          
          <div className="card" style={{
            textAlign: 'center',
            padding: '32px 24px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}>
            <div style={{marginBottom: '16px'}}>
              <FiShield size={32} style={{color: '#2563eb'}} />
            </div>
            <h3 style={{margin: '0 0 12px 0', fontSize: '20px', fontWeight: '600', color: '#111827'}}>Secure Verification</h3>
            <p style={{margin: 0, color: '#6b7280', lineHeight: '1.6'}}>OTP, DigiLocker, and fraud checks ensure trust and safety.</p>
          </div>
          
          <div className="card" style={{
            textAlign: 'center',
            padding: '32px 24px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}>
            <div style={{marginBottom: '16px'}}>
              <FaCoins size={32} style={{color: '#2563eb'}} />
            </div>
            <h3 style={{margin: '0 0 12px 0', fontSize: '20px', fontWeight: '600', color: '#111827'}}>Rewards System</h3>
            <p style={{margin: 0, color: '#6b7280', lineHeight: '1.6'}}>Earn coins for helping reunite items with owners.</p>
          </div>
          
          <div className="card" style={{
            textAlign: 'center',
            padding: '32px 24px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}>
            <div style={{marginBottom: '16px'}}>
              <FiShare2 size={32} style={{color: '#2563eb'}} />
            </div>
            <h3 style={{margin: '0 0 12px 0', fontSize: '20px', fontWeight: '600', color: '#111827'}}>Hub Network</h3>
            <p style={{margin: 0, color: '#6b7280', lineHeight: '1.6'}}>Partner hubs coordinate claims and returns efficiently.</p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section style={{
        background: '#f8fafc',
        padding: '48px 24px',
        marginTop: '32px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
          '@media(maxWidth: 768px)': {
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px'
          },
          '@media(maxWidth: 480px)': {
            gridTemplateColumns: '1fr',
            gap: '16px'
          }
        }}>
          <div className="card" style={{
            textAlign: 'center',
            padding: '24px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{fontSize: '28px', fontWeight: '700', color: '#2563eb', marginBottom: '8px'}}>
              <Counter to={25000} suffix="+" />
            </div>
            <div style={{color: '#6b7280', fontWeight: '500'}}>Items Recovered</div>
          </div>
          
          <div className="card" style={{
            textAlign: 'center',
            padding: '24px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{fontSize: '28px', fontWeight: '700', color: '#2563eb', marginBottom: '8px'}}>
              <Counter to={50000} suffix="+" />
            </div>
            <div style={{color: '#6b7280', fontWeight: '500'}}>Active Users</div>
          </div>
          
          <div className="card" style={{
            textAlign: 'center',
            padding: '24px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{fontSize: '28px', fontWeight: '700', color: '#2563eb', marginBottom: '8px'}}>
              <Counter to={500} suffix="+" />
            </div>
            <div style={{color: '#6b7280', fontWeight: '500'}}>Partner Hubs</div>
          </div>
          
          <div className="card" style={{
            textAlign: 'center',
            padding: '24px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{fontSize: '28px', fontWeight: '700', color: '#2563eb', marginBottom: '8px'}}>78%</div>
            <div style={{color: '#6b7280', fontWeight: '500'}}>Success Rate</div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{
        padding: '48px 24px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h3 style={{
          textAlign: 'center',
          fontSize: '32px',
          fontWeight: '700',
          color: '#111827',
          marginBottom: '32px'
        }}>How It Works</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          '@media (max-width: 768px)': {
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px'
          },
          '@media (max-width: 480px)': {
            gridTemplateColumns: '1fr',
            gap: '16px'
          }
        }}>
          <div className="card" style={{
            padding: '24px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <div style={{fontSize: '24px', fontWeight: '700', color: '#2563eb', marginBottom: '8px'}}>1. Report</div>
            <p style={{margin: 0, color: '#6b7280', lineHeight: '1.6'}}>Submit a lost or found item with details.</p>
          </div>
          
          <div className="card" style={{
            padding: '24px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <div style={{fontSize: '24px', fontWeight: '700', color: '#2563eb', marginBottom: '8px'}}>2. Match</div>
            <p style={{margin: 0, color: '#6b7280', lineHeight: '1.6'}}>AI compares images and text to find candidates.</p>
          </div>
          
          <div className="card" style={{
            padding: '24px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <div style={{fontSize: '24px', fontWeight: '700', color: '#2563eb', marginBottom: '8px'}}>3. Verify</div>
            <p style={{margin: 0, color: '#6b7280', lineHeight: '1.6'}}>OTP and ID verification confirm ownership.</p>
          </div>
          
          <div className="card" style={{
            padding: '24px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <div style={{fontSize: '24px', fontWeight: '700', color: '#2563eb', marginBottom: '8px'}}>4. Return</div>
            <p style={{margin: 0, color: '#6b7280', lineHeight: '1.6'}}>Coordinate pickup via partner hubs.</p>
          </div>
        </div>
      </section>
    </div>
  )
}



