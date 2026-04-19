import React, { useState, useEffect } from 'react';
import { contactService } from '../../services/api';
import '../../styles/Admin.css';

const Icons = {
  ContactBook: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
  Phone: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>,
  Mail: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>,
  MapPin: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
  Save: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
};

function ContactAdmin() {
  const [contactInfo, setContactInfo] = useState({ phone: '', email: '', address: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const res = await contactService.getInfo();
      if (res.data) setContactInfo(res.data);
    } catch (error) {
      console.error('Error fetching contact info');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setContactInfo({ ...contactInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await contactService.updateInfo(contactInfo);
      alert('Contact information updated successfully!');
    } catch (error) {
      alert('Error updating contact information');
    }
  };

  const labelStyle = { display: 'flex', alignItems: 'center', gap: '0.5rem' };

  return (
    <div className="admin-section">
      <h2 style={labelStyle}>
        <Icons.ContactBook /> Contact Information
      </h2>

      {loading ? (
        <p style={{ color: 'var(--admin-text-secondary)' }}>Loading contact info...</p>
      ) : (
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label style={labelStyle}><Icons.Phone /> Phone Number</label>
            <input 
              type="tel" 
              name="phone" 
              value={contactInfo.phone} 
              onChange={handleChange} 
              placeholder="+63 917 123 4567" 
              required 
            />
          </div>

          <div className="form-group">
            <label style={labelStyle}><Icons.Mail /> Email Address</label>
            <input 
              type="email" 
              name="email" 
              value={contactInfo.email} 
              onChange={handleChange} 
              placeholder="info@iwanderph.com" 
              required 
            />
          </div>

          <div className="form-group">
            <label style={labelStyle}><Icons.MapPin /> Address</label>
            <input 
              type="text" 
              name="address" 
              value={contactInfo.address} 
              onChange={handleChange} 
              placeholder="Manila, Philippines" 
              required 
            />
          </div>

          <div className="form-actions" style={{ marginTop: '0.5rem' }}>
            <button type="submit" className="save-btn" style={{ maxWidth: '250px' }}>
              <Icons.Save /> Update Contact Info
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ContactAdmin;