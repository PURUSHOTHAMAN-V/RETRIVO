import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { FiGift, FiTrendingUp, FiClock, FiDownload, FiStar, FiAward } from 'react-icons/fi'
import { FaCoins } from 'react-icons/fa'

export default function Rewards() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const walletData = {
    balance: 1250,
    totalEarned: 2800,
    totalSpent: 1550,
    level: 'Gold',
    nextLevel: 'Platinum',
    pointsToNext: 250
  };

  const transactions = [
    {
      id: 1,
      type: 'earned',
      amount: 500,
      description: 'Found item reward - iPhone 12',
      date: '2024-01-15',
      status: 'completed'
    },
    {
      id: 2,
      type: 'spent',
      amount: -200,
      description: 'Redeemed for Amazon voucher',
      date: '2024-01-12',
      status: 'completed'
    },
    {
      id: 3,
      type: 'earned',
      amount: 300,
      description: 'Found item reward - Leather Wallet',
      date: '2024-01-10',
      status: 'completed'
    },
    {
      id: 4,
      type: 'earned',
      amount: 150,
      description: 'Referral bonus - John Doe',
      date: '2024-01-08',
      status: 'completed'
    },
    {
      id: 5,
      type: 'spent',
      amount: -100,
      description: 'Redeemed for Starbucks voucher',
      date: '2024-01-05',
      status: 'completed'
    }
  ];

  const rewards = [
    {
      id: 1,
      name: 'Amazon Gift Card',
      description: '₹500 Amazon gift card',
      points: 500,
      image: 'https://via.placeholder.com/80x80/ff9900/ffffff?text=Amazon',
      category: 'Shopping',
      available: true
    },
    {
      id: 2,
      name: 'Starbucks Voucher',
      description: '₹200 Starbucks voucher',
      points: 200,
      image: 'https://via.placeholder.com/80x80/006241/ffffff?text=Starbucks',
      category: 'Food',
      available: true
    },
    {
      id: 3,
      name: 'Movie Tickets',
      description: '2 PVR movie tickets',
      points: 400,
      image: 'https://via.placeholder.com/80x80/1e40af/ffffff?text=PVR',
      category: 'Entertainment',
      available: true
    },
    {
      id: 4,
      name: 'Uber Credits',
      description: '₹300 Uber ride credits',
      points: 300,
      image: 'https://via.placeholder.com/80x80/000000/ffffff?text=Uber',
      category: 'Transport',
      available: true
    },
    {
      id: 5,
      name: 'Zomato Credits',
      description: '₹250 Zomato food credits',
      points: 250,
      image: 'https://via.placeholder.com/80x80/e23744/ffffff?text=Zomato',
      category: 'Food',
      available: false
    }
  ];

  const achievements = [
    {
      id: 1,
      name: 'First Find',
      description: 'Report your first found item',
      icon: FiStar,
      earned: true,
      date: '2024-01-10'
    },
    {
      id: 2,
      name: 'Helping Hand',
      description: 'Report 5 found items',
      icon: FiAward,
      earned: true,
      date: '2024-01-15'
    },
    {
      id: 3,
      name: 'Community Hero',
      description: 'Report 10 found items',
      icon: FiGift,
      earned: false,
      progress: 7
    },
    {
      id: 4,
      name: 'Gold Member',
      description: 'Earn 1000 points',
      icon: FaCoins,
      earned: true,
      date: '2024-01-12'
    }
  ];

  const handleRedeem = (reward) => {
    console.log('Redeeming reward:', reward);
    // In real app, this would call API to redeem reward
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Bronze': return '#cd7f32';
      case 'Silver': return '#c0c0c0';
      case 'Gold': return '#ffd700';
      case 'Platinum': return '#e5e4e2';
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
            Rewards & Wallet
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '16px'
          }}>
            Earn points and redeem exciting rewards
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
            <FiDownload size={16} />
            Export History
          </button>
        </div>
      </div>

      {/* Wallet Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div className="card" style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: 'white'
        }}>
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
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FaCoins size={24} />
            </div>
            <span style={{
              fontSize: '14px',
              padding: '4px 12px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '20px'
            }}>
              {walletData.level}
            </span>
          </div>
          <div style={{fontSize: '32px', fontWeight: '700', marginBottom: '8px'}}>
            {walletData.balance} pts
          </div>
          <div style={{opacity: 0.9}}>Available Balance</div>
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
              <FiTrendingUp size={24} color="#16a34a" />
            </div>
          </div>
          <div style={{fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '8px'}}>
            {walletData.totalEarned} pts
          </div>
          <div style={{color: '#6b7280'}}>Total Earned</div>
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
              <FiClock size={24} color="#dc2626" />
            </div>
          </div>
          <div style={{fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '8px'}}>
            {walletData.totalSpent} pts
          </div>
          <div style={{color: '#6b7280'}}>Total Spent</div>
        </div>
      </div>

      {/* Level Progress */}
      <div className="card" style={{marginBottom: '32px'}}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#111827'
          }}>
            Level Progress
          </h3>
          <span style={{
            fontSize: '14px',
            color: '#6b7280'
          }}>
            {walletData.pointsToNext} pts to {walletData.nextLevel}
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          background: '#e5e7eb',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${((walletData.totalEarned - 1000) / 250) * 100}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${getLevelColor(walletData.level)} 0%, ${getLevelColor(walletData.nextLevel)} 100%)`,
            borderRadius: '4px'
          }} />
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '14px',
          color: '#6b7280',
          marginTop: '8px'
        }}>
          <span>{walletData.level}</span>
          <span>{walletData.nextLevel}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e5e7eb',
          marginBottom: '24px'
        }}>
          {[
            { id: 'overview', label: 'Rewards', icon: FiGift },
            { id: 'history', label: 'Transaction History', icon: FiClock },
            { id: 'achievements', label: 'Achievements', icon: FiAward }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '16px',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent',
                color: activeTab === tab.id ? '#3b82f6' : '#6b7280',
                fontWeight: activeTab === tab.id ? '600' : '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Rewards Tab */}
        {activeTab === 'overview' && (
          <div>
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
                Available Rewards
              </h3>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {rewards.map(reward => (
                <div key={reward.id} style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '20px',
                  background: 'white'
                }}>
                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    marginBottom: '16px'
                  }}>
                    <img 
                      src={reward.image} 
                      alt={reward.name}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '8px',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{flex: 1}}>
                      <h4 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '4px'
                      }}>
                        {reward.name}
                      </h4>
                      <p style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        marginBottom: '8px'
                      }}>
                        {reward.description}
                      </p>
                      <span style={{
                        fontSize: '12px',
                        padding: '4px 8px',
                        background: '#f3f4f6',
                        borderRadius: '4px',
                        color: '#6b7280'
                      }}>
                        {reward.category}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#f59e0b',
                      fontWeight: '600'
                    }}>
                      <FaCoins size={16} />
                      <span>{reward.points} pts</span>
                    </div>
                    <button
                      onClick={() => handleRedeem(reward)}
                      className="btn"
                      style={{
                        background: reward.available && walletData.balance >= reward.points ? '#3b82f6' : '#e5e7eb',
                        color: reward.available && walletData.balance >= reward.points ? 'white' : '#9ca3af',
                        padding: '8px 16px',
                        fontSize: '14px'
                      }}
                      disabled={!reward.available || walletData.balance < reward.points}
                    >
                      {reward.available && walletData.balance >= reward.points ? 'Redeem' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transaction History Tab */}
        {activeTab === 'history' && (
          <div>
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
                Transaction History
              </h3>
            </div>
            
            <div style={{
              display: 'grid',
              gap: '12px'
            }}>
              {transactions.map(transaction => (
                <div key={transaction.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  background: '#f9fafb'
                }}>
                  <div style={{flex: 1}}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#111827',
                      marginBottom: '4px'
                    }}>
                      {transaction.description}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#6b7280'
                    }}>
                      {transaction.date}
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: transaction.type === 'earned' ? '#10b981' : '#ef4444'
                    }}>
                      {transaction.type === 'earned' ? '+' : ''}{transaction.amount} pts
                    </span>
                    <span style={{
                      fontSize: '12px',
                      padding: '4px 8px',
                      background: transaction.status === 'completed' ? '#dcfce7' : '#fef3c7',
                      color: transaction.status === 'completed' ? '#16a34a' : '#d97706',
                      borderRadius: '4px',
                      fontWeight: '500'
                    }}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div>
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
                Achievements
              </h3>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {achievements.map(achievement => (
                <div key={achievement.id} style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '20px',
                  background: achievement.earned ? 'white' : '#f9fafb'
                }}>
                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: achievement.earned ? '#dcfce7' : '#e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <achievement.icon size={24} color={achievement.earned ? '#16a34a' : '#9ca3af'} />
                    </div>
                    <div style={{flex: 1}}>
                      <h4 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '4px'
                      }}>
                        {achievement.name}
                      </h4>
                      <p style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        marginBottom: '8px'
                      }}>
                        {achievement.description}
                      </p>
                      {achievement.earned ? (
                        <span style={{
                          fontSize: '12px',
                          color: '#16a34a',
                          fontWeight: '500'
                        }}>
                          Earned on {achievement.date}
                        </span>
                      ) : achievement.progress ? (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <div style={{
                            flex: 1,
                            height: '4px',
                            background: '#e5e7eb',
                            borderRadius: '2px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${(achievement.progress / 10) * 100}%`,
                              height: '100%',
                              background: '#3b82f6',
                              borderRadius: '2px'
                            }} />
                          </div>
                          <span style={{
                            fontSize: '12px',
                            color: '#6b7280'
                          }}>
                            {achievement.progress}/10
                          </span>
                        </div>
                      ) : (
                        <span style={{
                          fontSize: '12px',
                          color: '#9ca3af'
                        }}>
                          Not earned yet
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}






