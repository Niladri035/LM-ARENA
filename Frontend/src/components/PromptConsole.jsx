import React, { useState } from 'react';
import { Send, Plus, Zap } from 'lucide-react';
import './PromptConsole.css';

export default function PromptConsole({ onBattle, isLoading, prompt, setPrompt }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt && prompt.trim() && !isLoading) {
      onBattle(prompt);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="console-wrapper">
      <div className="glass-panel console-container">
        <h3 className="console-label">YOUR PROMPT</h3>
        
        <form onSubmit={handleSubmit} className="console-form">
          <textarea
            className="console-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Explain the concept of entropy in one paragraph, using a real-world analogy..."
            rows={3}
            disabled={isLoading}
          />
          
          <div className="console-actions">
            <div className="model-selectors">
              <span className="glass-pill model-badge mistral">Mistral 7B</span>
              <span className="glass-pill model-badge cohere">Cohere Command R</span>
              <button type="button" className="glass-pill add-model-btn" disabled>
                <Plus size={14} /> Add model
              </button>
            </div>
            
            <button 
              type="submit" 
              className={`btn-primary battle-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading || !prompt.trim()}
            >
              <Zap size={16} /> 
              {isLoading ? 'Battling...' : 'Battle'}
            </button>
          </div>
        </form>
      </div>

      <div className="suggestion-box">
        <span className="suggestion-icon">💡</span>
        <span className="suggestion-text">
          <span className="suggestion-highlight">Suggestion:</span> Add a model selector dropdown — let users swap in GPT-4o or Gemini Flash as a third combatant.
        </span>
      </div>
    </div>
  );
}
