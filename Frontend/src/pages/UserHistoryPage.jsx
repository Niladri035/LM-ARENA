import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { History, ArrowRight, Bot, Zap, Clock } from 'lucide-react';

const UserHistoryPage = ({ user }) => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && user.id) {
      const fetchHistory = async () => {
        try {
          const res = await axios.get(`http://localhost:3000/api/history/user/${user.id}`);
          setHistory(res.data);
        } catch (err) {
          console.error("Failed to fetch personal history:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchHistory();
    }
  }, [user]);

  if (!user) return (
    <div className="app-container" style={{ paddingTop: '10rem', textAlign: 'center' }}>
      <h1 className="text-gradient">Please Log In</h1>
      <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>You need to be authenticated to view your battle history.</p>
    </div>
  );

  return (
    <div className="app-container" style={{ paddingTop: '8rem', paddingBottom: '8rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        
        {/* Profile Header */}
        <div className="glass-panel" style={{ padding: '3rem', marginBottom: '4rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
           <div style={{ 
             width: '80px', height: '80px', borderRadius: '50%', background: 'var(--battle-500)', 
             display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800
           }}>
             {user.name.charAt(0).toUpperCase()}
           </div>
           <div>
             <h1 style={{ margin: 0 }}>Welcome, {user.name}</h1>
             <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Explorer • {user.tier} Tier</p>
           </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <History className="text-gradient" size={28} />
          <h2 style={{ margin: 0 }}>My Battle History</h2>
        </div>

        {isLoading ? (
          <p style={{ color: 'var(--text-muted)' }}>Retrieving your logs...</p>
        ) : history.length === 0 ? (
          <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
             <Bot size={48} style={{ color: 'rgba(174, 195, 176, 0.2)', marginBottom: '1.5rem' }} />
             <h3>No Battles Yet</h3>
             <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Your personal battle logs will appear here once you initiate an arena fight.</p>
             <Link to="/" className="btn-primary">Start First Battle</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {history.map((battle) => (
              <div key={battle._id} className="glass-panel history-item" style={{ 
                padding: '1.5rem', 
                display: 'grid', 
                gridTemplateColumns: '1fr auto',
                alignItems: 'center',
                transition: 'all 0.3s ease'
              }}>
                <div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <Clock size={14} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(battle.createdAt).toLocaleString()}</span>
                   </div>
                   <p style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 1rem' }}>"{battle.promptText}"</p>
                   {battle.results?.judge && (
                     <div style={{ display: 'flex', gap: '1rem' }}>
                       <span className="glass-pill" style={{ fontSize: '0.7rem' }}>
                         Mistral: {battle.results.judge.solution_1_score}
                       </span>
                       <span className="glass-pill" style={{ fontSize: '0.7rem' }}>
                         Cohere: {battle.results.judge.solution_2_score}
                       </span>
                     </div>
                   )}
                </div>
                <div style={{ textAlign: 'right' }}>
                   <div style={{ 
                     padding: '0.5rem 1rem', borderRadius: '12px', background: 'rgba(174, 195, 176, 0.05)',
                     border: '1px solid rgba(174, 195, 176, 0.1)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem'
                   }}>
                      <Zap size={14} color="var(--battle-500)" />
                      <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>VERIFIED</span>
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

export default UserHistoryPage;
