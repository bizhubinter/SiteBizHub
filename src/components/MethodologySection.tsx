import React from 'react';
import { METHODOLOGY_PHASES } from '../data/bizhubData';
import { ArrowRight, Layers, FileSpreadsheet, ShieldCheck, Activity } from 'lucide-react';

interface MethodologySectionProps {
  onOpenForm: () => void;
}

export const MethodologySection: React.FC<MethodologySectionProps> = ({ onOpenForm }) => {
  const getPhaseIcon = (number: string) => {
    switch (number) {
      case '01':
        return <FileSpreadsheet className="w-5 h-5 text-white" />;
      case '02':
        return <ShieldCheck className="w-5 h-5 text-white" />;
      case '03':
        return <Activity className="w-5 h-5 text-white" />;
      default:
        return <Layers className="w-5 h-5 text-white" />;
    }
  };

  return (
    <section id="metodologia" className="py-24 lg:py-32 bg-black border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 tracking-wider uppercase mb-3">
            <span className="text-[#494fdf] font-mono">METODOLOGIA EM 3 FASES</span>
            <span aria-hidden="true" className="text-slate-600">/</span>
            <span>DO DIAGNÓSTICO AO GO-LIVE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight text-balance">
            A jornada estruturada em 3 fases para a sua expansão nos EUA
          </h2>
          <p className="mt-5 text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
            Uma abordagem multifacetada que diferencia com rigor o plano estratégico, o plano tático e a execução operacional, garantindo previsibilidade de caixa e mitigação prévia de riscos regulatórios e comerciais.
          </p>
        </div>

        {/* 3 Phases Detailed Cards (design.md feature-card-dark) */}
        <div className="mt-14 space-y-8">
          {METHODOLOGY_PHASES.map((phase) => (
            <div
              key={phase.number}
              className="bg-[#16181a] border border-white/10 rounded-[20px] p-8 sm:p-12 relative overflow-hidden transition-all hover:border-white/20"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                    {getPhaseIcon(phase.number)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#494fdf]">
                        {phase.number}.
                      </span>
                      <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                        {phase.phaseName}
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
                      {phase.title}
                    </h3>
                  </div>
                </div>

                <div className="text-xs text-slate-300 font-mono bg-white/5 px-4 py-2 rounded-full border border-white/10 self-start">
                  {phase.durationEstimate}
                </div>
              </div>

              <p className="mt-5 text-sm sm:text-base text-slate-300 italic max-w-4xl">
                "{phase.purpose}"
              </p>

              {/* Key Steps Grid */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {phase.keySteps.map((step, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-6 rounded-[16px] bg-black/60 border border-white/10 flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#494fdf] font-mono mb-1.5">
                        Etapa {phase.number}.{sIdx + 1}
                      </div>
                      <h4 className="text-sm font-bold text-white mb-2 tracking-tight">
                        {step.title}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-normal">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Deliverables summary */}
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-3">
                <span className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider">
                  Entregáveis Principais:
                </span>
                {phase.deliverables.map((deliv, dIdx) => (
                  <span
                    key={dIdx}
                    className="inline-flex items-center gap-2 text-xs text-slate-200 bg-white/5 px-4 py-1.5 rounded-full border border-white/10"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#494fdf]" />
                    <span>{deliv}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Phase Action Callout adhering to design.md */}
        <div className="mt-14 p-10 rounded-[20px] bg-[#16181a] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Em qual fase de maturidade seu negócio se encontra?
            </h3>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Preencha nossa avaliação de viabilidade para receber uma análise preliminar com a recomendação das etapas e do escopo ideal para a sua empresa.
            </p>
          </div>
          
          {/* button-primary: White pill with black text */}
          <button
            onClick={onOpenForm}
            className="inline-flex items-center gap-2.5 px-8 py-4 text-sm font-bold text-black bg-white hover:bg-slate-200 active:bg-slate-300 rounded-full shadow-xl transition-all whitespace-nowrap shrink-0"
          >
            <span>Realizar Avaliação de Viabilidade</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </div>

      </div>
    </section>
  );
};
