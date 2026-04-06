import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { History, Zap, MessageSquare } from 'lucide-react';

const AboutPage = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/history');
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="app-container" style={{ paddingTop: '8rem', paddingBottom: '8rem' }}>
       {/* Main About Section */}
       <div className="glass-panel" style={{ padding: '4rem', maxWidth: '900px', margin: '0 auto 4rem', textAlign: 'center' }}>
          <h1 className="text-gradient-battle" style={{ marginBottom: '2rem', fontSize: '3.5rem' }}>The Arena of Intelligence</h1>
          <p style={{ lineHeight: '1.8', color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
            LM Arena is the world's premier benchmarking platform where AI models compete in high-stakes linguistic battles. 
            By pitting state-of-the-art LLMs against each other under identical conditions, we provide the most objective, 
            human-verified rankings of AI performance across the globe.
          </p>
          <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
             <div className="glass-pill"><Zap size={14} style={{ marginRight: '8px' }} /> Powered by LangGraph</div>
             <div className="glass-pill"><MessageSquare size={14} style={{ marginRight: '8px' }} /> 100% Dynamic</div>
          </div>
       </div>

       {/* Recent Activity Section */}
       <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
             <History className="text-gradient" size={28} />
             <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Recent Community Battles</h2>
          </div>

          {isLoading ? (
            <p style={{ color: 'var(--text-muted)' }}>Synchronizing battle logs...</p>
          ) : history.length === 0 ? (
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No battles have been fought yet. Be the first to initiate one!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {history.map((battle) => (
                <div key={battle._id} className="glass-panel" style={{ 
                  padding: '1.5rem', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  background: 'rgba(174, 195, 176, 0.03)',
                  border: '1px solid rgba(174, 195, 176, 0.1)'
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 0.5rem', fontWeight: 600, fontSize: '1rem' }}>
                      "{battle.promptText.length > 80 ? battle.promptText.substring(0, 80) + '...' : battle.promptText}"
                    </p>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <span>By: <strong style={{ color: 'var(--text-main)' }}>{battle.userId?.name || 'Anonymous'}</strong></span>
                      <span>Date: {new Date(battle.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div style={{ marginLeft: '2rem' }}>
                    <div className="glass-pill" style={{ fontSize: '0.7rem', padding: '0.4rem 0.8rem', background: 'rgba(206, 66, 87, 0.1)', color: 'var(--battle-400)' }}>
                      Battle Verified
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
       </div>
    </div>
  );
};

export default AboutPage;
