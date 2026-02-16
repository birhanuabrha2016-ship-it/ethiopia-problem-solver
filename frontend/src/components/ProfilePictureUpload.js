import React, { useState } from 'react';
import axios from 'axios';
import { showSuccess, showError } from '../utils/toast';

function ProfilePictureUpload({ currentUser, onUpdate }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showError('Please select a file first');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      showError('Please login first');
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', selectedFile);

    setUploading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/upload/profile-picture',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      showSuccess('Profile picture updated!');
      localStorage.setItem('user', JSON.stringify(response.data.user));
      if (onUpdate) onUpdate(response.data.user);
      setSelectedFile(null);
    } catch (error) {
      showError(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <div style={{
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        margin: '0 auto 15px',
        overflow: 'hidden',
        border: '3px solid #667eea',
        position: 'relative',
        cursor: 'pointer'
      }}>
        <img 
          src={preview || currentUser?.profilePicture || `https://ui-avatars.com/api/?name=${currentUser?.name}&background=667eea&color=fff&size=150`}
          alt="Profile"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>

      <input
        type="file"
        id="profile-upload"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button
          className="btn btn-secondary"
          onClick={() => document.getElementById('profile-upload').click()}
        >
          Choose Photo
        </button>
        
        {selectedFile && (
          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        )}
      </div>
    </div>
  );
}

export default ProfilePictureUpload;