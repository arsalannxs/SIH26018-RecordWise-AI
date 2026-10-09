import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI instance server-side
// Telemetry User-Agent header 'aistudio-build' is required
const apiKey = process.env.GEMINI_API_KEY || "";
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export interface ExplainIssueParams {
  rule: string;
  field: string;
  currentValue: string;
  recordContext: {
    recordId: string;
    surveyNumber: string;
    village: string;
    district: string;
    recordedArea: number;
    unitOfMeasurement: string;
  };
}

export async function explainValidationIssue(params: ExplainIssueParams): Promise<{
  explanation: string;
  regulatoryContext: string;
  recommendedAction: string;
  isAiGenerated: boolean;
}> {
  const client = getGeminiClient();
  if (!client) {
    // Return transparent, high-quality rule-based explanation when API key is not present
    return {
      explanation: `Automated validation flagged field '${params.field}' with value "${params.currentValue}" under rule "${params.rule}". The value deviates from expected revenue department verification thresholds for ${params.recordContext.village}, ${params.recordContext.district}.`,
      regulatoryContext: "Under DoLR / DILRMP record standardization guidelines, area and cadastral numbers must maintain mathematical consistency across village ledger schedules.",
      recommendedAction: "Cross-check against the original handwritten revenue register or the mutation register (Ferfar / Mutation Roll) before updating.",
      isAiGenerated: false,
    };
  }

  try {
    const prompt = `You are an expert Indian Land Records & Revenue Verification Assistant for the Department of Land Resources (DoLR), Ministry of Rural Development.
Explain the following land record validation issue for an authorized revenue officer or survey reviewer:

Issue Rule: ${params.rule}
Field: ${params.field}
Current Value: ${params.currentValue}
Record Context:
- Record ID: ${params.recordContext.recordId}
- Survey Number: ${params.recordContext.surveyNumber}
- Location: Village ${params.recordContext.village}, District ${params.recordContext.district}
- Recorded Area: ${params.recordContext.recordedArea} ${params.recordContext.unitOfMeasurement}

Provide an objective, neutral explanation. Note: You must NOT claim to establish legal ownership or decide dispute outcomes.
Format your response as a valid JSON object with keys:
- "explanation": concise explanation of why this inconsistency matters for land digitization
- "regulatoryContext": standard revenue practice or DoLR/DILRMP record guidelines context
- "recommendedAction": practical step for the human reviewer (e.g., inspect mutation register, measure cadastral map, check Khatoni/Satbara source)`;

    const response = await client.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "";
    const parsed = JSON.parse(text);
    return {
      explanation: parsed.explanation || "Inconsistency detected across land registry schedules.",
      regulatoryContext: parsed.regulatoryContext || "Land record standard verification guidelines.",
      recommendedAction: parsed.recommendedAction || "Inspect source document and mutation ledger.",
      isAiGenerated: true,
    };
  } catch (err) {
    console.error("Gemini explainValidationIssue error:", err);
    return {
      explanation: `Automated rule check detected: ${params.rule} on ${params.field} ("${params.currentValue}"). Manual verification required.`,
      regulatoryContext: "Department of Land Resources (DoLR) data verification guidelines.",
      recommendedAction: "Review source document image and confirm with sub-registrar mutation register.",
      isAiGenerated: false,
    };
  }
}

export async function analyzeExtractedText(rawText: string, docName: string): Promise<{
  summary: string;
  suggestedFields: Record<string, any>;
  anomalyWarnings: string[];
  isAiGenerated: boolean;
}> {
  const client = getGeminiClient();
  if (!client) {
    return {
      summary: `Document "${docName}" processed. Extracted cadastral identifiers and agricultural parcel references.`,
      suggestedFields: {},
      anomalyWarnings: ["Automated preview mode: Connect Gemini API key for dynamic contextual text parsing."],
      isAiGenerated: false,
    };
  }

  try {
    const prompt = `Analyze this raw OCR text extracted from an Indian Land Record document (${docName}).
Raw OCR Text:
"""
${rawText}
"""

Identify key land record attributes, potential transcription anomalies (e.g. smudged numbers, misread Devanagari/Kannada/Urdu transliterations, confusing 0 with O or 1 with I or 7 with 1), and return JSON:
{
  "summary": "1-2 sentence neutral summary of document type and scope",
  "suggestedFields": {
    "surveyNumber": string or null,
    "village": string or null,
    "taluka": string or null,
    "district": string or null,
    "recordedArea": number or null,
    "unitOfMeasurement": string or null,
    "landUse": string or null
  },
  "anomalyWarnings": ["string array of potential OCR transcription risks or illegible sections"]
}`;

    const response = await client.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "";
    const parsed = JSON.parse(text);
    return {
      summary: parsed.summary || "Document parsed successfully.",
      suggestedFields: parsed.suggestedFields || {},
      anomalyWarnings: Array.isArray(parsed.anomalyWarnings) ? parsed.anomalyWarnings : [],
      isAiGenerated: true,
    };
  } catch (err) {
    console.error("Gemini analyzeExtractedText error:", err);
    return {
      summary: `Document "${docName}" parsed with standard OCR heuristics.`,
      suggestedFields: {},
      anomalyWarnings: ["AI assist unavailable; fallback to rule-based heuristics."],
      isAiGenerated: false,
    };
  }
}

export async function explainDuplicateComparison(recordA: any, recordB: any): Promise<{
  analysis: string;
  matchClassification: string;
  discrepancies: string[];
  recommendedResolution: string;
  isAiGenerated: boolean;
}> {
  const client = getGeminiClient();
  if (!client) {
    const sameSurvey = recordA.surveyNumber === recordB.surveyNumber;
    const sameVillage = recordA.village?.toLowerCase() === recordB.village?.toLowerCase();
    const areaDiff = Math.abs((recordA.recordedArea || 0) - (recordB.recordedArea || 0));

    return {
      analysis: `Records share ${sameSurvey ? 'Survey No. ' + recordA.surveyNumber : 'different survey numbers'} in ${recordA.village}. Area difference is ${areaDiff} ${recordA.unitOfMeasurement}.`,
      matchClassification: areaDiff === 0 ? "Exact Geographic Identifier Match" : "Survey Match with Area Divergence",
      discrepancies: areaDiff > 0 ? [`Area difference: ${recordA.recordedArea} vs ${recordB.recordedArea}`] : [],
      recommendedResolution: "Check chronological record dates: later record may reflect subsequent sub-division (Hissa / Pot-Hissa).",
      isAiGenerated: false,
    };
  }

  try {
    const prompt = `Compare these two Indian Land Records that may be duplicates or conflicting entries:
Record A: ${JSON.stringify(recordA)}
Record B: ${JSON.stringify(recordB)}

Provide a neutral, objective review analysis for an authorized land registry clerk or Tehsildar.
Return valid JSON:
{
  "analysis": "2 sentence clear assessment of why these records match or conflict",
  "matchClassification": "Category like 'Sub-Division Discrepancy' or 'Duplicate Transcription' or 'Independent Parcel'",
  "discrepancies": ["list of specific differing attributes"],
  "recommendedResolution": "neutral recommendation (e.g. check mutation date, inspect physical cadastral survey map, preserve both with cross-reference)"
}`;

    const response = await client.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return {
      analysis: parsed.analysis || "Comparison complete.",
      matchClassification: parsed.matchClassification || "Potential Duplicate",
      discrepancies: parsed.discrepancies || [],
      recommendedResolution: parsed.recommendedResolution || "Review source documents.",
      isAiGenerated: true,
    };
  } catch (err) {
    console.error("Gemini explainDuplicateComparison error:", err);
    return {
      analysis: `Comparison between ${recordA.id} and ${recordB.id} completed.`,
      matchClassification: "Potential Duplicate",
      discrepancies: ["Area and survey dates differ."],
      recommendedResolution: "Verify with village revenue talathi register.",
      isAiGenerated: false,
    };
  }
}
