import React from 'react';
import './Leaderboard.css';

export default function Leaderboard({ data = [] }) {
  // Sort by elo descending so winner appears first
  const sorted = [...data].sort((a, b) => b.elo - a.elo);

  const getRankEmoji = (rank) => {
    if (rank === 0) return <span className="gold-medal">#1 🥇</span>;
    if (rank === 1) return <span className="silver-medal">#2 🥈</span>;
    return `#${rank + 1}`;
  };

  const getWinRate = (item) => {
    if (!item.battles) return '—';
    return `${Math.round((item.wins / item.battles) * 100)}%`;
  };

  return (
    <div className="leaderboard-wrapper">
      <div className="leaderboard-header text-center mb-6">
        <h2 className="text-3xl font-bold mb-2 text-gradient-battle mt-14">Leaderboard</h2>
        <p className="text-space-300 text-sm">Live Rankings — updates after every battle</p>
      </div>

      <div className="glass-panel leaderboard-container">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Model</th>
              <th>Elo Score</th>
              <th>Win Rate</th>
              <th>Battles</th>
              <th>Cost Tier</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', opacity: 0.5, padding: '2rem' }}>
                  No battles yet — run your first battle!
                </td>
              </tr>
            ) : sorted.map((item, index) => (
              <tr key={item.id} className={`leaderboard-row ${index === 0 ? 'rank-first' : ''}`}>
                <td className="rank-col">{getRankEmoji(index)}</td>
                <td className="model-col">{item.model || item.name}</td>
                <td className="elo-col">{item.elo}</td>
                <td className="win-col text-space-300">{getWinRate(item)}</td>
                <td className="win-col text-space-300">{item.battles}</td>
                <td className={`cost-col tier-${(item.costScore || 'low').toLowerCase()}`}>{item.costScore || 'Low'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
