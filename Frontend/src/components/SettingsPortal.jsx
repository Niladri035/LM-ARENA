import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Shield, User, Bell, Palette, Globe, Save } from 'lucide-react';
import './Portal.css'; 

const SettingsPortal = ({ isOpen, onClose, user, onUpdateSuccess }) => {
  const [activeTab, setActiveTab] = useState('account');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const response = await axios.post('http://localhost:3000/api/auth/update', {
        id: user.id,
        name,
        email
      });
      
      const updatedUser = response.data.user;
      localStorage.setItem('arena_user', JSON.stringify(updatedUser));
      onUpdateSuccess(updatedUser);
      setMessage({ type: 'success', text: 'Settings updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`portal-overlay ${isOpen ? 'open' : ''}`}>
      <div className="portal-modal" style={{ maxWidth: '800px', height: '80vh', display: 'flex', flexDirection: 'row' }}>
        
        {/* Sidebar */}
        <div style={{ width: '240px', borderRight: '1px solid rgba(174, 195, 176, 0.1)', padding: '2.5rem 1.25rem', background: 'rgba(1, 22, 30, 0.2)' }}>
           <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '2.5rem', letterSpacing: '0.02em' }}>Settings</h2>
           <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button 
                onClick={() => setActiveTab('account')} 
                className={`glass-pill ${activeTab === 'account' ? 'active' : ''}`}
                style={{ justifyContent: 'flex-start', padding: '0.85rem 1.25rem', width: '100%', border: 'none', cursor: 'pointer' }}
              >
                <User size={18} style={{ marginRight: '12px' }} /> Account
              </button>
              <button 
                onClick={() => setActiveTab('security')} 
                className={`glass-pill ${activeTab === 'security' ? 'active' : ''}`}
                style={{ justifyContent: 'flex-start', padding: '0.85rem 1.25rem', width: '100%', border: 'none', cursor: 'pointer' }}
              >
                <Shield size={18} style={{ marginRight: '12px' }} /> Security
              </button>
              <button 
                onClick={() => setActiveTab('appearance')} 
                className={`glass-pill ${activeTab === 'appearance' ? 'active' : ''}`}
                style={{ justifyContent: 'flex-start', padding: '0.85rem 1.25rem', width: '100%', border: 'none', cursor: 'pointer' }}
              >
                <Palette size={18} style={{ marginRight: '12px' }} /> Appearance
              </button>
              <button 
                onClick={() => setActiveTab('notifications')} 
                className={`glass-pill ${activeTab === 'notifications' ? 'active' : ''}`}
                style={{ justifyContent: 'flex-start', padding: '0.85rem 1.25rem', width: '100%', border: 'none', cursor: 'pointer' }}
              >
                <Bell size={18} style={{ marginRight: '12px' }} /> Notifications
              </button>
           </nav>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, padding: '3.5rem', position: 'relative', overflowY: 'auto' }}>
          <button className="portal-close-btn" onClick={onClose}>
            <X size={24} />
          </button>

          {activeTab === 'account' && (
            <div className="fade-in">
              <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2.5rem' }}>Public Profile</h1>
              
              {message && (
                <div style={{ padding: '1rem', borderRadius: '12px', marginBottom: '2rem', background: message.type === 'success' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: message.type === 'success' ? '#4ade80' : '#ef4444' }}>
                   {message.text}
                </div>
              )}

              <div style={{ marginBottom: '2rem' }}>
                 <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label>
                 <input 
                   type="text" 
                   className="portal-input" 
                   style={{ paddingLeft: '1rem' }}
                   value={name} 
                   onChange={(e) => setName(e.target.value)} 
                 />
              </div>
              <div style={{ marginBottom: '2rem' }}>
                 <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
                 <input 
                   type="email" 
                   className="portal-input" 
                   style={{ paddingLeft: '1rem' }}
                   value={email} 
                   onChange={(e) => setEmail(e.target.value)} 
                 />
              </div>
              <div style={{ marginBottom: '2rem' }}>
                 <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User Tier</label>
                 <div className="glass-pill" style={{ display: 'inline-flex', padding: '0.6rem 1.5rem', background: 'rgba(206, 66, 87, 0.15)', color: 'var(--battle-400)', fontWeight: 600 }}>
                    {user?.tier || 'Explorer'}
                 </div>
              </div>
              
              <button 
                className={`portal-btn btn-primary ${isSaving ? 'loading' : ''}`} 
                onClick={handleSave}
                disabled={isSaving}
                style={{ marginTop: '2.5rem', maxWidth: '200px' }}
              >
                <Save size={18} /> {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}

          {activeTab !== 'account' && (
            <div style={{ textAlign: 'center', paddingTop: '6rem', color: 'var(--text-muted)' }}>
               <Globe size={64} style={{ marginBottom: '2rem', opacity: 0.15 }} />
               <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '1rem' }}>Premium Intelligence</h3>
               <p style={{ maxWidth: '400px', margin: '0 auto', lineHeight: '1.6' }}>This setting module is currently in development. Upgrade your tier to v2.0 for early access to advanced model personalization.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPortal;
