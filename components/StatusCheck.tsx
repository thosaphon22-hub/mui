import React, { useState } from 'react';
import { StudentApplication } from '../types';
import { Search, ArrowRight, User, Calendar } from 'lucide-react';
import { maskThaiID } from '../utils/validators';

interface StatusCheckProps {
  applications: StudentApplication[];
}

const StatusCheck: React.FC<StatusCheckProps> = ({ applications }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<StudentApplication | null | 'not_found'>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    // Search by ID (case insensitive), National ID, or Phone
    const found = applications.find(app => 
      app.id.toLowerCase() === query.toLowerCase() || 
      app.nationalId === query ||
      app.phone === query
    );

    setResult(found || 'not_found');
  };

  return (
    <div className="max-w-xl mx-auto my-16 px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">ตรวจสอบสถานะการสมัคร</h2>
        <p className="text-gray-500">กรอกเลขบัตรประชาชน, เบอร์โทรศัพท์ หรือเลขที่ใบสมัคร</p>
      </div>

      <div className="bg-white p-2 rounded-xl shadow-lg border border-gray-200 flex mb-8 focus-within:ring-2 focus-within:ring-pink-500 transition-all">
        <input 
          type="text" 
          placeholder="ค้นหา..." 
          className="flex-1 px-4 py-3 outline-none text-gray-700 rounded-l-lg"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          onClick={handleSearch}
          className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <Search size={20} /> ค้นหา
        </button>
      </div>

      {result === 'not_found' && (
        <div className="text-center p-8 bg-gray-50 rounded-xl border border-gray-200 animate-fade-in">
          <p className="text-gray-500">ไม่พบข้อมูลใบสมัคร กรุณาตรวจสอบข้อมูลอีกครั้ง</p>
        </div>
      )}

      {result && result !== 'not_found' && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-fade-in">
          <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <span className="font-mono text-gray-500 font-medium">{result.id}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
              ${result.status.includes('ผ่าน') ? 'bg-green-100 text-green-700' : 
                result.status.includes('ไม่') ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-800'}`}>
              {result.status}
            </span>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <User className="text-pink-600" size={20} />
              {result.prefix}{result.thFirstName} {result.thLastName}
            </h3>
            <p className="text-gray-500 mb-6 pl-7">{result.level} - {result.studyPlan}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-gray-400 text-xs mb-1">วันที่สมัคร</p>
                <p className="font-medium flex items-center gap-2">
                   <Calendar size={14} className="text-gray-400"/> 
                   {new Date(result.appliedDate).toLocaleDateString('th-TH')}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">อัปเดตล่าสุด</p>
                <p className="font-medium">
                  {new Date(result.lastUpdated).toLocaleDateString('th-TH')}
                </p>
              </div>
            </div>

            {result.status === 'เอกสารไม่สมบูรณ์' && (
              <div className="mt-6 bg-red-50 p-4 rounded-lg border border-red-100 text-red-700 text-sm flex gap-3">
                 <div className="min-w-[4px] bg-red-400 rounded-full"></div>
                 <div>
                    <strong>หมายเหตุ:</strong> เอกสารไม่ครบถ้วน กรุณาติดต่อโรงเรียนเพื่อดำเนินการแก้ไขโดยด่วน
                 </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusCheck;