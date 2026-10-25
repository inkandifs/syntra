import React, { useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  User,
  Building2,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Share2,
  ArrowRight,
  Shield,
  Layers,
  History,
  X,
  Send,
  Download,
  AlertCircle,
} from 'lucide-react';
import { db } from '../services/db';
import { Complaint, ComplaintStatus, AuditEvent, CaseRelationship } from '../types';
import { WindowPanel } from '../components/common/WindowPanel';
import { StatusBadge, PriorityBadge, BureauBadge } from '../components/common/StatusBadge';
import { checkOverlapForCase, OverlapMatch } from '../services/overlapEngine';
import { OverlapBanner } from '../components/common/OverlapBanner';
import { useAuth } from '../context/AuthContext';

interface CaseDetailPageProps {
  caseNumber: string;
  onClose: () => void;
  onOpenRelatedCase?: (caseNumber: string) => void;
  onOpenCoordinationRoom?: (roomId: string) => void;
  onOpenCaseGraph?: () => void;
}

export const CaseDetailPage: React.FC<CaseDetailPageProps> = ({
  caseNumber,
  onClose,
  onOpenRelatedCase,
  onOpenCoordinationRoom,
  onOpenCaseGraph,
}) => {
  const { currentUser, hasPermission } = useAuth();
  const [complaint, setComplaint] = useState<Complaint | undefined>(
    db.getComplaintById(caseNumber)
  );
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'evidence' | 'overlaps'>('overview');
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('Investigation');
  const [statusRemarks, setStatusRemarks] = useState('');
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [overlapMatches, setOverlapMatches] = useState<OverlapMatch[]>([]);

  useEffect(() => {
    const target = db.getComplaintById(caseNumber);
    setComplaint(target);

    if (target) {
      setAuditEvents(
        db.getAuditEvents().filter((e) => e.caseNumber === caseNumber || e.caseId === target.id)
      );
      setOverlapMatches(checkOverlapForCase(target));
    }

    const unsub = db.subscribe(() => {
      const updated = db.getComplaintById(caseNumber);
      setComplaint(updated);
      if (updated) {
        setAuditEvents(
          db.getAuditEvents().filter((e) => e.caseNumber === caseNumber || e.caseId === updated.id)
        );
        setOverlapMatches(checkOverlapForCase(updated));
      }
    });
    return unsub;
  }, [caseNumber]);

  if (!complaint) {
    return (
      <div className="p-8 text-center space-y-3 bg-white rounded border border-[#E3E3E6]">
        <AlertCircle size={32} className="mx-auto text-gray-400" />
        <p className="text-sm text-gray-600">Case Docket "{caseNumber}" not found in repository.</p>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-1.5 bg-[#1F1F24] text-[#C9AE7C] text-xs font-semibold rounded uppercase"
        >
          Return to Registry
        </button>
      </div>
    );
  }

  const formatIST = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return isoString;
    }
  };

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusRemarks.trim()) return;

    db.updateComplaint(
      complaint.id,
      {
        status: newStatus,
        lastAction: statusRemarks,
        nextActionRequired:
          newStatus === 'Resolved' ? 'Archive case file' : 'Await verification from respondent',
      },
      currentUser?.name || 'Officer',
      currentUser?.designation || 'Bureau Officer'
    );

    setStatusModalOpen(false);
    setStatusRemarks('');
  };

  const stages: ComplaintStatus[] = [
    'Received',
    'Under Review',
    'Assigned',
    'Investigation',
    'Coordination Required',
    'Resolved',
    'Closed',
  ];

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-[#E3E3E6] rounded-[4px] p-3 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-gray-500 hover:text-[#1F1F24] font-medium"
          >
            ← Back to List
          </button>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-base text-[#1F1F24]">
              {complaint.caseNumber}
            </span>
            <BureauBadge bureauCode={complaint.bureauCode} />
            <StatusBadge status={complaint.status} />
            <PriorityBadge priority={complaint.priority} />
            {complaint.isOverdue && (
              <span className="px-2 py-0.5 bg-[#B5524A] text-white text-[10px] font-bold rounded">
                OVERDUE
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasPermission('update_case_status') && (
            <button
              type="button"
              onClick={() => {
                setNewStatus(complaint.status);
                setStatusModalOpen(true);
              }}
              className="px-3 py-1.5 bg-[#C9AE7C] hover:bg-[#B39358] text-[#1F1F24] text-xs font-bold uppercase tracking-wider rounded-[2px] transition-colors"
            >
              Transition Status
            </button>
          )}

          {onOpenCaseGraph && (
            <button
              type="button"
              onClick={onOpenCaseGraph}
              className="px-3 py-1.5 bg-[#1F1F24] hover:bg-black text-[#C9AE7C] text-xs font-bold uppercase tracking-wider rounded-[2px] transition-colors flex items-center gap-1.5"
            >
              <Share2 size={13} />
              <span>Explore on CaseGraph</span>
            </button>
          )}
        </div>
      </div>

      {/* Overlap Banner if detected */}
      {overlapMatches.length > 0 && (
        <OverlapBanner
          currentCaseNumber={complaint.caseNumber}
          matches={overlapMatches}
          onOpenCase={onOpenRelatedCase}
          onOpenCoordinationRoom={onOpenCoordinationRoom}
        />
      )}

      {/* Structured Progress Stepper */}
      <div className="bg-white border border-[#E3E3E6] rounded-[4px] p-4 shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[650px] relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#E3E3E6] -translate-y-1/2 z-0" />
          {stages.map((st, idx) => {
            const currentIdx = stages.indexOf(complaint.status);
            const isCompleted = idx <= currentIdx;
            const isCurrent = idx === currentIdx;

            return (
              <div key={st} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    isCurrent
                      ? 'bg-[#C9AE7C] text-[#1F1F24] ring-4 ring-[#C9AE7C]/30'
                      : isCompleted
                      ? 'bg-[#4F8A6B] text-white'
                      : 'bg-white border-2 border-gray-300 text-gray-400'
                  }`}
                >
                  {isCompleted && !isCurrent ? '✓' : idx + 1}
                </div>
                <span
                  className={`text-[10px] uppercase tracking-wider mt-1.5 font-semibold ${
                    isCurrent ? 'text-[#8C6D2E]' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                  }`}
                >
                  {st}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E3E3E6] text-xs font-medium bg-white px-4 rounded-t-[4px]">
        {[
          { id: 'overview', label: 'Case Summary' },
          { id: 'timeline', label: `Decision Trail & Timeline (${auditEvents.length})` },
          { id: 'overlaps', label: `Cross-Bureau Overlaps (${overlapMatches.length})` },
          { id: 'evidence', label: `Documentary Evidence (${complaint.evidence.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3 px-4 border-b-2 font-semibold uppercase tracking-wider transition-colors ${
              activeTab === tab.id
                ? 'border-[#C9AE7C] text-[#1F1F24]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Details (Col 8) */}
          <div className="lg:col-span-8 space-y-4">
            <WindowPanel
              title={complaint.title}
              subtitle={`Registered under ${complaint.category}`}
              icon={<FileText size={15} />}
            >
              <div className="space-y-4 text-xs text-[#3A3A40] leading-relaxed">
                <div>
                  <h4 className="text-[11px] uppercase font-bold text-gray-500 tracking-wider mb-1">
                    Allegation Details
                  </h4>
                  <p className="bg-[#FAF9F7] border border-[#E3E3E6] rounded-[2px] p-3 text-xs leading-relaxed">
                    {complaint.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E3E3E6]">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500">
                      Last Action Logged
                    </span>
                    <p className="font-medium text-[#1F1F24] mt-0.5">{complaint.lastAction}</p>
                    <span className="text-[10px] text-gray-400 font-mono">
                      Timestamp: {formatIST(complaint.lastActionDate)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500">
                      Next Regulatory Step
                    </span>
                    <p className="font-medium text-[#1F1F24] mt-0.5">
                      {complaint.nextActionRequired}
                    </p>
                    <span className="text-[10px] text-gray-400 font-mono">
                      Target Disposal: {new Date(complaint.expectedDisposalDate).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </WindowPanel>
          </div>

          {/* Right Meta Column (Col 4) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Institution Profile Card */}
            <WindowPanel
              title="Target Institution"
              subtitle="AICTE Registry Node"
              icon={<Building2 size={15} />}
            >
              <div className="space-y-2 text-xs">
                <div className="font-bold text-sm text-[#1F1F24]">
                  {complaint.institutionName}
                </div>
                <div className="text-[11px] text-gray-600">
                  Permanent ID: <span className="font-mono font-bold text-[#1F1F24]">{complaint.institutionPermanentId}</span>
                </div>
                <div className="text-[11px] text-gray-600">
                  State / Region: <span className="font-semibold">{complaint.state}</span> ({complaint.region} Region)
                </div>
              </div>
            </WindowPanel>

            {/* Officer & Complainant Meta */}
            <WindowPanel
              title="Procedural Metadata"
              subtitle="Assigned handlers"
              icon={<User size={15} />}
            >
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-500">
                    Assigned Officer
                  </span>
                  <div className="font-semibold text-[#1F1F24]">{complaint.assignedOfficerName}</div>
                  <div className="text-[11px] text-gray-500">{complaint.bureauName}</div>
                </div>

                <div className="pt-2 border-t border-[#E3E3E6]">
                  <span className="text-[10px] uppercase font-bold text-gray-500">
                    Filing Complainant
                  </span>
                  <div className="font-semibold text-[#1F1F24]">{complaint.complainantName}</div>
                  <div className="text-[11px] text-gray-500">
                    Category: {complaint.complainantType} · {complaint.complainantEmail}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E3E3E6]">
                  <span className="text-[10px] uppercase font-bold text-gray-500">
                    Filing Timestamp
                  </span>
                  <div className="font-mono text-[11px] text-[#1F1F24]">
                    {formatIST(complaint.dateReceived)}
                  </div>
                </div>
              </div>
            </WindowPanel>
          </div>
        </div>
      )}

      {/* Tab 2: Decision Trail & Timeline */}
      {activeTab === 'timeline' && (
        <WindowPanel
          title="Regulatory Decision Trail (Audit Log)"
          subtitle="Chronological append-only record of all procedural decisions & AI suggestions"
          icon={<History size={15} />}
        >
          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E3E3E6]">
            {auditEvents.map((evt) => (
              <div key={evt.id} className="relative text-xs space-y-1">
                <div
                  className={`absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full border-2 bg-white ${
                    evt.isAiSuggested
                      ? 'border-[#C9AE7C] bg-[#FAF6EE]'
                      : 'border-[#655A86] bg-white'
                  }`}
                />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#1F1F24]">{evt.eventType}</span>
                    {evt.isAiSuggested ? (
                      <span className="px-1.5 py-0.2 bg-[#FAF6EE] text-[#8C6D2E] border border-[#C9AE7C] text-[9px] font-bold rounded">
                        AI SUGGESTION
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.2 bg-[#4F8A6B]/10 text-[#4F8A6B] border border-[#4F8A6B]/30 text-[9px] font-bold rounded">
                        OFFICER DECISION
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-gray-400">
                    {formatIST(evt.timestamp)}
                  </span>
                </div>
                <p className="text-gray-700 text-xs">{evt.details}</p>
                <div className="text-[10px] text-gray-500 font-mono">
                  Actor: <strong className="text-gray-700">{evt.actorName}</strong> ({evt.actorRole})
                </div>
              </div>
            ))}
          </div>
        </WindowPanel>
      )}

      {/* Tab 3: Overlaps */}
      {activeTab === 'overlaps' && (
        <div className="space-y-4">
          <div className="text-xs text-gray-600 bg-white p-3 rounded border border-[#E3E3E6]">
            SYNTRA continuously correlates this docket against all registered complaints across AICTE bureaus.
          </div>
          {overlapMatches.map((match, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#E3E3E6] rounded-[4px] p-4 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-[#1F1F24]">
                    {match.candidateCase.caseNumber}
                  </span>
                  <BureauBadge bureauCode={match.candidateCase.bureauCode} />
                  <StatusBadge status={match.candidateCase.status} size="sm" />
                </div>
                <span className="px-2 py-0.5 bg-[#C9AE7C]/20 border border-[#C9AE7C] text-[#8C6D2E] font-mono text-xs font-bold rounded">
                  Match Score: {match.score}%
                </span>
              </div>
              <div className="font-semibold text-xs text-[#1F1F24]">
                {match.candidateCase.title}
              </div>
              <div className="text-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-500">
                  Identified Matching Drivers:
                </span>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-gray-700">
                  {match.reasons.map((r, ri) => (
                    <li key={ri}>{r}</li>
                  ))}
                </ul>
              </div>
              {onOpenRelatedCase && (
                <div className="flex justify-end pt-2 border-t border-[#E3E3E6]">
                  <button
                    type="button"
                    onClick={() => onOpenRelatedCase(match.candidateCase.caseNumber)}
                    className="px-3 py-1 bg-[#1F1F24] text-[#C9AE7C] text-xs font-semibold rounded uppercase"
                  >
                    Inspect Candidate Docket
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Evidence */}
      {activeTab === 'evidence' && (
        <WindowPanel
          title="Documentary Evidence Files"
          subtitle="Official affidavits, invoices, and inspection records"
          icon={<FileText size={15} />}
        >
          {complaint.evidence.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-500">
              No supplementary evidence files attached to this docket.
            </div>
          ) : (
            <div className="space-y-2">
              {complaint.evidence.map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center justify-between p-3 bg-[#FAF9F7] border border-[#E3E3E6] rounded-[2px] text-xs"
                >
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-[#655A86]" />
                    <div>
                      <div className="font-mono font-medium text-[#1F1F24]">{ev.fileName}</div>
                      <div className="text-[10px] text-gray-500">
                        Uploaded by: {ev.uploadedBy} · {ev.fileSize}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert(`Simulated download of ${ev.fileName}`)}
                    className="p-1.5 border border-[#E3E3E6] rounded hover:bg-gray-100 text-gray-700"
                    title="Download evidence"
                  >
                    <Download size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </WindowPanel>
      )}

      {/* Transition Status Modal */}
      {statusModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[4px] border border-[#E3E3E6] max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E3E3E6]">
              <h3 className="font-serif font-bold text-sm text-[#1F1F24]">
                Transition Case Status: {complaint.caseNumber}
              </h3>
              <button
                type="button"
                onClick={() => setStatusModalOpen(false)}
                className="text-gray-400 hover:text-black"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">New Workflow Stage</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                  className="w-full bg-[#FAF9F7] border border-[#E3E3E6] rounded-[2px] p-2 text-xs"
                >
                  <option value="Under Review">Under Review</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Investigation">Investigation</option>
                  <option value="Coordination Required">Coordination Required</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                  <option value="Escalated">Escalated</option>
                  <option value="Transferred">Transferred</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Official Action Remarks / Rationale *
                </label>
                <textarea
                  rows={3}
                  value={statusRemarks}
                  onChange={(e) => setStatusRemarks(e.target.value)}
                  required
                  placeholder="Detail the regulatory justification or inquiry findings..."
                  className="w-full bg-[#FAF9F7] border border-[#E3E3E6] rounded-[2px] p-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E3E3E6]">
                <button
                  type="button"
                  onClick={() => setStatusModalOpen(false)}
                  className="px-3 py-1.5 border border-[#E3E3E6] text-xs rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#C9AE7C] hover:bg-[#B39358] text-[#1F1F24] font-bold text-xs uppercase tracking-wider rounded"
                >
                  Commit Status Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
