import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In – NyayVakil",
  description: "Sign in to your NyayVakil account",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1e3a5f] flex-col justify-center items-center p-12 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full" />
        </div>

        <div className="max-w-md text-center relative z-10">
          {/* Logo */}
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mb-8 mx-auto border border-white/20 shadow-lg">
            <span className="text-4xl">⚖️</span>
          </div>

          <h1 className="text-4xl font-bold mb-3 tracking-tight">NyayVakil</h1>
          <p className="text-xl text-white/70 mb-3 font-medium">Legal Practice Manager</p>
          <div className="w-16 h-0.5 bg-white/30 mx-auto mb-8" />

          <p className="text-white/60 text-sm leading-relaxed mb-12">
            Designed for Indian advocates and law firms. Manage cases, hearings,
            fees, and clients — all in one place.
          </p>

          {/* Feature highlights */}
          <div className="grid grid-cols-2 gap-3 text-left">
            {[
              { icon: "📅", label: "Court Diary" },
              { icon: "💰", label: "Fee Tracking" },
              { icon: "📁", label: "Case Management" },
              { icon: "👥", label: "Client Records" },
              { icon: "📄", label: "Documents" },
              { icon: "🔔", label: "Reminders" },
            ].map((f) => (
              <div
                key={f.label}
                className="bg-white/10 rounded-xl p-3 text-sm flex items-center gap-2.5 border border-white/10 hover:bg-white/15 transition-colors"
              >
                <span className="text-base">{f.icon}</span>
                <span className="text-white/80 font-medium">{f.label}</span>
              </div>
            ))}
          </div>

          {/* Bottom trust badge */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-white/40 text-xs">
              Trusted by advocates across India
            </p>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 min-h-screen">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#1e3a5f] rounded-xl flex items-center justify-center">
              <span className="text-xl">⚖️</span>
            </div>
            <span className="text-2xl font-bold text-[#1e3a5f]">NyayVakil</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
