import React, { useState } from 'react';
import { auth, initializationError } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { AlertCircle, RefreshCw, Key } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!auth) {
      setError(initializationError?.message || 'Firebase 未能正確初始化。');
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        if (password.length < 6) throw new Error('密碼長度至少需 6 位。');
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(userCredential.user, { displayName: name });
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
    } catch (err: any) {
      console.error("Auth 錯誤:", err);
      const code = err.code || '';
      if (code.includes('api-key-not-valid')) {
        setError('金鑰驗證失敗。請確認：1. Firebase 專案已啟用 Authentication。 2. Google Cloud 控制台已啟用 Identity Toolkit API。');
      } else if (code === 'auth/weak-password') {
        setError('密碼太弱。');
      } else if (code === 'auth/invalid-credential') {
        setError('帳號或密碼錯誤。');
      } else {
        setError(err.message || '操作失敗，請稍後再試。');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-8 shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl text-white flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-lg shadow-blue-600/20">F</div>
          <h1 className="text-2xl font-bold text-white tracking-tight">FinAI 智慧理財</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-start animate-fade-in">
              <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="space-y-4">
            {isRegister && (
              <input 
                type="text" 
                placeholder="您的姓名" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500" 
                required
              />
            )}
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500" 
              required 
            />
            <input 
              type="password" 
              placeholder="密碼" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500" 
              required 
            />
            
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center disabled:opacity-50"
            >
              {loading ? <RefreshCw className="animate-spin" size={20} /> : (isRegister ? '註冊' : '登入')}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <button 
            onClick={() => { setIsRegister(!isRegister); setError(''); }} 
            className="text-slate-400 text-xs hover:text-blue-500 transition"
          >
            {isRegister ? '已經有帳號？回登入頁' : '還沒有帳號？立即註冊'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;