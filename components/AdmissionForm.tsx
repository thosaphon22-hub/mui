
import React, { useState, useEffect } from 'react';
import { StudyLevel, StudyPlan, StudentApplication, ApplicationStatus } from '../types';
import { validateThaiID, validatePhone } from '../utils/validators';
import { Save, ChevronRight, ChevronLeft, Upload, FileText, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { ACADEMIC_YEAR, CURRENT_ROUND, GOOGLE_SCRIPT_URL } from '../constants';
import { fileToBase64, submitApplicationToSheet } from '../services/googleApiService';

interface AdmissionFormProps {
  onSubmit: (data: Partial<StudentApplication>) => void;
  onCancel: () => void;
}

// ย้ายออกมาด้านนอก เพื่อแก้ปัญหา input หลุดโฟกัสเวลาพิมพ์
const Input = ({ label, value, onChange, placeholder, required = false, type = 'text', width = 'w-full' }: any) => (
  <div className={`mb-5 ${width}`}>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label} {required && <span className="text-pink-600">*</span>}
    </label>
    <input
      type={type}
      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-100 focus:border-pink-500 outline-none transition-all shadow-sm text-gray-800 bg-white hover:border-pink-300 placeholder-gray-400"
      placeholder={placeholder}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

const Select = ({ label, value, onChange, options, required = false, width = 'w-full' }: any) => (
  <div className={`mb-5 ${width}`}>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label} {required && <span className="text-pink-600">*</span>}
    </label>
    <div className="relative">
      <select
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-100 focus:border-pink-500 outline-none bg-white shadow-sm text-gray-800 hover:border-pink-300 cursor-pointer appearance-none"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
      >
        <option value="">-- กรุณาเลือก --</option>
        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
      </div>
    </div>
  </div>
);

const AdmissionForm: React.FC<AdmissionFormProps> = ({ onSubmit, onCancel }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<StudentApplication>>({
    academicYear: ACADEMIC_YEAR,
    round: CURRENT_ROUND,
    nationality: 'ไทย',
    ethnicity: 'ไทย',
    religion: 'พุทธ',
    currentAddress: { houseNo: '', subDistrict: '', district: '', province: '', postalCode: '' },
    registeredAddress: { houseNo: '', subDistrict: '', district: '', province: '', postalCode: '' },
    guardian: { relation: 'บิดา', fullName: '', phone: '' },
    documents: {}
  });
  
  // Load draft
  useEffect(() => {
    try {
      const saved = localStorage.getItem('admission_draft');
      if (saved) {
        if (confirm('พบข้อมูลแบบร่างที่บันทึกไว้ ต้องการเรียกคืนหรือไม่?')) {
          setFormData(JSON.parse(saved));
        }
      }
    } catch (e) {
      console.error("Failed to load draft:", e);
    }
  }, []);

  const handleSaveDraft = () => {
    try {
      localStorage.setItem('admission_draft', JSON.stringify(formData));
      alert('บันทึกแบบร่างเรียบร้อยแล้ว');
    } catch (e) {
      console.warn("Full draft save failed, retrying without documents:", e);
      try {
        const draftWithoutDocs = { ...formData, documents: {} };
        localStorage.setItem('admission_draft', JSON.stringify(draftWithoutDocs));
        alert('บันทึกข้อมูลแบบร่างเรียบร้อยแล้ว (ไม่รวมรูปภาพประกอบ เนื่องจากไฟล์มีขนาดใหญ่เกินพื้นที่จัดเก็บของเบราว์เซอร์)');
      } catch (e2) {
        console.error("Draft save failed:", e2);
        alert('ไม่สามารถบันทึกแบบร่างได้ พื้นที่จัดเก็บเต็ม');
      }
    }
  };

  const handleChange = (field: string, value: any, section?: string) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...(prev as any)[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleFileChange = async (docId: string, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('ขนาดไฟล์ต้องไม่เกิน 5MB');
      return;
    }
    try {
      const base64 = await fileToBase64(file);
      handleChange(docId, base64, 'documents');
    } catch (e) {
      alert('เกิดข้อผิดพลาดในการอ่านไฟล์');
    }
  };

  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      if (!formData.prefix || !formData.thFirstName || !formData.thLastName) return false;
      if (!validateThaiID(formData.nationalId || '')) {
        alert('กรุณากรอกเลขบัตรประชาชนให้ถูกต้อง (13 หลัก)');
        return false;
      }
      if (!formData.birthDate) return false;
    }
    if (currentStep === 2) {
      if (!validatePhone(formData.phone || '')) {
        alert('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก)');
        return false;
      }
      if (!formData.currentAddress?.province || !formData.currentAddress?.district) return false;
    }
    if (currentStep === 4) {
      if (!formData.level || !formData.studyPlan) return false;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      alert('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    if (!formData.documents?.transcript || !formData.documents?.houseReg) {
        alert('กรุณาอัปโหลดเอกสารจำเป็น (ปพ. และ ทะเบียนบ้าน)');
        return;
    }

    if (confirm('ยืนยันการส่งใบสมัคร? ข้อมูลจะไม่สามารถแก้ไขได้หลังจากส่ง')) {
        setIsSubmitting(true);
        
        try {
          // Generate ID
          const newId = `APP${ACADEMIC_YEAR.substr(2)}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
          const finalData = {
              ...formData,
              id: newId,
              status: ApplicationStatus.NEW,
              appliedDate: new Date().toISOString()
          } as StudentApplication;

          // Call API Service
          const result = await submitApplicationToSheet(finalData);
          
          if (result.success) {
              localStorage.removeItem('admission_draft');
              onSubmit(finalData);
          } else {
              alert('เกิดข้อผิดพลาดในการส่งข้อมูล: ' + (result.message || 'Unknown Error'));
          }
        } catch (e) {
          console.error("Submission error:", e);
          alert('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง');
        } finally {
          setIsSubmitting(false);
        }
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden my-8 animate-fade-in">
      {/* Warning if no API Key */}
      {!GOOGLE_SCRIPT_URL && (
        <div className="bg-yellow-50 p-4 text-yellow-800 text-sm flex items-center gap-2 justify-center border-b border-yellow-100">
            <AlertTriangle size={16} />
            <span>คำเตือน: ยังไม่ได้ระบุ GOOGLE_SCRIPT_URL ข้อมูลจะถูกบันทึกแบบจำลองเท่านั้น</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-pink-700 to-pink-600 p-8 text-white flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <FileText size={120} />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold tracking-tight">แบบฟอร์มสมัครเรียน</h2>
          <p className="text-pink-100 mt-2 font-medium bg-white/20 inline-block px-3 py-1 rounded-full text-sm backdrop-blur-sm">
            ปีการศึกษา {ACADEMIC_YEAR} • {CURRENT_ROUND}
          </p>
        </div>
        <button onClick={handleSaveDraft} className="relative z-10 flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition backdrop-blur-md border border-white/20">
          <Save size={16} /> <span className="hidden sm:inline">บันทึกแบบร่าง</span>
        </button>
      </div>

      {/* Stepper */}
      <div className="flex border-b border-gray-100 bg-gray-50/50">
        {[1, 2, 3, 4, 5].map((s) => (
          <div 
            key={s} 
            className={`flex-1 py-4 text-center text-sm font-semibold border-b-4 transition-all duration-300 ${
              step === s 
                ? 'border-pink-600 text-pink-700 bg-white' 
                : step > s 
                  ? 'border-green-500 text-green-600' 
                  : 'border-transparent text-gray-400'
            }`}
          >
            <div className="flex flex-col items-center gap-1">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === s ? 'bg-pink-100' : step > s ? 'bg-green-100' : 'bg-gray-200'} `}>
                    {step > s ? <CheckCircle size={14} /> : s}
                </span>
                <span className="hidden sm:inline">
                    {s === 1 && 'ข้อมูลผู้สมัคร'}
                    {s === 2 && 'ที่อยู่/ติดต่อ'}
                    {s === 3 && 'ผู้ปกครอง'}
                    {s === 4 && 'แผนการเรียน'}
                    {s === 5 && 'เอกสาร'}
                </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 md:p-10">
        {step === 1 && (
          <div className="animate-fade-in space-y-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 pb-4 border-b border-gray-100">
                <span className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600 text-sm">1</span>
                ข้อมูลส่วนตัวนักเรียน
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select label="คำนำหน้า" value={formData.prefix} onChange={(v: string) => handleChange('prefix', v)} options={['เด็กหญิง', 'เด็กชาย', 'นางสาว', 'นาย']} required />
              <Input label="เลขบัตรประชาชน (13 หลัก)" value={formData.nationalId} onChange={(v: string) => handleChange('nationalId', v)} required />
              <Input label="ชื่อ (ภาษาไทย)" value={formData.thFirstName} onChange={(v: string) => handleChange('thFirstName', v)} required />
              <Input label="นามสกุล (ภาษาไทย)" value={formData.thLastName} onChange={(v: string) => handleChange('thLastName', v)} required />
              <Input label="ชื่อ (ภาษาอังกฤษ)" value={formData.enFirstName} onChange={(v: string) => handleChange('enFirstName', v)} />
              <Input label="นามสกุล (ภาษาอังกฤษ)" value={formData.enLastName} onChange={(v: string) => handleChange('enLastName', v)} />
              <Input label="วันเกิด" type="date" value={formData.birthDate} onChange={(v: string) => handleChange('birthDate', v)} required />
              <Select label="ศาสนา" value={formData.religion} onChange={(v: string) => handleChange('religion', v)} options={['พุทธ', 'คริสต์', 'อิสลาม', 'ซิกข์', 'อื่นๆ']} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in space-y-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 pb-4 border-b border-gray-100">
                <span className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600 text-sm">2</span>
                ที่อยู่และข้อมูลติดต่อ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
              <Input label="เบอร์โทรศัพท์นักเรียน" value={formData.phone} onChange={(v: string) => handleChange('phone', v)} placeholder="0xx-xxx-xxxx" required />
              <Input label="อีเมล" type="email" value={formData.email} onChange={(v: string) => handleChange('email', v)} required />
            </div>
            
            <div className="space-y-4">
                <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                    <div className="w-1 h-6 bg-pink-500 rounded-full"></div>
                    ที่อยู่ปัจจุบัน
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="บ้านเลขที่" value={formData.currentAddress?.houseNo} onChange={(v: string) => handleChange('houseNo', v, 'currentAddress')} required />
                <Input label="หมู่ที่" value={formData.currentAddress?.moo} onChange={(v: string) => handleChange('moo', v, 'currentAddress')} />
                <Input label="ซอย" value={formData.currentAddress?.soi} onChange={(v: string) => handleChange('soi', v, 'currentAddress')} />
                <Input label="ถนน" value={formData.currentAddress?.road} onChange={(v: string) => handleChange('road', v, 'currentAddress')} />
                <Input label="ตำบล/แขวง" value={formData.currentAddress?.subDistrict} onChange={(v: string) => handleChange('subDistrict', v, 'currentAddress')} required />
                <Input label="อำเภอ/เขต" value={formData.currentAddress?.district} onChange={(v: string) => handleChange('district', v, 'currentAddress')} required />
                <Input label="จังหวัด" value={formData.currentAddress?.province} onChange={(v: string) => handleChange('province', v, 'currentAddress')} required />
                <Input label="รหัสไปรษณีย์" value={formData.currentAddress?.postalCode} onChange={(v: string) => handleChange('postalCode', v, 'currentAddress')} required />
                </div>
            </div>

            <div className="p-4 bg-pink-50 rounded-xl border border-pink-100 flex items-center gap-3 cursor-pointer hover:bg-pink-100 transition" onClick={() => handleChange('registeredAddress', formData.currentAddress)}>
                 <div className="bg-white p-1 rounded border border-pink-200">
                    <input 
                    type="checkbox" 
                    className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500 cursor-pointer"
                    onChange={(e) => {
                        if (e.target.checked) handleChange('registeredAddress', formData.currentAddress);
                    }}
                    /> 
                 </div>
                 <label className="text-sm font-medium text-pink-800 cursor-pointer select-none">
                    ใช้ที่อยู่เดียวกับที่อยู่ปัจจุบันสำหรับ "ที่อยู่ตามทะเบียนบ้าน"
                 </label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in space-y-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 pb-4 border-b border-gray-100">
                <span className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600 text-sm">3</span>
                ข้อมูลผู้ปกครอง
            </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-8 rounded-xl border border-gray-100">
              <Select label="ความสัมพันธ์" value={formData.guardian?.relation} onChange={(v: string) => handleChange('relation', v, 'guardian')} options={['บิดา', 'มารดา', 'ปู่/ย่า/ตา/ยาย', 'พี่น้อง', 'อื่นๆ']} required />
              <Input label="ชื่อ-นามสกุล ผู้ปกครอง" value={formData.guardian?.fullName} onChange={(v: string) => handleChange('fullName', v, 'guardian')} required />
              <Input label="เบอร์โทรศัพท์ผู้ปกครอง" value={formData.guardian?.phone} onChange={(v: string) => handleChange('phone', v, 'guardian')} required />
              <Input label="อีเมลผู้ปกครอง (ถ้ามี)" value={formData.guardian?.email} onChange={(v: string) => handleChange('email', v, 'guardian')} />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in space-y-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 pb-4 border-b border-gray-100">
                <span className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600 text-sm">4</span>
                ระดับชั้นและแผนการเรียน
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                className={`p-6 border-2 rounded-2xl transition-all cursor-pointer relative overflow-hidden group ${formData.level === StudyLevel.M1 ? 'border-pink-500 bg-pink-50 shadow-md ring-1 ring-pink-500' : 'border-gray-200 hover:border-pink-300 hover:shadow-lg bg-white'}`} 
                onClick={() => handleChange('level', StudyLevel.M1)}
              >
                 <div className="flex items-center gap-4">
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-colors ${formData.level === StudyLevel.M1 ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-pink-100 group-hover:text-pink-600'}`}>1</div>
                   <div>
                       <span className="font-bold text-lg text-gray-800 block">ระดับชั้น ม.1</span>
                       <span className="text-xs text-gray-500">มัธยมศึกษาปีที่ 1</span>
                   </div>
                   <input type="radio" name="level" checked={formData.level === StudyLevel.M1} onChange={() => handleChange('level', StudyLevel.M1)} className="ml-auto w-5 h-5 text-pink-600 focus:ring-pink-500" />
                 </div>
                 
                 {formData.level === StudyLevel.M1 && (
                   <div className="mt-6 pt-4 border-t border-pink-200 space-y-3 animate-fade-in">
                     <p className="text-sm font-semibold text-pink-800 mb-2">เลือกแผนการเรียน:</p>
                     {[StudyPlan.M1_NORMAL, StudyPlan.M1_ENGLISH].map(p => (
                       <label key={p} className="flex items-center gap-3 text-gray-700 cursor-pointer p-3 rounded-lg bg-white border border-pink-100 hover:border-pink-300 transition">
                         <input type="radio" name="plan" checked={formData.studyPlan === p} onChange={() => handleChange('studyPlan', p)} className="text-pink-600 focus:ring-pink-500 w-4 h-4" />
                         <span className="font-medium">{p}</span>
                       </label>
                     ))}
                   </div>
                 )}
              </div>

              <div 
                className={`p-6 border-2 rounded-2xl transition-all cursor-pointer relative overflow-hidden group ${formData.level === StudyLevel.M4 ? 'border-pink-500 bg-pink-50 shadow-md ring-1 ring-pink-500' : 'border-gray-200 hover:border-pink-300 hover:shadow-lg bg-white'}`} 
                onClick={() => handleChange('level', StudyLevel.M4)}
              >
                 <div className="flex items-center gap-4">
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-colors ${formData.level === StudyLevel.M4 ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-pink-100 group-hover:text-pink-600'}`}>4</div>
                   <div>
                       <span className="font-bold text-lg text-gray-800 block">ระดับชั้น ม.4</span>
                       <span className="text-xs text-gray-500">มัธยมศึกษาปีที่ 4</span>
                   </div>
                   <input type="radio" name="level" checked={formData.level === StudyLevel.M4} onChange={() => handleChange('level', StudyLevel.M4)} className="ml-auto w-5 h-5 text-pink-600 focus:ring-pink-500" />
                 </div>
                 
                  {formData.level === StudyLevel.M4 && (
                   <div className="mt-6 pt-4 border-t border-pink-200 space-y-3 animate-fade-in">
                     <p className="text-sm font-semibold text-pink-800 mb-2">เลือกแผนการเรียน:</p>
                     {[StudyPlan.SCI_MATH, StudyPlan.ENG_MATH, StudyPlan.ENG_LANG, StudyPlan.GEN_ART].map(p => (
                       <label key={p} className="flex items-center gap-3 text-gray-700 cursor-pointer p-3 rounded-lg bg-white border border-pink-100 hover:border-pink-300 transition">
                         <input type="radio" name="plan" checked={formData.studyPlan === p} onChange={() => handleChange('studyPlan', p)} className="text-pink-600 focus:ring-pink-500 w-4 h-4" />
                         <span className="font-medium">{p}</span>
                       </label>
                     ))}
                   </div>
                 )}
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="animate-fade-in space-y-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 pb-4 border-b border-gray-100">
                <span className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600 text-sm">5</span>
                เอกสารประกอบการสมัคร
            </h3>
            
            <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl mb-6 text-sm text-blue-800 flex gap-3">
              <div className="bg-blue-100 p-2 rounded-full h-fit"><FileText size={20} className="text-blue-600"/></div>
              <div>
                <p className="font-bold text-blue-900 mb-1">คำชี้แจงการอัปโหลดเอกสาร:</p>
                <ul className="list-disc pl-5 space-y-1 text-blue-800/80">
                    <li>กรุณาอัปโหลดไฟล์เป็น PDF หรือ JPG ขนาดไม่เกิน 5MB</li>
                    <li>เอกสารต้องชัดเจน อ่านง่าย ไม่เบลอ</li>
                    <li>ระบบจะอัปโหลดไฟล์และสร้างโฟลเดอร์อัตโนมัติเมื่อกด "ยืนยันการสมัคร"</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: 'transcript', label: 'ปพ.1 หรือ ปพ.7', desc: 'ระเบียนแสดงผลการเรียน' },
                { id: 'houseReg', label: 'สำเนาทะเบียนบ้าน', desc: 'หน้าที่มีชื่อนักเรียน' },
                { id: 'guardianCert', label: 'หนังสือรับรอง', desc: 'กรณีเจ้าบ้านไม่ใช่พ่อแม่' }
              ].map((doc) => (
                <div key={doc.id} className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-pink-50 hover:border-pink-300 transition-all group cursor-pointer relative bg-white">
                  <div className={`p-4 rounded-full mb-3 transition-colors ${ (formData.documents as any)?.[doc.id] ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400 group-hover:bg-pink-200 group-hover:text-pink-600' }`}>
                    {(formData.documents as any)?.[doc.id] ? <CheckCircle size={32} /> : <Upload size={32} />}
                  </div>
                  <h4 className="font-bold text-gray-800 mb-1">{doc.label}</h4>
                  <p className="text-xs text-gray-500 mb-4">{doc.desc}</p>
                  
                  <input 
                    type="file" 
                    className="hidden" 
                    id={`file-${doc.id}`}
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={(e) => {
                       if (e.target.files?.[0]) {
                         handleFileChange(doc.id, e.target.files[0]);
                       }
                    }}
                  />
                  <label 
                    htmlFor={`file-${doc.id}`}
                    className={`cursor-pointer px-6 py-2 rounded-full text-sm font-semibold shadow-sm transition-all transform group-hover:-translate-y-1 ${
                        (formData.documents as any)?.[doc.id] 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-white border border-gray-300 text-gray-700 hover:border-pink-500 hover:text-pink-600'
                    }`}
                  >
                    {(formData.documents as any)?.[doc.id] ? 'เปลี่ยนไฟล์' : 'เลือกไฟล์'}
                  </label>
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex items-start gap-3 p-5 bg-gray-50 rounded-xl border border-gray-200">
              <input type="checkbox" id="confirm" className="w-5 h-5 rounded border-gray-300 text-pink-600 focus:ring-pink-500 mt-0.5 cursor-pointer" />
              <label htmlFor="confirm" className="text-sm font-medium text-gray-700 cursor-pointer leading-relaxed">
                ข้าพเจ้าขอรับรองว่าข้อมูลข้างต้นเป็นความจริงทุกประการ หากมีการตรวจสอบพบว่าเป็นเท็จ ข้าพเจ้ายินยอมให้ทางโรงเรียนตัดสิทธิ์การสมัครโดยไม่มีเงื่อนไข และยินยอมให้โรงเรียนนำข้อมูลไปใช้เพื่อการศึกษา
              </label>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-10 pt-8 border-t border-gray-100">
          {step > 1 ? (
            <button 
              onClick={prevStep}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-semibold transition hover:shadow-sm disabled:opacity-50"
            >
              <ChevronLeft size={20} /> ย้อนกลับ
            </button>
          ) : (
            <button 
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6 py-3 border border-gray-200 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 font-semibold transition hover:border-red-200 disabled:opacity-50"
            >
              ยกเลิก
            </button>
          )}

          {step < 5 ? (
            <button 
              onClick={nextStep}
              className="flex items-center gap-2 px-8 py-3 bg-pink-700 text-white rounded-xl hover:bg-pink-800 font-semibold shadow-lg shadow-pink-200 transition-all transform hover:-translate-y-1 hover:shadow-xl"
            >
              ถัดไป <ChevronRight size={20} />
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:from-green-700 hover:to-green-600 font-bold shadow-lg shadow-green-200 transition-all transform hover:-translate-y-1 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> กำลังส่งข้อมูล...
                </>
              ) : (
                <>
                  ยืนยันการสมัคร <CheckCircle size={20} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdmissionForm;
