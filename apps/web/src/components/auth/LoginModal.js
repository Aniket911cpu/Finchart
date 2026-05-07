'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
export function LoginModal({ isOpen, onClose }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    if (!isOpen)
        return null;
    const handleSubmit = async (e) => {
        e.preventDefault();
        await signIn('credentials', { email, password, redirect: false });
        onClose();
    };
    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-bg-secondary w-full max-w-md p-6 rounded-2xl border border-border shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary">
          ✕
        </button>
        
        <h2 className="text-2xl font-bold text-text-primary mb-6">Sign In</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-accent-blue" placeholder="you@example.com" required/>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-accent-blue" placeholder="••••••••" required/>
          </div>
          
          <button type="submit" className="w-full bg-accent-blue hover:bg-accent-blue/90 text-white font-medium py-2 rounded-lg transition-colors mt-4">
            Sign In with Email
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <span className="w-1/5 border-b border-border"></span>
          <span className="text-xs text-text-secondary font-medium uppercase">Or continue with</span>
          <span className="w-1/5 border-b border-border"></span>
        </div>

        <div className="mt-6 flex space-x-4">
          <button onClick={() => signIn('google')} className="w-1/2 flex items-center justify-center space-x-2 bg-bg-tertiary hover:bg-bg-tertiary/80 py-2 border border-border rounded-lg text-text-primary transition-colors">
            <span>Google</span>
          </button>
          <button onClick={() => signIn('github')} className="w-1/2 flex items-center justify-center space-x-2 bg-bg-tertiary hover:bg-bg-tertiary/80 py-2 border border-border rounded-lg text-text-primary transition-colors">
            <span>GitHub</span>
          </button>
        </div>
        
      </div>
    </div>);
}
//# sourceMappingURL=LoginModal.js.map