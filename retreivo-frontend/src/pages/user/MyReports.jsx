import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { FiSearch, FiFilter, FiCalendar, FiMapPin, FiTag, FiEye, FiEdit, FiTrash2, FiCheck, FiX } from 'react-icons/fi'

export default function MyReports() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('lost');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data
  const lostItems = [
    {
      id: 1,
      title: 'iPhone 12 Pro',
      description: 'Black iPhone 12 Pro with cracked screen protector',
      category: 'Electronics',
      location: 'Central Park, New York',
      date: '2024-01-15',
      status: 'active',
      image: 'https://via.placeholder.com/150x150/10b981/ffffff?text=iPhone',
      reward: 500,
      views: 45,
      matches: 3
    },
    {
      id: 2,
      title: 'Leather Wallet',
      description: 'Brown leather wallet with credit cards',
      category: 'Personal Items',
      location: 'Times Square, New York',
      date: '2024-01-12',
      status: 'found',
      image: 'https://via.placeholder.com/150x150/8b5cf6/ffffff?text=Wallet',
      reward: 200,
      views: 23,
      matches: 1
    },
    {
      id: 3,
      title: 'Car Keys',
      description: 'Toyota car keys with remote',
      category: 'Keys',
      location: 'Brooklyn Bridge, New York',
      date: '2024-01-10',
      status: 'active',
      image: 'https://via.placeholder.com/150x150/ef4444/ffffff?text=Keys',
      reward: 300,
      views: 67,
      matches: 0
    }
  ];

  const foundItems = [
    {
      id: 1,
      title: 'Gold Ring',
      description: 'Gold ring with diamond',
      category: 'Jewelry',
      location: 'Central Park, New York',
      date: '2024-01-14',
      status: 'claimed',
      image: 'https://via.placeholder.com/150x150/f59e0b/ffffff?text=Ring',
      reward: 1000,
      views: 89,
      matches: 5
    },
    {
      id: 2,
      title: 'Backpack',
      description: 'Blue Jansport backpack with laptop',
      category: 'Bags',
      location: 'Grand Central Terminal, New York',
      date: '2024-01-11',
      status: 'active',
      image: 'https://via.placeholder.com/150x150/3b82f6/ffffff?text=Bag',
      reward: 400,
      views: 34,
      matches: 2
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'found': return '#3b82f6';
      case 'claimed': return '#8b5cf6';
      case 'expired': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'found': return 'Found';
      case 'claimed': return 'Claimed';
      case 'expired': return 'Expired';
      default: return status;
    }
  };

  const filteredItems = (activeTab === 'lost' ? lostItems : foundItems).filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px',
      minHeight: '100vh',
      background: '#f9fafb'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '8px'
          }}>
            My Reports
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6b7280'
          }}>
            Manage your lost and found item reports
          </p>
        </div>
        <div style={{
          display: 'flex',
          gap: '12px'
        }}>
          <button style={{
            padding: '12px 24px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FiEdit size={16} />
            New Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        background: 'white',
        borderRadius: '12px',
        padding: '4px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <button
          onClick={() => setActiveTab('lost')}
          style={{
            flex: 1,
            padding: '12px 24px',
            background: activeTab === 'lost' ? '#3b82f6' : 'transparent',
            color: activeTab === 'lost' ? 'white' : '#6b7280',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Lost Items ({lostItems.length})
        </button>
        <button
          onClick={() => setActiveTab('found')}
          style={{
            flex: 1,
            padding: '12px 24px',
            background: activeTab === 'found' ? '#3b82f6' : 'transparent',
            color: activeTab === 'found' ? 'white' : '#6b7280',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Found Items ({foundItems.length})
        </button>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        <div style={{
          flex: 1,
          minWidth: '300px',
          position: 'relative'
        }}>
          <FiSearch size={20} style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af'
          }} />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 44px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              background: 'white'
            }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '12px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '16px',
            background: 'white',
            minWidth: '150px'
          }}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="found">Found</option>
          <option value="claimed">Claimed</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Reports Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        gap: '24px'
      }}>
        {filteredItems.map(item => (
          <div key={item.id} style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              gap: '16px',
              marginBottom: '16px'
            }}>
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '8px',
                  objectFit: 'cover'
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '8px'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#111827',
                    margin: 0
                  }}>
                    {item.title}
                  </h3>
                  <span style={{
                    padding: '4px 12px',
                    background: getStatusColor(item.status) + '20',
                    color: getStatusColor(item.status),
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {getStatusText(item.status)}
                  </span>
                </div>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  marginBottom: '8px',
                  lineHeight: '1.4'
                }}>
                  {item.description}
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  fontSize: '12px',
                  color: '#6b7280'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiMapPin size={12} />
                    {item.location}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiCalendar size={12} />
                    {item.date}
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '16px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <div style={{
                display: 'flex',
                gap: '16px',
                fontSize: '14px',
                color: '#6b7280'
              }}>
                <span>👁️ {item.views} views</span>
                <span>🔍 {item.matches} matches</span>
                <span>💰 {item.reward} pts</span>
              </div>
              <div style={{
                display: 'flex',
                gap: '8px'
              }}>
                <button style={{
                  padding: '8px 12px',
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  <FiEye size={14} />
                  View
                </button>
                <button style={{
                  padding: '8px 12px',
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  <FiEdit size={14} />
                  Edit
                </button>
                <button style={{
                  padding: '8px 12px',
                  background: '#fef2f2',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '14px',
                  color: '#dc2626'
                }}>
                  <FiTrash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#6b7280'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '16px'
          }}>
            📝
          </div>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '8px',
            color: '#374151'
          }}>
            No reports found
          </h3>
          <p style={{
            fontSize: '16px'
          }}>
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : `You haven't created any ${activeTab} item reports yet`
            }
          </p>
        </div>
      )}
    </div>
  );
}
