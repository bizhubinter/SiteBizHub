import React from 'react';
import { ArrowRight, Scale } from 'lucide-react';
import { PITFALLS_VS_BIZHUB, BIZHUB_INFO } from '../data/bizhubData';

interface RiskComparisonSectionProps {
  onOpenForm: () => void;
}

export const RiskComparisonSection: React.FC<RiskComparisonSectionProps> = ({ onOpenForm }) => {
  return (
    <section id="diferencial" className="py-24 lg:py-32 bg-black relative border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 tracking-wider uppercase mb-3">
            <span className="text-[#494fdf] font-mono">MITIGAÇÃO DE RISCOS CRÍTICOS</span>
            <span aria-hidden="true" className="text-slate-600">/</span>
            <span>SEGURANÇA PATRIMONIAL</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight text-balance">
            O Custo de Ir Sozinho vs. A Blindagem da BizHub
          </h2>
          <p className="mt-5 text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
            A internacionalização é um dos investimentos mais importantes da sua trajetória. Entrar sem estruturação técnica prévia expõe a sua empresa a perdas de capital, litígios com órgãos reguladores e desgaste desnecessário.
          </p>
        </div>

        {/* 4 Comparative Cards (design.md feature-card-dark) */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">
          {PITFALLS_VS_BIZHUB.map((item, idx) => (
            <div
              key={idx}
              className="rounded-[20px] border border-white/10 bg-[#16181a] overflow-hidden flex flex-col justify-between"
            >
              <div className="p-8 sm:p-10">
                {/* Header tag */}
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="uppercase tracking-wider font-mono">Cenário de Risco de Mercado</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white mb-5 tracking-tight">
                  {item.pitfallTitle}
                </h3>

                {/* Pitfall Box */}
                <div className="p-5 rounded-xl bg-red-950/20 border border-red-900/30 mb-6">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-400 mb-2 font-mono">
                    <span>[!] O Risco da Fragmentação:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {item.pitfallDesc}
                  </p>
                </div>

                {/* BizHub Solution Box */}
                <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-900/30">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-2 font-mono">
                    <span>[✓] A Solução BizHub:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                    {item.bizhubSolution}
                  </p>
                </div>
              </div>

              <div className="px-8 py-4 bg-black/60 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Engenharia Consultiva & Conformidade</span>
                <span className="text-[#494fdf] font-semibold">Zero Tentativa e Erro</span>
              </div>
            </div>
          ))}
        </div>

        {/* Legal & Visa Guidance Clarification Box */}
        <div id="aviso-legal" className="mt-14 rounded-[20px] border border-white/10 bg-[#16181a] p-8 sm:p-10 relative">
          <div className="flex items-start gap-5">
            <div className="p-3.5 rounded-full bg-white/10 border border-white/10 text-white shrink-0">
              <Scale className="w-6 h-6" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#494fdf] font-mono">
                <span>Diretriz de Transparência & Conformidade Jurídica</span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Alinhamento Estratégico sobre Vistos e Assessoria Jurídica
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {BIZHUB_INFO.legalDisclaimer}
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-400 font-mono">
                <span>· Foco: Inteligência Estratégica & Viabilidade Econômica</span>
                <span>· Processos Jurídicos: Conduzidos por Advogados Habilitados</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison table */}
        <div className="mt-14 overflow-hidden rounded-[20px] border border-white/10 bg-[#16181a]">
          <div className="p-8 bg-black/60 border-b border-white/10">
            <h3 className="text-xl font-bold text-white tracking-tight">
              Quadro Comparativo: Prestadores Isolados vs. Modelo Integrado BizHub
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Como a coordenação técnica e a inteligência unificada protegem seu tempo, capital e operação.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-black/40 text-xs uppercase tracking-wider text-slate-400 border-b border-white/10">
                <tr>
                  <th className="px-8 py-5 font-semibold">Aspecto da Jornada</th>
                  <th className="px-8 py-5 font-semibold text-rose-300">Contratação Fragmentada / Mercado</th>
                  <th className="px-8 py-5 font-semibold text-white">BizHub Global Intelligence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
                <tr>
                  <td className="px-8 py-5 font-medium text-white">Abordagem do Projeto</td>
                  <td className="px-8 py-5 text-slate-400">Fragmentada (múltiplos fornecedores sem diálogo técnico)</td>
                  <td className="px-8 py-5 font-medium text-emerald-400">Solução 360° Coordenada em Uma Só Mesa</td>
                </tr>
                <tr>
                  <td className="px-8 py-5 font-medium text-white">Coordenação & Gestão</td>
                  <td className="px-8 py-5 text-slate-400">O cliente precisa gastar horas fazendo a ponte</td>
                  <td className="px-8 py-5 font-medium text-emerald-400">A BizHub orquestra o cronograma e os especialistas</td>
                </tr>
                <tr>
                  <td className="px-8 py-5 font-medium text-white">Base de Tomada de Decisão</td>
                  <td className="px-8 py-5 text-slate-400">Opiniões genéricas e tentativa e erro</td>
                  <td className="px-8 py-5 font-medium text-emerald-400">Pesquisa com dados reais, DRE e viabilidade prévia</td>
                </tr>
                <tr>
                  <td className="px-8 py-5 font-medium text-white">Suporte Pós-Abertura (Go-Live)</td>
                  <td className="px-8 py-5 text-slate-400">Nenhum; consultores entregam o arquivo e encerram contato</td>
                  <td className="px-8 py-5 font-medium text-emerald-400">Torre de controle operacional nos primeiros 90 dias</td>
                </tr>
                <tr>
                  <td className="px-8 py-5 font-medium text-white">Transição Operacional & Concierge</td>
                  <td className="px-8 py-5 text-slate-400">Abandonada ou cobrada avulsa sem critério</td>
                  <td className="px-8 py-5 font-medium text-emerald-400">Concierge estruturado (escolas, moradia, crédito, seguros)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA banner */}
        <div className="mt-14 text-center">
          <p className="text-sm text-slate-400 mb-5">
            Deseja verificar o grau de conformidade e prontidão da sua empresa antes de comprometer capital?
          </p>
          <button
            onClick={onOpenForm}
            className="inline-flex items-center gap-2.5 px-9 py-4 text-sm font-bold text-black bg-white hover:bg-slate-200 active:bg-slate-300 rounded-full shadow-2xl transition-all transform hover:-translate-y-0.5"
          >
            <span>Iniciar Formulário para Avaliação de Viabilidade</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </div>

      </div>
    </section>
  );
};
