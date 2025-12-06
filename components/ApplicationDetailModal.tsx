import React from 'react';
import { StudentApplication, ApplicationStatus } from '../types';
import { X, User, MapPin, Phone, FileText, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { maskThaiID } from '../utils/validators';

interface ApplicationDetailModalProps {
  application: StudentApplication;
  onClose: () => void;
  onUpdateStatus: (status: ApplicationStatus) => void;
}

const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({ application, onClose, onUpdateStatus }) => {
  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.APPROVED: return 'bg-green-100 text-green-800';
      case ApplicationStatus.REJECTED: return 'bg-red-100 text-red-800';
      case ApplicationStatus.INCOMPLETE: return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in border border-gray-200 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur border-b px-6 py-4 flex justify-between items-center z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-xl font-bold text-gray-800">รายละเอียดใบสมัคร</h3>
              <div className="flex items-center gap-2 mt-1">
                 <span className="font-mono text-sm text-pink-600 font-medium">{application.id}</span>
                 <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getStatusColor(application.status)}`}>
                   {application.status}
                 </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8 overflow-y-auto grow">
          {/* Section 1: Student Info */}
          <section>
            <h4 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4 pb-2 border-b">
              <User size={20} className="text-pink-600" /> ข้อมูลนักเรียน
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
              <div className="space-y-1">
                <span className="text-gray-500 text-xs uppercase font-semibold">ชื่อ-นามสกุล</span>
                <p className="font-medium text-gray-900">{application.prefix}{application.thFirstName} {application.thLastName}</p>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 text-xs uppercase font-semibold">Name (Eng)</span>
                <p className="font-medium text-gray-900">{application.enFirstName || '-'} {application.enLastName || '-'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 text-xs uppercase font-semibold">เลขบัตรประชาชน</span>
                <p className="font-medium text-gray-900 font-mono">{maskThaiID(application.nationalId)}</p>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 text-xs uppercase font-semibold">วันเกิด</span>
                <p className="font-medium text-gray-900">{application.birthDate}</p>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 text-xs uppercase font-semibold">ศาสนา</span>
                <p className="font-medium text-gray-900">{application.religion}</p>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 text-xs uppercase font-semibold">ระดับชั้นที่สมัคร</span>
                <p className="font-medium text-gray-900">{application.level}</p>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 text-xs uppercase font-semibold">แผนการเรียน</span>
                <p className="font-medium text-gray-900">{application.studyPlan}</p>
              </div>
            </div>
          </section>

          {/* Section 2: Contact & Address */}
          <section className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h4 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
              <MapPin size={20} className="text-pink-600" /> ที่อยู่และข้อมูลติดต่อ
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
              <div className="space-y-1">
                <span className="text-gray-500 text-xs uppercase font-semibold">เบอร์โทรศัพท์</span>
                <p className="font-medium text-gray-900">{application.phone}</p>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 text-xs uppercase font-semibold">อีเมล</span>
                <p className="font-medium text-gray-900">{application.email}</p>
              </div>
              <div className="md:col-span-2 space-y-1">
                <span className="text-gray-500 text-xs uppercase font-semibold">ที่อยู่ปัจจุบัน</span>
                <p className="font-medium text-gray-900">
                   {application.currentAddress?.houseNo} 
                   {application.currentAddress?.moo ? ` หมู่ ${application.currentAddress.moo}` : ''}
                   {application.currentAddress?.soi ? ` ซอย ${application.currentAddress.soi}` : ''}
                   {application.currentAddress?.road ? ` ถนน ${application.currentAddress.road}` : ''}
                   {` ต.${application.currentAddress?.subDistrict} อ.${application.currentAddress?.district} จ.${application.currentAddress?.province} ${application.currentAddress?.postalCode}`}
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Guardian */}
          <section>
            <h4 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4 pb-2 border-b">
              <Phone size={20} className="text-pink-600" /> ผู้ปกครอง
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
              <div className="space-y-1">
                <span className="text-gray-500 text-xs uppercase font-semibold">ชื่อ-นามสกุล</span>
                <p className="font-medium text-gray-900">{application.guardian?.fullName}</p>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 text-xs uppercase font-semibold">ความสัมพันธ์</span>
                <p className="font-medium text-gray-900">{application.guardian?.relation}</p>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 text-xs uppercase font-semibold">เบอร์โทรศัพท์</span>
                <p className="font-medium text-gray-900">{application.guardian?.phone}</p>
              </div>
            </div>
          </section>

           {/* Section 4: Documents */}
           <section>
            <h4 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4 pb-2 border-b">
              <FileText size={20} className="text-pink-600" /> เอกสารแนบ
            </h4>
            <div className="space-y-2">
               {Object.entries(application.documents).map(([key, url]) => (
                 <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition bg-white shadow-sm">
                   <span className="text-sm font-medium text-gray-700 capitalize">{key}</span>
                   <a href={url} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800 hover:underline text-sm font-medium flex items-center gap-1">
                     <FileText size={16} /> เปิดดูไฟล์
                   </a>
                 </div>
               ))}
               {Object.keys(application.documents).length === 0 && <p className="text-sm text-gray-500 italic p-2">ไม่มีเอกสารแนบ</p>}
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-200 shrink-0">
          <div className="text-xs text-gray-400">
             แก้ไขล่าสุด: {new Date(application.lastUpdated).toLocaleString('th-TH')}
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            {application.status !== ApplicationStatus.REJECTED && (
                <button 
                onClick={() => { if(confirm('ยืนยันปฏิเสธคำขอนี้?')) onUpdateStatus(ApplicationStatus.REJECTED); }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 transition text-sm font-semibold"
                >
                <XCircle size={16} /> ไม่ผ่าน
                </button>
            )}
            
            {application.status !== ApplicationStatus.INCOMPLETE && (
                <button 
                onClick={() => onUpdateStatus(ApplicationStatus.INCOMPLETE)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-4 py-2 border border-orange-200 text-orange-600 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition text-sm font-semibold"
                >
                <AlertCircle size={16} /> เอกสารไม่ครบ
                </button>
            )}

            {application.status !== ApplicationStatus.APPROVED && (
                <button 
                onClick={() => { if(confirm('ยืนยันอนุมัติใบสมัครนี้?')) onUpdateStatus(ApplicationStatus.APPROVED); }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md transition text-sm font-bold transform hover:-translate-y-0.5"
                >
                <CheckCircle size={16} /> อนุมัติการสมัคร
                </button>
            )}
             
            {application.status === ApplicationStatus.APPROVED && (
                <span className="flex items-center gap-2 text-green-600 font-bold px-4">
                    <CheckCircle size={20} /> อนุมัติแล้ว
                </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailModal;