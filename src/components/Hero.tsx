import React from 'react';
import { ArrowRight, Building2, ShieldAlert } from 'lucide-react';
import { BIZHUB_INFO } from '../data/bizhubData';

interface HeroProps {
  onOpenForm: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenForm }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 bg-black border-b border-white/10">
      {/* Subtle atmospheric ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#494fdf]/10 via-[#494fdf]/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-stretch">
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Unboxed category metadata without pill capsule */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 tracking-wider uppercase mb-5">
              <span className="text-[#494fdf] font-mono">BIZHUB GLOBAL INTELLIGENCE</span>
              <span aria-hidden="true" className="text-slate-600">/</span>
              <span>ESTRATÉGIA BRASIL — ESTADOS UNIDOS</span>
            </div>

            {/* Oversized editorial display headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.05] text-balance">
              Where Business Expansion Becomes{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
                Structured Growth
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
              Holding boutique especializada em inteligência estratégica, expansão internacional e estruturação empresarial entre o Brasil e os Estados Unidos. Substitua a tentativa e erro por dados reais de viabilidade, governança fiscal e execução coordenada.
            </p>

            {/* Clean minimalist value markers */}
            <div className="mt-6 space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#494fdf] mt-2 shrink-0" />
                <span>Integração de 6 unidades estratégicas: Internationalization, Real Estate, Tax, Software, Concierge e Representations</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#494fdf] mt-2 shrink-0" />
                <span>Coordenação técnica com parceiros homologados (advogados corporativos independentes, contadores e realtors)</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#494fdf] mt-2 shrink-0" />
                <span>Torre de controle operacional e acompanhamento no go-live nos primeiros 90 dias</span>
              </div>
            </div>

            {/* CTAs adhering strictly to design.md */}
            <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* button-primary: White pill on black */}
              <button
                onClick={onOpenForm}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-sm font-bold text-black bg-white hover:bg-slate-200 active:bg-slate-300 rounded-full shadow-2xl transition-all transform hover:-translate-y-0.5 whitespace-nowrap shrink-0"
              >
                <span>Preencher Avaliação de Viabilidade</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>

              {/* button-outline-dark: Outline pill on dark */}
              <a
                href="#ecossistema"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 text-sm font-semibold text-white bg-transparent hover:bg-white/10 border border-white/20 hover:border-white/40 rounded-full transition-all whitespace-nowrap shrink-0"
              >
                <Building2 className="w-4 h-4 text-slate-300" />
                <span>Explorar as 6 Unidades</span>
              </a>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs text-slate-400">
              <ShieldAlert className="w-4 h-4 text-[#494fdf] shrink-0" />
              <span>Avaliação online preliminar, confidencial e analisada diretamente pelo corpo executivo da BizHub.</span>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="relative rounded-[20px] overflow-hidden border border-white/10 bg-[#16181a] shadow-2xl group">
              <img
                src="/src/assets/images/hero_international_expansion_1793823756481.jpg"
                alt="Skyline corporativo de Orlando e Miami - Expansão EUA com a BizHub"
                className="w-full h-[380px] sm:h-[440px] object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center gap-2 text-xs text-slate-300 font-mono uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#494fdf]" />
                  <span>Orlando, Florida · Hub Central</span>
                </div>
                <h3 className="text-xl font-bold text-white text-balance">
                  A ponte segura para consolidar sua operação no mercado norte-americano.
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Metodologia comprovada em 3 fases com governança societária e mitigação de riscos regulatórios e operacionais.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width 4-Column Strip Below Hero Split */}
        <div className="mt-16 pt-12 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {BIZHUB_INFO.stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col">
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono tabular-nums">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-slate-200 mt-1">
                {stat.label}
              </div>
              <div className="text-xs text-slate-400 mt-1 leading-relaxed">
                {stat.context}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
