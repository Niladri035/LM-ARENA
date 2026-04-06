import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

const ModelsPage = () => {
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/models');
        setModels(res.data);
      } catch (err) {
        console.error("Failed to fetch models:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchModels();
  }, []);

  const filteredModels = models.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-container" style={{ paddingTop: '8rem', paddingBottom: '8rem' }}>
       <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 className="text-gradient" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Model Directory</h1>
          <p style={{ color: 'var(--text-muted)' }}>Explore and compare the technical specifications of our supported LLMs.</p>
       </div>

       {/* Search Bar */}
       <div className="glass-panel" style={{ 
         maxWidth: '600px', margin: '0 auto 4rem', padding: '0.5rem 1.5rem', 
         display: 'flex', alignItems: 'center', gap: '1rem' 
       }}>
          <Search size={20} style={{ color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="auth-input" 
            placeholder="Search by name or capability..." 
            style={{ border: 'none', background: 'transparent', width: '100%', padding: '0.75rem 0' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
       </div>
       
       {isLoading ? (
         <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Updating directory...</div>
       ) : (
         <div className="models-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
           {filteredModels.length > 0 ? filteredModels.map(m => (
             <div key={m.id} className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{m.name}</h3>
                  <span className="glass-pill" style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--battle-400)' }}>{m.status}</span>
               </div>
               <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem', flex: 1, lineHeight: '1.6' }}>{m.desc}</p>
               <Link to={`/models/${m.id}`} className="btn-primary" style={{ width: '100%', fontSize: '0.85rem', display: 'flex', justifyContent: 'center', textDecoration: 'none' }}>
                 View Technical Details
               </Link>
             </div>
           )) : (
             <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                <h3>No models found for "{searchQuery}"</h3>
                <p>Try a different keyword or browse our full collection.</p>
             </div>
           )}
         </div>
       )}
    </div>
  );
};

export default ModelsPage;
