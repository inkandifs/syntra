import {
  User,
  Institution,
  Complaint,
  ComplaintCategory,
  ComplaintStatus,
  CaseRelationship,
  CoordinationRoom,
  CoordinationTask,
  CoordinationNote,
  AuditEvent,
  AppNotification,
  AppSettings,
  WorkflowStage,
} from '../types';

// Demo users per specification
export const DEMO_USERS: User[] = [
  {
    id: 'user-complainant',
    name: 'Rahul Verma',
    email: 'rahul.verma@example.in',
    role: 'complainant',
    designation: 'Student / Complainant',
    phone: '+91 98230 44120',
  },
  {
    id: 'user-pgrc',
    name: 'Anita Sharma',
    email: 'anita.sharma@aicte.gov.in',
    role: 'bureau_officer',
    bureauCode: 'PGRC',
    designation: 'Assistant Director (Public Grievance Redressal Cell)',
    phone: '+91 11 2958 1024',
  },
  {
    id: 'user-rb',
    name: 'Vikram Rao',
    email: 'vikram.rao@aicte.gov.in',
    role: 'bureau_officer',
    bureauCode: 'RB',
    designation: 'Deputy Director (Regulation Bureau)',
    phone: '+91 11 2958 1088',
  },
  {
    id: 'user-ro',
    name: 'Sunita Kulkarni',
    email: 'sunita.kulkarni@aicte.gov.in',
    role: 'regional_officer',
    bureauCode: 'RO',
    region: 'Western',
    designation: 'Regional Officer (Western Regional Office, Mumbai)',
    phone: '+91 22 2285 5412',
  },
  {
    id: 'user-senior',
    name: 'Dr. R. K. Mehta',
    email: 'rk.mehta@aicte.gov.in',
    role: 'senior_management',
    designation: 'Advisor & Member Secretary (AICTE HQ)',
    phone: '+91 11 2958 1002',
  },
  {
    id: 'user-admin',
    name: 'Admin User',
    email: 'admin@syntra.aicte.gov.in',
    role: 'admin',
    designation: 'System Administrator (e-Governance Cell)',
    phone: '+91 11 2958 1999',
  },
];

// Additional officers for distribution
export const OFFICERS: { id: string; name: string; bureauCode: 'PGRC' | 'RB' | 'AB' | 'ACAD' | 'RO'; region?: string }[] = [
  { id: 'off-1', name: 'Anita Sharma', bureauCode: 'PGRC' },
  { id: 'off-2', name: 'Vikram Rao', bureauCode: 'RB' },
  { id: 'off-3', name: 'Sunita Kulkarni', bureauCode: 'RO', region: 'Western' },
  { id: 'off-4', name: 'Dr. P. Venkatraman', bureauCode: 'AB' },
  { id: 'off-5', name: 'Dr. Meenakshi Sundaram', bureauCode: 'ACAD' },
  { id: 'off-6', name: 'Rajesh Nair', bureauCode: 'RO', region: 'Southern' },
  { id: 'off-7', name: 'Sanjay Chatterjee', bureauCode: 'RO', region: 'Eastern' },
  { id: 'off-8', name: 'Amitabh Saxena', bureauCode: 'RO', region: 'Northern' },
  { id: 'off-9', name: 'Kavita Joshi', bureauCode: 'PGRC' },
  { id: 'off-10', name: 'Dinesh Singhania', bureauCode: 'RB' },
  { id: 'off-11', name: 'Pooja Deshmukh', bureauCode: 'PGRC' },
  { id: 'off-12', name: 'Manoj Kumar', bureauCode: 'RB' },
];

export const WORKFLOW_STAGES: WorkflowStage[] = [
  { id: 'stage-1', key: 'Received', label: 'Received', order: 1, description: 'Initial docket registration', color: '#4C6FA5', allowedTransitions: ['Under Review', 'Closed'] },
  { id: 'stage-2', key: 'Under Review', label: 'Under Review', order: 2, description: 'Preliminary admissibility verification', color: '#655A86', allowedTransitions: ['Assigned', 'Closed'] },
  { id: 'stage-3', key: 'Assigned', label: 'Assigned', order: 3, description: 'Designated to examining officer', color: '#C9953A', allowedTransitions: ['Investigation', 'Transferred'] },
  { id: 'stage-4', key: 'Investigation', label: 'Investigation', order: 4, description: 'Fact-finding & institute inquiry underway', color: '#B39358', allowedTransitions: ['Coordination Required', 'Resolved', 'Escalated'] },
  { id: 'stage-5', key: 'Coordination Required', label: 'Coordination Required', order: 5, description: 'Cross-bureau joint scrutiny needed', color: '#C9AE7C', allowedTransitions: ['Resolved', 'Escalated', 'Investigation'] },
  { id: 'stage-6', key: 'Resolved', label: 'Resolved', order: 6, description: 'Corrective action / directive issued', color: '#4F8A6B', allowedTransitions: ['Closed'] },
  { id: 'stage-7', key: 'Closed', label: 'Closed', order: 7, description: 'Case formally concluded', color: '#3A3A40', allowedTransitions: ['Under Review'] },
  { id: 'stage-8', key: 'Transferred', label: 'Transferred', order: 8, description: 'Re-routed to competent cell/bureau', color: '#655A86', allowedTransitions: ['Under Review'] },
  { id: 'stage-9', key: 'Escalated', label: 'Escalated', order: 9, description: 'Elevated to Member Secretary / Appellate', color: '#B5524A', allowedTransitions: ['Investigation', 'Resolved'] },
];

export const DEFAULT_SETTINGS: AppSettings = {
  delayThresholdDays: 14,
  warningThresholdDays: 7,
  autoCheckOverlap: true,
  emailAlertsEnabled: true,
  strictRoleAccess: true,
};

// 40 Realistic Institutions across 8 Indian States
export const SEED_INSTITUTIONS: Institution[] = [
  {
    id: 'inst-1',
    permanentId: '1-43289012',
    name: 'ABC Institute of Technology, Pune',
    state: 'Maharashtra',
    region: 'Western',
    city: 'Pune',
    address: 'Survey No. 42, Hinjawadi Phase 2, Pune, Maharashtra 411057',
    institutionType: 'Engineering',
    status: 'Under Investigation',
    establishedYear: 2004,
    contactEmail: 'director@abctech.edu.in',
    contactPhone: '+91 20 2293 8800',
    linkedCasesCount: 5,
  },
  {
    id: 'inst-2',
    permanentId: '1-90128471',
    name: 'Apex Institute of Engineering & Technology, Bengaluru',
    state: 'Karnataka',
    region: 'Southern',
    city: 'Bengaluru',
    address: 'Electronics City Post, Hosur Road, Bengaluru, Karnataka 560100',
    institutionType: 'Engineering',
    status: 'Notice Issued',
    establishedYear: 2008,
    contactEmail: 'principal@apexengg.ac.in',
    contactPhone: '+91 80 2852 1190',
    linkedCasesCount: 4,
  },
  {
    id: 'inst-3',
    permanentId: '1-67123982',
    name: 'Delhi Institute of Advanced Studies, New Delhi',
    state: 'Delhi',
    region: 'Northern',
    city: 'New Delhi',
    address: 'Sector 25, Rohini, New Delhi 110085',
    institutionType: 'Management',
    status: 'Deficiency Found',
    establishedYear: 1999,
    contactEmail: 'info@diasdelhi.edu.in',
    contactPhone: '+91 11 2793 2742',
    linkedCasesCount: 4,
  },
  {
    id: 'inst-4',
    permanentId: '1-78219034',
    name: 'Kolkata Technical Institute, Kolkata',
    state: 'West Bengal',
    region: 'Eastern',
    city: 'Kolkata',
    address: 'Sector V, Bidhannagar, Salt Lake, Kolkata 700091',
    institutionType: 'Engineering',
    status: 'Under Investigation',
    establishedYear: 2001,
    contactEmail: 'registrar@kolkatatech.org',
    contactPhone: '+91 33 2357 6620',
    linkedCasesCount: 3,
  },
  {
    id: 'inst-5',
    permanentId: '1-55192038',
    name: 'Gandhinagar Institute of Technology, Ahmedabad',
    state: 'Gujarat',
    region: 'Western',
    city: 'Ahmedabad',
    address: 'Khatraj-Kalol Road, Tal. Kalol, Gandhinagar 382721',
    institutionType: 'Engineering',
    status: 'Approved',
    establishedYear: 2006,
    contactEmail: 'git@git.org.in',
    contactPhone: '+91 79 2328 1000',
    linkedCasesCount: 3,
  },
  {
    id: 'inst-6',
    permanentId: '1-33901284',
    name: 'Vellore College of Engineering & Technology, Vellore',
    state: 'Tamil Nadu',
    region: 'Southern',
    city: 'Vellore',
    address: 'Katpadi-Ranipet Highway, Vellore, Tamil Nadu 632014',
    institutionType: 'Engineering',
    status: 'Under Investigation',
    establishedYear: 2011,
    contactEmail: 'info@vcetvellore.ac.in',
    contactPhone: '+91 416 224 4500',
    linkedCasesCount: 3,
  },
  {
    id: 'inst-7',
    permanentId: '1-44819023',
    name: 'Hyderabad Institute of Technology & Management, Hyderabad',
    state: 'Telangana',
    region: 'Southern',
    city: 'Hyderabad',
    address: 'Medchal Malkajgiri, Hyderabad, Telangana 501401',
    institutionType: 'Engineering',
    status: 'Notice Issued',
    establishedYear: 2007,
    contactEmail: 'office@hitm.edu.in',
    contactPhone: '+91 40 2300 6601',
    linkedCasesCount: 3,
  },
  {
    id: 'inst-8',
    permanentId: '1-88234190',
    name: 'Noida Institute of Engineering & Technology, Greater Noida',
    state: 'Uttar Pradesh',
    region: 'Northern',
    city: 'Greater Noida',
    address: '19 Knowledge Park II, Greater Noida, UP 201306',
    institutionType: 'Engineering',
    status: 'Under Investigation',
    establishedYear: 2005,
    contactEmail: 'contact@niet.co.in',
    contactPhone: '+91 120 232 8062',
    linkedCasesCount: 4,
  },
  {
    id: 'inst-9',
    permanentId: '1-12903847',
    name: 'Chandigarh Polytechnic & Skill Institute, Mohali',
    state: 'Punjab',
    region: 'North-Western',
    city: 'Mohali',
    address: 'Sector 71, SAS Nagar, Mohali, Punjab 160071',
    institutionType: 'Polytechnic',
    status: 'Approved',
    establishedYear: 2013,
    contactEmail: 'admissions@cpsik.edu.in',
    contactPhone: '+91 172 509 3320',
    linkedCasesCount: 2,
  },
  {
    id: 'inst-10',
    permanentId: '1-77291034',
    name: 'Jaipur School of Business & Management, Jaipur',
    state: 'Rajasthan',
    region: 'Northern',
    city: 'Jaipur',
    address: 'Sitapura Industrial Area, Tonk Road, Jaipur 302022',
    institutionType: 'Management',
    status: 'Approved',
    establishedYear: 2010,
    contactEmail: 'dean@jsbmjaipur.org',
    contactPhone: '+91 141 277 1800',
    linkedCasesCount: 2,
  },
  {
    id: 'inst-11',
    permanentId: '1-66231908',
    name: 'Cochin Institute of Science & Technology, Kochi',
    state: 'Kerala',
    region: 'South-Western',
    city: 'Kochi',
    address: 'Kakkanad, Thrikkakara, Kochi, Kerala 682021',
    institutionType: 'Engineering',
    status: 'Approved',
    establishedYear: 2009,
    contactEmail: 'admin@cist.edu.in',
    contactPhone: '+91 484 257 6000',
    linkedCasesCount: 2,
  },
  {
    id: 'inst-12',
    permanentId: '1-55290138',
    name: 'Bhopal Institute of Technology & Science, Bhopal',
    state: 'Madhya Pradesh',
    region: 'Central',
    city: 'Bhopal',
    address: 'Bhojpur Road, Bangrasia, Bhopal, MP 462045',
    institutionType: 'Engineering',
    status: 'Notice Issued',
    establishedYear: 2003,
    contactEmail: 'bhopaltech@bits.ac.in',
    contactPhone: '+91 755 289 6200',
    linkedCasesCount: 3,
  },
  {
    id: 'inst-13',
    permanentId: '1-99238410',
    name: 'Bhubaneswar Engineering College, Bhubaneswar',
    state: 'Odisha',
    region: 'Eastern',
    city: 'Bhubaneswar',
    address: 'Pitapally, NH-5, Bhubaneswar, Odisha 752054',
    institutionType: 'Engineering',
    status: 'Approved',
    establishedYear: 2008,
    contactEmail: 'bec@becbbsr.ac.in',
    contactPhone: '+91 674 246 8000',
    linkedCasesCount: 2,
  },
  {
    id: 'inst-14',
    permanentId: '1-33190284',
    name: 'Patna Institute of Technology, Patna',
    state: 'Bihar',
    region: 'Northern',
    city: 'Patna',
    address: 'Bailey Road, Danapur, Patna, Bihar 801503',
    institutionType: 'Engineering',
    status: 'Approved',
    establishedYear: 2012,
    contactEmail: 'info@patnatech.ac.in',
    contactPhone: '+91 612 229 0110',
    linkedCasesCount: 2,
  },
  {
    id: 'inst-15',
    permanentId: '1-44129038',
    name: 'Guwahati College of Architecture & Planning, Guwahati',
    state: 'Assam',
    region: 'Eastern',
    city: 'Guwahati',
    address: 'Azara, Airport Road, Guwahati, Assam 781017',
    institutionType: 'Architecture',
    status: 'Approved',
    establishedYear: 2014,
    contactEmail: 'arch@gcap.edu.in',
    contactPhone: '+91 361 284 3000',
    linkedCasesCount: 1,
  },
  {
    id: 'inst-16',
    permanentId: '1-22938471',
    name: 'Nagpur College of Pharmacy, Nagpur',
    state: 'Maharashtra',
    region: 'Western',
    city: 'Nagpur',
    address: 'Hingna Road, Wanadongri, Nagpur 441110',
    institutionType: 'Pharmacy',
    status: 'Approved',
    establishedYear: 2007,
    contactEmail: 'pharmacy@nagpur.org',
    contactPhone: '+91 7104 237 800',
    linkedCasesCount: 2,
  },
  {
    id: 'inst-17',
    permanentId: '1-88392019',
    name: 'Indore Institute of Management Studies, Indore',
    state: 'Madhya Pradesh',
    region: 'Central',
    city: 'Indore',
    address: 'Rau-Pithampur Bypass, Indore 453331',
    institutionType: 'Management',
    status: 'Approved',
    establishedYear: 2006,
    contactEmail: 'director@iimsindore.edu.in',
    contactPhone: '+91 731 401 0600',
    linkedCasesCount: 2,
  },
  {
    id: 'inst-18',
    permanentId: '1-77192834',
    name: 'Coimbatore Institute of Engineering, Coimbatore',
    state: 'Tamil Nadu',
    region: 'Southern',
    city: 'Coimbatore',
    address: 'Avinashi Road, Civil Aerodrome Post, Coimbatore 641014',
    institutionType: 'Engineering',
    status: 'Approved',
    establishedYear: 2000,
    contactEmail: 'cie@cie.edu.in',
    contactPhone: '+91 422 257 4071',
    linkedCasesCount: 3,
  },
  {
    id: 'inst-19',
    permanentId: '1-66382910',
    name: 'Lucknow Polytechnic Institute, Lucknow',
    state: 'Uttar Pradesh',
    region: 'Northern',
    city: 'Lucknow',
    address: 'Faizabad Road, Gomti Nagar Extn, Lucknow 226010',
    institutionType: 'Polytechnic',
    status: 'Notice Issued',
    establishedYear: 2015,
    contactEmail: 'poly@lpiup.gov.in',
    contactPhone: '+91 522 272 1040',
    linkedCasesCount: 3,
  },
  {
    id: 'inst-20',
    permanentId: '1-55829104',
    name: 'Mysuru Academy of Technical Education, Mysuru',
    state: 'Karnataka',
    region: 'Southern',
    city: 'Mysuru',
    address: 'Bannur Road, Alanahalli, Mysuru, Karnataka 570028',
    institutionType: 'Engineering',
    status: 'Approved',
    establishedYear: 2011,
    contactEmail: 'mate@mate.ac.in',
    contactPhone: '+91 821 247 1800',
    linkedCasesCount: 2,
  },
  {
    id: 'inst-21',
    permanentId: '1-38291045',
    name: 'Surat Institute of Technology, Surat',
    state: 'Gujarat',
    region: 'Western',
    city: 'Surat',
    address: 'Dumas Road, Piplod, Surat, Gujarat 395007',
    institutionType: 'Engineering',
    status: 'Approved',
    establishedYear: 2007,
    contactEmail: 'sit@surattech.org',
    contactPhone: '+91 261 225 8030',
    linkedCasesCount: 2,
  },
  {
    id: 'inst-22',
    permanentId: '1-99102834',
    name: 'Visakhapatnam Technical Campus, Vizag',
    state: 'Andhra Pradesh',
    region: 'Southern',
    city: 'Visakhapatnam',
    address: 'Madhurawada, NH-16, Visakhapatnam 530048',
    institutionType: 'Engineering',
    status: 'Approved',
    establishedYear: 2009,
    contactEmail: 'vtc@vizagtech.ac.in',
    contactPhone: '+91 891 273 9500',
    linkedCasesCount: 2,
  },
  {
    id: 'inst-23',
    permanentId: '1-44729103',
    name: 'Ranchi Institute of Technology & Management, Ranchi',
    state: 'Jharkhand',
    region: 'Eastern',
    city: 'Ranchi',
    address: 'Tupudana Industrial Area, Hatia, Ranchi 834003',
    institutionType: 'Management',
    status: 'Approved',
    establishedYear: 2013,
    contactEmail: 'ritm@ranchi.ac.in',
    contactPhone: '+91 651 229 1100',
    linkedCasesCount: 1,
  },
  {
    id: 'inst-24',
    permanentId: '1-88192034',
    name: 'Dehradun College of Engineering, Dehradun',
    state: 'Uttarakhand',
    region: 'Northern',
    city: 'Dehradun',
    address: 'Rajpur Road, Near Dilaram Chowk, Dehradun 248001',
    institutionType: 'Engineering',
    status: 'Approved',
    establishedYear: 2008,
    contactEmail: 'dce@dehradunengg.edu.in',
    contactPhone: '+91 135 273 4400',
    linkedCasesCount: 2,
  },
  {
    id: 'inst-25',
    permanentId: '1-66291048',
    name: 'Thiruvananthapuram School of Management, Trivandrum',
    state: 'Kerala',
    region: 'South-Western',
    city: 'Thiruvananthapuram',
    address: 'Kazhakkoottam, Technopark Campus, Trivandrum 695581',
    institutionType: 'Management',
    status: 'Approved',
    establishedYear: 2005,
    contactEmail: 'dean@tsmtvm.org',
    contactPhone: '+91 471 270 0100',
    linkedCasesCount: 1,
  },
  {
    id: 'inst-26',
    permanentId: '1-55102934',
    name: 'Raipur Institute of Technology, Raipur',
    state: 'Chhattisgarh',
    region: 'Central',
    city: 'Raipur',
    address: 'Mandir Hasaud, Chhatauna, Raipur 492101',
    institutionType: 'Engineering',
    status: 'Approved',
    establishedYear: 2012,
    contactEmail: 'rit@ritraipur.ac.in',
    contactPhone: '+91 771 244 5500',
    linkedCasesCount: 1,
  },
  {
    id: 'inst-27',
    permanentId: '1-33829104',
    name: 'Amritsar Technical College, Amritsar',
    state: 'Punjab',
    region: 'North-Western',
    city: 'Amritsar',
    address: 'GT Road, Near Verka Bypass, Amritsar 143001',
    institutionType: 'Engineering',
    status: 'Approved',
    establishedYear: 2006,
    contactEmail: 'atc@amritsartech.edu.in',
    contactPhone: '+91 183 250 8200',
    linkedCasesCount: 2,
  },
  {
    id: 'inst-28',
    permanentId: '1-99201934',
    name: 'Kanpur Institute of Management & Science, Kanpur',
    state: 'Uttar Pradesh',
    region: 'Northern',
    city: 'Kanpur',
    address: 'Ruma, NH-2, Kanpur 209402',
    institutionType: 'Management',
    status: 'Approved',
    establishedYear: 2007,
    contactEmail: 'kims@kanpur.ac.in',
    contactPhone: '+91 512 240 1000',
    linkedCasesCount: 2,
  },
  {
    id: 'inst-29',
    permanentId: '1-77391024',
    name: 'Thane Institute of Engineering, Thane',
    state: 'Maharashtra',
    region: 'Western',
    city: 'Thane',
    address: 'Ghodbunder Road, Kasarvadavali, Thane West 400615',
    institutionType: 'Engineering',
    status: 'Approved',
    establishedYear: 2010,
    contactEmail: 'tie@thanetech.org',
    contactPhone: '+91 22 2597 4400',
    linkedCasesCount: 2,
  },
  {
    id: 'inst-30',
    permanentId: '1-44281903',
    name: 'Mangalore College of Pharmacy, Mangaluru',
    state: 'Karnataka',
    region: 'Southern',
    city: 'Mangaluru',
    address: 'Kuntikana, Derebail, Mangaluru 575004',
    institutionType: 'Pharmacy',
    status: 'Approved',
    establishedYear: 2004,
    contactEmail: 'mcp@mangalorepharm.edu.in',
    contactPhone: '+91 824 222 3400',
    linkedCasesCount: 2,
  },
  {
    id: 'inst-31',
    permanentId: '1-11829304',
    name: 'Jodhpur Engineering College, Jodhpur',
    state: 'Rajasthan',
    region: 'Northern',
    city: 'Jodhpur',
    address: 'Boronada Industrial Park, Jodhpur 342012',
    institutionType: 'Engineering',
    status: 'Approved',
    establishedYear: 2009,
    contactEmail: 'jec@jodhpur.org',
    contactPhone: '+91 291 278 1200',
    linkedCasesCount: 1,
  },
  {
    id: 'inst-32',
    permanentId: '1-66102934',
    name: 'Madurai Institute of Technology, Madurai',
    state: 'Tamil Nadu',
    region: 'Southern',
    city: 'Madurai',
    address: 'Alagar Kovil Road, Madurai 625002',
    institutionType: 'Engineering',
    status: 'Approved',
    establishedYear: 2008,
    contactEmail: 'mit@maduraitech.ac.in',
    contactPhone: '+91 452 253 1000',
    linkedCasesCount: 2,
  },
  {
    id: 'inst-33',
    permanentId: '1-88910234',
    name: 'Gwalior Technical Institute, Gwalior',
    state: 'Madhya Pradesh',
    region: 'Central',
    city: 'Gwalior',
    address: 'Morar Cantt, Gwalior 474006',
    institutionType: 'Engineering',
    status: 'Approved',
    establishedYear: 2011,
    contactEmail: 'gti@gwalior.edu.in',
    contactPhone: '+91 751 246 8200',
    linkedCasesCount: 1,
  },
  {
    id: 'inst-34',
    permanentId: '1-55391024',
    name: 'Nashik Polytechnic College, Nashik',
    state: 'Maharashtra',
    region: 'Western',
    city: 'Nashik',
    address: 'Gangapur Road, Nashik 422013',
    institutionType: 'Polytechnic',
    status: 'Approved',
    establishedYear: 2013,
    contactEmail: 'npc@nashikpoly.org',
    contactPhone: '+91 253 234 1100',
    linkedCasesCount: 2,
  },
  {
    id: 'inst-35',
    permanentId: '1-22819034',
    name: 'Warangal Institute of Science & Technology, Warangal',
    state: 'Telangana',
    region: 'Southern',
    city: 'Warangal',
    address: 'Hanamkonda, Warangal 506001',
    institutionType: 'Engineering',
    status: 'Approved',
    establishedYear: 2010,
    contactEmail: 'wist@warangal.ac.in',
    contactPhone: '+91 870 245 6100',
    linkedCasesCount: 1,
  },
  {
    id: 'inst-36',
    permanentId: '1-77491023',
    name: 'Varanasi School of Management & Technology, Varanasi',
    state: 'Uttar Pradesh',
    region: 'Northern',
    city: 'Varanasi',
    address: 'Babatpur Airport Road, Varanasi 221006',
    institutionType: 'Management',
    status: 'Approved',
    establishedYear: 2007,
    contactEmail: 'vsmt@varanasi.edu.in',
    contactPhone: '+91 542 262 4400',
    linkedCasesCount: 2,
  },
  {
    id: 'inst-37',
    permanentId: '1-33291048',
    name: 'Siliguri Engineering & Technical Campus, Siliguri',
    state: 'West Bengal',
    region: 'Eastern',
    city: 'Siliguri',
    address: 'Matigara, Siliguri, Darjeeling 734010',
    institutionType: 'Engineering',
    status: 'Approved',
    establishedYear: 2012,
    contactEmail: 'setc@siliguri.ac.in',
    contactPhone: '+91 353 257 1800',
    linkedCasesCount: 1,
  },
  {
    id: 'inst-38',
    permanentId: '1-99482013',
    name: 'Hubballi Institute of Technology, Hubballi',
    state: 'Karnataka',
    region: 'Southern',
    city: 'Hubballi',
    address: 'Tarihal Industrial Estate, Hubballi 580026',
    institutionType: 'Engineering',
    status: 'Approved',
    establishedYear: 2014,
    contactEmail: 'hit@hubballi.org',
    contactPhone: '+91 836 221 4000',
    linkedCasesCount: 1,
  },
  {
    id: 'inst-39',
    permanentId: '1-44910238',
    name: 'Vadodara College of Engineering, Vadodara',
    state: 'Gujarat',
    region: 'Western',
    city: 'Vadodara',
    address: 'Waghodia Road, Vadodara 391760',
    institutionType: 'Engineering',
    status: 'Approved',
    establishedYear: 2005,
    contactEmail: 'vce@vadodara.edu.in',
    contactPhone: '+91 265 251 1000',
    linkedCasesCount: 2,
  },
  {
    id: 'inst-40',
    permanentId: '1-11928304',
    name: 'Agra Technical Institute, Agra',
    state: 'Uttar Pradesh',
    region: 'Northern',
    city: 'Agra',
    address: 'NH-2, Farah, Mathura-Agra Road 281122',
    institutionType: 'Engineering',
    status: 'Approved',
    establishedYear: 2009,
    contactEmail: 'ati@agra.ac.in',
    contactPhone: '+91 562 276 0200',
    linkedCasesCount: 2,
  },
];

// Helper to generate seed complaints (150 total, with deliberate cross-bureau overlap pairs)
function generateSeedComplaints(): Complaint[] {
  const complaints: Complaint[] = [];

  // Flagship Pair 1: ABC Institute of Technology, Pune
  // Case 1: PGRC
  complaints.push({
    id: 'case-1042',
    caseNumber: 'SYN-1042',
    institutionId: 'inst-1',
    institutionPermanentId: '1-43289012',
    institutionName: 'ABC Institute of Technology, Pune',
    state: 'Maharashtra',
    region: 'Western',
    category: 'Fee Irregularity',
    title: 'Unauthorized fee collection during admission cycle',
    description: 'Students and parents have submitted evidence showing that the institution is charging an unapproved development fee of ₹35,000 in cash during admission formalities, contrary to AICTE fee-regulatory guidelines.',
    dateReceived: '2026-09-14T10:30:00+05:30',
    bureauCode: 'PGRC',
    bureauName: 'Public Grievance Redressal Cell',
    priority: 'High',
    status: 'Under Review',
    assignedOfficerId: 'user-pgrc',
    assignedOfficerName: 'Anita Sharma',
    lastActionDate: '2026-10-18T14:20:00+05:30',
    lastAction: 'Preliminary evidence scrutinized; notice issued to institution management.',
    nextActionRequired: 'Cross-bureau verification with Regulation Bureau regarding fee approvals.',
    expectedDisposalDate: '2026-10-10T17:00:00+05:30', // Overdue
    complainantName: 'Rahul Verma',
    complainantEmail: 'rahul.verma@example.in',
    complainantType: 'Student',
    isOverdue: true,
    overlapFlag: true,
    evidence: [
      { id: 'ev-1', fileName: 'Fee_Receipt_Unmarked_Cash.pdf', fileSize: '2.4 MB', fileType: 'application/pdf', uploadedAt: '2026-09-14T10:32:00+05:30', uploadedBy: 'Rahul Verma' },
      { id: 'ev-2', fileName: 'Bank_Statement_Summary.pdf', fileSize: '1.1 MB', fileType: 'application/pdf', uploadedAt: '2026-09-14T10:33:00+05:30', uploadedBy: 'Rahul Verma' },
    ],
  });

  // Case 2: Regulation Bureau (Flagship overlap match)
  complaints.push({
    id: 'case-1088',
    caseNumber: 'SYN-1088',
    institutionId: 'inst-1',
    institutionPermanentId: '1-43289012',
    institutionName: 'ABC Institute of Technology, Pune',
    state: 'Maharashtra',
    region: 'Western',
    category: 'Fee Irregularity',
    title: 'Fees exceeding permitted AICTE fee-regulatory structure',
    description: 'Complaint forwarded by the State Fee Regulatory Authority alleging that ABC Institute of Technology is publishing tuition schedules exceeding the AICTE notified slab for 2026-27.',
    dateReceived: '2026-09-22T11:15:00+05:30',
    bureauCode: 'RB',
    bureauName: 'Regulation Bureau',
    priority: 'High',
    status: 'Investigation',
    assignedOfficerId: 'user-rb',
    assignedOfficerName: 'Vikram Rao',
    lastActionDate: '2026-10-19T16:00:00+05:30',
    lastAction: 'Institutional audit team constituted to inspect account books.',
    nextActionRequired: 'Coordinate findings with PGRC grievance docket SYN-1042.',
    expectedDisposalDate: '2026-11-05T17:00:00+05:30',
    complainantName: 'State Fee Vigilance Cell',
    complainantEmail: 'vigilance.fee@mah.gov.in',
    complainantType: 'Citizen',
    isOverdue: false,
    overlapFlag: true,
    evidence: [
      { id: 'ev-3', fileName: 'Official_Fee_Notification_Exceedance.pdf', fileSize: '3.8 MB', fileType: 'application/pdf', uploadedAt: '2026-09-22T11:20:00+05:30', uploadedBy: 'Vikram Rao' },
    ],
  });

  // Case 3 for ABC: Regional Office
  complaints.push({
    id: 'case-1102',
    caseNumber: 'SYN-1102',
    institutionId: 'inst-1',
    institutionPermanentId: '1-43289012',
    institutionName: 'ABC Institute of Technology, Pune',
    state: 'Maharashtra',
    region: 'Western',
    category: 'Infrastructure',
    title: 'Computer science labs lack prescribed equipment per AICTE norms',
    description: 'Affiliation inspection reported deficient workstation counts and unlicensed design software in high-performance computing laboratory.',
    dateReceived: '2026-10-02T09:45:00+05:30',
    bureauCode: 'RO',
    bureauName: 'Regional Office (Western)',
    priority: 'Medium',
    status: 'Assigned',
    assignedOfficerId: 'user-ro',
    assignedOfficerName: 'Sunita Kulkarni',
    lastActionDate: '2026-10-15T11:30:00+05:30',
    lastAction: 'Sent surprise inspection notice to Head of Department.',
    nextActionRequired: 'Schedule on-site surprise physical audit.',
    expectedDisposalDate: '2026-11-15T17:00:00+05:30',
    complainantName: 'Faculty Association',
    complainantEmail: 'fac.assoc@abctech.edu.in',
    complainantType: 'Faculty',
    isOverdue: false,
    overlapFlag: false,
    evidence: [],
  });

  // Flagship Pair 2: Apex Institute of Engineering & Technology, Bengaluru
  complaints.push({
    id: 'case-1055',
    caseNumber: 'SYN-1055',
    institutionId: 'inst-2',
    institutionPermanentId: '1-90128471',
    institutionName: 'Apex Institute of Engineering & Technology, Bengaluru',
    state: 'Karnataka',
    region: 'Southern',
    category: 'Faculty & Staff',
    title: 'Irregular salary disbursement and ghost faculty listing',
    description: 'Faculty members allege 4 months delayed compensation and ghost faculties listed in mandatory AICTE public disclosures.',
    dateReceived: '2026-08-20T14:10:00+05:30',
    bureauCode: 'PGRC',
    bureauName: 'Public Grievance Redressal Cell',
    priority: 'Urgent',
    status: 'Coordination Required',
    assignedOfficerId: 'user-pgrc',
    assignedOfficerName: 'Anita Sharma',
    lastActionDate: '2026-10-20T10:15:00+05:30',
    lastAction: 'Transferred faculty Aadhaar verification report to Approval Bureau.',
    nextActionRequired: 'Joint committee hearing with Approval Bureau officers.',
    expectedDisposalDate: '2026-10-01T17:00:00+05:30', // Overdue
    complainantName: 'Prof. S. R. Hegde',
    complainantEmail: 'sr.hegde@apexengg.ac.in',
    complainantType: 'Faculty',
    isOverdue: true,
    overlapFlag: true,
    evidence: [
      { id: 'ev-4', fileName: 'Bank_Salary_Delay_Extract.pdf', fileSize: '1.9 MB', fileType: 'application/pdf', uploadedAt: '2026-08-20T14:12:00+05:30', uploadedBy: 'Prof. S. R. Hegde' },
    ],
  });

  complaints.push({
    id: 'case-1064',
    caseNumber: 'SYN-1064',
    institutionId: 'inst-2',
    institutionPermanentId: '1-90128471',
    institutionName: 'Apex Institute of Engineering & Technology, Bengaluru',
    state: 'Karnataka',
    region: 'Southern',
    category: 'Affiliation/Approval',
    title: 'Deficient faculty cadration and fraudulent compliance certificate',
    description: 'Approval Bureau automated screening flagged mismatched Teacher-Student Ratio (TSR) in Extension of Approval (EoA) portal.',
    dateReceived: '2026-08-28T16:40:00+05:30',
    bureauCode: 'AB',
    bureauName: 'Approval Bureau',
    priority: 'High',
    status: 'Investigation',
    assignedOfficerId: 'off-4',
    assignedOfficerName: 'Dr. P. Venkatraman',
    lastActionDate: '2026-10-18T12:00:00+05:30',
    lastAction: 'Issued show cause notice to Chairman of Apex Trust.',
    nextActionRequired: 'Synthesize findings with PGRC grievance docket SYN-1055.',
    expectedDisposalDate: '2026-10-28T17:00:00+05:30',
    complainantName: 'EoA Vigilance Automated Scrutiny',
    complainantEmail: 'eoa.scrutiny@aicte.gov.in',
    complainantType: 'Citizen',
    isOverdue: false,
    overlapFlag: true,
    evidence: [],
  });

  // Flagship Pair 3: Delhi Institute of Advanced Studies, New Delhi
  complaints.push({
    id: 'case-1070',
    caseNumber: 'SYN-1070',
    institutionId: 'inst-3',
    institutionPermanentId: '1-67123982',
    institutionName: 'Delhi Institute of Advanced Studies, New Delhi',
    state: 'Delhi',
    region: 'Northern',
    category: 'Infrastructure',
    title: 'Fire safety certificate lapse and inadequate emergency exits',
    description: 'Complaint alleging MBA wing functioning without valid Municipal Fire NOC and blocked fire escape routes in basement library.',
    dateReceived: '2026-09-01T11:00:00+05:30',
    bureauCode: 'RB',
    bureauName: 'Regulation Bureau',
    priority: 'Urgent',
    status: 'Investigation',
    assignedOfficerId: 'user-rb',
    assignedOfficerName: 'Vikram Rao',
    lastActionDate: '2026-10-12T15:30:00+05:30',
    lastAction: 'Inspection conducted by Delhi Regional Fire Safety Officer.',
    nextActionRequired: 'Issue stop-work notice for basement library section.',
    expectedDisposalDate: '2026-10-15T17:00:00+05:30', // Overdue
    complainantName: 'Anonymous Student Group',
    complainantEmail: 'safety.students@delhi.org',
    complainantType: 'Anonymous',
    isOverdue: true,
    overlapFlag: true,
    evidence: [],
  });

  complaints.push({
    id: 'case-1079',
    caseNumber: 'SYN-1079',
    institutionId: 'inst-3',
    institutionPermanentId: '1-67123982',
    institutionName: 'Delhi Institute of Advanced Studies, New Delhi',
    state: 'Delhi',
    region: 'Northern',
    category: 'Infrastructure',
    title: 'Failure to provide disabled-friendly ramps and functional lifts',
    description: 'Student grievance lodged through PGRC regarding lack of accessibility ramps and non-functional lifts in management academic block.',
    dateReceived: '2026-09-08T14:20:00+05:30',
    bureauCode: 'PGRC',
    bureauName: 'Public Grievance Redressal Cell',
    priority: 'Medium',
    status: 'Assigned',
    assignedOfficerId: 'off-9',
    assignedOfficerName: 'Kavita Joshi',
    lastActionDate: '2026-10-14T11:00:00+05:30',
    lastAction: 'Requested physical infrastructure blueprints from campus architect.',
    nextActionRequired: 'Review against Regulation Bureau inspection docket SYN-1070.',
    expectedDisposalDate: '2026-11-10T17:00:00+05:30',
    complainantName: 'Amanpreet Singh',
    complainantEmail: 'amanpreet.s@gmail.com',
    complainantType: 'Student',
    isOverdue: false,
    overlapFlag: true,
    evidence: [],
  });

  // Flagship Pair 4: Kolkata Technical Institute
  complaints.push({
    id: 'case-1090',
    caseNumber: 'SYN-1090',
    institutionId: 'inst-4',
    institutionPermanentId: '1-78219034',
    institutionName: 'Kolkata Technical Institute, Kolkata',
    state: 'West Bengal',
    region: 'Eastern',
    category: 'Admission',
    title: 'Irregular management quota admissions without state merit counseling',
    description: 'Grievance stating institution admitted 45 students under management quota bypassing Centralized Admission Process (CAP).',
    dateReceived: '2026-07-15T10:00:00+05:30',
    bureauCode: 'PGRC',
    bureauName: 'Public Grievance Redressal Cell',
    priority: 'High',
    status: 'Coordination Required',
    assignedOfficerId: 'user-pgrc',
    assignedOfficerName: 'Anita Sharma',
    lastActionDate: '2026-10-16T14:00:00+05:30',
    lastAction: 'Joint coordination initiated with Regulation Bureau.',
    nextActionRequired: 'Reconcile candidate merit numbers against state entrance records.',
    expectedDisposalDate: '2026-10-05T17:00:00+05:30',
    complainantName: 'Subhashish Roy',
    complainantEmail: 'subhashish.r@wb.in',
    complainantType: 'Parent',
    isOverdue: true,
    overlapFlag: true,
    evidence: [],
  });

  complaints.push({
    id: 'case-1098',
    caseNumber: 'SYN-1098',
    institutionId: 'inst-4',
    institutionPermanentId: '1-78219034',
    institutionName: 'Kolkata Technical Institute, Kolkata',
    state: 'West Bengal',
    region: 'Eastern',
    category: 'Affiliation/Approval',
    title: 'Approval seat sanction breached by 50 unapproved enrollment seats',
    description: 'Regulation Bureau audit noted enrolled first-year B.Tech count of 530 against AICTE approved intake of 480.',
    dateReceived: '2026-07-28T15:30:00+05:30',
    bureauCode: 'RB',
    bureauName: 'Regulation Bureau',
    priority: 'Urgent',
    status: 'Investigation',
    assignedOfficerId: 'user-rb',
    assignedOfficerName: 'Vikram Rao',
    lastActionDate: '2026-10-17T11:45:00+05:30',
    lastAction: 'Issued show-cause under AICTE Approval Process Handbook Clause 8.2.',
    nextActionRequired: 'Hearing with institute director and Registrar.',
    expectedDisposalDate: '2026-10-30T17:00:00+05:30',
    complainantName: 'AICTE Eastern Regional Scrutiny Cell',
    complainantEmail: 'ero@aicte.gov.in',
    complainantType: 'Citizen',
    isOverdue: false,
    overlapFlag: true,
    evidence: [],
  });

  // Generate remainder of 150 realistic cases across the other institutions
  const categories: ComplaintCategory[] = [
    'Fee Irregularity',
    'Infrastructure',
    'Faculty & Staff',
    'Admission',
    'Affiliation/Approval',
    'Harassment',
    'Academic & Curriculum',
    'Other',
  ];

  const statuses: ComplaintStatus[] = [
    'Received',
    'Under Review',
    'Assigned',
    'Investigation',
    'Coordination Required',
    'Resolved',
    'Closed',
    'Transferred',
    'Escalated',
  ];

  const priorities: ('Low' | 'Medium' | 'High' | 'Urgent')[] = ['Low', 'Medium', 'High', 'Urgent'];
  const bureaus: ('PGRC' | 'RB' | 'AB' | 'ACAD' | 'RO')[] = ['PGRC', 'RB', 'AB', 'ACAD', 'RO'];

  const sampleTitles: Record<ComplaintCategory, string[]> = {
    'Fee Irregularity': [
      'Capitation fee demanded for issuing transfer certificate',
      'Non-refund of caution deposit following program withdrawal',
      'Exorbitant examination fees beyond state regulatory ceiling',
      'Hostel mess fees charged during vacation months without facility use',
      'Forced purchase of institute uniforms at inflated costs',
    ],
    'Infrastructure': [
      'Inadequate safety equipment in chemistry and materials testing laboratory',
      'Frequent power outages halting practical computer examinations',
      'Hostel drinking water contamination leading to student illness',
      'Library lacks recommended textbooks and digital subscription access',
      'Insufficient parking and sports amenities as promised in prospectus',
    ],
    'Faculty & Staff': [
      'Non-adherence to 7th Central Pay Commission salary scales',
      'Undue termination of contractual assistant professor without notice',
      'Shortage of doctoral faculty members in Master of Computer Applications',
      'Withholding of faculty educational degree certificates by management',
      'Absence of internal grievance redressal committee for teaching staff',
    ],
    'Admission': [
      'Delay in processing admission cancellation refund requests',
      'Violation of reservation quota in postgraduate management admissions',
      'Failure to return original 10th and 12th marksheets after verification',
      'Misleading claims regarding institute placement statistics in advertisements',
      'Unilateral change of branch allocation post fees acceptance',
    ],
    'Affiliation/Approval': [
      'Conducting unapproved diploma courses in the evening shift',
      'Operating second campus without prior AICTE approval notification',
      'Failure to rectify deficiencies notified during previous EoA cycle',
      'Discrepancy in institutional land boundary and title deeds',
      'Non-submission of mandatory Annual Quality Assurance Report',
    ],
    'Harassment': [
      'Ragging incident reported in fresher hostel block',
      'Hostel curfew bias and unfair disciplinary penalty imposed on female students',
      'Threat of detention and marks deduction by department head',
      'Non-constitution of Internal Complaints Committee (ICC) as per AICTE guidelines',
      'Verbal abuse by college administrative staff during scholarship paperwork',
    ],
    'Academic & Curriculum': [
      'Incomplete syllabus coverage before semester terminal examinations',
      'Failure to conduct prescribed mandatory industrial internship visits',
      'Arbitrary evaluation in internal lab sessional examinations',
      'Non-conduction of remedial classes for weak students',
      'Delay of 5 months in issuing provisional degree certificates',
    ],
    'Other': [
      'Mismanagement of PMSSS and national scholarship disbursements',
      'Disruption of academic calendar due to unauthorized campus events',
      'Canteen food hygiene standards violation reported by local municipal team',
      'Lack of placement cell assistance for outgoing engineering batch',
      'Arbitrary cancellation of bus transport service after collecting annual fee',
    ],
  };

  const sampleComplainants = [
    { name: 'Karthik Subbaraj', email: 'karthik.s@gmail.com', type: 'Student' as const },
    { name: 'Deepika Iyer', email: 'deepika.i@outlook.com', type: 'Student' as const },
    { name: 'Rameshwar Patidar', email: 'rameshwar.p@yahoo.in', type: 'Parent' as const },
    { name: 'Dr. Alok Nath', email: 'alok.nath@edu.in', type: 'Faculty' as const },
    { name: 'Prerna Singhania', email: 'prerna.s@gmail.com', type: 'Citizen' as const },
    { name: 'Anonymous Whistleblower', email: 'confidential@protect.org', type: 'Anonymous' as const },
    { name: 'Tarun Bhattacharya', email: 'tarun.b@gmail.com', type: 'Student' as const },
    { name: 'Megha Kulkarni', email: 'megha.k@rediffmail.com', type: 'Parent' as const },
  ];

  // We have 8 already, generate 142 more to make 150
  let caseIdCounter = 1105;
  for (let i = 0; i < 142; i++) {
    const inst = SEED_INSTITUTIONS[(i + 4) % SEED_INSTITUTIONS.length];
    const category = categories[i % categories.length];
    const titlesList = sampleTitles[category];
    const title = titlesList[i % titlesList.length];
    const bureau = bureaus[i % bureaus.length];
    const status = statuses[i % statuses.length];
    const priority = priorities[i % priorities.length];
    const officer = OFFICERS[i % OFFICERS.length];
    const complainant = sampleComplainants[i % sampleComplainants.length];

    // Distribute received dates across last 12 months
    const daysAgo = Math.floor(10 + (i * 2.3)) % 320;
    const dateRec = new Date(Date.now() - daysAgo * 24 * 3600 * 1000);
    dateRec.setHours(9 + (i % 8), 15 + (i * 7) % 45, 0);

    const lastActDate = new Date(dateRec.getTime() + Math.min(daysAgo, 8) * 24 * 3600 * 1000);
    lastActDate.setHours(11 + (i % 6), 20 + (i * 3) % 35, 0);

    const disposalDays = 30;
    const expDispDate = new Date(dateRec.getTime() + disposalDays * 24 * 3600 * 1000);
    const isOverdue = Date.now() > expDispDate.getTime() && (status !== 'Resolved' && status !== 'Closed');

    // Intentional overlap flags on key institutions (institutions 5, 6, 7, 8, 12, 19)
    const hasOverlap = [4, 5, 6, 7, 11, 18].includes((i + 4) % SEED_INSTITUTIONS.length) && (i % 3 === 0);

    complaints.push({
      id: `case-${caseIdCounter}`,
      caseNumber: `SYN-${caseIdCounter}`,
      institutionId: inst.id,
      institutionPermanentId: inst.permanentId,
      institutionName: inst.name,
      state: inst.state,
      region: inst.region,
      category: category,
      title: title,
      description: `${title}. A grievance filed formally with AICTE requesting immediate regulatory inspection and official intervention regarding ${inst.name}. Relevant documentary evidence attached.`,
      dateReceived: dateRec.toISOString(),
      bureauCode: bureau,
      bureauName: bureau === 'PGRC' ? 'Public Grievance Redressal Cell' : bureau === 'RB' ? 'Regulation Bureau' : bureau === 'AB' ? 'Approval Bureau' : bureau === 'ACAD' ? 'Academic Bureau' : 'Regional Office',
      priority: priority,
      status: status,
      assignedOfficerId: officer.id,
      assignedOfficerName: officer.name,
      lastActionDate: lastActDate.toISOString(),
      lastAction: `File reviewed by ${officer.name}; official docket updated.`,
      nextActionRequired: status === 'Resolved' ? 'Archive records' : 'Await institutional written response.',
      expectedDisposalDate: expDispDate.toISOString(),
      complainantName: complainant.name,
      complainantEmail: complainant.email,
      complainantType: complainant.type,
      isOverdue: isOverdue,
      overlapFlag: hasOverlap,
      evidence: i % 2 === 0 ? [
        { id: `ev-${caseIdCounter}-1`, fileName: `Evidence_Doc_${caseIdCounter}.pdf`, fileSize: '1.4 MB', fileType: 'application/pdf', uploadedAt: dateRec.toISOString(), uploadedBy: complainant.name }
      ] : [],
    });

    caseIdCounter++;
  }

  return complaints;
}

// Pre-built case relationships
export const SEED_RELATIONSHIPS: CaseRelationship[] = [
  {
    id: 'rel-1',
    sourceCaseId: 'case-1042',
    sourceCaseNumber: 'SYN-1042',
    targetCaseId: 'case-1088',
    targetCaseNumber: 'SYN-1088',
    institutionId: 'inst-1',
    institutionName: 'ABC Institute of Technology, Pune',
    bureauA: 'PGRC',
    bureauB: 'RB',
    matchScore: 94,
    reasons: [
      'Same AICTE Permanent ID (1-43289012)',
      'Identical grievance category: Fee Irregularity',
      'Overlapping filing window (8 days difference)',
      'Separate bureaus processing simultaneous complaints (PGRC & Regulation Bureau)',
      'Shared allegation of unapproved fees during admission',
    ],
    status: 'suggested',
    notes: 'High-priority candidate for Joint Bureau Coordination Room.',
  },
  {
    id: 'rel-2',
    sourceCaseId: 'case-1055',
    sourceCaseNumber: 'SYN-1055',
    targetCaseId: 'case-1064',
    targetCaseNumber: 'SYN-1064',
    institutionId: 'inst-2',
    institutionName: 'Apex Institute of Engineering & Technology, Bengaluru',
    bureauA: 'PGRC',
    bureauB: 'AB',
    matchScore: 89,
    reasons: [
      'Same AICTE Permanent ID (1-90128471)',
      'Correlated grievance: Ghost faculty vs EoA TSR compliance',
      'Both active in Q3 2026',
      'Cross-bureau inquiry pending between PGRC & Approval Bureau',
    ],
    status: 'confirmed',
    confirmedBy: 'Anita Sharma (PGRC)',
    confirmedAt: '2026-09-02T15:30:00+05:30',
    notes: 'Coordination Room CR-2026-02 established.',
  },
  {
    id: 'rel-3',
    sourceCaseId: 'case-1070',
    sourceCaseNumber: 'SYN-1070',
    targetCaseId: 'case-1079',
    targetCaseNumber: 'SYN-1079',
    institutionId: 'inst-3',
    institutionName: 'Delhi Institute of Advanced Studies, New Delhi',
    bureauA: 'RB',
    bureauB: 'PGRC',
    matchScore: 82,
    reasons: [
      'Same AICTE Permanent ID (1-67123982)',
      'Identical grievance category: Infrastructure & Campus Safety',
      'Both complaints target the Rohini campus academic block',
    ],
    status: 'confirmed',
    confirmedBy: 'Vikram Rao (RB)',
    confirmedAt: '2026-09-16T11:00:00+05:30',
    notes: 'Coordination Room CR-2026-03 established.',
  },
  {
    id: 'rel-4',
    sourceCaseId: 'case-1090',
    sourceCaseNumber: 'SYN-1090',
    targetCaseId: 'case-1098',
    targetCaseNumber: 'SYN-1098',
    institutionId: 'inst-4',
    institutionName: 'Kolkata Technical Institute, Kolkata',
    bureauA: 'PGRC',
    bureauB: 'RB',
    matchScore: 91,
    reasons: [
      'Same AICTE Permanent ID (1-78219034)',
      'Related allegations: Unapproved seats vs Quota circumvention',
      'Shared risk of supernumerary student admissions',
    ],
    status: 'confirmed',
    confirmedBy: 'Anita Sharma (PGRC)',
    confirmedAt: '2026-08-05T14:20:00+05:30',
    notes: 'Joint inquiry committee constituted.',
  },
];

// Pre-built Coordination Rooms
export const SEED_ROOMS: CoordinationRoom[] = [
  {
    id: 'room-1',
    roomNumber: 'CR-2026-01',
    title: 'Joint Fee Regulatory Audit – ABC Institute of Technology, Pune',
    institutionId: 'inst-1',
    institutionName: 'ABC Institute of Technology, Pune',
    leadBureau: 'PGRC',
    partnerBureaus: ['RB', 'RO'],
    caseIds: ['case-1042', 'case-1088'],
    caseNumbers: ['SYN-1042', 'SYN-1088'],
    officerIds: ['user-pgrc', 'user-rb', 'user-ro'],
    status: 'Active',
    createdAt: '2026-10-18T10:00:00+05:30',
    updatedAt: '2026-10-21T15:00:00+05:30',
  },
  {
    id: 'room-2',
    roomNumber: 'CR-2026-02',
    title: 'Faculty Disclosures & EoA Verification – Apex Institute, Bengaluru',
    institutionId: 'inst-2',
    institutionName: 'Apex Institute of Engineering & Technology, Bengaluru',
    leadBureau: 'AB',
    partnerBureaus: ['PGRC'],
    caseIds: ['case-1055', 'case-1064'],
    caseNumbers: ['SYN-1055', 'SYN-1064'],
    officerIds: ['user-pgrc', 'off-4'],
    status: 'Active',
    createdAt: '2026-09-03T11:30:00+05:30',
    updatedAt: '2026-10-19T17:15:00+05:30',
  },
  {
    id: 'room-3',
    roomNumber: 'CR-2026-03',
    title: 'Campus Infrastructure & Fire Safety Scrutiny – DIAS New Delhi',
    institutionId: 'inst-3',
    institutionName: 'Delhi Institute of Advanced Studies, New Delhi',
    leadBureau: 'RB',
    partnerBureaus: ['PGRC'],
    caseIds: ['case-1070', 'case-1079'],
    caseNumbers: ['SYN-1070', 'SYN-1079'],
    officerIds: ['user-rb', 'off-9'],
    status: 'Under Review',
    createdAt: '2026-09-17T09:45:00+05:30',
    updatedAt: '2026-10-15T16:30:00+05:30',
  },
];

export const SEED_TASKS: CoordinationTask[] = [
  {
    id: 'task-1',
    roomId: 'room-1',
    title: 'Reconcile cash fee vouchers with approved Fee Regulatory Committee slab',
    assigneeName: 'Vikram Rao',
    bureauCode: 'RB',
    dueDate: '2026-10-28',
    status: 'In Progress',
    priority: 'High',
    createdAt: '2026-10-18T10:30:00+05:30',
  },
  {
    id: 'task-2',
    roomId: 'room-1',
    title: 'Obtain notarized affidavit from student representatives regarding cash collections',
    assigneeName: 'Anita Sharma',
    bureauCode: 'PGRC',
    dueDate: '2026-10-26',
    status: 'Completed',
    priority: 'High',
    createdAt: '2026-10-18T10:35:00+05:30',
  },
  {
    id: 'task-3',
    roomId: 'room-1',
    title: 'Issue formal notice of joint hearing to Chairman and Principal of ABC Institute',
    assigneeName: 'Sunita Kulkarni',
    bureauCode: 'RO',
    dueDate: '2026-10-31',
    status: 'Pending',
    priority: 'Medium',
    createdAt: '2026-10-18T11:00:00+05:30',
  },
  {
    id: 'task-4',
    roomId: 'room-2',
    title: 'Cross-verify Aadhaar biometric attendance of 18 contested faculty members',
    assigneeName: 'Dr. P. Venkatraman',
    bureauCode: 'AB',
    dueDate: '2026-10-25',
    status: 'In Progress',
    priority: 'High',
    createdAt: '2026-09-04T12:00:00+05:30',
  },
  {
    id: 'task-5',
    roomId: 'room-3',
    title: 'Physical re-inspection of Rohini basement emergency fire exit compliance',
    assigneeName: 'Vikram Rao',
    bureauCode: 'RB',
    dueDate: '2026-10-27',
    status: 'In Progress',
    priority: 'High',
    createdAt: '2026-09-18T14:00:00+05:30',
  },
];

export const SEED_NOTES: CoordinationNote[] = [
  {
    id: 'note-1',
    roomId: 'room-1',
    authorName: 'Anita Sharma',
    authorRole: 'Assistant Director (PGRC)',
    bureauCode: 'PGRC',
    content: 'Complainant Rahul Verma has furnished 4 cash receipts with institute stamp confirming payment of ₹35,000 titled "Special Development Contribution". This explicitly violates the approved fee schedule.',
    timestamp: '2026-10-18T14:15:00+05:30',
  },
  {
    id: 'note-2',
    roomId: 'room-1',
    authorName: 'Vikram Rao',
    authorRole: 'Deputy Director (RB)',
    bureauCode: 'RB',
    content: 'Checked the Fee Regulatory Authority record for ABC Institute (Permanent ID 1-43289012). Their approved tuition fee is ₹1,12,000 per annum all-inclusive. Charging separate development cash is grounds for penalty under Section 10(n) of AICTE Act.',
    timestamp: '2026-10-19T09:30:00+05:30',
  },
  {
    id: 'note-3',
    roomId: 'room-1',
    authorName: 'Sunita Kulkarni',
    authorRole: 'Regional Officer (Western Region)',
    bureauCode: 'RO',
    content: 'Western Regional Office will depute an inspecting officer on 29th October to serve the summon in person and inspect the physical cash collection registers.',
    timestamp: '2026-10-21T11:45:00+05:30',
  },
  {
    id: 'note-4',
    roomId: 'room-2',
    authorName: 'Dr. P. Venkatraman',
    authorRole: 'Advisor (Approval Bureau)',
    bureauCode: 'AB',
    content: 'Initial portal match indicates 6 faculty names are also registered simultaneously in another private polytechnic in Tumakuru. Notice issued to Apex Trust.',
    timestamp: '2026-10-10T16:00:00+05:30',
  },
];

// Helper to seed 300+ realistic audit events
function generateSeedAuditEvents(complaints: Complaint[]): AuditEvent[] {
  const events: AuditEvent[] = [];
  let eventCounter = 1;

  // Add specific events for flagship case SYN-1042
  events.push({
    id: `aud-${eventCounter++}`,
    caseId: 'case-1042',
    caseNumber: 'SYN-1042',
    eventType: 'Case Created',
    actorName: 'Rahul Verma',
    actorRole: 'Complainant (Student)',
    details: 'Formal grievance filed against ABC Institute of Technology, Pune with 2 PDF receipts attached.',
    isAiSuggested: false,
    timestamp: '2026-09-14T10:30:00+05:30',
  });

  events.push({
    id: `aud-${eventCounter++}`,
    caseId: 'case-1042',
    caseNumber: 'SYN-1042',
    eventType: 'Overlap Detected',
    actorName: 'SYRA Overlap Engine',
    actorRole: 'AI Intelligence System',
    details: 'Detected 94% multi-factor correlation with Case SYN-1088 registered at Regulation Bureau.',
    isAiSuggested: true,
    timestamp: '2026-09-22T11:16:00+05:30',
  });

  events.push({
    id: `aud-${eventCounter++}`,
    caseId: 'case-1042',
    caseNumber: 'SYN-1042',
    eventType: 'Case Assigned',
    actorName: 'Dr. R. K. Mehta',
    actorRole: 'Senior Management (Advisor)',
    details: 'Assigned to Anita Sharma, Assistant Director (PGRC).',
    isAiSuggested: false,
    timestamp: '2026-09-15T11:00:00+05:30',
  });

  events.push({
    id: `aud-${eventCounter++}`,
    caseId: 'case-1042',
    caseNumber: 'SYN-1042',
    eventType: 'Relationship Confirmed',
    actorName: 'Anita Sharma',
    actorRole: 'Assistant Director (PGRC)',
    details: 'Officer confirmed cross-bureau overlap with Case SYN-1088 based on shared institution ID and fee evidence.',
    isAiSuggested: false,
    timestamp: '2026-10-18T09:45:00+05:30',
  });

  events.push({
    id: `aud-${eventCounter++}`,
    caseId: 'case-1042',
    caseNumber: 'SYN-1042',
    eventType: 'Coordination Room Created',
    actorName: 'Anita Sharma',
    actorRole: 'Assistant Director (PGRC)',
    details: 'Coordination Room CR-2026-01 initiated linking Case SYN-1042 (PGRC) and Case SYN-1088 (RB).',
    isAiSuggested: false,
    timestamp: '2026-10-18T10:00:00+05:30',
  });

  // Seed events across the rest of the complaints to exceed 300 audit events
  const eventTypes: AuditEvent['eventType'][] = [
    'Case Created',
    'Case Assigned',
    'Status Changed',
    'Overlap Detected',
    'Relationship Confirmed',
    'Task Created',
    'Note Added',
    'Escalation Filed',
    'Evidence Uploaded',
    'AI Suggested Action',
  ];

  complaints.slice(0, 100).forEach((c, idx) => {
    // 3 events per case
    events.push({
      id: `aud-${eventCounter++}`,
      caseId: c.id,
      caseNumber: c.caseNumber,
      eventType: 'Case Created',
      actorName: c.complainantName,
      actorRole: `${c.complainantType}`,
      details: `Docket registered under ${c.bureauCode}: "${c.title}"`,
      isAiSuggested: false,
      timestamp: c.dateReceived,
    });

    if (idx % 2 === 0) {
      events.push({
        id: `aud-${eventCounter++}`,
        caseId: c.id,
        caseNumber: c.caseNumber,
        eventType: 'AI Suggested Action',
        actorName: 'SYRA Overlap Engine',
        actorRole: 'AI Intelligence System',
        details: `Identified similarity clusters in ${c.institutionName} regarding ${c.category}. Recommended joint review.`,
        isAiSuggested: true,
        timestamp: new Date(new Date(c.dateReceived).getTime() + 15 * 60 * 1000).toISOString(),
      });
    }

    events.push({
      id: `aud-${eventCounter++}`,
      caseId: c.id,
      caseNumber: c.caseNumber,
      eventType: 'Status Changed',
      actorName: c.assignedOfficerName,
      actorRole: 'Bureau Officer',
      details: `Status transitioned to "${c.status}". Action logged: ${c.lastAction}`,
      isAiSuggested: false,
      timestamp: c.lastActionDate,
    });
  });

  return events;
}

// Seed notifications
export const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Cross-Bureau Overlap Alert: ABC Institute of Technology',
    message: 'Case SYN-1042 (PGRC) has a high-confidence match (94%) with Case SYN-1088 (Regulation Bureau). Coordination required.',
    type: 'overlap',
    caseNumber: 'SYN-1042',
    read: false,
    timestamp: '2026-10-24T18:30:00+05:30',
  },
  {
    id: 'notif-2',
    title: 'Delay Warning: Case SYN-1042 Exceeded Disposal Window',
    message: 'Expected disposal was 10 Oct 2026. DelayRadar flagged 14 days of inactivity.',
    type: 'deadline',
    caseNumber: 'SYN-1042',
    read: false,
    timestamp: '2026-10-23T09:15:00+05:30',
  },
  {
    id: 'notif-3',
    title: 'Coordination Task Assigned: Joint Fee Audit',
    message: 'You have been assigned: "Reconcile cash fee vouchers with approved FRC slab" in Room CR-2026-01.',
    type: 'coordination',
    caseNumber: 'SYN-1042',
    read: true,
    timestamp: '2026-10-21T10:00:00+05:30',
  },
  {
    id: 'notif-4',
    title: 'New Complaint Docket Assigned',
    message: 'Case SYN-1102 against ABC Institute of Technology assigned for Western Region preliminary review.',
    type: 'assignment',
    caseNumber: 'SYN-1102',
    read: true,
    timestamp: '2026-10-15T11:30:00+05:30',
  },
  {
    id: 'notif-5',
    title: 'Escalation Notice Filed: Case SYN-1070',
    message: 'Fire safety deficiency case escalated to Advisor (Regulation Bureau) following emergency inspection.',
    type: 'escalation',
    caseNumber: 'SYN-1070',
    read: false,
    timestamp: '2026-10-12T16:00:00+05:30',
  },
];

// Persistent Database Layer with reactive subscribers
const DB_STORAGE_KEY = 'syntra_database_records_v1';

export interface DatabaseState {
  institutions: Institution[];
  complaints: Complaint[];
  relationships: CaseRelationship[];
  rooms: CoordinationRoom[];
  tasks: CoordinationTask[];
  notes: CoordinationNote[];
  auditEvents: AuditEvent[];
  notifications: AppNotification[];
  settings: AppSettings;
  workflowStages: WorkflowStage[];
}

type Listener = (state: DatabaseState) => void;

class DatabaseService {
  private state: DatabaseState;
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.state = this.loadOrSeed();
  }

  private loadOrSeed(): DatabaseState {
    try {
      const stored = localStorage.getItem(DB_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.complaints && parsed.complaints.length > 50) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load stored DB state, initializing seed data:', e);
    }

    // Initialize fresh seed data
    const complaints = generateSeedComplaints();
    const auditEvents = generateSeedAuditEvents(complaints);

    const initialState: DatabaseState = {
      institutions: SEED_INSTITUTIONS,
      complaints: complaints,
      relationships: SEED_RELATIONSHIPS,
      rooms: SEED_ROOMS,
      tasks: SEED_TASKS,
      notes: SEED_NOTES,
      auditEvents: auditEvents,
      notifications: SEED_NOTIFICATIONS,
      settings: DEFAULT_SETTINGS,
      workflowStages: WORKFLOW_STAGES,
    };

    this.save(initialState);
    return initialState;
  }

  private save(state: DatabaseState) {
    try {
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  private notify() {
    this.save(this.state);
    this.listeners.forEach((listener) => listener(this.state));
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getState(): DatabaseState {
    return this.state;
  }

  public resetDatabase(): void {
    localStorage.removeItem(DB_STORAGE_KEY);
    this.state = this.loadOrSeed();
    this.notify();
  }

  // Complaints CRUD
  public getComplaints(): Complaint[] {
    return this.state.complaints;
  }

  public getComplaintById(id: string): Complaint | undefined {
    return this.state.complaints.find((c) => c.id === id || c.caseNumber === id);
  }

  public createComplaint(data: Omit<Complaint, 'id' | 'caseNumber'>): Complaint {
    const existingCount = this.state.complaints.length;
    const caseNumber = `SYN-${1000 + existingCount + 1}`;
    const id = `case-${1000 + existingCount + 1}`;

    const newComplaint: Complaint = {
      ...data,
      id,
      caseNumber,
    };

    this.state.complaints = [newComplaint, ...this.state.complaints];

    // Update institution linked cases count
    this.state.institutions = this.state.institutions.map((inst) =>
      inst.id === newComplaint.institutionId || inst.permanentId === newComplaint.institutionPermanentId
        ? { ...inst, linkedCasesCount: inst.linkedCasesCount + 1 }
        : inst
    );

    // Append Audit Event
    this.addAuditEvent({
      caseId: id,
      caseNumber: caseNumber,
      eventType: 'Case Created',
      actorName: newComplaint.complainantName,
      actorRole: `${newComplaint.complainantType}`,
      details: `New case registered under ${newComplaint.bureauCode}: "${newComplaint.title}". Priority: ${newComplaint.priority}`,
      isAiSuggested: false,
    });

    this.notify();
    return newComplaint;
  }

  public updateComplaint(id: string, updates: Partial<Complaint>, actorName: string, actorRole: string): Complaint | undefined {
    const complaint = this.state.complaints.find((c) => c.id === id || c.caseNumber === id);
    if (!complaint) return undefined;

    const previousStatus = complaint.status;
    const updated: Complaint = {
      ...complaint,
      ...updates,
      lastActionDate: new Date().toISOString(),
    };

    this.state.complaints = this.state.complaints.map((c) => (c.id === complaint.id ? updated : c));

    if (updates.status && updates.status !== previousStatus) {
      this.addAuditEvent({
        caseId: complaint.id,
        caseNumber: complaint.caseNumber,
        eventType: 'Status Changed',
        actorName,
        actorRole,
        details: `Status transitioned from "${previousStatus}" to "${updates.status}". Remarks: ${updates.lastAction || 'Status updated'}`,
        isAiSuggested: false,
      });
    }

    this.notify();
    return updated;
  }

  // Institutions CRUD
  public getInstitutions(): Institution[] {
    return this.state.institutions;
  }

  public getInstitutionById(id: string): Institution | undefined {
    return this.state.institutions.find((i) => i.id === id || i.permanentId === id);
  }

  // Relationships CRUD
  public getRelationships(): CaseRelationship[] {
    return this.state.relationships;
  }

  public addRelationship(rel: Omit<CaseRelationship, 'id'>): CaseRelationship {
    const id = `rel-${Date.now()}`;
    const newRel: CaseRelationship = { ...rel, id };
    this.state.relationships = [newRel, ...this.state.relationships];

    this.addAuditEvent({
      caseId: rel.sourceCaseId,
      caseNumber: rel.sourceCaseNumber,
      eventType: rel.status === 'confirmed' ? 'Relationship Confirmed' : 'Overlap Detected',
      actorName: rel.confirmedBy || 'SYRA Overlap Engine',
      actorRole: rel.confirmedBy ? 'Bureau Officer' : 'AI Intelligence System',
      details: `Cross-bureau correlation between ${rel.sourceCaseNumber} and ${rel.targetCaseNumber} (${rel.matchScore}% confidence). Status: ${rel.status}`,
      isAiSuggested: !rel.confirmedBy,
    });

    this.notify();
    return newRel;
  }

  public updateRelationshipStatus(
    id: string,
    status: 'confirmed' | 'dismissed',
    actorName: string,
    notes?: string
  ): CaseRelationship | undefined {
    const rel = this.state.relationships.find((r) => r.id === id);
    if (!rel) return undefined;

    const updated: CaseRelationship = {
      ...rel,
      status,
      confirmedBy: actorName,
      confirmedAt: new Date().toISOString(),
      notes: notes || rel.notes,
    };

    this.state.relationships = this.state.relationships.map((r) => (r.id === id ? updated : r));

    this.addAuditEvent({
      caseId: rel.sourceCaseId,
      caseNumber: rel.sourceCaseNumber,
      eventType: status === 'confirmed' ? 'Relationship Confirmed' : 'Relationship Dismissed',
      actorName,
      actorRole: 'Bureau Officer',
      details: `Officer ${status} cross-bureau overlap with ${rel.targetCaseNumber}. Notes: ${notes || 'None'}`,
      isAiSuggested: false,
    });

    this.notify();
    return updated;
  }

  // Coordination Rooms CRUD
  public getRooms(): CoordinationRoom[] {
    return this.state.rooms;
  }

  public getRoomById(id: string): CoordinationRoom | undefined {
    return this.state.rooms.find((r) => r.id === id || r.roomNumber === id);
  }

  public createRoom(
    data: Omit<CoordinationRoom, 'id' | 'roomNumber' | 'createdAt' | 'updatedAt'>,
    actorName: string
  ): CoordinationRoom {
    const roomNumber = `CR-2026-${String(this.state.rooms.length + 1).padStart(2, '0')}`;
    const id = `room-${Date.now()}`;
    const now = new Date().toISOString();

    const newRoom: CoordinationRoom = {
      ...data,
      id,
      roomNumber,
      createdAt: now,
      updatedAt: now,
    };

    this.state.rooms = [newRoom, ...this.state.rooms];

    // Link complaints to this room
    this.state.complaints = this.state.complaints.map((c) =>
      data.caseIds.includes(c.id)
        ? { ...c, status: 'Coordination Required', coordinationRoomId: id }
        : c
    );

    this.addAuditEvent({
      eventType: 'Coordination Room Created',
      actorName,
      actorRole: 'Bureau Officer',
      details: `Coordination Room ${roomNumber} opened: "${data.title}" linking cases: ${data.caseNumbers.join(', ')}`,
      isAiSuggested: false,
    });

    this.addNotification({
      title: `Coordination Room ${roomNumber} Created`,
      message: `Joint workspace established for ${data.institutionName} across ${data.partnerBureaus.join(', ')}.`,
      type: 'coordination',
    });

    this.notify();
    return newRoom;
  }

  // Tasks CRUD
  public getTasks(roomId?: string): CoordinationTask[] {
    return roomId ? this.state.tasks.filter((t) => t.roomId === roomId) : this.state.tasks;
  }

  public createTask(data: Omit<CoordinationTask, 'id' | 'createdAt'>, actorName: string): CoordinationTask {
    const id = `task-${Date.now()}`;
    const newTask: CoordinationTask = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };
    this.state.tasks = [newTask, ...this.state.tasks];

    this.addAuditEvent({
      eventType: 'Task Created',
      actorName,
      actorRole: 'Bureau Officer',
      details: `Coordination task added: "${data.title}". Assigned to ${data.assigneeName} (${data.bureauCode})`,
      isAiSuggested: false,
    });

    this.notify();
    return newTask;
  }

  public updateTaskStatus(id: string, status: CoordinationTask['status'], actorName: string): CoordinationTask | undefined {
    const task = this.state.tasks.find((t) => t.id === id);
    if (!task) return undefined;

    const updated = { ...task, status };
    this.state.tasks = this.state.tasks.map((t) => (t.id === id ? updated : t));

    this.addAuditEvent({
      eventType: 'Task Created',
      actorName,
      actorRole: 'Bureau Officer',
      details: `Task "${task.title}" updated to status: ${status}`,
      isAiSuggested: false,
    });

    this.notify();
    return updated;
  }

  // Notes CRUD
  public getNotes(roomId: string): CoordinationNote[] {
    return this.state.notes.filter((n) => n.roomId === roomId);
  }

  public addNote(note: Omit<CoordinationNote, 'id' | 'timestamp'>): CoordinationNote {
    const id = `note-${Date.now()}`;
    const newNote: CoordinationNote = {
      ...note,
      id,
      timestamp: new Date().toISOString(),
    };
    this.state.notes = [...this.state.notes, newNote];

    this.addAuditEvent({
      eventType: 'Note Added',
      actorName: note.authorName,
      actorRole: note.authorRole,
      details: `Thread note added to Coordination Room by ${note.authorName} (${note.bureauCode})`,
      isAiSuggested: false,
    });

    this.notify();
    return newNote;
  }

  // Audit Events
  public getAuditEvents(): AuditEvent[] {
    return this.state.auditEvents;
  }

  public addAuditEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): AuditEvent {
    const id = `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newEvent: AuditEvent = {
      ...event,
      id,
      timestamp: new Date().toISOString(),
    };
    this.state.auditEvents = [newEvent, ...this.state.auditEvents];
    return newEvent;
  }

  // Notifications
  public getNotifications(): AppNotification[] {
    return this.state.notifications;
  }

  public markNotificationAsRead(id: string): void {
    this.state.notifications = this.state.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    this.notify();
  }

  public markAllNotificationsAsRead(): void {
    this.state.notifications = this.state.notifications.map((n) => ({ ...n, read: true }));
    this.notify();
  }

  public addNotification(notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>): AppNotification {
    const id = `notif-${Date.now()}`;
    const newNotif: AppNotification = {
      ...notif,
      id,
      read: false,
      timestamp: new Date().toISOString(),
    };
    this.state.notifications = [newNotif, ...this.state.notifications];
    this.notify();
    return newNotif;
  }

  // Settings
  public getSettings(): AppSettings {
    return this.state.settings;
  }

  public updateSettings(updates: Partial<AppSettings>): AppSettings {
    this.state.settings = { ...this.state.settings, ...updates };
    this.notify();
    return this.state.settings;
  }

  // Workflow Stages
  public getWorkflowStages(): WorkflowStage[] {
    return this.state.workflowStages;
  }

  public updateWorkflowStages(stages: WorkflowStage[]): void {
    this.state.workflowStages = stages;
    this.notify();
  }
}

export const db = new DatabaseService();
