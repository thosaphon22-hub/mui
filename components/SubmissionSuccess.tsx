import React from 'react';
import { StudentApplication } from '../types';
import { CheckCircle, Printer, Home } from 'lucide-react';
import { SCHOOL_NAME } from '../constants';

interface SubmissionSuccessProps {
  application: StudentApplication;
  onHome: () => void;
}

const SubmissionSuccess: React.FC<SubmissionSuccessProps> = ({ application, onHome }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto my-12 animate-fade-in">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 to-purple-600"></div>
        
        <div className="mb-6 flex justify-center">
          <div className="bg-green-100 p-4 rounded-full ring-8 ring-green-50">
            <CheckCircle className="text-green-600 w-16 h-16" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-2">บันทึกใบสมัครสำเร็จ</h2>
        <p className="text-gray-500 mb-8">ขอบคุณที่สมัครเข้าศึกษาต่อ {SCHOOL_NAME}</p>

        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-left mb-8">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">ข้อมูลการสมัคร</h3>
          <div className="grid grid-cols-2 gap-y-4 gap-x-8">
            <div>
              <p className="text-xs text-gray-400 mb-1">เลขที่ใบสมัคร</p>
              <p className="text-xl font-mono font-bold text-pink-700">{application.id}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">วันที่สมัคร</p>
              <p className="font-medium text-gray-800">{new Date(application.appliedDate).toLocaleDateString('th-TH')}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">ชื่อผู้สมัคร</p>
              <p className="font-medium text-gray-800">{application.prefix}{application.thFirstName} {application.thLastName}</p>
            </div>
             <div>
              <p className="text-xs text-gray-400 mb-1">ระดับชั้น/แผนการเรียน</p>
              <p className="font-medium text-gray-800">{application.level} - {application.studyPlan}</p>
            </div>
            <div className="col-span-2">
               <p className="text-xs text-gray-400 mb-1">สถานะปัจจุบัน</p>
               <span className="inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                 {application.status}
               </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center print:hidden">
          <button 
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition shadow-md"
          >
            <Printer size={18} /> พิมพ์ใบสมัคร
          </button>
          <button 
            onClick={onHome}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            <Home size={18} /> กลับหน้าแรก
          </button>
        </div>
        
        <div className="mt-8 text-xs text-gray-400">
          <p>กรุณาบันทึกเลขที่ใบสมัครหรือพิมพ์หน้านี้เก็บไว้เพื่อใช้ในการตรวจสอบสถานะ</p>
          <p>หากมีข้อสงสัยติดต่อ: 02-XXX-XXXX</p>
        </div>
      </div>
    </div>
  );
};

export default SubmissionSuccess;