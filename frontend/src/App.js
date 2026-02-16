import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import QuestionList from './components/QuestionList';
import QuestionDetails from './components/QuestionDetails';
import Login from './components/Login';
import Register from './components/Register';
import AskQuestion from './components/AskQuestion';
import UserProfile from './components/UserProfile';
import About from './components/About';
import Contact from './components/Contact';
import VerifyEmail from './components/VerifyEmail';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import ErrorBoundary from './components/ErrorBoundary';
import Footer from './components/Footer';
function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar token={token} setToken={setToken} />
        <Toaster 
          position="top-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '8px',
              background: '#333',
              color: '#fff',
            },
          }}
        />
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<QuestionList />} />
            <Route path="/question/:id" element={<QuestionDetails />} />
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/ask" element={<AskQuestion />} />
            <Route path="/profile/:userId" element={<UserProfile />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
        </ErrorBoundary>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;