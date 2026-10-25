import React, { useState, useMemo } from 'react';
import {
  Building2,
  Search,
  Filter,
  ExternalLink,
  MapPin,
  Mail,
  Phone,
  FileText,
  Share2,
  AlertTriangle,
  History,
  X,
  ChevronRight,
} from 'lucide-react';
import { db } from '../services/db';
import { Institution, Complaint } from '../types';
import { WindowPanel } from '../components/common/WindowPanel';
import { StatusBadge, BureauBadge } from '../components/common/StatusBadge';

interface InstitutionDirectoryPageProps {
  onOpenCase: (caseNumber: string) => void;
  onOpenCaseGraph: (institutionId: string) => void;
  selectedInstIdFromOutside?: string;
}

export const InstitutionDirectoryPage: React.FC<InstitutionDirectoryPageProps> = ({
  onOpenCase,
  onOpenCaseGraph,
  selectedInstIdFromOutside,
}) => {
  const institutions = db.getInstitutions();
  const allComplaints = db.getComplaints();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [activeModalInst, setActiveModalInst] = useState<Institution | null>(() => {
    if (selectedInstIdFromOutside) {
      return (
        institutions.find(
          (i) => i.id === selectedInstIdFromOutside || i.permanentId === selectedInstIdFromOutside
        ) || null
      );
    }
    return null;
  });

  const [modalTab, setModalTab] = useState<'overview' | 'complaints' | 'repeat' | 'contact'>('overview');

  const filteredInstitutions = useMemo(() => {
    return institutions.filter((inst) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          inst.name.toLowerCase().includes(q) ||
          inst.permanentId.toLowerCase().includes(q) ||
          inst.city.toLowerCase().includes(q) ||
          inst.state.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (selectedRegion !== 'all' && inst.region !== selectedRegion) return false;
      if (selectedType !== 'all' && inst.institutionType !== selectedType) return false;
      if (selectedStatus !== 'all' && inst.status !== selectedStatus) return false;
      return true;
    });
  }, [institutions, searchQuery, selectedRegion, selectedType, selectedStatus]);

  // Complaints for selected modal institution
  const modalComplaints = useMemo(() => {
    if (!activeModalInst) return [];
    return allComplaints.filter(
      (c) =>
        c.institutionId === activeModalInst.id ||
        c.institutionPermanentId === activeModalInst.permanentId ||
        c.institutionName.toLowerCase() === activeModalInst.name.toLowerCase()
    );
  }, [activeModalInst, allComplaints]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E3E3E6]">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1F1F24]">
            Institution Master Directory
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Authorized repository of AICTE-approved colleges, universities, and polytechnics.
          </p>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="bg-white border border-[#E3E3E6] rounded-[4px] p-3 shadow-xs space-y-3">
        <div className="relative w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Institution Name, AICTE Permanent ID (1-XXXX), City or State..."
            className="w-full bg-[#FAF9F7] border border-[#E3E3E6] rounded-[2px] pl-9 pr-3 py-1.5 text-xs text-[#1F1F24] focus:outline-none focus:border-[#C9AE7C]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">
              Region
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full bg-[#FAF9F7] border border-[#E3E3E6] rounded-[2px] p-1.5 text-xs"
            >
              <option value="all">All Regions</option>
              <option value="Western">Western</option>
              <option value="Southern">Southern</option>
              <option value="Northern">Northern</option>
              <option value="Eastern">Eastern</option>
              <option value="Central">Central</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">
              Discipline Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-[#FAF9F7] border border-[#E3E3E6] rounded-[2px] p-1.5 text-xs"
            >
              <option value="all">All Types</option>
              <option value="Engineering">Engineering</option>
              <option value="Management">Management</option>
              <option value="Pharmacy">Pharmacy</option>
              <option value="Polytechnic">Polytechnic</option>
              <option value="Architecture">Architecture</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">
              Regulatory Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-[#FAF9F7] border border-[#E3E3E6] rounded-[2px] p-1.5 text-xs"
            >
              <option value="all">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Notice Issued">Notice Issued</option>
              <option value="Deficiency Found">Deficiency Found</option>
            </select>
          </div>
        </div>
      </div>

      {/* Institutions Grid */}
      <WindowPanel
        title="Registered Technical Institutions"
        subtitle={`Showing ${filteredInstitutions.length} institutions matching filters`}
        icon={<Building2 size={15} />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredInstitutions.map((inst) => {
            const isFlagship = inst.id === 'inst-1';
            return (
              <div
                key={inst.id}
                onClick={() => {
                  setActiveModalInst(inst);
                  setModalTab('overview');
                }}
                className={`p-3.5 rounded-[4px] border cursor-pointer transition-all flex flex-col justify-between hover:shadow-md ${
                  isFlagship
                    ? 'bg-[#FAF6EE] border-[#C9AE7C] ring-1 ring-[#C9AE7C]/40'
                    : 'bg-white border-[#E3E3E6] hover:border-[#655A86]'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-mono font-bold text-[#8C6D2E]">
                      AICTE: {inst.permanentId}
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded font-semibold uppercase text-[9px] ${
                        inst.status === 'Approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {inst.status}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-sm text-[#1F1F24] line-clamp-1">
                    {inst.name}
                  </h3>

                  <div className="text-[11px] text-gray-500 flex items-center gap-1">
                    <MapPin size={11} className="shrink-0" />
                    <span className="truncate">
                      {inst.city}, {inst.state} ({inst.region} Region)
                    </span>
                  </div>

                  <div className="text-[11px] text-gray-500">
                    Discipline: <span className="font-medium text-gray-700">{inst.institutionType}</span> · Est: {inst.establishedYear}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#E3E3E6] flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold text-[#1F1F24]">
                    {inst.linkedCasesCount} Linked Dockets
                  </span>
                  <span className="text-[#655A86] font-medium text-[11px] flex items-center gap-0.5">
                    View Dossier <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </WindowPanel>

      {/* Institution Dossier Modal with 4 tabs */}
      {activeModalInst && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[4px] border border-[#E3E3E6] max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 bg-[#1F1F24] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9AE7C]">
                  AICTE Permanent ID: {activeModalInst.permanentId}
                </span>
                <h3 className="font-serif font-bold text-lg text-white">
                  {activeModalInst.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalInst(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-[#E3E3E6] text-xs font-semibold bg-[#FAF9F7] px-4">
              {[
                { id: 'overview', label: 'Campus Profile' },
                { id: 'complaints', label: `Dockets (${modalComplaints.length})` },
                { id: 'repeat', label: 'Pattern Analysis' },
                { id: 'contact', label: 'Contact Directory' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setModalTab(tab.id as any)}
                  className={`py-2.5 px-3 border-b-2 uppercase tracking-wider text-[11px] ${
                    modalTab === tab.id
                      ? 'border-[#C9AE7C] text-[#1F1F24]'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-y-auto flex-1 space-y-3 text-xs">
              {modalTab === 'overview' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 bg-[#FAF9F7] p-3 rounded border border-[#E3E3E6]">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase font-semibold">Address</span>
                      <p className="font-medium text-[#1F1F24]">{activeModalInst.address}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase font-semibold">State / Region</span>
                      <p className="font-medium text-[#1F1F24]">{activeModalInst.state} ({activeModalInst.region})</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase font-semibold">Type</span>
                      <p className="font-medium text-[#1F1F24]">{activeModalInst.institutionType}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase font-semibold">Year Established</span>
                      <p className="font-medium text-[#1F1F24]">{activeModalInst.establishedYear}</p>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onOpenCaseGraph(activeModalInst.id);
                        setActiveModalInst(null);
                      }}
                      className="px-3.5 py-1.5 bg-[#1F1F24] text-[#C9AE7C] font-semibold text-xs rounded uppercase flex items-center gap-1.5"
                    >
                      <Share2 size={13} />
                      <span>Launch CaseGraph for Institution</span>
                    </button>
                  </div>
                </div>
              )}

              {modalTab === 'complaints' && (
                <div className="space-y-2">
                  {modalComplaints.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 bg-[#FAF9F7] border border-[#E3E3E6] rounded flex items-center justify-between gap-2"
                    >
                      <div className="space-y-0.5 truncate">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#1F1F24]">{c.caseNumber}</span>
                          <BureauBadge bureauCode={c.bureauCode} />
                          <StatusBadge status={c.status} size="sm" />
                        </div>
                        <div className="font-medium text-[#1F1F24] truncate">{c.title}</div>
                        <div className="text-[10px] text-gray-500">
                          Date: {new Date(c.dateReceived).toLocaleDateString('en-IN')}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onOpenCase(c.caseNumber);
                          setActiveModalInst(null);
                        }}
                        className="px-2.5 py-1 bg-white border border-[#E3E3E6] hover:bg-gray-100 text-xs font-semibold rounded shrink-0 uppercase"
                      >
                        Inspect
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {modalTab === 'repeat' && (
                <div className="space-y-2">
                  <div className="p-3 bg-[#FAF6EE] border border-[#C9AE7C] rounded text-xs text-[#8C6D2E]">
                    <strong>Pattern Summary:</strong> This institution has recurrent dockets under{' '}
                    <strong>Fee Irregularity</strong> and <strong>Infrastructure</strong> across multiple academic cycles. Cross-bureau verification recommended before granting Extension of Approval (EoA).
                  </div>
                </div>
              )}

              {modalTab === 'contact' && (
                <div className="space-y-2">
                  <div className="p-3 bg-[#FAF9F7] border border-[#E3E3E6] rounded space-y-1">
                    <div>Email: <span className="font-mono font-semibold">{activeModalInst.contactEmail}</span></div>
                    <div>Phone: <span className="font-mono font-semibold">{activeModalInst.contactPhone}</span></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
