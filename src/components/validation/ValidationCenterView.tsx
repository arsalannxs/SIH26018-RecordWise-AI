import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Bot,
  ArrowRight,
  Info,
  Check,
  X,
  FileText,
  Filter,
  Layers,
  HelpCircle
} from 'lucide-react';
import { useRecordWise } from '../../context/RecordWiseContext';
import { ValidationIssue } from '../../types';

export const ValidationCenterView: React.FC = () => {
  const {
    validationIssues,
    resolveValidationIssue,
    runFullValidationSuite,
    records,
    setSelectedRecordId,
    setCurrentView,
    addNotification,
    userRole
  } = useRecordWise();

  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('open');

  // Explain with AI modal/drawer state
  const [explainingIssue, setExplainingIssue] = useState<ValidationIssue | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiExplanationData, setAiExplanationData] = useState<{
    explanation: string;
    regulatoryContext: string;
    recommendedAction: string;
    isAiGenerated: boolean;
  } | null>(null);

  // Review Issue resolution modal state
  const [reviewingIssue, setReviewingIssue] = useState<ValidationIssue | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');

  const filteredIssues = validationIssues.filter((iss) => {
    const matchesSeverity = filterSeverity === 'all' || iss.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || iss.status === filterStatus;
    return matchesSeverity && matchesStatus;
  });

  // Call backend Gemini AI to explain validation issue
  const explainIssueWithAi = async (issue: ValidationIssue) => {
    setExplainingIssue(issue);
    setIsAiLoading(true);
    setAiExplanationData(null);

    const relatedRecord = records.find(r => r.id === issue.recordId);

    try {
      const response = await fetch('/api/gemini/explain-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rule: issue.rule,
          field: issue.field,
          currentValue: issue.currentValue,
          recordContext: relatedRecord ? {
            recordId: relatedRecord.id,
            surveyNumber: relatedRecord.surveyNumber,
            village: relatedRecord.village,
            district: relatedRecord.district,
            recordedArea: relatedRecord.recordedArea,
            unitOfMeasurement: relatedRecord.unitOfMeasurement
          } : undefined
        })
      });

      const data = await response.json();
      setAiExplanationData({
        explanation: data.explanation || issue.message,
        regulatoryContext: data.regulatoryContext || 'Department of Land Resources (DoLR) verification guidelines.',
        recommendedAction: data.recommendedAction || issue.suggestedAction,
        isAiGenerated: data.isAiGenerated ?? true
      });
    } catch (err: any) {
      console.error('Failed to get AI explanation:', err);
      setAiExplanationData({
        explanation: issue.message,
        regulatoryContext: issue.regulatoryContext || 'National Land Records Modernization Programme (DILRMP).',
        recommendedAction: issue.suggestedAction,
        isAiGenerated: false
      });
      addNotification('warning', 'AI server fallback used for explanation.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleResolveIssue = () => {
    if (reviewingIssue && resolutionNote.trim()) {
      resolveValidationIssue(reviewingIssue.id, resolutionNote.trim());
      setReviewingIssue(null);
      setResolutionNote('');
    } else {
      addNotification('warning', 'Please provide a reviewer sign-off explanation note.');
    }
  };

  const openResolutionModal = (issue: ValidationIssue) => {
    setReviewingIssue(issue);
    setResolutionNote(issue.suggestedAction);
  };

  return (
    <div className="space-y-6">
      {/* Disclaimer on Land Ownership - Essential SIH Guideline */}
      <div className="bg-[#CFFAFE]/40 border border-[#0891B2]/30 rounded-xl p-4 flex items-start gap-3 text-xs">
        <div className="p-1.5 rounded bg-[#0891B2] text-white shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="text-[#202A5A]">
          <span className="font-bold">Automated Validation Protocol:</span> Automated rules identify potential mathematical, textual, and spatial inconsistencies across historical ledgers. Validation results support authorized record-processing workflows and do not make legal ownership decisions or resolve title disputes.
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs">
          <span className="text-xs text-[#64748B] font-semibold uppercase">Total Issues Flagged</span>
          <p className="text-2xl font-bold text-[#202A5A] mt-1">{validationIssues.length}</p>
          <span className="text-[10px] text-[#64748B]">Across 6 cadastral records</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#FECACA] bg-[#FEE2E2]/20 shadow-2xs">
          <span className="text-xs text-[#DC2626] font-semibold uppercase">Errors (Blocking)</span>
          <p className="text-2xl font-bold text-[#DC2626] mt-1">
            {validationIssues.filter(i => i.severity === 'error').length}
          </p>
          <span className="text-[10px] text-[#DC2626]">Missing mandatory fields</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#FDE68A] bg-[#FEF3C7]/20 shadow-2xs">
          <span className="text-xs text-[#D97706] font-semibold uppercase">Warnings (Area/Dates)</span>
          <p className="text-2xl font-bold text-[#D97706] mt-1">
            {validationIssues.filter(i => i.severity === 'warning').length}
          </p>
          <span className="text-[10px] text-[#D97706]">Cross-record variance</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#D1FAE5] bg-[#D1FAE5]/20 shadow-2xs">
          <span className="text-xs text-[#047857] font-semibold uppercase">Resolved Issues</span>
          <p className="text-2xl font-bold text-[#047857] mt-1">
            {validationIssues.filter(i => i.status === 'resolved').length}
          </p>
          <span className="text-[10px] text-[#047857]">Signed off by reviewer</span>
        </div>
      </div>

      {/* Main Validation Issue Center */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
        {/* Header Toolbar */}
        <div className="p-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#F5F7FB]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#0891B2]" />
            <div>
              <h3 className="font-bold text-sm text-[#202A5A]">
                Validation Rules Engine & Discrepancy Queue
              </h3>
              <p className="text-xs text-[#64748B]">
                Automated field-by-field verification against revenue department standards
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            {/* Filter by severity */}
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="text-xs border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 bg-white text-[#202A5A] font-medium"
            >
              <option value="all">All Severities</option>
              <option value="error">Errors Only</option>
              <option value="warning">Warnings Only</option>
              <option value="needs_review">Needs Review</option>
            </select>

            {/* Filter by status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 bg-white text-[#202A5A] font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open Issues</option>
              <option value="resolved">Resolved</option>
            </select>

            <button
              onClick={runFullValidationSuite}
              className="px-3 py-1.5 bg-[#202A5A] hover:bg-[#2D3A7A] text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
            >
              Re-run Suite
            </button>
          </div>
        </div>

        {/* Validation Issues List */}
        <div className="divide-y divide-[#E2E8F0]">
          {filteredIssues.length === 0 ? (
            <div className="py-12 text-center text-[#64748B] space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#047857] mx-auto" />
              <p className="font-bold text-sm text-[#202A5A]">No validation issues found in this view</p>
              <p className="text-xs">All records under selected criteria passed validation checks.</p>
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <div key={issue.id} className="p-4 hover:bg-[#F5F7FB]/50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Issue Description & Rule */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {issue.severity === 'error' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]">
                          Error
                        </span>
                      )}
                      {issue.severity === 'warning' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
                          Warning
                        </span>
                      )}
                      {issue.severity === 'needs_review' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#CFFAFE] text-[#0891B2] border border-[#0891B2]/30">
                          Needs Review
                        </span>
                      )}

                      <span className="font-bold text-xs text-[#202A5A]">{issue.rule}</span>
                      <span className="text-xs text-[#64748B]">•</span>
                      <span className="font-mono text-xs font-semibold text-[#0891B2]">{issue.field}</span>

                      {issue.status === 'resolved' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D1FAE5] text-[#047857]">
                          ✓ RESOLVED
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#25304A] font-medium leading-relaxed">
                      {issue.message}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#64748B]">
                      <span>Record: <strong className="text-[#202A5A] font-mono">{issue.recordId}</strong></span>
                      <span>•</span>
                      <span>Survey No: <strong className="text-[#202A5A]">{issue.surveyNumber}</strong></span>
                      <span>•</span>
                      <span>Location: <strong>{issue.village}, {issue.district}</strong></span>
                      <span>•</span>
                      <span>Current Value: <code className="bg-[#F5F7FB] px-1 py-0.5 rounded border border-[#E2E8F0] text-[#202A5A]">{issue.currentValue}</code></span>
                    </div>

                    {/* Regulatory Context note */}
                    {issue.regulatoryContext && (
                      <div className="text-[11px] text-[#64748B] bg-[#F5F7FB] p-2 rounded border border-[#E2E8F0] mt-1">
                        <strong className="text-[#202A5A]">DILRMP Standard:</strong> {issue.regulatoryContext}
                      </div>
                    )}
                  </div>

                  {/* Right Actions: AI Explain & Review Issue */}
                  <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
                    <button
                      onClick={() => explainIssueWithAi(issue)}
                      className="px-3 py-1.5 rounded-lg border border-[#0891B2] bg-white hover:bg-[#CFFAFE]/20 text-[#0891B2] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>Explain with AI</span>
                    </button>

                    {issue.status === 'open' ? (
                      <button
                        onClick={() => openResolutionModal(issue)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#0891B2] hover:bg-[#0E7490] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <span>Review Issue</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-[#047857] flex items-center gap-1 px-3 py-1.5 bg-[#D1FAE5] rounded-lg">
                        <Check className="w-3.5 h-3.5" /> Signed Off
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* AI Explainability Modal */}
      {explainingIssue && (
        <div className="fixed inset-0 bg-[#202A5A]/60 z-50 flex items-center justify-center p-4 backdrop-blur-2xs">
          <div className="bg-white rounded-xl border border-[#E2E8F0] max-w-xl w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#202A5A] text-white">
                  <Bot className="w-4 h-4 text-[#CFFAFE]" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#202A5A]">
                    AI Validation Assistant (Gemini 3.8 Flash)
                  </h3>
                  <p className="text-[11px] text-[#64748B]">
                    Grounded explainability for {explainingIssue.rule} ({explainingIssue.field})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setExplainingIssue(null)}
                className="text-[#64748B] hover:text-[#202A5A] text-lg font-bold"
              >
                &times;
              </button>
            </div>

            {isAiLoading ? (
              <div className="py-12 text-center text-xs text-[#64748B] space-y-3">
                <div className="w-6 h-6 border-2 border-[#0891B2] border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p>Querying backend Gemini 3.8 Flash intelligence engine...</p>
              </div>
            ) : aiExplanationData ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-[#F5F7FB] border border-[#E2E8F0] space-y-1">
                  <span className="font-bold text-[#202A5A] block">Technical Explanation:</span>
                  <p className="text-[#25304A] leading-relaxed">{aiExplanationData.explanation}</p>
                </div>

                <div className="p-3 rounded-lg bg-[#F5F7FB] border border-[#E2E8F0] space-y-1">
                  <span className="font-bold text-[#202A5A] block">Regulatory & Land Ledger Context:</span>
                  <p className="text-[#64748B] leading-relaxed">{aiExplanationData.regulatoryContext}</p>
                </div>

                <div className="p-3 rounded-lg bg-[#CFFAFE]/30 border border-[#0891B2]/30 space-y-1">
                  <span className="font-bold text-[#0891B2] block">Recommended Revenue Officer Action:</span>
                  <p className="text-[#202A5A] leading-relaxed">{aiExplanationData.recommendedAction}</p>
                </div>

                <div className="text-[10px] text-[#64748B] italic pt-1">
                  Note: Explanations provide administrative audit guidance and do not declare judicial title.
                </div>
              </div>
            ) : null}

            <div className="pt-3 border-t border-[#E2E8F0] flex justify-end">
              <button
                onClick={() => setExplainingIssue(null)}
                className="px-4 py-2 bg-[#202A5A] text-white rounded-lg text-xs font-semibold hover:bg-[#2D3A7A]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Issue Sign-Off Modal */}
      {reviewingIssue && (
        <div className="fixed inset-0 bg-[#202A5A]/60 z-50 flex items-center justify-center p-4 backdrop-blur-2xs">
          <div className="bg-white rounded-xl border border-[#E2E8F0] max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <h3 className="font-bold text-base text-[#202A5A]">
                  Review Issue Resolution
                </h3>
                <p className="text-xs text-[#64748B]">
                  Issue: {reviewingIssue.rule} ({reviewingIssue.recordId})
                </p>
              </div>
              <button
                onClick={() => setReviewingIssue(null)}
                className="text-[#64748B] hover:text-[#202A5A] text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-[#F5F7FB] border border-[#E2E8F0]">
                <span className="text-[#64748B] block">Current Discrepancy:</span>
                <span className="font-semibold text-[#202A5A]">{reviewingIssue.message}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A5A] mb-1">
                  Reviewer Resolution & Audit Note:
                </label>
                <textarea
                  rows={3}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Record your verification findings (e.g. cross-referenced with mutation register Ferfar 4892)..."
                  className="w-full p-2.5 text-xs border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#0891B2] bg-white text-[#202A5A]"
                />
              </div>

              <div className="text-[11px] text-[#64748B]">
                Reviewing Officer: <strong className="text-[#202A5A]">{userRole}</strong>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
              <button
                onClick={() => setReviewingIssue(null)}
                className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-[#64748B] hover:bg-[#F5F7FB]"
              >
                Cancel
              </button>
              <button
                onClick={handleResolveIssue}
                className="px-4 py-1.5 rounded-lg bg-[#047857] hover:bg-[#065F46] text-white text-xs font-semibold transition-colors"
              >
                Sign Off & Mark Resolved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
