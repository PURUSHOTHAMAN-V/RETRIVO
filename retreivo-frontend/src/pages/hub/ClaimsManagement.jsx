import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { FiSearch, FiFilter, FiEye, FiCheck, FiX, FiClock, FiAlertTriangle, FiUser, FiMapPin, FiCalendar } from 'react-icons/fi'

export default function ClaimsManagement() {
  const { hub } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedClaim, setSelectedClaim] = useState(null);

  // Mock claims data
  const claims = [
    {
      id: 1,
      item: 'iPhone 12',
      claimant: 'John Doe',
      claimantEmail: 'john.doe@email.com',
      claimantPhone: '+91 98765 43210',
      dateClaimed: '2024-01-15',
      dateLost: '2024-01-10',
      location: 'Central Park, Mumbai',
      description: 'Black iPhone 12 with red case, found near the fountain',
      status: 'pending',
      priority: 'high',
      fraudScore: 15,
      documents: ['id_proof.pdf', 'purchase_receipt.pdf'],
      images: ['item_photo1.jpg', 'item_photo2.jpg']
    },
    {
      id: 2,
      item: 'Leather Wallet',
      claimant: 'Jane Smith',
      claimantEmail: 'jane.smith@email.com',
      claimantPhone: '+91 98765 43211',
      dateClaimed: '2024-01-14',
      dateLost: '2024-01-12',
      location: 'Shopping Mall, Andheri',
      description: 'Brown leather wallet with credit cards and ID',
      status: 'approved',
      priority: 'medium',
      fraudScore: 8,
      documents: ['id_proof.pdf'],
      images: ['item_photo3.jpg']
    },
    {
      id: 3,
      item: 'Car Keys',
      claimant: 'David Brown',
      claimantEmail: 'david.brown@email.com',
      claimantPhone: '+91 98765 43212',
      dateClaimed: '2024-01-13',
      dateLost: '2024-01-11',
      location: 'Parking Lot, Bandra',
      description: 'Toyota car keys with keychain',
      status: 'pending',
      priority: 'high',
      fraudScore: 25,
      documents: ['vehicle_registration.pdf', 'driving_license.pdf'],
      images: ['item_photo4.jpg']
    },
    {
      id: 4,
      item: 'Laptop Bag',
      claimant: 'Sarah Wilson',
      claimantEmail: 'sarah.wilson@email.com',
      claimantPhone: '+91 98765 43213',
      dateClaimed: '2024-01-12',
      dateLost: '2024-01-09',
      location: 'Coffee Shop, Colaba',
      description: 'Black laptop bag with Dell laptop inside',
      status: 'resolved',
      priority: 'high',
      fraudScore: 5,
      documents: ['laptop_receipt.pdf'],
      images: ['item_photo5.jpg']
    },
    {
      id: 5,
      item: 'Gold Watch',
      claimant: 'Mike Johnson',
      claimantEmail: 'mike.johnson@email.com',
      claimantPhone: '+91 98765 43214',
      dateClaimed: '2024-01-11',
      dateLost: '2024-01-08',
      location: 'Restaurant, Juhu',
      description: 'Gold Rolex watch with leather strap',
      status: 'flagged',
      priority: 'high',
      fraudScore: 85,
      documents: ['watch_receipt.pdf'],
      images: ['item_photo6.jpg']
    }
  ];

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = claim.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.claimant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || claim.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'flagged': return '#ef4444';
      case 'resolved': return '#3b82f6';
      case 'rejected': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getFraudScoreColor = (score) => {
    if (score < 20) return '#10b981';
    if (score < 50) return '#f59e0b';
    return '#ef4444';
  };

  const handleApprove = (claimId) => {
    console.log('Approving claim:', claimId);
    // In real app, this would call API to approve claim
  };

  const handleReject = (claimId) => {
    console.log('Rejecting claim:', claimId);
    // In real app, this would call API to reject claim
  };

  const handleViewDetails = (claim) => {
    setSelectedClaim(claim);
  };

  return (
    <div className="container" style={{marginTop: '24px'}}>
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
            Claims Management
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '16px'
          }}>
            Review and manage item claims for {hub?.name}
          </p>
        </div>
        <div style={{
          display: 'flex',
          gap: '12px'
        }}>
          <button className="btn" style={{
            background: '#111827',
            color: 'white'
          }}>
            Export Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{marginBottom: '24px'}}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <div style={{position: 'relative'}}>
            <FiSearch style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af'
            }} />
            <input 
              className="input" 
              placeholder="Search claims..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{paddingLeft: '40px'}}
            />
          </div>
          
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="flagged">Flagged</option>
            <option value="resolved">Resolved</option>
          </select>
          
          <select 
            value={priorityFilter} 
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="input"
          >
            <option value="all">All Priority</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Claims List */}
      <div className="card">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#111827'
          }}>
            Claims ({filteredClaims.length})
          </h3>
        </div>
        
        <div style={{
          display: 'grid',
          gap: '16px'
        }}>
          {filteredClaims.map(claim => (
            <div key={claim.id} style={{
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '20px',
              background: 'white'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px'
              }}>
                <div style={{flex: 1}}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '8px'
                  }}>
                    <h4 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#111827',
                      margin: 0
                    }}>
                      {claim.item}
                    </h4>
                    <span style={{
                      fontSize: '12px',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      background: getStatusColor(claim.status) + '20',
                      color: getStatusColor(claim.status),
                      fontWeight: '500'
                    }}>
                      {claim.status}
                    </span>
                    <span style={{
                      fontSize: '12px',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      background: getPriorityColor(claim.priority) + '20',
                      color: getPriorityColor(claim.priority),
                      fontWeight: '500',
                      textTransform: 'uppercase'
                    }}>
                      {claim.priority}
                    </span>
                  </div>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                    fontSize: '14px',
                    color: '#6b7280'
                  }}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                      <FiUser size={14} />
                      <span>{claim.claimant}</span>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                      <FiMapPin size={14} />
                      <span>{claim.location}</span>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                      <FiCalendar size={14} />
                      <span>Claimed: {claim.dateClaimed}</span>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                      <FiAlertTriangle size={14} />
                      <span>Fraud Score: {claim.fraudScore}%</span>
                    </div>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  gap: '8px'
                }}>
                  <button 
                    onClick={() => handleViewDetails(claim)}
                    className="btn" 
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      padding: '8px 12px',
                      fontSize: '14px'
                    }}
                  >
                    <FiEye size={16} />
                  </button>
                  
                  {claim.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleApprove(claim.id)}
                        className="btn" 
                        style={{
                          background: '#10b981',
                          color: 'white',
                          padding: '8px 12px',
                          fontSize: '14px'
                        }}
                      >
                        <FiCheck size={16} />
                      </button>
                      <button 
                        onClick={() => handleReject(claim.id)}
                        className="btn" 
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          padding: '8px 12px',
                          fontSize: '14px'
                        }}
                      >
                        <FiX size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: 0,
                lineHeight: '1.5'
              }}>
                {claim.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Claim Details Modal */}
      {selectedClaim && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '24px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#111827',
                margin: 0
              }}>
                Claim Details
              </h2>
              <button 
                onClick={() => setSelectedClaim(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{
              display: 'grid',
              gap: '20px'
            }}>
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '12px'
                }}>
                  Item Information
                </h3>
                <div style={{
                  background: '#f9fafb',
                  padding: '16px',
                  borderRadius: '8px'
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                    fontSize: '14px'
                  }}>
                    <div><strong>Item:</strong> {selectedClaim.item}</div>
                    <div><strong>Status:</strong> 
                      <span style={{
                        color: getStatusColor(selectedClaim.status),
                        fontWeight: '500',
                        marginLeft: '8px'
                      }}>
                        {selectedClaim.status}
                      </span>
                    </div>
                    <div><strong>Priority:</strong> 
                      <span style={{
                        color: getPriorityColor(selectedClaim.priority),
                        fontWeight: '500',
                        marginLeft: '8px'
                      }}>
                        {selectedClaim.priority}
                      </span>
                    </div>
                    <div><strong>Fraud Score:</strong> 
                      <span style={{
                        color: getFraudScoreColor(selectedClaim.fraudScore),
                        fontWeight: '500',
                        marginLeft: '8px'
                      }}>
                        {selectedClaim.fraudScore}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '12px'
                }}>
                  Claimant Information
                </h3>
                <div style={{
                  background: '#f9fafb',
                  padding: '16px',
                  borderRadius: '8px'
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                    fontSize: '14px'
                  }}>
                    <div><strong>Name:</strong> {selectedClaim.claimant}</div>
                    <div><strong>Email:</strong> {selectedClaim.claimantEmail}</div>
                    <div><strong>Phone:</strong> {selectedClaim.claimantPhone}</div>
                    <div><strong>Date Lost:</strong> {selectedClaim.dateLost}</div>
                    <div><strong>Date Claimed:</strong> {selectedClaim.dateClaimed}</div>
                    <div><strong>Location:</strong> {selectedClaim.location}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '12px'
                }}>
                  Description
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {selectedClaim.description}
                </p>
              </div>
              
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '12px'
                }}>
                  Documents & Images
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '12px'
                }}>
                  {selectedClaim.documents.map((doc, index) => (
                    <div key={index} style={{
                      padding: '12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      textAlign: 'center',
                      fontSize: '14px',
                      color: '#3b82f6',
                      cursor: 'pointer'
                    }}>
                      📄 {doc}
                    </div>
                  ))}
                  {selectedClaim.images.map((img, index) => (
                    <div key={index} style={{
                      padding: '12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      textAlign: 'center',
                      fontSize: '14px',
                      color: '#3b82f6',
                      cursor: 'pointer'
                    }}>
                      📷 {img}
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedClaim.status === 'pending' && (
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end'
                }}>
                  <button 
                    onClick={() => handleReject(selectedClaim.id)}
                    className="btn" 
                    style={{
                      background: '#ef4444',
                      color: 'white'
                    }}
                  >
                    Reject Claim
                  </button>
                  <button 
                    onClick={() => handleApprove(selectedClaim.id)}
                    className="btn" 
                    style={{
                      background: '#10b981',
                      color: 'white'
                    }}
                  >
                    Approve Claim
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}






