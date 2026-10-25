import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  Filter,
  Download,
  Sparkles,
  CheckCircle2,
  Calendar,
  User,
  Shield,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { db } from '../services/db';
import { AuditEvent } from '../types';
import { WindowPanel } from '../components/common/WindowPanel';

interface DecisionTrailPageProps {
  onOpenCase: (caseNumber: string) => void;
}

export const DecisionTrailPage: React.FC<DecisionTrailPageProps> = ({ onOpenCase }) => {
  const auditEvents = db.getAuditEvents();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [filterSource, setFilterSource] = useState<'all' | 'ai_only' | 'human_only'>('all');

  const filteredEvents = useMemo(() => {
    return auditEvents.filter((evt) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          evt.actorName.toLowerCase().includes(q) ||
          (evt.caseNumber && evt.caseNumber.toLowerCase().includes(q)) ||
          evt.details.toLowerCase().includes(q) ||
          evt.eventType.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (selectedType !== 'all' && evt.eventType !== selectedType) return false;

      if (filterSource === 'ai_only' && !evt.isAiSuggested) return false;
      if (filterSource === 'human_only' && evt.isAiSuggested) return false;

      return true;
    });
  }, [auditEvents, searchQuery, selectedType, filterSource]);

  const formatIST = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
    } catch {
      return isoString;
    }
  };

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Event Type', 'Case ID', 'Actor Name', 'Actor Role', 'Source', 'Details'];
    const rows = filteredEvents.map((e) => [
      `"${e.timestamp}"`,
      `"${e.eventType}"`,
      `"${e.caseNumber || 'N/A'}"`,
      `"${e.actorName}"`,
      `"${e.actorRole}"`,
      e.isAiSuggested ? 'AI Suggested' : 'Human Officer',
      `"${e.details.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `SYNTRA_Audit_Trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E3E3E6]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#1F1F24]">
              Regulatory Decision Trail & Audit Log
            </h1>
            <span className="px-2 py-0.5 bg-[#1F1F24] text-[#C9AE7C] text-xs font-mono font-bold rounded">
              Append-Only Ledger
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Cryptographically timestamped accountability trail distinguishing AI automated suggestions from officer-confirmed decisions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="px-3 py-1.5 bg-white border border-[#E3E3E6] hover:bg-gray-50 text-xs font-semibold rounded flex items-center gap-1.5 shadow-xs"
        >
          <Download size={13} />
          <span>Export Audit Log</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-[#E3E3E6] rounded-[4px] p-3 shadow-xs space-y-3">
        <div className="relative w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Case SYN-..., Officer Name, or specific action description..."
            className="w-full bg-[#FAF9F7] border border-[#E3E3E6] rounded-[2px] pl-9 pr-3 py-1.5 text-xs text-[#1F1F24] focus:outline-none focus:border-[#C9AE7C]"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <label className="text-[10px] uppercase font-bold text-gray-500">Event Class:</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-[#FAF9F7] border border-[#E3E3E6] rounded-[2px] p-1 text-xs text-[#1F1F24]"
            >
              <option value="all">All Events</option>
              <option value="Case Created">Case Created</option>
              <option value="Status Changed">Status Changed</option>
              <option value="Overlap Detected">Overlap Detected</option>
              <option value="Relationship Confirmed">Relationship Confirmed</option>
              <option value="Coordination Room Created">Coordination Room Created</option>
              <option value="AI Suggested Action">AI Suggested Action</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold text-gray-500 mr-1">Origin:</span>
            {[
              { id: 'all', label: 'All Records' },
              { id: 'human_only', label: 'Officer Decisions Only' },
              { id: 'ai_only', label: 'AI Suggestions Only' },
            ].map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => setFilterSource(chip.id as any)}
                className={`px-2.5 py-1 rounded-[2px] text-xs font-medium border ${
                  filterSource === chip.id
                    ? 'bg-[#1F1F24] text-[#C9AE7C] border-[#1F1F24]'
                    : 'bg-white text-gray-700 border-[#E3E3E6] hover:bg-gray-100'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Log Table Window */}
      <WindowPanel
        title="Historical Audit Log Entries"
        subtitle={`Total registered events: ${filteredEvents.length}`}
        icon={<History size={15} />}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF9F7] text-[10px] uppercase font-semibold text-gray-500 border-b border-[#E3E3E6]">
              <tr>
                <th className="py-2.5 px-3">Timestamp (IST)</th>
                <th className="py-2.5 px-3">Docket ID</th>
                <th className="py-2.5 px-3">Event Classification</th>
                <th className="py-2.5 px-3">Actor & Designation</th>
                <th className="py-2.5 px-3">Origin</th>
                <th className="py-2.5 px-3">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E3E6]">
              {filteredEvents.slice(0, 50).map((evt) => (
                <tr key={evt.id} className="hover:bg-[#FAF9F7] transition-colors">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-gray-500 whitespace-nowrap">
                    {formatIST(evt.timestamp)}
                  </td>
                  <td className="py-2.5 px-3">
                    {evt.caseNumber ? (
                      <button
                        type="button"
                        onClick={() => onOpenCase(evt.caseNumber!)}
                        className="font-mono font-bold text-[#655A86] hover:underline"
                      >
                        {evt.caseNumber}
                      </button>
                    ) : (
                      <span className="text-gray-400 font-mono">System</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-[#1F1F24]">
                    {evt.eventType}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <div className="font-semibold text-[#1F1F24]">{evt.actorName}</div>
                    <div className="text-[10px] text-gray-500">{evt.actorRole}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    {evt.isAiSuggested ? (
                      <span className="px-2 py-0.5 bg-[#FAF6EE] text-[#8C6D2E] border border-[#C9AE7C] text-[10px] font-bold rounded flex items-center gap-1 w-max">
                        <Sparkles size={10} /> AI SUGGESTED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold rounded flex items-center gap-1 w-max">
                        <CheckCircle2 size={10} /> HUMAN OFFICER
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 max-w-sm text-gray-700 leading-snug">
                    {evt.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </WindowPanel>
    </div>
  );
};
