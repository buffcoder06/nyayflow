// src/lib/demo/demo-data.ts
// Pre-loaded sample data for the NyayVakil demo workspace.
// All IDs are prefixed with "demo-" to distinguish them from real data.
// Data reflects realistic Indian legal practice context.

// ─────────────────────────────────────────────────────────────────────────────
// INLINE TYPE SHAPES
// (mirroring src/types/index.ts without importing it, for safe standalone use)
// ─────────────────────────────────────────────────────────────────────────────

interface DemoUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "advocate" | "junior" | "clerk" | "admin";
  avatar?: string;
  barCouncilNumber?: string;
  specialization?: string[];
  chamberName?: string;
  createdAt: string;
}

interface DemoClient {
  id: string;
  name: string;
  mobile: string;
  alternateMobile?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  clientType: "individual" | "company" | "family" | "organization";
  notes?: string;
  linkedMatterIds: string[];
  totalOutstanding: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

interface DemoMatter {
  id: string;
  matterTitle: string;
  caseNumber?: string;
  cnrNumber?: string;
  caseType: string;
  courtName: string;
  courtLevel:
    | "supreme_court"
    | "high_court"
    | "district_court"
    | "sessions_court"
    | "magistrate_court"
    | "family_court"
    | "consumer_court"
    | "tribunal"
    | "other";
  caseStage?: string;
  filingDate?: string;
  nextHearingDate?: string;
  oppositeParty?: string;
  oppositeAdvocate?: string;
  assignedJuniorId?: string;
  status: "active" | "pending" | "disposed" | "on_hold" | "closed";
  priority: "high" | "medium" | "low";
  judgeName?: string;
  actSection?: string;
  notes?: string;
  clientId: string;
  totalFeeAgreed: number;
  totalFeePaid: number;
  totalExpenses: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface DemoHearing {
  id: string;
  matterId: string;
  matterTitle: string;
  clientName: string;
  courtName: string;
  date: string;
  time?: string;
  purpose?: string;
  notes?: string;
  nextAction?: string;
  nextHearingDate?: string;
  assignedTo?: string;
  status: "upcoming" | "attended" | "adjourned" | "completed" | "missed";
  createdAt: string;
  updatedAt: string;
}

interface DemoFeeEntry {
  id: string;
  matterId: string;
  clientId: string;
  description: string;
  totalAmount: number;
  receivedAmount: number;
  pendingAmount: number;
  dueDate?: string;
  status: "paid" | "partially_paid" | "overdue" | "not_started";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface DemoExpense {
  id: string;
  matterId?: string;
  clientId?: string;
  date: string;
  expenseType:
    | "court_fee"
    | "clerk_expense"
    | "photocopy"
    | "typing"
    | "travel"
    | "affidavit"
    | "filing"
    | "stamp"
    | "miscellaneous";
  description: string;
  amount: number;
  paidBy: string;
  isRecoverable: boolean;
  isRecovered: boolean;
  notes?: string;
  createdAt: string;
}

interface DemoDocument {
  id: string;
  matterId?: string;
  clientId?: string;
  name: string;
  category:
    | "vakalatnama"
    | "affidavit"
    | "notice"
    | "petition"
    | "written_statement"
    | "evidence"
    | "receipt"
    | "invoice"
    | "id_proof"
    | "court_order"
    | "miscellaneous";
  fileType: string;
  fileSize: string;
  fileUrl?: string;
  description?: string;
  uploadedBy: string;
  uploadedAt: string;
  tags?: string[];
}

interface DemoTask {
  id: string;
  title: string;
  description?: string;
  matterId?: string;
  matterTitle?: string;
  clientId?: string;
  assignedTo: string;
  assignedBy: string;
  dueDate?: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in_progress" | "completed" | "cancelled";
  notes?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface DemoDashboardStats {
  totalActiveMatters: number;
  todayHearings: number;
  upcomingHearings: number;
  pendingPayments: number;
  monthlyCollections: number;
  pendingTasks: number;
  totalClients: number;
  overduePayments: number;
  monthlyExpenses: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// DEMO USER
// ─────────────────────────────────────────────────────────────────────────────

export const DEMO_USER: DemoUser = {
  id: "demo-user-001",
  name: "Demo Advocate",
  email: "demo@nyayvakil.in",
  phone: "9999999999",
  role: "advocate",
  barCouncilNumber: "DL/DEMO/2020",
  specialization: ["Civil Law", "Criminal Law", "Family Law"],
  chamberName: "Demo Chamber",
  createdAt: "2024-01-01T09:00:00.000Z",
};

// ─────────────────────────────────────────────────────────────────────────────
// CLIENTS — 6 samples (mix of individual and company, Indian names)
// ─────────────────────────────────────────────────────────────────────────────

const demoClients: DemoClient[] = [
  {
    id: "demo-cli-001",
    name: "Rajesh Kumar Verma",
    mobile: "9811223344",
    alternateMobile: "9811223345",
    email: "rajesh.verma@gmail.com",
    address: "14-B, Vasant Vihar",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110057",
    clientType: "individual",
    notes: "Property dispute client. Referred by Adv. Gupta.",
    linkedMatterIds: ["demo-mat-001", "demo-mat-005"],
    totalOutstanding: 45000,
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2025-02-10T14:00:00.000Z",
    isActive: true,
  },
  {
    id: "demo-cli-002",
    name: "Sunita Devi Agarwal",
    mobile: "9873456712",
    email: "sunita.agarwal@yahoo.com",
    address: "Plot 22, Saraswati Nagar",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411027",
    clientType: "individual",
    notes: "Divorce proceedings. Handle with sensitivity.",
    linkedMatterIds: ["demo-mat-002"],
    totalOutstanding: 20000,
    createdAt: "2024-03-08T11:00:00.000Z",
    updatedAt: "2025-01-20T09:30:00.000Z",
    isActive: true,
  },
  {
    id: "demo-cli-003",
    name: "Mehta Constructions Pvt. Ltd.",
    mobile: "9810012345",
    email: "legal@mehtaconstructions.com",
    address: "301, Maker Chambers IV, Nariman Point",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400021",
    clientType: "company",
    notes: "Corporate client. Multiple ongoing disputes.",
    linkedMatterIds: ["demo-mat-003", "demo-mat-007"],
    totalOutstanding: 180000,
    createdAt: "2023-11-01T09:00:00.000Z",
    updatedAt: "2025-03-01T16:00:00.000Z",
    isActive: true,
  },
  {
    id: "demo-cli-004",
    name: "Arvind Shankar Pillai",
    mobile: "9844556677",
    email: "arvind.pillai@hotmail.com",
    address: "Flat 5B, Greenwood Apartments, Jayanagar",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560082",
    clientType: "individual",
    notes: "Criminal case — bail application pending.",
    linkedMatterIds: ["demo-mat-004"],
    totalOutstanding: 75000,
    createdAt: "2024-06-20T10:00:00.000Z",
    updatedAt: "2025-02-28T11:00:00.000Z",
    isActive: true,
  },
  {
    id: "demo-cli-005",
    name: "Priyanka Nair",
    mobile: "9823456789",
    email: "priyanka.nair@gmail.com",
    address: "TC 12/490, Pattom",
    city: "Thiruvananthapuram",
    state: "Kerala",
    pincode: "695004",
    clientType: "individual",
    notes: "Consumer complaint against insurance company.",
    linkedMatterIds: ["demo-mat-006"],
    totalOutstanding: 0,
    createdAt: "2024-09-05T09:00:00.000Z",
    updatedAt: "2025-01-10T10:00:00.000Z",
    isActive: true,
  },
  {
    id: "demo-cli-006",
    name: "Gupta Traders & Associates",
    mobile: "9901234567",
    email: "info@guptatraders.in",
    address: "Shop 7, Chandni Chowk Market",
    city: "Delhi",
    state: "Delhi",
    pincode: "110006",
    clientType: "company",
    notes: "Commercial dispute and writ petition.",
    linkedMatterIds: ["demo-mat-008"],
    totalOutstanding: 55000,
    createdAt: "2024-07-14T09:00:00.000Z",
    updatedAt: "2025-03-05T13:00:00.000Z",
    isActive: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MATTERS — 8 samples covering civil, criminal, family, writ
// ─────────────────────────────────────────────────────────────────────────────

const demoMatters: DemoMatter[] = [
  {
    id: "demo-mat-001",
    matterTitle: "Verma vs. Singh — Property Title Dispute",
    caseNumber: "CS/1142/2024",
    cnrNumber: "DLHC010112345/2024",
    caseType: "civil",
    courtName: "Delhi High Court",
    courtLevel: "high_court",
    caseStage: "Written Statements Filed",
    filingDate: "2024-02-10",
    nextHearingDate: "2025-04-15",
    oppositeParty: "Harpreet Singh",
    oppositeAdvocate: "Adv. K.L. Sharma",
    assignedJuniorId: "demo-user-002",
    status: "active",
    priority: "high",
    judgeName: "Hon. Justice Meera Kapoor",
    actSection: "Specific Relief Act, 1963 — S. 34",
    notes: "Client claims adverse possession. All documents received.",
    clientId: "demo-cli-001",
    totalFeeAgreed: 150000,
    totalFeePaid: 100000,
    totalExpenses: 12500,
    createdAt: "2024-02-12T09:00:00.000Z",
    updatedAt: "2025-03-01T10:00:00.000Z",
    createdBy: "demo-user-001",
  },
  {
    id: "demo-mat-002",
    matterTitle: "Agarwal vs. Agarwal — Contested Divorce Petition",
    caseNumber: "HMA/234/2024",
    cnrNumber: "MHPN020034567/2024",
    caseType: "family",
    courtName: "Family Court Pune",
    courtLevel: "family_court",
    caseStage: "Evidence Stage",
    filingDate: "2024-04-05",
    nextHearingDate: "2025-04-08",
    oppositeParty: "Rakesh Agarwal",
    oppositeAdvocate: "Adv. V. Joshi",
    status: "active",
    priority: "high",
    judgeName: "Hon. Judge Rekha Desai",
    actSection: "Hindu Marriage Act, 1955 — S. 13",
    notes: "Custody of child is key issue. Mediation attempted, failed.",
    clientId: "demo-cli-002",
    totalFeeAgreed: 80000,
    totalFeePaid: 60000,
    totalExpenses: 8000,
    createdAt: "2024-04-06T10:00:00.000Z",
    updatedAt: "2025-02-20T11:00:00.000Z",
    createdBy: "demo-user-001",
  },
  {
    id: "demo-mat-003",
    matterTitle: "Mehta Constructions vs. XYZ Developers — Contract Dispute",
    caseNumber: "CS/892/2023",
    cnrNumber: "MHHC010089201/2023",
    caseType: "civil",
    courtName: "Bombay High Court",
    courtLevel: "high_court",
    caseStage: "Arguments Stage",
    filingDate: "2023-08-20",
    nextHearingDate: "2025-04-22",
    oppositeParty: "XYZ Developers Pvt. Ltd.",
    oppositeAdvocate: "Adv. R. Iyer",
    status: "active",
    priority: "high",
    judgeName: "Hon. Justice S.M. Deshpande",
    actSection: "Indian Contract Act, 1872 — S. 73, 74",
    notes: "Construction contract breach. Arbitration award challenged.",
    clientId: "demo-cli-003",
    totalFeeAgreed: 350000,
    totalFeePaid: 250000,
    totalExpenses: 35000,
    createdAt: "2023-08-22T09:00:00.000Z",
    updatedAt: "2025-03-10T14:00:00.000Z",
    createdBy: "demo-user-001",
  },
  {
    id: "demo-mat-004",
    matterTitle: "State vs. Arvind Pillai — Bail Application (IPC 302)",
    caseNumber: "BA/567/2024",
    cnrNumber: "KABS010056789/2024",
    caseType: "criminal",
    courtName: "Sessions Court Bengaluru",
    courtLevel: "sessions_court",
    caseStage: "Bail Hearing",
    filingDate: "2024-07-01",
    nextHearingDate: "2025-04-03",
    oppositeParty: "State of Karnataka",
    oppositeAdvocate: "PP Anand Kumar",
    status: "active",
    priority: "high",
    judgeName: "Addl. Sessions Judge T. Ramakrishna",
    actSection: "IPC, 1860 — S. 302, 34; CrPC S. 439",
    notes: "Client in custody. Previous bail rejected. Fresh grounds filed.",
    clientId: "demo-cli-004",
    totalFeeAgreed: 200000,
    totalFeePaid: 150000,
    totalExpenses: 5000,
    createdAt: "2024-07-02T10:00:00.000Z",
    updatedAt: "2025-03-01T09:00:00.000Z",
    createdBy: "demo-user-001",
  },
  {
    id: "demo-mat-005",
    matterTitle: "Verma vs. DDA — Allotment Cancellation Challenge",
    caseNumber: "WP/11234/2024",
    cnrNumber: "DLHC010111234/2024",
    caseType: "writ",
    courtName: "Delhi High Court",
    courtLevel: "high_court",
    caseStage: "Notice Issued",
    filingDate: "2024-09-12",
    nextHearingDate: "2025-05-10",
    oppositeParty: "Delhi Development Authority",
    oppositeAdvocate: "Central Govt. Standing Counsel",
    status: "active",
    priority: "medium",
    judgeName: "Hon. Justice P.K. Khanna",
    actSection: "Constitution of India — Art. 226",
    notes: "DDA cancelled flat allotment without notice. Writ filed.",
    clientId: "demo-cli-001",
    totalFeeAgreed: 50000,
    totalFeePaid: 50000,
    totalExpenses: 3000,
    createdAt: "2024-09-13T09:00:00.000Z",
    updatedAt: "2025-01-20T10:00:00.000Z",
    createdBy: "demo-user-001",
  },
  {
    id: "demo-mat-006",
    matterTitle: "Nair vs. StarHealth Insurance — Consumer Complaint",
    caseNumber: "CC/789/2024",
    cnrNumber: "KLTV030078901/2024",
    caseType: "consumer",
    courtName: "District Consumer Forum Thiruvananthapuram",
    courtLevel: "consumer_court",
    caseStage: "Affidavit Filed",
    filingDate: "2024-10-01",
    nextHearingDate: "2025-04-18",
    oppositeParty: "StarHealth and Allied Insurance Co. Ltd.",
    status: "active",
    priority: "medium",
    actSection: "Consumer Protection Act, 2019 — S. 35",
    notes: "Claim rejected wrongfully. Policy documents verified.",
    clientId: "demo-cli-005",
    totalFeeAgreed: 25000,
    totalFeePaid: 25000,
    totalExpenses: 1500,
    createdAt: "2024-10-02T11:00:00.000Z",
    updatedAt: "2025-02-15T12:00:00.000Z",
    createdBy: "demo-user-001",
  },
  {
    id: "demo-mat-007",
    matterTitle: "Mehta Constructions — Land Acquisition Compensation",
    caseNumber: "LA/456/2022",
    cnrNumber: "MHHC010045678/2022",
    caseType: "civil",
    courtName: "Bombay High Court",
    courtLevel: "high_court",
    caseStage: "Disposed",
    filingDate: "2022-03-14",
    nextHearingDate: undefined,
    oppositeParty: "State of Maharashtra",
    status: "disposed",
    priority: "low",
    judgeName: "Hon. Justice A. Patel",
    actSection: "Right to Fair Compensation Act, 2013",
    notes: "Matter concluded. Award received. Archiving documents.",
    clientId: "demo-cli-003",
    totalFeeAgreed: 120000,
    totalFeePaid: 120000,
    totalExpenses: 18000,
    createdAt: "2022-03-15T09:00:00.000Z",
    updatedAt: "2024-12-01T10:00:00.000Z",
    createdBy: "demo-user-001",
  },
  {
    id: "demo-mat-008",
    matterTitle: "Gupta Traders vs. Income Tax Dept. — Writ (Reassessment)",
    caseNumber: "WP/5678/2024",
    cnrNumber: "DLHC010056780/2024",
    caseType: "writ",
    courtName: "Delhi High Court",
    courtLevel: "high_court",
    caseStage: "Stay Order in Force",
    filingDate: "2024-05-20",
    nextHearingDate: "2025-04-28",
    oppositeParty: "Assistant Commissioner of Income Tax, Circle 12",
    oppositeAdvocate: "Sr. Standing Counsel (Income Tax)",
    status: "active",
    priority: "high",
    judgeName: "Hon. Justice R.K. Gauba",
    actSection: "Income Tax Act, 1961 — S. 148; Art. 226 Constitution",
    notes: "Stay obtained against reassessment order. Next date for reply.",
    clientId: "demo-cli-006",
    totalFeeAgreed: 180000,
    totalFeePaid: 120000,
    totalExpenses: 9000,
    createdAt: "2024-05-21T09:00:00.000Z",
    updatedAt: "2025-03-08T11:00:00.000Z",
    createdBy: "demo-user-001",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HEARINGS — 10 samples (mix of upcoming, completed, adjourned)
// ─────────────────────────────────────────────────────────────────────────────

const demoHearings: DemoHearing[] = [
  {
    id: "demo-hrg-001",
    matterId: "demo-mat-004",
    matterTitle: "State vs. Arvind Pillai — Bail Application (IPC 302)",
    clientName: "Arvind Shankar Pillai",
    courtName: "Sessions Court Bengaluru",
    date: "2025-04-03",
    time: "10:30",
    purpose: "Bail Hearing",
    notes: "Fresh grounds filed based on medical condition.",
    assignedTo: "demo-user-001",
    status: "upcoming",
    createdAt: "2025-03-01T09:00:00.000Z",
    updatedAt: "2025-03-01T09:00:00.000Z",
  },
  {
    id: "demo-hrg-002",
    matterId: "demo-mat-002",
    matterTitle: "Agarwal vs. Agarwal — Contested Divorce Petition",
    clientName: "Sunita Devi Agarwal",
    courtName: "Family Court Pune",
    date: "2025-04-08",
    time: "11:00",
    purpose: "Cross-examination of Petitioner",
    notes: "Client to be present. Documentary evidence to be tendered.",
    assignedTo: "demo-user-001",
    status: "upcoming",
    createdAt: "2025-02-20T10:00:00.000Z",
    updatedAt: "2025-02-20T10:00:00.000Z",
  },
  {
    id: "demo-hrg-003",
    matterId: "demo-mat-001",
    matterTitle: "Verma vs. Singh — Property Title Dispute",
    clientName: "Rajesh Kumar Verma",
    courtName: "Delhi High Court",
    date: "2025-04-15",
    time: "10:00",
    purpose: "Framing of Issues",
    notes: "All pleadings complete. Court to frame issues today.",
    nextAction: "Prepare issue list in advance.",
    assignedTo: "demo-user-001",
    status: "upcoming",
    createdAt: "2025-03-10T09:00:00.000Z",
    updatedAt: "2025-03-10T09:00:00.000Z",
  },
  {
    id: "demo-hrg-004",
    matterId: "demo-mat-006",
    matterTitle: "Nair vs. StarHealth Insurance — Consumer Complaint",
    clientName: "Priyanka Nair",
    courtName: "District Consumer Forum Thiruvananthapuram",
    date: "2025-04-18",
    time: "11:30",
    purpose: "Reply Affidavit by Opposite Party",
    notes: "OP's reply expected today.",
    assignedTo: "demo-user-001",
    status: "upcoming",
    createdAt: "2025-03-05T10:00:00.000Z",
    updatedAt: "2025-03-05T10:00:00.000Z",
  },
  {
    id: "demo-hrg-005",
    matterId: "demo-mat-003",
    matterTitle: "Mehta Constructions vs. XYZ Developers — Contract Dispute",
    clientName: "Mehta Constructions Pvt. Ltd.",
    courtName: "Bombay High Court",
    date: "2025-04-22",
    time: "02:30",
    purpose: "Final Arguments",
    notes: "Written submissions to be filed 3 days before.",
    nextAction: "Draft written submissions.",
    assignedTo: "demo-user-001",
    status: "upcoming",
    createdAt: "2025-03-10T14:00:00.000Z",
    updatedAt: "2025-03-10T14:00:00.000Z",
  },
  {
    id: "demo-hrg-006",
    matterId: "demo-mat-008",
    matterTitle: "Gupta Traders vs. Income Tax Dept. — Writ",
    clientName: "Gupta Traders & Associates",
    courtName: "Delhi High Court",
    date: "2025-04-28",
    time: "10:30",
    purpose: "Respondent Reply & Counter Affidavit",
    notes: "IT Dept. counter affidavit expected.",
    assignedTo: "demo-user-001",
    status: "upcoming",
    createdAt: "2025-03-08T11:00:00.000Z",
    updatedAt: "2025-03-08T11:00:00.000Z",
  },
  {
    id: "demo-hrg-007",
    matterId: "demo-mat-001",
    matterTitle: "Verma vs. Singh — Property Title Dispute",
    clientName: "Rajesh Kumar Verma",
    courtName: "Delhi High Court",
    date: "2025-03-10",
    time: "10:00",
    purpose: "Written Statement Filing",
    notes: "Written statement filed by OP.",
    nextHearingDate: "2025-04-15",
    assignedTo: "demo-user-001",
    status: "completed",
    createdAt: "2025-02-15T09:00:00.000Z",
    updatedAt: "2025-03-10T12:00:00.000Z",
  },
  {
    id: "demo-hrg-008",
    matterId: "demo-mat-004",
    matterTitle: "State vs. Arvind Pillai — Bail Application (IPC 302)",
    clientName: "Arvind Shankar Pillai",
    courtName: "Sessions Court Bengaluru",
    date: "2025-03-05",
    time: "10:30",
    purpose: "Bail Hearing",
    notes: "Matter adjourned on request of prosecution.",
    nextHearingDate: "2025-04-03",
    assignedTo: "demo-user-001",
    status: "adjourned",
    createdAt: "2025-02-20T09:00:00.000Z",
    updatedAt: "2025-03-05T11:00:00.000Z",
  },
  {
    id: "demo-hrg-009",
    matterId: "demo-mat-002",
    matterTitle: "Agarwal vs. Agarwal — Contested Divorce Petition",
    clientName: "Sunita Devi Agarwal",
    courtName: "Family Court Pune",
    date: "2025-02-18",
    time: "11:00",
    purpose: "Examination-in-Chief of Petitioner",
    notes: "Petitioner examined. Cross-examination fixed next date.",
    nextHearingDate: "2025-04-08",
    assignedTo: "demo-user-001",
    status: "attended",
    createdAt: "2025-01-20T10:00:00.000Z",
    updatedAt: "2025-02-18T13:00:00.000Z",
  },
  {
    id: "demo-hrg-010",
    matterId: "demo-mat-005",
    matterTitle: "Verma vs. DDA — Allotment Cancellation Challenge",
    clientName: "Rajesh Kumar Verma",
    courtName: "Delhi High Court",
    date: "2025-01-20",
    time: "02:00",
    purpose: "Admission & Notice",
    notes: "Notice issued to DDA. Counter affidavit directed within 6 weeks.",
    nextHearingDate: "2025-05-10",
    assignedTo: "demo-user-001",
    status: "completed",
    createdAt: "2024-12-10T09:00:00.000Z",
    updatedAt: "2025-01-20T15:00:00.000Z",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// FEE ENTRIES — 6 samples with various statuses
// ─────────────────────────────────────────────────────────────────────────────

const demoFees: DemoFeeEntry[] = [
  {
    id: "demo-fee-001",
    matterId: "demo-mat-001",
    clientId: "demo-cli-001",
    description: "Retainer fee — Property Title Dispute (Delhi HC)",
    totalAmount: 150000,
    receivedAmount: 100000,
    pendingAmount: 50000,
    dueDate: "2025-04-30",
    status: "partially_paid",
    notes: "Balance ₹50,000 due before final arguments.",
    createdAt: "2024-02-12T10:00:00.000Z",
    updatedAt: "2025-01-15T11:00:00.000Z",
  },
  {
    id: "demo-fee-002",
    matterId: "demo-mat-003",
    clientId: "demo-cli-003",
    description: "Legal fees — Contract Dispute (Bombay HC)",
    totalAmount: 350000,
    receivedAmount: 250000,
    pendingAmount: 100000,
    dueDate: "2025-04-15",
    status: "partially_paid",
    notes: "Next instalment due before final arguments.",
    createdAt: "2023-08-22T10:00:00.000Z",
    updatedAt: "2025-02-10T14:00:00.000Z",
  },
  {
    id: "demo-fee-003",
    matterId: "demo-mat-004",
    clientId: "demo-cli-004",
    description: "Bail application — Sessions Court, Bengaluru",
    totalAmount: 200000,
    receivedAmount: 150000,
    pendingAmount: 50000,
    dueDate: "2025-04-01",
    status: "overdue",
    notes: "Payment overdue. Follow up with client family.",
    createdAt: "2024-07-02T10:00:00.000Z",
    updatedAt: "2025-03-01T09:00:00.000Z",
  },
  {
    id: "demo-fee-004",
    matterId: "demo-mat-005",
    clientId: "demo-cli-001",
    description: "Writ Petition — DDA Allotment matter (Delhi HC)",
    totalAmount: 50000,
    receivedAmount: 50000,
    pendingAmount: 0,
    status: "paid",
    notes: "Full payment received via NEFT. Receipt issued.",
    createdAt: "2024-09-13T10:00:00.000Z",
    updatedAt: "2024-10-05T11:00:00.000Z",
  },
  {
    id: "demo-fee-005",
    matterId: "demo-mat-006",
    clientId: "demo-cli-005",
    description: "Consumer complaint — StarHealth Insurance",
    totalAmount: 25000,
    receivedAmount: 25000,
    pendingAmount: 0,
    status: "paid",
    notes: "Full fee paid upfront via UPI.",
    createdAt: "2024-10-02T12:00:00.000Z",
    updatedAt: "2024-10-02T12:30:00.000Z",
  },
  {
    id: "demo-fee-006",
    matterId: "demo-mat-008",
    clientId: "demo-cli-006",
    description: "Writ Petition — Income Tax Reassessment (Delhi HC)",
    totalAmount: 180000,
    receivedAmount: 120000,
    pendingAmount: 60000,
    dueDate: "2025-04-20",
    status: "partially_paid",
    notes: "Balance due before respondent reply stage.",
    createdAt: "2024-05-21T10:00:00.000Z",
    updatedAt: "2025-02-15T13:00:00.000Z",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// EXPENSES — 5 samples
// ─────────────────────────────────────────────────────────────────────────────

const demoExpenses: DemoExpense[] = [
  {
    id: "demo-exp-001",
    matterId: "demo-mat-001",
    clientId: "demo-cli-001",
    date: "2024-02-15",
    expenseType: "court_fee",
    description: "Delhi HC court fee — CS filing",
    amount: 5000,
    paidBy: "demo-user-001",
    isRecoverable: true,
    isRecovered: true,
    notes: "Recovered from client on 01-Mar-2024.",
    createdAt: "2024-02-15T10:00:00.000Z",
  },
  {
    id: "demo-exp-002",
    matterId: "demo-mat-003",
    clientId: "demo-cli-003",
    date: "2025-01-20",
    expenseType: "photocopy",
    description: "Certified copies of court orders and pleadings",
    amount: 3200,
    paidBy: "demo-user-001",
    isRecoverable: true,
    isRecovered: false,
    notes: "To be recovered with next fee instalment.",
    createdAt: "2025-01-20T12:00:00.000Z",
  },
  {
    id: "demo-exp-003",
    matterId: "demo-mat-004",
    clientId: "demo-cli-004",
    date: "2025-02-10",
    expenseType: "affidavit",
    description: "Affidavit notarisation charges",
    amount: 500,
    paidBy: "demo-user-001",
    isRecoverable: true,
    isRecovered: false,
    createdAt: "2025-02-10T11:00:00.000Z",
  },
  {
    id: "demo-exp-004",
    matterId: "demo-mat-008",
    clientId: "demo-cli-006",
    date: "2025-02-28",
    expenseType: "travel",
    description: "Travel to Delhi HC — filing & mentioning",
    amount: 1800,
    paidBy: "demo-user-001",
    isRecoverable: true,
    isRecovered: false,
    notes: "Cab + Metro fare.",
    createdAt: "2025-02-28T18:00:00.000Z",
  },
  {
    id: "demo-exp-005",
    matterId: undefined,
    clientId: undefined,
    date: "2025-03-01",
    expenseType: "miscellaneous",
    description: "Office stationery and printer cartridges (general office)",
    amount: 1200,
    paidBy: "demo-user-001",
    isRecoverable: false,
    isRecovered: false,
    notes: "General office expense. Not billable to any client.",
    createdAt: "2025-03-01T10:00:00.000Z",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// TASKS — 6 samples (mix of statuses)
// ─────────────────────────────────────────────────────────────────────────────

const demoTasks: DemoTask[] = [
  {
    id: "demo-tsk-001",
    title: "Draft written submissions for Bombay HC hearing",
    description:
      "Prepare written arguments for final hearing on 22-Apr-2025. Focus on breach of contract and quantum of damages.",
    matterId: "demo-mat-003",
    matterTitle: "Mehta Constructions vs. XYZ Developers",
    clientId: "demo-cli-003",
    assignedTo: "demo-user-001",
    assignedBy: "demo-user-001",
    dueDate: "2025-04-19",
    priority: "high",
    status: "in_progress",
    createdAt: "2025-03-15T09:00:00.000Z",
    updatedAt: "2025-03-15T09:00:00.000Z",
  },
  {
    id: "demo-tsk-002",
    title: "File counter-affidavit in DDA Writ Petition",
    description:
      "Draft and file rejoinder to DDA's counter affidavit in WP/11234/2024.",
    matterId: "demo-mat-005",
    matterTitle: "Verma vs. DDA — Allotment Cancellation Challenge",
    clientId: "demo-cli-001",
    assignedTo: "demo-user-002",
    assignedBy: "demo-user-001",
    dueDate: "2025-04-20",
    priority: "medium",
    status: "pending",
    createdAt: "2025-03-10T10:00:00.000Z",
    updatedAt: "2025-03-10T10:00:00.000Z",
  },
  {
    id: "demo-tsk-003",
    title: "Follow up with Arvind Pillai's family for pending fee payment",
    description:
      "Outstanding ₹50,000 overdue. Call family and arrange payment before 10-Apr-2025.",
    matterId: "demo-mat-004",
    matterTitle: "State vs. Arvind Pillai — Bail Application",
    clientId: "demo-cli-004",
    assignedTo: "demo-user-001",
    assignedBy: "demo-user-001",
    dueDate: "2025-04-05",
    priority: "high",
    status: "pending",
    createdAt: "2025-03-05T11:00:00.000Z",
    updatedAt: "2025-03-05T11:00:00.000Z",
  },
  {
    id: "demo-tsk-004",
    title: "Collect certified copies — Delhi HC (CS/1142/2024)",
    description: "Certified copy of order dt. 10-Mar-2025 to be collected from HC registry.",
    matterId: "demo-mat-001",
    matterTitle: "Verma vs. Singh — Property Title Dispute",
    clientId: "demo-cli-001",
    assignedTo: "demo-user-003",
    assignedBy: "demo-user-001",
    dueDate: "2025-04-02",
    priority: "medium",
    status: "completed",
    completedAt: "2025-04-01T15:00:00.000Z",
    notes: "Copies collected and filed in office records.",
    createdAt: "2025-03-12T09:00:00.000Z",
    updatedAt: "2025-04-01T15:00:00.000Z",
  },
  {
    id: "demo-tsk-005",
    title: "Send hearing reminder to Sunita Agarwal for Family Court",
    description: "WhatsApp message to client 2 days before 08-Apr-2025 hearing at Family Court Pune.",
    matterId: "demo-mat-002",
    matterTitle: "Agarwal vs. Agarwal — Contested Divorce",
    clientId: "demo-cli-002",
    assignedTo: "demo-user-004",
    assignedBy: "demo-user-001",
    dueDate: "2025-04-06",
    priority: "medium",
    status: "pending",
    createdAt: "2025-03-20T10:00:00.000Z",
    updatedAt: "2025-03-20T10:00:00.000Z",
  },
  {
    id: "demo-tsk-006",
    title: "Obtain police report copy — Bengaluru Sessions Court",
    description:
      "Apply for certified copy of police charge sheet for use in bail arguments.",
    matterId: "demo-mat-004",
    matterTitle: "State vs. Arvind Pillai — Bail Application",
    clientId: "demo-cli-004",
    assignedTo: "demo-user-002",
    assignedBy: "demo-user-001",
    dueDate: "2025-03-30",
    priority: "high",
    status: "completed",
    completedAt: "2025-03-28T14:00:00.000Z",
    notes: "Charge sheet copy obtained and shared with Adv. Menon.",
    createdAt: "2025-03-10T09:00:00.000Z",
    updatedAt: "2025-03-28T14:00:00.000Z",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENTS — 4 samples
// ─────────────────────────────────────────────────────────────────────────────

const demoDocuments: DemoDocument[] = [
  {
    id: "demo-doc-001",
    matterId: "demo-mat-001",
    clientId: "demo-cli-001",
    name: "Vakalatnama — Verma vs Singh",
    category: "vakalatnama",
    fileType: "pdf",
    fileSize: "128 KB",
    description: "Signed vakalatnama for Delhi HC matter CS/1142/2024.",
    uploadedBy: "demo-user-001",
    uploadedAt: "2024-02-12T10:30:00.000Z",
    tags: ["delhi-hc", "property", "vakalatnama"],
  },
  {
    id: "demo-doc-002",
    matterId: "demo-mat-002",
    clientId: "demo-cli-002",
    name: "Marriage Certificate — Agarwal",
    category: "evidence",
    fileType: "pdf",
    fileSize: "512 KB",
    description: "Original marriage certificate scanned for HMA/234/2024.",
    uploadedBy: "demo-user-001",
    uploadedAt: "2024-04-08T11:00:00.000Z",
    tags: ["family-court", "divorce", "marriage-certificate"],
  },
  {
    id: "demo-doc-003",
    matterId: "demo-mat-003",
    clientId: "demo-cli-003",
    name: "Construction Contract — Mehta & XYZ",
    category: "evidence",
    fileType: "pdf",
    fileSize: "2.4 MB",
    description:
      "Original construction contract dated 15-Jan-2022 between Mehta Constructions and XYZ Developers.",
    uploadedBy: "demo-user-001",
    uploadedAt: "2023-08-23T09:00:00.000Z",
    tags: ["bombay-hc", "contract", "evidence"],
  },
  {
    id: "demo-doc-004",
    matterId: "demo-mat-008",
    clientId: "demo-cli-006",
    name: "Stay Order — Gupta Traders IT Writ",
    category: "court_order",
    fileType: "pdf",
    fileSize: "340 KB",
    description: "Interim stay order passed by Delhi HC on 28-May-2024.",
    uploadedBy: "demo-user-001",
    uploadedAt: "2024-05-29T14:00:00.000Z",
    tags: ["delhi-hc", "writ", "stay-order", "income-tax"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD STATS — realistic demo numbers
// ─────────────────────────────────────────────────────────────────────────────

const demoStats: DemoDashboardStats = {
  totalActiveMatters: 7,
  todayHearings: 1,
  upcomingHearings: 6,
  pendingPayments: 260000,      // ₹2,60,000 outstanding across all matters
  monthlyCollections: 85000,    // ₹85,000 collected this month
  pendingTasks: 3,
  totalClients: 6,
  overduePayments: 50000,       // ₹50,000 overdue (Pillai fee)
  monthlyExpenses: 6700,        // ₹6,700 expenses this month
};

// ─────────────────────────────────────────────────────────────────────────────
// DEMO WORKSPACE EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export const DEMO_WORKSPACE = {
  matters: demoMatters,
  clients: demoClients,
  hearings: demoHearings,
  fees: demoFees,
  expenses: demoExpenses,
  tasks: demoTasks,
  documents: demoDocuments,
  stats: demoStats,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// DEMO MODE HELPERS (localStorage-based, safe for "use client" consumers)
// ─────────────────────────────────────────────────────────────────────────────

const DEMO_MODE_KEY = "nyayvakil-demo-mode";

/**
 * Returns true if the app is currently running in demo mode.
 * Safe to call only in browser context (client components / effects).
 */
export function isDemoMode(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(DEMO_MODE_KEY) === "true";
}

/**
 * Activates or deactivates demo mode by setting/clearing localStorage key.
 * Safe to call only in browser context (client components / effects).
 */
export function setDemoMode(active: boolean): void {
  if (typeof window === "undefined") return;
  if (active) {
    localStorage.setItem(DEMO_MODE_KEY, "true");
  } else {
    localStorage.removeItem(DEMO_MODE_KEY);
  }
}
