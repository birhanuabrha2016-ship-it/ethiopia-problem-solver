 import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { showSuccess, showError } from '../utils/toast';
import config from '../config';

function QuestionDetails() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAnswer, setNewAnswer] = useState('');
  const [posting, setPosting] = useState(false);
  
  // Question edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editLanguage, setEditLanguage] = useState('');

  // Answer edit state
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editAnswerContent, setEditAnswerContent] = useState('');

  const categories = [
    'Jobs',
    'Agriculture',
    'Education',
    'Small Business',
    'Technology',
    'Health Info'
  ];

  const fetchQuestionAndAnswers = useCallback(async () => {
    try {
      const questionRes = await axios.get(`${config.API_URL}/api/questions/${id}`);
      setQuestion(questionRes.data);

      const answersRes = await axios.get(`${config.API_URL}/api/answers/question/${id}`);
      setAnswers(answersRes.data);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching details:', error);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchQuestionAndAnswers();
  }, [fetchQuestionAndAnswers]);

  const isOwner = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && question.user && user._id === question.user._id;
  };

  const isAnswerOwner = (answer) => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && answer.user && user._id === answer.user._id;
  };

  const startEditing = () => {
    setEditTitle(question.title);
    setEditDescription(question.description);
    setEditCategory(question.category);
    setEditLanguage(question.language);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const saveEdit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      showError('Please login first!');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
      return;
    }

    try {
      await axios.put(
        `${config.API_URL}/api/questions/${id}`,
        {
          title: editTitle,
          description: editDescription,
          category: editCategory,
          language: editLanguage
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      const questionRes = await axios.get(`${config.API_URL}/api/questions/${id}`);
      setQuestion(questionRes.data);
      setIsEditing(false);
      showSuccess('Question updated successfully!');
    } catch (error) {
      console.error('Error updating question:', error);
      if (error.response?.status === 403) {
        showError('You can only edit your own questions');
      } else {
        showError('Failed to update question');
      }
    }
  };

  const deleteQuestion = async () => {
    if (!window.confirm('Are you sure you want to delete this question? This will also delete all answers.')) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      showError('Please login first!');
      return;
    }

    try {
      await axios.delete(
        `${config.API_URL}/api/questions/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      showSuccess('Question deleted successfully!');
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting question:', error);
      if (error.response?.status === 403) {
        showError('You can only delete your own questions');
      } else {
        showError('Failed to delete question');
      }
    }
  };

  const startEditAnswer = (answer) => {
    setEditingAnswerId(answer._id);
    setEditAnswerContent(answer.content);
  };

  const cancelEditAnswer = () => {
    setEditingAnswerId(null);
    setEditAnswerContent('');
  };

  const saveEditAnswer = async (answerId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      showError('Please login first!');
      return;
    }

    try {
      await axios.put(
        `${config.API_URL}/api/answers/${answerId}`,
        { content: editAnswerContent },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      const answersRes = await axios.get(`${config.API_URL}/api/answers/question/${id}`);
      setAnswers(answersRes.data);
      setEditingAnswerId(null);
      setEditAnswerContent('');
      showSuccess('Answer updated successfully!');
    } catch (error) {
      console.error('Error updating answer:', error);
      if (error.response?.status === 403) {
        showError('You can only edit your own answers');
      } else {
        showError('Failed to update answer');
      }
    }
  };

  const deleteAnswer = async (answerId) => {
    if (!window.confirm('Are you sure you want to delete this answer?')) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      showError('Please login first!');
      return;
    }

    try {
      await axios.delete(
        `${config.API_URL}/api/answers/${answerId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      const answersRes = await axios.get(`${config.API_URL}/api/answers/question/${id}`);
      setAnswers(answersRes.data);
      showSuccess('Answer deleted successfully!');
    } catch (error) {
      console.error('Error deleting answer:', error);
      if (error.response?.status === 403) {
        showError('You can only delete your own answers');
      } else {
        showError('Failed to delete answer');
      }
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      showError('Please login first!');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
      return;
    }

    setPosting(true);
    try {
      await axios.post(
        `${config.API_URL}/api/answers/${id}`,
        { content: newAnswer },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setNewAnswer('');
      
      const answersRes = await axios.get(`${config.API_URL}/api/answers/question/${id}`);
      setAnswers(answersRes.data);
      
      showSuccess('Answer posted successfully!');
    } catch (error) {
      console.error('Error posting answer:', error);
      
      if (error.response?.status === 401) {
        showError('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      } else {
        showError('Failed to post answer. Please try again.');
      }
    }
    setPosting(false);
  };

  if (loading) {
    return <div className="spinner">Loading...</div>;
  }

  if (!question) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h3>Question not found</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="details-container">
      {/* Question Card */}
      <div className="question-card fade-in">
        {isEditing ? (
          // Edit Mode
          <div>
            <h2 className="form-title">✏️ Edit Question</h2>
            
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                className="form-control"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label>Description:</label>
              <textarea
                className="form-control"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows="5"
              />
            </div>
            
            <div className="form-group">
              <label>Category:</label>
              <select
                className="form-control"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Language:</label>
              <select
                className="form-control"
                value={editLanguage}
                onChange={(e) => setEditLanguage(e.target.value)}
              >
                <option value="English">English</option>
                <option value="Amharic">Amharic</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={saveEdit} className="btn btn-primary">
                Save Changes
              </button>
              <button onClick={cancelEditing} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          // View Mode
          <>
            <h1 className="question-title">{question.title}</h1>
            <p className="question-body">{question.description}</p>
            <div className="question-meta">
              <span>📁 {question.category}</span>
              <span>🗣️ {question.language}</span>
              <span>👤 
                <strong 
                  style={{ cursor: 'pointer', color: '#667eea', marginLeft: '5px' }}
                  onClick={() => window.location.href = `/profile/${question.user?._id}`}
                >
                  {question.user?.name}
                </strong>
              </span>
              <span>📅 {new Date(question.createdAt).toLocaleDateString()}</span>
            </div>
            
            {isOwner() && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button onClick={startEditing} className="btn btn-secondary">
                  ✏️ Edit Question
                </button>
                <button onClick={deleteQuestion} style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}>
                  🗑️ Delete Question
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Answer Form */}
      <div className="answer-form fade-in">
        <h4>📝 Post Your Answer</h4>
        <form onSubmit={handleSubmitAnswer}>
          <textarea
            className="form-control"
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Write your answer here..."
            required
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={posting}
            style={{ marginTop: '15px' }}
          >
            {posting ? 'Posting...' : 'Post Answer'}
          </button>
        </form>
      </div>

      {/* Answers Section */}
      <div className="answers-section fade-in">
        <h3>💬 Answers ({answers.length})</h3>
        
        {answers.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
            No answers yet. Be the first to answer!
          </p>
        ) : (
          answers.map((answer) => (
            <div key={answer._id} className="answer-card">
              {editingAnswerId === answer._id ? (
                <div>
                  <textarea
                    className="form-control"
                    value={editAnswerContent}
                    onChange={(e) => setEditAnswerContent(e.target.value)}
                    rows="3"
                    style={{ marginBottom: '10px' }}
                  />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => saveEditAnswer(answer._id)}
                      className="btn btn-primary"
                      style={{ padding: '5px 15px', fontSize: '14px' }}
                    >
                      Save
                    </button>
                    <button 
                      onClick={cancelEditAnswer}
                      className="btn btn-secondary"
                      style={{ padding: '5px 15px', fontSize: '14px' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="answer-content">{answer.content}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="answer-meta">
                      <span>Answered by: 
                        <strong 
                          style={{ cursor: 'pointer', color: '#667eea', marginLeft: '5px' }}
                          onClick={() => window.location.href = `/profile/${answer.user?._id}`}
                        >
                          {answer.user?.name}
                        </strong>
                      </span>
                      <span>•</span>
                      <span>{new Date(answer.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    {isAnswerOwner(answer) && (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          onClick={() => startEditAnswer(answer)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#667eea',
                            cursor: 'pointer',
                            fontSize: '14px',
                            textDecoration: 'underline'
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => deleteAnswer(answer._id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#dc3545',
                            cursor: 'pointer',
                            fontSize: '14px',
                            textDecoration: 'underline'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default QuestionDetails;