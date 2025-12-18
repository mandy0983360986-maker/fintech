import React, { useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { useData } from '../context/DataContext';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Settings, Save, AlertCircle, ExternalLink, LogIn, Mail } from 'lucide-react';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setErrorLink('');
    if (!auth) {
      setError('Firebase 尚未正確配置。');
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
        setError('此 Email 已被註冊，請直接點選下方按鈕登入。');
      } else if (code === 'auth/invalid-credential') {
        setError('帳號或密碼錯誤。');
      } else if (code === 'auth/operation-not-allowed') {
        setError('請在 Firebase Console 啟用 Email/Password 登入。');
        setErrorLink(`https://console.firebase.google.com/project/${auth.app.options.projectId}/authentication/providers`);
      } else if (code === 'auth/invalid-api-key') {
        setError('Firebase API Key 無效，請檢查 GitHub Secrets 或手動配置。');
      } else {
        setError(`登入失敗: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (showConfig) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 fixed inset-0 z-50">
        <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
          <h2 className="text-2xl font-bold mb-4 flex items-center"><Settings className="mr-2 text-blue-600" /> Firebase 手動配置</h2>
          <p className="text-sm text-slate-500 mb-6">提示：若已在 GitHub Secrets 設定環境變數，則不需填寫此處。</p>
          <form onSubmit={handleSaveConfig} className="space-y-4">
            {['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'].map(f => (
              <div key={f}>
                <label className="block text-xs font-bold text-slate-500 uppercase">{f}</label>
                <input type="text" value={(configForm as any)[f]} onChange={e => setConfigForm({...configForm, [f]: e.target.value})} className="w-full p-2 border rounded-lg text-sm font-mono" required />
              </div>
            ))}
            <div className="flex justify-end space-x-3 pt-4">
              {!configError && <button type="button" onClick={() => setShowConfig(false)} className="px-4 py-2 text-slate-500">取消</button>}
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">儲存並重整</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl text-white flex items-center justify-center text-3xl font-bold mx-auto mb-4">F</div>
          <h1 className="text-2xl font-bold">FinAI 智慧理財</h1>
          <button onClick={() => setShowConfig(true)} className="text-xs text-slate-400 hover:text-blue-500 mt-2 underline">手動配置 Firebase (調試用)</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
              <div className="flex items-start mb-2"><AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" /> <span>{error}</span></div>
              {error.includes("註冊") && (
                <button type="button" onClick={() => { setIsRegister(false); setError(''); }} className="w-full py-2 mt-2 bg-blue-600 text-white rounded-lg font-bold flex items-center justify-center hover:bg-blue-700 transition">
                  <LogIn size={14} className="mr-2" /> 切換至登入模式
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
            <input type="text" placeholder="姓名" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" required />
          )}
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" required />
          <input type="password" placeholder="密碼" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" required />
          
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center shadow-lg shadow-blue-500/30">
            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : (isRegister ? '註冊帳號' : '登入')}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-500 text-sm">
          {isRegister ? '已有帳號？' : '沒有帳號？'}
          <button onClick={() => { setIsRegister(!isRegister); setError(''); }} className="text-blue-600 font-bold ml-1 hover:underline">{isRegister ? '點此登入' : '點此註冊'}</button>
        </p>
      </div>
    </div>
  );
};

export default Login;