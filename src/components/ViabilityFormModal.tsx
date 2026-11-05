import React, { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Building, 
  Target, 
  Briefcase, 
  Calendar,
  Mail,
  Copy,
  Check,
  Scale
} from 'lucide-react';
import { FORM_OPTIONS, BIZHUB_INFO } from '../data/bizhubData';
import { LeadSubmissionData } from '../types';

interface ViabilityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
}

export const ViabilityFormModal: React.FC<ViabilityFormModalProps> = ({
  isOpen,
  onClose,
  preselectedService,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Form State initialized with defaults
  const [formData, setFormData] = useState<LeadSubmissionData>({
    fullName: '',
    email: '',
    phone: '',
    roleTitle: '',
    companyName: '',
    cnpj: '',
    website: '',
    industry: [],
    operationTime: '',
    employeesCount: '',
    annualRevenue: '',

    motivation: [],
    hasForeignPartners: false,
    foreignPartnersDetail: '',
    expectedResult: '',

    alreadyExports: false,
    exportsDetail: '',
    productAdapted: 'NÃO',
    taxAccountingOrganized: 'NÃO',
    financialReserveReady: 'Ainda NÃO',
    internalResponsibleReady: 'Ainda NÃO',
    teamEnglishFluent: false,
    foreignEntityOpened: false,

    stage: 'Quero estruturar um plano formal nos próximos 6 meses',
    servicesNeeded: preselectedService ? [preselectedService] : [],
    referralSource: [],
    preferredMeetingDate: '',
    notes: '',
  });

  const [submittedLeadResult, setSubmittedLeadResult] = useState<{
    id: string;
    readinessScore: number;
    readinessLevel: string;
  } | null>(null);

  if (!isOpen) return null;

  // Helpers for multi-choice toggles
  const toggleArrayItem = (key: 'industry' | 'motivation' | 'servicesNeeded' | 'referralSource', value: string) => {
    setFormData((prev) => {
      const current = prev[key] || [];
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, [key]: updated };
    });
  };

  const handleInputChange = (field: keyof LeadSubmissionData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Step validation
  const validateCurrentStep = (): boolean => {
    setSubmitError(null);
    if (currentStep === 1) {
      if (!formData.fullName.trim()) {
        setSubmitError('Por favor, informe seu nome completo.');
        return false;
      }
      if (!formData.email.trim() || !formData.email.includes('@')) {
        setSubmitError('Por favor, informe um e-mail corporativo válido.');
        return false;
      }
      if (!formData.phone.trim() || formData.phone.length < 8) {
        setSubmitError('Por favor, informe seu telefone / WhatsApp com DDD.');
        return false;
      }
      if (!formData.companyName.trim()) {
        setSubmitError('Por favor, informe a razão social ou nome da sua empresa.');
        return false;
      }
      if (formData.industry.length === 0) {
        setSubmitError('Por favor, selecione pelo menos um setor de atuação.');
        return false;
      }
      if (!formData.operationTime) {
        setSubmitError('Por favor, selecione há quanto tempo sua empresa está em operação.');
        return false;
      }
      if (!formData.annualRevenue) {
        setSubmitError('Por favor, selecione a faixa de faturamento anual aproximado.');
        return false;
      }
    } else if (currentStep === 2) {
      if (formData.motivation.length === 0) {
        setSubmitError('Selecione pelo menos um motivo para a expansão aos EUA.');
        return false;
      }
    } else if (currentStep === 4) {
      if (formData.servicesNeeded.length === 0) {
        setSubmitError('Selecione ao menos um serviço que você acredita precisar.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => {
    setSubmitError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao processar formulário. Tente novamente.');
      }

      setSubmittedLeadResult({
        id: data.leadId,
        readinessScore: data.readinessScore || 75,
        readinessLevel: data.readinessLevel || 'Moderada Prontidão',
      });
      setIsSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || 'Erro ao processar a avaliação. Verifique sua conexão e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate plain-text summary for email / clipboard
  const getFormattedSummaryText = () => {
    return `AVALIAÇÃO DE VIABILIDADE - BIZHUB GLOBAL INTELLIGENCE
-------------------------------------------------------
Solicitante: ${formData.fullName} (${formData.roleTitle || 'Representante'})
Empresa: ${formData.companyName} | CNPJ: ${formData.cnpj || 'Não informado'}
E-mail: ${formData.email} | WhatsApp/Tel: ${formData.phone}
Website: ${formData.website || 'Não informado'}
Setor: ${formData.industry.join(', ')}
Tempo de Operação: ${formData.operationTime}
Colaboradores: ${formData.employeesCount || 'Não informado'}
Faturamento Anual: ${formData.annualRevenue}

OBJETIVO & MOTIVAÇÃO:
- Motivos de expansão: ${formData.motivation.join(', ')}
- Contato no exterior: ${formData.hasForeignPartners ? 'Sim (' + formData.foreignPartnersDetail + ')' : 'Não'}
- Resultado esperado: ${formData.expectedResult || 'Não informado'}

PREPARAÇÃO & CAPACIDADE:
- Exporta atualmente: ${formData.alreadyExports ? 'Sim (' + formData.exportsDetail + ')' : 'Não'}
- Produto adaptado aos EUA: ${formData.productAdapted}
- Estrutura contábil/fiscal: ${formData.taxAccountingOrganized}
- Reserva financeira: ${formData.financialReserveReady}
- Responsável interno: ${formData.internalResponsibleReady}
- Equipe com inglês fluente: ${formData.teamEnglishFluent ? 'Sim' : 'Não'}
- Estrutura jurídica no exterior: ${formData.foreignEntityOpened ? 'Sim' : 'Não'}

EXPECTATIVAS & SERVIÇOS:
- Estágio da empresa: ${formData.stage}
- Serviços prioritários: ${formData.servicesNeeded.join(', ')}
- Origem do contato: ${formData.referralSource.join(', ')}
- Preferência de reunião: ${formData.preferredMeetingDate || 'A definir'}
- Notas e objetivos adicionais: ${formData.notes || 'Nenhuma'}

DIRETRIZ LEGAL: A BizHub Global Intelligence LLC não presta assessoria jurídica ou advocacia imigratória. As categorias de vistos comerciais são tratadas sob a ótica de viabilidade de negócios e conduzidas por advogados habilitados nos EUA.
-------------------------------------------------------`;
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(getFormattedSummaryText());
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 3000);
  };

  const directMailtoUrl = `mailto:bruno.ortolan@gmail.com?cc=bruno@bizhubglobal.com&subject=${encodeURIComponent(
    `[BizHub Viabilidade] Avaliação de Viabilidade: ${formData.companyName} (${formData.fullName})`
  )}&body=${encodeURIComponent(getFormattedSummaryText())}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-4xl bg-[#16181a] border border-white/10 rounded-[20px] shadow-2xl overflow-hidden my-8">
        
        {/* Modal Top Bar */}
        <div className="px-8 py-5 bg-black border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/assets/aistudio/bizhub_logo_dark_transparent.png"
              alt="BizHub Business Intelligence"
              className="h-8 w-auto object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/assets/aistudio/bizhub_symbol_transparent.png';
              }}
            />
            <div className="hidden sm:block h-4 w-px bg-white/20" />
            <span className="hidden sm:inline-block text-xs font-mono uppercase tracking-wider text-slate-300">
              Avaliação de Viabilidade
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar & Steps Indicator */}
        {!isSubmitted && (
          <div className="px-8 pt-4 pb-2 bg-[#16181a] border-b border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
              <span className={currentStep >= 1 ? 'text-white font-bold' : ''}>
                01. Empresa & Contato
              </span>
              <span className={currentStep >= 2 ? 'text-white font-bold' : ''}>
                02. Motivação
              </span>
              <span className={currentStep >= 3 ? 'text-white font-bold' : ''}>
                03. Capacidade
              </span>
              <span className={currentStep >= 4 ? 'text-white font-bold' : ''}>
                04. Serviços
              </span>
            </div>
            <div className="w-full bg-black h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Error message banner */}
        {submitError && (
          <div className="mx-8 mt-4 p-4 bg-red-950/40 border border-red-800/80 rounded-xl flex items-center gap-3 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-8 sm:p-10 max-h-[75vh] overflow-y-auto">
          {!isSubmitted ? (
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              
              {/* STEP 1: Identification & Company */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                      <Building className="w-5 h-5 text-white" />
                      <span>Identificação do Solicitante e Perfil da Empresa</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
                      Coletamos as informações cadastrais e estruturais para contextualizar o porte e o setor da sua empresa.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">
                        Seu Nome Completo *
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Ex: Carlos Eduardo Mendes"
                        className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/15 text-white text-sm focus:outline-none focus:border-white transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">
                        Cargo / Função na Empresa
                      </label>
                      <input
                        type="text"
                        value={formData.roleTitle}
                        onChange={(e) => handleInputChange('roleTitle', e.target.value)}
                        placeholder="Ex: Sócio-Diretor, CEO, Diretor de Novos Negócios"
                        className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/15 text-white text-sm focus:outline-none focus:border-white transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">
                        E-mail Corporativo de Contato *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="seu.nome@suaempresa.com.br"
                        className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/15 text-white text-sm focus:outline-none focus:border-white transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">
                        WhatsApp / Telefone com DDD *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="(11) 98765-4321"
                        className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/15 text-white text-sm focus:outline-none focus:border-white transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">
                        Razão Social / Nome da Empresa *
                      </label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        placeholder="Nome Empresarial Ltda."
                        className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/15 text-white text-sm focus:outline-none focus:border-white transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">
                        CNPJ da Empresa
                      </label>
                      <input
                        type="text"
                        value={formData.cnpj}
                        onChange={(e) => handleInputChange('cnpj', e.target.value)}
                        placeholder="00.000.000/0001-00"
                        className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/15 text-white text-sm focus:outline-none focus:border-white transition-colors"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-2">
                        Website ou Rede Social da Empresa
                      </label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="https://www.suaempresa.com.br"
                        className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/15 text-white text-sm focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                  </div>

                  {/* Industry multi-select */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Qual o setor de atuação? (Selecione todos que se aplicam) *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {FORM_OPTIONS.sectors.map((sec) => {
                        const isChecked = formData.industry.includes(sec);
                        return (
                          <button
                            type="button"
                            key={sec}
                            onClick={() => toggleArrayItem('industry', sec)}
                            className={`px-4 py-3 rounded-xl text-xs font-medium border text-left transition-all ${
                              isChecked
                                ? 'bg-white text-black border-white font-semibold'
                                : 'bg-black border-white/10 text-slate-300 hover:border-white/30'
                            }`}
                          >
                            <span className="mr-2 font-mono">{isChecked ? '[✓]' : '[ ]'}</span>
                            <span>{sec}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Operation time & Employees */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">
                        Há quanto tempo a empresa está em operação? *
                      </label>
                      <select
                        value={formData.operationTime}
                        onChange={(e) => handleInputChange('operationTime', e.target.value)}
                        className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/15 text-white text-sm focus:outline-none focus:border-white"
                        required
                      >
                        <option value="">Selecione uma opção...</option>
                        {FORM_OPTIONS.operationTimes.map((op) => (
                          <option key={op} value={op}>
                            {op}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">
                        Número Total de Colaboradores
                      </label>
                      <input
                        type="number"
                        value={formData.employeesCount}
                        onChange={(e) => handleInputChange('employeesCount', e.target.value)}
                        placeholder="Ex: 25"
                        min="1"
                        className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/15 text-white text-sm focus:outline-none focus:border-white"
                      />
                    </div>
                  </div>

                  {/* Annual Revenue */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Qual o faturamento anual aproximado? *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {FORM_OPTIONS.revenueBrackets.map((rev) => {
                        const isSelected = formData.annualRevenue === rev;
                        return (
                          <button
                            type="button"
                            key={rev}
                            onClick={() => handleInputChange('annualRevenue', rev)}
                            className={`px-4 py-3 rounded-xl text-xs font-medium border text-left transition-all ${
                              isSelected
                                ? 'bg-white text-black border-white font-semibold'
                                : 'bg-black border-white/10 text-slate-300 hover:border-white/30'
                            }`}
                          >
                            <span className="mr-2 font-mono">{isSelected ? '[•]' : '[ ]'}</span>
                            <span>{rev}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Motivation & Objectives */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                      <Target className="w-5 h-5 text-white" />
                      <span>Objetivo e Motivação</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
                      Compreender sua tese de expansão é essencial para definir os canais de mercado e a governança societária adequada.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Por que você está considerando expandir sua empresa para os EUA? (Selecione todos que se aplicam) *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {FORM_OPTIONS.motivations.map((m) => {
                        const isChecked = formData.motivation.includes(m);
                        return (
                          <button
                            type="button"
                            key={m}
                            onClick={() => toggleArrayItem('motivation', m)}
                            className={`p-4 rounded-xl text-xs font-medium border text-left transition-all ${
                              isChecked
                                ? 'bg-white text-black border-white font-semibold'
                                : 'bg-black border-white/10 text-slate-300 hover:border-white/30'
                            }`}
                          >
                            <span className="mr-2 font-mono">{isChecked ? '[✓]' : '[ ]'}</span>
                            <span>{m}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Foreign partners */}
                  <div className="p-6 bg-black rounded-xl border border-white/10 space-y-4">
                    <label className="block text-xs font-semibold text-slate-300">
                      Já possui algum cliente, contato ou parceiro comercial no exterior? *
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleInputChange('hasForeignPartners', true)}
                        className={`px-5 py-2.5 rounded-full text-xs font-semibold border ${
                          formData.hasForeignPartners === true
                            ? 'bg-white text-black border-white'
                            : 'bg-transparent text-slate-400 border-white/20'
                        }`}
                      >
                        SIM
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange('hasForeignPartners', false)}
                        className={`px-5 py-2.5 rounded-full text-xs font-semibold border ${
                          formData.hasForeignPartners === false
                            ? 'bg-white text-black border-white'
                            : 'bg-transparent text-slate-400 border-white/20'
                        }`}
                      >
                        NÃO
                      </button>
                    </div>

                    {formData.hasForeignPartners && (
                      <div className="pt-2">
                        <label className="block text-xs text-slate-300 mb-1.5">
                          Se sim, onde está e qual o nível de relação?
                        </label>
                        <input
                          type="text"
                          value={formData.foreignPartnersDetail}
                          onChange={(e) => handleInputChange('foreignPartnersDetail', e.target.value)}
                          placeholder="Ex: Fornecedor na Flórida, distribuidor em Atlanta..."
                          className="w-full px-4 py-3 rounded-xl bg-[#16181a] border border-white/15 text-white text-xs focus:outline-none focus:border-white"
                        />
                      </div>
                    )}
                  </div>

                  {/* Expected result */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Qual o principal resultado que você gostaria de alcançar com esse projeto de expansão?
                    </label>
                    <textarea
                      rows={3}
                      value={formData.expectedResult}
                      onChange={(e) => handleInputChange('expectedResult', e.target.value)}
                      placeholder="Descreva seus objetivos (ex: faturar em dólar, diversificação patrimonial, consolidação de marca internacional...)"
                      className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/15 text-white text-sm focus:outline-none focus:border-white"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Preparation & Capability */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                      <Briefcase className="w-5 h-5 text-white" />
                      <span>Preparação e Capacidade</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
                      Mapeamos a prontidão da estrutura interna para calcular o score e calibrar as entregas de viabilidade.
                    </p>
                  </div>

                  {/* Current exports */}
                  <div className="p-6 bg-black rounded-xl border border-white/10 space-y-4">
                    <label className="block text-xs font-semibold text-slate-300">
                      Você já exporta ou vende para fora do Brasil atualmente? *
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleInputChange('alreadyExports', true)}
                        className={`px-5 py-2.5 rounded-full text-xs font-semibold border ${
                          formData.alreadyExports === true
                            ? 'bg-white text-black border-white'
                            : 'bg-transparent text-slate-400 border-white/20'
                        }`}
                      >
                        SIM
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange('alreadyExports', false)}
                        className={`px-5 py-2.5 rounded-full text-xs font-semibold border ${
                          formData.alreadyExports === false
                            ? 'bg-white text-black border-white'
                            : 'bg-transparent text-slate-400 border-white/20'
                        }`}
                      >
                        NÃO
                      </button>
                    </div>

                    {formData.alreadyExports && (
                      <div className="pt-2">
                        <label className="block text-xs text-slate-300 mb-1.5">
                          Se sim, o que e para onde?
                        </label>
                        <input
                          type="text"
                          value={formData.exportsDetail}
                          onChange={(e) => handleInputChange('exportsDetail', e.target.value)}
                          placeholder="Ex: Serviços de software, alimentos embalados..."
                          className="w-full px-4 py-3 rounded-xl bg-[#16181a] border border-white/15 text-white text-xs focus:outline-none focus:border-white"
                        />
                      </div>
                    )}
                  </div>

                  {/* Product Adaptation */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Seu produto / serviço já foi adaptado para o mercado internacional (idioma, rotulagem, certificações FDA, normas locais)? *
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['SIM', 'Parcialmente', 'NÃO'].map((opt) => (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => handleInputChange('productAdapted', opt)}
                          className={`py-3 px-4 rounded-xl text-xs font-semibold border text-center transition-all ${
                            formData.productAdapted === opt
                              ? 'bg-white text-black border-white'
                              : 'bg-black border-white/10 text-slate-400 hover:border-white/30'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Accounting & Tax */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      A empresa possui estrutura contábil e fiscal organizada? *
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['SIM', 'Parcialmente', 'NÃO'].map((opt) => (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => handleInputChange('taxAccountingOrganized', opt)}
                          className={`py-3 px-4 rounded-xl text-xs font-semibold border text-center transition-all ${
                            formData.taxAccountingOrganized === opt
                              ? 'bg-white text-black border-white'
                              : 'bg-black border-white/10 text-slate-400 hover:border-white/30'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Financial Reserve */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Você já possui reserva financeira ou orçamento estimado para iniciar o processo de expansão? *
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['SIM, já definido', 'Parcialmente', 'Ainda NÃO'].map((opt) => (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => handleInputChange('financialReserveReady', opt)}
                          className={`py-3 px-4 rounded-xl text-xs font-semibold border text-center transition-all ${
                            formData.financialReserveReady === opt
                              ? 'bg-white text-black border-white'
                              : 'bg-black border-white/10 text-slate-400 hover:border-white/30'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Internal Responsible */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Sua empresa já possui uma área ou um responsável interno para o projeto de expansão? *
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['SIM, já definido', 'Parcialmente', 'Ainda NÃO'].map((opt) => (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => handleInputChange('internalResponsibleReady', opt)}
                          className={`py-3 px-4 rounded-xl text-xs font-semibold border text-center transition-all ${
                            formData.internalResponsibleReady === opt
                              ? 'bg-white text-black border-white'
                              : 'bg-black border-white/10 text-slate-400 hover:border-white/30'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* English Fluency & Foreign Entity */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-black rounded-xl border border-white/10">
                      <label className="block text-xs font-semibold text-slate-300 mb-2">
                        A equipe interna possui alguém com fluência em inglês? *
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleInputChange('teamEnglishFluent', true)}
                          className={`flex-1 py-2 rounded-full text-xs font-semibold border ${
                            formData.teamEnglishFluent === true
                              ? 'bg-white text-black border-white'
                              : 'bg-transparent text-slate-400 border-white/20'
                          }`}
                        >
                          SIM
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInputChange('teamEnglishFluent', false)}
                          className={`flex-1 py-2 rounded-full text-xs font-semibold border ${
                            formData.teamEnglishFluent === false
                              ? 'bg-white text-black border-white'
                              : 'bg-transparent text-slate-400 border-white/20'
                          }`}
                        >
                          NÃO
                        </button>
                      </div>
                    </div>

                    <div className="p-4 bg-black rounded-xl border border-white/10">
                      <label className="block text-xs font-semibold text-slate-300 mb-2">
                        Você já tem empresa aberta ou estrutura jurídica no exterior? *
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleInputChange('foreignEntityOpened', true)}
                          className={`flex-1 py-2 rounded-full text-xs font-semibold border ${
                            formData.foreignEntityOpened === true
                              ? 'bg-white text-black border-white'
                              : 'bg-transparent text-slate-400 border-white/20'
                          }`}
                        >
                          SIM
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInputChange('foreignEntityOpened', false)}
                          className={`flex-1 py-2 rounded-full text-xs font-semibold border ${
                            formData.foreignEntityOpened === false
                              ? 'bg-white text-black border-white'
                              : 'bg-transparent text-slate-400 border-white/20'
                          }`}
                        >
                          NÃO
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Expectations, Services & Dispatch */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                      <Calendar className="w-5 h-5 text-white" />
                      <span>Expectativas, Serviços e Próximos Passos</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
                      Indique as unidades de negócio prioritárias para que a diretoria da BizHub elabore a precificação personalizada e agende seu follow-up.
                    </p>
                  </div>

                  {/* Stage */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Em que estágio você se considera hoje? *
                    </label>
                    <div className="space-y-2">
                      {FORM_OPTIONS.stages.map((stg) => {
                        const isSelected = formData.stage === stg;
                        return (
                          <button
                            type="button"
                            key={stg}
                            onClick={() => handleInputChange('stage', stg)}
                            className={`w-full p-4 rounded-xl text-xs font-medium border text-left transition-all ${
                              isSelected
                                ? 'bg-white text-black border-white font-semibold'
                                : 'bg-black border-white/10 text-slate-300 hover:border-white/30'
                            }`}
                          >
                            <span className="mr-2 font-mono font-bold">{isSelected ? '[•]' : '[ ]'}</span>
                            <span>{stg}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Services Needed */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Quais serviços você acredita precisar neste momento? (Sem valores fixos — precificação sob medida) *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {FORM_OPTIONS.services.map((srv) => {
                        const isChecked = formData.servicesNeeded.includes(srv);
                        return (
                          <button
                            type="button"
                            key={srv}
                            onClick={() => toggleArrayItem('servicesNeeded', srv)}
                            className={`p-3.5 rounded-xl text-xs font-medium border text-left transition-all ${
                              isChecked
                                ? 'bg-white text-black border-white font-semibold'
                                : 'bg-black border-white/10 text-slate-300 hover:border-white/30'
                            }`}
                          >
                            <span className="mr-2 font-mono font-bold">{isChecked ? '[✓]' : '[ ]'}</span>
                            <span>{srv}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Referral Source */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Como você conheceu a BizHub?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {FORM_OPTIONS.referralSources.map((ref) => {
                        const isChecked = formData.referralSource.includes(ref);
                        return (
                          <button
                            type="button"
                            key={ref}
                            onClick={() => toggleArrayItem('referralSource', ref)}
                            className={`px-3 py-2.5 rounded-xl text-xs font-medium border text-left transition-all ${
                              isChecked
                                ? 'bg-white text-black border-white font-semibold'
                                : 'bg-black border-white/10 text-slate-400 hover:border-white/30'
                            }`}
                          >
                            <span className="mr-1.5 font-mono">{isChecked ? '[✓]' : '[ ]'}</span>
                            <span>{ref}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Meeting Preference */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Preferência de Data/Horário para Alinhamento Executivo
                    </label>
                    <input
                      type="text"
                      value={formData.preferredMeetingDate}
                      onChange={(e) => handleInputChange('preferredMeetingDate', e.target.value)}
                      placeholder="Ex: Próxima terça-feira à tarde, ou qualquer dia após as 14h"
                      className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/15 text-white text-sm focus:outline-none focus:border-white"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Observações Adicionais ou Dúvidas Específicas
                    </label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Informações adicionais que você julgue relevantes..."
                      className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/15 text-white text-sm focus:outline-none focus:border-white"
                    />
                  </div>

                  {/* Legal Statement Note */}
                  <div className="p-4 rounded-xl bg-black border border-white/10 flex items-start gap-3 text-xs text-slate-400 font-normal">
                    <Scale className="w-4 h-4 text-white mt-0.5 shrink-0" />
                    <span>
                      <strong>Nota de Conformidade:</strong> A BizHub não presta serviços de advocacia ou consultoria jurídica. Questões societárias complexas e vistos comerciais são analisados sob a ótica de viabilidade de negócios e conduzidos por advogados norte-americanos habilitados.
                    </span>
                  </div>
                </div>
              )}

              {/* Modal Navigation Buttons */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold text-white bg-transparent hover:bg-white/10 border border-white/20 rounded-full transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Voltar</span>
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-8 py-3 text-xs font-bold text-black bg-white hover:bg-slate-200 rounded-full transition-colors ml-auto shadow-sm"
                  >
                    <span>Continuar</span>
                    <ArrowRight className="w-3.5 h-3.5 text-black" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2.5 px-8 py-3.5 text-sm font-bold text-black bg-white hover:bg-slate-200 active:bg-slate-300 rounded-full shadow-2xl transition-all ml-auto disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Enviando Avaliação...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-black" />
                        <span>Enviar Avaliação de Viabilidade</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          ) : (
            /* SUBMISSION SUCCESS CONFIRMATION SCREEN */
            <div className="py-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto text-white">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#494fdf] font-semibold">
                  Avaliação Registrada com Sucesso
                </span>
                <h3 className="text-3xl font-extrabold text-white mt-2 tracking-tight">
                  Obrigado, {formData.fullName}!
                </h3>
                <p className="text-sm text-slate-300 mt-2 max-w-lg mx-auto leading-relaxed">
                  Os dados da <strong>{formData.companyName}</strong> foram registrados e direcionados para a diretoria da BizHub Global Intelligence.
                </p>
              </div>

              {/* Calculated Score Box */}
              {submittedLeadResult && (
                <div className="max-w-md mx-auto p-6 rounded-[20px] bg-black border border-white/10 text-left">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase font-mono tracking-wider text-slate-400">
                      Score de Prontidão Inicial
                    </span>
                    <span className="text-xs font-bold text-white bg-white/10 border border-white/20 px-3 py-1 rounded-full">
                      {submittedLeadResult.readinessLevel}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-white font-mono tabular-nums">
                      {submittedLeadResult.readinessScore}
                    </span>
                    <span className="text-slate-400 text-sm">/ 100 pontos</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Baseado no Scorecard BizHub de 5 pilares de maturidade empresarial. Analisaremos suas respostas para aprofundar este diagnóstico.
                  </p>
                </div>
              )}

              {/* Action Buttons: design.md pill buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={directMailtoUrl}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold text-white bg-white/10 hover:bg-white/15 border border-white/20 rounded-full transition-colors"
                >
                  <Mail className="w-4 h-4 text-white" />
                  <span>Disparar E-mail para a BizHub</span>
                </a>

                <button
                  onClick={handleCopySummary}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-medium text-slate-300 hover:text-white bg-transparent hover:bg-white/10 border border-white/20 rounded-full transition-colors"
                >
                  {copiedSummary ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Copiado com Sucesso!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-400" />
                      <span>Copiar Resumo da Avaliação</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-7 py-3.5 text-xs font-bold text-black bg-white hover:bg-slate-200 rounded-full transition-colors"
                >
                  Concluir e Fechar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
