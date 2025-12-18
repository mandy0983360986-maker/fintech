import React, { useState } from 'react';
import { auth, initializationError } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { AlertCircle, LogIn, RefreshCw, Settings } from 'lucide-react';

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
      setError(initializationError?.message || 'Firebase 服務未正確初始化。');
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
      const message = err.message || "";
      
      // 捕捉 API Key 無效的特定錯誤（包含 SDK 內部訊息）
      if (code?.includes('api-key-not-valid') || message.toLowerCase().includes('api-key')) {
        setError('Firebase API Key 無效。請檢查 GitHub Secrets 或 .env 配置，並確認 Vite 建置時已成功注入。');
      } else if (code === 'auth/email-already-in-use') {
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

  // 判定是否為環境配置問題
  const isConfigIssue = error.toLowerCase().includes('api-key') || !!initializationError;

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl text-white flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-lg shadow-blue-500/20">F</div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">FinAI 智慧理財</h1>
          <p className="text-slate-500 mt-1">您的個人化金融管理助手</p>
        </div>

        {isConfigIssue && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
            <div className="flex items-start">
              <Settings size={18} className="mr-2 mt-0.5 flex-shrink-0 text-red-600" />
              <div>
                <p className="font-bold text-red-700">環境變數缺失或錯誤 (Config Issue)</p>
                <p className="mt-1 opacity-90 leading-relaxed">
                  系統偵測到 Firebase 配置無效。如果您正在 GitHub Pages 使用：
                </p>
                <ul className="list-disc ml-4 mt-2 space-y-1 opacity-80">
                  <li>確認 GitHub 儲存庫 <strong>Settings > Secrets > Actions</strong> 中已加入所有 <code className="bg-red-100 px-1">FIREBASE_*</code> 變數。</li>
                  <li>設定完 Secrets 後，必須重新執行 GitHub Action 編譯程式碼。</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && !isConfigIssue && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-start">
              <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <div className={`${isConfigIssue ? 'opacity-50 pointer-events-none' : ''}`}>
            {isRegister && (
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">姓名</label>
                <input 
                  type="text" 
                  placeholder="您的姓名" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                  required={isRegister}
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Email</label>
              <input 
                type="email" 
                placeholder="example@mail.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                required 
              />
            </div>
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">密碼</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                required 
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading || isConfigIssue} 
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center shadow-lg shadow-blue-500/30 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="animate-spin" size={20} /> : (isRegister ? '立即註冊' : '登入系統')}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-500 text-sm">
            {isRegister ? '已經有帳號了？' : '還沒有帳號嗎？'}
            <button 
              onClick={() => { setIsRegister(!isRegister); setError(''); }} 
              className="text-blue-600 font-bold ml-1 hover:underline"
              disabled={isConfigIssue}
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