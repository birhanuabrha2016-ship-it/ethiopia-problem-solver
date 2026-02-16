import React from 'react';

function Footer() {
  return (
    <footer style={{
      backgroundColor: '#333',
      color: 'white',
      padding: '30px 0',
      marginTop: '50px'
    }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: '10px' }}>
          🇪🇹 Ethiopia Problem Solver - Created by Birhanu Abrha
        </p>
        <p style={{ marginBottom: '10px' }}>
          📧 birhanuabrha2016@gmail.com | 📱 +251 942 780 234
        </p>
        <p style={{ fontSize: '14px', color: '#888' }}>
          © 2026 All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;