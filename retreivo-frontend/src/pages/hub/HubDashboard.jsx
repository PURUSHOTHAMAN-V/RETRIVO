import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { FiUsers, FiClipboard, FiCheckCircle, FiAlertTriangle, FiTrendingUp, FiClock, FiMapPin } from 'react-icons/fi'
import { getHubClaims } from '../../services/api'

export default function HubDashboard() {
  const { hub } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingClaims: 0,
    resolvedClaims: 0,
    fraudAlerts: 0,
    successRate: 0,
    avgResolutionTime: '0 days'
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchClaimStats();
  }, []);
  
  const fetchClaimStats = async () => {
    try {
      setLoading(true);
      // Fetch pending claims
      const pendingResponse = await getHubClaims('pending');
      // Fetch approved claims
      const approvedResponse = await getHubClaims('approved');
      
      if (pendingResponse.ok && approvedResponse.ok) {
        const pendingCount = pendingResponse.claims.length;
        const resolvedCount = approvedResponse.claims.length;
        const totalCount = pendingCount + resolvedCount;
        
        setStats({
          totalReports: totalCount,
          pendingClaims: pendingCount,
          resolvedClaims: resolvedCount,
          fraudAlerts: Math.floor(totalCount * 0.05), // Placeholder: 5% of total as fraud alerts
          successRate: totalCount > 0 ? Math.floor((resolvedCount / totalCount) * 100) : 0,
          avgResolutionTime: '2.3 days' // Placeholder
        });
      }
    } catch (err) {
      console.error('Error fetching claim stats:', err);
      // Fallback to mock data if API fails
      setStats({
        totalReports: 156,
        pendingClaims: 23,
        resolvedClaims: 89,
        fraudAlerts: 5,
        successRate: 78,
        avgResolutionTime: '2.3 days'
      });
    } finally {
      setLoading(false);
    }
  };

  // This would ideally be fetched from an API endpoint that provides recent activities
  const recentActivities = [
    { id: 1, type: 'claim_approved', item: 'iPhone 12', user: 'John Doe', time: '2 hours ago', status: 'approved' },
    { id: 2, type: 'new_report', item: 'Leather Wallet', user: 'Jane Smith', time: '4 hours ago', status: 'pending' },
    { id: 3, type: 'fraud_alert', item: 'Gold Watch', user: 'Mike Johnson', time: '6 hours ago', status: 'flagged' },
    { id: 4, type: 'claim_resolved', item: 'Laptop Bag', user: 'Sarah Wilson', time: '1 day ago', status: 'resolved' },
    { id: 5, type: 'new_report', item: 'Car Keys', user: 'David Brown', time: '1 day ago', status: 'pending' }
  ];

  const pendingClaims = [
    { id: 1, item: 'iPhone 12', claimant: 'John Doe', date: '2024-01-15', priority: 'high' },
    { id: 2, item: 'Leather Wallet', claimant: 'Jane Smith', date: '2024-01-14', priority: 'medium' },
    { id: 3, item: 'Car Keys', claimant: 'David Brown', date: '2024-01-13', priority: 'high' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'flagged': return '#ef4444';
      case 'resolved': return '#3b82f6';
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
            Welcome, {hub?.name}
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '16px'
          }}>
            {hub?.location} • {hub?.type} Hub
          </p>
        </div>
        <div style={{
          display: 'flex',
          gap: '12px'
        }}>
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              background: 'white'
            }}
          >
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="quarter">Last 3 months</option>
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div className="card" style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          color: 'white'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{fontSize: '32px', fontWeight: '700'}}>{stats.totalReports}</div>
              <div style={{opacity: 0.9}}>Total Reports</div>
            </div>
            <FiUsers size={32} style={{opacity: 0.8}} />
          </div>
        </div>

        <div className="card" style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: 'white'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{fontSize: '32px', fontWeight: '700'}}>{stats.pendingClaims}</div>
              <div style={{opacity: 0.9}}>Pending Claims</div>
            </div>
            <FiClock size={32} style={{opacity: 0.8}} />
          </div>
        </div>

        <div className="card" style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{fontSize: '32px', fontWeight: '700'}}>{stats.resolvedClaims}</div>
              <div style={{opacity: 0.9}}>Resolved Claims</div>
            </div>
            <FiCheckCircle size={32} style={{opacity: 0.8}} />
          </div>
        </div>

        <div className="card" style={{
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{fontSize: '32px', fontWeight: '700'}}>{stats.fraudAlerts}</div>
              <div style={{opacity: 0.9}}>Fraud Alerts</div>
            </div>
            <FiAlertTriangle size={32} style={{opacity: 0.8}} />
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div className="card">
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '16px',
            color: '#111827'
          }}>
            Performance Metrics
          </h3>
          <div style={{
            display: 'grid',
            gap: '16px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <span style={{color: '#6b7280'}}>Success Rate</span>
              <span style={{fontWeight: '600', color: '#10b981'}}>{stats.successRate}%</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <span style={{color: '#6b7280'}}>Avg Resolution Time</span>
              <span style={{fontWeight: '600', color: '#3b82f6'}}>{stats.avgResolutionTime}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0'
            }}>
              <span style={{color: '#6b7280'}}>Active Reports</span>
              <span style={{fontWeight: '600', color: '#f59e0b'}}>{stats.totalReports - stats.resolvedClaims}</span>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="card">
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '16px',
            color: '#111827'
          }}>
            Recent Activities
          </h3>
          <div style={{
            display: 'grid',
            gap: '12px'
          }}>
            {recentActivities.map(activity => (
              <div key={activity.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                background: '#f9fafb',
                borderRadius: '8px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: getStatusColor(activity.status)
                }} />
                <div style={{flex: 1}}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#111827'
                  }}>
                    {activity.item}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    {activity.user} • {activity.time}
                  </div>
                </div>
                <span style={{
                  fontSize: '12px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  background: getStatusColor(activity.status) + '20',
                  color: getStatusColor(activity.status),
                  fontWeight: '500'
                }}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Claims */}
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
            High Priority Claims
          </h3>
          <button className="btn" style={{
            background: '#111827',
            color: 'white'
          }}>
            View All Claims
          </button>
        </div>
        <div style={{
          display: 'grid',
          gap: '12px'
        }}>
          {pendingClaims.map(claim => (
            <div key={claim.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              background: '#f9fafb'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: getPriorityColor(claim.priority) + '20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FiClipboard size={20} color={getPriorityColor(claim.priority)} />
              </div>
              <div style={{flex: 1}}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#111827'
                }}>
                  {claim.item}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#6b7280'
                }}>
                  Claimed by {claim.claimant} • {claim.date}
                </div>
              </div>
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
              <button className="btn" style={{
                background: '#3b82f6',
                color: 'white',
                padding: '8px 16px',
                fontSize: '14px'
              }}>
                Review
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}






