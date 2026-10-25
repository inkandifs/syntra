import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Users,
  Share2,
  ExternalLink,
  ArrowRight,
  Filter,
  Sparkles,
} from 'lucide-react';
import { db } from '../services/db';
import { CaseRelationship, Complaint } from '../types';
import { WindowPanel } from '../components/common/WindowPanel';
import { BureauBadge } from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';

interface OverlapAlertsPageProps {
  onOpenCase: (caseNumber: string) => void;
  onOpenCoordinationRoom: (roomId: string) => void;
  onOpenCaseGraph: (instId?: string) => void;
}

export const OverlapAlertsPage: React.FC<OverlapAlertsPageProps> = ({
  onOpenCase,
  onOpenCoordinationRoom,
  onOpenCaseGraph,
}) => {
  const { currentUser } = useAuth();
  const [relationships, setRelationships] = useState<CaseRelationship[]>([]);
  const [activeTab, setActiveTab] = useState<'suggested' | 'confirmed' | 'dismissed'>('suggested');

  useEffect(() => {
    setRelationships(db.getRelationships());
    const unsub = db.subscribe((state) => {
      setRelationships(state.relationships);
    });
    return unsub;
  }, []);

  const filtered = relationships.filter((r) => r.status === activeTab);

  const handleConfirm = (rel: CaseRelationship) => {
    const actorName = currentUser?.name || 'Authorized Officer';
    db.updateRelationshipStatus(rel.id, 'confirmed', actorName, 'Confirmed via Overlap Alerts console');
  };

  const handleDismiss = (rel: CaseRelationship) => {
    const actorName = currentUser?.name || 'Authorized Officer';
    db.updateRelationshipStatus(rel.id, 'dismissed', actorName, 'Dismissed by officer');
  };

  const handleCreateRoom = (rel: CaseRelationship) => {
    const actorName = currentUser?.name || 'Authorized Officer';
    const room = db.createRoom(
      {
        title: `Joint Scrutiny: ${rel.institutionName}`,
        institutionId: rel.institutionId,
        institutionName: rel.institutionName,
        leadBureau: rel.bureauA,
        partnerBureaus: [rel.bureauA, rel.bureauB],
        caseIds: [rel.sourceCaseId, rel.targetCaseId],
        caseNumbers: [rel.sourceCaseNumber, rel.targetCaseNumber],
        officerIds: [currentUser?.id || 'user-pgrc'],
        status: 'Active',
      },
      actorName
    );

    db.createTask(
      {
        roomId: room.id,
        title: `Reconcile findings between ${rel.sourceCaseNumber} and ${rel.targetCaseNumber}`,
        assigneeName: actorName,
        bureauCode: rel.bureauA,
        dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0],
        status: 'Pending',
        priority: 'High',
      },
      actorName
    );

    // Also mark relationship as confirmed if it wasn't
    if (rel.status !== 'confirmed') {
      db.updateRelationshipStatus(rel.id, 'confirmed', actorName, 'Coordination room created');
    }

    onOpenCoordinationRoom(room.id);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E3E3E6]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#1F1F24]">
              Cross-Bureau Overlap Intelligence
            </h1>
            <span className="px-2 py-0.5 bg-[#FAF6EE] border border-[#C9AE7C] text-[#8C6D2E] text-xs font-bold rounded">
              SIH26264 Core Engine
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Deterministic multi-factor matching across AICTE bureaus. Preventing duplicate investigations and contradictory regulatory orders.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E3E3E6] text-xs font-semibold bg-white px-4 rounded-t-[4px]">
        {[
          { id: 'suggested', label: `Pending Officer Review (${relationships.filter((r) => r.status === 'suggested').length})` },
          { id: 'confirmed', label: `Confirmed Overlaps (${relationships.filter((r) => r.status === 'confirmed').length})` },
          { id: 'dismissed', label: `Dismissed (${relationships.filter((r) => r.status === 'dismissed').length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3 px-4 border-b-2 uppercase tracking-wider transition-colors ${
              activeTab === tab.id
                ? 'border-[#C9AE7C] text-[#1F1F24]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alerts Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-10 text-center bg-white border border-[#E3E3E6] rounded-[4px] text-xs text-gray-500">
            No overlap alerts in this view.
          </div>
        ) : (
          filtered.map((rel) => (
            <div
              key={rel.id}
              className="bg-white border-2 border-[#C9AE7C]/60 rounded-[4px] p-4 shadow-xs space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#E3E3E6]">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C6D2E] font-bold">
                    Target Institution:
                  </span>
                  <h3 className="font-serif font-bold text-base text-[#1F1F24]">
                    {rel.institutionName}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-[#FAF6EE] border border-[#C9AE7C] text-[#8C6D2E] font-mono text-xs font-bold rounded">
                    Match Confidence: {rel.matchScore}%
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-semibold uppercase rounded ${
                      rel.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : rel.status === 'suggested'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {rel.status}
                  </span>
                </div>
              </div>

              {/* Connected Cases Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-[#FAF9F7] border border-[#E3E3E6] rounded-[2px] space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#1F1F24]">
                      {rel.sourceCaseNumber}
                    </span>
                    <BureauBadge bureauCode={rel.bureauA} />
                  </div>
                  <div className="text-[11px] text-gray-600">Primary Registered Docket</div>
                  <button
                    type="button"
                    onClick={() => onOpenCase(rel.sourceCaseNumber)}
                    className="text-[11px] text-[#655A86] hover:underline font-medium flex items-center gap-1 pt-1"
                  >
                    <span>View Docket</span> <ArrowRight size={11} />
                  </button>
                </div>

                <div className="p-3 bg-[#FAF9F7] border border-[#E3E3E6] rounded-[2px] space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#1F1F24]">
                      {rel.targetCaseNumber}
                    </span>
                    <BureauBadge bureauCode={rel.bureauB} />
                  </div>
                  <div className="text-[11px] text-gray-600">Correlated Cross-Bureau Docket</div>
                  <button
                    type="button"
                    onClick={() => onOpenCase(rel.targetCaseNumber)}
                    className="text-[11px] text-[#655A86] hover:underline font-medium flex items-center gap-1 pt-1"
                  >
                    <span>View Docket</span> <ArrowRight size={11} />
                  </button>
                </div>
              </div>

              {/* Matching Drivers */}
              <div className="text-xs space-y-1 bg-[#FAF6EE]/50 p-3 rounded border border-[#C9AE7C]/30">
                <div className="text-[10px] uppercase font-bold text-[#8C6D2E] tracking-wider">
                  Algorithmic Correlation Drivers:
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-gray-700">
                  {rel.reasons.map((r, ri) => (
                    <li key={ri} className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8C6D2E] mt-1 shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E3E3E6]">
                <div className="text-[10px] text-gray-500 font-mono">
                  {rel.confirmedBy ? `Confirmed by: ${rel.confirmedBy}` : 'Pending officer verification'}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenCaseGraph(rel.institutionId)}
                    className="px-3 py-1 bg-white border border-[#E3E3E6] hover:bg-gray-100 text-xs font-semibold rounded uppercase flex items-center gap-1 text-gray-700"
                  >
                    <Share2 size={12} />
                    <span>View on CaseGraph</span>
                  </button>

                  {rel.status === 'suggested' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleDismiss(rel)}
                        className="px-3 py-1 bg-white border border-[#E3E3E6] hover:bg-red-50 text-xs font-semibold rounded uppercase text-red-600"
                      >
                        Dismiss
                      </button>
                      <button
                        type="button"
                        onClick={() => handleConfirm(rel)}
                        className="px-3 py-1 bg-[#4F8A6B] hover:bg-[#427359] text-white text-xs font-bold rounded uppercase"
                      >
                        Confirm Overlap
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => handleCreateRoom(rel)}
                    className="px-3.5 py-1 bg-[#1F1F24] hover:bg-black text-[#C9AE7C] text-xs font-bold rounded uppercase flex items-center gap-1.5"
                  >
                    <Users size={12} />
                    <span>Open Coordination Room</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
