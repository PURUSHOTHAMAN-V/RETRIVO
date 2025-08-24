import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch, FiMapPin, FiMail, FiLock } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'

const HUBS = [
  { id: 1, name: 'Central City Hub', location: 'Downtown', type: 'Government', email: 'centralcity@gmail.com' },
  { id: 2, name: 'North Relief Center', location: 'North Zone', type: 'NGO', email: 'northrelief@gmail.com' },
  { id: 3, name: 'East Metro Hub', location: 'Eastside', type: 'Private', email: 'eastmetro@gmail.com' },
  { id: 4, name: 'Metro Hub', location: 'Central Station', type: 'Government', email: 'metro@gmail.com' },
  { id: 5, name: 'West Community Hub', location: 'West Zone', type: 'NGO', email: 'westcommunity@gmail.com' },
  { id: 6, name: 'South Relief Center', location: 'South Zone', type: 'Private', email: 'southrelief@gmail.com' },
]

export default function HubAuth(){
  const navigate = useNavigate();
  const { hubLogin } = useAuth();
  const [q, setQ] = useState('')
  const [selectedHub, setSelectedHub] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const filtered = useMemo(() => HUBS.filter(h => 
    (h.name + ' ' + h.location + ' ' + h.type).toLowerCase().includes(q.toLowerCase())
  ), [q])

  const handleHubSelect = (hub) => {
    setSelectedHub(hub);
    setEmail(hub.email);
    setError('');
  }

  const handleLogin = async () => {
    if (!selectedHub) {
      setError('Please select a hub first');
      return;
    }

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (email !== selectedHub.email) {
      setError('Email does not match the selected hub');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate hub login - in real app, this would call your backend API
      console.log('Hub login attempt:', {
        hubId: selectedHub.id,
        hubName: selectedHub.name,
        email: email,
        password: password
      });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, accept any password for now
      // In production, this would validate against your backend
      if (password.length >= 6) {
        // Create hub data for authentication
        const hubData = {
          id: selectedHub.id,
          name: selectedHub.name,
          location: selectedHub.location,
          type: selectedHub.type,
          email: selectedHub.email
        };

        // Generate a demo token (in real app, this would come from backend)
        const hubToken = `hub_${selectedHub.id}_${Date.now()}`;

        // Login the hub
        hubLogin(hubData, hubToken);

        // Success - redirect to hub dashboard
        navigate('/hub');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '24px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '48px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        maxWidth: '600px',
        width: '100%'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '8px'
          }}>
            Hub Administration Portal
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '16px'
          }}>
            Select your hub and login to access the administration panel
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '24px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <div style={{
          display: 'grid',
          gap: '24px'
        }}>
          {/* Hub Selection */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#374151'
            }}>
              Select Your Hub
            </label>
            <div style={{
              position: 'relative',
              marginBottom: '8px'
            }}>
              <FiSearch style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }} />
              <input 
                className="input" 
                placeholder="Search hubs by name, location, or type" 
                value={q} 
                onChange={e => setQ(e.target.value)}
                style={{
                  paddingLeft: '40px'
                }}
              />
            </div>
            <div style={{
              maxHeight: '200px',
              overflow: 'auto',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              background: '#f9fafb'
            }}>
              {filtered.map(hub => (
                <div 
                  key={hub.id} 
                  onClick={() => handleHubSelect(hub)} 
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    background: selectedHub?.id === hub.id ? '#dbeafe' : 'transparent',
                    borderBottom: '1px solid #e5e7eb',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '4px'
                  }}>
                    <FiMapPin size={16} color="#6b7280" />
                    <div style={{
                      fontWeight: '600',
                      color: '#111827'
                    }}>
                      {hub.name}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    marginLeft: '24px'
                  }}>
                    {hub.location} • <span style={{
                      background: '#e5e7eb',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>{hub.type}</span>
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#9ca3af',
                    marginLeft: '24px',
                    marginTop: '2px'
                  }}>
                    {hub.email}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#374151'
            }}>
              Login Credentials
            </label>
            <div style={{
              display: 'grid',
              gap: '16px'
            }}>
              <div style={{
                position: 'relative'
              }}>
                <FiMail style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }} />
                <input 
                  className="input" 
                  placeholder="Hub Email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    paddingLeft: '40px'
                  }}
                  disabled={selectedHub}
                />
              </div>
              <div style={{
                position: 'relative'
              }}>
                <FiLock style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }} />
                <input 
                  className="input" 
                  placeholder="Password" 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  style={{
                    paddingLeft: '40px'
                  }}
                />
              </div>
              <button 
                className="btn" 
                onClick={handleLogin}
                disabled={loading || !selectedHub}
                style={{
                  background: loading || !selectedHub ? '#9ca3af' : '#111827',
                  cursor: loading || !selectedHub ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Logging in...' : 'Login to Hub Portal'}
              </button>
            </div>
          </div>
        </div>

        {selectedHub && (
          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '8px'
          }}>
            <div style={{
              fontWeight: '600',
              color: '#0369a1',
              marginBottom: '4px'
            }}>
              Selected Hub: {selectedHub.name}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#0c4a6e'
            }}>
              {selectedHub.location} • {selectedHub.type} • {selectedHub.email}
            </div>
          </div>
        )}

        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          <p>Need help? Contact support at support@retreivo.com</p>
        </div>
      </div>
    </div>
  )
}





