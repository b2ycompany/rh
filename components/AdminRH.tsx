"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, ShieldCheck, LogOut, Plus, Wallet, FileText, 
  Building2, UserCheck, X, Search, Filter 
} from 'lucide-react';
import { TicketData, JobData } from '@/app/page';

interface AdminProps {
  tickets: TicketData[];
  vacancies: JobData[];
  onAddJob: (job: JobData) => void;
  onUpdateERP: (id: string, data: any) => void;
}

export default function AdminRH({ tickets, vacancies, onAddJob, onUpdateERP }: AdminProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [creds, setCreds] = useState({ user: "", pass: "" });
  const [activeTab, setActiveTab] = useState<'tickets' | 'jobs'>('tickets');
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const u = creds.user.trim().toUpperCase();
    const p = creds.pass.trim().toUpperCase();
    if (u === "LIONRISING" && p === "LE010584") setIsAuthorized(true);
    else alert("ACESSO NEGADO: Credenciais Inválidas");
  };

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto py-24 px-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 p-12 rounded-[60px] border border-white/5 text-center shadow-2xl">
          <div className="w-20 h-20 bg-cyan-500/10 rounded-3xl flex items-center justify-center mx-auto mb-10 border border-cyan-500/20">
            <Lock size={40} className="text-cyan-500" />
          </div>
          <h2 className="text-3xl font-black uppercase italic mb-10 text-white italic tracking-tighter">Lion <span className="text-cyan-500">Governance</span></h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input onChange={e => setCreds({...creds, user: e.target.value})} placeholder="OPERADOR" className="w-full bg-slate-950 border border-white/10 p-6 rounded-2xl text-[10px] font-bold text-white uppercase outline-none focus:border-cyan-500 transition-all" />
            <input type="password" onChange={e => setCreds({...creds, pass: e.target.value})} placeholder="CHAVE DE ACESSO" className="w-full bg-slate-950 border border-white/10 p-6 rounded-2xl text-[10px] font-bold text-white outline-none focus:border-cyan-500 font-mono" />
            <button className="w-full bg-cyan-500 text-slate-950 py-6 rounded-3xl font-black uppercase text-xs tracking-[0.4em] hover:bg-white transition-all duration-500 shadow-xl shadow-cyan-500/20">Acessar Auditoria</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-6">
      <div className="bg-slate-900 p-12 rounded-[60px] border border-white/5 shadow-2xl">
        {/* HEADER ADMIN */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-12 border-b border-white/5 pb-10 gap-8">
          <div className="flex bg-slate-950 p-2 rounded-[30px] border border-white/5">
            <button onClick={() => setActiveTab('tickets')} className={`px-10 py-4 rounded-[25px] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${activeTab === 'tickets' ? 'bg-cyan-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}>Base de Leads</button>
            <button onClick={() => setActiveTab('jobs')} className={`px-10 py-4 rounded-[25px] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${activeTab === 'jobs' ? 'bg-cyan-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}>Vagas Ativas</button>
          </div>
          <div className="flex items-center gap-8">
             <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase text-green-500 flex items-center gap-2"><ShieldCheck size={14}/> LionRising_Ativo</span>
                <span className="text-[8px] font-mono text-slate-600 uppercase">Acesso Autorizado • 2026</span>
             </div>
             <button onClick={() => setIsAuthorized(false)} className="p-4 bg-white/5 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all duration-500"><LogOut size={20}/></button>
          </div>
        </div>

        {activeTab === 'tickets' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase font-black text-slate-500 border-b border-white/10 italic text-center">
                  <th className="pb-6 text-left">Protocolo</th>
                  <th className="pb-6 text-left">Entidade / Lead Info</th>
                  <th className="pb-6">CPF / CNPJ</th>
                  <th className="pb-6">Região / CEP</th>
                  <th className="pb-6">Doc CV</th>
                  <th className="pb-6 text-right">Módulo ERP</th>
                </tr>
              </thead>
              <tbody className="text-[11px]">
                {tickets.map(t => (
                  <tr key={t.id} className="border-b border-white/5 hover:bg-white/5 transition-all text-center">
                    <td className="py-8 font-mono text-cyan-500 font-bold text-left">{t.id}</td>
                    <td className="py-8 text-left">
                      <div className="flex flex-col">
                        <span className="font-black text-white flex items-center gap-2 uppercase italic text-sm">
                           {t.role === 'client' ? <Building2 size={14} className="text-blue-400" /> : <UserCheck size={14} className="text-purple-400" />}
                           {t.name}
                        </span>
                        <span className="text-slate-500 font-mono mt-1 uppercase tracking-tighter">{t.whatsapp} | {t.email}</span>
                        <span className="text-slate-600 text-[9px] font-bold uppercase mt-1">{t.area} {t.custom_area && `(${t.custom_area})`}</span>
                      </div>
                    </td>
                    <td className="py-8 text-slate-400 font-mono tracking-tighter italic">{t.cpf_cnpj || "00.000.000-00"}</td>
                    <td className="py-8">
                      <div className="flex flex-col uppercase font-black italic">
                        <span className="text-slate-300">{t.region || "Remoto"}</span>
                        <span className="text-[9px] text-slate-600 not-italic font-mono">{t.cep || "00000-000"}</span>
                      </div>
                    </td>
                    <td className="py-8">
                      {t.resume_url ? <div className="p-2 bg-cyan-500/10 rounded-lg inline-block text-cyan-500"><FileText size={16}/></div> : <span className="text-slate-800">-</span>}
                    </td>
                    <td className="py-8 text-right">
                      <button onClick={() => setEditingId(t.id)} className="px-6 py-3 bg-white text-slate-950 rounded-2xl text-[10px] font-black uppercase hover:bg-cyan-500 transition-all shadow-xl shadow-white/5">Atuar ERP</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="flex justify-between items-center bg-slate-950 p-8 rounded-[40px] border border-white/5">
              <div>
                <h3 className="text-xl font-black italic uppercase text-white tracking-widest italic">Hub de Oportunidades</h3>
                <p className="text-[10px] text-slate-600 uppercase mt-1">Gerencie as vagas publicadas no Marketplace</p>
              </div>
              <button onClick={() => setShowJobForm(true)} className="flex items-center gap-3 bg-cyan-500 text-slate-950 px-10 py-4 rounded-[25px] text-[10px] font-black uppercase tracking-widest shadow-lg shadow-cyan-500/20 hover:bg-white transition-all"><Plus size={18}/> Nova Vaga</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vacancies.map(job => (
                <div key={job.id} className="p-10 bg-slate-950 border border-white/10 rounded-[40px] group hover:border-cyan-500 transition-all flex flex-col h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><Plus size={60} /></div>
                  <h4 className="text-xl font-black italic uppercase text-cyan-500 mb-3 italic">{job.title}</h4>
                  <p className="text-[10px] text-slate-500 mb-6 font-black uppercase tracking-widest">{job.area} • {job.seniority}</p>
                  <p className="text-xs text-slate-400 italic mb-8 line-clamp-3 leading-relaxed">{job.description}</p>
                  <div className="mt-auto pt-8 border-t border-white/5 flex justify-between items-center">
                    <span className="text-white font-black text-md uppercase italic tracking-tighter">{job.salary}</span>
                    <span className="text-[9px] font-black uppercase text-green-500 bg-green-500/10 px-3 py-1 rounded-lg border border-green-500/20">{job.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL ERP: GESTÃO DE CONTRATO E faturamento */}
      <AnimatePresence>
        {editingId && (
          <div className="fixed inset-0 z-[120] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-6 text-left">
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="bg-slate-900 border border-cyan-500/30 p-12 rounded-[60px] max-w-lg w-full shadow-[0_0_100px_rgba(6,182,212,0.1)] relative">
              <button onClick={() => setEditingId(null)} className="absolute top-10 right-10 text-slate-500 hover:text-white transition-colors"><X size={24}/></button>
              <h3 className="text-2xl font-black italic uppercase mb-10 text-cyan-500 italic flex items-center gap-4"><Wallet className="text-white" size={28}/> Governança ERP</h3>
              <form className="space-y-5" onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                onUpdateERP(editingId, {
                  status: 'Contratado',
                  project_name: fd.get('proj'),
                  monthly_value: Number(fd.get('val')),
                  contract_start: fd.get('start'),
                  contract_end: fd.get('end'),
                  payment_status: 'Auditado'
                });
                setEditingId(null);
              }}>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-600 ml-3">Nome do Projeto / Alocação</label>
                    <input name="proj" required placeholder="EX: BANCO DA AMAZÔNIA - BASA" className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl text-xs font-bold text-white uppercase outline-none focus:border-cyan-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-600 ml-3">Valor Mensal (R$)</label>
                    <input name="val" type="number" required placeholder="20000" className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl text-xs font-bold text-white uppercase outline-none focus:border-cyan-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-600 ml-3">Data Início</label>
                      <input name="start" type="date" className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl text-[10px] font-bold text-white outline-none focus:border-cyan-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-600 ml-3">Data Término</label>
                      <input name="end" type="date" className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl text-[10px] font-bold text-white outline-none focus:border-cyan-500" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 pt-10">
                  <button type="button" onClick={() => setEditingId(null)} className="w-1/3 text-[10px] font-black uppercase text-slate-600 tracking-widest hover:text-white transition-colors">Cancelar</button>
                  <button type="submit" className="w-2/3 bg-cyan-500 text-slate-950 py-6 rounded-[30px] font-black uppercase text-xs tracking-[0.4em] shadow-2xl shadow-cyan-500/20 hover:scale-[1.02] transition-all">Ativar Contrato</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: NOVA VAGA NO MARKETPLACE */}
      <AnimatePresence>
        {showJobForm && (
          <div className="fixed inset-0 z-[120] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-6 text-left">
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="bg-slate-900 border border-cyan-500/30 p-12 rounded-[60px] max-w-lg w-full shadow-[0_0_100px_rgba(6,182,212,0.1)] relative">
              <button onClick={() => setShowJobForm(false)} className="absolute top-10 right-10 text-slate-500 hover:text-white transition-colors"><X size={24}/></button>
              <h3 className="text-2xl font-black italic uppercase mb-10 text-cyan-500 italic flex items-center gap-4"><Plus className="text-white" size={28}/> Publicar Oportunidade</h3>
              <form className="space-y-5" onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                onAddJob({
                  id: `JOB-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
                  title: fd.get('title') as string,
                  area: fd.get('area') as string,
                  seniority: fd.get('seniority') as string,
                  salary: fd.get('salary') as string,
                  description: fd.get('desc') as string,
                  status: 'Ativa'
                });
                setShowJobForm(false);
              }}>
                <div className="space-y-4">
                  <input name="title" required placeholder="TÍTULO DA VAGA (EX: FULLSTACK DEVELOPER)" className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl text-xs font-bold text-white uppercase outline-none focus:border-cyan-500" />
                  <div className="grid grid-cols-2 gap-4">
                    <input name="area" required placeholder="ÁREA (EX: DEV / QA)" className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl text-[10px] font-bold text-white uppercase outline-none focus:border-cyan-500" />
                    <input name="seniority" required placeholder="SENIORIDADE" className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl text-[10px] font-bold text-white uppercase outline-none focus:border-cyan-500" />
                  </div>
                  <input name="salary" required placeholder="VALOR OU FAIXA SALARIAL" className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl text-xs font-bold text-white uppercase outline-none focus:border-cyan-500" />
                  <textarea name="desc" required placeholder="REQUISITOS E DETALHES TÉCNICOS" rows={4} className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl text-xs font-bold text-white uppercase outline-none focus:border-cyan-500 italic" />
                </div>
                <div className="flex gap-4 pt-10">
                  <button type="button" onClick={() => setShowJobForm(false)} className="w-1/4 text-[10px] font-black uppercase text-slate-600 tracking-widest">Voltar</button>
                  <button type="submit" className="w-3/4 bg-cyan-500 text-slate-950 py-6 rounded-[30px] font-black uppercase text-xs tracking-[0.4em] shadow-xl shadow-cyan-500/20">Lançar no Marketplace</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}