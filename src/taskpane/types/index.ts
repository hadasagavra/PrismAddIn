// מנהל — תואם ל-ManagerDto ב-Backend
export interface Manager {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  isActive: boolean;
  isSuperAdmin: boolean; 
  lastLoginAt?: string;
}

// יצירת מנהל חדש — תואם ל-CreateManagerDto
export interface CreateManagerRequest {
  name: string;
  identityNumber: string;
  email: string;
  password: string;
  phoneNumber?: string;
  isSuperAdmin: boolean; 
}

// עדכון פרטי מנהל — תואם ל-UpdateManagerDto
export interface UpdateManagerRequest {
  name: string;
  phoneNumber?: string;
  isActive: boolean;
}

// קטגוריה — תואם ל-CategoryDto
export interface Category {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
}

// מייל — תואם ל-EmailRequestDto
export interface Email {
  id: number;
  subject: string;
  content: string;
  senderEmail: string;
  categoryId?: number;
  status: EmailStatus;
  classificationConfidence?: number;
  receivedAt: string;
  outlookItemId?: string; // מזהה המייל באאוטלוק — חשוב להעברת תיקיות
}

// סטטוס המייל — תואם ל-Enum ב-Backend
export enum EmailStatus {
  Unclassified = 0,
  AutoClassified = 1,
  ManuallyCorrected = 2,
  Reclassified = 3
}

// התחברות
export interface LoginRequest {
  name: string;
  password: string;
}

export interface AuthResponse {
  managerId: number;
  name: string;
  email: string;
  isSuperAdmin: boolean;
  accessToken: string;
  refreshToken: string;
}
// תיקון סיווג
export interface ClassifyEmailRequest {
  categoryId: number;
  notes?: string;
}