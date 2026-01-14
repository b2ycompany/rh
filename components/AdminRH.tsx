"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck, LogOut, Plus, Wallet, Calendar, FileText, Building2, UserCheck, X } from 'lucide-react';
import { TicketData, JobData } from '@/app/page';

interface AdminProps {
  tickets: TicketData[];
  vacancies: JobData[];
  onAddJob: (job: JobData) => void;
  onUpdateERP: (id: string, data: Partial<TicketData>) => void;
}

export default function AdminRH({ tickets, vacancies, onAddJob, onUpdateERP }: AdminProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [creds, setCreds] = useState({ user: "", pass: "" });
  const [activeTab, setActiveTab] = useState<'tickets' | 'jobs'>('tickets');
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (creds.user === "LIONRISING" && creds.pass === "LE010584") setIsAuthorized(true);
    else alert("ACESSO NEGADO");
  };

  const submitJob = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onAddJob({
      id: `JOB-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      title: fd.get('t') as string,
      area: fd.get('a') as string,
      seniority: fd.get('s') as string,
      salary: fd.get('v') as string,
      description: fd.get('d') as string,
      status: 'Ativa'
    });
    setShowJobForm(false);
  };

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto py-20 bg-slate-900 p-10 rounded-[40px] border border-white/5 text-center shadow-2xl">
        <Lock size={40} className="text-cyan-500 mx-auto mb-6" />
        <h2 className="text-2xl font-black uppercase italic mb-8">Acesso Admin</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input onChange={e => setCreds({...creds, user: e.target.value})} placeholder="OPERADOR" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-xs font-bold text-white uppercase outline-none focus:border-cyan-500" />
          <input type="password" onChange={e => setCreds({...creds, pass: e.target.value})} placeholder="CHAVE" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-xs font-bold text-white outline-none" />
          <button className="w-full bg-cyan-500 text-slate-950 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white transition-all">Autenticar</button>
        </form>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-6">
      <div className="bg-slate-900 p-10 rounded-[40px] border border-white/5 shadow-2xl">
        <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-8">
          <div className="flex gap-4">
            <button onClick={() => setActiveTab('tickets')} className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'tickets' ? 'bg-cyan-500 text-slate-950' : 'bg-white/5 text-slate-500'}`}>Tickets</button>
            <button onClick={() => setActiveTab('jobs')} className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'jobs' ? 'bg-cyan-500 text-slate-950' : 'bg-white/5 text-slate-500'}`}>Vagas</button>
          </div>
          <button onClick={() => setIsAuthorized(false)} className="text-red-500 text-[10px] font-black uppercase flex items-center gap-2 hover:text-white transition-all italic">
            <LogOut size={16}/> Sair
          </button>
        </div>

        {activeTab === 'tickets' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="uppercase font-black text-slate-500 border-b border-white/10 italic text-[10px]">
                  <th className="pb-4">ID</th><th className="pb-4">Status</th><th className="pb-4">Entidade</th><th className="pb-4">Currículo</th><th className="pb-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(t => (
                  <tr key={t.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-6 font-mono text-cyan-500 font-bold">{t.id}</td>
                    <td className="py-6 font-black uppercase text-[9px]">{t.status}</td>
                    <td className="py-6 font-black italic text-slate-300 uppercase">
                      {t.role === 'client' ? <Building2 size={14} className="inline mr-2" /> : <UserCheck size={14} className="inline mr-2" />}
                      {t.company || t.name}
                    </td>
                    <td className="py-6 italic text-slate-500">{t.resume_name || 'N/A'}</td>
                    <td className="py-6 text-right"><button onClick={() => setEditingId(t.id)} className="bg-cyan-500 text-slate-950 px-4 py-2 rounded-lg font-black text-[9px] uppercase">ERP</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black italic uppercase text-white">Gestão de Oportunidades</h3>
              <button onClick={() => setShowJobForm(true)} className="flex items-center gap-2 bg-cyan-500 text-slate-950 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest"><Plus size={16}/> Criar Vaga</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vacancies.map(job => (
                <div key={job.id} className="p-8 bg-slate-950 border border-white/10 rounded-3xl group hover:border-cyan-500/50 transition-all">
                  <h4 className="text-lg font-black italic uppercase text-cyan-500 mb-2">{job.title}</h4>
                  <p className="text-[10px] text-slate-500 mb-4 font-black uppercase tracking-widest">{job.area} • {job.seniority}</p>
                  <p className="text-white font-black text-sm uppercase italic">{job.salary}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL NOVA VAGA */}
      {showJobForm && (
        <div className="fixed inset-0 z-[120] bg-slate-950/90 flex items-center justify-center p-6">
          <form className="bg-slate-900 border border-cyan-500/30 p-10 rounded-[40px] max-w-lg w-full space-y-4 text-left" onSubmit={submitJob}>
            <h3 className="text-xl font-black italic uppercase mb-6 text-cyan-500">Publicar Vaga Elite</h3>
            <input name="t" required placeholder="TÍTULO" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-xs font-bold text-white uppercase outline-none focus:border-cyan-500" />
            <input name="a" required placeholder="ÁREA" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-xs font-bold text-white uppercase outline-none focus:border-cyan-500" />
            <input name="s" required placeholder="SENIORIDADE" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-xs font-bold text-white uppercase outline-none focus:border-cyan-500" />
            <input name="v" required placeholder="SALÁRIO" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-xs font-bold text-white uppercase outline-none focus:border-cyan-500" />
            <textarea name="d" required placeholder="DESCRIÇÃO" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-xs font-bold text-white uppercase outline-none focus:border-cyan-500" />
            <div className="flex gap-4"><button type="button" onClick={() => setShowJobForm(false)} className="w-1/3 text-slate-500 font-black uppercase text-[10px]">Cancelar</button><button type="submit" className="w-2/3 bg-cyan-500 text-slate-950 py-5 rounded-2xl font-black uppercase text-xs tracking-widest">Publicar</button></div>
          </form>
        </div>
      )}

      {/* MODAL ERP */}
      {editingId && (
        <div className="fixed inset-0 z-[120] bg-slate-950/90 flex items-center justify-center p-6 text-left">
          <form className="bg-slate-900 border border-cyan-500/30 p-10 rounded-[40px] max-w-lg w-full space-y-4" onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            onUpdateERP(editingId, { status: 'Contratado', projectName: fd.get('p') as string, monthlyValue: Number(fd.get('v')), contractStart: fd.get('s') as string, contractEnd: fd.get('e') as string });
            setEditingId(null);
          }}>
            <h3 className="text-xl font-black italic uppercase mb-8 text-cyan-500 italic">Módulo ERP Lion Solution</h3>
            <input name="p" required placeholder="PROJETO" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-xs font-bold text-white uppercase" />
            <input name="v" type="number" required placeholder="VALOR MENSAL (R$)" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-xs font-bold text-white uppercase" />
            <div className="grid grid-cols-2 gap-4">
              <input name="s" type="date" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-xs font-bold text-white" />
              <input name="e" type="date" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-xs font-bold text-white" />
            </div>
            <div className="flex gap-4 pt-6"><button type="button" onClick={() => setEditingId(null)} className="w-1/3 text-slate-500 font-black uppercase text-[10px]">Voltar</button><button type="submit" className="w-2/3 bg-cyan-500 text-slate-950 py-5 rounded-2xl font-black uppercase text-xs tracking-widest">Gravar Contrato</button></div>
          </form>
        </div>
      )}
    </section>
  );
}