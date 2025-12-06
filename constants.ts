
import { ApplicationStatus, StudyLevel, StudyPlan, StudentApplication, AdminUser, EmailTemplate } from './types';

export const SCHOOL_NAME = "โรงเรียนสตรีนนทบุรี";
export const SCHOOL_LOGO_URL = "https://via.placeholder.com/150?text=SatriNon"; // Placeholder
export const ACADEMIC_YEAR = "2569";
export const CURRENT_ROUND = "รอบปกติ";

// *** สำคัญ: นำ URL จากการ Deploy Google Apps Script มาวางตรงนี้ ***
export const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxrj36IiabNLW8GgntS8qKk0U_RBV8PW1ElO2Nl64T7rc0bsgAhEiwkLGUPvuqTP6jtvw/exec"; 

const mockAddress = {
  houseNo: '123/45',
  subDistrict: 'สวนใหญ่',
  district: 'เมืองนนทบุรี',
  province: 'นนทบุรี',
  postalCode: '11000'
};

export const MOCK_APPLICATIONS: StudentApplication[] = [
  { 
    id: 'APP69001', 
    academicYear: '2569',
    round: 'รอบปกติ',
    prefix: 'ด.ญ.',
    thFirstName: 'สมหญิง', 
    thLastName: 'รักเรียน',
    nationalId: '1123456789012',
    birthDate: '2011-05-15',
    gender: 'หญิง',
    nationality: 'ไทย',
    ethnicity: 'ไทย',
    religion: 'พุทธ',
    phone: '081-111-1111', 
    email: 'somying@example.com',
    currentAddress: mockAddress,
    registeredAddress: mockAddress,
    level: StudyLevel.M1,
    studyPlan: StudyPlan.M1_NORMAL, 
    status: ApplicationStatus.DOCS_OK, 
    appliedDate: '2025-02-15T09:00:00Z',
    lastUpdated: '2025-02-15T10:00:00Z',
    guardian: { relation: 'บิดา', fullName: 'นายสมชาย รักเรียน', phone: '081-222-2222' },
    documents: { transcript: 'link_to_pdf' }
  },
  { 
    id: 'APP69002', 
    academicYear: '2569',
    round: 'รอบปกติ',
    prefix: 'นางสาว',
    thFirstName: 'กานดา', 
    thLastName: 'มานะ',
    nationalId: '1100998877665',
    birthDate: '2009-08-20',
    gender: 'หญิง',
    nationality: 'ไทย',
    ethnicity: 'ไทย',
    religion: 'คริสต์',
    phone: '083-333-3333', 
    email: 'kanda@example.com',
    currentAddress: mockAddress,
    registeredAddress: mockAddress,
    level: StudyLevel.M4,
    studyPlan: StudyPlan.SCI_MATH, 
    status: ApplicationStatus.NEW, 
    appliedDate: '2025-02-16T14:30:00Z',
    lastUpdated: '2025-02-16T14:30:00Z',
    guardian: { relation: 'มารดา', fullName: 'นางสมศรี มานะ', phone: '083-444-4444' },
    documents: {}
  },
];

export const MOCK_ADMINS: AdminUser[] = [
  { id: 'ADM001', username: 'admin_main', role: 'SUPER_ADMIN', isActive: true, lastLogin: '2025-02-16 09:00' },
  { id: 'ADM002', username: 'staff_01', role: 'ADMIN', isActive: true, lastLogin: '2025-02-15 14:30' },
];

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'TPL001',
    title: 'ยืนยันการสมัคร',
    subject: 'ยืนยันการได้รับใบสมัครเข้าศึกษาต่อ ปีการศึกษา 2569',
    body: 'เรียน {name},\n\nทางโรงเรียนได้รับใบสมัครเลขที่ {appId} ของท่านเรียบร้อยแล้ว\nขณะนี้อยู่ในระหว่างการตรวจสอบเอกสาร\n\nสามารถตรวจสอบสถานะได้ที่เว็บไซต์\n\nขอแสดงความนับถือ\nงานรับนักเรียน'
  },
  {
    id: 'TPL002',
    title: 'แจ้งผล: ผ่านการคัดเลือก',
    subject: 'ประกาศผลการคัดเลือกเข้าศึกษาต่อ',
    body: 'เรียน {name},\n\nทางโรงเรียนมีความยินดีที่จะแจ้งให้ทราบว่า ท่าน "ผ่านการคัดเลือก" เข้าศึกษาต่อในระดับชั้น {level} แผนการเรียน {plan}\n\nกรุณามารายงานตัวในวันที่กำหนด พร้อมเอกสารตัวจริง\n\nขอแสดงความนับถือ\nงานรับนักเรียน'
  },
  {
    id: 'TPL003',
    title: 'แจ้งผล: เอกสารไม่สมบูรณ์',
    subject: 'แจ้งแก้ไขเอกสารประกอบการสมัคร',
    body: 'เรียน {name},\n\nจากการตรวจสอบใบสมัครเลขที่ {appId} พบว่าเอกสารบางอย่างไม่สมบูรณ์ หรือไม่ชัดเจน\nกรุณาติดต่อเจ้าหน้าที่ หรือส่งเอกสารเพิ่มเติมโดยด่วน\n\nขอแสดงความนับถือ\nงานรับนักเรียน'
  }
];
