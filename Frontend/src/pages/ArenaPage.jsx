import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import PromptConsole from '../components/PromptConsole';
import BattleArena from '../components/BattleArena';
import Leaderboard from '../components/Leaderboard';

const ArenaPage = ({ 
  onBattle, 
  isLoading, 
  results, 
  showArena 
}) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/leaderboard');
        setLeaderboardData(res.data);
      } catch (err) {
        console.error("Failed to sync leaderboard:", err);
      }
    };
    fetchLeaderboard();
  }, [results]); // Re-fetch when results change (battle completed)

  return (
    <div className="app-container" style={{ paddingTop: '5rem' }}>
      <Header onSuggestionClick={(text) => setPrompt(text)} />
      
      <PromptConsole 
        onBattle={onBattle} 
        isLoading={isLoading} 
        prompt={prompt}
        setPrompt={setPrompt}
      />
      
      <div className="arena-mount-point">
        <BattleArena results={results} isVisible={showArena || isLoading} />
      </div>

      <Leaderboard data={leaderboardData} />
    </div>
  );
};

export default ArenaPage;
