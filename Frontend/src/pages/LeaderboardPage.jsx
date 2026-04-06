import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Leaderboard from '../components/Leaderboard';

const LeaderboardPage = ({ data: initialData }) => {
  const [data, setData] = useState(initialData || []);
  const [isLoading, setIsLoading] = useState(!initialData);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/leaderboard');
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="app-container" style={{ paddingTop: '8rem' }}>
      <div className="section-header">
        <h1 className="text-gradient-battle" style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '2rem' }}>Global Rankings</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 4rem' }}>
          Explore the performance of world-class LLMs. Our rankings are updated in real-time based on battle outcomes.
        </p>
      </div>
      
      {isLoading ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Calculating standings...</div>
      ) : (
        <Leaderboard data={data} />
      )}
    </div>
  );
};

export default LeaderboardPage;
