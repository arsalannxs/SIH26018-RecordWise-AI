import React, { useState, useRef } from 'react';
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Landmark,
  Calendar,
  User,
  Hash,
  Sparkles,
  Info
} from 'lucide-react';
import { useRecordWise } from '../../context/RecordWiseContext';

export const ReportsView: React.FC = () => {
  const {
    records,
    validationIssues,
    duplicatePairs,
    userRole,
    addNotification
  } = useRecordWise();

  const [selectedRecordId, setSelectedRecordId] = useState<string>(records[0]?.id || '');
  const activeRecord = records.find(r => r.id === selectedRecordId) || records[0];

  const reportRef = useRef<HTMLDivElement>(null);

  const relatedIssues = validationIssues.filter(i => i.recordId === activeRecord.id);
  const relatedDuplicates = duplicatePairs.filter(
    d => d.recordAId === activeRecord.id || d.recordBId === activeRecord.id
  );

  const todayStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const printReport = () => {
    window.print();
    addNotification('info', 'Opened system print dialog for PDF export.');
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs no-print">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#202A5A] text-white">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#202A5A]">
              Official Land Digitization & Validation Report Generator
            </h3>
            <p className="text-xs text-[#64748B]">
              Standardized format compliant with DoLR National Land Records Modernization Programme
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-stretch sm:self-auto">
          <select
            value={activeRecord.id}
            onChange={(e) => setSelectedRecordId(e.target.value)}
            className="text-xs border border-[#E2E8F0] rounded-lg px-3 py-1.5 bg-[#F5F7FB] text-[#202A5A] font-medium"
          >
            {records.map(r => (
              <option key={r.id} value={r.id}>
                {r.surveyNumber} — {r.village} ({r.id})
              </option>
            ))}
          </select>

          <button
            onClick={printReport}
            className="px-4 py-2 bg-[#0891B2] hover:bg-[#0E7490] text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Official Report Printable Container */}
      <div
        ref={reportRef}
        className="bg-white rounded-xl border border-[#E2E8F0] p-8 shadow-sm max-w-4xl mx-auto space-y-6 print:border-none print:shadow-none print:p-0"
      >
        {/* Government Header Block */}
        <div className="border-b-2 border-[#202A5A] pb-5 text-center relative">
          <div className="w-12 h-12 mx-auto rounded-lg bg-[#202A5A] text-white flex items-center justify-center font-bold text-xl mb-2">
            <Landmark className="w-7 h-7" />
          </div>
          <p className="text-xs font-semibold tracking-widest uppercase text-[#64748B]">
            GOVERNMENT OF INDIA • MINISTRY OF RURAL DEVELOPMENT
          </p>
          <h2 className="text-lg font-extrabold text-[#202A5A] mt-0.5 uppercase tracking-wide">
            Department of Land Resources (DoLR)
          </h2>
          <h3 className="text-sm font-bold text-[#0891B2] mt-0.5">
            Digital Land Record Verification & Validation Summary Certificate
          </h3>
          <p className="text-[11px] font-mono text-[#64748B] mt-1">
            System: RecordWise AI (SIH26018) • DILRMP Standard Core Schema v3.1
          </p>

          <div className="absolute top-2 right-2 text-right hidden sm:block">
            <span className="text-[10px] text-[#64748B] block font-mono">Date: {todayStr}</span>
            <span className="text-[10px] text-[#047857] font-bold block">CONFIDENTIAL REVENUE REPORT</span>
          </div>
        </div>

        {/* Report Metadata Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-[#F5F7FB] rounded-lg border border-[#E2E8F0] text-xs">
          <div>
            <span className="text-[10px] text-[#64748B] block">Record Identifier</span>
            <span className="font-mono font-bold text-[#202A5A]">{activeRecord.id}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#64748B] block">Bhu-Aadhaar / ULPIN</span>
            <span className="font-mono font-bold text-[#0891B2] text-[11px]">{activeRecord.parcelId}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#64748B] block">Source Document</span>
            <span className="font-semibold text-[#202A5A] truncate block">{activeRecord.sourceDocument}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#64748B] block">Average OCR Score</span>
            <span className="font-bold text-[#047857]">{activeRecord.extractionConfidence}%</span>
          </div>
        </div>

        {/* Section 1: Cadastral Coordinates & Structured Details */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#202A5A] border-b border-[#E2E8F0] pb-1">
            1. Extracted Cadastral & Geographic Identifiers
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 rounded border border-[#E2E8F0]">
              <span className="text-[#64748B] text-[10px] block">Survey Number / Hissa</span>
              <span className="font-bold text-sm text-[#202A5A]">{activeRecord.surveyNumber}</span>
            </div>
            <div className="p-2.5 rounded border border-[#E2E8F0]">
              <span className="text-[#64748B] text-[10px] block">Gat / Plot Number</span>
              <span className="font-bold text-sm text-[#202A5A]">{activeRecord.parcelGatNumber}</span>
            </div>
            <div className="p-2.5 rounded border border-[#E2E8F0]">
              <span className="text-[#64748B] text-[10px] block">Recorded Area</span>
              <span className="font-bold text-sm text-[#202A5A]">
                {activeRecord.recordedArea} {activeRecord.unitOfMeasurement}
              </span>
            </div>
            <div className="p-2.5 rounded border border-[#E2E8F0]">
              <span className="text-[#64748B] text-[10px] block">Village (Mouje)</span>
              <span className="font-semibold text-[#202A5A]">{activeRecord.village}</span>
            </div>
            <div className="p-2.5 rounded border border-[#E2E8F0]">
              <span className="text-[#64748B] text-[10px] block">Taluka & District</span>
              <span className="font-semibold text-[#202A5A]">{activeRecord.taluka}, {activeRecord.district}</span>
            </div>
            <div className="p-2.5 rounded border border-[#E2E8F0]">
              <span className="text-[#64748B] text-[10px] block">State</span>
              <span className="font-semibold text-[#202A5A]">{activeRecord.state}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Registered Khatedars */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#202A5A] border-b border-[#E2E8F0] pb-1">
            2. Co-Tenancy & Registered Parties
          </h4>

          <table className="w-full text-xs text-left border border-[#E2E8F0] rounded-lg overflow-hidden">
            <thead className="bg-[#F5F7FB] text-[#64748B] border-b border-[#E2E8F0]">
              <tr>
                <th className="py-2 px-3 font-semibold">Khatedar Full Name</th>
                <th className="py-2 px-3 font-semibold">Recorded Share</th>
                <th className="py-2 px-3 font-semibold">Tenure Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {activeRecord.ownersOrParties.map((owner, idx) => (
                <tr key={idx}>
                  <td className="py-2 px-3 font-bold text-[#202A5A]">{owner.name}</td>
                  <td className="py-2 px-3 font-mono">{owner.share || 'Full / Undivided'}</td>
                  <td className="py-2 px-3 text-[#64748B]">{owner.relationType || 'Occupant Class I'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 3: Multi-Tier Validation Summary */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#202A5A] border-b border-[#E2E8F0] pb-1">
            3. Automated Validation & Consistency Verification
          </h4>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F5F7FB]">
              <span className="font-semibold text-[#202A5A]">Overall Validation Status:</span>
              {activeRecord.validationStatus === 'valid' && (
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#D1FAE5] text-[#047857]">
                  PASS (VALID)
                </span>
              )}
              {activeRecord.validationStatus === 'warning' && (
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#FEF3C7] text-[#D97706]">
                  WARNING (REVIEW REQUIRED)
                </span>
              )}
              {activeRecord.validationStatus === 'error' && (
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#FEE2E2] text-[#DC2626]">
                  ERROR (BLOCKING DISCREPANCY)
                </span>
              )}
              {activeRecord.validationStatus === 'needs_review' && (
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#CFFAFE] text-[#0891B2]">
                  NEEDS REVIEW
                </span>
              )}
            </div>

            {relatedIssues.length > 0 ? (
              <div className="space-y-2">
                {relatedIssues.map((iss) => (
                  <div key={iss.id} className="p-3 rounded-lg border border-[#E2E8F0] bg-white">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold text-[#DC2626]">{iss.rule} ({iss.field})</span>
                      <span className="font-mono text-[#64748B]">{iss.status.toUpperCase()}</span>
                    </div>
                    <p className="text-xs text-[#25304A]">{iss.message}</p>
                    <div className="text-[11px] text-[#0891B2] mt-1">
                      <strong>Action:</strong> {iss.suggestedAction}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#047857] p-2.5 rounded bg-[#D1FAE5]/40 border border-[#D1FAE5]">
                ✓ No field-level errors or conflicting entries flagged for this record.
              </p>
            )}
          </div>
        </div>

        {/* Section 4: Potential Duplicates */}
        {relatedDuplicates.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#202A5A] border-b border-[#E2E8F0] pb-1">
              4. Duplicate & Overlap Assessment
            </h4>
            {relatedDuplicates.map((dup) => (
              <div key={dup.id} className="p-3 rounded-lg border border-[#FDE68A] bg-[#FEF3C7]/30 text-xs">
                <div className="flex justify-between font-bold text-[#D97706] mb-1">
                  <span>Match Candidate: {dup.recordBId} ({dup.matchScore}% Match)</span>
                  <span>{dup.status.replace(/_/g, ' ').toUpperCase()}</span>
                </div>
                <p className="text-[#25304A]">{dup.reviewNotes}</p>
              </div>
            ))}
          </div>
        )}

        {/* Sign-Off & Official Stamp Block */}
        <div className="pt-6 border-t border-[#CBD5E1] grid grid-cols-2 gap-6 text-xs">
          <div>
            <span className="text-[10px] text-[#64748B] block">Digitization Operator</span>
            <div className="font-bold text-[#202A5A] mt-1">Operator Sharma (ID: OP-412)</div>
            <div className="text-[10px] text-[#64748B]">DoLR Certified Operator Tier 1</div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#64748B] block">Authorized Reviewer Sign-off</span>
            <div className="font-bold text-[#202A5A] mt-1">{userRole}</div>
            <div className="text-[10px] text-[#0891B2] font-semibold">Digitally Signed on {todayStr}</div>
          </div>
        </div>

        {/* Mandatory Statutory Disclaimer as explicitly commanded */}
        <div className="p-3 rounded-lg bg-[#F5F7FB] border border-[#E2E8F0] text-[10px] text-[#64748B] text-center leading-relaxed">
          <strong>STATUTORY DISCLAIMER:</strong> RecordWise AI is a prototype developed for Smart India Hackathon 2026 (SIH26018). OCR-extracted data and automated validation results may contain errors and require human review. Digitized records must not be treated as independent proof of legal ownership or as a replacement for official government land records. Demo data is simulated unless explicitly identified otherwise.
        </div>
      </div>
    </div>
  );
};
