import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiSearch, FiUser, FiHome, FiLogOut, FiMapPin, FiPlus, FiGift, FiMenu, FiX, FiClipboard, FiBarChart2, FiUsers } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'

export default function Header() {
  const { user, hub, isAuthenticated, isUserAuthenticated, isHubAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header" style={{
      background: 'white',
      borderBottom: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="header-inner" style={{
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
      }}>
        <div className="brand" style={{
          display: 'flex',
          alignItems: 'center',
          marginLeft: '0'
        }}>
          <Link to="/" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            textDecoration: 'none',
            color: '#111827'
          }}>
            <img 
              src="/assets/logo.png" 
              alt="RETREIVO" 
              style={{
                height: '40px',
                width: 'auto',
                marginRight: '8px'
              }}
            />
            <span style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#111827'
            }}>
              Retreivo
            </span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="nav" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
          '@media(maxWidth: 768px)': {
            display: 'none'
          }
        }}>
          <Link to="/" style={{
            color: '#111827',
            textDecoration: 'none',
            fontWeight: '500',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'color 0.2s'
          }}>
            <FiHome size={18} />
            Home
          </Link>
          
          {!isAuthenticated ? (
            <Link to="/login" style={{
              background: '#111827',
              color: 'white',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '16px',
              padding: '10px 20px',
              borderRadius: '8px',
              transition: 'all 0.2s',
              border: '2px solid #111827'
            }}>
              Login
            </Link>
          ) : isUserAuthenticated ? (
            <>
              <Link to="/user/report-lost" style={{
                color: '#111827',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'color 0.2s'
              }}>
                <FiPlus size={18} />
                Report Lost Item
              </Link>
              
              <Link to="/user/report-found" style={{
                color: '#111827',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'color 0.2s'
              }}>
                <FiPlus size={18} />
                Report Found Item
              </Link>
              
              <Link to="/user/search" style={{
                color: '#111827',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'color 0.2s'
              }}>
                <FiSearch size={18} />
                Search
              </Link>
              
              <Link to="/user/rewards" style={{
                color: '#111827',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'color 0.2s'
              }}>
                <FiGift size={18} />
                Rewards
              </Link>
              
              <button onClick={handleLogout} style={{
                background: 'transparent',
                color: '#dc2626',
                border: '2px solid #dc2626',
                borderRadius: '8px',
                padding: '10px 20px',
                fontWeight: '500',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <FiLogOut size={18} />
                Logout
              </button>
            </>
          ) : isHubAuthenticated ? (
            <>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                background: '#f0f9ff',
                borderRadius: '8px',
                border: '1px solid #bae6fd'
              }}>
                <FiMapPin size={16} color="#0369a1" />
                <span style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#0369a1'
                }}>
                  {hub?.name}
                </span>
              </div>
              
              <Link to="/hub" style={{
                color: '#111827',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'color 0.2s'
              }}>
                <FiBarChart2 size={18} />
                Dashboard
              </Link>
              
              <Link to="/hub/claims" style={{
                color: '#111827',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'color 0.2s'
              }}>
                <FiClipboard size={18} />
                Claims
              </Link>
              
              <Link to="/hub/analytics" style={{
                color: '#111827',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'color 0.2s'
              }}>
                <FiBarChart2 size={18} />
                Analytics
              </Link>
              
              <button onClick={handleLogout} style={{
                background: 'transparent',
                color: '#dc2626',
                border: '2px solid #dc2626',
                borderRadius: '8px',
                padding: '10px 20px',
                fontWeight: '500',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <FiLogOut size={18} />
                Logout
              </button>
            </>
          ) : null}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMobileMenu}
          style={{
            display: 'none',
            background: 'transparent',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#111827',
            '@media (max-width: 768px)': {
              display: 'block'
            }
          }}
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div style={{
          background: 'white',
          borderTop: '1px solid #e5e7eb',
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <Link 
            to="/" 
            onClick={closeMobileMenu}
            style={{
              color: '#111827',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 0'
            }}
          >
            <FiHome size={18} />
            Home
          </Link>
          
          {!isAuthenticated ? (
            <Link 
              to="/login" 
              onClick={closeMobileMenu}
              style={{
                background: '#111827',
                color: 'white',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '16px',
                padding: '12px 16px',
                borderRadius: '8px',
                textAlign: 'center',
                border: '2px solid #111827'
              }}
            >
              Login
            </Link>
          ) : isUserAuthenticated ? (
            <>
              <Link 
                to="/user/report-lost" 
                onClick={closeMobileMenu}
                style={{
                  color: '#111827',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 0'
                }}
              >
                <FiPlus size={18} />
                Report Lost Item
              </Link>
              
              <Link 
                to="/user/report-found" 
                onClick={closeMobileMenu}
                style={{
                  color: '#111827',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 0'
                }}
              >
                <FiPlus size={18} />
                Report Found Item
              </Link>
              
              <Link 
                to="/user/search" 
                onClick={closeMobileMenu}
                style={{
                  color: '#111827',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 0'
                }}
              >
                <FiSearch size={18} />
                Search
              </Link>
              
              <Link 
                to="/user/rewards" 
                onClick={closeMobileMenu}
                style={{
                  color: '#111827',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 0'
                }}
              >
                <FiGift size={18} />
                Rewards
              </Link>
              
              <button 
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  color: '#dc2626',
                  border: '2px solid #dc2626',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  fontWeight: '500',
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%'
                }}
              >
                <FiLogOut size={18} />
                Logout
              </button>
            </>
          ) : isHubAuthenticated ? (
            <>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 0',
                borderBottom: '1px solid #e5e7eb',
                marginBottom: '8px'
              }}>
                <FiMapPin size={16} color="#0369a1" />
                <span style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#0369a1'
                }}>
                  {hub?.name}
                </span>
              </div>
              
              <Link 
                to="/hub" 
                onClick={closeMobileMenu}
                style={{
                  color: '#111827',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 0'
                }}
              >
                <FiBarChart2 size={18} />
                Dashboard
              </Link>
              
              <Link 
                to="/hub/claims" 
                onClick={closeMobileMenu}
                style={{
                  color: '#111827',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 0'
                }}
              >
                <FiClipboard size={18} />
                Claims
              </Link>
              
              <Link 
                to="/hub/analytics" 
                onClick={closeMobileMenu}
                style={{
                  color: '#111827',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 0'
                }}
              >
                <FiBarChart2 size={18} />
                Analytics
              </Link>
              
              <button 
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  color: '#dc2626',
                  border: '2px solid #dc2626',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  fontWeight: '500',
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%'
                }}
              >
                <FiLogOut size={18} />
                Logout
              </button>
            </>
          ) : null}
        </div>
      )}
    </header>
  )
}


