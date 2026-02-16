import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import CategoriesFilter from './CategoriesFilter';
import LoadingSkeleton from './LoadingSkeleton';
import config from '../config';

function QuestionList() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      let url = `${config.API_URL}/api/questions`;
      
      if (selectedCategory !== 'All') {
        url = `${config.API_URL}/api/questions/category/${selectedCategory}`;
      }
      
      const response = await axios.get(url);
      setQuestions(response.data);
      setError('');
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load questions. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ color: 'white', marginBottom: '20px' }}>📋 Recent Questions</h2>
      
      <CategoriesFilter 
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {error && (
        <div className="alert alert-error">
          ❌ {error}
        </div>
      )}

      {questions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>
            No questions found in this category.
          </p>
        </div>
      ) : (
        questions.map((question) => (
          <div 
            key={question._id} 
            className="card fade-in"
            onClick={() => window.location.href = `/question/${question._id}`}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '20px',
              backgroundColor: '#f9f9f9',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}
          >
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{question.title}</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>{question.description}</p>
            <div style={{ 
              display: 'flex', 
              gap: '15px', 
              fontSize: '14px', 
              color: '#888',
              marginTop: '15px',
              paddingTop: '15px',
              borderTop: '1px solid #eee',
              flexWrap: 'wrap'
            }}>
              <span>📁 Category: <strong>{question.category}</strong></span>
              <span>🗣️ Language: <strong>{question.language}</strong></span>
              <span>👤 Asked by: 
                <strong 
                  style={{ cursor: 'pointer', color: '#667eea', marginLeft: '5px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `/profile/${question.user?._id}`;
                  }}
                >
                  {question.user?.name || 'Anonymous'}
                </strong>
              </span>
              <span>📅 {new Date(question.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default QuestionList;