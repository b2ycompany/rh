"use client";

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

// Componentes Modulares
import SplashScreen from '@/components/SplashScreen';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import Content from '@/components/Content';
import Discovery from '@/components/Discovery';
import Dashboard from '@/components/Dashboard';
import AdminRH from '@/components/AdminRH';
import JobBoard from '@/components/JobBoard';

// --- DEFINIÇÃO DE INTERFACES GLOBAIS ---
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
  cep?: string;
  cpf_cnpj?: string;
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
  resume_url?: string; // Mapeado para resume_url no banco
  // Campos ERP (Contrato e Faturamento)
  project_name?: string;
  monthly_value?: number;
  contract_start?: string;
  contract_end?: string;
  payment_status?: string;
}

export default function TammyPlatform() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [view, setView] = useState<ViewState>('home');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [formData, setFormData] = useState({ area: "", seniority: "" });

  const [activeTicket, setActiveTicket] = useState<TicketData | null>(null);
  const [allTickets, setAllTickets] = useState<TicketData[]>([]);
  const [vacancies, setVacancies] = useState<JobData[]>([]);

  // --- SINCRONIZAÇÃO COM O BANCO DE DADOS (SUPABASE) ---
  const fetchData = async () => {
    try {
      const { data: jobs } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
      const { data: tix } = await supabase.from('tickets').select('*').order('created_at', { ascending: false });
      
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

  // --- CRIAÇÃO DE TICKET (ONBOARDING) ---
  const handleTicketCreate = async (data: any) => {
    const newTicket = {
      id: `TAMMY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      role: userRole,
      name: data.name,
      email: data.email,
      whatsapp: data.whatsapp,
      cep: data.cep,
      cpf_cnpj: data.cpf_cnpj,
      region: data.region,
      linkedin_url: data.linkedinUrl,
      company_site: data.companySite,
      company: data.company || data.companySite || data.name,
      area: data.area,
      custom_area: data.customArea,
      seniority: data.seniority,
      quantity: data.quantity || 1,
      date: new Date().toLocaleDateString('pt-BR'),
      status: "Discovery",
      resume_url: data.resumeName // Guardamos o nome do arquivo enviado
    };

    const { error } = await supabase.from('tickets').insert([newTicket]);
    
    if (!error) {
      setActiveTicket(newTicket as any);
      setAllTickets(prev => [newTicket as any, ...prev]);
      setView('home');
    } else {
      alert(`Erro ao salvar no banco: ${error.message}`);
    }
  };

  // --- GESTÃO DE VAGAS (ADMIN) ---
  const handleAddJob = async (job: JobData) => {
    const { error } = await supabase.from('jobs').insert([job]);
    if (!error) {
      setVacancies(prev => [job, ...prev]);
    } else {
      alert("Erro ao publicar vaga.");
    }
  };

  // --- ATUALIZAÇÃO ERP (ADMIN) ---
  const updateTicketERP = async (id: string, updatedData: any) => {
    // Mapeamento para os nomes de colunas do banco (snake_case)
    const dbPayload = {
      status: updatedData.status,
      project_name: updatedData.project_name,
      monthly_value: updatedData.monthly_value,
      contract_start: updatedData.contract_start,
      contract_end: updatedData.contract_end,
      payment_status: updatedData.payment_status
    };

    const { error } = await supabase.from('tickets').update(dbPayload).eq('id', id);

    if (!error) {
      // Atualiza localmente para refletir no Admin e Dashboard sem refresh
      setAllTickets(prev => prev.map(t => t.id === id ? { ...t, ...updatedData } : t));
    } else {
      alert(`Erro ERP: ${error.message}`);
    }
  };

  const resetSession = () => {
    setActiveTicket(null);
    setUserRole(null);
    setView('home');
  };

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
              
              {/* VIEW: HOME */}
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

              {/* VIEW: DASHBOARD USUÁRIO */}
              {view === 'home' && activeTicket && (
                <motion.div key="d-view" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1 }}>
                  <Dashboard ticket={activeTicket} />
                  <div className="mt-12 text-center">
                    <button onClick={resetSession} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 hover:text-cyan-500 transition-colors">Novo Discovery</button>
                  </div>
                </motion.div>
              )}

              {/* VIEW: DISCOVERY FORM */}
              {view === 'discovery' && (
                <motion.div key="disc-view" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1 }}>
                  <Discovery 
                    role={userRole} 
                    initialData={formData} 
                    onSubmit={handleTicketCreate} 
                  />
                </motion.div>
              )}

              {/* VIEW: ADMIN PANEL */}
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
            <p className="text-[9px] font-black uppercase tracking-[0.6em] text-slate-700 italic">
              Lion Solution & B2Y Group | Tammy RH & Hunting
            </p>
          </footer>
        </div>
      )}
    </div>
  );
}