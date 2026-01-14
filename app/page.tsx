"use client";

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

// Importação dos Componentes Modulares
import SplashScreen from '@/components/SplashScreen';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import Content from '@/components/Content';
import Discovery from '@/components/Discovery';
import Dashboard from '@/components/Dashboard';
import AdminRH from '@/components/AdminRH';
import JobBoard from '@/components/JobBoard';

// --- 1. DEFINIÇÃO DE TIPOS E INTERFACES (EXPORTADOS PARA TODO O PROJETO) ---
export type UserRole = 'candidate' | 'client' | null;
export type ViewState = 'home' | 'discovery' | 'admin';

export interface JobData {
  id: string;
  title: string;
  area: string;
  seniority: string;
  description: string;
  salary: string;
  status: 'Ativa' | 'Pausada';
}

export interface TicketData {
  id: string;
  role: UserRole;
  name: string;
  email?: string;
  whatsapp?: string;
  region?: string;
  linkedin_url?: string;
  company_site?: string;
  company?: string;      
  area: string;
  custom_area?: string;
  seniority?: string;
  quantity?: number;
  status: string;
  date: string;
  resumeName?: string;   
  // Campos ERP / Gestão de Contrato
  projectName?: string;
  monthlyValue?: number;
  contractStart?: string;
  contractEnd?: string;
  paymentStatus?: string;
}

export default function TammyPlatform() {
  // --- 2. ESTADOS GLOBAIS ---
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [view, setView] = useState<ViewState>('home');
  const [userRole, setUserRole] = useState<UserRole>(null);
  
  // Buffer para preenchimento via JobBoard ou seleção manual
  const [formData, setFormData] = useState({
    area: "",
    seniority: ""
  });

  // Gerenciamento de Dados Sincronizados
  const [activeTicket, setActiveTicket] = useState<TicketData | null>(null);
  const [allTickets, setAllTickets] = useState<TicketData[]>([]);
  const [vacancies, setVacancies] = useState<JobData[]>([]);

  // --- 3. SINCRONIZAÇÃO COM O BANCO DE DADOS (SUPABASE) ---
  const fetchData = async () => {
    try {
      const { data: jobs } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: tix } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (jobs) setVacancies(jobs);
      if (tix) setAllTickets(tix);
    } catch (err) {
      console.error("Falha na sincronização:", err);
    } finally {
      setTimeout(() => setIsLoading(false), 3000);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 4. FUNÇÕES DE OPERAÇÃO ---

  // Criar novo lead/ticket
  const handleTicketCreate = async (data: any) => {
    const newTicket: TicketData = {
      id: `TAMMY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      role: userRole,
      name: data.name,
      email: data.email,
      whatsapp: data.whatsapp,
      region: data.region,
      linkedin_url: data.linkedinUrl,
      company_site: data.companySite,
      company: data.company || data.companySite,
      area: data.area,
      custom_area: data.customArea,
      seniority: data.seniority,
      quantity: data.quantity || 1,
      date: new Date().toLocaleDateString('pt-BR'),
      status: "Discovery",
      resumeName: data.resumeName
    };

    // Mapeamento para as colunas snake_case do PostgreSQL
    const { error } = await supabase.from('tickets').insert([{
      id: newTicket.id,
      role: newTicket.role,
      name: newTicket.name,
      email: newTicket.email,
      whatsapp: newTicket.whatsapp,
      region: newTicket.region,
      linkedin_url: newTicket.linkedin_url,
      company_site: newTicket.company_site,
      company: newTicket.company,
      area: newTicket.area,
      custom_area: newTicket.custom_area,
      seniority: newTicket.seniority,
      quantity: newTicket.quantity,
      status: newTicket.status,
      date: newTicket.date,
      resume_name: newTicket.resumeName
    }]);
    
    if (!error) {
      setActiveTicket(newTicket);
      setAllTickets(prev => [newTicket, ...prev]);
      setView('home');
      setFormData({ area: "", seniority: "" });
    } else {
      alert(`Erro no banco: ${error.message}`);
    }
  };

  // Publicar vaga (Marketplace)
  const handleAddJob = async (job: JobData) => {
    const { error } = await supabase.from('jobs').insert([job]);
    if (!error) {
      setVacancies(prev => [job, ...prev]);
    } else {
      alert("Erro ao publicar vaga.");
    }
  };

  // Atualizar contrato (ERP)
  const updateTicketERP = async (id: string, updatedData: Partial<TicketData>) => {
    // Mapeamento para o banco
    const dbData = {
      status: updatedData.status,
      project_name: updatedData.projectName,
      monthly_value: updatedData.monthlyValue,
      contract_start: updatedData.contractStart,
      contract_end: updatedData.contractEnd,
      payment_status: updatedData.paymentStatus
    };

    const { error } = await supabase.from('tickets').update(dbData).eq('id', id);

    if (!error) {
      setAllTickets(prev => prev.map(t => t.id === id ? { ...t, ...updatedData } : t));
    } else {
      alert("Erro ao atualizar dados ERP.");
    }
  };

  const resetSession = () => {
    setActiveTicket(null);
    setUserRole(null);
    setView('home');
  };

  // --- 5. RENDERIZAÇÃO DA INTERFACE ---
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500 font-sans antialiased overflow-x-hidden">
      <AnimatePresence mode="wait">
        {isLoading && <SplashScreen key="splash" finishLoading={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <div className="relative">
          <Navigation 
            setView={setView} 
            activeTicket={activeTicket} 
            resetSession={resetSession} 
          />
          
          <main className="pt-24 pb-20">
            <AnimatePresence mode="wait">
              
              {/* HOME: Marketplace e Branding */}
              {view === 'home' && !activeTicket && (
                <motion.div key="h-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Hero setUserRole={(role: UserRole) => { setUserRole(role); setView('discovery'); }} />
                  <Stats />
                  <JobBoard 
                    vacancies={vacancies} 
                    onApply={(job: JobData) => {
                      setUserRole('candidate');
                      setFormData({ area: job.area, seniority: job.seniority });
                      setView('discovery');
                    }} 
                  />
                  <Content />
                </motion.div>
              )}

              {/* DASHBOARD: Acompanhamento de Leads e Contratos */}
              {view === 'home' && activeTicket && (
                <motion.div key="d-view" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1 }}>
                  <Dashboard ticket={activeTicket} />
                  <div className="mt-12 text-center">
                    <button onClick={resetSession} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 hover:text-cyan-500 transition-colors italic">Novo Discovery</button>
                  </div>
                </motion.div>
              )}

              {/* DISCOVERY: Onboarding de Leads Tech e Clientes */}
              {view === 'discovery' && (
                <motion.div key="disc-view" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1 }}>
                  <Discovery role={userRole} initialData={formData} onSubmit={handleTicketCreate} />
                </motion.div>
              )}

              {/* ADMIN: Gestão de Operação e ERP */}
              {view === 'admin' && (
                <motion.div key="adm-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1 }}>
                  <AdminRH 
                    tickets={allTickets} 
                    vacancies={vacancies} 
                    onAddJob={handleAddJob} 
                    onUpdateERP={updateTicketERP} 
                  />
                </motion.div>
              )}

            </AnimatePresence>
          </main>

          <footer className="container mx-auto px-6 py-12 border-t border-white/5 text-center">
            <p className="text-[9px] font-black uppercase tracking-[0.6em] text-slate-700 italic italic">
              Lion Solution & B2Y Group | Tammy RH & Hunting
            </p>
          </footer>
        </div>
      )}
    </div>
  );
}