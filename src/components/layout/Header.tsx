import React from 'react';
import {
  Menu,
  Sparkles,
  UserCheck,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
  FileCheck2
} from 'lucide-react';
import { useRecordWise, UserRole } from '../../context/RecordWiseContext';

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const {
    currentView,
    userRole,
    setUserRole,
    startSihDemo,
    isDemoActive,
    resetToDemoDefaults,
    notifications,
    dismissNotification
  } = useRecordWise();

  const roleOptions: UserRole[] = [
    'Revenue Officer (SDO/Tehsildar)',
    'Digitization Operator',
    'Survey Reviewer'
  ];

  const viewTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Land Record Intelligence Dashboard',
      subtitle: 'Digitize, review and validate land records in one place.'
    },
    upload: {
      title: 'Upload Land Records',
      subtitle: 'Ingest scanned legacy PDFs, cadastral maps, and revenue registers.'
    },
    ocr: {
      title: 'OCR & Document Processing',
      subtitle: 'Side-by-side text extraction, confidence scoring and field mapping.'
    },
    records: {
      title: 'Digital Land Records Registry',
      subtitle: 'Searchable master digital records with full provenance audit trail.'
    },
    validation: {
      title: 'Multi-Tier Validation Center',
      subtitle: 'Automated geometric, spatial, and numerical consistency checks.'
    },
    duplicates: {
      title: 'Duplicate Detection & Record Comparison',
      subtitle: 'Identify overlapping survey identifiers, ULPIN conflicts, and area divergence.'
    },
    reports: {
      title: 'Digitization & Validation Reports',
      subtitle: 'Generate and download official compliance reports for DoLR.'
    }
  };

  const currentInfo = viewTitles[currentView] || {
    title: 'Land Record Intelligence System',
    subtitle: 'From Old Land Records to Trusted Digital Data.'
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-[#E2E8F0] px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        {/* Left: Mobile trigger & Page Titles */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg text-[#202A5A] hover:bg-[#F5F7FB] border border-[#E2E8F0] lg:hidden"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg lg:text-xl font-bold text-[#202A5A] tracking-tight">
                {currentInfo.title}
              </h1>
              {isDemoActive && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#CFFAFE] text-[#0891B2] border border-[#0891B2]/30">
                  <Sparkles className="w-3 h-3 text-[#0891B2]" />
                  DEMO ACTIVE
                </span>
              )}
            </div>
            <p className="text-xs text-[#64748B] hidden sm:block">
              {currentInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Actions & Role Selector */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Reset Demo button */}
          <button
            onClick={resetToDemoDefaults}
            title="Reset data to initial state"
            className="p-2 rounded-lg text-[#64748B] hover:text-[#202A5A] hover:bg-[#F5F7FB] border border-[#E2E8F0] text-xs flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden md:inline">Reset Demo</span>
          </button>

          {/* User Role Selector */}
          <div className="relative flex items-center">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5F7FB] border border-[#E2E8F0] text-xs">
              <UserCheck className="w-3.5 h-3.5 text-[#0891B2]" />
              <span className="text-[#64748B] font-medium">Role:</span>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as UserRole)}
                className="bg-transparent font-semibold text-[#202A5A] outline-none cursor-pointer pr-1"
              >
                {roleOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Primary Action Button: Run SIH Demo */}
          <button
            onClick={startSihDemo}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shadow-xs ${
              isDemoActive
                ? 'bg-[#202A5A] text-white hover:bg-[#2D3A7A]'
                : 'bg-[#0891B2] text-white hover:bg-[#0E7490]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#CFFAFE]" />
            <span className="whitespace-nowrap">
              {isDemoActive ? 'Demo Guide' : 'Run SIH Demo'}
            </span>
          </button>
        </div>
      </header>

      {/* Floating Toast Notification Bar */}
      {notifications.length > 0 && (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`pointer-events-auto p-3 rounded-lg shadow-lg border flex items-start gap-3 transition-all transform animate-in fade-in slide-in-from-bottom-2 duration-200 ${
                notif.type === 'success'
                  ? 'bg-white border-[#D1FAE5] text-[#25304A]'
                  : notif.type === 'warning'
                  ? 'bg-white border-[#FDE68A] text-[#25304A]'
                  : notif.type === 'error'
                  ? 'bg-white border-[#FECACA] text-[#25304A]'
                  : 'bg-white border-[#CFFAFE] text-[#25304A]'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {notif.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#047857]" />}
                {notif.type === 'warning' && <AlertTriangle className="w-4 h-4 text-[#D97706]" />}
                {notif.type === 'error' && <XCircle className="w-4 h-4 text-[#DC2626]" />}
                {notif.type === 'info' && <Info className="w-4 h-4 text-[#0891B2]" />}
              </div>

              <div className="flex-1 text-xs">
                <p className="font-medium text-[#25304A] leading-relaxed">{notif.message}</p>
                <span className="text-[10px] text-[#64748B] mt-0.5 block">{notif.timestamp}</span>
              </div>

              <button
                onClick={() => dismissNotification(notif.id)}
                className="text-[#64748B] hover:text-[#25304A] p-0.5 rounded"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
