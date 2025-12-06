
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ApplicationTable from './components/ApplicationTable';
import EmailManager from './components/EmailManager';
import AdminManager from './components/AdminManager';
import PublicHeader from './components/PublicHeader';
import AdmissionForm from './components/AdmissionForm';
import StatusCheck from './components/StatusCheck';
import SubmissionSuccess from './components/SubmissionSuccess';
import { MOCK_APPLICATIONS, SCHOOL_NAME, GOOGLE_SCRIPT_URL } from './constants';
import { ApplicationStatus, StudentApplication } from './types';
import { LogIn } from 'lucide-react';
import { fetchApplicationsFromSheet } from './services/googleApiService';

const App: React.FC = () => {
  // Navigation State
  const [view, setView] = useState('landing'); // landing, form, status_check, success, admin_login, admin_*
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Data State
  const [applications, setApplications] = useState(MOCK_APPLICATIONS);
  const [lastSubmittedApp, setLastSubmittedApp] = useState<StudentApplication | null>(null);

  // Fetch real data when entering admin or status check
  useEffect(() => {
    if (GOOGLE_SCRIPT_URL && (isAdmin || view === 'status_check')) {
        setLoading(true);
        fetchApplicationsFromSheet().then(data => {
            if (data.length > 0) {
                setApplications(data);
            }
            setLoading(false);
        });
    }
  }, [view, isAdmin]);

  // Admin Actions
  const handleUpdateStatus = (ids: string[], status: ApplicationStatus) => {
    // Note: Real update requires API call to Update, currently handling locally for UI
    setApplications(prev => prev.map(app => 
      ids.includes(app.id) ? { ...app, status, lastUpdated: new Date().toISOString() } : app
    ));
    // TODO: Implement API updateStatus call
  };

  // Public Actions
  const handlePublicSubmit = (data: Partial<StudentApplication>) => {
    const newApp = data as StudentApplication;
    // Add locally for immediate feedback if navigating to other pages without refresh
    setApplications(prev => [newApp, ...prev]);
    setLastSubmittedApp(newApp);
    setView('success');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdmin(true);
    setView('admin_dashboard');
  };

  // Render Logic
  const renderPublicContent = () => {
    switch (view) {
      case 'form':
        return <AdmissionForm onSubmit={handlePublicSubmit} onCancel={() => setView('landing')} />;
      case 'status_check':
        return loading ? <div className="text-center p-20">Loading...</div> : <StatusCheck applications={applications} />;
      case 'success':
        return lastSubmittedApp ? <SubmissionSuccess application={lastSubmittedApp} onHome={() => setView('landing')} /> : <div>Error</div>;
      case 'admin_login':
        return (
          <div className="flex items-center justify-center min-h-[60vh]">
             <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 w-full max-w-md animate-fade-in">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">เจ้าหน้าที่เข้าสู่ระบบ</h2>
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition" placeholder="admin" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input type="password" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition" placeholder="••••••" required />
                  </div>
                  <button type="submit" className="w-full bg-pink-700 text-white py-2 rounded-lg hover:bg-pink-800 font-medium transition shadow-md">
                    เข้าสู่ระบบ
                  </button>
                </form>
                <button onClick={() => setView('landing')} className="w-full text-center text-sm text-gray-500 mt-4 hover:text-pink-600 transition">กลับหน้าหลัก</button>
             </div>
          </div>
        );
      default: // Landing
        return (
          <div className="text-center py-16 px-4 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-pink-800 mb-4 tracking-tight">{SCHOOL_NAME}</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">เปิดรับสมัครนักเรียนใหม่ ชั้นมัธยมศึกษาปีที่ 1 และ 4 ปีการศึกษา 2569</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setView('form')}
                className="px-8 py-4 bg-pink-700 text-white rounded-xl text-lg font-semibold hover:bg-pink-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                สมัครเรียนออนไลน์
              </button>
              <button 
                onClick={() => setView('status_check')}
                className="px-8 py-4 bg-white text-pink-700 border-2 border-pink-700 rounded-xl text-lg font-semibold hover:bg-pink-50 transition"
              >
                ตรวจสอบสถานะ
              </button>
            </div>
            
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition transform hover:-translate-y-1">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4 text-pink-700 font-bold text-xl">1</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">กรอกข้อมูล</h3>
                <p className="text-gray-500">กรอกข้อมูลส่วนตัวและผู้ปกครองให้ครบถ้วนผ่านระบบออนไลน์</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition transform hover:-translate-y-1">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4 text-pink-700 font-bold text-xl">2</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">อัปโหลดเอกสาร</h3>
                <p className="text-gray-500">แนบไฟล์ ปพ.1/ปพ.7 และทะเบียนบ้านเพื่อประกอบการพิจารณา</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition transform hover:-translate-y-1">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4 text-pink-700 font-bold text-xl">3</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">รอประกาศผล</h3>
                <p className="text-gray-500">ตรวจสอบรายชื่อผู้มีสิทธิ์สอบและผลการคัดเลือกผ่านเว็บไซต์</p>
              </div>
            </div>
          </div>
        );
    }
  };

  const renderAdminContent = () => {
    switch (view) {
      case 'admin_dashboard':
        return <Dashboard applications={applications} />;
      case 'admin_applications':
        return <ApplicationTable applications={applications} onUpdateStatus={handleUpdateStatus} />;
      case 'admin_email':
        return <EmailManager />;
      case 'admin_users':
        return <AdminManager />;
      default:
        return <Dashboard applications={applications} />;
    }
  };

  if (isAdmin) {
    return (
      <div className="flex min-h-screen bg-gray-50 font-sans">
        <Sidebar currentView={view.replace('admin_', '')} setCurrentView={(v) => {
           if (v === 'logout') {
             setIsAdmin(false);
             setView('landing');
           } else {
             setView(`admin_${v}`); 
           }
        }} />
        <main className="flex-1 ml-64 p-8 animate-fade-in">
          <div className="max-w-7xl mx-auto">
            {loading ? <div className="text-center">Loading Data...</div> : renderAdminContent()}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      <PublicHeader onNavigate={setView} currentView={view} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
        {renderPublicContent()}
      </main>
      
      {view === 'landing' && (
        <footer className="bg-gray-900 text-white py-12 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="font-bold text-2xl mb-2">{SCHOOL_NAME}</h2>
            <p className="text-gray-400 text-sm mb-8">มุ่งมั่นพัฒนาผู้เรียนสู่ความเป็นเลิศ</p>
            <div className="border-t border-gray-800 pt-8 text-xs text-gray-500">
              ระบบรับสมัครนักเรียนออนไลน์ © {new Date().getFullYear()} All rights reserved.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
