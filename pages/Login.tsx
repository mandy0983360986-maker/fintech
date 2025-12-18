import React, { useState } from 'react';
import { auth, initializationError } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { AlertCircle, RefreshCw } from 'lucide-react';

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
      setError(initializationError?.message || 'Firebase 服務未正確初始化，請檢查程式碼配置。');
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(userCredential.user, { displayName: name });
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
    } catch (err: any) {
      console.error("Auth 錯誤詳情:", err);
      const code = err.code;
      if (code === 'auth/email-already-in-use') {
        setError('此 Email 已被註冊，請直接登入。');
      } else if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setError('帳號或密碼錯誤。');
      } else {
        setError(`操作失敗: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-600/10 blur-3xl rounded-full -ml-16 -mb-16"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl text-white flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-lg shadow-blue-600/20">F</div>
          <h1 className="text-2xl font-bold text-white tracking-tight">FinAI 智慧理財</h1>
          <p className="text-slate-400 mt-1 text-sm">您的個人化金融管理助手</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-start animate-fade-in">
              <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <div>
            {isRegister && (
              <div className="mb-4">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">姓名</label>
                <input 
                  type="text" 
                  placeholder="您的姓名" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none transition-all" 
                  required={isRegister}
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Email</label>
              <input 
                type="email" 
                placeholder="example@mail.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none transition-all" 
                required 
              />
            </div>
            <div className="mb-6">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">密碼</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none transition-all" 
                required 
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center shadow-lg shadow-blue-600/20 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="animate-spin" size={20} /> : (isRegister ? '立即註冊' : '登入系統')}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center relative z-10">
          <p className="text-slate-400 text-xs">
            {isRegister ? '已經有帳號了？' : '還沒有帳號嗎？'}
            <button 
              onClick={() => { setIsRegister(!isRegister); setError(''); }} 
              className="text-blue-500 font-bold ml-1 hover:underline"
            >
              {isRegister ? '點此登入' : '立即註冊'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;