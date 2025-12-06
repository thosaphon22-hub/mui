import React from 'react';
import { SCHOOL_NAME } from '../constants';
import { School, Search, LogIn, Home } from 'lucide-react';

interface PublicHeaderProps {
  onNavigate: (view: string) => void;
  currentView: string;
}

const PublicHeader: React.FC<PublicHeaderProps> = ({ onNavigate, currentView }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate('landing')}
          >
            <div className="bg-pink-700 p-2 rounded-lg text-white">
              <School size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">{SCHOOL_NAME}</h1>
              <p className="text-xs text-gray-500">ระบบรับสมัครนักเรียนออนไลน์</p>
            </div>
          </div>

          <nav className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('landing')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === 'landing' ? 'text-pink-700 bg-pink-50' : 'text-gray-600 hover:text-pink-700'}`}
            >
              <Home size={18} /> <span className="hidden sm:inline">หน้าแรก</span>
            </button>
            <button 
              onClick={() => onNavigate('status_check')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === 'status_check' ? 'text-pink-700 bg-pink-50' : 'text-gray-600 hover:text-pink-700'}`}
            >
              <Search size={18} /> <span className="hidden sm:inline">ตรวจสอบสถานะ</span>
            </button>
            <button 
              onClick={() => onNavigate('admin_login')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              <LogIn size={18} /> <span className="hidden sm:inline">เจ้าหน้าที่</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;