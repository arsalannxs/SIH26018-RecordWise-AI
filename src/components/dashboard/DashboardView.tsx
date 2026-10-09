import React from 'react';
import {
  FileText,
  Database,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  Clock,
  Layers,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { useRecordWise } from '../../context/RecordWiseContext';

export const DashboardView: React.FC = () => {
  const {
    metrics,
    setCurrentView,
    setSelectedRecordId,
    startSihDemo,
    records,
    runFullValidationSuite
  } = useRecordWise();

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner - Explicit requirement from SIH Problem Statement */}
      <div className="bg-[#CFFAFE]/50 border border-[#0891B2]/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#202A5A]">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-[#0891B2] text-white shrink-0 mt-0.5 sm:mt-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-[#202A5A]">SIH 2026 Official Prototype:</span>{' '}
            <span className="text-[#25304A]">
              RecordWise AI supports authorized land record-processing workflows. Digitized records must not be treated as independent proof of legal ownership or as a replacement for official government land records.
            </span>
          </div>
        </div>
        <span className="shrink-0 px-2.5 py-1 rounded-md bg-white border border-[#0891B2]/30 font-semibold text-[#0891B2] text-[11px]">
          SIH DEMO — SIMULATED DATA
        </span>
      </div>

      {/* Hero Welcome & Quick Triggers */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#F5F7FB] border border-[#E2E8F0] text-xs font-semibold text-[#202A5A]">
              <span className="w-2 h-2 rounded-full bg-[#0891B2]"></span>
              Department of Land Resources (DoLR) | SIH26018
            </div>
            <h2 className="text-2xl font-bold text-[#202A5A] tracking-tight">
              Land Record Intelligence Dashboard
            </h2>
            <p className="text-sm text-[#64748B]">
              Digitize, review and validate land records in one place.
            </p>
          </div>

          {/* Primary and Secondary Action Buttons as required */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentView('upload')}
              className="px-5 py-2.5 rounded-lg bg-[#0891B2] hover:bg-[#0E7490] text-white text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Land Record</span>
            </button>

            <button
              onClick={startSihDemo}
              className="px-5 py-2.5 rounded-lg bg-white border border-[#202A5A] text-[#202A5A] hover:bg-[#F5F7FB] text-sm font-semibold flex items-center gap-2 transition-colors shadow-2xs"
            >
              <Sparkles className="w-4 h-4 text-[#0891B2]" />
              <span>Run SIH Demo</span>
            </button>
          </div>
        </div>

        {/* Processing Overview Pipeline: Uploaded -> Extracted -> Reviewed -> Validated */}
        <div className="mt-8 pt-6 border-t border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Processing Pipeline Lifecycle
            </span>
            <span className="text-xs text-[#0891B2] font-medium">
              4 Continuous Stages
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-lg bg-[#F5F7FB] border border-[#E2E8F0] relative overflow-hidden">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-[#202A5A]">1. Uploaded</span>
                <span className="w-2 h-2 rounded-full bg-[#0891B2]"></span>
              </div>
              <p className="text-xl font-bold text-[#202A5A]">{metrics.totalDocuments}</p>
              <p className="text-[11px] text-[#64748B]">Scans & PDFs received</p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#F5F7FB] border border-[#E2E8F0] relative overflow-hidden">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-[#202A5A]">2. Extracted</span>
                <span className="w-2 h-2 rounded-full bg-[#0891B2]"></span>
              </div>
              <p className="text-xl font-bold text-[#202A5A]">{metrics.recordsDigitized}</p>
              <p className="text-[11px] text-[#64748B]">OCR mapped to digital fields</p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#F5F7FB] border border-[#E2E8F0] relative overflow-hidden">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-[#202A5A]">3. Reviewed</span>
                <span className="w-2 h-2 rounded-full bg-[#D97706]"></span>
              </div>
              <p className="text-xl font-bold text-[#D97706]">{metrics.recordsRequiringReview}</p>
              <p className="text-[11px] text-[#64748B]">Requiring human verification</p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#D1FAE5]/40 border border-[#D1FAE5] relative overflow-hidden">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-[#047857]">4. Validated</span>
                <span className="w-2 h-2 rounded-full bg-[#047857]"></span>
              </div>
              <p className="text-xl font-bold text-[#047857]">{metrics.recordsValidated}</p>
              <p className="text-[11px] text-[#047857]">Passed all mathematical rules</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid - Exact 4 Required Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Documents */}
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-2xs hover:border-[#0891B2]/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Total Documents
            </span>
            <div className="p-2 rounded-lg bg-[#F5F7FB] text-[#202A5A]">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#202A5A]">{metrics.totalDocuments}</span>
            <span className="text-xs text-[#047857] font-medium">+100% processed</span>
          </div>
          <div className="mt-2 text-[11px] text-[#64748B] flex items-center justify-between">
            <span>Cadastral, 7/12 & RTC</span>
            <span className="text-[10px] text-[#94A3B8]">Demo Data</span>
          </div>
        </div>

        {/* Records Digitized */}
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-2xs hover:border-[#0891B2]/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Records Digitized
            </span>
            <div className="p-2 rounded-lg bg-[#CFFAFE] text-[#0891B2]">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#202A5A]">{metrics.recordsDigitized}</span>
            <span className="text-xs text-[#0891B2] font-medium">Avg conf: {metrics.averageConfidence}%</span>
          </div>
          <div className="mt-2 text-[11px] text-[#64748B] flex items-center justify-between">
            <span>Structured into ULPIN format</span>
            <span className="text-[10px] text-[#94A3B8]">Demo Data</span>
          </div>
        </div>

        {/* Records Validated */}
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-2xs hover:border-[#047857]/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Records Validated
            </span>
            <div className="p-2 rounded-lg bg-[#D1FAE5] text-[#047857]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#047857]">{metrics.recordsValidated}</span>
            <span className="text-xs text-[#047857] font-medium">Clean geometry</span>
          </div>
          <div className="mt-2 text-[11px] text-[#64748B] flex items-center justify-between">
            <span>Passed rule constraints</span>
            <span className="text-[10px] text-[#94A3B8]">Demo Data</span>
          </div>
        </div>

        {/* Records Requiring Review */}
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-2xs hover:border-[#D97706]/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Records Requiring Review
            </span>
            <div className="p-2 rounded-lg bg-[#FEF3C7] text-[#D97706]">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#D97706]">{metrics.recordsRequiringReview}</span>
            <span className="text-xs text-[#DC2626] font-medium">Action Needed</span>
          </div>
          <div className="mt-2 text-[11px] text-[#64748B] flex items-center justify-between">
            <span>Area divergence / smudged text</span>
            <span className="text-[10px] text-[#94A3B8]">Demo Data</span>
          </div>
        </div>
      </div>

      {/* Recent Records & Quick Workflow Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Records Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-[#202A5A]">Recent Digitized Records</h3>
              <p className="text-xs text-[#64748B]">Live view of digitized records across surveyed states</p>
            </div>
            <button
              onClick={() => setCurrentView('records')}
              className="text-xs font-semibold text-[#0891B2] hover:text-[#0E7490] flex items-center gap-1"
            >
              <span>View All Records</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-[#64748B] bg-[#F5F7FB]">
                  <th className="py-2.5 px-3 font-semibold">Survey / Gat No.</th>
                  <th className="py-2.5 px-3 font-semibold">Location</th>
                  <th className="py-2.5 px-3 font-semibold">Area</th>
                  <th className="py-2.5 px-3 font-semibold">Validation</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {records.slice(0, 5).map((rec) => (
                  <tr key={rec.id} className="hover:bg-[#F5F7FB]/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-[#202A5A]">{rec.surveyNumber}</div>
                      <div className="text-[11px] text-[#64748B] font-mono">{rec.parcelGatNumber}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-[#25304A] font-medium">{rec.village}</div>
                      <div className="text-[11px] text-[#64748B]">{rec.taluka}, {rec.district}</div>
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <span className="font-semibold text-[#202A5A]">{rec.recordedArea}</span>{' '}
                      <span className="text-[#64748B] text-[11px]">{rec.unitOfMeasurement}</span>
                    </td>
                    <td className="py-3 px-3">
                      {rec.validationStatus === 'valid' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#D1FAE5] text-[#047857]">
                          <CheckCircle2 className="w-3 h-3" /> Valid
                        </span>
                      )}
                      {rec.validationStatus === 'warning' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#FEF3C7] text-[#D97706]">
                          <AlertTriangle className="w-3 h-3" /> Warning
                        </span>
                      )}
                      {rec.validationStatus === 'error' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#FEE2E2] text-[#DC2626]">
                          <ShieldAlert className="w-3 h-3" /> Error
                        </span>
                      )}
                      {rec.validationStatus === 'needs_review' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#CFFAFE] text-[#0891B2]">
                          Needs Review
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedRecordId(rec.id);
                          setCurrentView('ocr');
                        }}
                        className="px-2.5 py-1 rounded bg-[#F5F7FB] hover:bg-[#E2E8F0] text-[#202A5A] font-semibold text-[11px] transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Quick Validation & Intelligence Panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-2xs">
            <h3 className="font-bold text-base text-[#202A5A] mb-1">
              Active Validation Issues
            </h3>
            <p className="text-xs text-[#64748B] mb-4">
              Issues flagged for human verification under DoLR rules
            </p>

            <div className="space-y-2.5">
              <div
                onClick={() => setCurrentView('validation')}
                className="p-3 rounded-lg border border-[#FDE68A] bg-[#FEF3C7]/40 hover:bg-[#FEF3C7]/70 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#D97706]">
                  <span>Area Discrepancy (+30 sq.m)</span>
                  <span className="text-[10px] uppercase px-1.5 py-0.5 bg-[#D97706] text-white rounded">Warning</span>
                </div>
                <p className="text-[11px] text-[#25304A] mt-1">
                  SUR-1024/2A Wagholi differs from 1984 ledger (1850 vs 1820 sq.m)
                </p>
              </div>

              <div
                onClick={() => setCurrentView('validation')}
                className="p-3 rounded-lg border border-[#FECACA] bg-[#FEE2E2]/40 hover:bg-[#FEE2E2]/70 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#DC2626]">
                  <span>Missing Mandatory Land Use</span>
                  <span className="text-[10px] uppercase px-1.5 py-0.5 bg-[#DC2626] text-white rounded">Error</span>
                </div>
                <p className="text-[11px] text-[#25304A] mt-1">
                  SUR-408 Morar (Gwalior 1972) smudged column 5
                </p>
              </div>

              <div
                onClick={() => setCurrentView('duplicates')}
                className="p-3 rounded-lg border border-[#CFFAFE] bg-[#CFFAFE]/30 hover:bg-[#CFFAFE]/60 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#0891B2]">
                  <span>Potential Duplicate Detected</span>
                  <span className="text-[10px] uppercase px-1.5 py-0.5 bg-[#0891B2] text-white rounded">91% Match</span>
                </div>
                <p className="text-[11px] text-[#25304A] mt-1">
                  2 records for Wagholi Survey 1024 (2024 Satbara vs 1984 Ledger)
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
              <button
                onClick={runFullValidationSuite}
                className="w-full py-2 px-3 rounded-lg bg-[#202A5A] hover:bg-[#2D3A7A] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-[#CFFAFE]" />
                <span>Re-run Validation Suite</span>
              </button>
            </div>
          </div>

          {/* Quick System Information */}
          <div className="bg-[#202A5A] text-white rounded-xl p-4 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm">System Standards</span>
              <span className="text-[10px] font-mono bg-[#0891B2] px-2 py-0.5 rounded text-white font-semibold">
                DILRMP v3.1
              </span>
            </div>
            <p className="text-[11px] text-[#CBD5E1] leading-relaxed">
              Standardized on Bhu-Aadhaar (14-digit ULPIN), geo-referenced cadastral linkage, and multi-tier revenue verification.
            </p>
            <div className="pt-2 border-t border-[#2D3A7A] flex items-center justify-between text-[11px] text-[#94A3B8]">
              <span>Backend AI: Gemini 3.8 Flash</span>
              <span className="text-[#CFFAFE]">Active & Grounded</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
