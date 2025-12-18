import React, { useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { useData } from '../context/DataContext';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Settings, Save, AlertCircle, ExternalLink, LogIn, Mail, RefreshCw } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [errorLink, setErrorLink] = useState(''); 
  const [loading, setLoading] = useState(false);
  
  const { configError } = useData();
  const [showConfig, setShowConfig] = useState(false);
  const [configForm, setConfigForm] = useState({
    apiKey: '', authDomain: '', projectId: '', storageBucket: '', messagingSenderId: '', appId: ''
  });

  useEffect(() => {
    if (configError) setShowConfig(true);
  }, [configError]);

  useEffect(() => {
    if (showConfig) {
      try {
        const localConfig = localStorage.getItem('firebase_config');
        if (localConfig) setConfigForm(JSON.parse(localConfig));
      } catch (e) {}
    }
  }, [showConfig]);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('firebase_config', JSON.stringify(configForm));
    window.location.reload();
  };

  const handleClearConfig = () => {
    localStorage.removeItem('firebase_config');
    window.location.reload();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setErrorLink('');
    if (!auth) {
      setError('Firebase 服務不可用。');
      setShowConfig(true);
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
        setError('此 Email 已被註冊。');
      } else if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setError('帳號或密碼錯誤。');
      } else if (code === 'auth/operation-not-allowed') {
        setError('請在 Firebase 控制台啟用 Email/Password 登入方式。');
        setErrorLink(`https://console.firebase.google.com/project/${auth.app.options.projectId}/authentication/providers`);
      } else if (code === 'auth/invalid-api-key') {
        setError('Firebase API Key 無效，請檢查 GitHub Secrets。');
      } else {
        setError(`操作失敗: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (showConfig) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 fixed inset-0 z-50">
        <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
          <h2 className="text-2xl font-bold mb-4 flex items-center"><Settings className="mr-2 text-blue-600" /> Firebase 手動設定</h2>
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-6 text-sm text-amber-800">
            提示：正式環境建議在 GitHub Repository 的 <strong>Settings > Secrets</strong> 設定環境變數。
          </div>
          <form onSubmit={handleSaveConfig} className="space-y-4">
            {['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'].map(f => (
              <div key={f}>
                <label className="block text-xs font-bold text-slate-500 uppercase">{f}</label>
                <input type="text" value={(configForm as any)[f]} onChange={e => setConfigForm({...configForm, [f]: e.target.value})} className="w-full p-2 border rounded-lg text-sm font-mono" required />
              </div>
            ))}
            <div className="flex justify-between items-center pt-4">
              <button type="button" onClick={handleClearConfig} className="text-red-600 text-sm hover:underline">清除緩存設定</button>
              <div className="flex space-x-3">
                {!configError && <button type="button" onClick={() => setShowConfig(false)} className="px-4 py-2 text-slate-500">取消</button>}
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition flex items-center">
                  <Save size={18} className="mr-2" /> 儲存並重啟
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl">
        <div className="text-center mb-8 relative">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl text-white flex items-center justify-center text-3xl font-bold mx-auto mb-4">F</div>
          <h1 className="text-2xl font-bold text-slate-900">FinAI 智慧理財</h1>
          <p className="text-slate-500 mt-1">個人化金融管理系統</p>
          <button 
            onClick={() => setShowConfig(true)} 
            className="absolute top-0 right-0 text-slate-300 hover:text-blue-500 transition"
            title="手動設定"
          >
            <Settings size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm animate-pulse">
              <div className="flex items-start mb-2"><AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" /> <span>{error}</span></div>
              {error.includes("已被註冊") && (
                <button 
                  type="button" 
                  onClick={() => { setIsRegister(false); setError(''); }} 
                  className="w-full py-2 mt-2 bg-blue-600 text-white rounded-lg font-bold flex items-center justify-center hover:bg-blue-700 transition"
                >
                  <LogIn size={14} className="mr-2" /> 改用登入模式
                </button>
              )}
              {errorLink && (
                <a href={errorLink} target="_blank" rel="noreferrer" className="block mt-2 text-blue-600 underline font-bold flex items-center hover:text-blue-800">
                  <ExternalLink size={14} className="mr-1" /> 前往啟用 Email 登入
                </a>
              )}
            </div>
          )}
          
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">姓名</label>
              <input type="text" placeholder="您的姓名" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" required />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
            <input type="email" placeholder="example@mail.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">密碼</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" required />
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center shadow-lg shadow-blue-500/30 active:scale-95 disabled:opacity-70"
          >
            {loading ? <RefreshCw className="animate-spin" size={20} /> : (isRegister ? '註冊帳號' : '登入系統')}
          </button>
        </form>

        <div className="mt-8 text-center">
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