import React, { useState } from 'react';
import { Shield, ArrowRight, CheckCircle2, User, Lock, Sparkles, Building2, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { DEMO_USERS } from '../services/db';

interface LoginPageProps {
  onSuccessLogin: () => void;
  onBackToHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccessLogin, onBackToHome }) => {
  const { login, loginAsDemoUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('bureau_officer');
  const [selectedSubRole, setSelectedSubRole] = useState<'PGRC' | 'RB'>('PGRC');
  const [email, setEmail] = useState('anita.sharma@aicte.gov.in');
  const [password, setPassword] = useState('demo123456');
  const [errorMsg, setErrorMsg] = useState('');

  const roleCards: {
    role: UserRole;
    title: string;
    description: string;
    subRoles?: ('PGRC' | 'RB')[];
    demoUser: string;
    demoEmail: string;
  }[] = [
    {
      role: 'bureau_officer',
      title: 'Bureau Officer',
      description: 'Public Grievance Redressal Cell or Regulation Bureau',
      subRoles: ['PGRC', 'RB'],
      demoUser: 'Anita Sharma (PGRC) / Vikram Rao (RB)',
      demoEmail: 'anita.sharma@aicte.gov.in',
    },
    {
      role: 'senior_management',
      title: 'Senior Management',
      description: 'Member Secretary & Executive Advisors',
      demoUser: 'Dr. R. K. Mehta (Advisor)',
      demoEmail: 'rk.mehta@aicte.gov.in',
    },
    {
      role: 'regional_officer',
      title: 'Regional Officer',
      description: 'Western Regional Office (Mumbai)',
      demoUser: 'Sunita Kulkarni (Regional Officer)',
      demoEmail: 'sunita.kulkarni@aicte.gov.in',
    },
    {
      role: 'complainant',
      title: 'Complainant',
      description: 'Students, parents, faculty & public citizens',
      demoUser: 'Rahul Verma (Student)',
      demoEmail: 'rahul.verma@example.in',
    },
    {
      role: 'admin',
      title: 'System Administrator',
      description: 'e-Governance cell system maintenance',
      demoUser: 'Admin User',
      demoEmail: 'admin@syntra.aicte.gov.in',
    },
  ];

  const handleSelectRole = (r: UserRole) => {
    setSelectedRole(r);
    setErrorMsg('');
    const target = DEMO_USERS.find((u) => u.role === r);
    if (target) {
      setEmail(target.email);
    }
  };

  const handleAutoFillDemo = () => {
    if (selectedRole === 'bureau_officer' && selectedSubRole === 'RB') {
      setEmail('vikram.rao@aicte.gov.in');
      setPassword('demo123456');
      loginAsDemoUser('bureau_officer');
      // Set to Vikram Rao specifically
      const rbUser = DEMO_USERS.find((u) => u.email === 'vikram.rao@aicte.gov.in');
      if (rbUser) {
        login(rbUser.email, 'bureau_officer');
      }
    } else {
      const demo = DEMO_USERS.find((u) => u.role === selectedRole);
      if (demo) {
        setEmail(demo.email);
        setPassword('demo123456');
        loginAsDemoUser(selectedRole);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter a valid official email address');
      return;
    }
    const success = login(email, selectedRole);
    if (success) {
      onSuccessLogin();
    } else {
      setErrorMsg('Authentication error. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F3] flex flex-col md:flex-row">
      {/* Left Charcoal Brand Panel */}
      <div className="w-full md:w-5/12 bg-[#1F1F24] text-white p-8 md:p-12 flex flex-col justify-between border-r border-[#2D2D35] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#C9AE7C_1px,transparent_1px)] [background-size:20px_20px]" />

        <div className="relative z-10 space-y-6">
          <button
            type="button"
            onClick={onBackToHome}
            className="text-xs text-gray-400 hover:text-[#C9AE7C] flex items-center gap-1.5 transition-colors font-medium uppercase tracking-wider"
          >
            ← Back to Public Portal
          </button>

          <div className="flex items-center gap-3 pt-4">
            <div className="w-10 h-10 rounded-[2px] bg-[#C9AE7C] text-[#1F1F24] flex items-center justify-center font-bold shadow-md">
              <Shield size={22} />
            </div>
            <div>
              <div className="font-serif font-bold text-2xl tracking-wider text-white">
                SYNTRA
              </div>
              <div className="text-[10px] uppercase tracking-widest text-[#C9AE7C] font-semibold">
                AICTE Official Portal
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-6">
            <h2 className="font-serif text-2xl font-bold text-white leading-snug">
              Unified Complaint Intelligence & Cross-Bureau Coordination
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Problem Statement SIH26264: Integrated Dashboard for Monitoring and Tracking
              Institution-Related Complaint Cases Across AICTE Bureaus & Cells.
            </p>
          </div>

          <div className="bg-[#2D2D35] border border-[#C9AE7C]/30 p-4 rounded-[4px] space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#C9AE7C] font-semibold">
              <Sparkles size={14} />
              <span>SIH 2026 Evaluation Sandbox</span>
            </div>
            <p className="text-[11px] text-gray-300">
              Select any role on the right panel to test role-specific dashboards,
              cross-bureau overlap intelligence, and SYRA assistant commands.
            </p>
          </div>
        </div>

        <div className="relative z-10 pt-8 text-[11px] text-gray-500 font-mono">
          AICTE e-Governance Cell · Prototype with synthetic demonstration data.
        </div>
      </div>

      {/* Right White Form Panel */}
      <div className="flex-1 bg-white p-6 md:p-12 flex flex-col justify-center max-w-2xl mx-auto w-full">
        <div className="max-w-md w-full mx-auto space-y-6">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#8C6D2E]">
              Step 1 of 2
            </span>
            <h1 className="font-serif text-2xl font-bold text-[#1F1F24] mt-0.5">
              Select Your Official Role
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Choose the access tier for which you hold authorized credentials.
            </p>
          </div>

          {/* 5 Selectable Role Cards */}
          <div className="space-y-2">
            {roleCards.map((rc) => {
              const isSelected = selectedRole === rc.role;
              return (
                <div
                  key={rc.role}
                  onClick={() => handleSelectRole(rc.role)}
                  className={`p-3 rounded-[3px] border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#C9AE7C] bg-[#FAF6EE] shadow-xs'
                      : 'border-[#E3E3E6] hover:border-gray-400 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-xs text-[#1F1F24]">
                      {rc.title}
                    </span>
                    {isSelected && (
                      <CheckCircle2 size={15} className="text-[#8C6D2E]" />
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">{rc.description}</p>

                  {/* Sub-role selector for Bureau Officer (PGRC vs RB) */}
                  {isSelected && rc.subRoles && (
                    <div className="mt-2 pt-2 border-t border-[#C9AE7C]/30 flex items-center gap-2">
                      <span className="text-[10px] text-gray-600 font-semibold">Bureau:</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSubRole('PGRC');
                          setEmail('anita.sharma@aicte.gov.in');
                        }}
                        className={`px-2 py-0.5 text-[10px] font-mono rounded border ${
                          selectedSubRole === 'PGRC'
                            ? 'bg-[#1F1F24] text-[#C9AE7C] border-[#1F1F24]'
                            : 'bg-white text-gray-700 border-gray-300'
                        }`}
                      >
                        PGRC (Anita Sharma)
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSubRole('RB');
                          setEmail('vikram.rao@aicte.gov.in');
                        }}
                        className={`px-2 py-0.5 text-[10px] font-mono rounded border ${
                          selectedSubRole === 'RB'
                            ? 'bg-[#1F1F24] text-[#C9AE7C] border-[#1F1F24]'
                            : 'bg-white text-gray-700 border-gray-300'
                        }`}
                      >
                        RB (Vikram Rao)
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Form Step */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#8C6D2E]">
                Step 2: Authenticate
              </span>
              <button
                type="button"
                onClick={handleAutoFillDemo}
                className="text-[11px] text-[#655A86] hover:text-[#1F1F24] font-semibold flex items-center gap-1 underline"
              >
                <Key size={11} /> Auto-fill Demo Credentials
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F1F24] mb-1">
                Official AICTE Email / Complainant ID
              </label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#FAF9F7] border border-[#E3E3E6] rounded-[2px] pl-8 pr-3 py-2 text-xs text-[#1F1F24] focus:outline-none focus:border-[#C9AE7C] focus:bg-white transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F1F24] mb-1">
                Portal Password
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#FAF9F7] border border-[#E3E3E6] rounded-[2px] pl-8 pr-3 py-2 text-xs text-[#1F1F24] focus:outline-none focus:border-[#C9AE7C] focus:bg-white transition-all font-mono"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-[2px]">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-[#C9AE7C] hover:bg-[#B39358] text-[#1F1F24] text-xs font-bold uppercase tracking-wider rounded-[2px] shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>ACCESS SYNTRA WORKSPACE</span>
              <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
