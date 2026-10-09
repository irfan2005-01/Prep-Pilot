import type { ReactNode, CSSProperties, FC } from 'react';

export interface BadgeProps {
  variant?: 'orange' | 'success' | 'warning' | 'error' | 'neutral';
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const Badge: FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  icon,
  className = '',
  style
}) => {
  return (
    <span className={`badge badge-${variant} ${className}`} style={style}>
      {icon && <span aria-hidden="true" style={{ display: 'inline-flex' }}>{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

