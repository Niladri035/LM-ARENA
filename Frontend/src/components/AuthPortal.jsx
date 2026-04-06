import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import gsap from 'gsap';
import { X, Mail, Lock, User, Bot, ArrowRight, Loader2 } from 'lucide-react';
import './Portal.css';

const AuthPortal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const modalRef = useRef();
  const contentRef = useRef();

  useEffect(() => {
    if (isOpen) {
      setError('');
      gsap.to(modalRef.current, { opacity: 1, visibility: 'visible', duration: 0.4 });
      gsap.fromTo(contentRef.current, { scale: 0.8, opacity: 0, y: 50 }, { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' });
    } else {
      gsap.to(modalRef.current, { opacity: 0, visibility: 'hidden', duration: 0.3 });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await axios.post(`http://localhost:3000${endpoint}`, formData);
      
      if (response.data.token) {
        localStorage.setItem('arena_token', response.data.token);
        localStorage.setItem('arena_user', JSON.stringify(response.data.user));
        onAuthSuccess(response.data.user);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`portal-overlay ${isOpen ? 'open' : ''}`} ref={modalRef}>
      <div className="portal-modal auth-card" ref={contentRef} style={{ maxWidth: '400px', padding: '3rem' }}>
        <button className="portal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(206, 66, 87, 0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'
          }}>
            <Bot size={32} color="var(--battle-500)" />
          </div>
          <h2 className="text-gradient" style={{ fontSize: '2rem', fontWeight: 800 }}>{isLogin ? 'Welcome Back' : 'Join the Arena'}</h2>
          {error && <p style={{ color: '#ff4d4d', fontSize: '0.85rem', marginTop: '0.5rem' }}>{error}</p>}
        </div>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="portal-input-group">
              <User size={18} className="portal-input-icon" />
              <input 
                type="text" 
                name="name"
                className="portal-input"
                placeholder="Full Name" 
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="portal-input-group">
            <Mail size={18} className="portal-input-icon" />
            <input 
              type="email" 
              name="email"
              className="portal-input"
              placeholder="Email Address" 
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="portal-input-group">
            <Lock size={18} className="portal-input-icon" />
            <input 
              type="password" 
              name="password"
              className="portal-input"
              placeholder="Password" 
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button 
            type="submit"
            className="portal-btn btn-primary" 
            disabled={isLoading}
            style={{ marginTop: '0.75rem' }}
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : (isLogin ? 'Sign In' : 'Create Account')}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button onClick={() => setIsLogin(!isLogin)} style={{
            background: 'transparent', color: 'var(--battle-500)', fontWeight: 600, cursor: 'pointer'
          }}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPortal;
