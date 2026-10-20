export interface Session {
  status?: string;
  message?: string | null;
  studentId?: string;
  stuNumber: string;
  stuName: string;
  phoneNumber?: string;
  schoolName?: string;
  schoolId: string;
  campusName?: string;
  campusId: string;
  collegeName?: string;
  naturalId?: string;
  naturalName?: string;
  headPortrait?: string;
  sex?: string;
  token: string;
  code?: string;
}

export interface ScanTicket {
  uuid: string;
  imgUrl: string;
}
