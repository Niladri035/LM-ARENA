import React from 'react';
import { 
    MessageSquarePlus, 
    Search, 
    Award, 
    Cpu, 
    BarChart2, 
    Key, 
    Bot, 
    Compass, 
    LayoutDashboard 
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ onNewBattle }) => {
  return (
    <div className="sidebar">
      {/* Top Section */}
      <div className="sidebar-top">
        <div className="sidebar-header">
           <div className="brand">
              <Bot size={24} className="brand-icon" />
              <span>Battle Arena</span>
           </div>
           <button className="collapse-btn">
              <LayoutDashboard size={20} />
           </button>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item new-battle" onClick={onNewBattle}>
            <MessageSquarePlus size={18} />
            <span>New Battle</span>
          </button>
          
          <button className="nav-item">
            <Search size={18} />
            <span>Search Battles</span>
          </button>

          <div className="nav-group">
            <button className="nav-item">
              <Award size={18} />
              <span>Leaderboard</span>
            </button>
            <button className="nav-item">
              <Cpu size={18} />
              <span>Models</span>
            </button>
            <button className="nav-item">
              <BarChart2 size={18} />
              <span>Arena Stats</span>
            </button>
            <button className="nav-item">
              <Key size={18} />
              <span>API Keys</span>
            </button>
          </div>

          <div className="nav-section-title">Models</div>
          <div className="nav-group">
             <button className="nav-item">
                <div className="avatar-icon mistral">M</div>
                <span>Mistral 7B</span>
             </button>
             <button className="nav-item">
                <Compass size={18} />
                <span>Explore Models</span>
             </button>
          </div>
        </nav>
      </div>

      {/* Bottom Profile Section */}
      <div className="sidebar-bottom">
        <div className="user-profile">
          <div className="user-avatar">NS</div>
          <div className="user-info">
            <span className="user-name">Niladri Santra</span>
            <span className="user-plan">Free</span>
          </div>
        </div>
        <button className="claim-offer-btn">
          <Award size={16} />
          <span>Claim offer</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
