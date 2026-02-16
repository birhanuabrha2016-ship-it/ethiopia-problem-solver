import React from 'react';

function LoadingSkeleton() {
  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ color: 'white', marginBottom: '20px' }}>📋 Loading Questions...</h2>
      
      {[1, 2, 3].map((n) => (
        <div 
          key={n}
          className="card"
          style={{
            padding: '20px',
            marginBottom: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          {/* Title skeleton */}
          <div style={{ 
            height: '28px', 
            width: '70%', 
            background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: '4px',
            marginBottom: '15px'
          }} />
          
          {/* Description line 1 skeleton */}
          <div style={{ 
            height: '16px', 
            width: '100%', 
            background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: '4px',
            marginBottom: '10px'
          }} />
          
          {/* Description line 2 skeleton */}
          <div style={{ 
            height: '16px', 
            width: '90%', 
            background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: '4px',
            marginBottom: '15px'
          }} />
          
          {/* Meta info skeleton */}
          <div style={{ 
            display: 'flex',
            gap: '15px',
            marginTop: '15px',
            paddingTop: '15px',
            borderTop: '1px solid #eee'
          }}>
            <div style={{ 
              height: '14px', 
              width: '100px', 
              background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              borderRadius: '4px'
            }} />
            <div style={{ 
              height: '14px', 
              width: '100px', 
              background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              borderRadius: '4px'
            }} />
            <div style={{ 
              height: '14px', 
              width: '100px', 
              background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              borderRadius: '4px'
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;