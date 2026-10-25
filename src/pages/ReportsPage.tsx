import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Filter,
  FileText,
  Building2,
  TrendingUp,
  PieChart as PieIcon,
} from 'lucide-react';
import { db } from '../services/db';
import { WindowPanel } from '../components/common/WindowPanel';
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
  Legend,
} from 'recharts';

interface ReportsPageProps {
  initialReportType?: string;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ initialReportType }) => {
  const [reportType, setReportType] = useState<string>(initialReportType || 'bureau_performance');
  const complaints = db.getComplaints();
  const institutions = db.getInstitutions();
  const relationships = db.getRelationships();

  // Bureau performance metrics
  const bureauMetrics = useMemo(() => {
    const map: Record<string, { total: number; resolved: number; overdue: number }> = {
      PGRC: { total: 0, resolved: 0, overdue: 0 },
      RB: { total: 0, resolved: 0, overdue: 0 },
      AB: { total: 0, resolved: 0, overdue: 0 },
      RO: { total: 0, resolved: 0, overdue: 0 },
      ACAD: { total: 0, resolved: 0, overdue: 0 },
    };

    complaints.forEach((c) => {
      if (map[c.bureauCode]) {
        map[c.bureauCode].total++;
        if (c.status === 'Resolved' || c.status === 'Closed') map[c.bureauCode].resolved++;
        if (c.isOverdue) map[c.bureauCode].overdue++;
      }
    });

    return Object.entries(map).map(([code, vals]) => ({
      bureau: code,
      total: vals.total,
      resolved: vals.resolved,
      overdue: vals.overdue,
      disposalRate: vals.total ? Math.round((vals.resolved / vals.total) * 100) : 0,
    }));
  }, [complaints]);

  // Region breakdown
  const regionMetrics = useMemo(() => {
    const map: Record<string, number> = {};
    complaints.forEach((c) => {
      const reg = c.region || 'Unknown';
      map[reg] = (map[reg] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [complaints]);

  const COLORS = ['#C9AE7C', '#655A86', '#4F8A6B', '#C9953A', '#4C6FA5', '#B5524A'];

  const handlePrint = () => {
    window.print();
  };

  const handleExportReportCSV = () => {
    const headers = ['Bureau', 'Total Dockets', 'Resolved', 'Overdue', 'Disposal Rate (%)'];
    const rows = bureauMetrics.map((b) => [
      b.bureau,
      b.total,
      b.resolved,
      b.overdue,
      `${b.disposalRate}%`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `SYNTRA_Report_${reportType}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 print:p-6 print:bg-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E3E3E6] print:border-b-2 print:border-black">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1F1F24]">
            Official Analytical Reports & Performance Digests
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time compliance digests computed from verified repository records.
          </p>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          <button
            type="button"
            onClick={handleExportReportCSV}
            className="px-3 py-1.5 bg-white border border-[#E3E3E6] hover:bg-gray-50 text-xs font-semibold rounded flex items-center gap-1.5 shadow-xs"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-1.5 bg-[#1F1F24] hover:bg-black text-[#C9AE7C] text-xs font-semibold rounded flex items-center gap-1.5 uppercase tracking-wider"
          >
            <Printer size={13} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Selector Strip (Hidden in print) */}
      <div className="flex flex-wrap items-center gap-2 text-xs print:hidden">
        {[
          { id: 'bureau_performance', label: 'Bureau Workload & Disposal' },
          { id: 'regional_distribution', label: 'Regional Distribution' },
          { id: 'overlap_digest', label: 'Cross-Bureau Overlap Digest' },
          { id: 'pgrc_monthly', label: 'Monthly PGRC Redressal Digest' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setReportType(tab.id)}
            className={`px-3 py-1.5 rounded-[2px] font-semibold uppercase tracking-wider border ${
              reportType === tab.id
                ? 'bg-[#1F1F24] text-[#C9AE7C] border-[#1F1F24]'
                : 'bg-white text-gray-700 border-[#E3E3E6] hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report Content Window */}
      <div className="bg-white border border-[#E3E3E6] rounded-[4px] p-6 shadow-xs space-y-6">
        {/* Printable Letterhead Header */}
        <div className="border-b-2 border-[#1F1F24] pb-4 flex items-center justify-between">
          <div>
            <div className="font-serif font-bold text-lg text-[#1F1F24]">
              ALL INDIA COUNCIL FOR TECHNICAL EDUCATION (AICTE)
            </div>
            <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
              SYNTRA Complaint Intelligence & Coordination Directorate
            </div>
          </div>
          <div className="text-right text-xs font-mono text-gray-500">
            <div>Generated: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
            <div>Ref: SYN-REP-{new Date().getFullYear()}-088</div>
          </div>
        </div>

        {/* Visual Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-gray-600">
              Bureau Workload Comparison
            </h4>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bureauMetrics}>
                  <XAxis dataKey="bureau" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#1F1F24', color: '#fff', fontSize: '11px' }} />
                  <Bar dataKey="total" name="Total Dockets" fill="#C9AE7C" />
                  <Bar dataKey="resolved" name="Resolved" fill="#4F8A6B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-gray-600">
              Regional Case Proportion
            </h4>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={regionMetrics} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                    {regionMetrics.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1F1F24', color: '#fff', fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tabular Performance Digest */}
        <div className="space-y-3 pt-4 border-t border-[#E3E3E6]">
          <h4 className="font-serif font-bold text-sm text-[#1F1F24]">
            Bureau Disposal Performance Matrix
          </h4>
          <table className="w-full text-xs text-left border border-[#E3E3E6]">
            <thead className="bg-[#FAF9F7] text-[10px] uppercase font-bold text-gray-600 border-b border-[#E3E3E6]">
              <tr>
                <th className="py-2.5 px-3">Bureau / Cell</th>
                <th className="py-2.5 px-3">Total Dockets</th>
                <th className="py-2.5 px-3">Disposed</th>
                <th className="py-2.5 px-3">Overdue Lag</th>
                <th className="py-2.5 px-3 text-right">Disposal Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E3E6]">
              {bureauMetrics.map((m) => (
                <tr key={m.bureau} className="hover:bg-[#FAF9F7]">
                  <td className="py-2.5 px-3 font-semibold text-[#1F1F24]">{m.bureau}</td>
                  <td className="py-2.5 px-3">{m.total}</td>
                  <td className="py-2.5 px-3 text-[#4F8A6B] font-semibold">{m.resolved}</td>
                  <td className="py-2.5 px-3 text-[#B5524A] font-semibold">{m.overdue}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-[#8C6D2E]">
                    {m.disposalRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Official Footer Note */}
        <div className="text-[10px] text-gray-500 italic pt-4 border-t border-[#E3E3E6]">
          * This report is generated dynamically by SYNTRA. All figures are verified across active bureau dockets.
        </div>
      </div>
    </div>
  );
};
