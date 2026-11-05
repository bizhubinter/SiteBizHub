export interface BusinessUnit {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  isCore?: boolean;
  synergyRole: string; // Como este pilar atua na expansão / sinergia com o projeto principal
  features: string[];
  partnerOrBadge?: string;
  highlights: string[];
  colorHex: string;
  logoPath: string;
  accentBorder: string;
  accentBg: string;
  accentText: string;
}

export interface MethodologyPhase {
  number: string;
  title: string;
  phaseName: string;
  purpose: string;
  keySteps: { title: string; description: string }[];
  deliverables: string[];
  durationEstimate?: string;
}

export interface LeadSubmissionData {
  id?: string;
  createdAt?: string;
  // Step 1: Contact & Company
  fullName: string;
  email: string;
  phone: string;
  roleTitle: string;
  companyName: string;
  cnpj: string;
  website: string;
  industry: string[];
  operationTime: string;
  employeesCount: string;
  annualRevenue: string;

  // Step 2: Objective & Motivation
  motivation: string[];
  hasForeignPartners: boolean | string;
  foreignPartnersDetail: string;
  expectedResult: string;

  // Step 3: Preparation & Capability
  alreadyExports: boolean | string;
  exportsDetail: string;
  productAdapted: string;
  taxAccountingOrganized: string;
  financialReserveReady: string;
  internalResponsibleReady: string;
  teamEnglishFluent: boolean | string;
  foreignEntityOpened: boolean | string;

  // Step 4: Expectations & Services
  stage: string;
  servicesNeeded: string[];
  referralSource: string[];
  preferredMeetingDate?: string;
  notes?: string;

  // Computed
  readinessScore?: number;
  readinessLevel?: 'Alta Prontidão' | 'Moderada Prontidão' | 'Fase Preparatória';
  status?: 'Novo' | 'Em Análise' | 'Contatado' | 'Proposta Enviada' | 'Fechado' | 'Arquivado';
  adminNotes?: string;
  estimatedBudgetProposal?: string;
}
