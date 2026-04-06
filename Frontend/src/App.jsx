import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Background from './components/Background';
import Navbar from './components/Navbar';
import FlickerLoader from './components/FlickerLoader';
import AuthPortal from './components/AuthPortal';
import SettingsPortal from './components/SettingsPortal';

// Pages
import ArenaPage from './pages/ArenaPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ModelsPage from './pages/ModelsPage';
import AboutPage from './pages/AboutPage';
import ModelDetailPage from './pages/ModelDetailPage';
import UserHistoryPage from './pages/UserHistoryPage';

import './App.css';

function App() {
  const [showInitialLoader, setShowInitialLoader] = useState(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('arena_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [showArena, setShowArena] = useState(false);
  
  // 0.0 = Calm Teal, 1.0 = Battle Red
  const [bgIntensity, setBgIntensity] = useState(0.0);

  const handleBattle = async (promptText) => {
    setIsLoading(true);
    setBgIntensity(0.5);
    setShowArena(true);
    setResults(null);
    
    try {
      const response = await axios.post('http://localhost:3000/invoke', {
        input: promptText
      });
      
      const resData = response.data.result;
      setResults(resData);
      setBgIntensity(1.0);

      // Persist battle results to the database if user is logged in
      if (user && user.id) {
        try {
          await axios.post('http://localhost:3000/api/save-battle', {
            userId: user.id,
            promptText: promptText,
            results: resData
          });
        } catch (saveErr) {
          console.error("Failed to persist battle to cloud:", saveErr);
        }
      }
      
    } catch (error) {
      console.error("Battle failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('arena_token');
    localStorage.removeItem('arena_user');
    setUser(null);
  };

  return (
    <Router>
      <div className="app-root">
        {showInitialLoader && <FlickerLoader onComplete={() => setShowInitialLoader(false)} />}
        
        <AuthPortal 
          isOpen={isAuthOpen} 
          onClose={() => setIsAuthOpen(false)} 
          onAuthSuccess={(userData) => setUser(userData)}
        />

        <SettingsPortal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
          user={user}
          onUpdateSuccess={(userData) => setUser(userData)}
        />
        
        <Navbar 
          onLoginClick={() => setIsAuthOpen(true)} 
          onSettingsClick={() => setIsSettingsOpen(true)}
          user={user} 
          onLogout={handleLogout}
        />
        <Background intensity={bgIntensity} />
        
        <Routes>
          <Route path="/" element={
            <ArenaPage 
              onBattle={handleBattle}
              isLoading={isLoading}
              results={results}
              showArena={showArena}
            />
          } />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/models" element={<ModelsPage />} />
          <Route path="/models/:id" element={<ModelDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/history" element={<UserHistoryPage user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
