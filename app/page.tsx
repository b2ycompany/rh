"use client";

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

// Componentes
import SplashScreen from '@/components/SplashScreen';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import Content from '@/components/Content';
import Discovery from '@/components/Discovery';
import Dashboard from '@/components/Dashboard';
import AdminRH from '@/components/AdminRH';
import JobBoard from '@/components/JobBoard';

// Inicialização do Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- TIPOS ---
export type UserRole = 'candidate' | 'client' | null;
export type ViewState = 'home' | 'discovery' | 'admin';

export interface JobData {
  id: string; title: string; area: string; seniority: string;
  description: string; salary: string; status: 'Ativa' | 'Pausada';
}

export interface TicketData {
  id: string; role: UserRole; name: string; company?: string;
  area: string; seniority: string; status: string; date: string;
  resumeName?: string; jobId?: string; contractStart?: string;
  contractEnd?: string; monthlyValue?: number; projectName?: string;
  paymentStatus?: string;
}

export default function TammyPlatform() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [view, setView] = useState<ViewState>('home');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [formData, setFormData] = useState({ name: "", company: "", area: "", seniority: "" });

  const [activeTicket, setActiveTicket] = useState<TicketData | null>(null);
  const [allTickets, setAllTickets] = useState<TicketData[]>([]);
  const [vacancies, setVacancies] = useState<JobData[]>([]);

  // Buscar dados reais do Supabase
  const fetchData = async () => {
    const { data: jobs } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
    const { data: tix } = await supabase.from('tickets').select('*').order('created_at', { ascending: false });
    if (jobs) setVacancies(jobs);
    if (tix) setAllTickets(tix);
  };

  useEffect(() => {
    fetchData();
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleTicketCreate = async (data: any) => {
    const newTicket: TicketData = {
      id: `TAMMY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      role: userRole,
      date: new Date().toLocaleDateString('pt-BR'),
      status: "Discovery",
      ...data
    };

    const { error } = await supabase.from('tickets').insert([newTicket]);
    if (!error) {
      setActiveTicket(newTicket);
      setAllTickets(prev => [newTicket, ...prev]);
      setView('home');
    } else {
      alert("Erro ao salvar no banco. Verifique sua conexão.");
    }
  };

  const handleAddJob = async (job: JobData) => {
    const { error } = await supabase.from('jobs').insert([job]);
    if (!error) {
      setVacancies(prev => [job, ...prev]);
    } else {
      alert("Erro ao publicar vaga no banco.");
    }
  };

  const updateTicketERP = async (id: string, updatedData: Partial<TicketData>) => {
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
                  {/* JobBoard agora exibe as vagas do banco real */}
                  <JobBoard vacancies={vacancies} onApply={(j: JobData) => { 
                    setUserRole('candidate'); 
                    setFormData({...formData, area: j.area, seniority: j.seniority}); 
                    setView('discovery'); 
                  }} />
                  <Content />
                </motion.div>
              )}

              {view === 'home' && activeTicket && (
                <motion.div key="d" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1 }}>
                  <Dashboard ticket={activeTicket} />
                  <div className="mt-12 text-center">
                    <button onClick={resetSession} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 hover:text-cyan-500 transition-colors italic">Novo Protocolo Discovery</button>
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