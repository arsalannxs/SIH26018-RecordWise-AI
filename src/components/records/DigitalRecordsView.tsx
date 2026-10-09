import React, { useState, useMemo } from 'react';
import {
  Database,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ArrowUpDown,
  Eye,
  Edit,
  ExternalLink,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { useRecordWise } from '../../context/RecordWiseContext';
import { LandRecord, ValidationStatus } from '../../types';

export const DigitalRecordsView: React.FC = () => {
  const {
    records,
    setSelectedRecordId,
    setCurrentView,
    addNotification,
    userRole
  } = useRecordWise();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [landUseFilter, setLandUseFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof LandRecord>('lastUpdated');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Selected record for quick preview drawer
  const [viewingRecord, setViewingRecord] = useState<LandRecord | null>(null);

  // Extract unique filter options
  const districts = useMemo(() => Array.from(new Set(records.map(r => r.district))), [records]);
  const landUses = useMemo(() => Array.from(new Set(records.map(r => r.landUse))), [records]);

  // Filter & Search Logic
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.surveyNumber.toLowerCase().includes(q) ||
        r.parcelGatNumber.toLowerCase().includes(q) ||
        r.village.toLowerCase().includes(q) ||
        r.district.toLowerCase().includes(q) ||
        r.ownersOrParties.some(o => o.name.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'all' || r.validationStatus === statusFilter;
      const matchesDistrict = districtFilter === 'all' || r.district === districtFilter;
      const matchesLandUse = landUseFilter === 'all' || r.landUse === landUseFilter;

      return matchesSearch && matchesStatus && matchesDistrict && matchesLandUse;
    }).sort((a, b) => {
      let valA = (a as any)[sortField];
      let valB = (b as any)[sortField];
      if (typeof valA === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (typeof valA === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return 0;
    });
  }, [records, searchQuery, statusFilter, districtFilter, landUseFilter, sortField, sortAsc]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage]);

  const handleSort = (field: keyof LandRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Export CSV function
  const exportCsv = () => {
    const headers = [
      'Record ID',
      'Survey Number',
      'Subdivision',
      'Gat Number',
      'Village',
      'Taluka',
      'District',
      'State',
      'Recorded Area',
      'Unit',
      'Land Use',
      'Validation Status',
      'Confidence (%)',
      'Source Document'
    ];

    const rows = filteredRecords.map(r => [
      `"${r.id}"`,
      `"${r.surveyNumber}"`,
      `"${r.subDivisionNumber || ''}"`,
      `"${r.parcelGatNumber}"`,
      `"${r.village}"`,
      `"${r.taluka}"`,
      `"${r.district}"`,
      `"${r.state}"`,
      r.recordedArea,
      `"${r.unitOfMeasurement}"`,
      `"${r.landUse}"`,
      `"${r.validationStatus}"`,
      r.extractionConfidence,
      `"${r.sourceDocument}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RecordWise_Land_Records_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification('success', 'Exported digital land records CSV successfully.');
  };

  return (
    <div className="space-y-6">
      {/* Search, Filters, and Export Toolbar */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Survey No, Record ID, Village, District, or Khatedar name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-xs border border-[#E2E8F0] rounded-lg bg-[#F5F7FB] text-[#202A5A] placeholder-[#64748B] focus:outline-none focus:border-[#0891B2]"
            />
          </div>

          {/* Export Action */}
          <button
            onClick={exportCsv}
            className="px-4 py-2 rounded-lg bg-[#0891B2] hover:bg-[#0E7490] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E2E8F0] text-xs">
          <div className="flex items-center gap-1.5 text-[#64748B] font-semibold pr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F5F7FB] text-[#202A5A] font-medium"
          >
            <option value="all">All Validation Statuses</option>
            <option value="valid">Valid Only</option>
            <option value="warning">Warnings</option>
            <option value="error">Errors</option>
            <option value="needs_review">Needs Review</option>
          </select>

          {/* District Filter */}
          <select
            value={districtFilter}
            onChange={(e) => {
              setDistrictFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F5F7FB] text-[#202A5A] font-medium"
          >
            <option value="all">All Districts</option>
            {districts.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Land Use Filter */}
          <select
            value={landUseFilter}
            onChange={(e) => {
              setLandUseFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F5F7FB] text-[#202A5A] font-medium"
          >
            <option value="all">All Land Uses</option>
            {landUses.map(lu => (
              <option key={lu} value={lu}>{lu}</option>
            ))}
          </select>

          {/* Active Filter Clear */}
          {(statusFilter !== 'all' || districtFilter !== 'all' || landUseFilter !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setStatusFilter('all');
                setDistrictFilter('all');
                setLandUseFilter('all');
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="text-[#DC2626] hover:underline font-semibold ml-auto text-xs"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#0891B2]" />
            <h3 className="font-bold text-sm text-[#202A5A]">
              Digital Records Master Ledger
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F5F7FB] text-[#64748B] border border-[#E2E8F0]">
              Showing {filteredRecords.length} records
            </span>
          </div>

          <span className="text-[11px] text-[#64748B]">
            Authorized Role: <strong className="text-[#202A5A]">{userRole}</strong>
          </span>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="py-16 text-center text-[#64748B] space-y-2">
            <Database className="w-10 h-10 text-[#CBD5E1] mx-auto" />
            <h4 className="font-bold text-sm text-[#202A5A]">No land records found</h4>
            <p className="text-xs">Try adjusting your search query or active filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F5F7FB] text-[#64748B]">
                  <th
                    onClick={() => handleSort('id')}
                    className="py-3 px-4 font-semibold cursor-pointer hover:text-[#202A5A]"
                  >
                    <div className="flex items-center gap-1">
                      <span>Record ID</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('surveyNumber')}
                    className="py-3 px-4 font-semibold cursor-pointer hover:text-[#202A5A]"
                  >
                    <div className="flex items-center gap-1">
                      <span>Survey / Gat No</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('village')}
                    className="py-3 px-4 font-semibold cursor-pointer hover:text-[#202A5A]"
                  >
                    <div className="flex items-center gap-1">
                      <span>Village & District</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('recordedArea')}
                    className="py-3 px-4 font-semibold cursor-pointer hover:text-[#202A5A]"
                  >
                    <div className="flex items-center gap-1">
                      <span>Recorded Area</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4 font-semibold">Extraction Status</th>
                  <th className="py-3 px-4 font-semibold">Validation Status</th>
                  <th
                    onClick={() => handleSort('lastUpdated')}
                    className="py-3 px-4 font-semibold cursor-pointer hover:text-[#202A5A]"
                  >
                    <div className="flex items-center gap-1">
                      <span>Last Updated</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {paginatedRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-[#F5F7FB]/70 transition-colors">
                    {/* Record ID & ULPIN */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#202A5A] font-mono">{rec.id}</div>
                      <div className="text-[10px] text-[#64748B] font-mono truncate max-w-[140px]" title={rec.parcelId}>
                        {rec.parcelId}
                      </div>
                    </td>

                    {/* Survey No */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#202A5A]">{rec.surveyNumber}</div>
                      <div className="text-[11px] text-[#64748B]">Gat: {rec.parcelGatNumber}</div>
                    </td>

                    {/* Village & District */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#25304A]">{rec.village}</div>
                      <div className="text-[11px] text-[#64748B]">{rec.taluka}, {rec.district}</div>
                    </td>

                    {/* Recorded Area */}
                    <td className="py-3.5 px-4 font-mono">
                      <span className="font-bold text-[#202A5A]">{rec.recordedArea}</span>{' '}
                      <span className="text-[11px] text-[#64748B]">{rec.unitOfMeasurement}</span>
                      <div className="text-[10px] text-[#64748B] font-sans">{rec.landUse}</div>
                    </td>

                    {/* Extraction Status */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-[#047857]">
                          {rec.extractionConfidence}%
                        </span>
                        <span className="text-[10px] text-[#64748B] font-mono">
                          ({rec.sourceDocumentType.split(' ')[0]})
                        </span>
                      </div>
                    </td>

                    {/* Validation Status */}
                    <td className="py-3.5 px-4">
                      {rec.validationStatus === 'valid' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#D1FAE5] text-[#047857]">
                          <CheckCircle2 className="w-3 h-3" /> Valid
                        </span>
                      )}
                      {rec.validationStatus === 'warning' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#FEF3C7] text-[#D97706]">
                          <AlertTriangle className="w-3 h-3" /> Warning
                        </span>
                      )}
                      {rec.validationStatus === 'error' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#FEE2E2] text-[#DC2626]">
                          <ShieldAlert className="w-3 h-3" /> Error
                        </span>
                      )}
                      {rec.validationStatus === 'needs_review' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#CFFAFE] text-[#0891B2]">
                          Needs Review
                        </span>
                      )}
                    </td>

                    {/* Last Updated */}
                    <td className="py-3.5 px-4 text-[11px] text-[#64748B]">
                      <div>{rec.lastUpdated}</div>
                      <div className="text-[10px] text-[#94A3B8] truncate max-w-[120px]">{rec.lastUpdatedBy}</div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingRecord(rec)}
                          title="Quick View Record Details"
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#202A5A] hover:bg-[#F5F7FB] border border-[#E2E8F0] transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedRecordId(rec.id);
                            setCurrentView('ocr');
                          }}
                          title="Edit & Correct via OCR Studio"
                          className="px-2.5 py-1.5 rounded-lg bg-[#0891B2] hover:bg-[#0E7490] text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {filteredRecords.length > 0 && (
          <div className="p-3 border-t border-[#E2E8F0] bg-[#F5F7FB] flex items-center justify-between text-xs text-[#64748B]">
            <div>
              Page <strong className="text-[#202A5A]">{currentPage}</strong> of{' '}
              <strong className="text-[#202A5A]">{totalPages}</strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 rounded border border-[#E2E8F0] bg-white text-[#202A5A] disabled:opacity-40 hover:bg-[#F5F7FB]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 rounded border border-[#E2E8F0] bg-white text-[#202A5A] disabled:opacity-40 hover:bg-[#F5F7FB]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Record Inspection Modal / Drawer */}
      {viewingRecord && (
        <div className="fixed inset-0 bg-[#202A5A]/60 z-50 flex items-center justify-center p-4 backdrop-blur-2xs">
          <div className="bg-white rounded-xl border border-[#E2E8F0] max-w-2xl w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <h3 className="font-bold text-lg text-[#202A5A]">
                  Record Detail: {viewingRecord.id}
                </h3>
                <p className="text-xs text-[#64748B]">
                  ULPIN: <span className="font-mono text-[#0891B2]">{viewingRecord.parcelId}</span>
                </p>
              </div>
              <button
                onClick={() => setViewingRecord(null)}
                className="p-1 rounded text-[#64748B] hover:text-[#202A5A] text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-[#F5F7FB]">
                <span className="text-[#64748B] block">Survey & Subdivision</span>
                <span className="font-bold text-sm text-[#202A5A]">
                  {viewingRecord.surveyNumber} ({viewingRecord.subDivisionNumber || 'N/A'})
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#F5F7FB]">
                <span className="text-[#64748B] block">Gat / Plot Number</span>
                <span className="font-bold text-sm text-[#202A5A]">{viewingRecord.parcelGatNumber}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#F5F7FB]">
                <span className="text-[#64748B] block">Area</span>
                <span className="font-bold text-sm text-[#202A5A]">
                  {viewingRecord.recordedArea} {viewingRecord.unitOfMeasurement}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#F5F7FB]">
                <span className="text-[#64748B] block">Land Classification</span>
                <span className="font-bold text-sm text-[#202A5A]">{viewingRecord.landUse}</span>
              </div>
              <div className="col-span-2 p-3 rounded-lg bg-[#F5F7FB]">
                <span className="text-[#64748B] block">Location</span>
                <span className="font-bold text-xs text-[#202A5A]">
                  Village {viewingRecord.village}, Taluka {viewingRecord.taluka}, District {viewingRecord.district}, {viewingRecord.state}
                </span>
              </div>
              <div className="col-span-2 p-3 rounded-lg bg-[#F5F7FB]">
                <span className="text-[#64748B] block mb-1">Registered Khatedar Co-tenants</span>
                <div className="space-y-1">
                  {viewingRecord.ownersOrParties.map((p, idx) => (
                    <div key={idx} className="flex justify-between font-medium text-stone-900 border-b border-stone-200 pb-0.5">
                      <span>{p.name} ({p.relationType || 'Khatedar'})</span>
                      <span className="font-mono text-[#64748B]">{p.share || 'Full'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
              <button
                onClick={() => setViewingRecord(null)}
                className="px-4 py-2 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-[#64748B] hover:bg-[#F5F7FB]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedRecordId(viewingRecord.id);
                  setViewingRecord(null);
                  setCurrentView('ocr');
                }}
                className="px-4 py-2 rounded-lg bg-[#0891B2] text-white text-xs font-semibold hover:bg-[#0E7490]"
              >
                Open in OCR Studio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
