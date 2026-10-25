import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  RotateCcw,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ExternalLink,
  Calendar,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { db } from '../services/db';
import { Complaint, ComplaintCategory, ComplaintStatus, PriorityLevel } from '../types';
import { WindowPanel } from '../components/common/WindowPanel';
import { StatusBadge, PriorityBadge, BureauBadge } from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';

interface ComplaintsRegistryPageProps {
  onOpenCase: (caseNumber: string) => void;
  initialFilters?: any;
}

export const ComplaintsRegistryPage: React.FC<ComplaintsRegistryPageProps> = ({
  onOpenCase,
  initialFilters,
}) => {
  const { currentUser, canAccessCase } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState(initialFilters?.search || '');
  const [selectedBureau, setSelectedBureau] = useState(initialFilters?.bureau || 'all');
  const [selectedRegion, setSelectedRegion] = useState(initialFilters?.region || 'all');
  const [selectedCategory, setSelectedCategory] = useState(initialFilters?.category || 'all');
  const [selectedStatus, setSelectedStatus] = useState(initialFilters?.status || 'all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [overlapOnly, setOverlapOnly] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Sorting state
  const [sortField, setSortField] = useState<keyof Complaint>('dateReceived');
  const [sortAsc, setSortAsc] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    setComplaints(db.getComplaints());
    const unsub = db.subscribe((state) => {
      setComplaints(state.complaints);
    });
    return unsub;
  }, []);

  // Filter complaints
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      // Permission check
      if (!canAccessCase(c)) return false;

      // Free text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          c.caseNumber.toLowerCase().includes(q) ||
          c.institutionName.toLowerCase().includes(q) ||
          c.institutionPermanentId.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.assignedOfficerName.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // Bureau filter
      if (selectedBureau !== 'all' && c.bureauCode !== selectedBureau) return false;

      // Region filter
      if (selectedRegion !== 'all' && c.region !== selectedRegion) return false;

      // Category filter
      if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;

      // Status filter
      if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;

      // Priority filter
      if (selectedPriority !== 'all' && c.priority !== selectedPriority) return false;

      // Overdue filter
      if (overdueOnly && !c.isOverdue) return false;

      // Overlap flag filter
      if (overlapOnly && !c.overlapFlag) return false;

      // Date range filter
      if (dateFrom) {
        const fromTime = new Date(dateFrom).getTime();
        if (new Date(c.dateReceived).getTime() < fromTime) return false;
      }
      if (dateTo) {
        const toTime = new Date(dateTo).getTime() + 24 * 3600 * 1000;
        if (new Date(c.dateReceived).getTime() > toTime) return false;
      }

      return true;
    });
  }, [
    complaints,
    canAccessCase,
    searchQuery,
    selectedBureau,
    selectedRegion,
    selectedCategory,
    selectedStatus,
    selectedPriority,
    overdueOnly,
    overlapOnly,
    dateFrom,
    dateTo,
  ]);

  // Sort complaints
  const sortedComplaints = useMemo(() => {
    return [...filteredComplaints].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? (valA as any) - (valB as any) : (valB as any) - (valA as any);
    });
  }, [filteredComplaints, sortField, sortAsc]);

  // Paginated complaints
  const totalPages = Math.ceil(sortedComplaints.length / pageSize) || 1;
  const paginatedComplaints = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedComplaints.slice(start, start + pageSize);
  }, [sortedComplaints, currentPage, pageSize]);

  const handleSort = (field: keyof Complaint) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedBureau('all');
    setSelectedRegion('all');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSelectedPriority('all');
    setOverdueOnly(false);
    setOverlapOnly(false);
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    const headers = [
      'Case ID',
      'AICTE ID',
      'Institution Name',
      'Bureau',
      'Category',
      'Title',
      'Status',
      'Priority',
      'Assigned Officer',
      'Date Received',
      'Overdue',
      'Overlap Flag',
    ];

    const rows = sortedComplaints.map((c) => [
      `"${c.caseNumber}"`,
      `"${c.institutionPermanentId}"`,
      `"${c.institutionName.replace(/"/g, '""')}"`,
      `"${c.bureauCode}"`,
      `"${c.category}"`,
      `"${c.title.replace(/"/g, '""')}"`,
      `"${c.status}"`,
      `"${c.priority}"`,
      `"${c.assignedOfficerName}"`,
      `"${c.dateReceived}"`,
      c.isOverdue ? 'YES' : 'NO',
      c.overlapFlag ? 'YES' : 'NO',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SYNTRA_Complaints_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E3E3E6]">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1F1F24]">
            Unified Complaint Docket Registry
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Centralized search across all AICTE bureaus. Showing {filteredComplaints.length} matching dockets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-white border border-[#E3E3E6] hover:bg-gray-50 text-xs font-semibold text-[#1F1F24] rounded-[2px] flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar Panel */}
      <div className="bg-white border border-[#E3E3E6] rounded-[4px] p-3.5 shadow-xs space-y-3">
        {/* Row 1: Search Input */}
        <div className="relative w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by Institution, AICTE Permanent ID (1-XXXX), Docket ID (SYN-1042), Officer name, or keyword..."
            className="w-full bg-[#FAF9F7] border border-[#E3E3E6] rounded-[2px] pl-9 pr-3 py-2 text-xs text-[#1F1F24] focus:outline-none focus:border-[#C9AE7C] focus:bg-white transition-all"
          />
        </div>

        {/* Row 2: Select Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
          {/* Bureau */}
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Bureau</label>
            <select
              value={selectedBureau}
              onChange={(e) => {
                setSelectedBureau(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#FAF9F7] border border-[#E3E3E6] rounded-[2px] p-1.5 text-xs text-[#1F1F24] focus:outline-none focus:border-[#C9AE7C]"
            >
              <option value="all">All Bureaus</option>
              <option value="PGRC">PGRC</option>
              <option value="RB">Regulation Bureau</option>
              <option value="AB">Approval Bureau</option>
              <option value="RO">Regional Offices</option>
              <option value="ACAD">Academic Bureau</option>
            </select>
          </div>

          {/* Region */}
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Region</label>
            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#FAF9F7] border border-[#E3E3E6] rounded-[2px] p-1.5 text-xs text-[#1F1F24] focus:outline-none focus:border-[#C9AE7C]"
            >
              <option value="all">All Regions</option>
              <option value="Western">Western</option>
              <option value="Southern">Southern</option>
              <option value="Northern">Northern</option>
              <option value="Eastern">Eastern</option>
              <option value="Central">Central</option>
              <option value="North-Western">North-Western</option>
              <option value="South-Western">South-Western</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#FAF9F7] border border-[#E3E3E6] rounded-[2px] p-1.5 text-xs text-[#1F1F24] focus:outline-none focus:border-[#C9AE7C]"
            >
              <option value="all">All Categories</option>
              <option value="Fee Irregularity">Fee Irregularity</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Faculty & Staff">Faculty & Staff</option>
              <option value="Admission">Admission</option>
              <option value="Affiliation/Approval">Affiliation/Approval</option>
              <option value="Harassment">Harassment</option>
              <option value="Academic & Curriculum">Academic & Curriculum</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#FAF9F7] border border-[#E3E3E6] rounded-[2px] p-1.5 text-xs text-[#1F1F24] focus:outline-none focus:border-[#C9AE7C]"
            >
              <option value="all">All Statuses</option>
              <option value="Received">Received</option>
              <option value="Under Review">Under Review</option>
              <option value="Assigned">Assigned</option>
              <option value="Investigation">Investigation</option>
              <option value="Coordination Required">Coordination Required</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Priority</label>
            <select
              value={selectedPriority}
              onChange={(e) => {
                setSelectedPriority(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#FAF9F7] border border-[#E3E3E6] rounded-[2px] p-1.5 text-xs text-[#1F1F24] focus:outline-none focus:border-[#C9AE7C]"
            >
              <option value="all">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Received From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#FAF9F7] border border-[#E3E3E6] rounded-[2px] p-1 text-xs text-[#1F1F24]"
            />
          </div>
        </div>

        {/* Row 3: Quick Filter Toggles & Clear */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E3E3E6] text-xs">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer select-none text-gray-700">
              <input
                type="checkbox"
                checked={overlapOnly}
                onChange={(e) => {
                  setOverlapOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="rounded text-[#C9AE7C] focus:ring-0"
              />
              <span className="font-semibold text-[#8C6D2E]">Overlap Flagged Only</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none text-gray-700">
              <input
                type="checkbox"
                checked={overdueOnly}
                onChange={(e) => {
                  setOverdueOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="rounded text-[#B5524A] focus:ring-0"
              />
              <span className="font-semibold text-[#B5524A]">Overdue Dockets Only</span>
            </label>
          </div>

          <button
            type="button"
            onClick={handleClearFilters}
            className="text-[11px] text-gray-500 hover:text-[#1F1F24] flex items-center gap-1 transition-colors"
          >
            <RotateCcw size={11} />
            <span>Reset All Filters</span>
          </button>
        </div>
      </div>

      {/* Complaints Table Window */}
      <WindowPanel
        title="Complaints Register"
        subtitle={`Displaying page ${currentPage} of ${totalPages} (${sortedComplaints.length} records)`}
        icon={<FileText size={15} />}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF9F7] text-[10px] uppercase font-semibold text-gray-500 border-b border-[#E3E3E6]">
              <tr>
                <th
                  className="py-2.5 px-3 cursor-pointer hover:text-[#1F1F24]"
                  onClick={() => handleSort('caseNumber')}
                >
                  <div className="flex items-center gap-1">
                    <span>Docket ID</span>
                    <ArrowUpDown size={11} />
                  </div>
                </th>
                <th
                  className="py-2.5 px-3 cursor-pointer hover:text-[#1F1F24]"
                  onClick={() => handleSort('institutionName')}
                >
                  <div className="flex items-center gap-1">
                    <span>Institution (Permanent ID)</span>
                    <ArrowUpDown size={11} />
                  </div>
                </th>
                <th className="py-2.5 px-3">Bureau & Category</th>
                <th
                  className="py-2.5 px-3 cursor-pointer hover:text-[#1F1F24]"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1">
                    <span>Status</span>
                    <ArrowUpDown size={11} />
                  </div>
                </th>
                <th
                  className="py-2.5 px-3 cursor-pointer hover:text-[#1F1F24]"
                  onClick={() => handleSort('priority')}
                >
                  <div className="flex items-center gap-1">
                    <span>Priority</span>
                    <ArrowUpDown size={11} />
                  </div>
                </th>
                <th
                  className="py-2.5 px-3 cursor-pointer hover:text-[#1F1F24]"
                  onClick={() => handleSort('dateReceived')}
                >
                  <div className="flex items-center gap-1">
                    <span>Date & Time (IST)</span>
                    <ArrowUpDown size={11} />
                  </div>
                </th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E3E6]">
              {paginatedComplaints.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-500">
                    No complaint dockets matched your criteria. Try loosening filters.
                  </td>
                </tr>
              ) : (
                paginatedComplaints.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FAF9F7] transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-[#1F1F24]">
                          {c.caseNumber}
                        </span>
                        {c.overlapFlag && (
                          <span
                            title="Cross-Bureau Overlap Flagged"
                            className="w-2 h-2 rounded-full bg-[#C9953A] shrink-0 animate-ping"
                          />
                        )}
                        {c.isOverdue && (
                          <span
                            title="Overdue Docket"
                            className="px-1 py-0.2 bg-[#B5524A] text-white text-[9px] font-bold rounded"
                          >
                            DELAY
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 max-w-[220px]">
                      <div className="font-semibold text-[#1F1F24] truncate">
                        {c.institutionName}
                      </div>
                      <div className="text-[10px] font-mono text-gray-500">
                        ID: {c.institutionPermanentId} · {c.state}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <BureauBadge bureauCode={c.bureauCode} />
                        <span className="text-[11px] text-gray-600 font-medium truncate max-w-[120px]">
                          {c.category}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={c.status} size="sm" />
                    </td>
                    <td className="py-3 px-3">
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-gray-600">
                      {formatIST(c.dateReceived)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => onOpenCase(c.caseNumber)}
                        className="px-2.5 py-1 bg-[#1F1F24] hover:bg-black text-[#C9AE7C] text-[11px] font-semibold uppercase tracking-wider rounded-[2px] transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-3 border-t border-[#E3E3E6] text-xs">
            <span className="text-gray-500 text-[11px]">
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, sortedComplaints.length)} of{' '}
              {sortedComplaints.length} entries
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="p-1 border border-[#E3E3E6] rounded disabled:opacity-30 hover:bg-gray-100"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="px-2 font-mono text-[11px]">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="p-1 border border-[#E3E3E6] rounded disabled:opacity-30 hover:bg-gray-100"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </WindowPanel>
    </div>
  );
};
