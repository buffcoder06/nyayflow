// src/lib/store/app-store.ts
// Zustand store for application-level UI state in NyayVakil.
// Handles sidebar, active filters, search, notifications, and modals.

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  MatterFilters,
  HearingFilters,
  ClientFilters,
  PaginationParams,
} from '@/types';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type ActiveView =
  | 'dashboard'
  | 'matters'
  | 'clients'
  | 'hearings'
  | 'fees'
  | 'expenses'
  | 'documents'
  | 'tasks'
  | 'reminders'
  | 'settings'
  | 'team';

export type ModalType =
  | 'add_matter'
  | 'add_client'
  | 'add_hearing'
  | 'add_payment'
  | 'add_expense'
  | 'add_task'
  | 'add_reminder'
  | 'upload_document'
  | 'view_matter'
  | 'view_client'
  | 'view_hearing'
  | 'confirm_delete'
  | null;

export interface ActiveModal {
  type: ModalType;
  /** ID of the entity being viewed/edited, if applicable */
  entityId?: string;
  /** Extra metadata passed to the modal */
  meta?: Record<string, unknown>;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number; // ms
}

// ─────────────────────────────────────────────────────────────────────────────
// STATE INTERFACE
// ─────────────────────────────────────────────────────────────────────────────

export interface AppState {
  // ── Layout ────────────────────────────────────────────────────────────────
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  activeView: ActiveView;

  // ── Search ────────────────────────────────────────────────────────────────
  globalSearch: string;

  // ── Active Filters ────────────────────────────────────────────────────────
  matterFilters: MatterFilters;
  hearingFilters: HearingFilters;
  clientFilters: ClientFilters;

  // ── Pagination ────────────────────────────────────────────────────────────
  matterPagination: PaginationParams;
  hearingPagination: PaginationParams;
  clientPagination: PaginationParams;

  // ── Modal ─────────────────────────────────────────────────────────────────
  activeModal: ActiveModal;

  // ── Notifications / Toasts ────────────────────────────────────────────────
  toasts: ToastNotification[];

  // ── Selected Items ────────────────────────────────────────────────────────
  selectedMatterIds: string[];
  selectedClientIds: string[];

  // ── Theme ─────────────────────────────────────────────────────────────────
  theme: 'light' | 'dark' | 'system';

  // ── Actions ───────────────────────────────────────────────────────────────

  // Layout
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setActiveView: (view: ActiveView) => void;

  // Search
  setGlobalSearch: (query: string) => void;
  clearGlobalSearch: () => void;

  // Filters
  setMatterFilters: (filters: Partial<MatterFilters>) => void;
  resetMatterFilters: () => void;
  setHearingFilters: (filters: Partial<HearingFilters>) => void;
  resetHearingFilters: () => void;
  setClientFilters: (filters: Partial<ClientFilters>) => void;
  resetClientFilters: () => void;

  // Pagination
  setMatterPage: (page: number) => void;
  setHearingPage: (page: number) => void;
  setClientPage: (page: number) => void;

  // Modals
  openModal: (type: ModalType, entityId?: string, meta?: Record<string, unknown>) => void;
  closeModal: () => void;

  // Toasts
  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // Selection
  selectMatter: (id: string) => void;
  deselectMatter: (id: string) => void;
  clearMatterSelection: () => void;
  selectClient: (id: string) => void;
  deselectClient: (id: string) => void;
  clearClientSelection: () => void;

  // Theme
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULTS
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_PAGINATION: PaginationParams = { page: 1, pageSize: 20 };
const DEFAULT_MATTER_FILTERS: MatterFilters = {};
const DEFAULT_HEARING_FILTERS: HearingFilters = {};
const DEFAULT_CLIENT_FILTERS: ClientFilters = {};

// ─────────────────────────────────────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────────────────────────────────────

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ── Initial State ──────────────────────────────────────────────────────
      sidebarOpen: true,
      sidebarCollapsed: false,
      activeView: 'dashboard',
      globalSearch: '',
      matterFilters: DEFAULT_MATTER_FILTERS,
      hearingFilters: DEFAULT_HEARING_FILTERS,
      clientFilters: DEFAULT_CLIENT_FILTERS,
      matterPagination: DEFAULT_PAGINATION,
      hearingPagination: DEFAULT_PAGINATION,
      clientPagination: DEFAULT_PAGINATION,
      activeModal: { type: null },
      toasts: [],
      selectedMatterIds: [],
      selectedClientIds: [],
      theme: 'light',

      // ── Layout ────────────────────────────────────────────────────────────

      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      toggleSidebarCollapsed: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      setActiveView: (view) => set({ activeView: view, globalSearch: '' }),

      // ── Search ────────────────────────────────────────────────────────────

      setGlobalSearch: (query) => set({ globalSearch: query }),

      clearGlobalSearch: () => set({ globalSearch: '' }),

      // ── Filters ───────────────────────────────────────────────────────────

      setMatterFilters: (filters) =>
        set((s) => ({
          matterFilters: { ...s.matterFilters, ...filters },
          matterPagination: DEFAULT_PAGINATION, // Reset to page 1 on filter change
        })),

      resetMatterFilters: () =>
        set({ matterFilters: DEFAULT_MATTER_FILTERS, matterPagination: DEFAULT_PAGINATION }),

      setHearingFilters: (filters) =>
        set((s) => ({
          hearingFilters: { ...s.hearingFilters, ...filters },
          hearingPagination: DEFAULT_PAGINATION,
        })),

      resetHearingFilters: () =>
        set({ hearingFilters: DEFAULT_HEARING_FILTERS, hearingPagination: DEFAULT_PAGINATION }),

      setClientFilters: (filters) =>
        set((s) => ({
          clientFilters: { ...s.clientFilters, ...filters },
          clientPagination: DEFAULT_PAGINATION,
        })),

      resetClientFilters: () =>
        set({ clientFilters: DEFAULT_CLIENT_FILTERS, clientPagination: DEFAULT_PAGINATION }),

      // ── Pagination ────────────────────────────────────────────────────────

      setMatterPage: (page) =>
        set((s) => ({ matterPagination: { ...s.matterPagination, page } })),

      setHearingPage: (page) =>
        set((s) => ({ hearingPagination: { ...s.hearingPagination, page } })),

      setClientPage: (page) =>
        set((s) => ({ clientPagination: { ...s.clientPagination, page } })),

      // ── Modals ────────────────────────────────────────────────────────────

      openModal: (type, entityId, meta) =>
        set({ activeModal: { type, entityId, meta } }),

      closeModal: () => set({ activeModal: { type: null } }),

      // ── Toasts ────────────────────────────────────────────────────────────

      addToast: (toast) => {
        const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
        // Auto-remove after duration (default 5 seconds)
        const duration = toast.duration ?? 5000;
        setTimeout(() => get().removeToast(id), duration);
      },

      removeToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      clearToasts: () => set({ toasts: [] }),

      // ── Selection ─────────────────────────────────────────────────────────

      selectMatter: (id) =>
        set((s) => ({
          selectedMatterIds: s.selectedMatterIds.includes(id)
            ? s.selectedMatterIds
            : [...s.selectedMatterIds, id],
        })),

      deselectMatter: (id) =>
        set((s) => ({ selectedMatterIds: s.selectedMatterIds.filter((mid) => mid !== id) })),

      clearMatterSelection: () => set({ selectedMatterIds: [] }),

      selectClient: (id) =>
        set((s) => ({
          selectedClientIds: s.selectedClientIds.includes(id)
            ? s.selectedClientIds
            : [...s.selectedClientIds, id],
        })),

      deselectClient: (id) =>
        set((s) => ({ selectedClientIds: s.selectedClientIds.filter((cid) => cid !== id) })),

      clearClientSelection: () => set({ selectedClientIds: [] }),

      // ── Theme ─────────────────────────────────────────────────────────────

      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'nyayvakil-app',
      storage: createJSONStorage(() => localStorage),
      // Persist only user preferences, not transient UI state
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
        // Persist last active view so user returns to where they were
        activeView: state.activeView,
      }),
    }
  )
);

// ─────────────────────────────────────────────────────────────────────────────
// CONVENIENCE HOOKS
// ─────────────────────────────────────────────────────────────────────────────

/** Access sidebar state */
export const useSidebar = () =>
  useAppStore((s) => ({
    open: s.sidebarOpen,
    collapsed: s.sidebarCollapsed,
    toggle: s.toggleSidebar,
    setOpen: s.setSidebarOpen,
    toggleCollapsed: s.toggleSidebarCollapsed,
  }));

/** Access toast notification helpers */
export const useToast = () =>
  useAppStore((s) => ({
    toasts: s.toasts,
    add: s.addToast,
    remove: s.removeToast,
    clear: s.clearToasts,
    success: (title: string, message?: string) =>
      s.addToast({ type: 'success', title, message }),
    error: (title: string, message?: string) =>
      s.addToast({ type: 'error', title, message }),
    info: (title: string, message?: string) =>
      s.addToast({ type: 'info', title, message }),
    warning: (title: string, message?: string) =>
      s.addToast({ type: 'warning', title, message }),
  }));

/** Access modal state */
export const useModal = () =>
  useAppStore((s) => ({
    modal: s.activeModal,
    open: s.openModal,
    close: s.closeModal,
    isOpen: (type: ModalType) => s.activeModal.type === type,
  }));

/** Access matter filters */
export const useMatterFilters = () =>
  useAppStore((s) => ({
    filters: s.matterFilters,
    set: s.setMatterFilters,
    reset: s.resetMatterFilters,
    pagination: s.matterPagination,
    setPage: s.setMatterPage,
  }));

/** Access hearing filters */
export const useHearingFilters = () =>
  useAppStore((s) => ({
    filters: s.hearingFilters,
    set: s.setHearingFilters,
    reset: s.resetHearingFilters,
    pagination: s.hearingPagination,
    setPage: s.setHearingPage,
  }));

/** Access client filters */
export const useClientFilters = () =>
  useAppStore((s) => ({
    filters: s.clientFilters,
    set: s.setClientFilters,
    reset: s.resetClientFilters,
    pagination: s.clientPagination,
    setPage: s.setClientPage,
  }));
