import React, { useState, useRef, type FC } from 'react';
import { UploadCloud, FileText, FileCheck } from 'lucide-react';
import type { UploadedResumeFile } from '../../types/resume';

export interface DropzoneProps {
  onFileAccepted: (fileData: UploadedResumeFile) => void;
  onError: (errorMessage: string) => void;
  disabled?: boolean;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_EXTENSIONS = ['pdf', 'docx'] as const;

function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export const Dropzone: FC<DropzoneProps> = ({
  onFileAccepted,
  onError,
  disabled = false
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcessFile = (file: File) => {
    // 1. Check extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !ALLOWED_EXTENSIONS.includes(extension as any)) {
      onError(`Invalid file format: ".${extension || 'unknown'}". Please upload a PDF (.pdf) or Word document (.docx).`);
      return;
    }

    // 2. Check file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      onError(`File is too large (${formatBytes(file.size)}). Maximum allowed resume size is 5 MB.`);
      return;
    }

    if (file.size === 0) {
      onError('The selected file appears to be empty (0 bytes). Please upload a valid resume.');
      return;
    }

    // 3. Success
    const uploadedData: UploadedResumeFile = {
      file,
      name: file.name,
      size: file.size,
      formattedSize: formatBytes(file.size),
      extension: extension as 'pdf' | 'docx',
      lastModified: file.lastModified
    };

    onFileAccepted(uploadedData);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndProcessFile(droppedFile);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      validateAndProcessFile(selected);
      e.target.value = '';
    }
  };

  const triggerBrowse = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerBrowse();
    }
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
        tabIndex={-1}
        aria-hidden="true"
        disabled={disabled}
      />

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload resume file dropzone. Drag and drop PDF or DOCX file here, or click to browse."
        onClick={triggerBrowse}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: isDragActive
            ? '2px dashed var(--accent-primary)'
            : '2px dashed var(--border-default)',
          backgroundColor: isDragActive
            ? 'var(--accent-subtle)'
            : 'rgba(32, 33, 35, 0.45)',
          borderRadius: 'var(--radius-lg)',
          padding: '3rem 2rem',
          textAlign: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all var(--transition-normal)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: isDragActive ? 'var(--accent-primary)' : 'var(--bg-elevated)',
            color: isDragActive ? '#ffffff' : 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
            border: '1px solid var(--border-subtle)',
            transition: 'all var(--transition-fast)'
          }}
        >
          {isDragActive ? <FileCheck size={28} /> : <UploadCloud size={28} />}
        </div>

        <h3
          style={{
            fontSize: '1.15rem',
            fontWeight: 600,
            marginBottom: '0.4rem',
            color: 'var(--text-primary)'
          }}
        >
          {isDragActive ? 'Release to upload your resume' : 'Drop your resume here, or browse files'}
        </h3>

        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', maxWidth: '440px', marginBottom: '1rem' }}>
          Supports <strong>PDF</strong> and <strong>DOCX</strong> documents up to <strong>5 MB</strong>. Single-column layouts are parsed with highest accuracy.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <FileText size={14} /> PDF (.pdf)
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <FileText size={14} /> Word (.docx)
          </span>
          <span>•</span>
          <span>Max 5 MB</span>
        </div>
      </div>
    </div>
  );
};

