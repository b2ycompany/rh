"use client";

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

// Infraestrutura de Componentes Lion Solution
import SplashScreen from '@/components/SplashScreen';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import Content from '@/components/Content';
import Discovery from '@/components/Discovery';
import Dashboard from '@/components/Dashboard';
import AdminRH from '@/components/AdminRH';
import JobBoard from '@/components/JobBoard';

// --- INTERFACES TÉCNICAS INTEGRAIS (SINCRO TOTAL BACKOFFICE) ---
export type UserRole = 'candidate' | 'client' | null;
export type ViewState = 'home' | 'discovery' | 'admin' | 'tracking';

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
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
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
  // --- INTELIGÊNCIA PSICOMÉTRICA DE ELITE (DISC + OCEAN) ---
  experience_bio?: string;
  soft_skills?: string;
  behavioral_profile?: string; // DISC Principal Resultante
  disc_q1?: string; disc_q2?: string; disc_q3?: string; disc_q4?: string;
  marital_status?: string; 
  hobbies?: string;         
  skills_summary?: string;
  behavioral_summary?: string;
  tech_level?: string;
  market_segments?: string;
  situational_response?: string;
  // Métricas Big Five (OCEAN)
  ocean_openness?: number;
  ocean_conscientiousness?: number;
  ocean_extraversion?: number;
  ocean_agreeableness?: number;
  ocean_neuroticism?: number;
  // --- GESTÃO BACKOFFICE, ERP & BALANÇO FINANCEIRO ---
  contract_url?: string;
  id_docs_url?: string;
  contract_status?: string;    
  employment_status?: string;  
  client_assigned?: string;    
  project_name?: string;       
  contract_start?: string;     
  contract_end?: string;       
  monthly_value?: number;      
  first_salary?: number;       
  hiring_fee?: number;         // Receita única Lion (50/65/75%)
  hiring_notes?: string;       
  billing_day?: number;        
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

  // Sincronização em tempo real com auditoria de integridade Belém/PA
  const fetchData = async () => {
    try {
      const { data: jobs } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
      const { data: tix } = await supabase.from('tickets').select('*').order('created_at', { ascending: false });
      if (jobs) setVacancies(jobs);
      if (tix) setAllTickets(tix);
    } catch (err) {
      console.error("ERRO CRÍTICO NA BUSCA DE DADOS:", err);
    } finally {
      setTimeout(() => setIsLoading(false), 3000);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRetrieveTicket = async (protocolId: string) => {
    const { data, error } = await supabase.from('tickets').select('*').eq('id', protocolId.toUpperCase()).single();
    if (data && !error) { 
      setActiveTicket(data); 
      setView('home'); 
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
    } else { 
      alert("Protocolo não localizado na governança Lion."); 
    }
  };

  const handleTicketCreate = async (data: any) => {
    const dbPayload = {
      id: `LION-${Math.random().toString(36).substr(2, 7).toUpperCase()}`,
      role: userRole,
      ...data,
      date: new Date().toLocaleDateString('pt-BR'),
      status: userRole === 'client' ? "Cotação" : "Discovery",
      contract_status: 'Lead',
      employment_status: 'Disponível'
    };

    console.log("GRAVANDO ATIVO LION:", dbPayload);
    const { error } = await supabase.from('tickets').insert([dbPayload]);
    
    if (!error) {
      setActiveTicket(dbPayload as any);
      setAllTickets(prev => [dbPayload as any, ...prev]);
      setView('home');
    } else {
      console.error("ERRO SUPABASE DETALHADO:", error);
      alert(`Falha no banco: ${error.message}`);
    }
  };

  const updateTicketERP = async (id: string, updatedData: any) => {
    console.log(`AUDITORIA FINANCEIRA: Atualizando Ticket ${id}`, updatedData);
    const { error } = await supabase.from('tickets').update(updatedData).eq('id', id);
    if (!error) {
      setAllTickets(prev => prev.map(t => t.id === id ? { ...t, ...updatedData } : t));
      if (activeTicket?.id === id) setActiveTicket(prev => ({ ...prev!, ...updatedData }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500 font-sans antialiased overflow-x-hidden text-left">
      <AnimatePresence mode="wait">
        {isLoading && <SplashScreen finishLoading={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <div className="relative">
          <Navigation setView={setView} activeTicket={activeTicket} resetSession={() => {setActiveTicket(null); setView('home');}} onSearchProtocol={handleRetrieveTicket} />
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
                  <AdminRH tickets={allTickets} vacancies={vacancies} onAddJob={()=>{}} onUpdateJob={()=>{}} onUpdateERP={updateTicketERP} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
          <footer className="container mx-auto px-6 py-12 border-t border-white/5 text-center italic text-[9px] text-slate-700 tracking-[0.5em] uppercase font-black">
            Lion Solution & B2Y Group | Backoffice ERP v7.0
          </footer>
        </div>
      )}
    </div>
  );
}