import React from 'react';
import { ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';

interface NavbarProps {
  onOpenForm: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenForm, onOpenAdmin }) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-black/90 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark with Transparent PNG Logo */}
        <a href="#" className="flex items-center gap-3 shrink-0 group">
          <img
            src="/assets/aistudio/bizhub_logo_dark_transparent.png"
            alt="BizHub Business Intelligence"
            className="h-10 w-auto object-contain transition-opacity group-hover:opacity-90"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/assets/aistudio/bizhub_symbol_transparent.png';
            }}
          />
        </a>

        {/* Zone 2: Clean single-line navigation links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a
            href="#ecossistema"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Ecossistema
          </a>
          <a
            href="#metodologia"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Metodologia
          </a>
          <a
            href="#diferencial"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            O Diferencial
          </a>
          <a
            href="#aviso-legal"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Diretriz Jurídica
          </a>
          <a
            href="#contato"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Contato
          </a>
        </nav>

        {/* Zone 3: Primary Action & Consultant Access (design.md pill button style) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAdmin}
            title="Acesso Consultor / Gestão de Viabilidade"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white border border-white/20 hover:border-white/40 rounded-full transition-all whitespace-nowrap shrink-0"
          >
            <KeyRound className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono text-[11px]">Painel do Consultor</span>
          </button>

          {/* design.md button-primary: White pill on black */}
          <button
            onClick={onOpenForm}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold tracking-tight text-black bg-white hover:bg-slate-200 rounded-full shadow-lg transition-all transform active:scale-95 whitespace-nowrap shrink-0"
          >
            <ShieldCheck className="w-4 h-4 text-black" />
            <span>Avaliação de Viabilidade</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
