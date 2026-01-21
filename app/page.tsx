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

// --- INTERFACES TÉCNICAS INTEGRAIS ---
export type UserRole = 'candidate' | 'client' | null;
export type ViewState = 'home' | 'discovery' | 'admin';

export interface JobData {
  id: string; title: string; area: string; seniority: string;
  description: string; salary: string; status: 'Ativa' | 'Pausada';
}

export interface TicketData {
  id: string; role: UserRole; name: string; email?: string;
  whatsapp?: string; cep?: string; cpf_cnpj?: string;
  logradouro?: string; numero?: string; bairro?: string;
  cidade?: string; uf?: string; region?: string;
  linkedin_url?: string; company_site?: string; company?: string;
  area: string; custom_area?: string; seniority?: string;
  quantity?: number; status: string; date: string; resume_url?: string;
  experience_bio?: string; soft_skills?: string; behavioral_profile?: string;
  skills_summary?: string; behavioral_summary?: string;
  project_name?: string; monthly_value?: number; contract_start?: string;
  contract_end?: string; payment_status?: string;
}

export default function TammyPlatform() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [view, setView] = useState<ViewState>('home');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [formData, setFormData] = useState({ area: "", seniority: "" });
  const [activeTicket, setActiveTicket] = useState<TicketData | null>(null);
  const [allTickets, setAllTickets] = useState<TicketData[]>([]);
  const [vacancies, setVacancies] = useState<JobData[]>([]);

  const fetchData = async () => {
    try {
      const { data: jobs } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
      const { data: tix } = await supabase.from('tickets').select('*').order('created_at', { ascending: false });
      if (jobs) setVacancies(jobs);
      if (tix) setAllTickets(tix);
    } catch (err) {
      console.error("Erro na busca de dados:", err);
    } finally {
      setTimeout(() => setIsLoading(false), 3000);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRetrieveTicket = async (protocolId: string) => {
    const { data, error } = await supabase.from('tickets').select('*').eq('id', protocolId.toUpperCase()).single();
    if (data && !error) { setActiveTicket(data); setView('home'); }
    else { alert("Protocolo não localizado na governança Lion."); }
  };

  const handleTicketCreate = async (data: any) => {
    // MAPEAMENTO SEGURO PARA O BANCO (SNAKE_CASE)
    const dbPayload = {
      id: `LION-${Math.random().toString(36).substr(2, 7).toUpperCase()}`,
      role: userRole,
      name: data.name,
      email: data.email,
      whatsapp: data.whatsapp,
      cep: data.cep,
      cpf_cnpj: data.cpf_cnpj,
      logradouro: data.logradouro,
      numero: data.numero,
      bairro: data.bairro,
      cidade: data.cidade,
      uf: data.uf,
      region: data.region,
      area: data.area,
      custom_area: data.custom_area,
      seniority: data.seniority,
      experience_bio: data.experience_bio,
      behavioral_profile: data.behavioral_profile,
      soft_skills: data.soft_skills,
      skills_summary: data.skills_summary,
      behavioral_summary: data.behavioral_summary,
      linkedin_url: data.linkedin_url,
      company: data.company,
      company_site: data.company_site,
      quantity: data.quantity || 1,
      date: new Date().toLocaleDateString('pt-BR'),
      status: userRole === 'client' ? "Cotação" : "Discovery",
      resume_url: data.resumeName
    };

    console.log("Iniciando gravação de Lead...", dbPayload);

    const { error } = await supabase.from('tickets').insert([dbPayload]);
    
    if (!error) {
      setActiveTicket(dbPayload as any);
      setAllTickets(prev => [dbPayload as any, ...prev]);
      setView('home');
    } else {
      console.error("ERRO CRÍTICO SUPABASE:", error);
      alert(`Erro ao salvar: ${error.message}`);
    }
  };

  const handleUpdateJob = async (id: string, updatedJob: Partial<JobData>) => {
    const { error } = await supabase.from('jobs').update(updatedJob).eq('id', id);
    if (!error) setVacancies(prev => prev.map(j => j.id === id ? { ...j, ...updatedJob } : j));
  };

  const updateTicketERP = async (id: string, updatedData: any) => {
    const { error } = await supabase.from('tickets').update(updatedData).eq('id', id);
    if (!error) setAllTickets(prev => prev.map(t => t.id === id ? { ...t, ...updatedData } : t));
  };

  const handleAddJob = async (job: JobData) => {
    const { error } = await supabase.from('jobs').insert([job]);
    if (!error) setVacancies(prev => [job, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500 font-sans antialiased overflow-x-hidden">
      <AnimatePresence mode="wait">
        {isLoading && <SplashScreen finishLoading={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <div className="relative">
          <Navigation 
            setView={setView} 
            activeTicket={activeTicket} 
            resetSession={() => {setActiveTicket(null); setView('home');}} 
            onSearchProtocol={handleRetrieveTicket}
          />
          <main className="pt-24 pb-20">
            <AnimatePresence mode="wait">
              {view === 'home' && !activeTicket && (
                <motion.div key="h" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
                  <AdminRH tickets={allTickets} vacancies={vacancies} onAddJob={handleAddJob} onUpdateJob={handleUpdateJob} onUpdateERP={updateTicketERP} />
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