import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { showSuccess, showError } from '../utils/toast';
import ProfilePictureUpload from './ProfilePictureUpload';
import config from '../config';

function UserProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('questions');
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')));

  const fetchUserProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const userRes = await axios.get(
        `${config.API_URL}/api/auth/profile/${userId}`,
        { headers }
      );
      setUser(userRes.data);

      const questionsRes = await axios.get(
        `${config.API_URL}/api/auth/${userId}/questions`
      );
      setQuestions(questionsRes.data);

      const answersRes = await axios.get(
        `${config.API_URL}/api/auth/${userId}/answers`
      );
      setAnswers(answersRes.data);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      showError('Failed to load profile');
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
  };

  const isOwnProfile = () => {
    const currentUser = getCurrentUser();
    return currentUser && currentUser._id === userId;
  };

  const handleProfileUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
    fetchUserProfile();
    showSuccess('Profile updated successfully!');
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(user.email);
    showSuccess('Email copied to clipboard!');
  };

  if (loading) {
    return <div className="spinner">Loading profile...</div>;
  }

  if (!user) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h3>User not found</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '900px', margin: '40px auto' }}>
      {/* Profile Header */}
      <div className="question-card fade-in" style={{ textAlign: 'center', padding: '40px' }}>
        
        {/* Profile Picture Section */}
        {isOwnProfile() ? (
          <ProfilePictureUpload 
            currentUser={currentUser} 
            onUpdate={handleProfileUpdate}
          />
        ) : (
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            margin: '0 auto 20px',
            overflow: 'hidden',
            cursor: 'pointer'
          }}
          onClick={handleCopyEmail}
          title="Click to copy email">
            {user.profilePicture ? (
              <img 
                src={user.profilePicture} 
                alt={user.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              user.name?.charAt(0).toUpperCase()
            )}
          </div>
        )}
        
        <h1 style={{ marginBottom: '10px' }}>{user.name}</h1>
        <p 
          style={{ color: '#667eea', marginBottom: '20px', cursor: 'pointer' }}
          onClick={handleCopyEmail}
          title="Click to copy email"
        >
          📧 {user.email}
        </p>
        
        {user.bio && (
          <p style={{ 
            backgroundColor: '#f8f9fa',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '20px'
          }}>
            {user.bio}
          </p>
        )}
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <h3>{questions.length}</h3>
            <p style={{ color: '#666' }}>Questions</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3>{answers.length}</h3>
            <p style={{ color: '#666' }}>Answers</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3>{new Date(user.createdAt).toLocaleDateString()}</h3>
            <p style={{ color: '#666' }}>Joined</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          className={`category-btn ${activeTab === 'questions' ? 'active' : ''}`}
          onClick={() => setActiveTab('questions')}
        >
          Questions ({questions.length})
        </button>
        <button
          className={`category-btn ${activeTab === 'answers' ? 'active' : ''}`}
          onClick={() => setActiveTab('answers')}
        >
          Answers ({answers.length})
        </button>
      </div>

      {/* Questions Tab */}
      {activeTab === 'questions' && (
        <div className="fade-in">
          <h3 style={{ color: 'white', marginBottom: '20px' }}>📝 Questions Asked</h3>
          
          {questions.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <p>No questions yet.</p>
            </div>
          ) : (
            questions.map((question) => (
              <div 
                key={question._id}
                className="card"
                onClick={() => window.location.href = `/question/${question._id}`}
                style={{ cursor: 'pointer' }}
              >
                <h4 style={{ marginBottom: '10px' }}>{question.title}</h4>
                <p style={{ color: '#666', marginBottom: '10px' }}>
                  {question.description.substring(0, 150)}...
                </p>
                <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: '#888' }}>
                  <span>📁 {question.category}</span>
                  <span>🗣️ {question.language}</span>
                  <span>📅 {new Date(question.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Answers Tab */}
      {activeTab === 'answers' && (
        <div className="fade-in">
          <h3 style={{ color: 'white', marginBottom: '20px' }}>💬 Answers Given</h3>
          
          {answers.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <p>No answers yet.</p>
            </div>
          ) : (
            answers.map((answer) => (
              <div 
                key={answer._id}
                className="card"
                onClick={() => window.location.href = `/question/${answer.question?._id || answer.question}`}
                style={{ cursor: 'pointer' }}
              >
                <p style={{ marginBottom: '10px' }}>{answer.content}</p>
                <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: '#888' }}>
                  <span>On question: <strong>{answer.question?.title || 'Question'}</strong></span>
                  <span>📅 {new Date(answer.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default UserProfile;