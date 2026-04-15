import React, { useState, useEffect } from 'react';
import { contactService } from '../../services/api';
import '../../styles/Admin.css';

function ContactAdmin() {
  const [contactInfo, setContactInfo] = useState({
    phone: '',
    email: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const res = await contactService.getInfo();
      if (res.data) {
        setContactInfo(res.data);
      }
    } catch (error) {
      console.error('Error fetching contact info');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setContactInfo({
      ...contactInfo,
      [e.target.name]: e.target.value,
    });
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

  return (
    <div className="admin-section">
      <h2>Contact Information</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Phone Number</label>
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
            <label>Email Address</label>
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
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={contactInfo.address}
              onChange={handleChange}
              placeholder="Manila, Philippines"
              required
            />
          </div>

          <button type="submit" className="save-btn">
            Update Contact Info
          </button>
        </form>
      )}
    </div>
  );
}

export default ContactAdmin;
