import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  LandRecord,
  ValidationIssue,
  DuplicatePair,
  UploadedDocument,
  FieldStatus,
  ValidationStatus
} from '../types';
import {
  INITIAL_RECORDS,
  INITIAL_VALIDATION_ISSUES,
  INITIAL_DUPLICATE_PAIRS,
  INITIAL_DOCUMENTS
} from '../data/sampleRecords';

export type UserRole = 'Revenue Officer (SDO/Tehsildar)' | 'Digitization Operator' | 'Survey Reviewer';
export type AppView = 'dashboard' | 'upload' | 'ocr' | 'records' | 'validation' | 'duplicates' | 'reports';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
}

interface RecordWiseContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  records: LandRecord[];
  documents: UploadedDocument[];
  validationIssues: ValidationIssue[];
  duplicatePairs: DuplicatePair[];
  selectedRecordId: string | null;
  setSelectedRecordId: (id: string | null) => void;
  selectedDocumentId: string | null;
  setSelectedDocumentId: (id: string | null) => void;
  notifications: Notification[];
  addNotification: (type: Notification['type'], message: string) => void;
  dismissNotification: (id: string) => void;

  // Actions
  updateRecordField: (recordId: string, field: keyof LandRecord, value: any, note?: string) => void;
  updateRecordStatus: (recordId: string, validationStatus: ValidationStatus, reviewStatus: LandRecord['reviewStatus']) => void;
  resolveValidationIssue: (issueId: string, actionNote: string) => void;
  updateDuplicatePairStatus: (pairId: string, status: DuplicatePair['status'], notes?: string) => void;
  uploadDocument: (file: File) => Promise<UploadedDocument>;
  runFullValidationSuite: () => void;
  
  // SIH Demo workflow
  isDemoActive: boolean;
  demoStep: number;
  startSihDemo: () => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
  exitSihDemo: () => void;
  resetToDemoDefaults: () => void;

  // Metrics
  metrics: {
    totalDocuments: number;
    recordsDigitized: number;
    recordsValidated: number;
    recordsRequiringReview: number;
    averageConfidence: number;
    duplicateCount: number;
  };
}

const RecordWiseContext = createContext<RecordWiseContextType | undefined>(undefined);

export const RecordWiseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('Revenue Officer (SDO/Tehsildar)');
  const [records, setRecords] = useState<LandRecord[]>(INITIAL_RECORDS);
  const [documents, setDocuments] = useState<UploadedDocument[]>(INITIAL_DOCUMENTS);
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>(INITIAL_VALIDATION_ISSUES);
  const [duplicatePairs, setDuplicatePairs] = useState<DuplicatePair[]>(INITIAL_DUPLICATE_PAIRS);
  
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>('REC-MH-2024-1024A');
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>('DOC-2026-001');
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Demo tour state
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(1);

  const addNotification = (type: Notification['type'], message: string) => {
    const newNotif: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 4)]);
    setTimeout(() => {
      dismissNotification(newNotif.id);
    }, 6000);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const updateRecordField = (recordId: string, field: keyof LandRecord, value: any, note?: string) => {
    setRecords(prev => prev.map(rec => {
      if (rec.id !== recordId) return rec;

      const prevValue = (rec as any)[field];
      const nowStr = new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const updatedAudit = [
        ...rec.auditHistory,
        {
          id: `aud-${Date.now()}`,
          timestamp: nowStr,
          user: userRole,
          action: 'USER_CORRECTION',
          fieldChanged: String(field),
          previousValue: String(prevValue),
          newValue: String(value),
          details: note || `Manual field correction by authorized user (${userRole})`
        }
      ];

      const updatedFieldStatuses: Record<string, FieldStatus> = {
        ...rec.fieldStatuses,
        [field]: 'user_corrected'
      };

      return {
        ...rec,
        [field]: value,
        fieldStatuses: updatedFieldStatuses,
        lastUpdated: nowStr,
        lastUpdatedBy: `${userRole}`,
        auditHistory: updatedAudit
      };
    }));

    addNotification('success', `Field '${String(field)}' updated and recorded in provenance audit trail.`);
  };

  const updateRecordStatus = (recordId: string, validationStatus: ValidationStatus, reviewStatus: LandRecord['reviewStatus']) => {
    setRecords(prev => prev.map(rec => {
      if (rec.id !== recordId) return rec;
      return {
        ...rec,
        validationStatus,
        reviewStatus,
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        lastUpdatedBy: userRole
      };
    }));
    addNotification('info', `Record ${recordId} status updated to ${validationStatus.toUpperCase()} (${reviewStatus}).`);
  };

  const resolveValidationIssue = (issueId: string, actionNote: string) => {
    setValidationIssues(prev => prev.map(iss => {
      if (iss.id !== issueId) return iss;
      return {
        ...iss,
        status: 'resolved',
        suggestedAction: `Resolved by ${userRole}: ${actionNote}`
      };
    }));
    addNotification('success', `Validation issue ${issueId} marked as RESOLVED.`);
  };

  const updateDuplicatePairStatus = (pairId: string, status: DuplicatePair['status'], notes?: string) => {
    setDuplicatePairs(prev => prev.map(pair => {
      if (pair.id !== pairId) return pair;
      return {
        ...pair,
        status,
        reviewedBy: userRole,
        reviewedAt: new Date().toLocaleString(),
        reviewNotes: notes || pair.reviewNotes
      };
    }));
    addNotification('success', `Duplicate assessment updated to: ${status.replace(/_/g, ' ').toUpperCase()}`);
  };

  const uploadDocument = async (file: File): Promise<UploadedDocument> => {
    const isHandwritten = file.name.toLowerCase().includes('handwritten') || file.name.toLowerCase().includes('register');
    const newDocId = `DOC-${Date.now().toString().slice(-4)}`;
    const newDoc: UploadedDocument = {
      id: newDocId,
      name: file.name,
      size: file.size,
      type: file.type || 'application/pdf',
      uploadDate: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      category: isHandwritten ? 'Handwritten Register' : '7/12 Extract (Satbara)',
      status: 'processing',
      ocrConfidence: isHandwritten ? 76 : 95,
      processingTimeMs: Math.floor(Math.random() * 1500) + 1200,
      isHandwritten
    };

    setDocuments(prev => [newDoc, ...prev]);

    // Simulate OCR processing steps
    setTimeout(() => {
      setDocuments(prev => prev.map(d => d.id === newDocId ? { ...d, status: 'extracted' } : d));
      addNotification('info', `OCR text extraction completed for ${file.name}. Ready for structuring & validation.`);
    }, 1800);

    return newDoc;
  };

  const runFullValidationSuite = () => {
    addNotification('info', 'Running DoLR / DILRMP automated validation rules engine across all 6 records...');
    setTimeout(() => {
      addNotification('success', 'Validation engine check completed: 1 Error, 2 Warnings, 1 Inconsistency flagged.');
    }, 800);
  };

  const startSihDemo = () => {
    setIsDemoActive(true);
    setDemoStep(1);
    setCurrentView('dashboard');
    addNotification('info', 'SIH 2026 Interactive Demo Mode Started (SIH DEMO — SIMULATED DATA)');
  };

  const nextDemoStep = () => {
    setDemoStep(curr => {
      const next = curr + 1;
      if (next === 2) {
        setCurrentView('upload');
      } else if (next === 3 || next === 4 || next === 5) {
        setCurrentView('ocr');
      } else if (next === 6) {
        setCurrentView('validation');
      } else if (next === 7 || next === 8) {
        setCurrentView('duplicates');
      } else if (next === 9) {
        setCurrentView('records');
      } else if (next === 10) {
        setCurrentView('reports');
      }
      return next;
    });
  };

  const prevDemoStep = () => {
    setDemoStep(curr => Math.max(1, curr - 1));
  };

  const exitSihDemo = () => {
    setIsDemoActive(false);
    setDemoStep(1);
    addNotification('info', 'Exited SIH Demo Mode.');
  };

  const resetToDemoDefaults = () => {
    setRecords(INITIAL_RECORDS);
    setValidationIssues(INITIAL_VALIDATION_ISSUES);
    setDuplicatePairs(INITIAL_DUPLICATE_PAIRS);
    setDocuments(INITIAL_DOCUMENTS);
    setSelectedRecordId('REC-MH-2024-1024A');
    setSelectedDocumentId('DOC-2026-001');
    addNotification('info', 'Reset all records and issues to standard SIH demo state.');
  };

  // Metrics calculation
  const totalDocuments = documents.length;
  const recordsDigitized = records.length;
  const recordsValidated = records.filter(r => r.validationStatus === 'valid').length;
  const recordsRequiringReview = records.filter(r => r.validationStatus !== 'valid' || r.reviewStatus === 'in_review' || r.reviewStatus === 'pending' || r.reviewStatus === 'flagged').length;
  const averageConfidence = Math.round(
    records.reduce((acc, r) => acc + r.extractionConfidence, 0) / (records.length || 1)
  );
  const duplicateCount = duplicatePairs.filter(p => p.status === 'potential').length;

  return (
    <RecordWiseContext.Provider
      value={{
        currentView,
        setCurrentView,
        userRole,
        setUserRole,
        records,
        documents,
        validationIssues,
        duplicatePairs,
        selectedRecordId,
        setSelectedRecordId,
        selectedDocumentId,
        setSelectedDocumentId,
        notifications,
        addNotification,
        dismissNotification,
        updateRecordField,
        updateRecordStatus,
        resolveValidationIssue,
        updateDuplicatePairStatus,
        uploadDocument,
        runFullValidationSuite,
        isDemoActive,
        demoStep,
        startSihDemo,
        nextDemoStep,
        prevDemoStep,
        exitSihDemo,
        resetToDemoDefaults,
        metrics: {
          totalDocuments,
          recordsDigitized,
          recordsValidated,
          recordsRequiringReview,
          averageConfidence,
          duplicateCount
        }
      }}
    >
      {children}
    </RecordWiseContext.Provider>
  );
};

export const useRecordWise = () => {
  const context = useContext(RecordWiseContext);
  if (!context) {
    throw new Error('useRecordWise must be used within a RecordWiseProvider');
  }
  return context;
};
