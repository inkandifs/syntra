import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Users, ExternalLink, ArrowRight, ShieldAlert } from 'lucide-react';
import { OverlapMatch } from '../../services/overlapEngine';
import { db } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { BureauBadge, StatusBadge } from './StatusBadge';

interface OverlapBannerProps {
  currentCaseNumber: string;
  matches: OverlapMatch[];
  onOpenCase?: (caseNumber: string) => void;
  onOpenCoordinationRoom?: (roomId: string) => void;
  onRefresh?: () => void;
}

export const OverlapBanner: React.FC<OverlapBannerProps> = ({
  currentCaseNumber,
  matches,
  onOpenCase,
  onOpenCoordinationRoom,
  onRefresh,
}) => {
  const { currentUser } = useAuth();
  const [activeMatchIndex, setActiveMatchIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!matches || matches.length === 0) return null;

  const currentMatch = matches[activeMatchIndex] || matches[0];
  const { candidateCase, score, reasons, existingRelationship } = currentMatch;

  const handleConfirm = () => {
    setIsProcessing(true);
    const actorName = currentUser?.name || 'Authorized Officer';
    if (existingRelationship) {
      db.updateRelationshipStatus(existingRelationship.id, 'confirmed', actorName, 'Confirmed via Overlap Banner');
    } else {
      db.addRelationship({
        sourceCaseId: `case-${currentCaseNumber.replace('SYN-', '')}`,
        sourceCaseNumber: currentCaseNumber,
        targetCaseId: candidateCase.id,
        targetCaseNumber: candidateCase.caseNumber,
        institutionId: candidateCase.institutionId,
        institutionName: candidateCase.institutionName,
        bureauA: 'Active Bureau',
        bureauB: candidateCase.bureauCode,
        matchScore: score,
        reasons,
        status: 'confirmed',
        confirmedBy: actorName,
        confirmedAt: new Date().toISOString(),
      });
    }
    setIsProcessing(false);
    onRefresh?.();
  };

  const handleDismiss = () => {
    setIsProcessing(true);
    const actorName = currentUser?.name || 'Authorized Officer';
    if (existingRelationship) {
      db.updateRelationshipStatus(existingRelationship.id, 'dismissed', actorName, 'Dismissed: Not overlapping');
    }
    setIsProcessing(false);
    onRefresh?.();
  };

  const handleCreateRoom = () => {
    const actorName = currentUser?.name || 'Authorized Officer';
    const room = db.createRoom(
      {
        title: `Joint Scrutiny: ${candidateCase.institutionName}`,
        institutionId: candidateCase.institutionId,
        institutionName: candidateCase.institutionName,
        leadBureau: candidateCase.bureauCode,
        partnerBureaus: ['PGRC', 'RB'].includes(candidateCase.bureauCode) ? ['PGRC', 'RB'] : [candidateCase.bureauCode, 'PGRC'],
        caseIds: [`case-${currentCaseNumber.replace('SYN-', '')}`, candidateCase.id],
        caseNumbers: [currentCaseNumber, candidateCase.caseNumber],
        officerIds: [currentUser?.id || 'user-pgrc', candidateCase.assignedOfficerId],
        status: 'Active',
      },
      actorName
    );

    db.createTask(
      {
        roomId: room.id,
        title: `Joint review between ${currentCaseNumber} and ${candidateCase.caseNumber}`,
        assigneeName: candidateCase.assignedOfficerName,
        bureauCode: candidateCase.bureauCode,
        dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0],
        status: 'Pending',
        priority: 'High',
      },
      actorName
    );

    onOpenCoordinationRoom?.(room.id);
  };

  return (
    <div className="bg-[#FAF6EE] border-2 border-[#C9AE7C] rounded-[4px] p-4 shadow-sm mb-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#C9AE7C]/30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[2px] bg-[#C9AE7C] text-[#1F1F24] flex items-center justify-center shrink-0">
            <ShieldAlert size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#8C6D2E]">
                Overlap Intelligence
              </span>
              <span className="bg-[#C9AE7C]/20 border border-[#C9AE7C] text-[#8C6D2E] text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">
                Match Score: {score}%
              </span>
            </div>
            <h4 className="font-serif font-bold text-base text-[#1F1F24]">
              Potential Overlapping Cases – Coordination Required
            </h4>
          </div>
        </div>

        {matches.length > 1 && (
          <div className="flex items-center gap-1.5 text-xs text-[#3A3A40]">
            <span>{matches.length} candidates found:</span>
            {matches.map((m, idx) => (
              <button
                key={m.candidateCase.caseNumber}
                type="button"
                onClick={() => setActiveMatchIndex(idx)}
                className={`px-2 py-0.5 rounded-[2px] text-xs font-mono font-medium border ${
                  idx === activeMatchIndex
                    ? 'bg-[#1F1F24] text-[#C9AE7C] border-[#1F1F24]'
                    : 'bg-white text-[#3A3A40] border-[#E3E3E6] hover:bg-gray-100'
                }`}
              >
                {m.candidateCase.caseNumber}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Candidate Case Summary & Reasons */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-3">
        {/* Left: Matching reasons */}
        <div className="md:col-span-7 space-y-2">
          <div className="text-[11px] font-semibold text-[#3A3A40] uppercase tracking-wide">
            Algorithmically Identified Matching Reasons:
          </div>
          <ul className="space-y-1.5">
            {reasons.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-[#3A3A40]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8C6D2E] mt-1.5 shrink-0" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Candidate Case Snapshot */}
        <div className="md:col-span-5 bg-white border border-[#E3E3E6] rounded-[2px] p-3 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-sm text-[#1F1F24]">
              {candidateCase.caseNumber}
            </span>
            <div className="flex items-center gap-1.5">
              <BureauBadge bureauCode={candidateCase.bureauCode} />
              <StatusBadge status={candidateCase.status} size="sm" />
            </div>
          </div>
          <div className="font-medium text-[#1F1F24] line-clamp-1">{candidateCase.title}</div>
          <p className="text-[#3A3A40]/80 text-[11px] line-clamp-2">{candidateCase.description}</p>
          <div className="pt-1 flex items-center justify-between text-[11px] text-[#3A3A40]/70 border-t border-[#E3E3E6]">
            <span>Officer: {candidateCase.assignedOfficerName}</span>
            {onOpenCase && (
              <button
                type="button"
                onClick={() => onOpenCase(candidateCase.caseNumber)}
                className="text-[#655A86] hover:underline flex items-center gap-1 font-medium"
              >
                Inspect Docket <ArrowRight size={11} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#C9AE7C]/30">
        <div className="text-[11px] text-[#8C6D2E] italic">
          * SYNTRA is a decision-support platform. Case relationships must be verified by an authorized officer.
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleDismiss}
            className="px-3 py-1 text-xs uppercase tracking-wider font-semibold border border-[#E3E3E6] bg-white text-[#3A3A40] hover:bg-gray-100 rounded-[2px] transition-colors"
          >
            Dismiss Match
          </button>
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleConfirm}
            className="px-3 py-1 text-xs uppercase tracking-wider font-semibold border border-[#4F8A6B] bg-[#4F8A6B] text-white hover:bg-[#43755b] rounded-[2px] transition-colors"
          >
            Confirm Relationship
          </button>
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleCreateRoom}
            className="px-3.5 py-1 text-xs uppercase tracking-wider font-semibold border border-[#1F1F24] bg-[#1F1F24] text-[#C9AE7C] hover:bg-black rounded-[2px] transition-colors flex items-center gap-1.5"
          >
            <Users size={12} />
            Open Coordination Room
          </button>
        </div>
      </div>
    </div>
  );
};
