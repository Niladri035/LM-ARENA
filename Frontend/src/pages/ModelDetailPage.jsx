import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Zap, Shield, Cpu, Activity, Info } from 'lucide-react';

const ModelDetailPage = () => {
  const { id } = useParams();
  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchModel = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/models/${id}`);
        setModel(res.data);
      } catch (err) {
        console.error("Failed to fetch model details:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchModel();
  }, [id]);

  if (isLoading) return (
    <div className="app-container" style={{ paddingTop: '10rem', textAlign: 'center' }}>
      <div className="text-gradient" style={{ fontSize: '1.5rem' }}>Analyzing neural performance...</div>
    </div>
  );

  if (!model) return (
    <div className="app-container" style={{ paddingTop: '10rem', textAlign: 'center' }}>
      <h1 className="text-gradient">Model Not Found</h1>
      <Link to="/models" className="btn-primary" style={{ marginTop: '2rem' }}>Back to Directory</Link>
    </div>
  );

  return (
    <div className="app-container" style={{ paddingTop: '8rem', paddingBottom: '8rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        <Link to="/models" className="nav-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          <ArrowLeft size={18} /> Back to Directory
        </Link>

        {/* Hero Section */}
        <div className="glass-panel" style={{ padding: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <div className="glass-pill" style={{ marginBottom: '1rem', background: 'rgba(206, 66, 87, 0.1)', color: 'var(--battle-500)' }}>
              {model.type}
            </div>
            <h1 className="header-title" style={{ margin: '0 0 1rem', fontSize: '3.5rem' }}>{model.name}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '500px' }}>{model.desc}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="text-gradient" style={{ fontSize: '4rem', fontWeight: 800 }}>{model.elo}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>ELO SCORE</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <Activity className="text-gradient" size={24} style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>Win Rate</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{model.winRate}%</div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(174, 195, 176, 0.1)', borderRadius: '3px', marginTop: '1rem' }}>
               <div style={{ width: `${model.winRate}%`, height: '100%', background: 'var(--battle-500)', borderRadius: '3px', boxShadow: '0 0 10px rgba(206, 66, 87, 0.5)' }}></div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <Zap className="text-gradient" size={24} style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>Total Battles</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{model.totalBattles}</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Battles fought since launch</p>
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <Shield className="text-gradient" size={24} style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>Status</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
               <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#4ade80' }}></div>
               <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>Operational</div>
            </div>
          </div>
        </div>

        {/* Detailed Info Card */}
        <div className="glass-panel" style={{ padding: '3rem' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <Info className="text-gradient" size={24} />
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Technical Specifications</h2>
           </div>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
              <div>
                 <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Provider</span>
                 <p style={{ margin: '0.5rem 0', fontWeight: 600 }}>{model.id === 'mistral' ? 'Mistral AI' : model.id === 'cohere' ? 'Cohere' : 'Google Cloud'}</p>
              </div>
              <div>
                 <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Latency</span>
                 <p style={{ margin: '0.5rem 0', fontWeight: 600 }}>~450ms / token</p>
              </div>
              <div>
                 <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Context Window</span>
                 <p style={{ margin: '0.5rem 0', fontWeight: 600 }}>128k Tokens</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ModelDetailPage;
