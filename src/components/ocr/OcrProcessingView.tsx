import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Edit3,
  Save,
  Clock,
  ShieldAlert,
  ArrowRight,
  Eye,
  Info,
  Layers,
  Bot,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { useRecordWise } from '../../context/RecordWiseContext';
import { LandRecord, FieldStatus } from '../../types';

export const OcrProcessingView: React.FC = () => {
  const {
    records,
    selectedRecordId,
    setSelectedRecordId,
    updateRecordField,
    setCurrentView,
    addNotification
  } = useRecordWise();

  const activeRecord = records.find(r => r.id === selectedRecordId) || records[0];

  const [activeTab, setActiveTab] = useState<'structured' | 'raw_ocr' | 'document_preview'>('structured');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<any>('');
  
  // Gemini AI Analysis State
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<{
    summary: string;
    anomalyWarnings: string[];
    isAiGenerated: boolean;
  } | null>(null);

  const startEdit = (fieldName: string, currentValue: any) => {
    setEditingField(fieldName);
    setTempValue(currentValue);
  };

  const saveEdit = (field: keyof LandRecord) => {
    if (editingField) {
      updateRecordField(activeRecord.id, field, tempValue, `Manual correction via OCR Structuring Studio`);
      setEditingField(null);
    }
  };

  const cancelEdit = () => {
    setEditingField(null);
  };

  // Call backend Gemini API to analyze raw OCR text
  const runAiAnalysis = async () => {
    setIsAiAnalyzing(true);
    try {
      const res = await fetch('/api/gemini/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText: activeRecord.rawOcrText,
          docName: activeRecord.sourceDocument
        })
      });
      const data = await res.json();
      setAiAnalysisResult({
        summary: data.summary || 'Document parsed successfully.',
        anomalyWarnings: data.anomalyWarnings || [],
        isAiGenerated: data.isAiGenerated ?? true
      });
      addNotification('success', 'Gemini AI document intelligence completed.');
    } catch (err: any) {
      console.error('Failed to run AI analysis:', err);
      setAiAnalysisResult({
        summary: 'Rule-based analysis: Indian revenue record with regional cadastral indicators.',
        anomalyWarnings: ['AI server request timed out. Showing rule-based heuristic check.'],
        isAiGenerated: false
      });
      addNotification('warning', 'AI service unavailable; fallback to rule-based heuristics.');
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const getStatusBadge = (status?: FieldStatus) => {
    switch (status) {
      case 'clearly_extracted':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#D1FAE5] text-[#047857]">
            <CheckCircle2 className="w-3 h-3" /> Clearly Extracted
          </span>
        );
      case 'user_corrected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#CFFAFE] text-[#0891B2]">
            <Edit3 className="w-3 h-3" /> User Corrected
          </span>
        );
      case 'needs_review':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#FEF3C7] text-[#D97706]">
            <AlertTriangle className="w-3 h-3" /> Needs Review
          </span>
        );
      case 'missing':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#FEE2E2] text-[#DC2626]">
            <ShieldAlert className="w-3 h-3" /> Missing
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#F5F7FB] text-[#64748B]">
            Extracted
          </span>
        );
    }
  };

  const getConfidenceBadge = (score?: number) => {
    if (score === undefined) return null;
    let colorClass = 'text-[#047857] bg-[#D1FAE5]';
    if (score < 75) colorClass = 'text-[#DC2626] bg-[#FEE2E2]';
    else if (score < 85) colorClass = 'text-[#D97706] bg-[#FEF3C7]';

    return (
      <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold ${colorClass}`}>
        {score}% OCR
      </span>
    );
  };

  // 6 Processing Stages required by section 9
  const processingStages = [
    { num: 1, label: 'Document Uploaded', done: true },
    { num: 2, label: 'Text Extraction', done: true },
    { num: 3, label: 'Field Identification', done: true },
    { num: 4, label: 'Data Structuring', done: true },
    { num: 5, label: 'Validation', done: activeRecord.validationStatus !== 'needs_review' },
    { num: 6, label: 'Review Required', done: activeRecord.reviewStatus === 'approved', current: activeRecord.reviewStatus !== 'approved' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Selector & Record Switcher */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#202A5A] text-white">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-[#202A5A]">{activeRecord.id}</h3>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#F5F7FB] text-[#202A5A] border border-[#E2E8F0]">
                {activeRecord.sourceDocumentType}
              </span>
            </div>
            <p className="text-xs text-[#64748B]">
              Source: <span className="font-mono text-[#202A5A]">{activeRecord.sourceDocument}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <label className="text-xs text-[#64748B] font-semibold whitespace-nowrap">
            Switch Record:
          </label>
          <select
            value={activeRecord.id}
            onChange={(e) => setSelectedRecordId(e.target.value)}
            className="text-xs font-medium border border-[#E2E8F0] rounded-lg px-3 py-1.5 bg-[#F5F7FB] text-[#202A5A] focus:outline-none focus:border-[#0891B2]"
          >
            {records.map((r) => (
              <option key={r.id} value={r.id}>
                {r.surveyNumber} — {r.village} ({r.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 6 Processing Stages Progress Indicator as required */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-2xs">
        <div className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3">
          Processing Stages (Stage 1 to 6)
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {processingStages.map((stage) => (
            <div
              key={stage.num}
              className={`p-2.5 rounded-lg border text-center transition-colors ${
                stage.done
                  ? 'border-[#D1FAE5] bg-[#D1FAE5]/30 text-[#047857]'
                  : stage.current
                  ? 'border-[#0891B2] bg-[#CFFAFE]/30 text-[#0891B2] ring-1 ring-[#0891B2]'
                  : 'border-[#E2E8F0] bg-[#F5F7FB] text-[#64748B]'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${
                  stage.done ? 'bg-[#047857] text-white' : 'bg-[#CBD5E1] text-[#202A5A]'
                }`}>
                  {stage.num}
                </span>
                <span className="text-[11px] font-bold">
                  {stage.done ? 'Done' : stage.current ? 'In Review' : 'Pending'}
                </span>
              </div>
              <p className="text-[11px] font-medium leading-tight truncate">{stage.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Studio View with Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Document Preview & Raw OCR */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-2xs">
            {/* Tab switch header */}
            <div className="border-b border-[#E2E8F0] px-4 pt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('structured')}
                  className={`px-3 py-2 text-xs font-bold border-b-2 transition-colors ${
                    activeTab === 'structured'
                      ? 'border-[#0891B2] text-[#0891B2]'
                      : 'border-transparent text-[#64748B] hover:text-[#202A5A]'
                  }`}
                >
                  Document Scan View
                </button>
                <button
                  onClick={() => setActiveTab('raw_ocr')}
                  className={`px-3 py-2 text-xs font-bold border-b-2 transition-colors ${
                    activeTab === 'raw_ocr'
                      ? 'border-[#0891B2] text-[#0891B2]'
                      : 'border-transparent text-[#64748B] hover:text-[#202A5A]'
                  }`}
                >
                  Raw OCR Text
                </button>
              </div>

              <span className="text-[11px] text-[#64748B] font-mono">
                Avg: {activeRecord.extractionConfidence}%
              </span>
            </div>

            {/* Document Visual Preview */}
            {activeTab !== 'raw_ocr' ? (
              <div className="p-4 bg-[#F8FAFC]">
                <div className="border border-[#CBD5E1] rounded-lg bg-[#FAF8F5] p-5 shadow-inner relative overflow-hidden font-serif min-h-[460px]">
                  {/* Watermark badge */}
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/10 text-black/60 text-[10px] uppercase font-mono tracking-wider">
                    {activeRecord.sourceDocumentType}
                  </div>

                  {/* Header of Simulated Land Document */}
                  <div className="border-b-2 border-stone-800 pb-3 mb-4 text-center">
                    <p className="text-[10px] tracking-widest uppercase font-sans text-stone-600">
                      GOVERNMENT OF {activeRecord.state.toUpperCase()} • REVENUE DEPARTMENT
                    </p>
                    <h4 className="text-sm font-bold text-stone-900 mt-0.5">
                      {activeRecord.sourceDocumentType === '7/12 Extract (Satbara)'
                        ? 'गाव नमुना सात व बारा (7/12 अधिकार अभिलेख पत्रक)'
                        : activeRecord.sourceDocumentType === 'Bhoomi RTC'
                        ? 'ಭೂಮಿ ತಂತ್ರಾಂಶ: ಆರ್‌ಟಿಸಿ (ಪಹಣಿ) - RTC EXTRACT FORM 16'
                        : activeRecord.sourceDocumentType === 'Khasra / Khatauni'
                        ? 'उद्धरण खतौनी / खसरा अधिकार अभिलेख'
                        : 'REVENUE RECORD CADASTRAL REGISTER (HANDWRITTEN)'}
                    </h4>
                    <p className="text-[11px] text-stone-700 mt-1">
                      Village: <strong>{activeRecord.village}</strong> | Taluka: <strong>{activeRecord.taluka}</strong> | District: <strong>{activeRecord.district}</strong>
                    </p>
                  </div>

                  {/* Simulated Document Grid with Bounding Boxes */}
                  <div className="space-y-3 text-xs leading-relaxed text-stone-800">
                    <div className="p-2 rounded bg-amber-50/70 border border-amber-300">
                      <div className="text-[10px] uppercase font-sans text-amber-800 font-bold flex items-center justify-between">
                        <span>Survey / Cadastral Plot</span>
                        <span className="font-mono text-[9px] text-emerald-700 font-bold">OCR: 98%</span>
                      </div>
                      <div className="font-mono font-bold text-sm text-stone-900 mt-0.5">
                        {activeRecord.surveyNumber} (Gat: {activeRecord.parcelGatNumber})
                      </div>
                    </div>

                    <div className="p-2 rounded bg-sky-50/70 border border-sky-300">
                      <div className="text-[10px] uppercase font-sans text-sky-800 font-bold flex items-center justify-between">
                        <span>Recorded Parcel Area</span>
                        <span className="font-mono text-[9px] text-amber-700 font-bold">OCR: {activeRecord.fieldConfidences.recordedArea || 78}%</span>
                      </div>
                      <div className="font-mono font-bold text-sm text-stone-900 mt-0.5">
                        {activeRecord.recordedArea} {activeRecord.unitOfMeasurement}
                      </div>
                    </div>

                    <div className="p-2 rounded bg-emerald-50/70 border border-emerald-300">
                      <div className="text-[10px] uppercase font-sans text-emerald-800 font-bold">
                        Parties / Registered Khatedars
                      </div>
                      <div className="mt-1 space-y-1 font-sans text-[11px]">
                        {activeRecord.ownersOrParties.map((owner, idx) => (
                          <div key={idx} className="flex justify-between items-center border-b border-stone-200 pb-0.5">
                            <span className="font-semibold text-stone-900">{owner.name}</span>
                            <span className="text-stone-600 font-mono text-[10px]">{owner.share || 'Full'}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 text-[10px] text-stone-500 font-mono border-t border-stone-300 flex justify-between items-center">
                      <span>Ref: {activeRecord.recordReferenceNumber}</span>
                      <span>Date: {activeRecord.recordDate}</span>
                    </div>

                    {activeRecord.sourceDocumentType === 'Handwritten Register' && (
                      <div className="p-2 rounded bg-amber-100/70 border border-amber-400 text-[11px] text-amber-900 font-sans">
                        <strong>Notice:</strong> Aged physical register entry. OCR extraction assisted by Indian regional script models. Manual human reviewer approval mandatory.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-stone-900 text-emerald-400 font-mono text-xs rounded-b-lg overflow-x-auto min-h-[460px] whitespace-pre-wrap">
                {activeRecord.rawOcrText}
              </div>
            )}

            {/* AI Assistance Trigger in Left Column */}
            <div className="p-4 bg-white border-t border-[#E2E8F0] space-y-3">
              <button
                onClick={runAiAnalysis}
                disabled={isAiAnalyzing}
                className="w-full py-2.5 px-4 rounded-lg bg-[#202A5A] hover:bg-[#2D3A7A] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Bot className="w-4 h-4 text-[#CFFAFE]" />
                <span>{isAiAnalyzing ? 'Analyzing with Gemini 3.8 Flash...' : 'Run Gemini AI Document Analysis'}</span>
              </button>

              {aiAnalysisResult && (
                <div className="p-3.5 rounded-lg bg-[#F5F7FB] border border-[#CFFAFE] text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#202A5A] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#0891B2]" />
                      AI Analysis Summary
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#CFFAFE] text-[#0891B2] font-semibold">
                      {aiAnalysisResult.isAiGenerated ? 'Gemini 3.8 Flash' : 'Rule Heuristics'}
                    </span>
                  </div>
                  <p className="text-[#25304A] text-[11px] leading-relaxed">
                    {aiAnalysisResult.summary}
                  </p>

                  {aiAnalysisResult.anomalyWarnings.length > 0 && (
                    <div className="pt-2 border-t border-[#E2E8F0]">
                      <span className="text-[10px] font-bold text-[#D97706] uppercase block mb-1">
                        Potential Transcription Flags:
                      </span>
                      <ul className="list-disc list-inside text-[11px] text-[#64748B] space-y-0.5">
                        {aiAnalysisResult.anomalyWarnings.map((warn, i) => (
                          <li key={i}>{warn}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Structured Digital Record Editable Fields */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-bold text-base text-[#202A5A]">
                  Structured Digital Record
                </h4>
                <p className="text-xs text-[#64748B]">
                  Field values mapped from OCR. Authorized users can modify and record provenance.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('validation')}
                  className="px-3 py-1.5 rounded-lg bg-[#0891B2] hover:bg-[#0E7490] text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <span>Go to Validation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Field Legend */}
            <div className="p-3 bg-[#F5F7FB] rounded-lg border border-[#E2E8F0] mb-4 flex flex-wrap items-center gap-3 text-[11px]">
              <span className="font-bold text-[#202A5A]">Field Status Legend:</span>
              <span className="inline-flex items-center gap-1 text-[#047857]">
                <span className="w-2 h-2 rounded-full bg-[#047857]"></span> Clearly Extracted
              </span>
              <span className="inline-flex items-center gap-1 text-[#0891B2]">
                <span className="w-2 h-2 rounded-full bg-[#0891B2]"></span> User Corrected
              </span>
              <span className="inline-flex items-center gap-1 text-[#D97706]">
                <span className="w-2 h-2 rounded-full bg-[#D97706]"></span> Needs Review
              </span>
              <span className="inline-flex items-center gap-1 text-[#DC2626]">
                <span className="w-2 h-2 rounded-full bg-[#DC2626]"></span> Missing
              </span>
            </div>

            {/* Editable Fields Table */}
            <div className="space-y-3">
              {/* Field 1: Survey Number */}
              <div className="p-3 rounded-lg border border-[#E2E8F0] hover:border-[#0891B2]/50 transition-colors">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#202A5A]">Survey Number / Hissa</span>
                    {getStatusBadge(activeRecord.fieldStatuses.surveyNumber)}
                  </div>
                  <div className="flex items-center gap-2">
                    {getConfidenceBadge(activeRecord.fieldConfidences.surveyNumber)}
                    {editingField !== 'surveyNumber' && (
                      <button
                        onClick={() => startEdit('surveyNumber', activeRecord.surveyNumber)}
                        className="p-1 text-[#64748B] hover:text-[#0891B2]"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {editingField === 'surveyNumber' ? (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs border border-[#0891B2] rounded-lg focus:outline-none bg-white text-[#202A5A]"
                    />
                    <button
                      onClick={() => saveEdit('surveyNumber')}
                      className="px-3 py-1.5 bg-[#0891B2] text-white text-xs font-semibold rounded-lg"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-2 py-1.5 bg-[#E2E8F0] text-[#25304A] text-xs rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="font-mono text-sm font-semibold text-[#202A5A]">
                    {activeRecord.surveyNumber}
                  </div>
                )}
              </div>

              {/* Field 2: Parcel / Gat Number */}
              <div className="p-3 rounded-lg border border-[#E2E8F0] hover:border-[#0891B2]/50 transition-colors">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#202A5A]">Gat Number / Plot Number</span>
                    {getStatusBadge(activeRecord.fieldStatuses.parcelGatNumber)}
                  </div>
                  <div className="flex items-center gap-2">
                    {getConfidenceBadge(activeRecord.fieldConfidences.parcelGatNumber)}
                    {editingField !== 'parcelGatNumber' && (
                      <button
                        onClick={() => startEdit('parcelGatNumber', activeRecord.parcelGatNumber)}
                        className="p-1 text-[#64748B] hover:text-[#0891B2]"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {editingField === 'parcelGatNumber' ? (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs border border-[#0891B2] rounded-lg focus:outline-none bg-white text-[#202A5A]"
                    />
                    <button
                      onClick={() => saveEdit('parcelGatNumber')}
                      className="px-3 py-1.5 bg-[#0891B2] text-white text-xs font-semibold rounded-lg"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-2 py-1.5 bg-[#E2E8F0] text-[#25304A] text-xs rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="font-mono text-sm font-semibold text-[#202A5A]">
                    {activeRecord.parcelGatNumber}
                  </div>
                )}
              </div>

              {/* Field 3: Recorded Area & Unit */}
              <div className="p-3 rounded-lg border border-[#E2E8F0] hover:border-[#0891B2]/50 transition-colors">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#202A5A]">Recorded Area & Measurement Unit</span>
                    {getStatusBadge(activeRecord.fieldStatuses.recordedArea)}
                  </div>
                  <div className="flex items-center gap-2">
                    {getConfidenceBadge(activeRecord.fieldConfidences.recordedArea)}
                    {editingField !== 'recordedArea' && (
                      <button
                        onClick={() => startEdit('recordedArea', activeRecord.recordedArea)}
                        className="p-1 text-[#64748B] hover:text-[#0891B2]"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {editingField === 'recordedArea' ? (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="number"
                      step="any"
                      value={tempValue}
                      onChange={(e) => setTempValue(Number(e.target.value))}
                      className="flex-1 px-3 py-1.5 text-xs border border-[#0891B2] rounded-lg focus:outline-none bg-white text-[#202A5A]"
                    />
                    <span className="text-xs font-semibold text-[#64748B]">{activeRecord.unitOfMeasurement}</span>
                    <button
                      onClick={() => saveEdit('recordedArea')}
                      className="px-3 py-1.5 bg-[#0891B2] text-white text-xs font-semibold rounded-lg"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-2 py-1.5 bg-[#E2E8F0] text-[#25304A] text-xs rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-[#202A5A]">
                      {activeRecord.recordedArea}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#F5F7FB] border border-[#E2E8F0] text-xs text-[#64748B] font-medium">
                      {activeRecord.unitOfMeasurement}
                    </span>
                    {activeRecord.fieldStatuses.recordedArea === 'needs_review' && (
                      <span className="text-[11px] text-[#D97706] font-medium ml-2">
                        ⚠ Area discrepancy flagged against legacy baseline
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Field 4: Location Hierarchy (Village, Taluka, District, State) */}
              <div className="p-3 rounded-lg border border-[#E2E8F0] hover:border-[#0891B2]/50 transition-colors">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#202A5A]">Location Hierarchy (Village / Taluka / District / State)</span>
                    {getStatusBadge(activeRecord.fieldStatuses.village)}
                  </div>
                  <div className="flex items-center gap-2">
                    {getConfidenceBadge(activeRecord.fieldConfidences.village)}
                  </div>
                </div>
                <div className="text-xs text-[#202A5A] font-medium">
                  Village <strong>{activeRecord.village}</strong>, Taluka <strong>{activeRecord.taluka}</strong>, District <strong>{activeRecord.district}</strong>, State <strong>{activeRecord.state}</strong>
                </div>
              </div>

              {/* Field 5: Land Use */}
              <div className="p-3 rounded-lg border border-[#E2E8F0] hover:border-[#0891B2]/50 transition-colors">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#202A5A]">Land Use Classification</span>
                    {getStatusBadge(activeRecord.fieldStatuses.landUse)}
                  </div>
                  <div className="flex items-center gap-2">
                    {getConfidenceBadge(activeRecord.fieldConfidences.landUse)}
                    {editingField !== 'landUse' && (
                      <button
                        onClick={() => startEdit('landUse', activeRecord.landUse)}
                        className="p-1 text-[#64748B] hover:text-[#0891B2]"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {editingField === 'landUse' ? (
                  <div className="flex items-center gap-2 mt-2">
                    <select
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs border border-[#0891B2] rounded-lg focus:outline-none bg-white text-[#202A5A]"
                    >
                      <option value="Agricultural">Agricultural</option>
                      <option value="Non-Agricultural">Non-Agricultural (Commercial / Residential)</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Residential">Residential</option>
                      <option value="Government Wasteland">Government Wasteland</option>
                      <option value="Forest">Forest</option>
                    </select>
                    <button
                      onClick={() => saveEdit('landUse')}
                      className="px-3 py-1.5 bg-[#0891B2] text-white text-xs font-semibold rounded-lg"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-2 py-1.5 bg-[#E2E8F0] text-[#25304A] text-xs rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="text-xs font-semibold text-[#202A5A]">
                    {activeRecord.landUse}
                  </div>
                )}
              </div>

              {/* Field 6: Parties / Ownership Entities */}
              <div className="p-3 rounded-lg border border-[#E2E8F0] hover:border-[#0891B2]/50 transition-colors">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-[#202A5A]">Recorded Parties / Khatedar Entities</span>
                  <span className="text-[10px] text-[#64748B] font-mono">
                    {activeRecord.ownersOrParties.length} Co-Tenants
                  </span>
                </div>
                <div className="divide-y divide-[#E2E8F0] mt-2">
                  {activeRecord.ownersOrParties.map((p, i) => (
                    <div key={i} className="py-1.5 flex items-center justify-between text-xs">
                      <span className="font-medium text-[#202A5A]">{p.name}</span>
                      <span className="text-[11px] text-[#64748B] font-mono">
                        Share: {p.share || 'Unspecified'} ({p.relationType || 'Khatedar'})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Audit Provenance Log */}
            <div className="mt-5 pt-4 border-t border-[#E2E8F0]">
              <div className="flex items-center justify-between text-xs font-bold text-[#64748B] mb-2">
                <span>Record Provenance & Audit Trail ({activeRecord.auditHistory.length} events)</span>
                <Clock className="w-3.5 h-3.5 text-[#0891B2]" />
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {activeRecord.auditHistory.map((item) => (
                  <div key={item.id} className="text-[11px] p-2 rounded bg-[#F5F7FB] border border-[#E2E8F0]">
                    <div className="flex items-center justify-between text-[#64748B]">
                      <span className="font-bold text-[#202A5A]">{item.action}</span>
                      <span className="font-mono text-[10px]">{item.timestamp}</span>
                    </div>
                    <p className="text-[#25304A] mt-0.5">{item.details}</p>
                    <span className="text-[10px] text-[#0891B2] font-semibold mt-0.5 block">
                      Actor: {item.user}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
