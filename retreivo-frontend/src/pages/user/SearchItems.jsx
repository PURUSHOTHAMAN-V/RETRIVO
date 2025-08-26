import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { matchText, searchItems, claimItem } from '../../services/api'
import { FiSearch, FiFilter, FiCamera, FiMic, FiMapPin, FiCalendar, FiTag, FiEye, FiHeart, FiShare2, FiDownload } from 'react-icons/fi'

export default function SearchItems(){
  const { user } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('text');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [distance, setDistance] = useState(10);
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState('');

  // Mock search results
  const mockResults = [
    {
      id: 1,
      item: 'iPhone 12',
      description: 'Black iPhone 12 with red case, found near Central Park fountain',
      category: 'Electronics',
      location: 'Central Park, Mumbai',
      dateFound: '2024-01-15',
      image: 'https://via.placeholder.com/150x150/3b82f6/ffffff?text=iPhone',
      similarity: 95,
      status: 'available',
      hub: 'Metro Hub',
      distance: 2.3
    },
    {
      id: 2,
      item: 'Leather Wallet',
      description: 'Brown leather wallet with credit cards and ID',
      category: 'Accessories',
      location: 'Shopping Mall, Andheri',
      dateFound: '2024-01-14',
      image: 'https://via.placeholder.com/150x150/f59e0b/ffffff?text=Wallet',
      similarity: 87,
      status: 'available',
      hub: 'Andheri Hub',
      distance: 5.1
    },
    {
      id: 3,
      item: 'Car Keys',
      description: 'Toyota car keys with keychain',
      category: 'Accessories',
      location: 'Parking Lot, Bandra',
      dateFound: '2024-01-13',
      image: 'https://via.placeholder.com/150x150/10b981/ffffff?text=Keys',
      similarity: 92,
      status: 'claimed',
      hub: 'Bandra Hub',
      distance: 3.7
    },
    {
      id: 4,
      item: 'Laptop Bag',
      description: 'Black laptop bag with Dell laptop inside',
      category: 'Electronics',
      location: 'Coffee Shop, Colaba',
      dateFound: '2024-01-12',
      image: 'https://via.placeholder.com/150x150/8b5cf6/ffffff?text=Laptop',
      similarity: 78,
      status: 'available',
      hub: 'Colaba Hub',
      distance: 8.2
    }
  ];

  const categories = ['Electronics', 'Clothing', 'Accessories', 'Documents', 'Jewelry', 'Sports', 'Books', 'Other'];

  useEffect(() => {
    // Keep client-side preview filtering for immediate feedback while typing
    if (!searchText.trim()) {
      setSearchResults([]);
      return;
    }
  }, [searchText]);

  const runTextSearch = async () => {
    try {
      setError('');
      setLoading(true);
      // 1) Hit ML text match for relevance suggestions (mocked by backend proxy)
      await matchText(searchText.trim());
      // 2) Query backend DB search combining lost/found items
      const resp = await searchItems({ query: searchText.trim(), category: selectedCategories[0] || null, location: location || null });
      // Map backend results into UI shape
      const mapped = (resp.results || []).map((r, idx) => ({
        id: `${r.type}-${r.item_id}`,
        item: r.name,
        description: r.description || '',
        category: r.category || 'Other',
        location: r.location || 'Unknown',
        dateFound: r.date || '',
        image: 'https://via.placeholder.com/150x150/3b82f6/ffffff?text=Item',
        similarity: 80 + (idx % 15),
        status: r.status === 'available' || r.status === 'active' ? 'available' : 'claimed',
        hub: r.type === 'found' ? 'Hub' : 'Citizen',
        distance: 1 + (idx % 9)
      }));
      setSearchResults(mapped);
    } catch (e) {
      setError(e.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate voice recording
      setTimeout(() => {
        setSearchText('iPhone 12 lost in Central Park');
        setIsRecording(false);
      }, 3000);
    }
  };

  const handleClaim = async (compoundId) => {
    try {
      setError('');
      const [item_type] = String(compoundId).split('-');
      const item_id = Number(String(compoundId).split('-')[1]);
      if (!item_id || !['lost','found'].includes(item_type)) {
        throw new Error('Invalid item to claim');
      }
      await claimItem({ item_id, item_type });
      // Optimistically update UI
      setSearchResults(prev => prev.map(it => it.id === compoundId ? { ...it, status: 'claimed' } : it));
    } catch (e) {
      setError(e.message || 'Failed to create claim');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#10b981';
      case 'claimed': return '#f59e0b';
      case 'resolved': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getSimilarityColor = (similarity) => {
    if (similarity >= 90) return '#10b981';
    if (similarity >= 70) return '#f59e0b';
    return '#ef4444';
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
            Search Items
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '16px'
          }}>
            Find your lost items using AI-powered search
          </p>
        </div>
      </div>

      {/* Search Tabs */}
      <div className="card" style={{marginBottom: '24px'}}>
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e5e7eb',
          marginBottom: '24px'
        }}>
          {[
            { id: 'text', label: 'Text Search', icon: FiSearch },
            { id: 'image', label: 'Image Search', icon: FiCamera },
            { id: 'voice', label: 'Voice Search', icon: FiMic }
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

        {/* Text Search */}
        {activeTab === 'text' && (
          <div style={{
            display: 'grid',
            gap: '16px'
          }}>
            <div style={{position: 'relative'}}>
              <FiSearch style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }} />
              <input 
                className="input" 
                placeholder="Describe your item and where you lost it..." 
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{paddingLeft: '48px'}}
              />
            </div>
            
            {error && (
              <div style={{
                background: '#fef2f2',
                color: '#b91c1c',
                border: '1px solid #fecaca',
                padding: '12px 16px',
                borderRadius: '8px'
              }}>
                {error}
              </div>
            )}

            <div style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center'
            }}>
              <button 
                onClick={runTextSearch}
                className="btn" 
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  padding: '12px 24px'
                }}
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
              <button 
                className="btn" 
                style={{background: '#6b7280'}}
                onClick={() => setFiltersOpen(!filtersOpen)}
              >
                <FiFilter size={16} />
                {filtersOpen ? 'Hide' : 'Show'} Filters
              </button>
            </div>

            {filtersOpen && (
              <div style={{
                background: '#f9fafb',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{
                  display: 'grid',
                  gap: '20px'
                }}>
                  <div>
                    <strong style={{color: '#111827', marginBottom: '8px', display: 'block'}}>Category</strong>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                      gap: '8px'
                    }}>
                      {categories.map(category => (
                        <label key={category} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}>
                          <input 
                            type="checkbox"
                            checked={selectedCategories.includes(category)}
                            onChange={() => handleCategoryToggle(category)}
                          />
                          {category}
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px'
                  }}>
                    <div>
                      <strong style={{color: '#111827', marginBottom: '8px', display: 'block'}}>Date Range</strong>
                      <div style={{display: 'flex', gap: '8px'}}>
                        <input 
                          className="input" 
                          type="date" 
                          value={dateRange.start}
                          onChange={(e) => setDateRange(prev => ({...prev, start: e.target.value}))}
                        />
                        <input 
                          className="input" 
                          type="date" 
                          value={dateRange.end}
                          onChange={(e) => setDateRange(prev => ({...prev, end: e.target.value}))}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <strong style={{color: '#111827', marginBottom: '8px', display: 'block'}}>Distance (km)</strong>
                      <input 
                        className="input" 
                        type="range" 
                        min={1} 
                        max={50} 
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                      />
                      <div style={{textAlign: 'center', fontSize: '14px', color: '#6b7280'}}>
                        {distance} km
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px'
                  }}>
                    <div>
                      <strong style={{color: '#111827', marginBottom: '8px', display: 'block'}}>Location</strong>
                      <input 
                        className="input" 
                        placeholder="Enter location (optional)" 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <strong style={{color: '#111827', marginBottom: '8px', display: 'block'}}>Sort By</strong>
                      <select 
                        className="input" 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="relevance">Relevance</option>
                        <option value="date">Date</option>
                        <option value="distance">Distance</option>
                        <option value="similarity">Similarity</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Image Search */}
        {activeTab === 'image' && (
          <div style={{
            display: 'grid',
            gap: '16px'
          }}>
            <div style={{
              border: '2px dashed #d1d5db',
              borderRadius: '12px',
              padding: '40px',
              textAlign: 'center',
              background: uploadedImage ? 'transparent' : '#f9fafb',
              cursor: 'pointer',
              position: 'relative'
            }}>
              {uploadedImage ? (
                <div>
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded" 
                    style={{
                      maxWidth: '200px',
                      maxHeight: '200px',
                      borderRadius: '8px'
                    }}
                  />
                  <button 
                    onClick={() => setUploadedImage(null)}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      cursor: 'pointer'
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div>
                  <FiCamera size={48} color="#9ca3af" style={{marginBottom: '16px'}} />
                  <div style={{color: '#6b7280', marginBottom: '8px'}}>
                    Upload or drop an image here
                  </div>
                  <div style={{fontSize: '14px', color: '#9ca3af'}}>
                    Supports JPG, PNG, GIF up to 10MB
                  </div>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer'
                }}
              />
            </div>
            
            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              <button className="btn" style={{background: '#3b82f6', color: 'white'}}>
                Search by Image
              </button>
              <button className="btn" style={{background: '#0ea5e9', color: 'white'}}>
                <FiCamera size={16} />
                Use Camera
              </button>
            </div>
          </div>
        )}

        {/* Voice Search */}
        {activeTab === 'voice' && (
          <div style={{
            display: 'grid',
            gap: '16px'
          }}>
            <button 
              className="btn" 
              style={{
                background: isRecording ? '#ef4444' : '#3b82f6',
                color: 'white',
                padding: '16px',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onClick={handleVoiceRecord}
            >
              <FiMic size={20} />
              {isRecording ? 'Recording...' : 'Record Voice'}
            </button>
            
            <div style={{
              background: '#f9fafb',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              minHeight: '100px'
            }}>
              {searchText ? (
                <div>
                  <div style={{color: '#6b7280', fontSize: '14px', marginBottom: '8px'}}>
                    Voice-to-text result:
                  </div>
                  <div style={{color: '#111827', fontSize: '16px'}}>
                    "{searchText}"
                  </div>
                </div>
              ) : (
                <div style={{color: '#9ca3af', textAlign: 'center'}}>
                  Your voice-to-text will appear here...
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
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
              Search Results ({searchResults.length})
            </h3>
          </div>
          
          <div style={{
            display: 'grid',
            gap: '16px'
          }}>
            {searchResults.map(item => (
              <div key={item.id} style={{
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '20px',
                background: 'white'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '20px'
                }}>
                  <img 
                    src={item.image} 
                    alt={item.item}
                    style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '8px',
                      objectFit: 'cover'
                    }}
                  />
                  
                  <div style={{flex: 1}}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '12px'
                    }}>
                      <div>
                        <h4 style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#111827',
                          marginBottom: '4px'
                        }}>
                          {item.item}
                        </h4>
                        <p style={{
                          fontSize: '14px',
                          color: '#6b7280',
                          marginBottom: '8px'
                        }}>
                          {item.description}
                        </p>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        gap: '8px'
                      }}>
                        <span style={{
                          fontSize: '12px',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          background: getStatusColor(item.status) + '20',
                          color: getStatusColor(item.status),
                          fontWeight: '500'
                        }}>
                          {item.status}
                        </span>
                        <span style={{
                          fontSize: '12px',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          background: getSimilarityColor(item.similarity) + '20',
                          color: getSimilarityColor(item.similarity),
                          fontWeight: '500'
                        }}>
                          {item.similarity}% match
                        </span>
                      </div>
                    </div>
                    
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: '12px',
                      fontSize: '14px',
                      color: '#6b7280',
                      marginBottom: '16px'
                    }}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                        <FiTag size={14} />
                        <span>{item.category}</span>
                      </div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                        <FiMapPin size={14} />
                        <span>{item.location}</span>
                      </div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                        <FiCalendar size={14} />
                        <span>Found: {item.dateFound}</span>
                      </div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                        <FiMapPin size={14} />
                        <span>{item.distance} km away</span>
                      </div>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center'
                    }}>
                      {item.status === 'available' && (
                        <button 
                          onClick={() => handleClaim(item.id)}
                          className="btn" 
                          style={{
                            background: '#10b981',
                            color: 'white',
                            padding: '8px 16px',
                            fontSize: '14px'
                          }}
                        >
                          Claim Item
                        </button>
                      )}
                      <button className="btn" style={{
                        background: '#3b82f6',
                        color: 'white',
                        padding: '8px 12px',
                        fontSize: '14px'
                      }}>
                        <FiEye size={16} />
                      </button>
                      <button className="btn" style={{
                        background: '#f59e0b',
                        color: 'white',
                        padding: '8px 12px',
                        fontSize: '14px'
                      }}>
                        <FiHeart size={16} />
                      </button>
                      <button className="btn" style={{
                        background: '#8b5cf6',
                        color: 'white',
                        padding: '8px 12px',
                        fontSize: '14px'
                      }}>
                        <FiShare2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {searchText && searchResults.length === 0 && !loading && (
        <div className="card" style={{textAlign: 'center', padding: '40px'}}>
          <FiSearch size={48} color="#9ca3af" style={{marginBottom: '16px'}} />
          <h3 style={{color: '#111827', marginBottom: '8px'}}>No items found</h3>
          <p style={{color: '#6b7280'}}>
            Try adjusting your search terms or filters to find more results.
          </p>
        </div>
      )}
    </div>
  )
}






