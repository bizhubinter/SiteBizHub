import React, { useState } from 'react';
import { 
  ArrowRight, 
  ChevronRight,
  X,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Layers,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { BUSINESS_UNITS, BIZHUB_INFO } from '../data/bizhubData';
import { BusinessUnit } from '../types';

interface EcosystemSectionProps {
  onOpenFormWithService?: (serviceName: string) => void;
}

export const EcosystemSection: React.FC<EcosystemSectionProps> = ({ onOpenFormWithService }) => {
  const [selectedUnitId, setSelectedUnitId] = useState<string>(BUSINESS_UNITS[0].id);
  const [scopeModalUnit, setScopeModalUnit] = useState<BusinessUnit | null>(null);

  const selectedUnit = BUSINESS_UNITS.find((u) => u.id === selectedUnitId) || BUSINESS_UNITS[0];

  const handleSelectAndScrollToSpotlight = (unitId: string) => {
    setSelectedUnitId(unitId);
    const element = document.getElementById('destaque-unidade');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOpenScopeModal = (e: React.MouseEvent, unit: BusinessUnit) => {
    e.stopPropagation();
    setScopeModalUnit(unit);
  };

  return (
    <section id="ecossistema" className="py-24 lg:py-32 bg-black relative border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Clear Strategic Architecture */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 tracking-wider uppercase mb-3 font-mono">
            <span className="text-[#494fdf]">ECOSSISTEMA INTEGRADO DE EXPANSÃO</span>
            <span aria-hidden="true" className="text-slate-600">/</span>
            <span>UMA SÓ GOVERNANÇA</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight text-balance">
            Um serviço nuclear. Cinco pilares integrados de entrega.
          </h2>
          <p className="mt-5 text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
            A <strong>BizHub Internationalization</strong> é o motor central por onde toda a jornada começa — através de pesquisa de mercado, análise de viabilidade e business plan. As demais unidades são <strong>pilares integrados de execução</strong>, acionados sob medida para transformar a estratégia em operação sem a fragmentação de fornecedores avulsos.
          </p>
        </div>

        {/* Units Interactive Tab Bar with Dedicated Brand Logos */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 p-2 bg-[#16181a] border border-white/10 rounded-2xl">
          {BUSINESS_UNITS.map((unit) => {
            const isActive = unit.id === selectedUnitId;
            return (
              <button
                key={unit.id}
                onClick={() => handleSelectAndScrollToSpotlight(unit.id)}
                style={{
                  borderColor: isActive ? unit.colorHex : 'transparent',
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all text-center border relative ${
                  isActive
                    ? 'bg-black shadow-lg'
                    : 'hover:bg-white/5 opacity-75 hover:opacity-100'
                }`}
              >
                {unit.isCore && (
                  <span className="absolute -top-2 right-2 text-[9px] font-mono uppercase bg-rose-600 text-white px-2 py-0.5 rounded-full font-bold">
                    Core
                  </span>
                )}
                <div className="h-9 w-full flex items-center justify-center mb-1.5 px-1">
                  <img
                    src={unit.logoPath}
                    alt={unit.title}
                    className="max-h-8 max-w-full object-contain"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: unit.colorHex }}
                  />
                  <span className={`text-[11px] font-semibold tracking-tight ${isActive ? 'text-white' : 'text-slate-400'}`}>
                    {unit.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Unit Spotlight */}
        <div 
          id="destaque-unidade"
          className="mt-8 rounded-[20px] bg-[#16181a] border transition-all p-8 sm:p-12 shadow-2xl relative overflow-hidden scroll-mt-28"
          style={{ borderColor: `${selectedUnit.colorHex}55` }}
        >
          {/* Ambient backlight matching the unit's exact color */}
          <div
            className="absolute top-0 right-0 w-96 h-96 blur-3xl opacity-15 pointer-events-none rounded-full"
            style={{ backgroundColor: selectedUnit.colorHex }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            <div className="lg:col-span-7">
              
              {/* Unit Brand Mark & Classification Badge */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <img
                  src={selectedUnit.logoPath}
                  alt={selectedUnit.title}
                  className="h-10 sm:h-12 w-auto object-contain"
                />
                
                {selectedUnit.isCore ? (
                  <span className="text-xs font-bold px-3.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono uppercase">
                    Pilar Central · Início da Jornada
                  </span>
                ) : (
                  <span className="text-xs font-medium px-3.5 py-1 rounded-full bg-white/10 text-slate-300 border border-white/15 font-mono">
                    Pilar Integrado de Execução
                  </span>
                )}

                {selectedUnit.partnerOrBadge && (
                  <span 
                    className="text-xs font-semibold px-3 py-1 rounded-full border"
                    style={{ 
                      backgroundColor: `${selectedUnit.colorHex}15`,
                      borderColor: `${selectedUnit.colorHex}40`,
                      color: selectedUnit.colorHex
                    }}
                  >
                    {selectedUnit.partnerOrBadge}
                  </span>
                )}
              </div>

              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                {selectedUnit.subtitle}
              </div>

              <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {selectedUnit.title}
              </h3>
              
              <p className="text-base text-slate-300 mt-4 leading-relaxed">
                {selectedUnit.description}
              </p>

              {/* Sinergia com o Projeto Principal */}
              <div className="mt-6 p-5 rounded-2xl bg-black/80 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider font-mono">
                  <LinkIcon className="w-3.5 h-3.5" style={{ color: selectedUnit.colorHex }} />
                  <span>Sinergia com o Projeto de Expansão:</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {selectedUnit.synergyRole}
                </p>
              </div>

              {/* Deliverables / Scope */}
              <div className="mt-7 space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 font-mono">
                  Entregáveis Técnicos deste Pilar:
                </div>
                {selectedUnit.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-200">
                    <div 
                      className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: selectedUnit.colorHex }}
                    />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onOpenFormWithService && onOpenFormWithService(selectedUnit.title)}
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 text-xs sm:text-sm font-bold text-black bg-white hover:bg-slate-200 active:bg-slate-300 rounded-full shadow-lg transition-all transform hover:-translate-y-0.5 whitespace-nowrap shrink-0"
                >
                  <span>Avaliação de Viabilidade de Expansão</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </button>

                <button
                  onClick={(e) => handleOpenScopeModal(e, selectedUnit)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/20 rounded-full transition-colors whitespace-nowrap shrink-0"
                >
                  <FileText className="w-4 h-4 text-slate-300" />
                  <span>Ver Como Atua na Expansão</span>
                </button>
              </div>
            </div>

            {/* Contextual Visual Showcase Box */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="rounded-[20px] overflow-hidden border border-white/10 bg-black p-3 shadow-inner h-full flex flex-col justify-center">
                {selectedUnit.id === 'representations' ? (
                  <img
                    src="/src/assets/images/logistics_supply_chain_us_1793823757837.jpg"
                    alt="Centro de distribuição e armazenagem nos EUA"
                    className="w-full h-full min-h-[320px] sm:min-h-[420px] object-cover rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <img
                    src="/src/assets/images/bruno_executive_expansion_advisory_1793900238812.jpg"
                    alt="Bruno Ortolan liderando reunião executiva de inteligência e expansão empresarial BizHub"
                    className="w-full h-full min-h-[320px] sm:min-h-[420px] object-cover rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 6 Grid Cards: Visão Completa do Ecossistema */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Visão Completa do Ecossistema Integrado
            </h3>
            <p className="text-sm text-slate-400 mt-2">
              Clique em cada pilar para compreender sua sinergia estratégica com o projeto de internacionalização da sua empresa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BUSINESS_UNITS.map((unit) => {
              const isSelected = selectedUnitId === unit.id;
              return (
                <div
                  key={unit.id}
                  onClick={() => handleSelectAndScrollToSpotlight(unit.id)}
                  style={{
                    borderColor: isSelected ? unit.colorHex : 'rgba(255, 255, 255, 0.1)',
                  }}
                  className={`cursor-pointer group p-8 rounded-[20px] border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#16181a] shadow-xl'
                      : 'bg-[#111315] hover:bg-[#16181a] hover:border-white/20'
                  }`}
                >
                  <div>
                    {/* Official Unit Logo */}
                    <div className="h-12 flex items-center justify-between mb-4">
                      <img
                        src={unit.logoPath}
                        alt={unit.title}
                        className="max-h-10 max-w-[200px] object-contain"
                      />
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: unit.colorHex }}
                      />
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      {unit.isCore ? (
                        <span className="text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          Pilar Central · Início
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10">
                          Pilar Integrado
                        </span>
                      )}

                      {unit.partnerOrBadge && (
                        <span 
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap"
                          style={{ 
                            color: unit.colorHex,
                            borderColor: `${unit.colorHex}40`,
                            backgroundColor: `${unit.colorHex}10`
                          }}
                        >
                          Piquet Realty
                        </span>
                      )}
                    </div>

                    <h4 className="text-xl font-bold text-white group-hover:text-slate-100 transition-colors">
                      {unit.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      {unit.description}
                    </p>

                    {/* Sinergia Box */}
                    <div className="mt-4 p-3.5 rounded-xl bg-black/60 border border-white/10 text-[11px] text-slate-400 leading-relaxed">
                      <strong className="text-slate-200 block mb-1">Papel na Expansão:</strong>
                      <span className="line-clamp-2">{unit.synergyRole}</span>
                    </div>
                  </div>

                  {/* ACTIVE EXPLICATIVE BUTTON: "Ver como este pilar atua na expansão" */}
                  <div className="mt-6 pt-5 border-t border-white/10">
                    <button
                      type="button"
                      onClick={(e) => handleOpenScopeModal(e, unit)}
                      className="w-full py-2.5 px-4 rounded-full text-xs font-semibold transition-all border flex items-center justify-between group-hover:bg-white/10"
                      style={{
                        borderColor: `${unit.colorHex}55`,
                        color: unit.colorHex,
                        backgroundColor: `${unit.colorHex}10`,
                      }}
                    >
                      <span className="truncate">
                        {unit.isCore ? 'Ver escopo do pilar central' : 'Ver como este pilar atua na expansão'}
                      </span>
                      <ChevronRight className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footnote for Existing US Operations Exception */}
          <div className="mt-12 text-center text-xs text-slate-400">
            <span>Sua empresa já opera nos Estados Unidos e busca suporte exclusivo em uma de nossas verticais? </span>
            <a
              href={`mailto:${BIZHUB_INFO.contactEmail}?subject=Consulta%20Espec%C3%ADfica%20-%20BizHub%20EUA`}
              className="text-white underline font-semibold hover:text-[#494fdf] transition-colors"
            >
              Fale com a Diretoria Executiva
            </a>
          </div>
        </div>

      </div>

      {/* MODAL: "COMO ESTE PILAR ATUA NA EXPANSÃO INTERNACIONAL" */}
      {scopeModalUnit && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setScopeModalUnit(null)}
        >
          <div 
            className="relative w-full max-w-2xl bg-[#16181a] border rounded-[20px] shadow-2xl overflow-hidden my-8"
            style={{ borderColor: `${scopeModalUnit.colorHex}66` }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-8 py-6 bg-black border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={scopeModalUnit.logoPath}
                  alt={scopeModalUnit.title}
                  className="h-9 w-auto object-contain"
                />
                <div className="h-4 w-px bg-white/20 hidden sm:block" />
                <span className="hidden sm:inline-block text-xs font-mono uppercase tracking-wider text-slate-400">
                  {scopeModalUnit.isCore ? 'Pilar Central da Holding' : 'Pilar Integrado de Execução'}
                </span>
              </div>

              <button
                onClick={() => setScopeModalUnit(null)}
                className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 sm:p-10 space-y-6 max-h-[75vh] overflow-y-auto text-slate-300">
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: scopeModalUnit.colorHex }}
                  />
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    {scopeModalUnit.subtitle}
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-white tracking-tight">
                  {scopeModalUnit.title}
                </h3>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  {scopeModalUnit.description}
                </p>
              </div>

              {/* Sinergia em Destaque no Modal */}
              <div 
                className="p-6 rounded-2xl border space-y-2"
                style={{
                  backgroundColor: `${scopeModalUnit.colorHex}10`,
                  borderColor: `${scopeModalUnit.colorHex}40`,
                }}
              >
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono text-white">
                  <LinkIcon className="w-4 h-4" style={{ color: scopeModalUnit.colorHex }} />
                  <span>Como este pilar atua na sua expansão para os EUA:</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                  {scopeModalUnit.synergyRole}
                </p>
              </div>

              {/* Detailed Features / Deliverables List */}
              <div className="p-6 rounded-2xl bg-black border border-white/10 space-y-3.5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Atividades & Entregáveis Técnicos
                </h4>
                <div className="space-y-3">
                  {scopeModalUnit.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                      <CheckCircle2 
                        className="w-4 h-4 shrink-0 mt-0.5"
                        style={{ color: scopeModalUnit.colorHex }}
                      />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Unified Governance Callout */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <span>
                  <strong>Governança Unificada:</strong> Ao contratar a BizHub, você não precisa fazer a ponte entre diferentes consultorias, corretores, contadores e despachantes. Todos os entregáveis deste pilar são coordenados sob o mesmo cronograma estratégico.
                </span>
              </div>

              {/* Actions inside modal */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => {
                    const unitTitle = scopeModalUnit.title;
                    setScopeModalUnit(null);
                    onOpenFormWithService && onOpenFormWithService(unitTitle);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs sm:text-sm font-bold text-black bg-white hover:bg-slate-200 rounded-full shadow-lg transition-all"
                >
                  <span>Avaliação de Viabilidade de Expansão</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </button>

                <button
                  type="button"
                  onClick={() => setScopeModalUnit(null)}
                  className="w-full sm:w-auto px-6 py-3 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Fechar
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </section>
  );
};
