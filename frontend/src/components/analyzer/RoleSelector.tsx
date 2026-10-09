import type { FC } from 'react';
import type { TargetRole } from '../../types/resume';
import { TARGET_ROLES } from '../../data/roles';
import { Target, Check, Sparkles } from 'lucide-react';
import { Badge } from '../ui/Badge';

export interface RoleSelectorProps {
  selectedRole: TargetRole;
  onSelectRole: (role: TargetRole) => void;
}

export const RoleSelector: FC<RoleSelectorProps> = ({
  selectedRole,
  onSelectRole
}) => {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
        <div>
          <label
            htmlFor="target-role-dropdown"
            style={{
              fontSize: '0.98rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Target size={18} color="var(--accent-primary)" />
            <span>Select Your Target Placement Role</span>
          </label>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
            Resume analysis algorithms calibrate keyword density and scoring rubrics directly against your chosen role.
          </p>
        </div>

        <Badge variant="orange" icon={<Sparkles size={11} />}>
          7 Specialized Tracks
        </Badge>
      </div>

      {/* Role Pill Selector (Horizontal / Grid) */}
      <div
        role="radiogroup"
        aria-label="Target Role Selection"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '0.65rem',
          marginBottom: '1rem'
        }}
      >
        {TARGET_ROLES.map((role) => {
          const isSelected = role.id === selectedRole.id;
          return (
            <button
              key={role.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelectRole(role)}
              style={{
                textAlign: 'left',
                padding: '0.85rem 1rem',
                backgroundColor: isSelected ? 'var(--accent-subtle)' : 'var(--bg-card)',
                border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.3rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: isSelected ? 600 : 500,
                    color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)'
                  }}
                >
                  {role.title}
                </span>
                {isSelected && (
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent-primary)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {role.category}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Role Meta Details Box */}
      <div
        style={{
          padding: '1rem 1.25rem',
          backgroundColor: 'rgba(232, 90, 11, 0.04)',
          border: '1px solid var(--accent-border)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Benchmark Profile: {selectedRole.title}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Scope: {selectedRole.minExperienceLevel}
          </span>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {selectedRole.description}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Core Target Keywords:
          </span>
          {selectedRole.popularSkills.slice(0, 5).map((skill) => (
            <span
              key={skill}
              style={{
                fontSize: '0.74rem',
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              {skill}
            </span>
          ))}
          <span style={{ fontSize: '0.74rem', color: 'var(--accent-primary)' }}>
            +{selectedRole.popularSkills.length - 5} more
          </span>
        </div>
      </div>
    </div>
  );
};

