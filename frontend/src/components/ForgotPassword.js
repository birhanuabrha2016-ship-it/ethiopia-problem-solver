import React, { useState } from 'react';
import axios from 'axios';
import { showSuccess, showError } from '../utils/toast';
import config from '../config';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${config.API_URL}/api/auth/forgot-password`, { email });
      showSuccess('Password reset email sent! Check your inbox.');
      setSubmitted(true);
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container fade-in">
      <h2 className="form-title">🔐 Forgot Password</h2>
      
      {submitted ? (
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            We've sent a password reset link to your email. Please check your inbox.
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = '/login'}
          >
            Back to Login
          </button>
        </div>
      ) : (
        <>
          <p style={{ color: '#666', marginBottom: '20px', textAlign: 'center' }}>
            Enter your email address and we'll send you a link to reset your password.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            <a href="/login">Back to Login</a>
          </p>
        </>
      )}
    </div>
  );
}

export default ForgotPassword;