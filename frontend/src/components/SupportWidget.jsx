import React, { useMemo, useState } from 'react';
import '../styles/SupportWidget.css';

function SupportWidget({ isOpen, onToggle, showFloatingButton = true }) {
  const [activePrompt, setActivePrompt] = useState('');

  const prompts = useMemo(() => ([
    {
      label: 'Trip ideas',
      response: 'Browse our destination highlights and we can help narrow down the best island escape for your vibe and budget.',
      action: () => {
        const section = document.getElementById('destinations');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    },
    {
      label: 'Booking help',
      response: 'Need dates, rates, or availability support? Head to our contact section and our team can assist with the next step.',
      action: () => {
        const section = document.getElementById('contact');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    },
    {
      label: 'Budget tips',
      response: 'Tell us your ideal trip style and budget in the contact form so we can suggest a more suitable destination plan.',
      action: () => {
        const section = document.getElementById('contact');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  ]), []);

  const handlePromptClick = (prompt) => {
    setActivePrompt(prompt.response);
    prompt.action();
  };

  return (
    <div className={`support-widget ${isOpen ? 'open' : ''}`}>
      {isOpen && (
        <div className="support-panel" role="dialog" aria-label="Travel assistance panel">
          <div className="support-panel-header">
            <div>
              <span className="support-badge">AI + Care</span>
              <h3>Travel Assistance</h3>
            </div>
            <button
              type="button"
              className="support-close-btn"
              onClick={() => onToggle(false)}
              aria-label="Close support widget"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <p className="support-intro">
            Start with guided help, then continue with our customer care team when you are ready to book.
          </p>

          <div className="support-prompts">
            {prompts.map((prompt) => (
              <button
                key={prompt.label}
                type="button"
                className="support-prompt-btn"
                onClick={() => handlePromptClick(prompt)}
              >
                {prompt.label}
              </button>
            ))}
          </div>

          <div className="support-response">
            <p>{activePrompt || 'Pick a prompt for a quick recommendation, or jump straight to our support channels below.'}</p>
          </div>

          <div className="support-actions">
            <a href="tel:+639171234567" className="support-action-link">
              <i className="fas fa-phone-alt"></i>
              <span>Call Support</span>
            </a>
            <a href="mailto:info@iwanderph.com" className="support-action-link">
              <i className="fas fa-envelope"></i>
              <span>Email Us</span>
            </a>
          </div>
        </div>
      )}

      {showFloatingButton && (
        <button
          type="button"
          className="support-fab"
          onClick={() => onToggle(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Open travel assistance"
        >
          <span className="support-fab-icon">
            <i className={`fas fa-${isOpen ? 'times' : 'headset'}`}></i>
          </span>
          <span className="support-fab-text">AI Assistance</span>
        </button>
      )}
    </div>
  );
}

export default SupportWidget;
