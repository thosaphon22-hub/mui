export enum ApplicationStatus {
  NEW = 'รอตรวจสอบเอกสาร',
  DOCS_OK = 'เอกสารครบถ้วน',
  PENDING = 'รอพิจารณา',
  APPROVED = 'ผ่านการคัดเลือก',
  REJECTED = 'ไม่ผ่านการคัดเลือก',
  INCOMPLETE = 'เอกสารไม่สมบูรณ์'
}

export enum StudyLevel {
  M1 = 'มัธยมศึกษาปีที่ 1',
  M4 = 'มัธยมศึกษาปีที่ 4'
}

export enum StudyPlan {
  // M.1
  M1_NORMAL = 'ห้องเรียนปกติ',
  M1_ENGLISH = 'ห้องเรียนเน้นภาษาอังกฤษ (EP)',
  // M.4
  SCI_MATH = 'วิทย์-คณิต',
  ENG_MATH = 'ศิลป์-คำนวณ',
  ENG_LANG = 'ศิลป์-ภาษา',
  GEN_ART = 'ศิลป์-ทั่วไป'
}

export interface Address {
  houseNo: string;
  moo?: string;
  soi?: string;
  road?: string;
  subDistrict: string;
  district: string;
  province: string;
  postalCode: string;
}

export interface GuardianInfo {
  relation: string;
  fullName: string;
  phone: string;
  email?: string;
}

export interface StudentApplication {
  id: string; // Application ID (UUID)
  academicYear: string;
  round: string;
  
  // Student Info
  prefix: string;
  thFirstName: string;
  thLastName: string;
  enFirstName?: string;
  enLastName?: string;
  nationalId: string;
  birthDate: string; // YYYY-MM-DD
  gender: string;
  nationality: string;
  ethnicity: string;
  religion: string;
  
  // Contact
  phone: string;
  email: string;
  currentAddress: Address;
  registeredAddress: Address; // Address in house registration
  
  // Admission Info
  level: StudyLevel;
  studyPlan: StudyPlan;
  
  // Guardian
  guardian: GuardianInfo;
  
  // Documents (Links)
  documents: {
    transcript?: string; // Por Por 1/7
    houseReg?: string;
    guardianCert?: string;
    other?: string;
  };

  status: ApplicationStatus;
  appliedDate: string; // ISO String
  lastUpdated: string;
}

export interface AdminUser {
  id: string;
  username: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
  isActive: boolean;
  lastLogin: string;
}

export interface EmailTemplate {
  id: string;
  title: string;
  subject: string;
  body: string;
}