import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Image as ImageIcon,
  ArrowRight,
  Info,
  Clock,
  Sparkles,
  FileCheck2,
  Trash2
} from 'lucide-react';
import { useRecordWise } from '../../context/RecordWiseContext';

export const UploadView: React.FC = () => {
  const {
    documents,
    uploadDocument,
    setCurrentView,
    setSelectedDocumentId,
    setSelectedRecordId,
    addNotification
  } = useRecordWise();

  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ALLOWED_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png', 'tiff', 'tif'];
  const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

  const validateAndUpload = async (file: File) => {
    setUploadError(null);
    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      const errMsg = `Unsupported file format (.${ext}). Supported formats are PDF, JPG, JPEG, PNG, and TIFF.`;
      setUploadError(errMsg);
      addNotification('error', errMsg);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      const errMsg = `File exceeds maximum allowed size of 25MB (Current: ${(file.size / (1024 * 1024)).toFixed(2)}MB).`;
      setUploadError(errMsg);
      addNotification('error', errMsg);
      return;
    }

    if (ext === 'tiff' || ext === 'tif') {
      addNotification('info', 'TIFF format detected: Document AI ingestion converts high-resolution raster layers to standard 300 DPI preview.');
    }

    setIsUploading(true);
    try {
      const newDoc = await uploadDocument(file);
      setSelectedDocumentId(newDoc.id);
      addNotification('success', `File "${file.name}" uploaded successfully. Text extraction initialized.`);
    } catch (err: any) {
      setUploadError('Failed to process file upload: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndUpload(e.target.files[0]);
    }
  };

  // Pre-configured sample document picker for quick testing
  const selectSampleDocument = (docId: string, recordId: string) => {
    setSelectedDocumentId(docId);
    setSelectedRecordId(recordId);
    addNotification('info', `Selected sample document. Navigating to OCR Processing...`);
    setCurrentView('ocr');
  };

  return (
    <div className="space-y-6">
      {/* Informational Guidance Banner */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#CFFAFE] text-[#0891B2] shrink-0 mt-0.5">
            <Info className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-[#202A5A]">
              Land Record Ingestion Guidelines (DoLR Standard Operating Procedure)
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Upload scanned land registers, 7/12 Satbara extracts, Bhoomi RTC records, Khasra/Khatauni sheets, or Cadastral Naksha drawings.
              For handwritten registers (pre-computerization), OCR accuracy typically ranges from 65%–85%; mandatory dual manual verification will be enforced.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Drag & Drop Zone */}
        <div className="lg:col-span-2 space-y-6">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all bg-white ${
              isDragging
                ? 'border-[#0891B2] bg-[#CFFAFE]/15 scale-[0.99]'
                : 'border-[#CBD5E1] hover:border-[#0891B2]'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".pdf,.jpg,.jpeg,.png,.tiff,.tif"
              className="hidden"
            />

            <div className="w-14 h-14 mx-auto rounded-full bg-[#F5F7FB] border border-[#E2E8F0] flex items-center justify-center text-[#0891B2] mb-4">
              <UploadCloud className="w-7 h-7" />
            </div>

            <h4 className="text-base font-bold text-[#202A5A]">
              Select or Drag & Drop Land Record Document
            </h4>
            <p className="text-xs text-[#64748B] mt-1 max-w-md mx-auto">
              Supported formats: <strong className="text-[#202A5A]">PDF, JPG, JPEG, PNG, TIFF</strong> (Max 25 MB per document)
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-5 py-2.5 rounded-lg bg-[#0891B2] hover:bg-[#0E7490] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-2"
              >
                <UploadCloud className="w-4 h-4" />
                <span>{isUploading ? 'Processing Upload...' : 'Browse Local Files'}</span>
              </button>
            </div>

            {uploadError && (
              <div className="mt-4 p-3 rounded-lg bg-[#FEE2E2] border border-[#FECACA] text-xs text-[#DC2626] font-medium flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-[#E2E8F0] flex flex-wrap items-center justify-center gap-6 text-[11px] text-[#64748B]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#047857]" /> Multipage PDF Support
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#047857]" /> Devanagari & Regional OCR
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#047857]" /> 300 DPI Auto-Binarization
              </span>
            </div>
          </div>

          {/* Recently Uploaded Documents Table */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-sm text-[#202A5A]">Uploaded Ingestion Queue</h4>
              <span className="text-xs text-[#64748B]">{documents.length} Files</span>
            </div>

            <div className="divide-y divide-[#E2E8F0]">
              {documents.map((doc) => (
                <div key={doc.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#F5F7FB] text-[#202A5A] border border-[#E2E8F0]">
                      {doc.type.includes('pdf') ? (
                        <FileText className="w-4 h-4 text-[#DC2626]" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-[#0891B2]" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-[#202A5A] flex items-center gap-2">
                        <span>{doc.name}</span>
                        {doc.isHandwritten && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#FEF3C7] text-[#D97706] font-semibold">
                            Handwritten
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#64748B] flex items-center gap-2 mt-0.5">
                        <span>{(doc.size / (1024 * 1024)).toFixed(2)} MB</span>
                        <span>•</span>
                        <span>{doc.category}</span>
                        <span>•</span>
                        <span>{doc.uploadDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <span className="text-[11px] font-semibold text-[#047857] block">
                        OCR: {doc.ocrConfidence}%
                      </span>
                      <span className="text-[10px] text-[#64748B] font-mono">
                        {doc.processingTimeMs}ms
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedDocumentId(doc.id);
                        if (doc.extractedRecordId) {
                          setSelectedRecordId(doc.extractedRecordId);
                        }
                        setCurrentView('ocr');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#F5F7FB] hover:bg-[#CFFAFE] text-[#202A5A] hover:text-[#0891B2] font-semibold text-xs border border-[#E2E8F0] flex items-center gap-1.5 transition-colors"
                    >
                      <span>Process OCR</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Sample Presets for SIH Evaluation */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-2xs">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#0891B2]" />
              <h4 className="font-bold text-sm text-[#202A5A]">
                SIH Sample Land Records
              </h4>
            </div>
            <p className="text-xs text-[#64748B] mb-4">
              Click any realistic Indian land record scenario below to test the extraction and validation pipeline instantly:
            </p>

            <div className="space-y-3">
              {/* Preset 1 */}
              <div
                onClick={() => selectSampleDocument('DOC-2026-001', 'REC-MH-2024-1024A')}
                className="p-3 rounded-lg border border-[#E2E8F0] hover:border-[#0891B2] hover:bg-[#F5F7FB] cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#202A5A]">
                  <span>1. Maharashtra 7/12 Satbara (2024)</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#CFFAFE] text-[#0891B2]">
                    High Res PDF
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B] mt-1">
                  Pune, Haveli, Wagholi (SUR-1024/2A) • 1,850 sq.m
                </p>
                <span className="text-[10px] text-[#D97706] font-medium block mt-1">
                  Triggers area discrepancy validation warning (+30 sq.m)
                </span>
              </div>

              {/* Preset 2 */}
              <div
                onClick={() => selectSampleDocument('DOC-2026-002', 'REC-MH-1984-1024B')}
                className="p-3 rounded-lg border border-[#E2E8F0] hover:border-[#0891B2] hover:bg-[#F5F7FB] cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#202A5A]">
                  <span>2. Handwritten Register (1984)</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FEF3C7] text-[#D97706]">
                    Handwritten JPG
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B] mt-1">
                  Wagholi Survey 1024 baseline ledger (1,820 sq.m)
                </p>
                <span className="text-[10px] text-[#64748B] block mt-1">
                  74% OCR confidence • Triggers duplicate detection pair
                </span>
              </div>

              {/* Preset 3 */}
              <div
                onClick={() => selectSampleDocument('DOC-2026-003', 'REC-KA-2025-0142')}
                className="p-3 rounded-lg border border-[#E2E8F0] hover:border-[#0891B2] hover:bg-[#F5F7FB] cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#202A5A]">
                  <span>3. Karnataka Bhoomi RTC (2025)</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#D1FAE5] text-[#047857]">
                    Clean Digital
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B] mt-1">
                  Bengaluru Rural, Devanahalli (SUR-142/B) • 2.45 Acres
                </p>
                <span className="text-[10px] text-[#047857] block mt-1">
                  98% OCR confidence • Clean verification pass
                </span>
              </div>

              {/* Preset 4 */}
              <div
                onClick={() => selectSampleDocument('DOC-2026-004', 'REC-MP-1972-0408')}
                className="p-3 rounded-lg border border-[#E2E8F0] hover:border-[#0891B2] hover:bg-[#F5F7FB] cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#202A5A]">
                  <span>4. MP Gwalior Khasra (1972)</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FEE2E2] text-[#DC2626]">
                    Smudged Ledger
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B] mt-1">
                  Morar, Gwalior (Survey 408) • 3.12 Bigha
                </p>
                <span className="text-[10px] text-[#DC2626] font-medium block mt-1">
                  Missing column 5 • Triggers mandatory error check
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
