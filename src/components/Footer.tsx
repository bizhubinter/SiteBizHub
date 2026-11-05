import React from 'react';
import { Mail, MapPin, ArrowRight, KeyRound } from 'lucide-react';
import { BIZHUB_INFO } from '../data/bizhubData';

interface FooterProps {
  onOpenForm: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenForm, onOpenAdmin }) => {
  return (
    <footer id="contato" className="bg-black border-t border-white/10 text-slate-400">
      {/* Contact Call to Action Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-b border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#494fdf] tracking-wider uppercase mb-3 font-mono">
              <span>PRÓXIMO PASSO</span>
              <span aria-hidden="true" className="text-slate-600">/</span>
              <span>EXPANSÃO ESTRUTURADA</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Pronto para iniciar sua expansão com governança e previsibilidade?
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed font-normal">
              Inicie preenchendo o formulário de avaliação de viabilidade para mapear seus objetivos específicos, validar o escopo da sua empresa e receber um entendimento claro dos próximos passos.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
            {/* button-primary: White pill with black text */}
            <button
              onClick={onOpenForm}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-sm font-bold text-black bg-white hover:bg-slate-200 active:bg-slate-300 rounded-full shadow-2xl transition-all text-center whitespace-nowrap"
            >
              <span>Acessar Avaliação de Viabilidade</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
            
            {/* button-outline-dark: Outline pill on dark */}
            <a
              href={`mailto:${BIZHUB_INFO.contactEmail}`}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-xs sm:text-sm font-semibold text-white bg-transparent hover:bg-white/10 border border-white/20 hover:border-white/40 rounded-full transition-all text-center whitespace-nowrap"
            >
              <Mail className="w-4 h-4 text-slate-300" />
              <span>Contato Corporativo</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <img
              src="/assets/aistudio/bizhub_logo_dark_transparent.png"
              alt="BizHub Business Intelligence"
              className="h-10 w-auto object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/assets/aistudio/bizhub_symbol_transparent.png';
              }}
            />
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Holding boutique especializada em inteligência estratégica, expansão internacional e estruturação empresarial entre o Brasil e os Estados Unidos.
            </p>
            <div className="pt-2 flex flex-col gap-2 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#494fdf]" />
                <span>Orlando, Florida — Estados Unidos</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#494fdf]" />
                <span>{BIZHUB_INFO.contactEmail}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Unidades do Ecossistema */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-mono">
              Unidades da Holding
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li><a href="#ecossistema" className="hover:text-white transition-colors">Internationalization</a></li>
              <li><a href="#ecossistema" className="hover:text-white transition-colors">Real Estate (Piquet Realty)</a></li>
              <li><a href="#ecossistema" className="hover:text-white transition-colors">Tax & Accounting</a></li>
              <li><a href="#ecossistema" className="hover:text-white transition-colors">Software & App</a></li>
              <li><a href="#ecossistema" className="hover:text-white transition-colors">Concierge & Services</a></li>
              <li><a href="#ecossistema" className="hover:text-white transition-colors">Representations</a></li>
            </ul>
          </div>

          {/* Col 3: Metodologia & Governança */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-mono">
              Metodologia & Governança
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li><a href="#metodologia" className="hover:text-white transition-colors">Fase 1: Estratégia & Viabilidade</a></li>
              <li><a href="#metodologia" className="hover:text-white transition-colors">Fase 2: Planejamento & Compliance</a></li>
              <li><a href="#metodologia" className="hover:text-white transition-colors">Fase 3: Execução Operacional</a></li>
              <li><a href="#diferencial" className="hover:text-white transition-colors">Mitigação de Riscos FDA & Fiscais</a></li>
              <li><a href="#aviso-legal" className="hover:text-white transition-colors">Diretriz sobre Vistos e Advocacia</a></li>
            </ul>
          </div>

          {/* Col 4: Avaliação & Acesso */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-mono">
              Avaliação de Viabilidade
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Preencha o formulário online para receber retorno analítico e proposta personalizada.
            </p>
            <button
              onClick={onOpenForm}
              className="w-full text-left py-2.5 px-4 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-xs text-white font-semibold transition-colors flex items-center justify-between"
            >
              <span>Abrir Formulário</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="mt-5 pt-4 border-t border-white/10">
              <button
                onClick={onOpenAdmin}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors font-mono"
              >
                <KeyRound className="w-3 h-3 text-slate-400" />
                <span>Painel do Consultor</span>
              </button>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer text in footer */}
        <div className="mt-12 pt-8 border-t border-white/10 text-[11px] text-slate-400 leading-relaxed font-normal">
          {BIZHUB_INFO.legalDisclaimer}
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} {BIZHUB_INFO.legalName}. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>Orlando, FL</span>
            <span aria-hidden="true">·</span>
            <span>Inteligência Estratégica Brasil-EUA</span>
            <span aria-hidden="true">·</span>
            <span>Confidencialidade Garantida</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
