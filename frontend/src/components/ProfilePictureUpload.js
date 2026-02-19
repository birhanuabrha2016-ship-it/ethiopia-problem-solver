import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { showSuccess, showError } from '../utils/toast';
import config from '../config';

function ProfilePictureUpload({ currentUser, onUpdate }) {
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [widget, setWidget] = useState(null);

  useEffect(() => {
    // Initialize Cloudinary widget when component mounts
    if (window.cloudinary) {
      const uploadWidget = window.cloudinary.createUploadWidget(
        {
          cloudName: 'dvhoqzacn', // Your cloud name
          uploadPreset: 'profile_pictures', // Your upload preset
          sources: ['local', 'camera'],
          multiple: false,
          maxFileSize: 5000000, // 5MB limit
          clientAllowedFormats: ['image'],
          cropping: true,
          croppingAspectRatio: 1,
          showSkipCropButton: false,
          folder: 'profiles'
        },
        async (error, result) => {
          if (!error && result && result.event === 'success') {
            // Get the uploaded image URL
            const imageUrl = result.info.secure_url;
            
            // Show preview
            setPreview(imageUrl);
            
            // Send the URL to your backend
            await updateUserProfile(imageUrl);
          } else if (error) {
            showError('Upload failed: ' + error);
          }
        }
      );
      setWidget(uploadWidget);
    }
  }, []);

  const handleUpload = () => {
    if (widget) {
      widget.open();
    } else {
      showError('Cloudinary widget not loaded. Please refresh the page.');
    }
  };

  const updateUserProfile = async (imageUrl) => {
    const token = localStorage.getItem('token');
    if (!token) {
      showError('Please login first');
      return;
    }

    setUploading(true);
    try {
      const response = await axios.post(
        `${config.API_URL}/api/upload/profile-picture`,
        { profilePicture: imageUrl },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Update user in localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));
      if (onUpdate) onUpdate(response.data.user);
      showSuccess('Profile picture updated successfully!');
    } catch (error) {
      showError('Failed to update profile');
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

      <button
        className="btn btn-primary"
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? 'Updating...' : 'Change Profile Photo'}
      </button>
    </div>
  );
}

export default ProfilePictureUpload;
