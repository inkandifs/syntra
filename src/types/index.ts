export type UserRole =
  | 'complainant'
  | 'bureau_officer'
  | 'regional_officer'
  | 'senior_management'
  | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bureauCode?: 'PGRC' | 'RB' | 'AB' | 'ACAD' | 'RO';
  region?: 'Northern' | 'Southern' | 'Eastern' | 'Western' | 'Central' | 'North-Western' | 'South-Western';
  designation: string;
  avatar?: string;
  phone?: string;
}

export type ComplaintCategory =
  | 'Fee Irregularity'
  | 'Infrastructure'
  | 'Faculty & Staff'
  | 'Admission'
  | 'Affiliation/Approval'
  | 'Harassment'
  | 'Academic & Curriculum'
  | 'Other';

export type ComplaintStatus =
  | 'Received'
  | 'Under Review'
  | 'Assigned'
  | 'Investigation'
  | 'Coordination Required'
  | 'Resolved'
  | 'Closed'
  | 'Transferred'
  | 'Escalated';

export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface EvidenceItem {
  id: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Complaint {
  id: string;
  caseNumber: string; // e.g., SYN-1042
  institutionId: string;
  institutionPermanentId: string;
  institutionName: string;
  state: string;
  region: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  dateReceived: string; // ISO string with timestamp
  bureauCode: 'PGRC' | 'RB' | 'AB' | 'ACAD' | 'RO';
  bureauName: string;
  priority: PriorityLevel;
  status: ComplaintStatus;
  assignedOfficerId: string;
  assignedOfficerName: string;
  lastActionDate: string;
  lastAction: string;
  nextActionRequired: string;
  expectedDisposalDate: string;
  complainantName: string;
  complainantEmail: string;
  complainantType: 'Student' | 'Parent' | 'Faculty' | 'Anonymous' | 'Citizen';
  isOverdue: boolean;
  overlapFlag: boolean;
  evidence: EvidenceItem[];
  coordinationRoomId?: string;
  closureRemarks?: string;
}

export interface Institution {
  id: string;
  permanentId: string; // e.g. "1-43289012"
  name: string;
  state: string;
  region: string;
  city: string;
  address: string;
  institutionType: 'Engineering' | 'Management' | 'Pharmacy' | 'Polytechnic' | 'Architecture' | 'MCA';
  status: 'Approved' | 'Notice Issued' | 'Under Investigation' | 'Deficiency Found';
  establishedYear: number;
  contactEmail: string;
  contactPhone: string;
  linkedCasesCount: number;
}

export interface CaseRelationship {
  id: string;
  sourceCaseId: string;
  sourceCaseNumber: string;
  targetCaseId: string;
  targetCaseNumber: string;
  institutionId: string;
  institutionName: string;
  bureauA: string;
  bureauB: string;
  matchScore: number; // e.g. 88
  reasons: string[];
  status: 'suggested' | 'confirmed' | 'dismissed';
  confirmedBy?: string;
  confirmedAt?: string;
  notes?: string;
}

export interface CoordinationRoom {
  id: string;
  roomNumber: string; // e.g. "CR-2026-01"
  title: string;
  institutionId: string;
  institutionName: string;
  leadBureau: string;
  partnerBureaus: string[];
  caseIds: string[];
  caseNumbers: string[];
  officerIds: string[];
  status: 'Active' | 'Under Review' | 'Resolved';
  createdAt: string;
  updatedAt: string;
}

export interface CoordinationTask {
  id: string;
  roomId: string;
  title: string;
  assigneeName: string;
  bureauCode: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: PriorityLevel;
  createdAt: string;
}

export interface CoordinationNote {
  id: string;
  roomId: string;
  authorName: string;
  authorRole: string;
  bureauCode: string;
  content: string;
  timestamp: string;
}

export interface AuditEvent {
  id: string;
  caseId?: string;
  caseNumber?: string;
  eventType:
    | 'Case Created'
    | 'Case Assigned'
    | 'Status Changed'
    | 'Overlap Detected'
    | 'Relationship Confirmed'
    | 'Relationship Dismissed'
    | 'Coordination Room Created'
    | 'Task Created'
    | 'Note Added'
    | 'Escalation Filed'
    | 'Evidence Uploaded'
    | 'AI Suggested Action'
    | 'Admin Override';
  actorName: string;
  actorRole: string;
  details: string;
  isAiSuggested: boolean;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: 'overlap' | 'assignment' | 'deadline' | 'escalation' | 'coordination';
  caseNumber?: string;
  read: boolean;
  timestamp: string;
}

export interface WorkflowStage {
  id: string;
  key: ComplaintStatus;
  label: string;
  order: number;
  description: string;
  color: string;
  allowedTransitions: ComplaintStatus[];
}

export interface AppSettings {
  delayThresholdDays: number;
  warningThresholdDays: number;
  autoCheckOverlap: boolean;
  emailAlertsEnabled: boolean;
  strictRoleAccess: boolean;
}
