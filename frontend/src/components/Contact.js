import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${config.API_URL}/api/contact`, formData);
      
      setSuccess(response.data.message);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '40px auto' }}>
      <div className="question-card fade-in" style={{ padding: '40px' }}>
        <h1 style={{ 
          textAlign: 'center', 
          color: '#333',
          marginBottom: '10px',
          fontSize: '2.5rem'
        }}>
          📞 Contact Us
        </h1>

        <p style={{ 
          textAlign: 'center', 
          color: '#666',
          marginBottom: '30px',
          fontSize: '1.1rem'
        }}>
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>

        <div style={{ 
          width: '100%',
          height: '4px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          marginBottom: '30px'
        }} />

        {/* Contact Information Cards */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '30px',
          marginBottom: '30px'
        }}>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <span style={{ fontSize: '2rem' }}>📧</span>
            <h3 style={{ margin: '10px 0', color: '#333' }}>Email</h3>
            <p style={{ color: '#667eea', fontWeight: 'bold' }}>birhanuabrha2016@gmail.com</p>
          </div>

          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <span style={{ fontSize: '2rem' }}>📱</span>
            <h3 style={{ margin: '10px 0', color: '#333' }}>Phone</h3>
            <p style={{ color: '#667eea', fontWeight: 'bold' }}>+251 942 780 234</p>
          </div>

          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <span style={{ fontSize: '2rem' }}>📍</span>
            <h3 style={{ margin: '10px 0', color: '#333' }}>Address</h3>
            <p style={{ color: '#666' }}>Addis Ababa, Ethiopia</p>
          </div>

          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <span style={{ fontSize: '2rem' }}>🕒</span>
            <h3 style={{ margin: '10px 0', color: '#333' }}>Hours</h3>
            <p style={{ color: '#666' }}>Mon-Fri: 9AM - 6PM</p>
          </div>
        </div>

        <div style={{
          backgroundColor: '#e8f4fd',
          padding: '15px',
          borderRadius: '8px',
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <p style={{ color: '#333', fontSize: '1.1rem' }}>
            👤 Created by <strong>Birhanu Abrha</strong> | 📧 birhanuabrha2016@gmail.com | 📱 +251 942 780 234
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Your Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Subject</label>
            <input
              type="text"
              name="subject"
              className="form-control"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
              name="message"
              className="form-control"
              value={formData.message}
              onChange={handleChange}
              rows="6"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;