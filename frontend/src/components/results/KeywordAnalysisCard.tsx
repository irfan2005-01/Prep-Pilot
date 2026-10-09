import React, { useState } from 'react';
import type { KeywordAnalysis } from '../../types/resume';
import { KeyRound, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';
import { Badge } from '../ui/Badge';

export interface KeywordAnalysisCardProps {
  keywords: KeywordAnalysis;
}

export const KeywordAnalysisCard: React.FC<KeywordAnalysisCardProps> = ({ keywords }) => {
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

  const handleCopy = (word: string) => {
    navigator.clipboard.writeText(word);
    setCopiedKeyword(word);
    setTimeout(() => setCopiedKeyword(null), 2000);
  };

  return (
    <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--accent-subtle)',
            color: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <KeyRound size={18} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>
            ATS Keyword Coverage & Gap Analysis
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            ATS parsers index technical nouns against job descriptions. Missing keywords degrade algorithmic ranking.
          </p>
        </div>
      </div>

      {/* Matched Keywords Grid */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <CheckCircle2 size={16} color="var(--color-success)" />
          <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Detected Keywords ({keywords.matchedKeywords.length})
          </h4>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {keywords.matchedKeywords.map((item) => (
            <div
              key={item.keyword}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.35rem 0.75rem',
                backgroundColor: 'rgba(34, 197, 94, 0.08)',
                border: '1px solid rgba(34, 197, 94, 0.25)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.82rem',
                color: 'var(--text-primary)'
              }}
            >
              <span>{item.keyword}</span>
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '0.1rem 0.35rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                  color: 'var(--color-success)',
                  fontWeight: 600
                }}
              >
                {item.frequency}x
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Missing Keywords Details */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
          <AlertCircle size={16} color="var(--accent-primary)" />
          <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Missing Critical Keywords ({keywords.missingKeywords.length})
          </h4>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            (Click any keyword to copy to clipboard)
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {keywords.missingKeywords.map((item) => {
            const isEssential = item.importance === 'essential';
            const isCopied = copiedKeyword === item.keyword;

            return (
              <div
                key={item.keyword}
                style={{
                  padding: '1rem 1.25rem',
                  backgroundColor: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-md)',
                  border: isEssential ? '1px solid var(--accent-border)' : '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem'
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <button
                      type="button"
                      onClick={() => handleCopy(item.keyword)}
                      className="btn btn-outline btn-sm"
                      style={{
                        padding: '0.25rem 0.6rem',
                        fontSize: '0.82rem',
                        color: 'var(--text-primary)',
                        borderColor: 'var(--border-default)'
                      }}
                      title="Copy keyword"
                      aria-label={`Copy keyword ${item.keyword}`}
                    >
                      {isCopied ? <Check size={13} color="var(--color-success)" /> : <Copy size={13} />}
                      <span style={{ fontWeight: 600 }}>{item.keyword}</span>
                    </button>
                    {isCopied && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-success)' }}>
                        Copied!
                      </span>
                    )}
                  </div>

                  <Badge variant={isEssential ? 'orange' : 'neutral'} style={{ fontSize: '0.7rem' }}>
                    {isEssential ? 'Essential ATS Match' : 'Recommended'}
                  </Badge>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Why it matters: </strong>
                  {item.rationale}
                </p>

                <div
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--accent-primary)',
                    backgroundColor: 'rgba(232, 90, 11, 0.05)',
                    padding: '0.4rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px dashed var(--accent-border)'
                  }}
                >
                  <strong>How to integrate: </strong>
                  {item.suggestedContext}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

