import React from 'react';
import './BattleArena.css';
import MarkdownRenderer from './MarkdownRenderer';

export default function BattleArena({ results, isVisible }) {
  if (!isVisible) return null;

  // Derive winner based on scores
  const score1 = results?.judge?.solution_1_score || 0;
  const score2 = results?.judge?.solution_2_score || 0;
  
  const m1Winner = score1 >= score2;
  const m2Winner = score2 >= score1;

  // Mocking metrics derived from length or just static for demo
  const mockLatency1 = results ? "1.2s" : "--";
  const mockLatency2 = results ? "2.8s" : "--";
  
  const mockTokens1 = results?.solution_1?.split(' ').length || "--";
  const mockTokens2 = results?.solution_2?.split(' ').length || "--";

  const mockCost1 = "$0.0003";
  const mockCost2 = "$0.0007";

  return (
    <div className="arena-wrapper">
      {/* Cards Section */}
      <div className="arena-cards layout-vs">
        
        {/* MISTRAL CARD */}
        <div className={`glass-panel model-card ${m1Winner && score1 !== score2 ? 'winner-card' : ''}`}>
          <div className="card-header">
            <h4 className="model-name">Mistral 7B</h4>
            {m1Winner && score1 !== score2 && <span className="winner-badge">Winner</span>}
          </div>
          
          <div className="response-box">
            <MarkdownRenderer content={results?.solution_1} />
          </div>
          
          <div className="metrics-grid">
            <div className="metric-box">
              <span className="metric-label">LATENCY</span>
              <span className="metric-value text-space-300">{mockLatency1}</span>
            </div>
            <div className="metric-box">
              <span className="metric-label">TOKENS</span>
              <span className="metric-value">{mockTokens1}</span>
            </div>
            <div className="metric-box">
              <span className="metric-label">COHERENCE</span>
              <span className="metric-value">{score1} / 10</span>
            </div>
            <div className="metric-box">
              <span className="metric-label">COST</span>
              <span className="metric-value">{mockCost1}</span>
            </div>
          </div>
        </div>

        {/* VS Divider */}
        <div className="vs-divider">VS</div>

        {/* COHERE CARD */}
        <div className={`glass-panel model-card ${m2Winner && score1 !== score2 ? 'winner-card' : ''}`}>
          <div className="card-header">
            <h4 className="model-name">Cohere Command R</h4>
            {m2Winner && score1 !== score2 && <span className="winner-badge">Winner</span>}
          </div>
          
          <div className="response-box">
            <MarkdownRenderer content={results?.solution_2} />
          </div>
          
          <div className="metrics-grid">
            <div className="metric-box">
              <span className="metric-label">LATENCY</span>
              <span className="metric-value text-battle-300">{mockLatency2}</span>
            </div>
            <div className="metric-box">
              <span className="metric-label">TOKENS</span>
              <span className="metric-value">{mockTokens2}</span>
            </div>
            <div className="metric-box">
              <span className="metric-label">COHERENCE</span>
              <span className="metric-value text-space-300">{score2} / 10</span>
            </div>
            <div className="metric-box">
              <span className="metric-label">COST</span>
              <span className="metric-value">{mockCost2}</span>
            </div>
          </div>
        </div>

      </div>

      {/* JUDGE'S VERDICT */}
      {results?.judge && (
        <div className="glass-panel judge-panel mt-6">
          <div className="judge-header">
            <div className="judge-avatar">J</div>
            <div>
              <h4 className="judge-title">Judge's reasoning</h4>
              <p className="judge-subtitle">Claude 3.5 Sonnet • Impartial evaluator</p>
            </div>
          </div>
          
          <div className="judge-feedback-grid">
            <div className="feedback-card mistral-feedback">
              <div className="feedback-header">
                 <div className="feedback-indicator mistral-indicator"></div>
                 <h5>Mistral 7B Analysis</h5>
              </div>
              <div className="feedback-content">
                <MarkdownRenderer content={results.judge.solution_1_reasoning} />
              </div>
            </div>
            
            <div className="feedback-card cohere-feedback">
              <div className="feedback-header">
                 <div className="feedback-indicator cohere-indicator"></div>
                 <h5>Cohere Command R Analysis</h5>
              </div>
              <div className="feedback-content">
                <MarkdownRenderer content={results.judge.solution_2_reasoning} />
              </div>
            </div>
          </div>

          <div className="judge-bars">
            <div className="bar-row">
              <span className="bar-label">Mistral</span>
              <div className="bar-track">
                <div className="bar-fill blue-fill" style={{ width: `${(score1 / 10) * 100}%` }}></div>
              </div>
              <span className="bar-score">{score1}</span>
            </div>
            <div className="bar-row">
              <span className="bar-label">Cohere</span>
              <div className="bar-track">
                <div className="bar-fill green-fill" style={{ width: `${(score2 / 10) * 100}%` }}></div>
              </div>
              <span className="bar-score">{score2}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
