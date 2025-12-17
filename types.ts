export interface FileUpload {
  name: string;
  type: string;
  size: number;
  data: string; // Base64
}

export enum RiskSeverity {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

export interface RiskItem {
  title: string;
  severity: RiskSeverity;
  impact: string;
  remediable: boolean;
}

export interface DetailedFinding {
  risk: string;
  documents: string[];
  references: string;
  reasoning: string;
}

export interface AmendmentResolution {
  contract: string;
  originalClause: string;
  amendingDocument: string;
  finalPosition: string;
}

export interface DiligenceReport {
  executiveSummary: {
    topRisks: RiskItem[];
  };
  detailedFindings: DetailedFinding[];
  amendmentResolution: AmendmentResolution[];
  questionsForCounsel: string[];
}

export type AppStatus = 'idle' | 'analyzing' | 'complete' | 'error';