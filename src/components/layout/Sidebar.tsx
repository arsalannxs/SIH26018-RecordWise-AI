import React from 'react';
import {
  LayoutDashboard,
  UploadCloud,
  FileSearch,
  Database,
  ShieldAlert,
  CopyX,
  FileText,
  Sparkles,
  ChevronRight,
  Landmark,
  X
} from 'lucide-react';
import { useRecordWise, AppView } from '../../context/RecordWiseContext';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { currentView, setCurrentView, metrics, startSihDemo, isDemoActive } = useRecordWise();

  const navItems: { id: AppView; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      id: 'upload',
      label: 'Upload Records',
      icon: <UploadCloud className="w-5 h-5" />,
      badge: metrics.totalDocuments,
      badgeColor: 'bg-[#0891B2]/30 text-[#CFFAFE]'
    },
    {
      id: 'ocr',
      label: 'OCR Processing',
      icon: <FileSearch className="w-5 h-5" />
    },
    {
      id: 'records',
      label: 'Digital Records',
      icon: <Database className="w-5 h-5" />,
      badge: metrics.recordsDigitized,
      badgeColor: 'bg-white/15 text-white'
    },
    {
      id: 'validation',
      label: 'Validation Center',
      icon: <ShieldAlert className="w-5 h-5" />,
      badge: metrics.recordsRequiringReview,
      badgeColor: 'bg-[#D97706]/40 text-[#FDE68A]'
    },
    {
      id: 'duplicates',
      label: 'Duplicate Detection',
      icon: <CopyX className="w-5 h-5" />,
      badge: metrics.duplicateCount,
      badgeColor: 'bg-[#DC2626]/40 text-[#FECACA]'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <FileText className="w-5 h-5" />
    }
  ];

  const handleNavClick = (view: AppView) => {
    setCurrentView(view);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-[#202A5A]/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#202A5A] text-white flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-[#2D3A7A]`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[#2D3A7A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0891B2] flex items-center justify-center text-white shadow-sm font-bold text-xl tracking-wider">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-white tracking-tight">RecordWise AI</span>
                <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-[#0891B2] text-white">
                  SIH'26
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] font-normal leading-tight">
                Land Record Digitization & Validation
              </p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded text-white/70 hover:text-white hover:bg-white/10 lg:hidden"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SIH Banner Sub-tag */}
        <div className="px-5 py-2.5 bg-[#171F44] border-b border-[#2D3A7A]/70 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[#CFFAFE]">
            <span className="w-2 h-2 rounded-full bg-[#0891B2] animate-pulse"></span>
            <span className="font-medium text-[11px]">Ministry of Rural Development</span>
          </div>
          <span className="text-[10px] font-mono text-[#94A3B8]">DoLR (SIH26018)</span>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
            Main Workflows
          </div>

          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#0891B2] text-white shadow-xs'
                    : 'text-[#E2E8F0] hover:bg-[#2D3A7A] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-[#94A3B8]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        isActive ? 'bg-white/20 text-white' : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-4 h-4 text-white/80" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Quick Demo Trigger Card */}
        <div className="p-4 border-t border-[#2D3A7A] bg-[#1B234D]">
          <div className="bg-[#202A5A] rounded-lg p-3 border border-[#2D3A7A]">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-[#CFFAFE]" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Hackathon Mode
              </span>
            </div>
            <p className="text-[11px] text-[#CBD5E1] mb-2.5 leading-relaxed">
              Experience the 10-step end-to-end digitization & validation flow in under 2 minutes.
            </p>
            <button
              onClick={() => {
                startSihDemo();
                setMobileOpen(false);
              }}
              className={`w-full py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                isDemoActive
                  ? 'bg-[#D97706] text-white hover:bg-[#B45309]'
                  : 'bg-[#0891B2] hover:bg-[#0E7490] text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isDemoActive ? 'Resume SIH Demo' : 'Run SIH Demo'}</span>
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-[#94A3B8]">
            <span>SIH DEMO — SIMULATED DATA</span>
            <span className="font-mono text-[10px]">v1.0.4</span>
          </div>
        </div>
      </aside>
    </>
  );
};
