import { getMomentum } from '../../lib/progression';
import type { StudySession } from '../../types';

export function MomentumCore({ sessions, compact = false }: { sessions: StudySession[]; compact?: boolean }) {
  const momentum = getMomentum(sessions);
  return (
    <div className={`momentum-wrap ${compact ? 'compact' : ''}`}>
      <div className="crystal-field">
        <div className="crystal-glow" style={{ opacity: Math.min(.35 + momentum / 30, .92) }} />
        <div className="crystal"><div className="crystal-inner" /></div>
        <i className="orbit one" /><i className="orbit two" />
      </div>
      <div className="momentum-copy"><span>Momentum</span><strong>{momentum} days</strong>{!compact && <small>Energy steady · longest 24</small>}</div>
    </div>
  );
}
