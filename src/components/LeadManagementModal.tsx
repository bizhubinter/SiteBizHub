import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Mail, 
  MessageSquare, 
  Trash2, 
  Building, 
  Download, 
  RefreshCw,
  Check
} from 'lucide-react';
import { LeadSubmissionData } from '../types';

interface LeadManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeadManagementModal: React.FC<LeadManagementModalProps> = ({ isOpen, onClose }) => {
  const [leads, setLeads] = useState<LeadSubmissionData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<LeadSubmissionData | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  // Edit fields
  const [editStatus, setEditStatus] = useState<string>('Novo');
  const [editNotes, setEditNotes] = useState<string>('');
  const [editProposal, setEditProposal] = useState<string>('');

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      if (data && data.leads) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLeads();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedLead) {
      setEditStatus(selectedLead.status || 'Novo');
      setEditNotes(selectedLead.adminNotes || '');
      setEditProposal(selectedLead.estimatedBudgetProposal || '');
    }
  }, [selectedLead]);

  if (!isOpen) return null;

  const handleUpdateLead = async () => {
    if (!selectedLead?.id) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/leads/${selectedLead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editStatus,
          adminNotes: editNotes,
          estimatedBudgetProposal: editProposal,
        }),
      });
      const data = await res.json();
      if (data.success && data.lead) {
        setLeads((prev) => prev.map((l) => (l.id === data.lead.id ? data.lead : l)));
        setSelectedLead(data.lead);
      }
    } catch (err) {
      console.error('Failed to update lead:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Deseja realmente excluir este registro?')) return;
    try {
      await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      setLeads((prev) => prev.filter((l) => l.id !== id));
      if (selectedLead?.id === id) setSelectedLead(null);
    } catch (err) {
      console.error(err);
    }
  };

  const exportCSV = () => {
    if (leads.length === 0) return;
    const headers = [
      'Data',
      'Nome',
      'Email',
      'Telefone',
      'Empresa',
      'CNPJ',
      'Setor',
      'Faturamento',
      'Score',
      'Nivel',
      'Estagio',
      'Servicos',
      'Status',
    ];
    const rows = leads.map((l) => [
      `"${l.createdAt ? new Date(l.createdAt).toLocaleDateString('pt-BR') : ''}"`,
      `"${l.fullName || ''}"`,
      `"${l.email || ''}"`,
      `"${l.phone || ''}"`,
      `"${l.companyName || ''}"`,
      `"${l.cnpj || ''}"`,
      `"${(l.industry || []).join('; ')}"`,
      `"${l.annualRevenue || ''}"`,
      `"${l.readinessScore || ''}"`,
      `"${l.readinessLevel || ''}"`,
      `"${l.stage || ''}"`,
      `"${(l.servicesNeeded || []).join('; ')}"`,
      `"${l.status || 'Novo'}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bizhub_avaliacoes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const generateProposalEmailBody = (lead: LeadSubmissionData) => {
    return `Olá ${lead.fullName}, tudo bem?

Agradecemos o envio da sua Avaliação de Viabilidade para a ${lead.companyName} através do portal da BizHub Global Intelligence.

Analisamos os dados da sua operação com foco na expansão para o mercado norte-americano:
- Setor: ${(lead.industry || []).join(', ')}
- Score Preliminar de Prontidão: ${lead.readinessScore || 70}/100 (${lead.readinessLevel || 'Pronto para estruturação'})
- Serviços de interesse: ${(lead.servicesNeeded || []).join(', ')}

Gostaríamos de agendar uma reunião de alinhamento executivo para apresentar nossa análise de viabilidade prévia e detalhar a proposta de escopo ideal para a ${lead.companyName}.

Você teria disponibilidade nos próximos dias para essa conversa?

Atenciosamente,

BizHub Global Intelligence LLC
Orlando, Florida
bruno@bizhubglobal.com`;
  };

  const copyProposalEmail = (lead: LeadSubmissionData) => {
    navigator.clipboard.writeText(generateProposalEmailBody(lead));
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-6xl bg-[#16181a] border border-white/10 rounded-[20px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-8 py-5 bg-black border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Painel do Consultor · Gestão de Avaliações de Viabilidade</span>
              </h2>
              <p className="text-xs text-slate-400">
                Acesse todas as avaliações recebidas para precificar serviços, analisar maturidade e realizar follow-up.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/15 rounded-full transition-colors"
              title="Exportar para Excel / CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </button>
            <button
              onClick={fetchLeads}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              title="Atualizar lista"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Two columns if lead selected */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          
          {/* Left Column: Leads Table / List */}
          <div className={`flex-1 flex flex-col overflow-hidden ${selectedLead ? 'lg:max-w-md border-r border-white/10' : ''}`}>
            
            {/* Filters bar */}
            <div className="p-4 border-b border-white/10 bg-black/40 flex flex-wrap gap-2 items-center justify-between">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por empresa, nome ou e-mail..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-black border border-white/15 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-black border border-white/15 text-xs text-slate-300 focus:outline-none focus:border-white"
              >
                <option value="all">Todos os Status</option>
                <option value="Novo">Novo</option>
                <option value="Em Análise">Em Análise</option>
                <option value="Contatado">Contatado</option>
                <option value="Proposta Enviada">Proposta Enviada</option>
                <option value="Fechado">Fechado</option>
                <option value="Arquivado">Arquivado</option>
              </select>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-white/5 p-3">
              {isLoading ? (
                <div className="p-8 text-center text-xs text-slate-400 font-mono">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Carregando avaliações...
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Nenhuma avaliação encontrada no momento.
                </div>
              ) : (
                filteredLeads.map((lead) => {
                  const isSelected = selectedLead?.id === lead.id;
                  return (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`p-4 rounded-xl transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-black border border-white/30'
                          : 'hover:bg-black/50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-white text-sm truncate">
                          {lead.companyName}
                        </span>
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white">
                          Score: {lead.readinessScore || 70}/100
                        </span>
                      </div>

                      <div className="text-xs text-slate-300 flex items-center gap-1.5 truncate">
                        <span>{lead.fullName}</span>
                        {lead.roleTitle && <span className="text-slate-500">· {lead.roleTitle}</span>}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 font-mono">
                        <span>{lead.annualRevenue}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                          lead.status === 'Novo' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                          lead.status === 'Contatado' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                          lead.status === 'Fechado' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                          'bg-white/10 text-slate-300'
                        }`}>
                          {lead.status || 'Novo'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Lead Detailed View & Actions */}
          {selectedLead ? (
            <div className="flex-1 flex flex-col overflow-hidden bg-black/40">
              {/* Detailed View Header */}
              <div className="p-6 sm:p-8 bg-black border-b border-white/10 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {selectedLead.companyName}
                    </h3>
                    <span className="text-xs font-mono text-slate-400">
                      {selectedLead.createdAt ? new Date(selectedLead.createdAt).toLocaleDateString('pt-BR') : ''}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Contato: <strong>{selectedLead.fullName}</strong> ({selectedLead.roleTitle || 'Representante'}) · CNPJ: {selectedLead.cnpj || 'Não informado'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${selectedLead.email}?subject=BizHub%20-%20Avalia%C3%A7%C3%A3o%20de%20Viabilidade%20para%20${encodeURIComponent(selectedLead.companyName)}`}
                    className="px-4 py-2 rounded-full bg-white text-black font-semibold text-xs flex items-center gap-1.5"
                    title="Enviar e-mail direto"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>E-mail</span>
                  </a>

                  {selectedLead.phone && (
                    <a
                      href={`https://wa.me/${selectedLead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Olá ${selectedLead.fullName}, aqui é da equipe de Novos Negócios da BizHub. Analisamos a avaliação de viabilidade para a ${selectedLead.companyName}.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5"
                      title="Chamar no WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  )}

                  <button
                    onClick={() => selectedLead.id && handleDeleteLead(selectedLead.id)}
                    className="p-2 rounded-full text-slate-500 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                    title="Excluir registro"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable details */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-xs text-slate-300">
                {/* Score & Maturity banner */}
                <div className="p-6 rounded-2xl bg-black border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-mono">Score de Prontidão</span>
                    <div className="text-3xl font-extrabold text-white mt-1 font-mono">
                      {selectedLead.readinessScore || 70} / 100
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-mono">Classificação</span>
                    <div className="text-sm font-semibold text-white mt-1.5">
                      {selectedLead.readinessLevel || 'Moderada Prontidão'}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-mono">Estágio Declarado</span>
                    <div className="text-xs text-slate-300 mt-1.5">
                      {selectedLead.stage}
                    </div>
                  </div>
                </div>

                {/* Company & Objectives */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-black border border-white/10 space-y-2.5">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Perfil Empresarial
                    </h4>
                    <p><strong>Setor:</strong> {(selectedLead.industry || []).join(', ')}</p>
                    <p><strong>Operação:</strong> {selectedLead.operationTime}</p>
                    <p><strong>Colaboradores:</strong> {selectedLead.employeesCount}</p>
                    <p><strong>Faturamento:</strong> {selectedLead.annualRevenue}</p>
                    <p><strong>Website:</strong> {selectedLead.website ? <a href={selectedLead.website} target="_blank" rel="noreferrer" className="text-white underline">{selectedLead.website}</a> : 'Não informado'}</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-black border border-white/10 space-y-2.5">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Capacidade & Prontidão
                    </h4>
                    <p><strong>Exporta atualmente:</strong> {selectedLead.alreadyExports ? `Sim (${selectedLead.exportsDetail || ''})` : 'Não'}</p>
                    <p><strong>Produto adaptado EUA:</strong> {selectedLead.productAdapted}</p>
                    <p><strong>Fiscal/Contábil:</strong> {selectedLead.taxAccountingOrganized}</p>
                    <p><strong>Reserva financeira:</strong> {selectedLead.financialReserveReady}</p>
                    <p><strong>Responsável interno:</strong> {selectedLead.internalResponsibleReady}</p>
                    <p><strong>Inglês fluente:</strong> {selectedLead.teamEnglishFluent ? 'Sim' : 'Não'}</p>
                    <p><strong>Estrutura no exterior:</strong> {selectedLead.foreignEntityOpened ? 'Sim' : 'Não'}</p>
                  </div>
                </div>

                {/* Motivation & Expected Result */}
                <div className="p-5 rounded-2xl bg-black border border-white/10 space-y-2.5">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Motivação & Resultado Esperado
                  </h4>
                  <p><strong>Motivos:</strong> {(selectedLead.motivation || []).join(', ')}</p>
                  <p><strong>Parceiros no exterior:</strong> {selectedLead.hasForeignPartners ? `Sim (${selectedLead.foreignPartnersDetail || ''})` : 'Não'}</p>
                  <p><strong>Resultado pretendido:</strong></p>
                  <div className="p-4 bg-[#16181a] rounded-xl border border-white/10 text-slate-200 italic">
                    "{selectedLead.expectedResult || 'Não especificado'}"
                  </div>
                </div>

                {/* Services Requested */}
                <div className="p-5 rounded-2xl bg-black border border-white/10 space-y-2.5">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Serviços Solicitados para Precificação
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(selectedLead.servicesNeeded || []).map((srv, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white font-medium text-xs">
                        {srv}
                      </span>
                    ))}
                  </div>
                  {selectedLead.preferredMeetingDate && (
                    <p className="mt-3 text-slate-400 font-mono">
                      <strong>Preferência de reunião:</strong> {selectedLead.preferredMeetingDate}
                    </p>
                  )}
                  {selectedLead.notes && (
                    <p className="mt-1 text-slate-400">
                      <strong>Observações do cliente:</strong> {selectedLead.notes}
                    </p>
                  )}
                </div>

                {/* Internal Consultant Management Box */}
                <div className="p-6 rounded-2xl bg-black border border-white/10 space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center justify-between">
                    <span>Anotações do Consultor & Precificação</span>
                    <button
                      onClick={() => copyProposalEmail(selectedLead)}
                      className="text-[11px] font-normal text-slate-400 hover:text-white flex items-center gap-1 font-sans"
                    >
                      {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Mail className="w-3.5 h-3.5" />}
                      <span>{copiedEmail ? 'Minuta Copiada!' : 'Copiar Minuta de E-mail'}</span>
                    </button>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1.5 font-mono">
                        Status do Pipeline
                      </label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#16181a] border border-white/15 text-white text-xs"
                      >
                        <option value="Novo">Novo</option>
                        <option value="Em Análise">Em Análise</option>
                        <option value="Contatado">Contatado</option>
                        <option value="Proposta Enviada">Proposta Enviada</option>
                        <option value="Fechado">Fechado</option>
                        <option value="Arquivado">Arquivado</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1.5 font-mono">
                        Estimativa de Precificação / Honorários
                      </label>
                      <input
                        type="text"
                        value={editProposal}
                        onChange={(e) => setEditProposal(e.target.value)}
                        placeholder="Ex: Escopo Viabilidade + BP (Personalizado)"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#16181a] border border-white/15 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1.5 font-mono">
                      Notas Internas & Próximas Ações
                    </label>
                    <textarea
                      rows={2}
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Registrar anotações sobre reuniões, feedback e direcionamento da proposta..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#16181a] border border-white/15 text-white text-xs"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleUpdateLead}
                      disabled={isUpdating}
                      className="px-6 py-2.5 text-xs font-bold text-black bg-white hover:bg-slate-200 rounded-full transition-colors"
                    >
                      {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex flex-1 items-center justify-center p-8 text-center text-slate-500 text-xs">
              Selecione uma avaliação na lista lateral para visualizar as respostas completas e precificar os serviços.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
