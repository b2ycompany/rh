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

// --- INTERFACES GLOBAIS (ESTRUTURA COMPLETA) ---
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
  resume_url?: string;
  // Campos ERP (Nomes padronizados para o Banco de Dados)
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

  // Sincronização em tempo real com Supabase
  const fetchData = async () => {
    try {
      const { data: jobs } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
      const { data: tix } = await supabase.from('tickets').select('*').order('created_at', { ascending: false });
      if (jobs) setVacancies(jobs);
      if (tix) setAllTickets(tix);
    } catch (err) {
      console.error("Erro na busca:", err);
    } finally {
      setTimeout(() => setIsLoading(false), 3000);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Criar Ticket (Lead Onboarding)
  const handleTicketCreate = async (data: any) => {
    const newTicket: TicketData = {
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
      resume_url: data.resumeName
    };

    const { error } = await supabase.from('tickets').insert([newTicket]);
    
    if (!error) {
      setActiveTicket(newTicket);
      setAllTickets(prev => [newTicket, ...prev]);
      setView('home');
    } else {
      alert(`Erro no banco: ${error.message}`);
    }
  };

  const handleAddJob = async (job: JobData) => {
    const { error } = await supabase.from('jobs').insert([job]);
    if (!error) setVacancies(prev => [job, ...prev]);
  };

  const updateTicketERP = async (id: string, updatedData: any) => {
    const { error } = await supabase.from('tickets').update(updatedData).eq('id', id);
    if (!error) {
      setAllTickets(prev => prev.map(t => t.id === id ? { ...t, ...updatedData } : t));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500 font-sans antialiased overflow-x-hidden">
      <AnimatePresence mode="wait">
        {isLoading && <SplashScreen finishLoading={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <div className="relative">
          <Navigation setView={setView} activeTicket={activeTicket} resetSession={() => {setActiveTicket(null); setView('home');}} />
          <main className="pt-24 pb-20">
            <AnimatePresence mode="wait">
              {view === 'home' && !activeTicket && (
                <motion.div key="h" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Hero setUserRole={(r: any) => { setUserRole(r); setView('discovery'); }} />
                  <Stats />
                  <JobBoard vacancies={vacancies} onApply={(j: JobData) => { setUserRole('candidate'); setFormData({area: j.area, seniority: j.seniority}); setView('discovery'); }} />
                  <Content />
                </motion.div>
              )}
              {view === 'home' && activeTicket && (
                <motion.div key="d" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1 }}>
                  <Dashboard ticket={activeTicket} />
                </motion.div>
              )}
              {view === 'discovery' && (
                <motion.div key="disc" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1 }}>
                  <Discovery role={userRole} initialData={formData} onSubmit={handleTicketCreate} />
                </motion.div>
              )}
              {view === 'admin' && (
                <motion.div key="adm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1 }}>
                  <AdminRH tickets={allTickets} vacancies={vacancies} onAddJob={handleAddJob} onUpdateERP={updateTicketERP} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
          <footer className="container mx-auto px-6 py-12 border-t border-white/5 text-center italic text-[9px] text-slate-700 tracking-[0.5em] uppercase">
            Lion Solution & B2Y Group | Tammy RH & Hunting
          </footer>
        </div>
      )}
    </div>
  );
}