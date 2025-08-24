import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { FiTrendingUp, FiTrendingDown, FiUsers, FiClock, FiCheckCircle, FiAlertTriangle, FiBarChart2, FiPieChart } from 'react-icons/fi'

export default function Analytics() {
  const { hub } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalClaims: 156,
      resolvedClaims: 89,
      pendingClaims: 23,
      fraudAlerts: 5,
      successRate: 78,
      avgResolutionTime: '2.3 days'
    },
    trends: {
      claimsThisMonth: 45,
      claimsLastMonth: 38,
      resolutionRate: 85,
      fraudRate: 3.2
    },
    categories: [
      { name: 'Electronics', count: 45, percentage: 29 },
      { name: 'Accessories', count: 32, percentage: 21 },
      { name: 'Documents', count: 28, percentage: 18 },
      { name: 'Clothing', count: 25, percentage: 16 },
      { name: 'Jewelry', count: 15, percentage: 10 },
      { name: 'Other', count: 11, percentage: 6 }
    ],
    monthlyData: [
      { month: 'Jan', claims: 45, resolved: 38, fraud: 2 },
      { month: 'Feb', claims: 52, resolved: 45, fraud: 1 },
      { month: 'Mar', claims: 48, resolved: 42, fraud: 3 },
      { month: 'Apr', claims: 61, resolved: 55, fraud: 2 },
      { month: 'May', claims: 55, resolved: 48, fraud: 4 },
      { month: 'Jun', claims: 67, resolved: 59, fraud: 3 }
    ],
    performance: {
      responseTime: '4.2 hours',
      customerSatisfaction: 4.6,
      fraudDetection: 92,
      efficiency: 87
    }
  };

  const getTrendIcon = (current, previous) => {
    const change = ((current - previous) / previous) * 100;
    return change > 0 ? <FiTrendingUp color="#10b981" /> : <FiTrendingDown color="#ef4444" />;
  };

  const getTrendColor = (current, previous) => {
    const change = ((current - previous) / previous) * 100;
    return change > 0 ? '#10b981' : '#ef4444';
  };

  const getTrendText = (current, previous) => {
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
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
            Analytics Dashboard
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '16px'
          }}>
            Performance insights and metrics for {hub?.name}
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
            <option value="year">Last year</option>
          </select>
          <button className="btn" style={{
            background: '#111827',
            color: 'white'
          }}>
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div className="card">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#dbeafe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FiUsers size={24} color="#3b82f6" />
            </div>
            {getTrendIcon(analyticsData.trends.claimsThisMonth, analyticsData.trends.claimsLastMonth)}
          </div>
          <div style={{fontSize: '32px', fontWeight: '700', color: '#111827', marginBottom: '8px'}}>
            {analyticsData.trends.claimsThisMonth}
          </div>
          <div style={{color: '#6b7280', marginBottom: '8px'}}>Total Claims</div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: getTrendColor(analyticsData.trends.claimsThisMonth, analyticsData.trends.claimsLastMonth)
          }}>
            {getTrendText(analyticsData.trends.claimsThisMonth, analyticsData.trends.claimsLastMonth)} vs last month
          </div>
        </div>

        <div className="card">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#dcfce7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FiCheckCircle size={24} color="#10b981" />
            </div>
            {getTrendIcon(analyticsData.trends.resolutionRate, 80)}
          </div>
          <div style={{fontSize: '32px', fontWeight: '700', color: '#111827', marginBottom: '8px'}}>
            {analyticsData.trends.resolutionRate}%
          </div>
          <div style={{color: '#6b7280', marginBottom: '8px'}}>Resolution Rate</div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: getTrendColor(analyticsData.trends.resolutionRate, 80)
          }}>
            {getTrendText(analyticsData.trends.resolutionRate, 80)} vs target
          </div>
        </div>

        <div className="card">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FiClock size={24} color="#f59e0b" />
            </div>
            {getTrendIcon(4.2, 5.1)}
          </div>
          <div style={{fontSize: '32px', fontWeight: '700', color: '#111827', marginBottom: '8px'}}>
            {analyticsData.performance.responseTime}
          </div>
          <div style={{color: '#6b7280', marginBottom: '8px'}}>Avg Response Time</div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: getTrendColor(4.2, 5.1)
          }}>
            {getTrendText(4.2, 5.1)} vs last month
          </div>
        </div>

        <div className="card">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FiAlertTriangle size={24} color="#ef4444" />
            </div>
            {getTrendIcon(analyticsData.trends.fraudRate, 4.1)}
          </div>
          <div style={{fontSize: '32px', fontWeight: '700', color: '#111827', marginBottom: '8px'}}>
            {analyticsData.trends.fraudRate}%
          </div>
          <div style={{color: '#6b7280', marginBottom: '8px'}}>Fraud Rate</div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: getTrendColor(analyticsData.trends.fraudRate, 4.1)
          }}>
            {getTrendText(analyticsData.trends.fraudRate, 4.1)} vs last month
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Category Distribution */}
        <div className="card">
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '20px',
            color: '#111827'
          }}>
            Claims by Category
          </h3>
          <div style={{
            display: 'grid',
            gap: '12px'
          }}>
            {analyticsData.categories.map((category, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: `hsl(${index * 60}, 70%, 50%)`
                }} />
                <div style={{flex: 1}}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px'
                  }}>
                    <span style={{fontWeight: '500', color: '#111827'}}>{category.name}</span>
                    <span style={{fontSize: '14px', color: '#6b7280'}}>{category.count}</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: '#e5e7eb',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${category.percentage}%`,
                      height: '100%',
                      background: `hsl(${index * 60}, 70%, 50%)`,
                      borderRadius: '4px'
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="card">
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '20px',
            color: '#111827'
          }}>
            Monthly Trends
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '12px',
            alignItems: 'end',
            height: '200px'
          }}>
            {analyticsData.monthlyData.map((data, index) => (
              <div key={index} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  width: '100%'
                }}>
                  <div style={{
                    height: `${(data.claims / 70) * 100}%`,
                    background: '#3b82f6',
                    borderRadius: '4px 4px 0 0',
                    minHeight: '4px'
                  }} />
                  <div style={{
                    height: `${(data.resolved / 70) * 100}%`,
                    background: '#10b981',
                    borderRadius: '0 0 4px 4px',
                    minHeight: '4px'
                  }} />
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  textAlign: 'center'
                }}>
                  {data.month}
                </div>
              </div>
            ))}
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            marginTop: '16px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                background: '#3b82f6',
                borderRadius: '2px'
              }} />
              <span>Total Claims</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                background: '#10b981',
                borderRadius: '2px'
              }} />
              <span>Resolved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="card">
        <h3 style={{
          fontSize: '20px',
          fontWeight: '600',
          marginBottom: '20px',
          color: '#111827'
        }}>
          Performance Metrics
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px'
        }}>
          <div style={{
            textAlign: 'center',
            padding: '20px',
            background: '#f0f9ff',
            borderRadius: '12px',
            border: '1px solid #bae6fd'
          }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#0369a1',
              marginBottom: '8px'
            }}>
              {analyticsData.performance.customerSatisfaction}/5
            </div>
            <div style={{color: '#0c4a6e', fontWeight: '500'}}>Customer Satisfaction</div>
          </div>

          <div style={{
            textAlign: 'center',
            padding: '20px',
            background: '#f0fdf4',
            borderRadius: '12px',
            border: '1px solid #bbf7d0'
          }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#16a34a',
              marginBottom: '8px'
            }}>
              {analyticsData.performance.fraudDetection}%
            </div>
            <div style={{color: '#15803d', fontWeight: '500'}}>Fraud Detection Rate</div>
          </div>

          <div style={{
            textAlign: 'center',
            padding: '20px',
            background: '#fef3c7',
            borderRadius: '12px',
            border: '1px solid #fde68a'
          }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#d97706',
              marginBottom: '8px'
            }}>
              {analyticsData.performance.efficiency}%
            </div>
            <div style={{color: '#92400e', fontWeight: '500'}}>Operational Efficiency</div>
          </div>

          <div style={{
            textAlign: 'center',
            padding: '20px',
            background: '#f3e8ff',
            borderRadius: '12px',
            border: '1px solid #c4b5fd'
          }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#7c3aed',
              marginBottom: '8px'
            }}>
              {analyticsData.overview.successRate}%
            </div>
            <div style={{color: '#5b21b6', fontWeight: '500'}}>Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  )
}






