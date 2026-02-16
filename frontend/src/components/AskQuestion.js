import React, { useState } from 'react';
import axios from 'axios';
import { showSuccess, showError } from '../utils/toast';
import config from '../config';

function AskQuestion() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technology',
    language: 'English'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = [
    'Jobs',
    'Agriculture',
    'Education',
    'Small Business',
    'Technology',
    'Health Info'
  ];

  const languages = ['English', 'Amharic'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      showError('Please login first!');
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post(
        `${config.API_URL}/api/questions/ask`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setSuccess('Question posted successfully!');
      showSuccess('Question posted successfully!');
      
      setFormData({
        title: '',
        description: '',
        category: 'Technology',
        language: 'English'
      });

      setTimeout(() => {
        window.location.href = '/';
      }, 2000);

    } catch (error) {
      console.error('Error:', error);
      
      if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
        showError('Session expired. Please login again.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      } else {
        const errorMsg = error.response?.data?.message || 'Failed to post question';
        setError(errorMsg);
        showError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container fade-in">
      <h2 className="form-title">❓ Ask a Question</h2>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success} Redirecting to home...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter your question title"
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Provide more details about your question..."
            rows="5"
          />
        </div>

        <div className="form-group">
          <label>Category:</label>
          <select
            name="category"
            className="form-control"
            value={formData.category}
            onChange={handleChange}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Language:</label>
          <select
            name="language"
            className="form-control"
            value={formData.language}
            onChange={handleChange}
          >
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Posting...' : 'Post Question'}
        </button>
      </form>
    </div>
  );
}

export default AskQuestion;