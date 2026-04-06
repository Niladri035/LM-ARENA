import React from 'react';
import { Sparkles } from 'lucide-react';
import './Header.css'; // I will create this file

const SUGGESTIONS = [
  "Explain black hole simply",
  "Write a haiku about rain",
  "Debug this Python snippet",
  "Best way to learn Rust?"
];

export default function Header({ onSuggestionClick }) {
  return (
    <header className="header-container">
      {/* Small Badge */}
      <div className="glass-pill badge-outline">
        <Sparkles size={14} className="badge-icon" />
        AI Battle Arena
      </div>

      {/* Main Title */}
      <h1 className="header-title">
        Which model <span className="text-gradient">wins?</span>
      </h1>
      
      {/* Subtitle */}
      <p className="header-subtitle">
        Send one prompt — watch Mistral vs. Cohere compete in real time
      </p>

      {/* Suggestion Chips */}
      <div className="chips-container">
        {SUGGESTIONS.map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => onSuggestionClick(suggestion)}
            className="glass-pill suggestion-chip"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </header>
  );
}
