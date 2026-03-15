"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";
import type { Client } from "@/types";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

const CASE_TYPES = [
  "Civil", "Criminal", "Family", "Consumer", "Property",
  "Recovery", "Labour", "Cheque Bounce", "Arbitration", "Corporate",
];

const COURTS = [
  "District Court", "Bombay High Court", "Delhi High Court", "Madras High Court",
  "Calcutta High Court", "Supreme Court of India", "Family Court", "Consumer Court",
  "Sessions Court", "Magistrate Court", "Labour Court", "Tribunal", "Other",
];

const TEAM_MEMBERS = [
  { id: "usr_002", name: "Adv. Rahul Mehta", role: "junior" },
  { id: "usr_003", name: "Suresh Patil", role: "clerk" },
  { id: "usr_004", name: "Kavitha Nair", role: "clerk" },
];

const schema = z.object({
  matterTitle: z.string().min(3, "Matter title must be at least 3 characters"),
  clientId: z.string().min(1, "Please select a client"),
  caseType: z.string().min(1, "Please select a case type"),
  courtName: z.string().min(1, "Court name is required"),
  courtLevel: z.string().min(1, "Please select court level"),
  status: z.string().min(1),
  priority: z.string().min(1),
  caseNumber: z.string().optional(),
  cnrNumber: z.string().optional(),
  caseStage: z.string().optional(),
  filingDate: z.string().optional(),
  nextHearingDate: z.string().optional(),
  judgeName: z.string().optional(),
  oppositeParty: z.string().optional(),
  oppositeAdvocate: z.string().optional(),
  advocateOnRecord: z.string().optional(),
  actSection: z.string().optional(),
  policeStation: z.string().optional(),
  assignedJuniorId: z.string().optional(),
  assignedClerkId: z.string().optional(),
  totalFeeAgreed: z.number().min(0, "Fee must be a positive number"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-500 mt-1">{message}</p>;
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base text-slate-700">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </CardContent>
    </Card>
  );
}

export default function NewMatterPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: "active",
      priority: "medium",
      courtLevel: "district_court",
      totalFeeAgreed: 0,
    },
  });

  const clientId = watch("clientId");
  const caseType = watch("caseType");
  const courtLevel = watch("courtLevel");
  const status = watch("status");
  const priority = watch("priority");
  const assignedJuniorId = watch("assignedJuniorId");
  const assignedClerkId = watch("assignedClerkId");

  useEffect(() => {
    api.clients.list({}, { page: 1, pageSize: 200 }).then((r) => setClients(r.data.data));
  }, []);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const res = await api.matters.create({
        matterTitle: data.matterTitle,
        clientId: data.clientId,
        caseType: data.caseType,
        courtName: data.courtName,
        courtLevel: data.courtLevel as Matter["courtLevel"],
        status: data.status as Matter["status"],
        priority: data.priority as Matter["priority"],
        caseNumber: data.caseNumber,
        cnrNumber: data.cnrNumber,
        caseStage: data.caseStage,
        filingDate: data.filingDate,
        nextHearingDate: data.nextHearingDate,
        judgeName: data.judgeName,
        oppositeParty: data.oppositeParty,
        oppositeAdvocate: data.oppositeAdvocate,
        advocateOnRecord: data.advocateOnRecord,
        actSection: data.actSection,
        policeStation: data.policeStation,
        assignedJuniorId: data.assignedJuniorId,
        assignedClerkId: data.assignedClerkId,
        totalFeeAgreed: data.totalFeeAgreed,
        notes: data.notes,
        totalFeePaid: 0,
        totalExpenses: 0,
        createdBy: "usr_001",
      });
      toast.success("Matter added successfully.");
      router.push(`/matters/${res.data.id}`);
    } catch {
      toast.error("Failed to add matter. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Type import for Matter
  type Matter = import("@/types").Matter;

  return (
    <div>
      <div className="mb-4">
        <Link href="/matters" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Matters
        </Link>
      </div>

      <PageHeader title="Add New Matter" description="Enter details to create a new case or matter." />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">

        {/* Basic Info */}
        <SectionCard title="Basic Information">
          <div className="md:col-span-2">
            <Label>Matter Title *</Label>
            <Input placeholder="e.g. Agarwal vs Sharma - Property Dispute" className="mt-1" {...register("matterTitle")} />
            <FieldError message={errors.matterTitle?.message} />
          </div>
          <div>
            <Label>Client *</Label>
            <Select value={clientId} onValueChange={(v) => v !== null && setValue("clientId", v)}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select client" /></SelectTrigger>
              <SelectContent>
                {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <FieldError message={errors.clientId?.message} />
          </div>
          <div>
            <Label>Case Type *</Label>
            <Select value={caseType} onValueChange={(v) => v !== null && setValue("caseType", v)}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                {CASE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <FieldError message={errors.caseType?.message} />
          </div>
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => v !== null && setValue("status", v)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Priority</Label>
            <Select value={priority} onValueChange={(v) => v !== null && setValue("priority", v)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Case Number</Label>
            <Input placeholder="e.g. CS/1234/2024" className="mt-1" {...register("caseNumber")} />
          </div>
          <div>
            <Label>CNR Number</Label>
            <Input placeholder="eCourts CNR number" className="mt-1" {...register("cnrNumber")} />
          </div>
        </SectionCard>

        {/* Court Details */}
        <SectionCard title="Court Details">
          <div>
            <Label>Court Name *</Label>
            <Select value={watch("courtName")} onValueChange={(v) => v !== null && setValue("courtName", v)}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select court" /></SelectTrigger>
              <SelectContent>
                {COURTS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <FieldError message={errors.courtName?.message} />
          </div>
          <div>
            <Label>Court Level *</Label>
            <Select value={courtLevel} onValueChange={(v) => v !== null && setValue("courtLevel", v)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="district_court">District Court</SelectItem>
                <SelectItem value="high_court">High Court</SelectItem>
                <SelectItem value="supreme_court">Supreme Court</SelectItem>
                <SelectItem value="sessions_court">Sessions Court</SelectItem>
                <SelectItem value="magistrate_court">Magistrate Court</SelectItem>
                <SelectItem value="family_court">Family Court</SelectItem>
                <SelectItem value="consumer_court">Consumer Court</SelectItem>
                <SelectItem value="tribunal">Tribunal</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Case Stage</Label>
            <Input placeholder="e.g. Arguments, Trial, Evidence" className="mt-1" {...register("caseStage")} />
          </div>
          <div>
            <Label>Judge Name</Label>
            <Input placeholder="Hon. Judge name" className="mt-1" {...register("judgeName")} />
          </div>
          <div>
            <Label>Filing Date</Label>
            <Input type="date" className="mt-1" {...register("filingDate")} />
          </div>
          <div>
            <Label>Next Hearing Date</Label>
            <Input type="date" className="mt-1" {...register("nextHearingDate")} />
          </div>
        </SectionCard>

        {/* Parties */}
        <SectionCard title="Parties">
          <div>
            <Label>Opposite Party</Label>
            <Input placeholder="Name of opposite party" className="mt-1" {...register("oppositeParty")} />
          </div>
          <div>
            <Label>Opposite Advocate</Label>
            <Input placeholder="Opposing counsel name" className="mt-1" {...register("oppositeAdvocate")} />
          </div>
          <div>
            <Label>Advocate on Record</Label>
            <Input placeholder="AOR name if different" className="mt-1" {...register("advocateOnRecord")} />
          </div>
        </SectionCard>

        {/* Legal Details */}
        <SectionCard title="Legal Details">
          <div className="md:col-span-2">
            <Label>Act / Section</Label>
            <Input placeholder="e.g. IPC 420, CPC Order 39, NI Act 138" className="mt-1" {...register("actSection")} />
          </div>
          <div>
            <Label>Police Station</Label>
            <Input placeholder="For criminal matters" className="mt-1" {...register("policeStation")} />
          </div>
        </SectionCard>

        {/* Assignment */}
        <SectionCard title="Assignment">
          <div>
            <Label>Assigned Junior</Label>
            <Select value={assignedJuniorId || ""} onValueChange={(v) => v !== null && setValue("assignedJuniorId", v)}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select junior" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {TEAM_MEMBERS.filter((m) => m.role === "junior").map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Assigned Clerk</Label>
            <Select value={assignedClerkId || ""} onValueChange={(v) => v !== null && setValue("assignedClerkId", v)}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select clerk" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {TEAM_MEMBERS.filter((m) => m.role === "clerk").map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </SectionCard>

        {/* Financial */}
        <SectionCard title="Financial">
          <div>
            <Label>Total Fee Agreed (₹)</Label>
            <Input type="number" min={0} placeholder="0" className="mt-1" {...register("totalFeeAgreed", { valueAsNumber: true })} />
            <FieldError message={errors.totalFeeAgreed?.message} />
          </div>
        </SectionCard>

        {/* Notes */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base text-slate-700">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea placeholder="Additional case notes, instructions, or context…" className="resize-none" rows={4} {...register("notes")} />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center gap-3 pb-8">
          <Button type="submit" disabled={submitting} className="bg-[#1e3a5f] hover:bg-[#162d4a] gap-2">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Adding Matter…" : "Add Matter"}
          </Button>
          <Link href="/matters">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
