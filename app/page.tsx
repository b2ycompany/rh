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

// --- DEFINIÇÃO DE TIPOS E INTERFACES ---
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
  resume_name?: string;   
  projectName?: string;
  monthlyValue?: number;
  contractStart?: string;
  contractEnd?: string;
  paymentStatus?: string;
}

export default function TammyPlatform() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [view, setView] = useState<ViewState>('home');
  const [userRole, setUserRole] = useState<UserRole>(null);
  
  const [formData, setFormData] = useState({ area: "", seniority: "" });
  const [activeTicket, setActiveTicket] = useState<TicketData | null>(null);
  const [allTickets, setAllTickets] = useState<TicketData[]>([]);
  const [vacancies, setVacancies] = useState<JobData[]>([]);

  // Buscar dados reais do Supabase
  const fetchData = async () => {
    try {
      const { data: jobs } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
      const { data: tix } = await supabase.from('tickets').select('*').order('created_at', { ascending: false });
      if (jobs) setVacancies(jobs);
      if (tix) setAllTickets(tix);
    } catch (err) {
      console.error("Erro de sincronização:", err);
    } finally {
      setTimeout(() => setIsLoading(false), 3000);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTicketCreate = async (data: any) => {
    // Mapeamento exato para as colunas do banco (snake_case)
    const newTicket = {
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
      resume_name: data.resumeName
    };

    const { error } = await supabase.from('tickets').insert([newTicket]);
    
    if (!error) {
      setActiveTicket(newTicket as any);
      setAllTickets(prev => [newTicket as any, ...prev]);
      setView('home');
    } else {
      alert(`Erro no banco: ${error.message}`);
    }
  };

  const handleAddJob = async (job: JobData) => {
    const { error } = await supabase.from('jobs').insert([job]);
    if (!error) {
      setVacancies(prev => [job, ...prev]);
    } else {
      alert("Erro ao publicar vaga.");
    }
  };

  const updateTicketERP = async (id: string, updatedData: any) => {
    const { error } = await supabase.from('tickets').update(updatedData).eq('id', id);
    if (!error) {
      setAllTickets(prev => prev.map(t => t.id === id ? { ...t, ...updatedData } : t));
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
          <Navigation setView={setView} activeTicket={activeTicket} resetSession={resetSession} />
          <main className="pt-24 pb-20">
            <AnimatePresence mode="wait">
              {view === 'home' && !activeTicket && (
                <motion.div key="h" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Hero setUserRole={(r: any) => { setUserRole(r); setView('discovery'); }} />
                  <Stats />
                  <JobBoard 
                    vacancies={vacancies} 
                    onApply={(j: JobData) => {
                      setUserRole('candidate');
                      setFormData({ area: j.area, seniority: j.seniority });
                      setView('discovery');
                    }} 
                  />
                  <Content />
                </motion.div>
              )}

              {view === 'home' && activeTicket && (
                <motion.div key="d" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1 }}>
                  <Dashboard ticket={activeTicket} />
                  <div className="mt-12 text-center">
                    <button onClick={resetSession} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 hover:text-cyan-500 transition-colors">Novo Protocolo</button>
                  </div>
                </motion.div>
              )}

              {view === 'discovery' && (
                <motion.div key="disc" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1 }}>
                  <Discovery role={userRole} initialData={formData} onSubmit={handleTicketCreate} />
                </motion.div>
              )}

              {view === 'admin' && (
                <motion.div key="adm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1 }}>
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
            <p className="text-[9px] font-black uppercase tracking-[0.6em] text-slate-700 italic">Lion Solution & B2Y Group | Tammy RH & Hunting</p>
          </footer>
        </div>
      )}
    </div>
  );
}