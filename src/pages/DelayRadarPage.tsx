import React, { useState, useMemo } from 'react';
import {
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Calendar,
  User,
  ExternalLink,
  Flame,
  CheckCircle,
} from 'lucide-react';
import { db } from '../services/db';
import { Complaint } from '../types';
import { WindowPanel } from '../components/common/WindowPanel';
import { StatusBadge, BureauBadge, PriorityBadge } from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';

interface DelayRadarPageProps {
  onOpenCase: (caseNumber: string) => void;
}

export const DelayRadarPage: React.FC<DelayRadarPageProps> = ({ onOpenCase }) => {
  const { currentUser } = useAuth();
  const allComplaints = db.getComplaints();
  const settings = db.getSettings();

  const [activeSeverity, setActiveSeverity] = useState<'all' | 'critical' | 'severe' | 'warning'>('all');

  // Compute DelayRadar items transparently
  const radarItems = useMemo(() => {
    const items: {
      complaint: Complaint;
      severity: 'critical' | 'severe' | 'warning';
      reasons: string[];
      daysDelayed: number;
    }[] = [];

    const now = Date.now();

    allComplaints.forEach((c) => {
      if (c.status === 'Resolved' || c.status === 'Closed') return;

      const disposalTime = new Date(c.expectedDisposalDate).getTime();
      const lastActionTime = new Date(c.lastActionDate).getTime();
      const daysSinceAction = Math.floor((now - lastActionTime) / (1000 * 3600 * 24));
      const daysPastDisposal = Math.floor((now - disposalTime) / (1000 * 3600 * 24));

      const reasons: string[] = [];
      let severity: 'critical' | 'severe' | 'warning' = 'warning';

      // Rule 1: Past Disposal Deadline
      if (daysPastDisposal > 0) {
        reasons.push(`Disposal window breached by ${daysPastDisposal} days`);
        severity = daysPastDisposal > 14 ? 'critical' : 'severe';
      }

      // Rule 2: Inactivity Threshold
      if (daysSinceAction >= settings.delayThresholdDays) {
        reasons.push(`Zero official actions logged for ${daysSinceAction} days (exceeds ${settings.delayThresholdDays}d threshold)`);
        if (severity !== 'critical') severity = 'severe';
      }

      // Rule 3: Coordination Stagnation
      if (c.status === 'Coordination Required' && daysSinceAction >= 7) {
        reasons.push('Joint bureau coordination pending response for > 7 days');
        if (severity === 'warning') severity = 'severe';
      }

      // Rule 4: Approaching deadline (< 5 days remaining)
      if (daysPastDisposal <= 0 && daysPastDisposal >= -5) {
        reasons.push(`Deadline approaching: ${Math.abs(daysPastDisposal)} days remaining`);
      }

      if (reasons.length > 0) {
        items.push({
          complaint: c,
          severity,
          reasons,
          daysDelayed: Math.max(daysPastDisposal, daysSinceAction),
        });
      }
    });

    return items.sort((a, b) => b.daysDelayed - a.daysDelayed);
  }, [allComplaints, settings]);

  const filteredItems = useMemo(() => {
    if (activeSeverity === 'all') return radarItems;
    return radarItems.filter((item) => item.severity === activeSeverity);
  }, [radarItems, activeSeverity]);

  const handleEscalate = (c: Complaint) => {
    db.updateComplaint(
      c.id,
      {
        status: 'Escalated',
        lastAction: 'DelayRadar automated escalation triggered due to inactivity breach.',
        isOverdue: true,
      },
      currentUser?.name || 'Officer',
      'System Monitor'
    );
    alert(`Case ${c.caseNumber} has been officially elevated to Escalated status.`);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E3E3E6]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#1F1F24]">
              DelayRadar Monitoring Engine
            </h1>
            <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs font-bold rounded">
              Rule-Based Alerts
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Transparent bottleneck detection: approaching deadlines, stagnant files, and unaddressed inter-bureau requests.
          </p>
        </div>
      </div>

      {/* Severity Filter Strip */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <button
          type="button"
          onClick={() => setActiveSeverity('all')}
          className={`px-3 py-1.5 rounded-[2px] font-semibold uppercase tracking-wider border ${
            activeSeverity === 'all'
              ? 'bg-[#1F1F24] text-[#C9AE7C] border-[#1F1F24]'
              : 'bg-white text-gray-700 border-[#E3E3E6] hover:bg-gray-100'
          }`}
        >
          All Warnings ({radarItems.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveSeverity('critical')}
          className={`px-3 py-1.5 rounded-[2px] font-semibold uppercase tracking-wider border ${
            activeSeverity === 'critical'
              ? 'bg-[#B5524A] text-white border-[#B5524A]'
              : 'bg-white text-gray-700 border-[#E3E3E6] hover:bg-gray-100'
          }`}
        >
          Critical ({radarItems.filter((i) => i.severity === 'critical').length})
        </button>
        <button
          type="button"
          onClick={() => setActiveSeverity('severe')}
          className={`px-3 py-1.5 rounded-[2px] font-semibold uppercase tracking-wider border ${
            activeSeverity === 'severe'
              ? 'bg-[#C9953A] text-white border-[#C9953A]'
              : 'bg-white text-gray-700 border-[#E3E3E6] hover:bg-gray-100'
          }`}
        >
          Severe ({radarItems.filter((i) => i.severity === 'severe').length})
        </button>
        <button
          type="button"
          onClick={() => setActiveSeverity('warning')}
          className={`px-3 py-1.5 rounded-[2px] font-semibold uppercase tracking-wider border ${
            activeSeverity === 'warning'
              ? 'bg-[#C9AE7C] text-[#1F1F24] border-[#C9AE7C]'
              : 'bg-white text-gray-700 border-[#E3E3E6] hover:bg-gray-100'
          }`}
        >
          Approaching ({radarItems.filter((i) => i.severity === 'warning').length})
        </button>
      </div>

      {/* Warning Cards List */}
      <div className="space-y-3">
        {filteredItems.map(({ complaint: c, severity, reasons, daysDelayed }) => (
          <div
            key={c.id}
            className={`bg-white rounded-[4px] p-4 border shadow-xs space-y-2.5 transition-all ${
              severity === 'critical'
                ? 'border-[#B5524A] border-l-4'
                : severity === 'severe'
                ? 'border-[#C9953A] border-l-4'
                : 'border-[#E3E3E6] border-l-4 border-l-[#C9AE7C]'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-[#1F1F24]">
                  {c.caseNumber}
                </span>
                <BureauBadge bureauCode={c.bureauCode} />
                <StatusBadge status={c.status} size="sm" />
                <PriorityBadge priority={c.priority} />
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                    severity === 'critical'
                      ? 'bg-red-100 text-red-800'
                      : severity === 'severe'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {severity} Alert
                </span>
                <span className="font-mono text-xs text-gray-500 font-semibold">
                  Lag: {daysDelayed} days
                </span>
              </div>
            </div>

            <div>
              <div className="font-semibold text-xs text-[#1F1F24]">{c.institutionName}</div>
              <div className="text-[11px] text-gray-600 truncate">{c.title}</div>
            </div>

            {/* Delay Drivers */}
            <div className="bg-[#FAF9F7] p-2.5 rounded border border-[#E3E3E6] text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                Transparent Trigger Factors:
              </span>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-gray-700">
                {reasons.map((r, ri) => (
                  <li key={ri}>{r}</li>
                ))}
              </ul>
            </div>

            {/* Officer & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E3E3E6] text-xs">
              <div className="text-[11px] text-gray-500">
                Assigned: <strong className="text-gray-700">{c.assignedOfficerName}</strong> · Target: {new Date(c.expectedDisposalDate).toLocaleDateString('en-IN')}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleEscalate(c)}
                  className="px-2.5 py-1 bg-red-50 border border-red-300 text-red-700 hover:bg-red-100 text-xs font-semibold rounded uppercase"
                >
                  Trigger Escalation
                </button>
                <button
                  type="button"
                  onClick={() => onOpenCase(c.caseNumber)}
                  className="px-3 py-1 bg-[#1F1F24] text-[#C9AE7C] hover:bg-black text-xs font-semibold rounded uppercase"
                >
                  Inspect File
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
