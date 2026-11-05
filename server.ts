import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure data directory exists
const DATA_DIR = path.join(__dirname, 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(LEADS_FILE)) {
  fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2), 'utf-8');
}

export interface LeadSubmission {
  id: string;
  createdAt: string;
  // Contact info
  fullName: string;
  email: string;
  phone: string;
  roleTitle?: string;
  
  // Company details
  companyName: string;
  cnpj: string;
  website?: string;
  industry: string[];
  operationTime: string;
  employeesCount: number | string;
  annualRevenue: string;
  
  // Objective & Motivation
  motivation: string[];
  hasForeignPartners: boolean | string;
  foreignPartnersDetail?: string;
  expectedResult: string;
  
  // Preparation & Capability
  alreadyExports: boolean | string;
  exportsDetail?: string;
  productAdapted: string;
  taxAccountingOrganized: string;
  financialReserveReady: string;
  internalResponsibleReady: string;
  teamEnglishFluent: boolean | string;
  foreignEntityOpened: boolean | string;
  
  // Expectations & Services
  stage: string;
  servicesNeeded: string[];
  referralSource: string[];
  preferredMeetingDate?: string;
  notes?: string;
  
  // Computed
  readinessScore: number;
  readinessLevel: 'Alta Prontidão' | 'Moderada Prontidão' | 'Fase Preparatória';
  
  // Admin follow up
  status: 'Novo' | 'Em Análise' | 'Contatado' | 'Proposta Enviada' | 'Fechado' | 'Arquivado';
  adminNotes?: string;
  estimatedBudgetProposal?: string;
}

// Calculate readiness score (0-100) based on BizHub 5-pillar scorecard methodology
function calculateReadinessScore(lead: Partial<LeadSubmission>): { score: number; level: LeadSubmission['readinessLevel'] } {
  let score = 20; // base score for taking action

  // Revenue
  if (lead.annualRevenue === 'Acima R$ 10 milhões') score += 15;
  else if (lead.annualRevenue === 'R$ 5 milhões a R$ 10 milhões') score += 12;
  else if (lead.annualRevenue === 'R$ 2 milhões a R$ 5 milhões') score += 10;
  else if (lead.annualRevenue === 'R$ 500 mil a R$ 2 milhões') score += 7;
  else score += 4;

  // Operation time
  if (lead.operationTime === 'Mais de 10 anos' || lead.operationTime === '5 a 10 anos') score += 10;
  else if (lead.operationTime === '3 a 5 anos') score += 8;
  else if (lead.operationTime === '1 a 3 anos') score += 5;
  else score += 2;

  // Financial reserve
  if (lead.financialReserveReady === 'SIM, já definido') score += 15;
  else if (lead.financialReserveReady === 'Parcialmente') score += 8;

  // Accounting / tax structure
  if (lead.taxAccountingOrganized === 'SIM') score += 12;
  else if (lead.taxAccountingOrganized === 'Parcialmente') score += 6;

  // Internal responsible
  if (lead.internalResponsibleReady === 'SIM, já definido') score += 10;
  else if (lead.internalResponsibleReady === 'Parcialmente') score += 5;

  // Product adapted
  if (lead.productAdapted === 'SIM') score += 10;
  else if (lead.productAdapted === 'Parcialmente') score += 5;

  // Foreign partner or experience
  if (lead.hasForeignPartners === true || lead.hasForeignPartners === 'SIM' || lead.hasForeignPartners === 'Sim') score += 6;
  if (lead.alreadyExports === true || lead.alreadyExports === 'SIM' || lead.alreadyExports === 'Sim') score += 6;
  if (lead.teamEnglishFluent === true || lead.teamEnglishFluent === 'SIM' || lead.teamEnglishFluent === 'Sim') score += 6;

  score = Math.min(Math.max(score, 15), 100);

  let level: LeadSubmission['readinessLevel'] = 'Fase Preparatória';
  if (score >= 70) level = 'Alta Prontidão';
  else if (score >= 45) level = 'Moderada Prontidão';

  return { score, level };
}

// Read leads from file
function getLeads(): LeadSubmission[] {
  try {
    const raw = fs.readFileSync(LEADS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading leads:', err);
    return [];
  }
}

// Save leads to file
function saveLeads(leads: LeadSubmission[]) {
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
}

// Mailer setup (falls back gracefully to logging and direct notification)
async function sendNotificationEmail(lead: LeadSubmission) {
  const recipient = process.env.BIZHUB_NOTIFY_EMAIL || 'bruno.ortolan@gmail.com';
  const ccRecipient = 'bruno@bizhubglobal.com';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; color: #1e293b; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #0f172a; padding: 24px; text-align: center; border-bottom: 3px solid #ea580c;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 0.5px;">BIZHUB BUSINESS INTELLIGENCE</h1>
        <p style="color: #fb923c; margin: 6px 0 0; font-size: 14px; font-weight: bold;">NOVA AVALIAÇÃO DE VIABILIDADE RECEBIDA</p>
      </div>

      <div style="padding: 24px;">
        <div style="background: #f8fafc; border-left: 4px solid #ea580c; padding: 12px 16px; margin-bottom: 20px;">
          <h2 style="margin: 0 0 6px; font-size: 16px; color: #0f172a;">${lead.fullName} (${lead.roleTitle || 'Representante'})</h2>
          <p style="margin: 0; font-size: 14px; color: #475569;"><strong>Empresa:</strong> ${lead.companyName} | <strong>CNPJ:</strong> ${lead.cnpj || 'Não informado'}</p>
          <p style="margin: 4px 0 0; font-size: 14px; color: #475569;"><strong>E-mail:</strong> <a href="mailto:${lead.email}">${lead.email}</a> | <strong>WhatsApp/Tel:</strong> <a href="https://wa.me/${lead.phone.replace(/\D/g, '')}">${lead.phone}</a></p>
          <p style="margin: 4px 0 0; font-size: 13px; color: #64748b;"><strong>Score de Prontidão:</strong> <span style="font-weight: bold; color: ${lead.readinessScore >= 70 ? '#16a34a' : '#ea580c'};">${lead.readinessScore}/100 (${lead.readinessLevel})</span></p>
        </div>

        <h3 style="border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; color: #0f172a; font-size: 15px;">1. Perfil da Empresa</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 16px;">
          <tr><td style="padding: 6px 0; color: #64748b; width: 40%;">Setor de Atuação:</td><td style="padding: 6px 0; font-weight: 500;">${lead.industry.join(', ')}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">Tempo em Operação:</td><td style="padding: 6px 0; font-weight: 500;">${lead.operationTime}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">Número de Colaboradores:</td><td style="padding: 6px 0; font-weight: 500;">${lead.employeesCount}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">Faturamento Anual:</td><td style="padding: 6px 0; font-weight: 500;">${lead.annualRevenue}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">Website:</td><td style="padding: 6px 0; font-weight: 500;">${lead.website ? `<a href="${lead.website}" target="_blank">${lead.website}</a>` : 'Não informado'}</td></tr>
        </table>

        <h3 style="border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; color: #0f172a; font-size: 15px;">2. Objetivo & Motivação</h3>
        <p style="font-size: 13px; margin: 4px 0;"><strong>Motivos para internacionalização:</strong> ${lead.motivation.join(', ')}</p>
        <p style="font-size: 13px; margin: 4px 0;"><strong>Contatos/Parceiros no exterior:</strong> ${lead.hasForeignPartners ? 'Sim (' + (lead.foreignPartnersDetail || '') + ')' : 'Não'}</p>
        <p style="font-size: 13px; margin: 4px 0;"><strong>Principal resultado esperado:</strong></p>
        <div style="background: #fff; border: 1px solid #e2e8f0; padding: 8px 12px; border-radius: 4px; font-size: 13px; font-style: italic; color: #334155;">
          "${lead.expectedResult || 'Não detalhado'}"
        </div>

        <h3 style="border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; color: #0f172a; font-size: 15px; margin-top: 16px;">3. Preparação & Capacidade Operacional</h3>
        <ul style="font-size: 13px; line-height: 1.6; padding-left: 20px; color: #334155;">
          <li>Exporta atualmente: <strong>${lead.alreadyExports ? 'Sim (' + (lead.exportsDetail || '') + ')' : 'Não'}</strong></li>
          <li>Produto/Serviço adaptado aos EUA: <strong>${lead.productAdapted}</strong></li>
          <li>Estrutura fiscal/contábil organizada: <strong>${lead.taxAccountingOrganized}</strong></li>
          <li>Reserva financeira/orçamento: <strong>${lead.financialReserveReady}</strong></li>
          <li>Responsável interno dedicado: <strong>${lead.internalResponsibleReady}</strong></li>
          <li>Equipe com inglês fluente: <strong>${lead.teamEnglishFluent ? 'Sim' : 'Não'}</strong></li>
          <li>Empresa aberta no exterior: <strong>${lead.foreignEntityOpened ? 'Sim' : 'Não'}</strong></li>
        </ul>

        <h3 style="border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; color: #0f172a; font-size: 15px; margin-top: 16px;">4. Expectativas & Próximos Passos</h3>
        <p style="font-size: 13px; margin: 4px 0;"><strong>Estágio Atual:</strong> ${lead.stage}</p>
        <p style="font-size: 13px; margin: 4px 0;"><strong>Serviços Solicitados:</strong> ${lead.servicesNeeded.join(', ')}</p>
        <p style="font-size: 13px; margin: 4px 0;"><strong>Canal de Origem:</strong> ${lead.referralSource.join(', ')}</p>
        ${lead.preferredMeetingDate ? `<p style="font-size: 13px; margin: 4px 0;"><strong>Preferência de Reunião:</strong> ${lead.preferredMeetingDate}</p>` : ''}
        ${lead.notes ? `<p style="font-size: 13px; margin: 4px 0;"><strong>Observações do Lead:</strong> ${lead.notes}</p>` : ''}

        <div style="margin-top: 24px; text-align: center;">
          <a href="mailto:${lead.email}?subject=BizHub%20-%20Avalia%C3%A7%C3%A3o%20de%20Viabilidade%20para%20${encodeURIComponent(lead.companyName)}" 
             style="display: inline-block; background-color: #ea580c; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; margin-right: 8px;">
            Responder por E-mail
          </a>
          <a href="https://wa.me/${lead.phone.replace(/\D/g, '')}?text=Ol%C3%A1%20${encodeURIComponent(lead.fullName)}%2C%20aqui%20%C3%A9%20o%20Bruno%20da%20BizHub.%20Recebi%20sua%20avalia%C3%A7%C3%A3o%20de%20viabilidade%20para%20${encodeURIComponent(lead.companyName)}." 
             style="display: inline-block; background-color: #25D366; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px;">
            Chamar no WhatsApp
          </a>
        </div>
      </div>

      <div style="background-color: #f1f5f9; padding: 12px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">
        BizHub Global Intelligence LLC · Orlando, FL · Notificação Automática do Portal de Viabilidade
      </div>
    </div>
  `;

  // Check if SMTP is configured
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"BizHub Viabilidade" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: recipient,
        cc: ccRecipient,
        replyTo: lead.email,
        subject: `[BizHub Viabilidade] ${lead.companyName} - Score: ${lead.readinessScore}/100 (${lead.fullName})`,
        html: htmlContent,
      });

      console.log(`Email successfully dispatched via SMTP to ${recipient}`);
      return { sent: true, method: 'smtp' };
    } catch (smtpErr) {
      console.warn('SMTP delivery failed, falling back to server log/storage:', smtpErr);
    }
  }

  console.log(`[LEAD NOTIFICATION] New Lead: ${lead.companyName} (${lead.fullName}) saved to leads.json. Notify target: ${recipient}`);
  return { sent: false, method: 'stored', targetEmail: recipient, previewHtml: htmlContent };
}

// API Routes
app.post('/api/leads', async (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (!body.fullName || !body.companyName || !body.email || !body.phone) {
      return res.status(400).json({
        error: 'Campos obrigatórios: Nome completo, Razão Social, E-mail e Telefone/WhatsApp.',
      });
    }

    const { score, level } = calculateReadinessScore(body);

    const newLead: LeadSubmission = {
      id: 'lead_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      roleTitle: body.roleTitle || '',
      companyName: body.companyName,
      cnpj: body.cnpj || '',
      website: body.website || '',
      industry: Array.isArray(body.industry) ? body.industry : (body.industry ? [body.industry] : []),
      operationTime: body.operationTime || 'Não informado',
      employeesCount: body.employeesCount || 'Não informado',
      annualRevenue: body.annualRevenue || 'Não informado',
      motivation: Array.isArray(body.motivation) ? body.motivation : (body.motivation ? [body.motivation] : []),
      hasForeignPartners: body.hasForeignPartners ?? false,
      foreignPartnersDetail: body.foreignPartnersDetail || '',
      expectedResult: body.expectedResult || '',
      alreadyExports: body.alreadyExports ?? false,
      exportsDetail: body.exportsDetail || '',
      productAdapted: body.productAdapted || 'NÃO',
      taxAccountingOrganized: body.taxAccountingOrganized || 'NÃO',
      financialReserveReady: body.financialReserveReady || 'Ainda NÃO',
      internalResponsibleReady: body.internalResponsibleReady || 'Ainda NÃO',
      teamEnglishFluent: body.teamEnglishFluent ?? false,
      foreignEntityOpened: body.foreignEntityOpened ?? false,
      stage: body.stage || 'Estou apenas explorando possibilidades',
      servicesNeeded: Array.isArray(body.servicesNeeded) ? body.servicesNeeded : (body.servicesNeeded ? [body.servicesNeeded] : []),
      referralSource: Array.isArray(body.referralSource) ? body.referralSource : (body.referralSource ? [body.referralSource] : []),
      preferredMeetingDate: body.preferredMeetingDate || '',
      notes: body.notes || '',
      readinessScore: score,
      readinessLevel: level,
      status: 'Novo',
      adminNotes: '',
      estimatedBudgetProposal: '',
    };

    const leads = getLeads();
    leads.unshift(newLead);
    saveLeads(leads);

    const mailResult = await sendNotificationEmail(newLead);

    return res.status(201).json({
      success: true,
      leadId: newLead.id,
      readinessScore: newLead.readinessScore,
      readinessLevel: newLead.readinessLevel,
      mailResult,
      message: 'Avaliação recebida com sucesso! Nossa equipe entrará em contato em breve.',
    });
  } catch (error) {
    console.error('Error submitting lead:', error);
    return res.status(500).json({ error: 'Erro interno ao processar a avaliação. Tente novamente.' });
  }
});

app.get('/api/leads', (req: Request, res: Response) => {
  const leads = getLeads();
  return res.json({ leads });
});

app.patch('/api/leads/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, adminNotes, estimatedBudgetProposal } = req.body;
  const leads = getLeads();
  const index = leads.findIndex((l) => l.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Lead não encontrado' });
  }

  if (status) leads[index].status = status;
  if (adminNotes !== undefined) leads[index].adminNotes = adminNotes;
  if (estimatedBudgetProposal !== undefined) leads[index].estimatedBudgetProposal = estimatedBudgetProposal;

  saveLeads(leads);
  return res.json({ success: true, lead: leads[index] });
});

app.delete('/api/leads/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const leads = getLeads();
  const filtered = leads.filter((l) => l.id !== id);
  if (filtered.length === leads.length) {
    return res.status(404).json({ error: 'Lead não encontrado' });
  }
  saveLeads(filtered);
  return res.json({ success: true });
});

// Health check for Cloud Run and monitoring
app.get('/api/health', (_req: Request, res: Response) => {
  return res.status(200).json({ 
    status: 'ok', 
    service: 'bizhub-business-intelligence', 
    timestamp: new Date().toISOString() 
  });
});

// Production and dev handling
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const distPath = path.join(__dirname, 'dist');
  const hasDist = fs.existsSync(path.join(distPath, 'index.html'));

  if (!isProduction || !hasDist) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BizHub server running on http://0.0.0.0:${PORT} (env: ${process.env.NODE_ENV || 'development'})`);
  });
}

startServer();
