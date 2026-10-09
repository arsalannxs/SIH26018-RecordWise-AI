import { LandRecord, ValidationIssue, DuplicatePair, UploadedDocument } from '../types';

export const INITIAL_RECORDS: LandRecord[] = [
  {
    id: 'REC-MH-2024-1024A',
    surveyNumber: 'SUR-1024/2A',
    subDivisionNumber: '2A',
    parcelGatNumber: 'GAT-412',
    parcelId: 'ULPIN-27-025-1024-001',
    village: 'Wagholi',
    taluka: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra',
    recordedArea: 1850,
    unitOfMeasurement: 'sq.m',
    landUse: 'Agricultural',
    sourceDocument: '7_12_Extract_Wagholi_SUR1024_2024.pdf',
    sourceDocumentType: '7/12 Extract (Satbara)',
    recordReferenceNumber: 'REV/PUN/HAV/2024/1024-2A',
    recordDate: '2024-01-18',
    ownersOrParties: [
      { name: 'Ramesh Balasaheb Shinde', share: '1/2', relationType: 'Self' },
      { name: 'Suresh Balasaheb Shinde', share: '1/2', relationType: 'Brother' }
    ],
    extractionConfidence: 94,
    fieldStatuses: {
      surveyNumber: 'clearly_extracted',
      parcelGatNumber: 'clearly_extracted',
      village: 'clearly_extracted',
      taluka: 'clearly_extracted',
      district: 'clearly_extracted',
      recordedArea: 'needs_review',
      landUse: 'clearly_extracted',
      recordReferenceNumber: 'clearly_extracted'
    },
    fieldConfidences: {
      surveyNumber: 98,
      parcelGatNumber: 95,
      village: 96,
      taluka: 94,
      district: 99,
      recordedArea: 78,
      landUse: 92,
      recordReferenceNumber: 91
    },
    validationStatus: 'warning',
    reviewStatus: 'in_review',
    lastUpdated: '2026-03-12 11:42 AM',
    lastUpdatedBy: 'Operator Sharma (ID: OP-412)',
    notes: 'Pot-Hissa subdivision recorded in 2024. Area differs by 30 sq.m from 1984 baseline ledger.',
    rawOcrText: `महाराष्ट्र शासन - महसूल व वन विभाग
गाव नमुना सात (अधिकार अभिलेख पत्रक) व गाव नमुना बारा (पिकांची नोंदवही)
गाव: वाघोली | तालुका: हवेली | जिल्हा: पुणे
भूमापन क्रमांक / सर्व्हे क्र.: SUR-1024/2A | गट क्र.: 412
एकूण क्षेत्र: ०.१८५० हेक्टर / १८५० चौ. मी. (1,850 sq. m)
भोगवटदाराचे नाव: रमेश बाळासाहेब शिंदे (हिस्सा १/२), सुरेश बाळासाहेब शिंदे (हिस्सा १/२)
फेरफार नोंद क्रमांक: 4892 (दिनांक: १८/०१/२०२४)
जलसिंचन पद्धत: विहीर / उपसा सिंचन | जमिनीचा प्रकार: जिरायत वर्ग १`,
    auditHistory: [
      {
        id: 'aud-1',
        timestamp: '2026-03-12 09:15 AM',
        user: 'System OCR Engine v2.4',
        action: 'INITIAL_EXTRACTION',
        details: 'Extracted 12 fields from 7_12_Extract_Wagholi_SUR1024_2024.pdf'
      },
      {
        id: 'aud-2',
        timestamp: '2026-03-12 10:30 AM',
        user: 'Operator Sharma',
        action: 'FLAG_AREA_CHECK',
        details: 'Flagged recorded area (1,850 sq.m) for potential duplicate reconciliation against legacy record'
      }
    ],
    geometryNotes: 'Cadastral sheet Haveli-Wagholi Sheet 04, parcel boundary intersects with adjacent plot 1024/1.',
    isSimulatedDemo: true
  },
  {
    id: 'REC-MH-1984-1024B',
    surveyNumber: 'SUR-1024',
    subDivisionNumber: 'Unpartitioned',
    parcelGatNumber: 'GAT-412',
    parcelId: 'ULPIN-27-025-1024-LEGACY',
    village: 'Wagholi',
    taluka: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra',
    recordedArea: 1820,
    unitOfMeasurement: 'sq.m',
    landUse: 'Agricultural',
    sourceDocument: 'Wagholi_Register_Survey_1024_1984.jpg',
    sourceDocumentType: 'Handwritten Register',
    recordReferenceNumber: 'REV/PUN/HAV/84/1024',
    recordDate: '1984-06-14',
    ownersOrParties: [
      { name: 'Balasaheb Tukaram Shinde', share: 'Sole Owner', relationType: 'Deceased' }
    ],
    extractionConfidence: 74,
    fieldStatuses: {
      surveyNumber: 'clearly_extracted',
      parcelGatNumber: 'clearly_extracted',
      village: 'clearly_extracted',
      taluka: 'clearly_extracted',
      district: 'clearly_extracted',
      recordedArea: 'needs_review',
      landUse: 'clearly_extracted',
      recordReferenceNumber: 'user_corrected'
    },
    fieldConfidences: {
      surveyNumber: 88,
      parcelGatNumber: 82,
      village: 90,
      taluka: 85,
      district: 92,
      recordedArea: 68,
      landUse: 75,
      recordReferenceNumber: 71
    },
    validationStatus: 'warning',
    reviewStatus: 'flagged',
    lastUpdated: '2026-03-11 04:10 PM',
    lastUpdatedBy: 'Operator Deshmukh (ID: OP-108)',
    notes: 'Legacy colonial-metric transition register. Ink fading on right margin.',
    rawOcrText: `जिल्हा पुणे, तालुका हवेली, मौजे वाघोली
साल १९८४-८५ गाव दप्तर नंबर ७
सर्व्हे नंबर १०२४ | गट नंबर ४१२
क्षेत्र: १८२० चौ. मी. (1820 sq. mtrs)
खातेदार: बाळासाहेब तुकाराम शिंदे
नोंद तारीख: १४ जून १९८४`,
    auditHistory: [
      {
        id: 'aud-3',
        timestamp: '2026-03-11 02:20 PM',
        user: 'System OCR Engine v2.4',
        action: 'INITIAL_EXTRACTION',
        details: 'Handwritten extraction with confidence 74%'
      },
      {
        id: 'aud-4',
        timestamp: '2026-03-11 03:45 PM',
        user: 'Operator Deshmukh',
        action: 'USER_CORRECTION',
        fieldChanged: 'recordReferenceNumber',
        previousValue: 'REV/PUN/HAV/84/10??',
        newValue: 'REV/PUN/HAV/84/1024',
        details: 'Manually deciphered smudged reference number from register header'
      }
    ],
    geometryNotes: 'Unpartitioned ancestral boundary before 2024 family settlement.',
    isSimulatedDemo: true
  },
  {
    id: 'REC-KA-2025-0142',
    surveyNumber: 'SUR-142/B',
    subDivisionNumber: 'B',
    parcelGatNumber: 'Hissa-02',
    parcelId: 'ULPIN-29-012-0142-002',
    village: 'Devanahalli',
    taluka: 'Devanahalli',
    district: 'Bengaluru Rural',
    state: 'Karnataka',
    recordedArea: 2.45,
    unitOfMeasurement: 'Acre',
    landUse: 'Agricultural',
    sourceDocument: 'Bhoomi_RTC_Devanahalli_142B.pdf',
    sourceDocumentType: 'Bhoomi RTC',
    recordReferenceNumber: 'RTC/BLR/DEV/2025/142-B',
    recordDate: '2025-08-20',
    ownersOrParties: [
      { name: 'K. Muniraju Gowda', share: 'Full', relationType: 'Self' }
    ],
    extractionConfidence: 98,
    fieldStatuses: {
      surveyNumber: 'clearly_extracted',
      parcelGatNumber: 'clearly_extracted',
      village: 'clearly_extracted',
      taluka: 'clearly_extracted',
      district: 'clearly_extracted',
      recordedArea: 'clearly_extracted',
      landUse: 'clearly_extracted',
      recordReferenceNumber: 'clearly_extracted'
    },
    fieldConfidences: {
      surveyNumber: 99,
      parcelGatNumber: 98,
      village: 99,
      taluka: 97,
      district: 99,
      recordedArea: 98,
      landUse: 96,
      recordReferenceNumber: 97
    },
    validationStatus: 'valid',
    reviewStatus: 'approved',
    lastUpdated: '2026-03-10 03:15 PM',
    lastUpdatedBy: 'Reviewer Patil (ID: REV-019)',
    notes: 'Bhoomi digital RTC extract matched with e-Swathu and revenue ledger seamlessly.',
    rawOcrText: `ಕರ್ನಾಟಕ ಸರ್ಕಾರ - ಕಂದಾಯ ಇಲಾಖೆ
ಭೂಮಿ ತಂತ್ರಾಂಶ: ಆರ್‌ಟಿಸಿ (ಪಹಣಿ) - ನಮೂನೆ ೧೬
ಗ್ರಾಮ: ದೇವನಹಳ್ಳಿ | ತಾಲೂಕು: ದೇವನಹಳ್ಳಿ | ಜಿಲ್ಲೆ: ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ
ಸರ್ವೆ ನಂಬರ್: 142/B | ಹಿಸ್ಸಾ: 2
ವಿಸ್ತೀರ್ಣ: 2 ಎಕರೆ 18 ಗುಂಟೆ (2.45 Acres)
ಖಾತೆದಾರರ ಹೆಸರು: ಕೆ. ಮುನಿರಾಜು ಗೌಡ
ಖಾತೆ ಸಂಖ್ಯೆ: 841 | ಮ್ಯುಟೇಶನ್ ಸಂಖ್ಯೆ: T-204/2024`,
    auditHistory: [
      {
        id: 'aud-5',
        timestamp: '2026-03-10 02:00 PM',
        user: 'System OCR Engine v2.4',
        action: 'INITIAL_EXTRACTION',
        details: 'High-confidence automated extraction from digital RTC'
      },
      {
        id: 'aud-6',
        timestamp: '2026-03-10 03:15 PM',
        user: 'Reviewer Patil',
        action: 'APPROVAL',
        details: 'Approved digital record without modifications'
      }
    ],
    geometryNotes: 'Clear GIS polygon confirmed with Karnataka Geo-Spatial Portal.',
    isSimulatedDemo: true
  },
  {
    id: 'REC-UP-2023-0482',
    surveyNumber: 'KHASRA-89/1',
    subDivisionNumber: '1',
    parcelGatNumber: 'Khata-00482',
    parcelId: 'ULPIN-09-114-0089-001',
    village: 'Fatehpur',
    taluka: 'Nawabganj',
    district: 'Barabanki',
    state: 'Uttar Pradesh',
    recordedArea: 0.625,
    unitOfMeasurement: 'Hectare',
    landUse: 'Agricultural',
    sourceDocument: 'UP_Khatauni_Fatehpur_Khata482.pdf',
    sourceDocumentType: 'Khasra / Khatauni',
    recordReferenceNumber: 'REV/UP/BRB/482/2023',
    recordDate: '2023-11-05',
    ownersOrParties: [
      { name: 'Ram Vilas Verma', share: 'Unspecified', relationType: 'Self' },
      { name: 'Smt. Malti Devi', share: 'Unspecified', relationType: 'Wife' }
    ],
    extractionConfidence: 86,
    fieldStatuses: {
      surveyNumber: 'clearly_extracted',
      parcelGatNumber: 'clearly_extracted',
      village: 'clearly_extracted',
      taluka: 'clearly_extracted',
      district: 'clearly_extracted',
      recordedArea: 'clearly_extracted',
      landUse: 'needs_review',
      recordReferenceNumber: 'clearly_extracted'
    },
    fieldConfidences: {
      surveyNumber: 94,
      parcelGatNumber: 92,
      village: 95,
      taluka: 89,
      district: 97,
      recordedArea: 91,
      landUse: 62,
      recordReferenceNumber: 88
    },
    validationStatus: 'needs_review',
    reviewStatus: 'pending',
    lastUpdated: '2026-03-09 11:20 AM',
    lastUpdatedBy: 'Operator Tiwari (ID: OP-203)',
    notes: 'Khasra crop column specifies seasonal change from paddy to non-cultivated storage.',
    rawOcrText: `राजस्व परिषद उत्तर प्रदेश
उद्धरण खतौनी (अधिकार अभिलेख)
ग्राम: फतेहपुर | परगना व तहसील: नवाबगंज | जनपद: बाराबंकी
खाता संख्या: 00482 | खसरा संख्या: 89/1
क्षेत्रफल: 0.6250 हे.
खातेदार का नाम: राम विलास वर्मा सुपुत्र बद्री प्रसाद, श्रीमती मालती देवी पत्नी राम विलास
आदेश: वाद संख्या 1402 तहसीलदार आदेशानुसार अमलदरामद`,
    auditHistory: [
      {
        id: 'aud-7',
        timestamp: '2026-03-09 11:20 AM',
        user: 'Operator Tiwari',
        action: 'INITIAL_EXTRACTION',
        details: 'Extracted from official Bhulekh Khatauni portal print'
      }
    ],
    geometryNotes: 'Bordering public irrigation canal; needs setback boundary verification.',
    isSimulatedDemo: true
  },
  {
    id: 'REC-MP-1972-0408',
    surveyNumber: 'SUR-408',
    subDivisionNumber: 'Pending',
    parcelGatNumber: 'GAT-19',
    parcelId: 'ULPIN-23-018-0408-LEGCY',
    village: 'Morar',
    taluka: 'Gwalior',
    district: 'Gwalior',
    state: 'Madhya Pradesh',
    recordedArea: 3.12,
    unitOfMeasurement: 'Bigha',
    landUse: 'Agricultural',
    sourceDocument: 'Gwalior_Khasra_Register_1972.jpg',
    sourceDocumentType: 'Handwritten Register',
    recordReferenceNumber: 'REV/MP/GWL/72/408',
    recordDate: '1972-04-10',
    ownersOrParties: [
      { name: 'Kalyan Singh Rawat', share: 'Full', relationType: 'Deceased' }
    ],
    extractionConfidence: 68,
    fieldStatuses: {
      surveyNumber: 'clearly_extracted',
      parcelGatNumber: 'needs_review',
      village: 'clearly_extracted',
      taluka: 'clearly_extracted',
      district: 'clearly_extracted',
      recordedArea: 'needs_review',
      landUse: 'missing',
      recordReferenceNumber: 'needs_review'
    },
    fieldConfidences: {
      surveyNumber: 82,
      parcelGatNumber: 58,
      village: 89,
      taluka: 84,
      district: 93,
      recordedArea: 61,
      landUse: 0,
      recordReferenceNumber: 65
    },
    validationStatus: 'error',
    reviewStatus: 'flagged',
    lastUpdated: '2026-03-08 05:40 PM',
    lastUpdatedBy: 'Operator Saini (ID: OP-330)',
    notes: 'Handwritten register from 1972. Water damage on columns 4 & 5. Unit is Standard Gwalior Bigha (approx 0.625 Acre).',
    rawOcrText: `मध्य प्रदेश भू-राजस्व अभिलेख - खसरा पंचवर्षीय (१९७२-१९७७)
मौजा: मुरार | तहसील: ग्वालियर | जिला: ग्वालियर
सर्वे नंबर: ४०८ | रकबा: ३ बीघा १२ बिस्वा (3.12 Bigha)
भूस्वामी: कल्याण सिंह सुपुत्र ग्यासीराम रावत
कैफियत: हस्तलिखित प्रविष्टि - पानी से स्याही फैली हुई`,
    auditHistory: [
      {
        id: 'aud-8',
        timestamp: '2026-03-08 05:40 PM',
        user: 'System OCR Engine v2.4',
        action: 'LOW_CONFIDENCE_FLAG',
        details: 'Handwritten extraction fell below 70% threshold. Sent to high-priority validation queue.'
      }
    ],
    geometryNotes: 'Missing cadastral coordinates in 1972 register.',
    isSimulatedDemo: true
  },
  {
    id: 'REC-MH-2024-0078',
    surveyNumber: 'SUR-78/3',
    subDivisionNumber: '3',
    parcelGatNumber: 'GAT-190',
    parcelId: 'ULPIN-27-025-0078-003',
    village: 'Chakan',
    taluka: 'Khed',
    district: 'Pune',
    state: 'Maharashtra',
    recordedArea: 4200,
    unitOfMeasurement: 'sq.m',
    landUse: 'Commercial',
    sourceDocument: '7_12_Chakan_MIDC_Zone_2024.pdf',
    sourceDocumentType: '7/12 Extract (Satbara)',
    recordReferenceNumber: 'REV/PUN/KHD/24/78-3',
    recordDate: '2024-07-22',
    ownersOrParties: [
      { name: 'Maharashtra Industrial Development Corp (MIDC)', share: 'Acquired', relationType: 'Entity' }
    ],
    extractionConfidence: 96,
    fieldStatuses: {
      surveyNumber: 'clearly_extracted',
      parcelGatNumber: 'clearly_extracted',
      village: 'clearly_extracted',
      taluka: 'clearly_extracted',
      district: 'clearly_extracted',
      recordedArea: 'clearly_extracted',
      landUse: 'clearly_extracted',
      recordReferenceNumber: 'clearly_extracted'
    },
    fieldConfidences: {
      surveyNumber: 98,
      parcelGatNumber: 97,
      village: 99,
      taluka: 96,
      district: 99,
      recordedArea: 97,
      landUse: 95,
      recordReferenceNumber: 96
    },
    validationStatus: 'valid',
    reviewStatus: 'approved',
    lastUpdated: '2026-03-07 10:10 AM',
    lastUpdatedBy: 'Reviewer Kulkarni (ID: REV-004)',
    notes: 'Non-agricultural conversion sanctioned under Section 44 Maharashtra Land Revenue Code 1966.',
    rawOcrText: `महाराष्ट्र शासन - महसूल व वन विभाग
गाव नमुना सात (अधिकार अभिलेख पत्रक) - अकृषिक (NA)
गाव: चाकण | तालुका: खेड | जिल्हा: पुणे
सर्व्हे क्र.: 78/3 | गट क्र.: 190
क्षेत्र: ०.४२०० हेक्टर (4,200 sq. m) | अकृषिक परवानगी क्र: NA/PUN/2024/991
भोगवटदार: महाराष्ट्र औद्योगिक विकास महामंडळ (MIDC) भूसंपादित`,
    auditHistory: [
      {
        id: 'aud-9',
        timestamp: '2026-03-07 10:10 AM',
        user: 'Reviewer Kulkarni',
        action: 'VERIFIED_NA_CONVERSION',
        details: 'Cross-checked NA order with Sub-Divisional Officer portal'
      }
    ],
    geometryNotes: 'Georeferenced polygon aligned with MIDC Phase II layout.',
    isSimulatedDemo: true
  }
];

export const INITIAL_VALIDATION_ISSUES: ValidationIssue[] = [
  {
    id: 'VAL-ISSUE-101',
    recordId: 'REC-MH-2024-1024A',
    recordRef: 'REV/PUN/HAV/2024/1024-2A',
    surveyNumber: 'SUR-1024/2A',
    village: 'Wagholi',
    district: 'Pune',
    field: 'recordedArea',
    severity: 'warning',
    rule: 'Area Discrepancy Across Records',
    message: 'The recorded area (1,850 sq. m) differs by +30 sq. m from the 1984 baseline register entry (1,820 sq. m) for Survey 1024.',
    currentValue: '1850 sq.m',
    suggestedAction: 'Inspect the mutation register (Ferfar entry 4892) and sub-division sketch (Pot-Hissa map) to confirm if boundary realignment occurred.',
    status: 'open',
    regulatoryContext: 'Under DoLR & Maharashtra Land Revenue Code, sub-division areas must sum exactly to original parent survey area minus recorded public reservations.'
  },
  {
    id: 'VAL-ISSUE-102',
    recordId: 'REC-MP-1972-0408',
    recordRef: 'REV/MP/GWL/72/408',
    surveyNumber: 'SUR-408',
    village: 'Morar',
    district: 'Gwalior',
    field: 'landUse',
    severity: 'error',
    rule: 'Mandatory Classification Missing',
    message: 'Land Use classification could not be extracted from water-damaged column 5 of the 1972 handwritten Khasra register.',
    currentValue: 'Not Found / Missing',
    suggestedAction: 'Designate authorized revenue operator to cross-verify physical Gwalior district record room copy (Missal Bandobast register).',
    status: 'open',
    regulatoryContext: 'Mandatory field under DILRMP National Land Record Core Standard v3.1. Records without land use classification cannot be ingested into GIS cadastral layers.'
  },
  {
    id: 'VAL-ISSUE-103',
    recordId: 'REC-UP-2023-0482',
    recordRef: 'REV/UP/BRB/482/2023',
    surveyNumber: 'KHASRA-89/1',
    village: 'Fatehpur',
    district: 'Barabanki',
    field: 'ownersOrParties',
    severity: 'needs_review',
    rule: 'Unspecified Fractional Shares',
    message: 'Co-tenancy entry lists two joint khatedars (Ram Vilas Verma and Smt. Malti Devi) without recorded fractional share breakdown (Hissa).',
    currentValue: 'Unspecified Shares',
    suggestedAction: 'Review order column or Khatauni Part-B to extract specific share percentage before digital certificate generation.',
    status: 'open',
    regulatoryContext: 'UP Revenue Code 2006 Section 31 requires definitive share recording to prevent succession ambiguity.'
  },
  {
    id: 'VAL-ISSUE-104',
    recordId: 'REC-MH-1984-1024B',
    recordRef: 'REV/PUN/HAV/84/1024',
    surveyNumber: 'SUR-1024',
    village: 'Wagholi',
    district: 'Pune',
    field: 'extractionConfidence',
    severity: 'warning',
    rule: 'Low OCR Confidence on Handwritten Script',
    message: 'Average extraction confidence is 74% due to aged Marathi Modi-influenced Devanagari script in 1984 register.',
    currentValue: '74% Confidence',
    suggestedAction: 'Operator review completed. Second-tier reviewer sign-off recommended.',
    status: 'open',
    regulatoryContext: 'Standard Operating Procedure (SOP) requires dual manual verification for documents digitized with OCR confidence under 80%.'
  }
];

export const INITIAL_DUPLICATE_PAIRS: DuplicatePair[] = [
  {
    id: 'DUP-PAIR-01',
    recordAId: 'REC-MH-2024-1024A',
    recordBId: 'REC-MH-1984-1024B',
    recordA: INITIAL_RECORDS[0],
    recordB: INITIAL_RECORDS[1],
    matchScore: 91,
    matchReason: 'Identical Geographic Coordinates, Village (Wagholi), Taluka (Haveli), District (Pune), and Survey Root (1024 / Gat 412).',
    matchingFields: ['village', 'taluka', 'district', 'state', 'parcelGatNumber', 'surveyNumberRoot'],
    conflictingFields: ['recordedArea', 'recordDate', 'ownersOrParties', 'recordReferenceNumber'],
    status: 'potential',
    reviewNotes: 'Record A is 2024 digitized Satbara (1,850 sq.m); Record B is 1984 handwritten register (1,820 sq.m). Difference of 30 sq.m.'
  }
];

export const INITIAL_DOCUMENTS: UploadedDocument[] = [
  {
    id: 'DOC-2026-001',
    name: '7_12_Extract_Wagholi_SUR1024_2024.pdf',
    size: 2450000,
    type: 'application/pdf',
    uploadDate: '2026-03-12 09:12 AM',
    category: '7/12 Extract (Satbara)',
    status: 'validated',
    extractedRecordId: 'REC-MH-2024-1024A',
    ocrConfidence: 94,
    processingTimeMs: 1420,
    isHandwritten: false
  },
  {
    id: 'DOC-2026-002',
    name: 'Wagholi_Register_Survey_1024_1984.jpg',
    size: 3890000,
    type: 'image/jpeg',
    uploadDate: '2026-03-11 02:15 PM',
    category: 'Handwritten Register',
    status: 'extracted',
    extractedRecordId: 'REC-MH-1984-1024B',
    ocrConfidence: 74,
    processingTimeMs: 2840,
    isHandwritten: true
  },
  {
    id: 'DOC-2026-003',
    name: 'Bhoomi_RTC_Devanahalli_142B.pdf',
    size: 1980000,
    type: 'application/pdf',
    uploadDate: '2026-03-10 01:50 PM',
    category: 'Bhoomi RTC',
    status: 'validated',
    extractedRecordId: 'REC-KA-2025-0142',
    ocrConfidence: 98,
    processingTimeMs: 980,
    isHandwritten: false
  },
  {
    id: 'DOC-2026-004',
    name: 'Gwalior_Khasra_Register_1972.jpg',
    size: 4420000,
    type: 'image/jpeg',
    uploadDate: '2026-03-08 05:32 PM',
    category: 'Handwritten Register',
    status: 'extracted',
    extractedRecordId: 'REC-MP-1972-0408',
    ocrConfidence: 68,
    processingTimeMs: 3100,
    isHandwritten: true
  }
];
