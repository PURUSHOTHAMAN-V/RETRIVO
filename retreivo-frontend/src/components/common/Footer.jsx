import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiTwitter, FiFacebook, FiInstagram, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer style={{
      background: '#111827',
      color: 'white',
      padding: '48px 0 24px',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        {/* Main Footer Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '32px',
          marginBottom: '32px'
        }}>
          {/* Company Info */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <img 
                src="/assets/logo.png" 
                alt="RETREIVO" 
                style={{
                  height: '32px',
                  width: 'auto',
                  marginRight: '8px'
                }}
              />
              <span style={{
                fontSize: '20px',
                fontWeight: '700',
                color: 'white'
              }}>
                Retreivo
              </span>
            </div>
            <p style={{
              color: '#9ca3af',
              lineHeight: '1.6',
              marginBottom: '16px'
            }}>
              AI-powered lost and found platform connecting communities to reunite people with their belongings.
            </p>
            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              <a href="#" style={{color: '#9ca3af', fontSize: '20px'}}><FiTwitter /></a>
              <a href="#" style={{color: '#9ca3af', fontSize: '20px'}}><FiFacebook /></a>
              <a href="#" style={{color: '#9ca3af', fontSize: '20px'}}><FiInstagram /></a>
              <a href="#" style={{color: '#9ca3af', fontSize: '20px'}}><FiLinkedin /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px',
              color: 'white'
            }}>
              Quick Links
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              <li style={{marginBottom: '8px'}}>
                <Link to="/" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}>
                  Home
                </Link>
              </li>
              <li style={{marginBottom: '8px'}}>
                <Link to="/user/search" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}>
                  Search Items
                </Link>
              </li>
              <li style={{marginBottom: '8px'}}>
                <Link to="/user/report-lost" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}>
                  Report Lost Item
                </Link>
              </li>
              <li style={{marginBottom: '8px'}}>
                <Link to="/user/report-found" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}>
                  Report Found Item
                </Link>
              </li>
              <li style={{marginBottom: '8px'}}>
                <Link to="/user/rewards" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}>
                  Rewards
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px',
              color: 'white'
            }}>
              Support
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              <li style={{marginBottom: '8px'}}>
                <a href="#" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}>
                  Help Center
                </a>
              </li>
              <li style={{marginBottom: '8px'}}>
                <a href="#" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}>
                  Contact Us
                </a>
              </li>
              <li style={{marginBottom: '8px'}}>
                <a href="#" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}>
                  FAQ
                </a>
              </li>
              <li style={{marginBottom: '8px'}}>
                <a href="#" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}>
                  Privacy Policy
                </a>
              </li>
              <li style={{marginBottom: '8px'}}>
                <a href="#" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}>
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px',
              color: 'white'
            }}>
              Contact Info
            </h4>
            <div style={{
              color: '#9ca3af',
              lineHeight: '1.8'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <FiMail size={16} />
                <span>support@retreivo.com</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <FiPhone size={16} />
                <span>+91 9677257928</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <FiMapPin size={16} />
                <span>Chennai, Tamil Nadu, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #374151',
          paddingTop: '24px',
          textAlign: 'center',
          color: '#9ca3af',
          fontSize: '14px'
        }}>
          <p style={{margin: 0}}>
            © 2024 Retreivo. All rights reserved. 
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


