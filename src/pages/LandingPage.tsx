import React from 'react';
import {
  Shield,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Share2,
  Users,
  Clock,
  History,
  BarChart3,
  Building2,
  CheckCircle,
  FileText,
  AlertTriangle,
  ChevronRight,
  Layers,
  Lock,
  Plus,
} from 'lucide-react';

interface LandingPageProps {
  onNavigateLogin: () => void;
  onExploreFeatures: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateLogin,
  onExploreFeatures,
}) => {
  return (
    <div className="min-h-screen bg-[#F2F2F3] text-[#3A3A40] flex flex-col font-sans selection:bg-[#C9AE7C]/30 selection:text-[#1F1F24]">
      {/* Sticky Top Nav */}
      <header className="sticky top-0 z-40 bg-[#1F1F24] border-b border-[#2D2D35] px-6 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[2px] bg-[#C9AE7C] text-[#1F1F24] flex items-center justify-center font-bold shadow-sm">
              <Shield size={20} />
            </div>
            <div>
              <div className="font-serif font-bold text-lg tracking-wider text-white flex items-center gap-2">
                <span>SYNTRA</span>
                <span className="text-[10px] font-sans font-normal px-1.5 py-0.2 bg-[#2D2D35] text-[#C9AE7C] border border-[#C9AE7C]/30 rounded">
                  SIH26264
                </span>
              </div>
              <div className="text-[10px] uppercase tracking-wider text-gray-400">
                All India Council for Technical Education
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-gray-300">
            <a href="#about" className="hover:text-[#C9AE7C] transition-colors">About</a>
            <a href="#problem" className="hover:text-[#C9AE7C] transition-colors">The Challenge</a>
            <a href="#features" className="hover:text-[#C9AE7C] transition-colors">Features</a>
            <a href="#syra" className="hover:text-[#C9AE7C] transition-colors">SYRA AI</a>
            <a href="#roles" className="hover:text-[#C9AE7C] transition-colors">Roles</a>
            <a href="#workflow" className="hover:text-[#C9AE7C] transition-colors">How It Works</a>
          </nav>

          <button
            type="button"
            onClick={onNavigateLogin}
            className="px-4 py-2 bg-[#C9AE7C] hover:bg-[#B39358] text-[#1F1F24] text-xs uppercase tracking-wider font-bold rounded-[2px] shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>LOGIN</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-[#1F1F24] text-white py-20 px-6 border-b border-[#2D2D35] overflow-hidden">
        {/* Subtle geometric grid background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C9AE7C_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-[#2D2D35] border border-[#C9AE7C]/40 text-[#C9AE7C] text-xs font-semibold uppercase tracking-wider">
            <Shield size={13} />
            <span>Smart India Hackathon 2026 · Problem Statement SIH26264</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            One System. Every Case. <br />
            <span className="text-[#C9AE7C]">Connected.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-gray-300 text-base sm:text-lg font-light leading-relaxed">
            Unified Complaint Intelligence & Cross-Bureau Coordination Platform for AICTE.
            Empowering authorized officials across Regulation, PGRC, Approval, and Regional Offices
            with real-time visibility, automated overlap detection, and synchronized case resolution.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={onNavigateLogin}
              className="px-6 py-3 bg-[#C9AE7C] hover:bg-[#B39358] text-[#1F1F24] text-xs uppercase tracking-wider font-bold rounded-[2px] shadow-md transition-all flex items-center gap-2"
            >
              <span>LOGIN TO SYNTRA</span>
              <ArrowRight size={14} />
            </button>
            <a
              href="#features"
              className="px-6 py-3 bg-transparent hover:bg-white/5 text-[#C9AE7C] border border-[#C9AE7C] text-xs uppercase tracking-wider font-bold rounded-[2px] transition-all"
            >
              EXPLORE FEATURES
            </a>
          </div>

          <p className="text-[11px] text-gray-400 font-mono tracking-wide">
            * SYNTRA is a decision-support & coordination engine. All case decisions are made by authorized officials.
          </p>
        </div>
      </section>

      {/* Welcome / Problem Illustration */}
      <section id="problem" className="py-16 px-6 bg-white border-b border-[#E3E3E6]">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#8C6D2E] font-bold">
              The AICTE Administrative Challenge
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#1F1F24] mt-1">
              Overcoming Fragmented Complaint Silos
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Historically, grievances regarding the same technical institution reach separate bureaus
              (Public Grievance Redressal Cell, Regulation Bureau, Approval Bureau). Operating in isolation
              leads to duplicated verification, conflicting official directives, and procedural delays.
            </p>
          </div>

          {/* Simple Visual Diagram */}
          <div className="bg-[#FAF9F7] border border-[#E3E3E6] rounded-[4px] p-6 max-w-4xl mx-auto shadow-sm">
            <div className="text-center font-serif text-sm font-semibold text-[#1F1F24] mb-4">
              Cross-Bureau Overlap Scenario
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Institution */}
              <div className="p-4 bg-white border-2 border-[#C9AE7C] rounded-[4px] text-center shadow-xs">
                <div className="text-[10px] font-mono text-[#8C6D2E] uppercase font-bold">
                  AICTE ID: 1-43289012
                </div>
                <div className="font-serif font-bold text-sm text-[#1F1F24] mt-1">
                  ABC Institute of Tech, Pune
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">Approved Technical Campus</div>
              </div>

              {/* Fragmented Dockets */}
              <div className="space-y-3">
                <div className="p-3 bg-white border border-[#655A86] rounded text-left text-xs shadow-xs">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#655A86]">
                    <span>SYN-1042</span>
                    <span>PGRC Bureau</span>
                  </div>
                  <div className="font-medium text-[#1F1F24] mt-1">Unauthorized fee collection</div>
                  <div className="text-[10px] text-gray-500">Filed by: Student Complainant</div>
                </div>

                <div className="p-3 bg-white border border-[#C9953A] rounded text-left text-xs shadow-xs">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#C9953A]">
                    <span>SYN-1088</span>
                    <span>Regulation Bureau</span>
                  </div>
                  <div className="font-medium text-[#1F1F24] mt-1">Fee structure non-compliance</div>
                  <div className="text-[10px] text-gray-500">Filed by: State Fee Regulatory Cell</div>
                </div>
              </div>

              {/* SYNTRA Solution */}
              <div className="p-4 bg-[#FAF6EE] border-2 border-[#C9AE7C] rounded-[4px] text-center shadow-sm">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#C9AE7C] text-[#1F1F24] text-[10px] font-bold uppercase rounded">
                  <Sparkles size={11} /> SYNTRA Overlap Intelligence
                </div>
                <div className="font-serif font-bold text-sm text-[#1F1F24] mt-2">
                  Potential Overlapping Cases
                </div>
                <p className="text-[11px] text-[#8C6D2E] mt-1">
                  Coordination Required · Score: 94% · Joint Room CR-2026-01 Established
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats Strip */}
      <section className="bg-[#1F1F24] text-white py-8 px-6 border-b border-[#2D2D35]">
        <div className="max-w-6xl mx-auto">
          <div className="text-[10px] font-mono uppercase tracking-widest text-center text-[#C9AE7C] mb-4">
            — Illustrative Demo Data (Synthetic Demonstration Platform) —
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-3 border-r border-[#2D2D35] last:border-none">
              <div className="font-serif text-3xl md:text-4xl font-bold text-[#C9AE7C]">150</div>
              <div className="text-xs text-gray-300 uppercase tracking-wider mt-1">Dockets Managed</div>
            </div>
            <div className="p-3 border-r border-[#2D2D35] last:border-none">
              <div className="font-serif text-3xl md:text-4xl font-bold text-[#C9AE7C]">40</div>
              <div className="text-xs text-gray-300 uppercase tracking-wider mt-1">Institutions Mapped</div>
            </div>
            <div className="p-3 border-r border-[#2D2D35] last:border-none">
              <div className="font-serif text-3xl md:text-4xl font-bold text-[#C9AE7C]">8+</div>
              <div className="text-xs text-gray-300 uppercase tracking-wider mt-1">Cross-Bureau Overlaps</div>
            </div>
            <div className="p-3">
              <div className="font-serif text-3xl md:text-4xl font-bold text-[#C9AE7C]">5</div>
              <div className="text-xs text-gray-300 uppercase tracking-wider mt-1">AICTE Bureaus & Cells</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-16 px-6 bg-[#F2F2F3] border-b border-[#E3E3E6]">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#8C6D2E] font-bold">
              Integrated Capabilities
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#1F1F24] mt-1">
              Purpose-Built for AICTE Governance
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Every tool engineered to eliminate blind spots, streamline communication, and enforce
              strict procedural accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                title: 'Institution Registry',
                icon: <Building2 className="text-[#655A86]" size={22} />,
                desc: 'Master directory of AICTE approved colleges with Permanent IDs, inspection dossiers, and historical dockets.',
              },
              {
                title: 'Overlap Intelligence',
                icon: <ShieldAlert className="text-[#C9953A]" size={22} />,
                desc: 'Deterministic multi-factor matching across bureaus based on institute ID, category, keywords, and dates.',
              },
              {
                title: 'Interactive CaseGraph',
                icon: <Share2 className="text-[#655A86]" size={22} />,
                desc: 'Relational visual network of institutions, complaints, bureaus, and assigned officers with node filtering.',
              },
              {
                title: 'Coordination Rooms',
                icon: <Users className="text-[#4F8A6B]" size={22} />,
                desc: 'Shared operational workspaces uniting officers from different bureaus with threaded notes and synchronized tasks.',
              },
              {
                title: 'DelayRadar Monitor',
                icon: <Clock className="text-[#B5524A]" size={22} />,
                desc: 'Transparent rule-based warning engine flagging disposal window breaches, stagnated files, and workload bottlenecks.',
              },
              {
                title: 'Decision Trail (Audit)',
                icon: <History className="text-[#3A3A40]" size={22} />,
                desc: 'Append-only regulatory log recording every action, status transition, and human confirmation of AI suggestions.',
              },
              {
                title: 'Analytics & Reports',
                icon: <BarChart3 className="text-[#4C6FA5]" size={22} />,
                desc: 'Real-time bureau workload comparison, case ageing analysis, disposal ratios, and exportable CSV/PDF summaries.',
              },
              {
                title: 'SYRA AI Assistant',
                icon: <Sparkles className="text-[#C9AE7C]" size={22} />,
                desc: 'Agentic function-calling copilot executing verified actions: searching, form pre-filling, escalation drafts, and audits.',
              },
            ].map((feat, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#E3E3E6] rounded-[4px] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-[2px] bg-[#FAF9F7] border border-[#E3E3E6] flex items-center justify-center mb-3 group-hover:border-[#C9AE7C] transition-colors">
                    {feat.icon}
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#1F1F24] mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{feat.desc}</p>
                </div>
                <div className="pt-4 mt-2 flex justify-end">
                  <div className="w-7 h-7 rounded-full bg-[#655A86]/10 text-[#655A86] flex items-center justify-center group-hover:bg-[#655A86] group-hover:text-white transition-colors">
                    <Plus size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SYRA AI Assistant Showcase */}
      <section id="syra" className="py-16 px-6 bg-white border-b border-[#E3E3E6]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#1F1F24] text-[#C9AE7C] text-xs font-semibold uppercase tracking-wider rounded-[2px]">
              <Sparkles size={13} />
              <span>Agentic AI Copilot</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F1F24]">
              Not Just Answers. <br />
              <span className="text-[#C9AE7C]">Actions.</span>
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              SYRA uses structured tool-calling to execute administrative tasks without manual navigation.
              Ask SYRA to draft complaint filings, cross-examine previous cases, filter registries,
              or generate compliance digests.
            </p>
            <div className="space-y-2 text-xs text-[#3A3A40]">
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-[#4F8A6B]" />
                <span>Zero Hallucinations: Reads and writes only to the verified database</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-[#4F8A6B]" />
                <span>Human-in-the-Loop: Consequential actions require explicit officer confirmation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-[#4F8A6B]" />
                <span>Decision Trail: Every AI recommendation is recorded in the official audit log</span>
              </div>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={onNavigateLogin}
                className="px-5 py-2.5 bg-[#1F1F24] hover:bg-black text-[#C9AE7C] text-xs font-bold uppercase tracking-wider rounded-[2px] transition-colors"
              >
                Test SYRA in Demo Console
              </button>
            </div>
          </div>

          {/* Assistant UI Mockup */}
          <div className="md:col-span-6 bg-[#1F1F24] rounded-[4px] border border-[#2D2D35] p-4 text-white shadow-xl space-y-3 font-sans">
            <div className="flex items-center justify-between pb-2 border-b border-[#2D2D35]">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-[#C9AE7C]" />
                <span className="font-serif font-bold text-sm text-[#C9AE7C]">SYRA Console</span>
              </div>
              <span className="text-[10px] font-mono text-gray-400">PGRC Official Session</span>
            </div>

            {/* Mock message bubble */}
            <div className="bg-[#2D2D35] p-3 rounded text-xs text-gray-200">
              <span className="text-[#C9AE7C] font-semibold">User:</span> "Register a complaint about unauthorized fees at ABC Institute"
            </div>

            {/* Mock SYRA response with action card */}
            <div className="bg-white/5 border border-[#C9AE7C]/60 rounded p-3 text-xs text-gray-200 space-y-2">
              <div className="text-[#C9AE7C] font-semibold flex items-center gap-1.5">
                <Sparkles size={13} />
                <span>SYRA Action Prepared:</span>
              </div>
              <p className="text-[11px] text-gray-300">
                Form pre-filled for ABC Institute of Technology, Pune. Alert: Existing Case SYN-1042 detected at PGRC.
              </p>
              <div className="bg-black/40 p-2 rounded text-[10px] font-mono text-gray-300 space-y-0.5">
                <div>Institution: ABC Institute of Tech (1-43289012)</div>
                <div>Category: Fee Irregularity</div>
                <div>Overlap Warning: Case SYN-1042 (PGRC)</div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <span className="px-2.5 py-1 bg-[#C9AE7C] text-[#1F1F24] font-bold text-[10px] rounded uppercase">
                  Confirm & Review Docket
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="py-16 px-6 bg-[#F2F2F3] border-b border-[#E3E3E6]">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#8C6D2E] font-bold">
              Access Governance
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#1F1F24] mt-1">
              Strict Role-Based Permissions
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Permissions are enforced on the data layer. Officials only access permitted records;
              complainants track case progression without exposure to confidential inquiry notes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                role: 'Complainant',
                desc: 'Students, faculty & citizens. File complaints, track public stages, upload evidence. Confidential notes concealed.',
                demo: 'Rahul Verma',
              },
              {
                role: 'Bureau Officer',
                desc: 'PGRC & Regulation officers. Inspect dockets, evaluate overlap alerts, participate in coordination rooms.',
                demo: 'Anita Sharma (PGRC) / Vikram Rao (RB)',
              },
              {
                role: 'Regional Officer',
                desc: 'Western, Northern, Southern offices. Oversee regional technical institutions, track overdue inspections.',
                demo: 'Sunita Kulkarni',
              },
              {
                role: 'Senior Management',
                desc: 'Member Secretary & Advisors. Cross-bureau analytics, workload parity, ageing buckets, decision trail.',
                demo: 'Dr. R. K. Mehta',
              },
              {
                role: 'System Admin',
                desc: 'e-Governance cell. Institution master registry, editable workflow stages, system security parameters.',
                demo: 'Admin User',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#E3E3E6] rounded-[4px] p-4 text-xs shadow-xs space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="font-serif font-bold text-sm text-[#1F1F24]">{item.role}</div>
                  <p className="text-gray-600 text-[11px] mt-1 leading-relaxed">{item.desc}</p>
                </div>
                <div className="pt-2 border-t border-[#E3E3E6] text-[10px] text-[#8C6D2E] font-mono">
                  Demo: {item.demo}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6-Step Workflow Timeline */}
      <section id="workflow" className="py-16 px-6 bg-white border-b border-[#E3E3E6]">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#8C6D2E] font-bold">
              Standard Operating Procedure
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#1F1F24] mt-1">
              End-to-End Coordination Workflow
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {[
              { step: '01', title: 'Complaint Received', desc: 'Docket registered with permanent institution ID' },
              { step: '02', title: 'Institution Identified', desc: 'Matched against AICTE Master Registry records' },
              { step: '03', title: 'Cross-Bureau Search', desc: 'Existing dockets scanned across all bureaus' },
              { step: '04', title: 'Overlap Evaluated', desc: 'Deterministic multi-factor algorithm scores correlation' },
              { step: '05', title: 'Officer Review', desc: 'Authorized official confirms or dismisses overlap' },
              { step: '06', title: 'Joint Resolution', desc: 'Coordination room synchronizes tasks and disposal' },
            ].map((st) => (
              <div
                key={st.step}
                className="p-3.5 bg-[#FAF9F7] border border-[#E3E3E6] rounded-[4px] space-y-1.5"
              >
                <div className="font-serif text-xl font-bold text-[#C9AE7C]">{st.step}</div>
                <div className="font-bold text-xs text-[#1F1F24]">{st.title}</div>
                <div className="text-[11px] text-gray-500 leading-tight">{st.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gold CTA Band */}
      <section className="bg-[#C9AE7C] text-[#1F1F24] py-10 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="font-serif text-3xl font-bold">
            Experience Unified Complaint Intelligence Today
          </h2>
          <p className="text-sm max-w-xl mx-auto font-medium">
            Explore the complete end-to-end simulation with pre-seeded cross-bureau overlap scenarios,
            real-time CaseGraph visualization, and SYRA AI assistant.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onNavigateLogin}
              className="px-6 py-3 bg-[#1F1F24] hover:bg-black text-[#C9AE7C] text-xs uppercase tracking-wider font-bold rounded-[2px] shadow-lg transition-all"
            >
              LOGIN TO SYNTRA (DEMO CONSOLE)
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1F1F24] text-white py-10 px-6 border-t border-[#2D2D35] text-xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[2px] bg-[#C9AE7C] text-[#1F1F24] flex items-center justify-center font-bold">
              <Shield size={16} />
            </div>
            <div>
              <div className="font-serif font-bold text-sm text-[#C9AE7C]">SYNTRA</div>
              <div className="text-[10px] text-gray-400">
                SIH 2026 · Problem Statement SIH26264
              </div>
            </div>
          </div>

          <div className="text-center md:text-right text-[11px] text-gray-400">
            <div>AICTE Unified Complaint Intelligence & Cross-Bureau Coordination Platform</div>
            <div className="text-gray-500 mt-1 font-mono text-[10px]">
              Prototype with synthetic demonstration data. Not integrated with live AICTE production systems.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
