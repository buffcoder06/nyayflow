// src/lib/api/index.ts
// Mock API layer for NyayVakil – simulates real async API calls with realistic delays.
// All functions are structured so the implementation body can be swapped for real
// fetch/axios calls without changing the call-site interface.

import type {
  User,
  Client,
  Matter,
  Hearing,
  FeeEntry,
  Payment,
  Expense,
  Document,
  Task,
  Reminder,
  TimelineEntry,
  CourtInfo,
  ReminderTemplate,
  OfficeSettings,
  DashboardStats,
  ApiResponse,
  PaginatedResponse,
  MatterFilters,
  HearingFilters,
  ClientFilters,
  PaginationParams,
} from '@/types';

import {
  mockUsers,
  mockClients,
  mockMatters,
  mockHearings,
  mockFeeEntries,
  mockPayments,
  mockExpenses,
  mockDocuments,
  mockTasks,
  mockReminders,
  mockTimeline,
  mockCourts,
  mockReminderTemplates,
  mockOfficeSettings,
  mockDashboardStats,
} from '@/lib/mock-data';

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Simulate network latency between min and max milliseconds */
const delay = (min = 200, max = 500): Promise<void> =>
  new Promise((resolve) =>
    setTimeout(resolve, Math.floor(Math.random() * (max - min + 1)) + min)
  );

/** Wrap a value in a successful ApiResponse */
const success = <T>(data: T, message?: string): ApiResponse<T> => ({
  success: true,
  data,
  message,
});

/** Simulate occasional API errors (1-in-20 chance in development) */
const maybeThrow = (label: string): void => {
  // Uncomment to test error states during development:
  // if (Math.random() < 0.05) throw new Error(`[Mock API] Simulated error in ${label}`);
};

/** Apply simple pagination to an array */
const paginate = <T>(
  items: T[],
  { page, pageSize }: PaginationParams
): PaginatedResponse<T> => {
  const total = items.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const data = items.slice(start, start + pageSize);
  return { data, total, page, pageSize, totalPages };
};

// In-memory mutable store (mirrors what a real backend would persist)
let _clients = [...mockClients];
let _matters = [...mockMatters];
let _hearings = [...mockHearings];
let _feeEntries = [...mockFeeEntries];
let _payments = [...mockPayments];
let _expenses = [...mockExpenses];
let _documents = [...mockDocuments];
let _tasks = [...mockTasks];
let _reminders = [...mockReminders];
let _users = [...mockUsers];

const generateId = (prefix: string): string =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────

export const api = {
  dashboard: {
    /**
     * Fetch aggregated dashboard statistics.
     * TODO: Replace with real API call to GET /api/dashboard/stats
     */
    async getStats(): Promise<ApiResponse<DashboardStats>> {
      await delay();
      maybeThrow('dashboard.getStats');
      const stats: DashboardStats = {
        ...mockDashboardStats,
        totalActiveMatters: _matters.filter((m) => m.status === 'active').length,
        upcomingHearings: _hearings.filter((h) => h.status === 'upcoming').length,
        pendingPayments: _feeEntries.filter(
          (f) => f.status === 'partially_paid' || f.status === 'overdue'
        ).length,
        pendingTasks: _tasks.filter(
          (t) => t.status === 'pending' || t.status === 'in_progress'
        ).length,
        totalClients: _clients.filter((c) => c.isActive).length,
        overduePayments: _feeEntries.filter((f) => f.status === 'overdue').length,
      };
      return success(stats);
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // AUTH / USERS
  // ─────────────────────────────────────────────────────────────────────────

  auth: {
    /**
     * Mock login – accepts any registered email with password 'password'.
     * TODO: Replace with real API call to POST /api/auth/login
     */
    async login(
      email: string,
      _password: string
    ): Promise<ApiResponse<{ user: User; token: string }>> {
      await delay(400, 800);
      const user = _users.find((u) => u.email === email);
      if (!user) throw new Error('Invalid email or password.');
      return success({
        user,
        token: `mock_jwt_token_${user.id}_${Date.now()}`,
      });
    },

    /**
     * TODO: Replace with real API call to POST /api/auth/logout
     */
    async logout(): Promise<ApiResponse<null>> {
      await delay(100, 200);
      return success(null, 'Logged out successfully.');
    },

    /**
     * TODO: Replace with real API call to GET /api/auth/me
     */
    async getMe(userId: string): Promise<ApiResponse<User>> {
      await delay();
      const user = _users.find((u) => u.id === userId);
      if (!user) throw new Error('User not found.');
      return success(user);
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CLIENTS
  // ─────────────────────────────────────────────────────────────────────────

  clients: {
    /**
     * Fetch paginated list of clients with optional filters.
     * TODO: Replace with real API call to GET /api/clients
     */
    async list(
      filters?: ClientFilters,
      pagination: PaginationParams = { page: 1, pageSize: 20 }
    ): Promise<ApiResponse<PaginatedResponse<Client>>> {
      await delay();
      maybeThrow('clients.list');
      let result = [..._clients];

      if (filters) {
        if (filters.clientType) result = result.filter((c) => c.clientType === filters.clientType);
        if (filters.isActive !== undefined) result = result.filter((c) => c.isActive === filters.isActive);
        if (filters.city) result = result.filter((c) => c.city?.toLowerCase() === filters.city!.toLowerCase());
        if (filters.state) result = result.filter((c) => c.state?.toLowerCase() === filters.state!.toLowerCase());
        if (filters.search) {
          const q = filters.search.toLowerCase();
          result = result.filter(
            (c) =>
              c.name.toLowerCase().includes(q) ||
              c.mobile.includes(q) ||
              c.email?.toLowerCase().includes(q)
          );
        }
      }

      return success(paginate(result, pagination));
    },

    /**
     * Fetch a single client by ID.
     * TODO: Replace with real API call to GET /api/clients/:id
     */
    async getById(id: string): Promise<ApiResponse<Client>> {
      await delay();
      const client = _clients.find((c) => c.id === id);
      if (!client) throw new Error(`Client with id '${id}' not found.`);
      return success(client);
    },

    /**
     * Create a new client.
     * TODO: Replace with real API call to POST /api/clients
     */
    async create(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'linkedMatterIds' | 'totalOutstanding'>): Promise<ApiResponse<Client>> {
      await delay();
      const newClient: Client = {
        ...data,
        id: generateId('cli'),
        linkedMatterIds: [],
        totalOutstanding: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      _clients.push(newClient);
      return success(newClient, 'Client created successfully.');
    },

    /**
     * Update an existing client.
     * TODO: Replace with real API call to PUT /api/clients/:id
     */
    async update(id: string, data: Partial<Client>): Promise<ApiResponse<Client>> {
      await delay();
      const idx = _clients.findIndex((c) => c.id === id);
      if (idx === -1) throw new Error(`Client with id '${id}' not found.`);
      _clients[idx] = { ..._clients[idx], ...data, updatedAt: new Date().toISOString() };
      return success(_clients[idx], 'Client updated successfully.');
    },

    /**
     * Soft-delete (deactivate) a client.
     * TODO: Replace with real API call to DELETE /api/clients/:id
     */
    async delete(id: string): Promise<ApiResponse<null>> {
      await delay();
      const idx = _clients.findIndex((c) => c.id === id);
      if (idx === -1) throw new Error(`Client with id '${id}' not found.`);
      _clients[idx] = { ..._clients[idx], isActive: false, updatedAt: new Date().toISOString() };
      return success(null, 'Client deactivated successfully.');
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // MATTERS
  // ─────────────────────────────────────────────────────────────────────────

  matters: {
    /**
     * Fetch paginated list of matters with optional filters.
     * TODO: Replace with real API call to GET /api/matters
     */
    async list(
      filters?: MatterFilters,
      pagination: PaginationParams = { page: 1, pageSize: 20 }
    ): Promise<ApiResponse<PaginatedResponse<Matter>>> {
      await delay();
      maybeThrow('matters.list');
      let result = [..._matters];

      if (filters) {
        if (filters.status) result = result.filter((m) => m.status === filters.status);
        if (filters.priority) result = result.filter((m) => m.priority === filters.priority);
        if (filters.courtLevel) result = result.filter((m) => m.courtLevel === filters.courtLevel);
        if (filters.caseType) result = result.filter((m) => m.caseType === filters.caseType);
        if (filters.clientId) result = result.filter((m) => m.clientId === filters.clientId);
        if (filters.assignedJuniorId) result = result.filter((m) => m.assignedJuniorId === filters.assignedJuniorId);
        if (filters.search) {
          const q = filters.search.toLowerCase();
          result = result.filter(
            (m) =>
              m.matterTitle.toLowerCase().includes(q) ||
              m.caseNumber?.toLowerCase().includes(q) ||
              m.cnrNumber?.toLowerCase().includes(q) ||
              m.oppositeParty?.toLowerCase().includes(q)
          );
        }
      }

      return success(paginate(result, pagination));
    },

    /**
     * Fetch a single matter by ID.
     * TODO: Replace with real API call to GET /api/matters/:id
     */
    async getById(id: string): Promise<ApiResponse<Matter>> {
      await delay();
      const matter = _matters.find((m) => m.id === id);
      if (!matter) throw new Error(`Matter with id '${id}' not found.`);
      return success(matter);
    },

    /**
     * Create a new matter.
     * TODO: Replace with real API call to POST /api/matters
     */
    async create(
      data: Omit<Matter, 'id' | 'createdAt' | 'updatedAt'>,
    ): Promise<ApiResponse<Matter>> {
      await delay();
      const newMatter: Matter = {
        ...data,
        id: generateId('mat'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      _matters.push(newMatter);
      // Link matter to client
      const clientIdx = _clients.findIndex((c) => c.id === data.clientId);
      if (clientIdx !== -1) {
        _clients[clientIdx].linkedMatterIds.push(newMatter.id);
      }
      return success(newMatter, 'Matter created successfully.');
    },

    /**
     * Update an existing matter.
     * TODO: Replace with real API call to PUT /api/matters/:id
     */
    async update(id: string, data: Partial<Matter>): Promise<ApiResponse<Matter>> {
      await delay();
      const idx = _matters.findIndex((m) => m.id === id);
      if (idx === -1) throw new Error(`Matter with id '${id}' not found.`);
      _matters[idx] = { ..._matters[idx], ...data, updatedAt: new Date().toISOString() };
      return success(_matters[idx], 'Matter updated successfully.');
    },

    /**
     * Close/archive a matter.
     * TODO: Replace with real API call to DELETE /api/matters/:id
     */
    async close(id: string): Promise<ApiResponse<Matter>> {
      await delay();
      const idx = _matters.findIndex((m) => m.id === id);
      if (idx === -1) throw new Error(`Matter with id '${id}' not found.`);
      _matters[idx] = {
        ..._matters[idx],
        status: 'closed',
        updatedAt: new Date().toISOString(),
      };
      return success(_matters[idx], 'Matter closed.');
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // HEARINGS
  // ─────────────────────────────────────────────────────────────────────────

  hearings: {
    /**
     * Fetch paginated hearings with optional filters.
     * TODO: Replace with real API call to GET /api/hearings
     */
    async list(
      filters?: HearingFilters,
      pagination: PaginationParams = { page: 1, pageSize: 20 }
    ): Promise<ApiResponse<PaginatedResponse<Hearing>>> {
      await delay();
      let result = [..._hearings];

      if (filters) {
        if (filters.status) result = result.filter((h) => h.status === filters.status);
        if (filters.matterId) result = result.filter((h) => h.matterId === filters.matterId);
        if (filters.assignedTo) result = result.filter((h) => h.assignedTo === filters.assignedTo);
        if (filters.dateFrom) result = result.filter((h) => h.date >= filters.dateFrom!);
        if (filters.dateTo) result = result.filter((h) => h.date <= filters.dateTo!);
      }

      // Sort upcoming by date asc, past by date desc
      result.sort((a, b) => {
        if (a.status === 'upcoming' && b.status === 'upcoming') {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      return success(paginate(result, pagination));
    },

    /**
     * Fetch a single hearing by ID.
     * TODO: Replace with real API call to GET /api/hearings/:id
     */
    async getById(id: string): Promise<ApiResponse<Hearing>> {
      await delay();
      const hearing = _hearings.find((h) => h.id === id);
      if (!hearing) throw new Error(`Hearing with id '${id}' not found.`);
      return success(hearing);
    },

    /**
     * Fetch all hearings for a specific date.
     * TODO: Replace with real API call to GET /api/hearings?date=YYYY-MM-DD
     */
    async getByDate(date: string): Promise<ApiResponse<Hearing[]>> {
      await delay();
      const result = _hearings.filter((h) => h.date === date);
      return success(result);
    },

    /**
     * Fetch today's hearings.
     * TODO: Replace with real API call to GET /api/hearings/today
     */
    async getToday(): Promise<ApiResponse<Hearing[]>> {
      await delay();
      const today = new Date().toISOString().split('T')[0];
      return success(_hearings.filter((h) => h.date === today));
    },

    /**
     * Create a new hearing.
     * TODO: Replace with real API call to POST /api/hearings
     */
    async create(data: Omit<Hearing, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Hearing>> {
      await delay();
      const newHearing: Hearing = {
        ...data,
        id: generateId('hrg'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      _hearings.push(newHearing);
      // Update matter's next hearing date if earlier than current
      const matterIdx = _matters.findIndex((m) => m.id === data.matterId);
      if (matterIdx !== -1 && data.status === 'upcoming') {
        const current = _matters[matterIdx].nextHearingDate;
        if (!current || data.date < current) {
          _matters[matterIdx].nextHearingDate = data.date;
        }
      }
      return success(newHearing, 'Hearing scheduled successfully.');
    },

    /**
     * Update a hearing (e.g., mark as completed, add notes).
     * TODO: Replace with real API call to PUT /api/hearings/:id
     */
    async update(id: string, data: Partial<Hearing>): Promise<ApiResponse<Hearing>> {
      await delay();
      const idx = _hearings.findIndex((h) => h.id === id);
      if (idx === -1) throw new Error(`Hearing with id '${id}' not found.`);
      _hearings[idx] = { ..._hearings[idx], ...data, updatedAt: new Date().toISOString() };
      return success(_hearings[idx], 'Hearing updated successfully.');
    },

    /**
     * Delete a hearing.
     * TODO: Replace with real API call to DELETE /api/hearings/:id
     */
    async delete(id: string): Promise<ApiResponse<null>> {
      await delay();
      const idx = _hearings.findIndex((h) => h.id === id);
      if (idx === -1) throw new Error(`Hearing with id '${id}' not found.`);
      _hearings.splice(idx, 1);
      return success(null, 'Hearing deleted.');
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // FEE ENTRIES
  // ─────────────────────────────────────────────────────────────────────────

  fees: {
    /**
     * Fetch all fee entries (optionally filter by matter or client).
     * TODO: Replace with real API call to GET /api/fees
     */
    async list(
      matterId?: string,
      clientId?: string
    ): Promise<ApiResponse<FeeEntry[]>> {
      await delay();
      let result = [..._feeEntries];
      if (matterId) result = result.filter((f) => f.matterId === matterId);
      if (clientId) result = result.filter((f) => f.clientId === clientId);
      return success(result);
    },

    /**
     * Fetch a single fee entry by ID.
     * TODO: Replace with real API call to GET /api/fees/:id
     */
    async getById(id: string): Promise<ApiResponse<FeeEntry>> {
      await delay();
      const fee = _feeEntries.find((f) => f.id === id);
      if (!fee) throw new Error(`Fee entry '${id}' not found.`);
      return success(fee);
    },

    /**
     * Create a new fee entry.
     * TODO: Replace with real API call to POST /api/fees
     */
    async create(
      data: Omit<FeeEntry, 'id' | 'createdAt' | 'updatedAt' | 'pendingAmount'>
    ): Promise<ApiResponse<FeeEntry>> {
      await delay();
      const newFee: FeeEntry = {
        ...data,
        id: generateId('fee'),
        pendingAmount: data.totalAmount - data.receivedAmount,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      _feeEntries.push(newFee);
      return success(newFee, 'Fee entry created.');
    },

    /**
     * Update a fee entry.
     * TODO: Replace with real API call to PUT /api/fees/:id
     */
    async update(id: string, data: Partial<FeeEntry>): Promise<ApiResponse<FeeEntry>> {
      await delay();
      const idx = _feeEntries.findIndex((f) => f.id === id);
      if (idx === -1) throw new Error(`Fee entry '${id}' not found.`);
      const updated = {
        ..._feeEntries[idx],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      updated.pendingAmount = updated.totalAmount - updated.receivedAmount;
      _feeEntries[idx] = updated;
      return success(_feeEntries[idx], 'Fee entry updated.');
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PAYMENTS
  // ─────────────────────────────────────────────────────────────────────────

  payments: {
    /**
     * Fetch payments, optionally filtered by matter or client.
     * TODO: Replace with real API call to GET /api/payments
     */
    async list(matterId?: string, clientId?: string): Promise<ApiResponse<Payment[]>> {
      await delay();
      let result = [..._payments];
      if (matterId) result = result.filter((p) => p.matterId === matterId);
      if (clientId) result = result.filter((p) => p.clientId === clientId);
      return success(result);
    },

    /**
     * Record a new payment against a fee entry.
     * TODO: Replace with real API call to POST /api/payments
     */
    async create(
      data: Omit<Payment, 'id' | 'createdAt'>
    ): Promise<ApiResponse<Payment>> {
      await delay();
      const newPayment: Payment = {
        ...data,
        id: generateId('pay'),
        receiptNumber: `RCP/${new Date().getFullYear()}/${String(_payments.length + 1).padStart(3, '0')}`,
        createdAt: new Date().toISOString(),
      };
      _payments.push(newPayment);

      // Update corresponding fee entry
      const feeIdx = _feeEntries.findIndex((f) => f.id === data.feeEntryId);
      if (feeIdx !== -1) {
        const fee = _feeEntries[feeIdx];
        const newReceived = fee.receivedAmount + data.amount;
        const newPending = fee.totalAmount - newReceived;
        _feeEntries[feeIdx] = {
          ...fee,
          receivedAmount: newReceived,
          pendingAmount: newPending,
          status: newPending <= 0 ? 'paid' : 'partially_paid',
          updatedAt: new Date().toISOString(),
        };
      }

      return success(newPayment, 'Payment recorded successfully.');
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EXPENSES
  // ─────────────────────────────────────────────────────────────────────────

  expenses: {
    /**
     * Fetch expenses, optionally filtered by matter or client.
     * TODO: Replace with real API call to GET /api/expenses
     */
    async list(matterId?: string, clientId?: string): Promise<ApiResponse<Expense[]>> {
      await delay();
      let result = [..._expenses];
      if (matterId) result = result.filter((e) => e.matterId === matterId);
      if (clientId) result = result.filter((e) => e.clientId === clientId);
      return success(result);
    },

    /**
     * Create a new expense.
     * TODO: Replace with real API call to POST /api/expenses
     */
    async create(data: Omit<Expense, 'id' | 'createdAt'>): Promise<ApiResponse<Expense>> {
      await delay();
      const newExpense: Expense = {
        ...data,
        id: generateId('exp'),
        createdAt: new Date().toISOString(),
      };
      _expenses.push(newExpense);
      // Update matter's totalExpenses
      if (data.matterId) {
        const mIdx = _matters.findIndex((m) => m.id === data.matterId);
        if (mIdx !== -1) {
          _matters[mIdx].totalExpenses += data.amount;
        }
      }
      return success(newExpense, 'Expense recorded.');
    },

    /**
     * Update an expense.
     * TODO: Replace with real API call to PUT /api/expenses/:id
     */
    async update(id: string, data: Partial<Expense>): Promise<ApiResponse<Expense>> {
      await delay();
      const idx = _expenses.findIndex((e) => e.id === id);
      if (idx === -1) throw new Error(`Expense '${id}' not found.`);
      _expenses[idx] = { ..._expenses[idx], ...data };
      return success(_expenses[idx], 'Expense updated.');
    },

    /**
     * Delete an expense.
     * TODO: Replace with real API call to DELETE /api/expenses/:id
     */
    async delete(id: string): Promise<ApiResponse<null>> {
      await delay();
      const idx = _expenses.findIndex((e) => e.id === id);
      if (idx === -1) throw new Error(`Expense '${id}' not found.`);
      _expenses.splice(idx, 1);
      return success(null, 'Expense deleted.');
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // DOCUMENTS
  // ─────────────────────────────────────────────────────────────────────────

  documents: {
    /**
     * Fetch documents, optionally filtered by matter or client.
     * TODO: Replace with real API call to GET /api/documents
     */
    async list(matterId?: string, clientId?: string): Promise<ApiResponse<Document[]>> {
      await delay();
      let result = [..._documents];
      if (matterId) result = result.filter((d) => d.matterId === matterId);
      if (clientId) result = result.filter((d) => d.clientId === clientId);
      return success(result);
    },

    /**
     * Fetch a single document by ID.
     * TODO: Replace with real API call to GET /api/documents/:id
     */
    async getById(id: string): Promise<ApiResponse<Document>> {
      await delay();
      const doc = _documents.find((d) => d.id === id);
      if (!doc) throw new Error(`Document '${id}' not found.`);
      return success(doc);
    },

    /**
     * Upload / register a new document.
     * TODO: Replace with real API call to POST /api/documents (multipart/form-data)
     */
    async upload(data: Omit<Document, 'id' | 'uploadedAt'>): Promise<ApiResponse<Document>> {
      await delay(300, 700);
      const newDoc: Document = {
        ...data,
        id: generateId('doc'),
        uploadedAt: new Date().toISOString(),
      };
      _documents.push(newDoc);
      return success(newDoc, 'Document uploaded successfully.');
    },

    /**
     * Delete a document.
     * TODO: Replace with real API call to DELETE /api/documents/:id
     */
    async delete(id: string): Promise<ApiResponse<null>> {
      await delay();
      const idx = _documents.findIndex((d) => d.id === id);
      if (idx === -1) throw new Error(`Document '${id}' not found.`);
      _documents.splice(idx, 1);
      return success(null, 'Document deleted.');
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TASKS
  // ─────────────────────────────────────────────────────────────────────────

  tasks: {
    /**
     * Fetch tasks with optional filters.
     * TODO: Replace with real API call to GET /api/tasks
     */
    async list(
      assignedTo?: string,
      matterId?: string,
      status?: string
    ): Promise<ApiResponse<Task[]>> {
      await delay();
      let result = [..._tasks];
      if (assignedTo) result = result.filter((t) => t.assignedTo === assignedTo);
      if (matterId) result = result.filter((t) => t.matterId === matterId);
      if (status) result = result.filter((t) => t.status === status);
      // Sort by due date asc, then by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      result.sort((a, b) => {
        if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
      return success(result);
    },

    /**
     * Create a new task.
     * TODO: Replace with real API call to POST /api/tasks
     */
    async create(
      data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
    ): Promise<ApiResponse<Task>> {
      await delay();
      const newTask: Task = {
        ...data,
        id: generateId('tsk'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      _tasks.push(newTask);
      return success(newTask, 'Task created.');
    },

    /**
     * Update a task.
     * TODO: Replace with real API call to PUT /api/tasks/:id
     */
    async update(id: string, data: Partial<Task>): Promise<ApiResponse<Task>> {
      await delay();
      const idx = _tasks.findIndex((t) => t.id === id);
      if (idx === -1) throw new Error(`Task '${id}' not found.`);
      const updatedData = { ...data };
      if (data.status === 'completed' && !data.completedAt) {
        updatedData.completedAt = new Date().toISOString();
      }
      _tasks[idx] = { ..._tasks[idx], ...updatedData, updatedAt: new Date().toISOString() };
      return success(_tasks[idx], 'Task updated.');
    },

    /**
     * Mark a task as complete.
     * TODO: Replace with real API call to POST /api/tasks/:id/complete
     */
    async complete(id: string, notes?: string): Promise<ApiResponse<Task>> {
      await delay();
      return api.tasks.update(id, {
        status: 'completed',
        completedAt: new Date().toISOString(),
        notes,
      });
    },

    /**
     * Delete a task.
     * TODO: Replace with real API call to DELETE /api/tasks/:id
     */
    async delete(id: string): Promise<ApiResponse<null>> {
      await delay();
      const idx = _tasks.findIndex((t) => t.id === id);
      if (idx === -1) throw new Error(`Task '${id}' not found.`);
      _tasks.splice(idx, 1);
      return success(null, 'Task deleted.');
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // REMINDERS
  // ─────────────────────────────────────────────────────────────────────────

  reminders: {
    /**
     * Fetch reminders with optional filters.
     * TODO: Replace with real API call to GET /api/reminders
     */
    async list(
      clientId?: string,
      matterId?: string,
      status?: string
    ): Promise<ApiResponse<Reminder[]>> {
      await delay();
      let result = [..._reminders];
      if (clientId) result = result.filter((r) => r.clientId === clientId);
      if (matterId) result = result.filter((r) => r.matterId === matterId);
      if (status) result = result.filter((r) => r.status === status);
      result.sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
      return success(result);
    },

    /**
     * Create a new reminder.
     * TODO: Replace with real API call to POST /api/reminders
     */
    async create(data: Omit<Reminder, 'id' | 'createdAt'>): Promise<ApiResponse<Reminder>> {
      await delay();
      const newReminder: Reminder = {
        ...data,
        id: generateId('rem'),
        createdAt: new Date().toISOString(),
      };
      _reminders.push(newReminder);
      return success(newReminder, 'Reminder scheduled.');
    },

    /**
     * Update a reminder.
     * TODO: Replace with real API call to PUT /api/reminders/:id
     */
    async update(id: string, data: Partial<Reminder>): Promise<ApiResponse<Reminder>> {
      await delay();
      const idx = _reminders.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error(`Reminder '${id}' not found.`);
      _reminders[idx] = { ..._reminders[idx], ...data };
      return success(_reminders[idx], 'Reminder updated.');
    },

    /**
     * Mark a reminder as sent.
     * TODO: Replace with real API call to POST /api/reminders/:id/send
     */
    async markSent(id: string): Promise<ApiResponse<Reminder>> {
      await delay();
      return api.reminders.update(id, {
        status: 'sent',
        sentAt: new Date().toISOString(),
      });
    },

    /**
     * Cancel a reminder.
     * TODO: Replace with real API call to POST /api/reminders/:id/cancel
     */
    async cancel(id: string): Promise<ApiResponse<Reminder>> {
      await delay();
      return api.reminders.update(id, { status: 'cancelled' });
    },

    /**
     * Fetch all reminder templates.
     * TODO: Replace with real API call to GET /api/reminder-templates
     */
    async getTemplates(): Promise<ApiResponse<ReminderTemplate[]>> {
      await delay(100, 200);
      return success(mockReminderTemplates);
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TIMELINE
  // ─────────────────────────────────────────────────────────────────────────

  timeline: {
    /**
     * Fetch timeline entries for a matter or client.
     * TODO: Replace with real API call to GET /api/timeline?entityId=xxx
     */
    async getByEntityId(entityId: string): Promise<ApiResponse<TimelineEntry[]>> {
      await delay();
      const entries = mockTimeline
        .filter((t) => t.entityId === entityId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return success(entries);
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // COURTS & SETTINGS
  // ─────────────────────────────────────────────────────────────────────────

  courts: {
    /**
     * Fetch all known courts.
     * TODO: Replace with real API call to GET /api/courts
     */
    async list(): Promise<ApiResponse<CourtInfo[]>> {
      await delay(100, 200);
      return success(mockCourts);
    },
  },

  settings: {
    /**
     * Fetch office settings.
     * TODO: Replace with real API call to GET /api/settings/office
     */
    async getOfficeSettings(): Promise<ApiResponse<OfficeSettings>> {
      await delay(100, 200);
      return success(mockOfficeSettings);
    },

    /**
     * Update office settings.
     * TODO: Replace with real API call to PUT /api/settings/office
     */
    async updateOfficeSettings(data: Partial<OfficeSettings>): Promise<ApiResponse<OfficeSettings>> {
      await delay();
      const updated = { ...mockOfficeSettings, ...data };
      return success(updated, 'Settings updated.');
    },

    /**
     * Fetch all team members.
     * TODO: Replace with real API call to GET /api/team
     */
    async getTeamMembers(): Promise<ApiResponse<User[]>> {
      await delay(100, 200);
      return success(_users);
    },
  },
};

export default api;
