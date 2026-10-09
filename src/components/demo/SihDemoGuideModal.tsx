import React from 'react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle2,
  Play,
  RotateCcw,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useRecordWise } from '../../context/RecordWiseContext';

export const SihDemoGuideModal: React.FC = () => {
  const {
    isDemoActive,
    demoStep,
    nextDemoStep,
    prevDemoStep,
    exitSihDemo,
    setCurrentView,
    setSelectedRecordId,
    updateRecordField
  } = useRecordWise();

  if (!isDemoActive) return null;

  const STEPS = [
    {
      step: 1,
      title: '1. Land Record Intelligence Dashboard',
      subtitle: 'Overview of digitization metrics and 4-stage pipeline.',
      view: 'dashboard',
      actionText: 'Proceed to Upload Records',
      action: () => setCurrentView('upload')
    },
    {
      step: 2,
      title: '2. Select Sample Land Record',
      subtitle: 'Inspect Maharashtra 7/12 Satbara extract (Wagholi, Pune).',
      view: 'upload',
      actionText: 'Open in OCR Studio',
      action: () => {
        setSelectedRecordId('REC-MH-2024-1024A');
        setCurrentView('ocr');
      }
    },
    {
      step: 3,
      title: '3. Show Extracted OCR Text',
      subtitle: 'View side-by-side scanned extract and Marathi/Devanagari text.',
      view: 'ocr',
      actionText: 'Review Structured Fields',
      action: () => setCurrentView('ocr')
    },
    {
      step: 4,
      title: '4. Structured Digital Record Fields',
      subtitle: 'Examine field-level confidence scores (Survey: 98%, Area: 78%).',
      view: 'ocr',
      actionText: 'Inspect Fields Requiring Review',
      action: () => setCurrentView('ocr')
    },
    {
      step: 5,
      title: '5. Highlight Fields Requiring Review',
      subtitle: 'Area field (1,850 sq.m) flagged with warning tag.',
      view: 'ocr',
      actionText: 'Run Multi-Tier Validation',
      action: () => setCurrentView('validation')
    },
    {
      step: 6,
      title: '6. Run Multi-Tier Validation Rules',
      subtitle: 'Area Discrepancy rule flagged against 1984 ledger baseline.',
      view: 'validation',
      actionText: 'Check Duplicate Detection',
      action: () => setCurrentView('duplicates')
    },
    {
      step: 7,
      title: '7. Detect Potential Duplicate Record',
      subtitle: 'Identify 91% match with historical Wagholi Survey 1024 register.',
      view: 'duplicates',
      actionText: 'Compare Side-by-Side',
      action: () => setCurrentView('duplicates')
    },
    {
      step: 8,
      title: '8. Side-by-Side Record Comparison',
      subtitle: 'Review 30 sq.m area divergence (1,850 vs 1,820 sq.m) neutrally.',
      view: 'duplicates',
      actionText: 'Go to Digital Records & Correct Field',
      action: () => {
        setSelectedRecordId('REC-MH-2024-1024A');
        setCurrentView('records');
      }
    },
    {
      step: 9,
      title: '9. Correct Sample Field & Audit Log',
      subtitle: 'Demonstrate authorized provenance update of subdivision details.',
      view: 'records',
      actionText: 'Generate Official Report',
      action: () => setCurrentView('reports')
    },
    {
      step: 10,
      title: '10. Generate Validation Report',
      subtitle: 'Export official DoLR certificate with compliance sign-off & PDF.',
      view: 'reports',
      actionText: 'Finish SIH Demo Tour',
      action: () => exitSihDemo()
    }
  ];

  const currentStepData = STEPS[demoStep - 1] || STEPS[0];

  const handleNext = () => {
    if (demoStep === 10) {
      exitSihDemo();
    } else {
      nextDemoStep();
    }
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-[480px] z-50 animate-in slide-in-from-bottom-4 duration-200">
      <div className="bg-[#202A5A] text-white rounded-xl shadow-2xl border border-[#0891B2]/40 overflow-hidden">
        {/* Header bar */}
        <div className="bg-[#171F44] px-4 py-2.5 flex items-center justify-between border-b border-[#2D3A7A]">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-[#0891B2] text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="font-bold text-xs tracking-wider uppercase text-white">
              SIH 2026 Interactive Demo Mode
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#0891B2]/30 text-[#CFFAFE] border border-[#0891B2]/40">
              Step {demoStep} of 10
            </span>
            <button
              onClick={exitSihDemo}
              className="text-white/70 hover:text-white p-1 rounded"
              title="Close Demo Guide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Content */}
        <div className="p-4 space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-white">{currentStepData.title}</h4>
            </div>
            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              {currentStepData.subtitle}
            </p>
          </div>

          <div className="px-2.5 py-1.5 rounded bg-[#101633] border border-[#2D3A7A] flex items-center justify-between text-[11px]">
            <span className="text-[#94A3B8]">Data Status:</span>
            <span className="font-semibold text-[#CFFAFE]">SIH DEMO — SIMULATED DATA</span>
          </div>

          {/* Stepper Progress dots */}
          <div className="flex items-center justify-between gap-1 py-1">
            {STEPS.map((s) => (
              <div
                key={s.step}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  s.step === demoStep
                    ? 'bg-[#0891B2]'
                    : s.step < demoStep
                    ? 'bg-[#047857]'
                    : 'bg-[#2D3A7A]'
                }`}
              />
            ))}
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={prevDemoStep}
              disabled={demoStep === 1}
              className="px-3 py-1.5 rounded-lg border border-[#2D3A7A] text-xs font-semibold text-[#CBD5E1] hover:bg-white/5 disabled:opacity-30 flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              className="px-4 py-1.5 rounded-lg bg-[#0891B2] hover:bg-[#0E7490] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span>{demoStep === 10 ? 'Complete Walkthrough' : 'Next Step'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
