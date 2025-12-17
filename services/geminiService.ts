import { GoogleGenAI, Type, Schema } from "@google/genai";
import { FileUpload, DiligenceReport } from "../types";

// Note: In a real environment, ensure process.env.API_KEY is set.
// For this environment, we assume the variable is injected.
const API_KEY = process.env.VITE_GEMINI_API_KEY || '';


const ai = new GoogleGenAI({ apiKey: API_KEY });

const SYSTEM_INSTRUCTION = `
You are RedLineAI, a transaction diligence engine.

You MUST:
1. Enumerate ALL distinct risks you identify across the document set.
2. Assign EACH risk strictly one of the following severities:
   - 'High' (Critical Risk): Deal-breakers, fundamental legal flaws, immediate termination rights, massive financial exposure.
   - 'Medium' (Material Issue): Significant value erosion, operational blockers, costly remediation, customer concentration >15%.
   - 'Low' (Minor Issue): Administrative gaps, hygiene issues, low-cost fix.

3. Do NOT cap counts. List every single distinct risk found.
4. Do NOT reuse prior summaries. Recalculate everything based strictly on the current provided text.
5. Do NOT summarize generally; be specific about the clause and impact.

PERFORM THESE ANALYSES:
A. LEGAL RISK: Change of Control, Termination, Indemnities, Exclusivity, IP, Regulatory.
B. FINANCIAL RISK: Revenue rec, Concentration, Unusual pricing, Off-balance-sheet liabilities.
C. AMENDMENT RESOLUTION: Identify amendments, determine controlling clauses.
D. HIDDEN RISKS: Buried clauses, inconsistencies between text/tables.

OUTPUT RULES:
- The 'executiveSummary.topRisks' array MUST contain EVERY risk identified. Do not limit it to a "top 5".
- Remediable means it can be fixed pre-close (e.g., via waiver or amendment).
`;

const reportSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    executiveSummary: {
      type: Type.OBJECT,
      properties: {
        topRisks: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              severity: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
              impact: { type: Type.STRING },
              remediable: { type: Type.BOOLEAN },
            },
            required: ['title', 'severity', 'impact', 'remediable'],
          },
        },
      },
      required: ['topRisks'],
    },
    detailedFindings: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          risk: { type: Type.STRING },
          documents: { type: Type.ARRAY, items: { type: Type.STRING } },
          references: { type: Type.STRING },
          reasoning: { type: Type.STRING },
        },
        required: ['risk', 'documents', 'references', 'reasoning'],
      },
    },
    amendmentResolution: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          contract: { type: Type.STRING },
          originalClause: { type: Type.STRING },
          amendingDocument: { type: Type.STRING },
          finalPosition: { type: Type.STRING },
        },
        required: ['contract', 'originalClause', 'amendingDocument', 'finalPosition'],
      },
    },
    questionsForCounsel: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: ['executiveSummary', 'detailedFindings', 'amendmentResolution', 'questionsForCounsel'],
};

export const analyzeDocuments = async (files: FileUpload[]): Promise<DiligenceReport> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  // Convert files to Gemini parts
  const fileParts = files.map(file => ({
    inlineData: {
      mimeType: file.type,
      data: file.data,
    },
  }));

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Using the most capable model for reasoning
      contents: {
        role: 'user',
        parts: [
          ...fileParts,
          { text: "Analyze the provided data room documents according to your system instructions and produce the structured Due Diligence Report." }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: reportSchema,
        temperature: 0.1, // Low temperature for precision
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response generated from RedLineAI.");
    
    return JSON.parse(text) as DiligenceReport;
  } catch (error) {
    console.error("RedLineAI Analysis Error:", error);
    throw error;
  }
};
console.log("Gemini key length:", process.env.VITE_GEMINI_API_KEY?.length);

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the Data URL prefix (e.g., "data:application/pdf;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};