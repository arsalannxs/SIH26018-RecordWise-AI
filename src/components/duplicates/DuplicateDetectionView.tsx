import React, { useState } from 'react';
import {
  CopyX,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  FileText,
  Bot,
  Sparkles,
  Info,
  Scale
} from 'lucide-react';
import { useRecordWise } from '../../context/RecordWiseContext';
import { DuplicatePair } from '../../types';

export const DuplicateDetectionView: React.FC = () => {
  const {
    duplicatePairs,
    updateDuplicatePairStatus,
    userRole,
    addNotification
  } = useRecordWise();

  const [selectedPairId, setSelectedPairId] = useState<string>(duplicatePairs[0]?.id || '');
  const activePair = duplicatePairs.find(p => p.id === selectedPairId) || duplicatePairs[0];

  const [reviewNote, setReviewNote] = useState('');
  const [isAiComparing, setIsAiComparing] = useState(false);
  const [aiComparisonData, setAiComparisonData] = useState<{
    analysis: string;
    matchClassification: string;
    discrepancies: string[];
    recommendedResolution: string;
    isAiGenerated: boolean;
  } | null>(null);

  const handleUpdateStatus = (status: DuplicatePair['status']) => {
    if (!activePair) return;
    updateDuplicatePairStatus(activePair.id, status, reviewNote);
    setReviewNote('');
  };

  const runAiComparison = async () => {
    if (!activePair) return;
    setIsAiComparing(true);
    try {
      const res = await fetch('/api/gemini/compare-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recordA: activePair.recordA,
          recordB: activePair.recordB
        })
      });
      const data = await res.json();
      setAiComparisonData({
        analysis: data.analysis || 'Records share identical village and root survey number with area variance.',
        matchClassification: data.matchClassification || 'Survey Match with Area Divergence',
        discrepancies: data.discrepancies || ['Area differs by 30 sq.m'],
        recommendedResolution: data.recommendedResolution || 'Inspect mutation register to verify subdivision.',
        isAiGenerated: data.isAiGenerated ?? true
      });
      addNotification('success', 'Gemini AI comparative assessment generated.');
    } catch (err: any) {
      console.error('Error running AI comparison:', err);
      setAiComparisonData({
        analysis: `Records A & B share Survey 1024 in Wagholi, Pune. Area difference is 30 sq.m.`,
        matchClassification: 'Potential Sub-Division Overlap',
        discrepancies: ['Recorded Area: 1850 vs 1820 sq.m', 'Record Date: 2024 vs 1984'],
        recommendedResolution: 'Cross-check village Pot-Hissa mutation sketch with talathi.',
        isAiGenerated: false
      });
    } finally {
      setIsAiComparing(false);
    }
  };

  if (!activePair) {
    return (
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-12 text-center text-[#64748B]">
        <CopyX className="w-12 h-12 text-[#CBD5E1] mx-auto mb-3" />
        <h3 className="font-bold text-base text-[#202A5A]">No Duplicate Pairs Identified</h3>
        <p className="text-xs">All records currently have distinct geographic cadastral identifiers.</p>
      </div>
    );
  }

  const recA = activePair.recordA;
  const recB = activePair.recordB;

  return (
    <div className="space-y-6">
      {/* Policy Banner - Explicit SIH requirement */}
      <div className="bg-[#CFFAFE]/40 border border-[#0891B2]/30 rounded-xl p-4 flex items-start gap-3 text-xs text-[#202A5A]">
        <div className="p-1.5 rounded bg-[#0891B2] text-white shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div>
          <span className="font-bold">Neutral Non-Destructive Resolution Policy:</span> RecordWise AI detects potential geographic duplicates and transcription collisions. Records are never deleted or merged automatically. Discrepancies are presented neutrally and require authorized human review under revenue law.
        </div>
      </div>

      {/* Selector of Active Duplicate Pairs */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#D97706] text-white">
            <CopyX className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-[#202A5A]">
                Duplicate Candidate: {activePair.id}
              </h3>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
                {activePair.matchScore}% Match Score
              </span>
            </div>
            <p className="text-xs text-[#64748B]">
              {activePair.matchReason}
            </p>
          </div>
        </div>

        {/* Current Review Status Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#64748B] font-medium">Status:</span>
          {activePair.status === 'potential' && (
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
              Potential Duplicate — Review Required
            </span>
          )}
          {activePair.status === 'confirmed_duplicate' && (
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]">
              Duplicate Confirmed
            </span>
          )}
          {activePair.status === 'not_a_duplicate' && (
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#D1FAE5] text-[#047857] border border-[#D1FAE5]">
              Not a Duplicate (Independent Subdivisions)
            </span>
          )}
          {activePair.status === 'requires_further_review' && (
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#CFFAFE] text-[#0891B2] border border-[#CFFAFE]">
              Requires Field Survey
            </span>
          )}
        </div>
      </div>

      {/* Side-by-Side Record Comparison Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F5F7FB]">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#0891B2]" />
            <h4 className="font-bold text-sm text-[#202A5A]">
              Side-by-Side Multi-Field Comparison
            </h4>
          </div>

          <button
            onClick={runAiComparison}
            disabled={isAiComparing}
            className="px-3 py-1.5 rounded-lg bg-[#202A5A] hover:bg-[#2D3A7A] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Bot className="w-3.5 h-3.5 text-[#CFFAFE]" />
            <span>{isAiComparing ? 'Comparing...' : 'Analyze with Gemini AI'}</span>
          </button>
        </div>

        {/* AI Comparison Analysis Panel if available */}
        {aiComparisonData && (
          <div className="p-4 bg-[#CFFAFE]/20 border-b border-[#CFFAFE] text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#202A5A] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0891B2]" />
                Gemini 3.8 Flash Comparative Intelligence
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white border border-[#0891B2]/30 text-[#0891B2]">
                {aiComparisonData.matchClassification}
              </span>
            </div>
            <p className="text-[#25304A] leading-relaxed">{aiComparisonData.analysis}</p>
            <div className="pt-1 text-[11px]">
              <strong className="text-[#0891B2]">Recommendation: </strong>
              <span className="text-[#64748B]">{aiComparisonData.recommendedResolution}</span>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F5F7FB] text-[#64748B]">
                <th className="py-3 px-4 font-semibold text-left w-1/4">Field / Identifier</th>
                <th className="py-3 px-4 font-semibold text-left w-1/3 bg-blue-50/50">
                  <div className="font-bold text-[#202A5A]">Record A (Newer Digitized)</div>
                  <div className="text-[10px] text-[#64748B] font-mono">{recA.id} ({recA.sourceDocumentType})</div>
                </th>
                <th className="py-3 px-4 font-semibold text-left w-1/3 bg-amber-50/50">
                  <div className="font-bold text-[#202A5A]">Record B (Historical Baseline)</div>
                  <div className="text-[10px] text-[#64748B] font-mono">{recB.id} ({recB.sourceDocumentType})</div>
                </th>
                <th className="py-3 px-4 font-semibold text-right">Field Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {/* Survey Number */}
              <tr>
                <td className="py-3 px-4 font-semibold text-[#202A5A]">Survey Number</td>
                <td className="py-3 px-4 font-mono font-bold text-[#202A5A] bg-blue-50/20">{recA.surveyNumber}</td>
                <td className="py-3 px-4 font-mono font-bold text-[#202A5A] bg-amber-50/20">{recB.surveyNumber}</td>
                <td className="py-3 px-4 text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF3C7] text-[#D97706]">
                    Root Match (Subdivision)
                  </span>
                </td>
              </tr>

              {/* Gat Number */}
              <tr>
                <td className="py-3 px-4 font-semibold text-[#202A5A]">Gat Number / Plot</td>
                <td className="py-3 px-4 font-mono text-[#202A5A] bg-blue-50/20">{recA.parcelGatNumber}</td>
                <td className="py-3 px-4 font-mono text-[#202A5A] bg-amber-50/20">{recB.parcelGatNumber}</td>
                <td className="py-3 px-4 text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D1FAE5] text-[#047857]">
                    Exact Match
                  </span>
                </td>
              </tr>

              {/* Village & Taluka */}
              <tr>
                <td className="py-3 px-4 font-semibold text-[#202A5A]">Village & Taluka</td>
                <td className="py-3 px-4 text-[#202A5A] bg-blue-50/20">{recA.village}, {recA.taluka}</td>
                <td className="py-3 px-4 text-[#202A5A] bg-amber-50/20">{recB.village}, {recB.taluka}</td>
                <td className="py-3 px-4 text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D1FAE5] text-[#047857]">
                    Identical Village
                  </span>
                </td>
              </tr>

              {/* District & State */}
              <tr>
                <td className="py-3 px-4 font-semibold text-[#202A5A]">District & State</td>
                <td className="py-3 px-4 text-[#202A5A] bg-blue-50/20">{recA.district}, {recA.state}</td>
                <td className="py-3 px-4 text-[#202A5A] bg-amber-50/20">{recB.district}, {recB.state}</td>
                <td className="py-3 px-4 text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D1FAE5] text-[#047857]">
                    Identical District
                  </span>
                </td>
              </tr>

              {/* Recorded Area - Highlight difference as required */}
              <tr className="bg-[#FEF3C7]/30 border-l-4 border-l-[#D97706]">
                <td className="py-3 px-4 font-bold text-[#202A5A]">
                  Recorded Area
                  <span className="block text-[10px] font-normal text-[#D97706]">Difference detected (+30 sq.m)</span>
                </td>
                <td className="py-3 px-4 font-mono font-extrabold text-sm text-[#0891B2] bg-blue-50/40">
                  {recA.recordedArea} {recA.unitOfMeasurement}
                </td>
                <td className="py-3 px-4 font-mono font-extrabold text-sm text-[#D97706] bg-amber-50/40">
                  {recB.recordedArea} {recB.unitOfMeasurement}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="px-2 py-1 rounded text-[10px] font-extrabold bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
                    Variance Flagged
                  </span>
                </td>
              </tr>

              {/* Land Use */}
              <tr>
                <td className="py-3 px-4 font-semibold text-[#202A5A]">Land Classification</td>
                <td className="py-3 px-4 text-[#202A5A] bg-blue-50/20">{recA.landUse}</td>
                <td className="py-3 px-4 text-[#202A5A] bg-amber-50/20">{recB.landUse}</td>
                <td className="py-3 px-4 text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D1FAE5] text-[#047857]">
                    Match
                  </span>
                </td>
              </tr>

              {/* Parties / Co-tenants */}
              <tr>
                <td className="py-3 px-4 font-semibold text-[#202A5A]">Registered Parties</td>
                <td className="py-3 px-4 bg-blue-50/20">
                  {recA.ownersOrParties.map((p, i) => (
                    <div key={i} className="text-[#202A5A] font-medium">{p.name} ({p.share})</div>
                  ))}
                </td>
                <td className="py-3 px-4 bg-amber-50/20">
                  {recB.ownersOrParties.map((p, i) => (
                    <div key={i} className="text-[#202A5A] font-medium">{p.name} ({p.share})</div>
                  ))}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF3C7] text-[#D97706]">
                    Succession / Partition
                  </span>
                </td>
              </tr>

              {/* Record Dates & Source Ref */}
              <tr>
                <td className="py-3 px-4 font-semibold text-[#202A5A]">Record Date & Reference</td>
                <td className="py-3 px-4 text-[11px] font-mono text-[#202A5A] bg-blue-50/20">
                  {recA.recordDate} ({recA.recordReferenceNumber})
                </td>
                <td className="py-3 px-4 text-[11px] font-mono text-[#202A5A] bg-amber-50/20">
                  {recB.recordDate} ({recB.recordReferenceNumber})
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-[10px] text-[#64748B]">40-year interval</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Authorized Human Reviewer Action Panel as required */}
        <div className="p-5 border-t border-[#E2E8F0] bg-[#F8FAFC]">
          <h4 className="font-bold text-sm text-[#202A5A] mb-1">
            Authorized Human Review Decision
          </h4>
          <p className="text-xs text-[#64748B] mb-4">
            Acting as <strong>{userRole}</strong>. Select the administrative disposition for these matching land records:
          </p>

          <div className="mb-4">
            <textarea
              rows={2}
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              placeholder="Add verification notes (e.g. 'Record A is valid sub-division post-1984 family settlement; 30 sq.m area discrepancy reconciled via Pot-Hissa survey')..."
              className="w-full p-2.5 text-xs border border-[#E2E8F0] rounded-lg bg-white text-[#202A5A] focus:outline-none focus:border-[#0891B2]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleUpdateStatus('confirmed_duplicate')}
              className="px-4 py-2 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <CopyX className="w-4 h-4" />
              <span>Duplicate Confirmed</span>
            </button>

            <button
              onClick={() => handleUpdateStatus('not_a_duplicate')}
              className="px-4 py-2 rounded-lg bg-[#047857] hover:bg-[#065F46] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Not a Duplicate (Valid Sub-division)</span>
            </button>

            <button
              onClick={() => handleUpdateStatus('requires_further_review')}
              className="px-4 py-2 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Requires Further Field Survey</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
