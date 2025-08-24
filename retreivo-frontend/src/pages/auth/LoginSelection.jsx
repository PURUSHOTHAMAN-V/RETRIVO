import React from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiMapPin } from 'react-icons/fi';

const LoginSelection = () => {
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
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#111827',
          marginBottom: '8px'
        }}>
          Welcome to Retreivo
        </h1>
        <p style={{
          color: '#6b7280',
          fontSize: '16px',
          marginBottom: '40px'
        }}>
          Choose your login type to continue
        </p>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <Link to="/login-user" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            background: '#111827',
            color: 'white',
            textDecoration: 'none',
            padding: '16px 24px',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: '600',
            transition: 'all 0.2s',
            border: '2px solid #111827'
          }}>
            <FiUser size={24} />
            User Login
          </Link>
          
          <Link to="/login-hub" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            background: 'transparent',
            color: '#111827',
            textDecoration: 'none',
            padding: '16px 24px',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: '600',
            transition: 'all 0.2s',
            border: '2px solid #111827'
          }}>
            <FiMapPin size={24} />
            Hub Login
          </Link>
        </div>
        
        <div style={{
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <p style={{
            color: '#6b7280',
            fontSize: '14px',
            marginBottom: '16px'
          }}>
            Don't have an account?
          </p>
          <Link to="/signup" style={{
            color: '#111827',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '16px',
            transition: 'color 0.2s'
          }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginSelection;


