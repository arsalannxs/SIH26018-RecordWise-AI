export type FieldStatus = 'clearly_extracted' | 'user_corrected' | 'needs_review' | 'missing';

export type ValidationStatus = 'valid' | 'warning' | 'error' | 'needs_review';

export type ReviewStatus = 'pending' | 'in_review' | 'approved' | 'rejected' | 'flagged';

export interface OwnerParty {
  name: string;
  share?: string;
  relationType?: string;
  aadhaarMasked?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  fieldChanged?: string;
  previousValue?: string;
  newValue?: string;
  details: string;
}

export interface LandRecord {
  id: string;
  surveyNumber: string;
  subDivisionNumber?: string;
  parcelGatNumber: string;
  parcelId: string; // ULPIN or Bhu-Aadhaar
  village: string;
  taluka: string;
  district: string;
  state: string;
  recordedArea: number;
  unitOfMeasurement: 'sq.m' | 'Hectare' | 'Acre' | 'Guntha' | 'Bigha';
  landUse: 'Agricultural' | 'Non-Agricultural' | 'Residential' | 'Commercial' | 'Government Wasteland' | 'Forest';
  sourceDocument: string;
  sourceDocumentType: 'Handwritten Register' | '7/12 Extract (Satbara)' | 'Bhoomi RTC' | 'Khasra / Khatauni' | 'Cadastral Map (Naksha)';
  sourceDocumentUrl?: string;
  recordReferenceNumber: string;
  recordDate: string;
  ownersOrParties: OwnerParty[];
  extractionConfidence: number; // 0-100
  fieldStatuses: Record<string, FieldStatus>;
  fieldConfidences: Record<string, number>;
  validationStatus: ValidationStatus;
  reviewStatus: ReviewStatus;
  lastUpdated: string;
  lastUpdatedBy: string;
  notes?: string;
  rawOcrText: string;
  auditHistory: AuditLogEntry[];
  geometryNotes?: string;
  isSimulatedDemo?: boolean;
}

export interface ValidationIssue {
  id: string;
  recordId: string;
  recordRef: string;
  surveyNumber: string;
  village: string;
  district: string;
  field: string;
  severity: 'error' | 'warning' | 'needs_review';
  rule: string;
  message: string;
  currentValue: string;
  suggestedAction: string;
  status: 'open' | 'resolved' | 'dismissed';
  aiExplanation?: string;
  regulatoryContext?: string;
}

export interface DuplicatePair {
  id: string;
  recordAId: string;
  recordBId: string;
  recordA: LandRecord;
  recordB: LandRecord;
  matchScore: number; // e.g. 88%
  matchReason: string;
  matchingFields: string[];
  conflictingFields: string[];
  status: 'potential' | 'confirmed_duplicate' | 'not_a_duplicate' | 'requires_further_review';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

export interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  category: string;
  status: 'uploaded' | 'processing' | 'extracted' | 'validated' | 'error';
  previewUrl?: string;
  extractedRecordId?: string;
  ocrConfidence: number;
  processingTimeMs: number;
  isHandwritten: boolean;
  notes?: string;
}

export interface ProcessingStep {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'warning' | 'error';
  timestamp?: string;
  details?: string;
}
