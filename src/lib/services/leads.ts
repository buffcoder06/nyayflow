// ─────────────────────────────────────────────────────────────────────────────
// NyayVakil – Lead Capture Service
//
// All public functions in this file share the same interface contract.
// When integrating a real CRM or backend, replace only the implementation
// inside each function — the types and exported signatures must remain stable.
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type UserRole = "advocate" | "junior" | "clerk" | "admin";

export type PracticeType =
  | "Solo Advocate"
  | "Advocate's Chamber"
  | "Small Law Firm"
  | "Legal Department"
  | "Other";

export type TeamSize =
  | "Just me"
  | "2-5 members"
  | "6-10 members"
  | "11-20 members"
  | "20+ members";

export type QueryType =
  | "general"
  | "pricing"
  | "technical"
  | "partnership"
  | "other";

// ── Input shapes ──────────────────────────────────────────────────────────────

export interface TrialSignupData {
  /** Full name of the person signing up. */
  name: string;
  /** 10-digit Indian mobile number (digits only, no country code). */
  mobile: string;
  email: string;
  /** Name of the advocate's chamber or firm, if applicable. */
  firmName?: string;
  city: string;
  /** Approximate team size, used to recommend the right plan. */
  userCount?: TeamSize;
  /** Role of the person signing up within the practice. */
  role: UserRole;
  /** UTM source or referral identifier, populated by the marketing layer. */
  source?: string;
}

export interface BookDemoData {
  name: string;
  /** 10-digit Indian mobile number (digits only, no country code). */
  mobile: string;
  email: string;
  orgName: string;
  /** ISO date string (YYYY-MM-DD) for the preferred demo date. */
  preferredDate: string;
  /** Preferred time slot, e.g. "10:00 AM – 11:00 AM". */
  preferredTime: string;
  practiceType: PracticeType;
  teamSize: TeamSize;
  /** Optional message or specific topics the prospect wants covered. */
  message?: string;
}

export interface ContactData {
  name: string;
  /** 10-digit Indian mobile number (digits only, no country code). */
  mobile: string;
  email: string;
  subject: string;
  message: string;
  queryType: QueryType;
}

export interface CallbackData {
  name: string;
  /** 10-digit Indian mobile number (digits only, no country code). */
  mobile: string;
  /** Preferred time window for the callback, e.g. "2:00 PM – 4:00 PM". */
  preferredTime: string;
  /** Optional context about why they are requesting a callback. */
  message?: string;
}

// ── Response shape ────────────────────────────────────────────────────────────

export interface LeadResponse {
  success: boolean;
  message: string;
  /** Reference ID in NV-DEMO-XXXX format. Present on success. */
  referenceId?: string;
  /** Echo of the submitted data. Present on success. */
  data?: Record<string, unknown>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal utilities
// ─────────────────────────────────────────────────────────────────────────────

const LOG_PREFIX = "[NyayVakil Leads]";

function log(message: string, payload?: unknown): void {
  if (payload !== undefined) {
    console.log(`${LOG_PREFIX} ${message}`, payload);
  } else {
    console.log(`${LOG_PREFIX} ${message}`);
  }
}

function generateReferenceId(): string {
  const suffix = Math.floor(1000 + Math.random() * 9000); // 4-digit number
  return `NV-DEMO-${suffix}`;
}

/** Simulates network latency for mock implementations. */
function simulateDelay(ms = 800): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─────────────────────────────────────────────────────────────────────────────
// Public service functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Submits a free trial sign-up lead.
 *
 * Intended to be called from the trial sign-up form on the landing page.
 * On success, the caller should redirect the user to a confirmation/thank-you page.
 *
 * // TODO: Replace with real CRM/backend API call
 */
export async function submitTrialSignup(
  data: TrialSignupData
): Promise<LeadResponse> {
  log("submitTrialSignup called", { name: data.name, email: data.email, city: data.city });

  await simulateDelay();

  const referenceId = generateReferenceId();

  log(`submitTrialSignup success — referenceId: ${referenceId}`);

  return {
    success: true,
    message:
      "Your free trial has been activated. Check your email for login details and next steps.",
    referenceId,
    data: { ...data } as Record<string, unknown>,
  };
}

/**
 * Books a product demo session.
 *
 * Intended to be called from the "Book a Demo" form. On success, a confirmation
 * email with calendar invite details should be sent to the prospect.
 *
 * // TODO: Replace with real CRM/backend API call
 */
export async function bookDemo(data: BookDemoData): Promise<LeadResponse> {
  log("bookDemo called", {
    name: data.name,
    email: data.email,
    preferredDate: data.preferredDate,
    preferredTime: data.preferredTime,
  });

  await simulateDelay();

  const referenceId = generateReferenceId();

  log(`bookDemo success — referenceId: ${referenceId}`);

  return {
    success: true,
    message:
      "Your demo is booked. Our team will send you a calendar invite and joining link within a few hours.",
    referenceId,
    data: { ...data } as Record<string, unknown>,
  };
}

/**
 * Submits a general contact or enquiry form.
 *
 * Suitable for the contact page and any generic "get in touch" forms across
 * the marketing site.
 *
 * // TODO: Replace with real CRM/backend API call
 */
export async function submitContact(data: ContactData): Promise<LeadResponse> {
  log("submitContact called", {
    name: data.name,
    email: data.email,
    queryType: data.queryType,
    subject: data.subject,
  });

  await simulateDelay();

  const referenceId = generateReferenceId();

  log(`submitContact success — referenceId: ${referenceId}`);

  return {
    success: true,
    message:
      "Thank you for reaching out. Our team will get back to you within 24 working hours.",
    referenceId,
    data: { ...data } as Record<string, unknown>,
  };
}

/**
 * Requests a phone callback from the sales or support team.
 *
 * Typically triggered from a "Request a Callback" widget on the landing page
 * or pricing page. Keep the form fields minimal to reduce friction.
 *
 * // TODO: Replace with real CRM/backend API call
 */
export async function requestCallback(
  data: CallbackData
): Promise<LeadResponse> {
  log("requestCallback called", {
    name: data.name,
    mobile: data.mobile,
    preferredTime: data.preferredTime,
  });

  await simulateDelay();

  const referenceId = generateReferenceId();

  log(`requestCallback success — referenceId: ${referenceId}`);

  return {
    success: true,
    message:
      "We have received your callback request. Our team will call you at the preferred time on the number provided.",
    referenceId,
    data: { ...data } as Record<string, unknown>,
  };
}
