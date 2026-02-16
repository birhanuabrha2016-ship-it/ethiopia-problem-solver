import React from 'react';

function Navbar({ token, setToken }) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (setToken) setToken(null);
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <a href="/" className="navbar-brand">
        🇪🇹 Ethiopia Problem Solver
      </a>
      <div className="navbar-links">
        <a href="/">Home</a>
        <a href="/ask">Ask Question</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        
        {token ? (
          <>
            <a href={`/profile/${JSON.parse(localStorage.getItem('user'))?._id}`}>
              <span className="logged-in-badge">👤 My Profile</span>
            </a>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <a href="/login">Login</a>
            <a href="/register">Register</a>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;