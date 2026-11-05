import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { EcosystemSection } from './components/EcosystemSection';
import { MethodologySection } from './components/MethodologySection';
import { RiskComparisonSection } from './components/RiskComparisonSection';
import { Footer } from './components/Footer';
import { ViabilityFormModal } from './components/ViabilityFormModal';
import { LeadManagementModal } from './components/LeadManagementModal';
import { ShieldCheck } from 'lucide-react';

export default function App() {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [preselectedService, setPreselectedService] = useState<string | undefined>(undefined);

  const handleOpenForm = (service?: string) => {
    setPreselectedService(service);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setPreselectedService(undefined);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-[#494fdf] selection:text-white">
      {/* Top Navbar adhering to Top Bar Contract */}
      <Navbar
        onOpenForm={() => handleOpenForm()}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content Flow */}
      <main className="flex-1 bg-black">
        {/* Hero Section */}
        <Hero onOpenForm={() => handleOpenForm()} />

        {/* 6 Specialized Business Units with Dedicated Identity Logos & Colors */}
        <EcosystemSection onOpenFormWithService={(service) => handleOpenForm(service)} />

        {/* 3-Phase Strategic & Operational Methodology */}
        <MethodologySection onOpenForm={() => handleOpenForm()} />

        {/* The Risks of Going Alone vs BizHub Integrated Safety & Legal Statement */}
        <RiskComparisonSection onOpenForm={() => handleOpenForm()} />
      </main>

      {/* Corporate Footer */}
      <Footer
        onOpenForm={() => handleOpenForm()}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Floating Pill CTA for Quick Access (White pill with black text) */}
      <div className="fixed bottom-6 right-6 z-30 hidden sm:block">
        <button
          onClick={() => handleOpenForm()}
          className="group flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white text-black font-bold text-xs shadow-2xl hover:bg-slate-200 transition-all transform hover:-translate-y-0.5 active:scale-95"
        >
          <ShieldCheck className="w-4 h-4 text-black" />
          <span>Avaliação de Viabilidade</span>
        </button>
      </div>

      {/* Evaluation & Viability Questionnaire Modal */}
      <ViabilityFormModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        preselectedService={preselectedService}
      />

      {/* Lead Management & Follow-up CRM Modal */}
      <LeadManagementModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}
