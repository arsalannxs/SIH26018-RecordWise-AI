import React, { useState } from 'react';
import { RecordWiseProvider, useRecordWise } from './context/RecordWiseContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { UploadView } from './components/upload/UploadView';
import { OcrProcessingView } from './components/ocr/OcrProcessingView';
import { DigitalRecordsView } from './components/records/DigitalRecordsView';
import { ValidationCenterView } from './components/validation/ValidationCenterView';
import { DuplicateDetectionView } from './components/duplicates/DuplicateDetectionView';
import { ReportsView } from './components/reports/ReportsView';
import { SihDemoGuideModal } from './components/demo/SihDemoGuideModal';

const AppContent: React.FC = () => {
  const { currentView } = useRecordWise();
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'upload':
        return <UploadView />;
      case 'ocr':
        return <OcrProcessingView />;
      case 'records':
        return <DigitalRecordsView />;
      case 'validation':
        return <ValidationCenterView />;
      case 'duplicates':
        return <DuplicateDetectionView />;
      case 'reports':
        return <ReportsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#25304A] flex flex-col font-sans">
      {/* Sidebar (Desktop persistent, Mobile drawer) */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex-1 flex flex-col min-w-0">
        <Header onMenuToggle={() => setMobileOpen(true)} />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-[#E2E8F0] bg-white px-4 lg:px-8 py-4 text-xs text-[#64748B] no-print">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <span className="font-bold text-[#202A5A]">RecordWise AI</span> • Intelligent Land Record Digitization and Validation System
              <div className="text-[11px] text-[#64748B] mt-0.5">
                Smart India Hackathon 2026 (SIH26018) • Ministry of Rural Development, Department of Land Resources (DoLR)
              </div>
            </div>

            <div className="text-[11px]">
              <span className="font-mono text-[#0891B2] font-semibold">DILRMP Bhu-Aadhaar Compliant</span>
              <span className="mx-2">•</span>
              <span className="text-[#64748B]">Prototype Demo</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating SIH Demo Walkthrough Modal */}
      <SihDemoGuideModal />
    </div>
  );
};

export default function App() {
  return (
    <RecordWiseProvider>
      <AppContent />
    </RecordWiseProvider>
  );
}
