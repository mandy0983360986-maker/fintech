import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wallet, TrendingUp, Receipt, PieChart, LogOut, Menu, X, AlertTriangle, ChevronRight } from 'lucide-react';
import { useData } from '../context/DataContext';

interface LayoutProps {
  children: React.ReactNode;
  user: { name: string } | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { firestoreError } = useData();

  const navItems = [
    { path: '/', label: '總覽 Dashboard', icon: LayoutDashboard },
    { path: '/accounts', label: '銀行帳戶', icon: Wallet },
    { path: '/transactions', label: '收支紀錄', icon: Receipt },
    { path: '/stocks', label: '股票投資', icon: TrendingUp },
    { path: '/reports', label: '財務報表', icon: PieChart },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-xl">F</div>
            <span className="text-xl font-bold tracking-wide">FinAI</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                isActive(item.path) 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="flex-1">{item.label}</span>
              {isActive(item.path) && <ChevronRight size={16} />}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800 bg-slate-900">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold uppercase border-2 border-slate-600">
              {user?.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Verified Member</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center space-x-3 w-full px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors group"
          >
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            <span>登出系統</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b p-4 flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white shadow-sm">F</div>
            <span className="text-lg font-bold text-slate-900">FinAI</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600 p-1">
            <Menu size={24} />
          </button>
        </header>

        {/* Error Banner */}
        {firestoreError && (
          <div className="bg-red-600 text-white p-3 flex items-start space-x-3 shadow-lg z-20 flex-shrink-0 animate-in slide-in-from-top duration-300">
            <AlertTriangle className="flex-shrink-0 mt-0.5" size={20} />
            <div className="text-xs sm:text-sm">
              <p className="font-bold">資料庫權限警報 (Security Alert)</p>
              <p className="opacity-90">{firestoreError}</p>
            </div>
          </div>
        )}

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-4 lg:p-8 bg-slate-50">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;