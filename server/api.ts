import express, { Request, Response, Router } from "express";
import {
  explainValidationIssue,
  analyzeExtractedText,
  explainDuplicateComparison,
  getGeminiClient,
} from "./geminiService";

export const apiRouter: Router = express.Router();

apiRouter.use(express.json({ limit: "15mb" }));

// Health Check
apiRouter.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    app: "RecordWise AI",
    problemStatement: "SIH26018",
    aiEnabled: !!getGeminiClient(),
    timestamp: new Date().toISOString(),
  });
});

// Explain Validation Issue using Gemini 3.8 Flash
apiRouter.post("/gemini/explain-issue", async (req: Request, res: Response) => {
  try {
    const { rule, field, currentValue, recordContext } = req.body;
    if (!rule || !field) {
      return res.status(400).json({ error: "Missing required parameters (rule, field)" });
    }

    const result = await explainValidationIssue({
      rule,
      field,
      currentValue: String(currentValue ?? ""),
      recordContext: recordContext || {
        recordId: "UNKNOWN",
        surveyNumber: "N/A",
        village: "N/A",
        district: "N/A",
        recordedArea: 0,
        unitOfMeasurement: "sq.m",
      },
    });

    res.json(result);
  } catch (error: any) {
    console.error("Error in /api/gemini/explain-issue:", error);
    res.status(500).json({
      error: "Failed to generate explanation",
      details: error?.message,
    });
  }
});

// Analyze Extracted Document Text
apiRouter.post("/gemini/analyze-document", async (req: Request, res: Response) => {
  try {
    const { rawText, docName } = req.body;
    if (!rawText) {
      return res.status(400).json({ error: "Missing rawText parameter" });
    }

    const result = await analyzeExtractedText(rawText, docName || "Land_Record.pdf");
    res.json(result);
  } catch (error: any) {
    console.error("Error in /api/gemini/analyze-document:", error);
    res.status(500).json({
      error: "Failed to analyze document",
      details: error?.message,
    });
  }
});

// Compare records and explain potential duplicate discrepancy
apiRouter.post("/gemini/compare-records", async (req: Request, res: Response) => {
  try {
    const { recordA, recordB } = req.body;
    if (!recordA || !recordB) {
      return res.status(400).json({ error: "Missing recordA or recordB" });
    }

    const result = await explainDuplicateComparison(recordA, recordB);
    res.json(result);
  } catch (error: any) {
    console.error("Error in /api/gemini/compare-records:", error);
    res.status(500).json({
      error: "Failed to compare records",
      details: error?.message,
    });
  }
});
