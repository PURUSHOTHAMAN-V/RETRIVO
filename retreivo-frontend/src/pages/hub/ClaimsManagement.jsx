import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FiSearch, FiFilter, FiEye, FiCheck, FiX, FiClock, FiAlertTriangle, FiUser, FiMapPin, FiCalendar } from 'react-icons/fi';
import { getHubClaims, approveClaimItem } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function ClaimsManagement() {
  const { hub, isHubAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isHubAuthenticated) navigate('/hub/login');
  }, [isHubAuthenticated, navigate]);

  useEffect(() => {
    const fetchClaims = async () => {
      setLoading(true);
      setError('');
      try {
        if (!hub || !hub.id) throw new Error('Hub information not available');
        const response = await getHubClaims(hub.id);
        if (!response.ok) throw new Error(response.error || 'Failed to fetch claims');
        if (!response.claims || !Array.isArray(response.claims)) throw new Error('Invalid claims data format');

        const formattedClaims = response.claims.map(claim => ({
          id: claim.claim_id,
          itemName: claim.item_name || 'Unknown Item',
          category: claim.category || 'Uncategorized',
          location: claim.item_location || 'Unknown Location',
          date: claim.date ? new Date(claim.date).toLocaleDateString() : 'Unknown Date',
          description: claim.item_description || 'No description available',
          status: claim.status || 'pending',
          claimDate: claim.created_at ? new Date(claim.created_at).toLocaleDateString() : 'Unknown Date',
          claimant: {
            name: 'User ID: ' + claim.claimer_user_id,
            email: 'Contact hub for details',
            phone: 'Contact hub for details'
          }
        }));

        setClaims(formattedClaims);
        setFilteredClaims(formattedClaims);
      } catch (err) {
        setError(`Failed to load claims. ${err.message || 'Please try again later.'}`);
        setClaims([]);
        setFilteredClaims([]);
      } finally {
        setLoading(false);
      }
    };

    if (isHubAuthenticated && hub) fetchClaims();
  }, [hub, isHubAuthenticated]);

  useEffect(() => {
    const filtered = claims.filter(claim => {
      const matchesSearch =
        claim.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.claimant.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || claim.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
    setFilteredClaims(filtered);
  }, [searchTerm, filterStatus, claims]);

  const handleSearch = e => setSearchTerm(e.target.value);
  const handleFilterChange = status => setFilterStatus(status);

  const handleApprove = async claimId => {
    try {
      setError('');
      setClaims(prev => prev.map(c => (c.id === claimId ? { ...c, status: 'approved' } : c)));
      setFilteredClaims(prev => prev.map(c => (c.id === claimId ? { ...c, status: 'approved' } : c)));
      const response = await approveClaimItem(claimId);
      if (!response.ok) throw new Error(response.error || 'Failed to approve claim');
      alert('Claim approved successfully. The user has been notified.');
    } catch (err) {
      setError(`Failed to approve claim. ${err.message || 'Please try again.'}`);
      setClaims(prev => prev.map(c => (c.id === claimId ? { ...c, status: 'pending' } : c)));
      setFilteredClaims(prev => prev.map(c => (c.id === claimId ? { ...c, status: 'pending' } : c)));
    }
  };

  const handleReject = async claimId => {
    setClaims(prev => prev.map(c => (c.id === claimId ? { ...c, status: 'rejected' } : c)));
    setFilteredClaims(prev => prev.map(c => (c.id === claimId ? { ...c, status: 'rejected' } : c)));
  };

  const getStatusBadge = status => {
    const baseStyle = { display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '500' };
    switch (status) {
      case 'pending':
        return <span style={{ ...baseStyle, backgroundColor: '#FEF3C7', color: '#B45309' }}><FiClock style={{ marginRight: '4px' }} /> Pending</span>;
      case 'approved':
        return <span style={{ ...baseStyle, backgroundColor: '#DCFCE7', color: '#166534' }}><FiCheck style={{ marginRight: '4px' }} /> Approved</span>;
      case 'rejected':
        return <span style={{ ...baseStyle, backgroundColor: '#FEE2E2', color: '#991B1B' }}><FiX style={{ marginRight: '4px' }} /> Rejected</span>;
      default:
        return <span style={{ ...baseStyle, backgroundColor: '#E5E7EB', color: '#374151' }}><FiAlertTriangle style={{ marginRight: '4px' }} /> Unknown</span>;
    }
  };

  const containerStyle = { maxWidth: '1200px', margin: '0 auto', padding: '2rem', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' };
  const headingStyle = { fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem', color: '#111827' };
  const searchContainer = { position: 'relative', width: '100%', maxWidth: '300px', marginBottom: '1rem' };
  const searchInput = { width: '100%', padding: '8px 12px 8px 32px', borderRadius: '0.5rem', border: '1px solid #D1D5DB', outline: 'none', fontSize: '1rem' };
  const searchIconStyle = { position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' };
  const filterButtonStyle = (active) => ({
    padding: '6px 12px',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: active ? '#3B82F6' : '#E5E7EB',
    color: active ? '#fff' : '#111827',
    fontWeight: '500',
    marginRight: '0.5rem'
  });
  const cardStyle = { backgroundColor: '#fff', borderRadius: '0.75rem', boxShadow: '0 4px 8px rgba(0,0,0,0.05)', padding: '1.5rem', marginBottom: '1rem' };
  const cardHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Claims Management</h1>
      {error && <div style={{ backgroundColor: '#FEE2E2', borderLeft: '4px solid #EF4444', color: '#B91C1C', padding: '1rem', marginBottom: '1rem', borderRadius: '0.5rem' }}>{error}</div>}

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={searchContainer}>
          <FiSearch style={searchIconStyle} />
          <input type="text" placeholder="Search claims..." style={searchInput} value={searchTerm} onChange={handleSearch} />
        </div>
        <div>
          {['all', 'pending', 'approved', 'rejected'].map(status => (
            <button key={status} style={filterButtonStyle(filterStatus === status)} onClick={() => handleFilterChange(status)}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? <p>Loading claims...</p> : filteredClaims.length === 0 ? <p>No claims found</p> : filteredClaims.map(claim => (
        <div key={claim.id} style={cardStyle}>
          <div style={cardHeaderStyle}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>{claim.itemName}</h2>
              <p style={{ color: '#6B7280', marginBottom: '1rem' }}>{claim.description}</p>
            </div>
            <div>{getStatusBadge(claim.status)}</div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FiUser style={{ color: '#9CA3AF' }} /><div><p style={{ fontSize: '0.75rem', color: '#6B7280' }}>Claimant</p><p>{claim.claimant.name}</p><p style={{ fontSize: '0.75rem', color: '#6B7280' }}>{claim.claimant.email}</p><p style={{ fontSize: '0.75rem', color: '#6B7280' }}>{claim.claimant.phone}</p></div></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FiMapPin style={{ color: '#9CA3AF' }} /><div><p style={{ fontSize: '0.75rem', color: '#6B7280' }}>Location Found</p><p>{claim.location}</p></div></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FiCalendar style={{ color: '#9CA3AF' }} /><div><p style={{ fontSize: '0.75rem', color: '#6B7280' }}>Dates</p><p>Found: {claim.date}</p><p>Claimed: {claim.claimDate}</p></div></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button style={{ padding: '6px 12px', backgroundColor: '#3B82F6', color: '#fff', borderRadius: '0.5rem', border: 'none', display: 'flex', alignItems: 'center', cursor: 'pointer' }}><FiEye style={{ marginRight: '4px' }} />View Details</button>
            {claim.status === 'pending' && <>
              <button onClick={() => handleApprove(claim.id)} style={{ padding: '6px 12px', backgroundColor: '#10B981', color: '#fff', borderRadius: '0.5rem', border: 'none', display: 'flex', alignItems: 'center', cursor: 'pointer' }}><FiCheck style={{ marginRight: '4px' }} />Approve</button>
              <button onClick={() => handleReject(claim.id)} style={{ padding: '6px 12px', backgroundColor: '#EF4444', color: '#fff', borderRadius: '0.5rem', border: 'none', display: 'flex', alignItems: 'center', cursor: 'pointer' }}><FiX style={{ marginRight: '4px' }} />Reject</button>
            </>}
          </div>
        </div>
      ))}
    </div>
  );
}
