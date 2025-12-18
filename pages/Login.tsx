import React, { useState } from 'react';
import { auth, initializationError } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { AlertCircle, LogIn, RefreshCw, Info } from 'lucide-react';

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
      setError(initializationError?.message || 'Firebase 服務未正確初始化，請檢查環境變數配置。');
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
      console.error("Auth Error:", err);
      const code = err.code;
      if (code === 'auth/email-already-in-use') {
        setError('此 Email 已被註冊，請直接登入。');
      } else if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setError('帳號或密碼錯誤。');
      } else if (code === 'auth/operation-not-allowed') {
        setError('Email 登入功能未在 Firebase Console 中啟用。');
      } else {
        setError(`操作失敗: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl text-white flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-lg shadow-blue-500/20">F</div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">FinAI 智慧理財</h1>
          <p className="text-slate-500 mt-1">您的個人化金融管理助手</p>
        </div>

        {initializationError && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
            <div className="flex items-start">
              <Info size={16} className="mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold">系統提示</p>
                <p>Firebase 環境變數可能尚未設定，系統將嘗試以預設模式運行。如果無法登入，請確認專案的環境變數配置。</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
              <div className="flex items-start mb-2">
                <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
              {error.includes("已被註冊") && (
                <button 
                  type="button" 
                  onClick={() => { setIsRegister(false); setError(''); }} 
                  className="w-full py-2 mt-2 bg-blue-600 text-white rounded-lg font-bold flex items-center justify-center hover:bg-blue-700 transition"
                >
                  <LogIn size={14} className="mr-2" /> 改用登入模式
                </button>
              )}
            </div>
          )}
          
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">姓名</label>
              <input 
                type="text" 
                placeholder="您的姓名" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                required 
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Email</label>
            <input 
              type="email" 
              placeholder="example@mail.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">密碼</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              required 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center shadow-lg shadow-blue-500/30 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <RefreshCw className="animate-spin" size={20} /> : (isRegister ? '立即註冊' : '登入系統')}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-500 text-sm">
            {isRegister ? '已經有帳號了？' : '還沒有帳號嗎？'}
            <button 
              onClick={() => { setIsRegister(!isRegister); setError(''); }} 
              className="text-blue-600 font-bold ml-1 hover:underline transition-all"
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