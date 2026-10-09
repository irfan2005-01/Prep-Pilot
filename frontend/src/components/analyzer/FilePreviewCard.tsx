import React from 'react';
import { FileText, Trash2, CheckCircle2 } from 'lucide-react';
import type { UploadedResumeFile } from '../../types/resume';
import { Badge } from '../ui/Badge';

export interface FilePreviewCardProps {
  fileData: UploadedResumeFile;
  onRemove: () => void;
  disabled?: boolean;
}

export const FilePreviewCard: React.FC<FilePreviewCardProps> = ({
  fileData,
  onRemove,
  disabled = false
}) => {
  const isPdf = fileData.extension === 'pdf';

  return (
    <div
      style={{
        padding: '1.25rem',
        backgroundColor: 'var(--bg-elevated)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-default)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '1.5rem',
        boxShadow: 'var(--shadow-subtle)'
      }}
    >
      {/* Left: Icon & File Meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: isPdf ? 'rgba(239, 68, 68, 0.12)' : 'rgba(56, 189, 248, 0.12)',
            color: isPdf ? '#ef4444' : '#38bdf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            border: isPdf ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid rgba(56, 189, 248, 0.25)'
          }}
        >
          <FileText size={24} />
        </div>

        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.2rem' }}>
            <span
              style={{
                fontSize: '0.98rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '380px'
              }}
              title={fileData.name}
            >
              {fileData.name}
            </span>
            <Badge variant="success" icon={<CheckCircle2 size={11} />}>
              Validated
            </Badge>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span className="text-mono">{fileData.formattedSize}</span>
            <span>•</span>
            <span style={{ textTransform: 'uppercase' }}>{fileData.extension} Format</span>
            <span>•</span>
            <span>Client check passed</span>
          </div>
        </div>
      </div>

      {/* Right: Remove Control */}
      <div>
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          className="btn btn-outline btn-sm"
          style={{
            color: 'var(--color-error)',
            borderColor: 'var(--color-error-border)',
            gap: '0.35rem'
          }}
          aria-label={`Remove selected file ${fileData.name}`}
          title="Remove this resume and choose another"
        >
          <Trash2 size={15} />
          <span>Remove</span>
        </button>
      </div>
    </div>
  );
};

