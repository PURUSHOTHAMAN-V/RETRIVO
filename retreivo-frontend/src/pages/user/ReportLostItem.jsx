import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { reportLostItem } from '../../services/api'
import { FiUpload, FiMapPin, FiCalendar, FiTag, FiCamera, FiX, FiCheck } from 'react-icons/fi'

export default function ReportLostItem() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    description: '',
    dateLost: '',
    location: '',
    contactPhone: '',
    contactEmail: '',
    reward: '',
    isUrgent: false
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Electronics', 'Clothing', 'Accessories', 'Documents', 
    'Jewelry', 'Sports Equipment', 'Books', 'Other'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      file: file,
      preview: URL.createObjectURL(file)
    }));
    setUploadedImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (imageId) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Convert uploaded images to base64 strings
      const imagePromises = uploadedImages.map(img => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(img.file);
        });
      });
      
      const base64Images = await Promise.all(imagePromises);
      
      await reportLostItem({
        name: formData.itemName,
        category: formData.category,
        description: formData.description,
        location: formData.location,
        date_lost: formData.dateLost,
        images: base64Images // Include images for ML service matching
      });
      setSuccess(true);
      setTimeout(() => {
        setFormData({
          itemName: '',
          category: '',
          description: '',
          dateLost: '',
          location: '',
          contactPhone: '',
          contactEmail: '',
          reward: '',
          isUrgent: false
        });
        setUploadedImages([]);
        setCurrentStep(1);
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return formData.itemName && formData.category && formData.description;
      case 2:
        return formData.dateLost && formData.location;
      case 3:
        return formData.contactPhone || formData.contactEmail;
      default:
        return false;
    }
  };

  if (success) {
    return (
      <div className="container" style={{marginTop: '24px'}}>
        <div className="card" style={{
          textAlign: 'center',
          padding: '60px 40px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white'
        }}>
          <FiCheck size={64} style={{marginBottom: '24px'}} />
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '16px'
          }}>
            Report Submitted Successfully!
          </h1>
          <p style={{
            fontSize: '18px',
            opacity: 0.9,
            marginBottom: '24px'
          }}>
            Your lost item report has been submitted. We'll notify you when we find a match.
          </p>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '14px'
          }}>
            Report ID: LOST-{Date.now().toString().slice(-6)}
          </div>
        </div>
      </div>
    );
  }

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
            Report Lost Item
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '16px'
          }}>
            Help us find your lost item with detailed information
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="card" style={{marginBottom: '24px'}}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          {[1, 2, 3].map(step => (
            <div key={step} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: currentStep >= step ? '#3b82f6' : '#e5e7eb',
                color: currentStep >= step ? 'white' : '#6b7280',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600'
              }}>
                {step}
              </div>
              <div style={{
                display: step < 3 ? 'block' : 'none',
                width: '60px',
                height: '2px',
                background: currentStep > step ? '#3b82f6' : '#e5e7eb'
              }} />
            </div>
          ))}
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          <span>Item Details</span>
          <span>Location & Date</span>
          <span>Contact Info</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{
            background: '#fef2f2',
            color: '#b91c1c',
            border: '1px solid #fecaca',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}
        <div className="card">
          {/* Step 1: Item Details */}
          {currentStep === 1 && (
            <div style={{
              display: 'grid',
              gap: '24px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '16px'
              }}>
                Item Details
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '500',
                    color: '#111827'
                  }}>
                    Item Name *
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={formData.itemName}
                    onChange={(e) => handleInputChange('itemName', e.target.value)}
                    placeholder="e.g., iPhone 12, Leather Wallet"
                    required
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '500',
                    color: '#111827'
                  }}>
                    Category *
                  </label>
                  <select
                    className="input"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: '#111827'
                }}>
                  Description *
                </label>
                <textarea
                  className="input"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your item in detail (color, brand, size, unique features, etc.)"
                  rows={4}
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: '#111827'
                }}>
                  Upload Images (Optional)
                </label>
                <div style={{
                  border: '2px dashed #d1d5db',
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'center',
                  background: '#f9fafb',
                  cursor: 'pointer',
                  position: 'relative'
                }}>
                  <FiUpload size={32} color="#9ca3af" style={{marginBottom: '12px'}} />
                  <div style={{color: '#6b7280', marginBottom: '8px'}}>
                    Click to upload or drag and drop
                  </div>
                  <div style={{fontSize: '14px', color: '#9ca3af'}}>
                    PNG, JPG, GIF up to 10MB
                  </div>
                  <input
                    type="file"
                    multiple
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

                {/* Uploaded Images */}
                {uploadedImages.length > 0 && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                    gap: '12px',
                    marginTop: '16px'
                  }}>
                    {uploadedImages.map(image => (
                      <div key={image.id} style={{
                        position: 'relative',
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}>
                        <img
                          src={image.preview}
                          alt="Uploaded"
                          style={{
                            width: '100%',
                            height: '120px',
                            objectFit: 'cover'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn"
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    padding: '12px 24px'
                  }}
                  disabled={!isStepValid(1)}
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Location & Date */}
          {currentStep === 2 && (
            <div style={{
              display: 'grid',
              gap: '24px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '16px'
              }}>
                Location & Date
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '500',
                    color: '#111827'
                  }}>
                    Date Lost *
                  </label>
                  <input
                    type="date"
                    className="input"
                    value={formData.dateLost}
                    onChange={(e) => handleInputChange('dateLost', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '500',
                    color: '#111827'
                  }}>
                    Location *
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Central Park, Mumbai"
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.isUrgent}
                    onChange={(e) => handleInputChange('isUrgent', e.target.checked)}
                  />
                  <span style={{fontWeight: '500', color: '#111827'}}>
                    Mark as urgent (high-value item)
                  </span>
                </label>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: '#111827'
                }}>
                  Reward Amount (Optional)
                </label>
                <input
                  type="number"
                  className="input"
                  value={formData.reward}
                  onChange={(e) => handleInputChange('reward', e.target.value)}
                  placeholder="Enter reward amount in ₹"
                  min="0"
                />
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'space-between'
              }}>
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn"
                  style={{
                    background: '#6b7280',
                    color: 'white',
                    padding: '12px 24px'
                  }}
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn"
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    padding: '12px 24px'
                  }}
                  disabled={!isStepValid(2)}
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Contact Information */}
          {currentStep === 3 && (
            <div style={{
              display: 'grid',
              gap: '24px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '16px'
              }}>
                Contact Information
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '500',
                    color: '#111827'
                  }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="input"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '500',
                    color: '#111827'
                  }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="input"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div style={{
                background: '#f0f9ff',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #bae6fd'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  <FiCheck size={16} color="#0369a1" />
                  <span style={{fontWeight: '500', color: '#0369a1'}}>
                    Contact Information
                  </span>
                </div>
                <p style={{fontSize: '14px', color: '#0c4a6e', margin: 0}}>
                  We'll use this information to contact you when we find a match. 
                  At least one contact method is required.
                </p>
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'space-between'
              }}>
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn"
                  style={{
                    background: '#6b7280',
                    color: 'white',
                    padding: '12px 24px'
                  }}
                >
                  Previous
                </button>
                <button
                  type="submit"
                  className="btn"
                  style={{
                    background: '#10b981',
                    color: 'white',
                    padding: '12px 24px'
                  }}
                  disabled={!isStepValid(3) || loading}
                >
                  {loading ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}






