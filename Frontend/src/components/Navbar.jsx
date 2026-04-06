import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Bot, Menu, User, Settings, Award, LogOut, ClipboardList } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ onLoginClick, onSettingsClick, user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="brand" style={{ textDecoration: 'none' }}>
            <Bot size={24} className="brand-logo" />
            <span className="brand-name">LM Arena</span>
          </Link>
        </div>

        <div className="navbar-center">
          <ul className="nav-links">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Battle
            </NavLink>
            <NavLink to="/leaderboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Leaderboard
            </NavLink>
            <NavLink to="/models" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Models
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              About
            </NavLink>
          </ul>
        </div>

        <div className="navbar-right">
          <button className="nav-icon-btn" onClick={() => navigate('/leaderboard')} title="Leaderboard">
            <Award size={20} />
          </button>
          <button className="nav-icon-btn" onClick={onSettingsClick} title="Settings">
            <Settings size={20} />
          </button>
          
          {user ? (
            <div className="user-profile-logged">
              <Link to="/history" className="history-link-icon" title="My History">
                <ClipboardList size={18} />
              </Link>
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className="user-tier">{user.tier}</span>
              </div>
              <button className="logout-btn" onClick={onLogout} title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="user-profile-mini" onClick={onLoginClick}>
              <User size={20} />
            </div>
          )}
          
          <button className="mobile-menu-btn">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
