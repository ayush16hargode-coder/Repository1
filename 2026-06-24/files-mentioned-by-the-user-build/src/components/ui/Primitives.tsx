import type { PropsWithChildren, ReactNode } from 'react';
import type { Language, TopicStatus } from '../../types';

export function Panel({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <section className={`panel ${className}`}>{children}</section>;
}

export function Eyebrow({ children }: PropsWithChildren) {
  return <div className="eyebrow">{children}</div>;
}

export function SectionHeader({ title, kicker, action }: { title: string; kicker?: string; action?: ReactNode }) {
  return <div className="section-header"><div>{kicker && <Eyebrow>{kicker}</Eyebrow>}<h2>{title}</h2></div>{action}</div>;
}

export function ProgressBar({ value, color, subtle = false }: { value: number; color?: string; subtle?: boolean }) {
  return <div className={`progress-track ${subtle ? 'subtle' : ''}`}><span style={{ width: `${Math.max(2, Math.min(value, 100))}%`, background: color }} /></div>;
}

export function LanguageSigil({ language, size = 'md' }: { language: Language; size?: 'sm' | 'md' | 'lg' }) {
  return <div className={`language-sigil ${size}`} style={{ '--realm-color': language.color } as React.CSSProperties}><span>{language.sigil}</span></div>;
}

export function StatusPill({ status }: { status: TopicStatus }) {
  const labels = { 'not-started': 'Uncharted', 'in-progress': 'In progress', completed: 'Mastered' };
  return <span className={`status-pill ${status}`}>{labels[status]}</span>;
}

export function EmptyState({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return <div className="empty-state"><div className="empty-icon">{icon}</div><h3>{title}</h3><p>{body}</p></div>;
}
