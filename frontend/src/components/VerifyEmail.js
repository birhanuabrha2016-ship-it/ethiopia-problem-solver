import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '../utils/toast';
import config from '../config';

function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [message, setMessage] = useState('');

  const verifyEmail = useCallback(async () => {
    try {
      const response = await axios.get(`${config.API_URL}/api/auth/verify-email/${token}`);
      setMessage(response.data.message);
      showSuccess('Email verified successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Verification failed');
      showError(error.response?.data?.message || 'Verification failed');
    } finally {
      setVerifying(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    verifyEmail();
  }, [verifyEmail]);

  return (
    <div className="form-container fade-in">
      <h2 className="form-title">📧 Email Verification</h2>
      
      {verifying ? (
        <div className="spinner">Verifying your email...</div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#666', marginBottom: '20px' }}>{message}</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/login')}
          >
            Go to Login
          </button>
        </div>
      )}
    </div>
  );
}

export default VerifyEmail;