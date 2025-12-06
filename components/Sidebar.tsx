import React from 'react';
import { LayoutDashboard, Users, FileText, Mail, LogOut, Shield } from 'lucide-react';
import { SCHOOL_NAME } from '../constants';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'ภาพรวมระบบ', icon: <LayoutDashboard size={20} /> },
    { id: 'applications', label: 'จัดการใบสมัคร', icon: <FileText size={20} /> },
    { id: 'email', label: 'ส่งอีเมลแจ้งผล', icon: <Mail size={20} /> },
    { id: 'users', label: 'ผู้ดูแลระบบ', icon: <Shield size={20} /> },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col shadow-sm fixed left-0 top-0 h-full z-10">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-pink-700 flex items-center gap-2">
          Admin Portal
        </h1>
        <p className="text-xs text-gray-500 mt-1">{SCHOOL_NAME}</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium
              ${currentView === item.id
                ? 'bg-pink-50 text-pink-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={() => setCurrentView('logout')}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
        >
          <LogOut size={20} />
          ออกจากระบบ
        </button>
      </div>
    </div>
  );
};

export default Sidebar;