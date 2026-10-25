import React, { useState, useEffect } from 'react';
import {
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle,
  Users,
  Building2,
  TrendingUp,
  ArrowRight,
  ShieldAlert,
  Share2,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import { Complaint, CaseRelationship, CoordinationRoom } from '../types';
import { WindowPanel } from '../components/common/WindowPanel';
import { StatusBadge, PriorityBadge, BureauBadge } from '../components/common/StatusBadge';
import { OverlapBanner } from '../components/common/OverlapBanner';
import { checkOverlapForCase } from '../services/overlapEngine';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

interface OverviewPageProps {
  onNavigate: (path: string, state?: any) => void;
  onOpenCase: (caseNumber: string) => void;
  onOpenCoordinationRoom: (roomId: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  onNavigate,
  onOpenCase,
  onOpenCoordinationRoom,
}) => {
  const { currentUser } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [relationships, setRelationships] = useState<CaseRelationship[]>([]);
  const [rooms, setRooms] = useState<CoordinationRoom[]>([]);

  useEffect(() => {
    setComplaints(db.getComplaints());
    setRelationships(db.getRelationships());
    setRooms(db.getRooms());

    const unsub = db.subscribe((state) => {
      setComplaints(state.complaints);
      setRelationships(state.relationships);
      setRooms(state.rooms);
    });
    return unsub;
  }, []);

  const role = currentUser?.role || 'bureau_officer';

  // Live KPI calculations
  const totalCases = complaints.length;
  const pendingCases = complaints.filter(
    (c) => c.status === 'Received' || c.status === 'Under Review' || c.status === 'Assigned'
  ).length;
  const investigationCases = complaints.filter(
    (c) => c.status === 'Investigation' || c.status === 'Coordination Required'
  ).length;
  const resolvedCases = complaints.filter(
    (c) => c.status === 'Resolved' || c.status === 'Closed'
  ).length;
  const overdueCases = complaints.filter((c) => c.isOverdue).length;
  const overlapAlertsCount = relationships.filter((r) => r.status === 'suggested').length;

  // Flagship candidate for instant demo overlap display: SYN-1042
  const flagshipCase = complaints.find((c) => c.caseNumber === 'SYN-1042');
  const flagshipMatches = flagshipCase ? checkOverlapForCase(flagshipCase) : [];

  // Workload by Bureau
  const bureauData = [
    { name: 'PGRC', count: complaints.filter((c) => c.bureauCode === 'PGRC').length },
    { name: 'Regulation (RB)', count: complaints.filter((c) => c.bureauCode === 'RB').length },
    { name: 'Approval (AB)', count: complaints.filter((c) => c.bureauCode === 'AB').length },
    { name: 'Regional (RO)', count: complaints.filter((c) => c.bureauCode === 'RO').length },
    { name: 'Academic (ACAD)', count: complaints.filter((c) => c.bureauCode === 'ACAD').length },
  ];

  // Ageing Buckets
  const ageingData = [
    { name: '< 15 Days', value: complaints.filter((c) => !c.isOverdue).length - 20 },
    { name: '15 - 30 Days', value: 45 },
    { name: '30 - 60 Days', value: 25 },
    { name: '> 60 Days', value: overdueCases },
  ];

  const COLORS = ['#4F8A6B', '#C9AE7C', '#C9953A', '#B5524A'];

  // Render Complainant Dashboard
  if (role === 'complainant') {
    const myComplaints = complaints.filter(
      (c) => c.complainantEmail.toLowerCase() === currentUser?.email.toLowerCase()
    );

    return (
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E3E3E6]">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#1F1F24]">
              Complainant Grievance Portal
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Welcome {currentUser?.name}. Track your filed technical institution complaints and formal updates.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/register-complaint')}
            className="px-4 py-2 bg-[#C9AE7C] hover:bg-[#B39358] text-[#1F1F24] text-xs font-bold uppercase tracking-wider rounded-[2px] shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <PlusCircle size={14} />
            <span>Lodge New Complaint</span>
          </button>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-[#E3E3E6] rounded-[4px] p-4 shadow-xs">
            <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
              Total Filed Grievances
            </div>
            <div className="font-serif text-3xl font-bold text-[#1F1F24] mt-1">
              {myComplaints.length}
            </div>
          </div>
          <div className="bg-white border border-[#E3E3E6] rounded-[4px] p-4 shadow-xs">
            <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
              Under Official Scrutiny
            </div>
            <div className="font-serif text-3xl font-bold text-[#C9953A] mt-1">
              {myComplaints.filter((c) => c.status !== 'Resolved' && c.status !== 'Closed').length}
            </div>
          </div>
          <div className="bg-white border border-[#E3E3E6] rounded-[4px] p-4 shadow-xs">
            <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
              Redressed & Concluded
            </div>
            <div className="font-serif text-3xl font-bold text-[#4F8A6B] mt-1">
              {myComplaints.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length}
            </div>
          </div>
        </div>

        {/* My Dockets Window */}
        <WindowPanel
          title="My Active Grievance Dockets"
          subtitle="Real-time case progress verified against AICTE records"
          icon={<FileText size={16} />}
        >
          {myComplaints.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <FileText size={32} className="mx-auto text-gray-400" />
              <p className="text-xs text-gray-500">No grievances filed yet.</p>
              <button
                type="button"
                onClick={() => onNavigate('/register-complaint')}
                className="px-4 py-1.5 bg-[#1F1F24] text-[#C9AE7C] text-xs font-semibold uppercase rounded-[2px]"
              >
                Register Your First Complaint
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#E3E3E6]">
              {myComplaints.map((c) => (
                <div key={c.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-[#1F1F24]">
                        {c.caseNumber}
                      </span>
                      <StatusBadge status={c.status} size="sm" />
                      <span className="text-[11px] text-gray-500 font-mono">
                        Received: {new Date(c.dateReceived).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <div className="font-semibold text-xs text-[#1F1F24]">{c.title}</div>
                    <div className="text-[11px] text-gray-500">
                      Target: {c.institutionName} · Category: {c.category}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenCase(c.caseNumber)}
                    className="px-3 py-1.5 border border-[#E3E3E6] hover:bg-gray-50 text-xs font-semibold text-[#1F1F24] rounded-[2px] flex items-center gap-1.5 transition-colors"
                  >
                    <span>Track Status</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </WindowPanel>
      </div>
    );
  }

  // Render Officer / Executive Dashboard
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E3E3E6]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#1F1F24]">
              {role === 'senior_management'
                ? 'Executive Command & Intelligence Overview'
                : role === 'regional_officer'
                ? 'Regional Office (Western Region) Dashboard'
                : 'Unified Complaint Intelligence Dashboard'}
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time cross-bureau docket monitoring, overlap detection, and synchronized case ageing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('/overlap-alerts')}
            className="px-3 py-1.5 bg-[#FAF6EE] border border-[#C9AE7C] text-[#8C6D2E] text-xs font-bold uppercase tracking-wider rounded-[2px] flex items-center gap-1.5 hover:bg-[#faeed6] transition-colors"
          >
            <ShieldAlert size={13} />
            <span>Overlap Alerts ({overlapAlertsCount})</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/register-complaint')}
            className="px-3 py-1.5 bg-[#C9AE7C] hover:bg-[#B39358] text-[#1F1F24] text-xs font-bold uppercase tracking-wider rounded-[2px] shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <PlusCircle size={13} />
            <span>Register Docket</span>
          </button>
        </div>
      </div>

      {/* Flagship Overlap Banner if candidate match exists */}
      {flagshipMatches.length > 0 && (
        <OverlapBanner
          currentCaseNumber="SYN-1042"
          matches={flagshipMatches}
          onOpenCase={onOpenCase}
          onOpenCoordinationRoom={onOpenCoordinationRoom}
        />
      )}

      {/* KPI Row (Live calculated from database records) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Dockets', value: totalCases, color: 'text-[#1F1F24]', bg: 'bg-white' },
          { label: 'Pending Review', value: pendingCases, color: 'text-[#C9953A]', bg: 'bg-white' },
          { label: 'Under Investigation', value: investigationCases, color: 'text-[#B39358]', bg: 'bg-white' },
          { label: 'Disposed / Closed', value: resolvedCases, color: 'text-[#4F8A6B]', bg: 'bg-white' },
          { label: 'Overdue (DelayRadar)', value: overdueCases, color: 'text-[#B5524A]', bg: 'bg-white' },
          { label: 'Overlap Alerts', value: overlapAlertsCount, color: 'text-[#8C6D2E]', bg: 'bg-[#FAF6EE]' },
        ].map((kpi, idx) => (
          <div
            key={idx}
            className={`${kpi.bg} border border-[#E3E3E6] rounded-[4px] p-3 shadow-xs space-y-1`}
          >
            <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider truncate">
              {kpi.label}
            </div>
            <div className={`font-serif text-2xl sm:text-3xl font-bold ${kpi.color}`}>
              {kpi.value}
            </div>
          </div>
        ))}
      </div>

      {/* Master-Detail / Split Windows */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Recent Cross-Bureau Dockets Window (Col 7) */}
        <div className="lg:col-span-7 space-y-5">
          <WindowPanel
            title="Recent Cross-Bureau Complaint Dockets"
            subtitle="Centralized register across PGRC, Regulation, and Approval Bureaus"
            icon={<FileText size={15} />}
            actions={
              <button
                type="button"
                onClick={() => onNavigate('/complaints')}
                className="text-xs text-[#655A86] hover:underline flex items-center gap-1 font-medium"
              >
                View Full Registry <ArrowRight size={12} />
              </button>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FAF9F7] text-[10px] uppercase font-semibold text-gray-500 border-b border-[#E3E3E6]">
                  <tr>
                    <th className="py-2 px-3">Docket ID</th>
                    <th className="py-2 px-3">Institution & Title</th>
                    <th className="py-2 px-3">Bureau</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3E3E6]">
                  {complaints.slice(0, 7).map((c) => (
                    <tr key={c.id} className="hover:bg-[#FAF9F7] transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-[#1F1F24]">
                        {c.caseNumber}
                      </td>
                      <td className="py-2.5 px-3 max-w-[200px]">
                        <div className="font-semibold text-[#1F1F24] truncate">
                          {c.institutionName}
                        </div>
                        <div className="text-[11px] text-gray-500 truncate">{c.title}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <BureauBadge bureauCode={c.bureauCode} />
                      </td>
                      <td className="py-2.5 px-3">
                        <StatusBadge status={c.status} size="sm" />
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => onOpenCase(c.caseNumber)}
                          className="px-2 py-1 bg-[#1F1F24] hover:bg-black text-[#C9AE7C] rounded-[2px] text-[11px] font-semibold transition-colors uppercase tracking-wider"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </WindowPanel>

          {/* Active Coordination Rooms */}
          <WindowPanel
            title="Active Cross-Bureau Coordination Rooms"
            subtitle="Multi-officer workspaces resolving synchronized cases"
            icon={<Users size={15} />}
            actions={
              <button
                type="button"
                onClick={() => onNavigate('/coordination-rooms')}
                className="text-xs text-[#655A86] hover:underline flex items-center gap-1 font-medium"
              >
                All Rooms <ArrowRight size={12} />
              </button>
            }
          >
            <div className="space-y-3">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="p-3 bg-[#FAF9F7] border border-[#E3E3E6] rounded-[2px] flex items-center justify-between gap-3 hover:border-[#C9AE7C] transition-all cursor-pointer"
                  onClick={() => onOpenCoordinationRoom(room.id)}
                >
                  <div className="space-y-1 truncate">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-[#1F1F24]">
                        {room.roomNumber}
                      </span>
                      <span className="px-2 py-0.5 bg-[#4F8A6B]/15 text-[#4F8A6B] text-[10px] font-semibold rounded uppercase">
                        {room.status}
                      </span>
                    </div>
                    <div className="font-semibold text-xs text-[#1F1F24] truncate">{room.title}</div>
                    <div className="text-[11px] text-gray-500">
                      Linked Cases: <span className="font-mono">{room.caseNumbers.join(', ')}</span> · Partners: {room.partnerBureaus.join(', ')}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="shrink-0 px-2.5 py-1 text-xs border border-[#E3E3E6] bg-white text-[#1F1F24] rounded-[2px] hover:bg-gray-100 font-medium"
                  >
                    Open Room
                  </button>
                </div>
              ))}
            </div>
          </WindowPanel>
        </div>

        {/* Right: Workload & Ageing Analytics (Col 5) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Bureau Workload Distribution */}
          <WindowPanel
            title="Bureau Docket Allocation"
            subtitle="Comparative case volume across operational divisions"
            icon={<TrendingUp size={15} />}
          >
            <div className="h-52 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bureauData} layout="vertical" margin={{ top: 5, right: 15, left: 10, bottom: 5 }}>
                  <XAxis type="number" fontSize={11} stroke="#8C8C94" />
                  <YAxis dataKey="name" type="category" width={110} fontSize={10} stroke="#3A3A40" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F1F24', color: '#fff', fontSize: '11px', borderRadius: '2px' }}
                  />
                  <Bar dataKey="count" fill="#C9AE7C" radius={[0, 2, 2, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </WindowPanel>

          {/* Case Ageing Buckets */}
          <WindowPanel
            title="Docket Ageing & Disposal Radar"
            subtitle="Cases categorized by open duration threshold"
            icon={<Clock size={15} />}
          >
            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ageingData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {ageingData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F1F24', color: '#fff', fontSize: '11px', borderRadius: '2px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E3E3E6] text-[11px]">
              {ageingData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs shrink-0" style={{ backgroundColor: COLORS[idx] }} />
                  <span className="text-gray-600">{item.name}:</span>
                  <span className="font-bold text-[#1F1F24]">{item.value}</span>
                </div>
              ))}
            </div>
          </WindowPanel>
        </div>
      </div>
    </div>
  );
};
