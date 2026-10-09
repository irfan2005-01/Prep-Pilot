import { useState, type CSSProperties, type FormEvent } from 'react';
import { ArrowRight, Eye, EyeOff, FileSearch, Compass, Brain, BriefcaseBusiness } from 'lucide-react';
import { login, register, type AuthUser } from '../../services/authService';
import './auth.css';

interface Props { mode: 'login' | 'signup'; notice?: string; onMode: (mode: 'login' | 'signup') => void; onSuccess: (user: AuthUser) => void }

export function AuthPage({ mode, notice, onMode, onSuccess }: Props) {
  const signup = mode === 'signup';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError('');
    if (signup && password !== confirm) { setError('Your passwords do not match.'); return; }
    if (password.length < 12) { setError('Use at least 12 characters for a stronger password.'); return; }
    setBusy(true);
    try { onSuccess(signup ? await register(name.trim(), email.trim(), password) : await login(email.trim(), password)); }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to sign in. Please try again.'); }
    finally { setBusy(false); }
  };

  return <main className="auth-shell">
    <section className="auth-story" aria-label="Prep Pilot introduction">
      <div className="auth-brand"><img src="/brand/prep-pilot-logo.png" alt="Prep Pilot — your co-pilot from resume to offer" /></div>
      <p className="auth-tagline">Your co-pilot from resume to offer.</p>
      <div className="auth-story-copy"><span className="auth-eyebrow">A clearer path to your next role</span>
        <h1>Build your future with <em>Prep Pilot.</em></h1>
        <p>AI-powered guidance for resumes, interviews, and career growth — all in one place.</p>
        <div className="auth-features"><span><FileSearch size={17}/>Resume Analysis</span><span><Brain size={17}/>Mock Interviews</span><span><Compass size={17}/>Personalized Roadmaps</span><span><BriefcaseBusiness size={17}/>Career Preparation</span></div>
      </div>
        <div className="auth-wave" aria-hidden="true"><div className="auth-wave-glow"/><div className="auth-wave-line line-one"/><div className="auth-wave-line line-two"/><div className="auth-wave-line line-three"/><div className="auth-wave-dots">{Array.from({length: 54}, (_, i) => <i key={i} style={{ '--s': `${1 + (i % 4) * .5}px`, '--y': `${(i % 7) * 9 - 24}px`, '--o': .2 + (i % 6) * .12 } as CSSProperties}/>)}</div></div>
      <span className="auth-footer">LEARN <b>/</b> IMPROVE <b>/</b> ACHIEVE</span>
    </section>
    <section className="auth-panel-wrap"><form className="auth-panel" onSubmit={submit}>
      <span className="auth-eyebrow">{signup ? 'Start your next chapter' : 'Your journey continues here'}</span>
      <h2>{signup ? 'Build your future.' : 'Welcome Back'}</h2>
      <p className="auth-intro">{signup ? 'Create your account and make your next move with confidence.' : 'Sign in to continue your journey with Prep Pilot.'}</p>
      {notice && <p className="auth-intro" role="status">{notice}</p>}
      {signup && <label>Full name<input autoComplete="name" required maxLength={128} value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></label>}
      <label>Email address<input type="email" autoComplete="email" required maxLength={254} value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label>
      <label>Password <span className="password-hint">{signup ? 'At least 12 characters' : ''}</span><span className="password-field"><input type={visible?'text':'password'} autoComplete={signup?'new-password':'current-password'} required minLength={12} maxLength={72} value={password} onChange={e=>setPassword(e.target.value)} placeholder={signup?'Create a strong password':'Enter your password'}/><button type="button" aria-label={visible?'Hide password':'Show password'} onClick={()=>setVisible(v=>!v)}>{visible?<EyeOff size={18}/>:<Eye size={18}/>}</button></span></label>
      {signup && <label>Confirm password<input type={visible?'text':'password'} autoComplete="new-password" required minLength={12} maxLength={72} value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Enter your password again"/></label>}
      {signup && <p className="auth-terms">By creating an account, you agree to use Prep Pilot in accordance with our service terms and privacy practices.</p>}
      {signup && <label className="auth-accept"><input type="checkbox" required checked={accepted} onChange={e=>setAccepted(e.target.checked)}/> I acknowledge the service terms and privacy practices.</label>}
      {error && <p className="auth-error" role="alert">{error}</p>}
      <button className="auth-submit" disabled={busy}>{busy ? 'Please wait…' : signup ? 'Create Account' : 'Sign In'}<ArrowRight size={17}/></button>
      <p className="auth-switch">{signup ? 'Already have an account?' : 'New to Prep Pilot?'} <button type="button" onClick={()=>onMode(signup?'login':'signup')}>{signup?'Sign in':'Create an account'}</button></p>
    </form></section>
  </main>;
}
