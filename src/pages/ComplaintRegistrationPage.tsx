import React, { useState, useEffect } from 'react';
import {
  FileText,
  Building2,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Shield,
  ArrowRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { db } from '../services/db';
import { useAuth } from '../context/AuthContext';
import { ComplaintCategory, PriorityLevel, Complaint, Institution } from '../types';
import { WindowPanel } from '../components/common/WindowPanel';
import { checkOverlapForCase, OverlapMatch } from '../services/overlapEngine';
import { OverlapBanner } from '../components/common/OverlapBanner';

interface ComplaintRegistrationPageProps {
  onSuccessRegistered: (caseNumber: string) => void;
  prefillData?: any;
  onOpenCase?: (caseNumber: string) => void;
  onOpenCoordinationRoom?: (roomId: string) => void;
}

export const ComplaintRegistrationPage: React.FC<ComplaintRegistrationPageProps> = ({
  onSuccessRegistered,
  prefillData,
  onOpenCase,
  onOpenCoordinationRoom,
}) => {
  const { currentUser } = useAuth();
  const institutions = db.getInstitutions();

  // Form State
  const [selectedInstitutionId, setSelectedInstitutionId] = useState(
    prefillData?.institutionId || 'inst-1'
  );
  const [category, setCategory] = useState<ComplaintCategory>(
    prefillData?.category || 'Fee Irregularity'
  );
  const [title, setTitle] = useState(prefillData?.title || '');
  const [description, setDescription] = useState(prefillData?.description || '');
  const [bureauCode, setBureauCode] = useState<'PGRC' | 'RB' | 'AB' | 'ACAD' | 'RO'>(
    currentUser?.bureauCode || 'PGRC'
  );
  const [priority, setPriority] = useState<PriorityLevel>(prefillData?.priority || 'High');
  const [complainantName, setComplainantName] = useState(currentUser?.name || 'Rahul Verma');
  const [complainantEmail, setComplainantEmail] = useState(currentUser?.email || 'rahul.verma@example.in');
  const [complainantType, setComplainantType] = useState<'Student' | 'Parent' | 'Faculty' | 'Anonymous' | 'Citizen'>(
    'Student'
  );

  // Evidence upload mock
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string }[]>([
    { name: 'Fee_Receipt_Proof.pdf', size: '1.8 MB' },
  ]);

  // Submission result & Overlap check state
  const [submittedCase, setSubmittedCase] = useState<Complaint | null>(null);
  const [overlapMatches, setOverlapMatches] = useState<OverlapMatch[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle prefill updates if SYRA provided them
  useEffect(() => {
    if (prefillData) {
      if (prefillData.institutionName) {
        const found = institutions.find(
          (i) => i.name.toLowerCase().includes(prefillData.institutionName.toLowerCase())
        );
        if (found) setSelectedInstitutionId(found.id);
      }
      if (prefillData.category) setCategory(prefillData.category);
      if (prefillData.title) setTitle(prefillData.title);
      if (prefillData.description) setDescription(prefillData.description);
      if (prefillData.priority) setPriority(prefillData.priority);
      if (prefillData.bureau) {
        if (prefillData.bureau.includes('Regulation')) setBureauCode('RB');
        else if (prefillData.bureau.includes('PGRC')) setBureauCode('PGRC');
        else if (prefillData.bureau.includes('Approval')) setBureauCode('AB');
      }
    }
  }, [prefillData, institutions]);

  const selectedInst =
    institutions.find((i) => i.id === selectedInstitutionId) || institutions[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadedFiles((prev) => [
        ...prev,
        { name: file.name, size: `${(file.size / (1024 * 1024)).toFixed(1)} MB` },
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);

    const now = new Date();
    const expectedDisposal = new Date(now.getTime() + 30 * 24 * 3600 * 1000);

    const newComplaint = db.createComplaint({
      institutionId: selectedInst.id,
      institutionPermanentId: selectedInst.permanentId,
      institutionName: selectedInst.name,
      state: selectedInst.state,
      region: selectedInst.region,
      category,
      title,
      description,
      dateReceived: now.toISOString(),
      bureauCode,
      bureauName:
        bureauCode === 'PGRC'
          ? 'Public Grievance Redressal Cell'
          : bureauCode === 'RB'
          ? 'Regulation Bureau'
          : bureauCode === 'AB'
          ? 'Approval Bureau'
          : bureauCode === 'ACAD'
          ? 'Academic Bureau'
          : 'Regional Office',
      priority,
      status: 'Received',
      assignedOfficerId: currentUser?.id || 'off-1',
      assignedOfficerName: currentUser?.name || 'Anita Sharma',
      lastActionDate: now.toISOString(),
      lastAction: 'Initial docket intake recorded into SYNTRA repository.',
      nextActionRequired: 'Admissibility scrutiny and officer assignment.',
      expectedDisposalDate: expectedDisposal.toISOString(),
      complainantName,
      complainantEmail,
      complainantType,
      isOverdue: false,
      overlapFlag: false,
      evidence: uploadedFiles.map((f, i) => ({
        id: `ev-${Date.now()}-${i}`,
        fileName: f.name,
        fileSize: f.size,
        fileType: 'application/pdf',
        uploadedAt: now.toISOString(),
        uploadedBy: complainantName,
      })),
    });

    // Run Overlap Engine immediately
    const matches = checkOverlapForCase(newComplaint);

    if (matches.length > 0) {
      // Flag complaint as overlapping in DB
      db.updateComplaint(
        newComplaint.id,
        { overlapFlag: true },
        'SYRA Overlap Engine',
        'AI Intelligence System'
      );
      newComplaint.overlapFlag = true;

      // Auto-create suggested relationship in DB
      const topMatch = matches[0];
      db.addRelationship({
        sourceCaseId: newComplaint.id,
        sourceCaseNumber: newComplaint.caseNumber,
        targetCaseId: topMatch.candidateCase.id,
        targetCaseNumber: topMatch.candidateCase.caseNumber,
        institutionId: selectedInst.id,
        institutionName: selectedInst.name,
        bureauA: bureauCode,
        bureauB: topMatch.candidateCase.bureauCode,
        matchScore: topMatch.score,
        reasons: topMatch.reasons,
        status: 'suggested',
        notes: 'Algorithmically detected immediately upon complaint intake.',
      });
    }

    setSubmittedCase(newComplaint);
    setOverlapMatches(matches);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E3E3E6]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#1F1F24]">
              Complaint Docket Registration
            </h1>
            {prefillData && (
              <span className="px-2 py-0.5 bg-[#FAF6EE] border border-[#C9AE7C] text-[#8C6D2E] text-[10px] font-bold rounded flex items-center gap-1">
                <Sparkles size={11} /> Pre-filled by SYRA AI
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Lodge a structured regulatory grievance against an AICTE-approved technical institution.
          </p>
        </div>
      </div>

      {/* Post-Submission Success & Overlap View */}
      {submittedCase && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 border-2 border-[#4F8A6B] rounded-[4px] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#4F8A6B] font-bold text-sm">
                <CheckCircle2 size={18} />
                <span>Docket Successfully Registered: {submittedCase.caseNumber}</span>
              </div>
              <button
                type="button"
                onClick={() => onSuccessRegistered(submittedCase.caseNumber)}
                className="px-3 py-1 bg-[#1F1F24] hover:bg-black text-[#C9AE7C] text-xs font-semibold rounded-[2px] uppercase tracking-wider flex items-center gap-1"
              >
                <span>View Full Case File</span>
                <ArrowRight size={12} />
              </button>
            </div>
            <p className="text-xs text-gray-700">
              Your grievance has been permanently recorded in the SYNTRA repository and dispatched to{' '}
              <span className="font-semibold">{submittedCase.bureauName}</span>.
            </p>
          </div>

          {/* Overlap Banner if match identified */}
          {overlapMatches.length > 0 ? (
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#8C6D2E] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert size={15} />
                <span>Instant Overlap Intelligence Alert</span>
              </div>
              <OverlapBanner
                currentCaseNumber={submittedCase.caseNumber}
                matches={overlapMatches}
                onOpenCase={onOpenCase}
                onOpenCoordinationRoom={onOpenCoordinationRoom}
              />
            </div>
          ) : (
            <div className="p-3 bg-white border border-[#E3E3E6] rounded text-xs text-gray-600">
              No overlapping dockets detected at this time. Case will proceed through normal bureau intake.
            </div>
          )}
        </div>
      )}

      {/* Registration Form Window */}
      {!submittedCase && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <WindowPanel
            title="Institution & Grievance Particulars"
            subtitle="Accurate identification guarantees cross-bureau correlation"
            icon={<FileText size={16} />}
          >
            <div className="space-y-4 text-xs">
              {/* Institution Selector */}
              <div>
                <label className="block font-semibold text-[#1F1F24] mb-1">
                  Target Technical Institution (AICTE Master Registry) *
                </label>
                <select
                  value={selectedInstitutionId}
                  onChange={(e) => setSelectedInstitutionId(e.target.value)}
                  className="w-full bg-[#FAF9F7] border border-[#E3E3E6] rounded-[2px] p-2 text-xs text-[#1F1F24] focus:outline-none focus:border-[#C9AE7C] font-medium"
                >
                  {institutions.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name} — [ID: {inst.permanentId}, {inst.city}, {inst.state}]
                    </option>
                  ))}
                </select>
                <div className="mt-1 text-[11px] text-gray-500 flex items-center gap-2">
                  <span>AICTE Permanent ID: <strong className="font-mono text-[#1F1F24]">{selectedInst.permanentId}</strong></span>
                  <span>·</span>
                  <span>Region: <strong className="text-[#1F1F24]">{selectedInst.region}</strong></span>
                  <span>·</span>
                  <span>Current Status: <strong className="text-[#8C6D2E]">{selectedInst.status}</strong></span>
                </div>
              </div>

              {/* Category & Receiving Bureau */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#1F1F24] mb-1">
                    Grievance Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                    className="w-full bg-[#FAF9F7] border border-[#E3E3E6] rounded-[2px] p-2 text-xs text-[#1F1F24] focus:outline-none focus:border-[#C9AE7C]"
                  >
                    <option value="Fee Irregularity">Fee Irregularity</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Faculty & Staff">Faculty & Staff</option>
                    <option value="Admission">Admission</option>
                    <option value="Affiliation/Approval">Affiliation/Approval</option>
                    <option value="Harassment">Harassment</option>
                    <option value="Academic & Curriculum">Academic & Curriculum</option>
                    <option value="Other">Other Regulatory Matter</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#1F1F24] mb-1">
                    Receiving Bureau / Cell *
                  </label>
                  <select
                    value={bureauCode}
                    onChange={(e) => setBureauCode(e.target.value as any)}
                    className="w-full bg-[#FAF9F7] border border-[#E3E3E6] rounded-[2px] p-2 text-xs text-[#1F1F24] focus:outline-none focus:border-[#C9AE7C]"
                  >
                    <option value="PGRC">Public Grievance Redressal Cell (PGRC)</option>
                    <option value="RB">Regulation Bureau (RB)</option>
                    <option value="AB">Approval Bureau (AB)</option>
                    <option value="RO">Regional Office (RO)</option>
                    <option value="ACAD">Academic Bureau (ACAD)</option>
                  </select>
                </div>
              </div>

              {/* Priority & Complainant Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#1F1F24] mb-1">
                    Priority Assessment *
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                    className="w-full bg-[#FAF9F7] border border-[#E3E3E6] rounded-[2px] p-2 text-xs text-[#1F1F24] focus:outline-none focus:border-[#C9AE7C]"
                  >
                    <option value="Low">Low (Standard review)</option>
                    <option value="Medium">Medium (Normal priority)</option>
                    <option value="High">High (Potential severe violation)</option>
                    <option value="Urgent">Urgent (Immediate safety / harassment / systemic)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#1F1F24] mb-1">
                    Complainant Category
                  </label>
                  <select
                    value={complainantType}
                    onChange={(e) => setComplainantType(e.target.value as any)}
                    className="w-full bg-[#FAF9F7] border border-[#E3E3E6] rounded-[2px] p-2 text-xs text-[#1F1F24] focus:outline-none focus:border-[#C9AE7C]"
                  >
                    <option value="Student">Enrolled Student</option>
                    <option value="Parent">Parent / Guardian</option>
                    <option value="Faculty">Faculty / Staff Member</option>
                    <option value="Citizen">General Citizen / Whistleblower</option>
                    <option value="Anonymous">Anonymous Protected Informant</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block font-semibold text-[#1F1F24] mb-1">
                  Subject / Summary Headline *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Unauthorized fee collection during admission cycle"
                  className="w-full bg-[#FAF9F7] border border-[#E3E3E6] rounded-[2px] p-2 text-xs text-[#1F1F24] focus:outline-none focus:border-[#C9AE7C]"
                />
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block font-semibold text-[#1F1F24] mb-1">
                  Detailed Allegations & Factual Context *
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Provide concrete details including dates, amounts, specific departments, and persons involved..."
                  className="w-full bg-[#FAF9F7] border border-[#E3E3E6] rounded-[2px] p-2 text-xs text-[#1F1F24] focus:outline-none focus:border-[#C9AE7C] leading-relaxed"
                />
              </div>

              {/* Evidence Upload */}
              <div className="pt-2">
                <label className="block font-semibold text-[#1F1F24] mb-1">
                  Documentary Evidence Upload
                </label>
                <div className="border border-dashed border-[#C9AE7C] bg-[#FAF9F7] rounded-[2px] p-4 text-center">
                  <Upload size={20} className="mx-auto text-[#8C6D2E] mb-1.5" />
                  <label className="cursor-pointer">
                    <span className="text-xs text-[#655A86] hover:underline font-semibold">
                      Click to upload documentary evidence
                    </span>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg"
                    />
                  </label>
                  <p className="text-[10px] text-gray-500 mt-1">
                    Accepts PDF receipts, official circulars, inspection reports, fee slips (Max 10MB)
                  </p>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {uploadedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 bg-white border border-[#E3E3E6] rounded text-[11px]"
                      >
                        <span className="font-mono text-gray-700">{file.name}</span>
                        <span className="text-gray-400 font-mono text-[10px]">{file.size}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#E3E3E6]">
              <div className="text-[10px] text-gray-500 italic">
                * All submitted dockets immediately undergo automated cross-bureau overlap verification.
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !title.trim() || !description.trim()}
                className="px-5 py-2.5 bg-[#C9AE7C] hover:bg-[#B39358] text-[#1F1F24] font-bold text-xs uppercase tracking-wider rounded-[2px] shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <span>SUBMIT DOCKET & VERIFY OVERLAP</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </WindowPanel>
        </form>
      )}
    </div>
  );
};
