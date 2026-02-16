import React from 'react';

function About() {
  return (
    <div className="container" style={{ maxWidth: '800px', margin: '40px auto' }}>
      <div className="question-card fade-in" style={{ padding: '40px' }}>
        <h1 style={{ 
          textAlign: 'center', 
          color: '#333',
          marginBottom: '30px',
          fontSize: '2.5rem'
        }}>
          🌍 About Ethiopia Problem Solver
        </h1>

        <div style={{ 
          width: '100%',
          height: '4px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          marginBottom: '30px'
        }} />

        {/* Creator Information */}
        <div style={{
          backgroundColor: '#e8f4fd',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h2 style={{ color: '#333', marginBottom: '10px' }}>👤 Created by Birhanu Abrha</h2>
          <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '5px' }}>
            📧 birhanuabrha2016@gmail.com
          </p>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            📱 +251 942 780 234
          </p>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#667eea', marginBottom: '15px' }}>Our Mission</h2>
          <p style={{ 
            fontSize: '1.1rem', 
            lineHeight: '1.8', 
            color: '#555',
            marginBottom: '20px'
          }}>
            Ethiopia Problem Solver is a community-driven platform dedicated to helping Ethiopians 
            find solutions to their everyday problems. Whether you're looking for job opportunities, 
            farming advice, business guidance, or educational resources, our community is here to help.
          </p>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#667eea', marginBottom: '15px' }}>What We Offer</h2>
          <ul style={{ 
            listStyle: 'none',
            padding: 0
          }}>
            {[
              { icon: '💼', title: 'Jobs', desc: 'Find job opportunities and career advice' },
              { icon: '🌾', title: 'Agriculture', desc: 'Get farming tips and agricultural expertise' },
              { icon: '📚', title: 'Education', desc: 'Access educational resources and guidance' },
              { icon: '🏪', title: 'Small Business', desc: 'Learn how to start and grow your business' },
              { icon: '💻', title: 'Technology', desc: 'Get tech support and learning resources' },
              { icon: '🏥', title: 'Health Info', desc: 'Find health information and advice' }
            ].map((item, index) => (
              <li key={index} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '15px',
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '10px',
                marginBottom: '10px'
              }}>
                <span style={{ fontSize: '2rem' }}>{item.icon}</span>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>{item.title}</h3>
                  <p style={{ margin: 0, color: '#666' }}>{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#667eea', marginBottom: '15px' }}>Our Vision</h2>
          <p style={{ 
            fontSize: '1.1rem', 
            lineHeight: '1.8', 
            color: '#555'
          }}>
            We envision an Ethiopia where every problem has a solution, and every question finds an answer. 
            By connecting people with knowledge and experience, we're building a stronger, more informed 
            community across the nation.
          </p>
        </div>

        <div style={{
          backgroundColor: '#f0f8ff',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#333', marginBottom: '10px' }}>Join Our Community</h3>
          <p style={{ color: '#666', marginBottom: '15px' }}>
            Created by <strong>Birhanu Abrha</strong> • 📧 birhanuabrha2016@gmail.com • 📱 +251 942 780 234
          </p>
          <p style={{ color: '#666', marginBottom: '15px' }}>
            Thousands of Ethiopians are already helping each other. Be part of the solution!
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = '/register'}
            style={{ width: 'auto', padding: '12px 30px' }}
          >
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
}

export default About;