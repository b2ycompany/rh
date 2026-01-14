"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, ShieldCheck, LogOut, Plus, Wallet, Calendar, 
  FileText, Building2, UserCheck, Eye, Search, 
  ArrowRight, X 
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

  // LOGIN CORRIGIDO: Aceita maiúsculo/minúsculo e limpa espaços
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const userTyped = creds.user.trim().toUpperCase();
    const passTyped = creds.pass.trim().toUpperCase();

    if (userTyped === "LIONRISING1" && passTyped === "LE010584") {
      setIsAuthorized(true);
    } else {
      alert("ACESSO NEGADO: Credenciais incorretas.");
    }
  };

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto py-20 bg-slate-900 p-10 rounded-[40px] border border-white/5 text-center shadow-2xl">
        <Lock size={40} className="text-cyan-500 mx-auto mb-6" />
        <h2 className="text-2xl font-black uppercase italic mb-8 italic">Lion <span className="text-cyan-500">Governance</span></h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            onChange={e => setCreds({...creds, user: e.target.value})} 
            placeholder="OPERADOR" 
            className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-[10px] font-bold text-white uppercase outline-none focus:border-cyan-500" 
          />
          <input 
            type="password" 
            onChange={e => setCreds({...creds, pass: e.target.value})} 
            placeholder="CHAVE" 
            className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-[10px] font-bold text-white outline-none focus:border-cyan-500 font-mono" 
          />
          <button className="w-full bg-cyan-500 text-slate-950 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white transition-all shadow-lg shadow-cyan-500/10">
            Autenticar Sistema
          </button>
        </form>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-6">
      <div className="bg-slate-900 p-10 rounded-[40px] border border-white/5 shadow-2xl">
        
        {/* HEADER ADMIN */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-white/5 pb-8 gap-6">
          <div className="flex gap-4">
            <button onClick={() => setActiveTab('tickets')} className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'tickets' ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' : 'bg-white/5 text-slate-500'}`}>Base de Leads</button>
            <button onClick={() => setActiveTab('jobs')} className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'jobs' ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' : 'bg-white/5 text-slate-500'}`}>Marketplace Vagas</button>
          </div>
          <button onClick={() => setIsAuthorized(false)} className="text-red-500 text-[10px] font-black uppercase flex items-center gap-2 hover:text-white transition-all italic">
            <LogOut size={16}/> Sair do Sistema
          </button>
        </div>

        {activeTab === 'tickets' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase font-black text-slate-500 border-b border-white/10 italic text-center">
                  <th className="pb-4 text-left">Protocolo</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4 text-left">Nome / Leads Info</th>
                  <th className="pb-4">CPF / CNPJ</th>
                  <th className="pb-4">CEP / Região</th>
                  <th className="pb-4 text-right">Ação ERP</th>
                </tr>
              </thead>
              <tbody className="text-[11px]">
                {tickets.map(t => (
                  <tr key={t.id} className="border-b border-white/5 hover:bg-white/5 transition-all group text-center">
                    <td className="py-6 font-mono text-cyan-500 font-bold text-left">{t.id}</td>
                    <td className="py-6 uppercase font-black italic">{t.status}</td>
                    <td className="py-6 text-left">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-200 flex items-center gap-2 uppercase italic">
                           {t.role === 'client' ? <Building2 size={12} className="text-blue-400" /> : <UserCheck size={12} className="text-purple-400" />}
                           {t.name}
                        </span>
                        <span className="text-slate-600 font-mono">{t.whatsapp} | {t.email}</span>
                        {t.resume_url && <span className="text-cyan-500 flex items-center gap-1 mt-1 font-black uppercase text-[8px]"><FileText size={10}/> {t.resume_url}</span>}
                      </div>
                    </td>
                    <td className="py-6 text-slate-400 font-mono">{t.cpf_cnpj || "N/A"}</td>
                    <td className="py-6 text-slate-400">
                      <div className="flex flex-col">
                        <span className="font-bold">{t.cep || "00000-000"}</span>
                        <span className="text-[9px] uppercase italic text-slate-600">{t.region || "Remoto"}</span>
                      </div>
                    </td>
                    <td className="py-6 text-right">
                      <button onClick={() => setEditingId(t.id)} className="px-4 py-2 bg-white text-slate-950 rounded-xl text-[9px] font-black uppercase hover:bg-cyan-500 transition-all">Atuar ERP</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black italic uppercase text-white tracking-widest">Jobs Management</h3>
              <button onClick={() => setShowJobForm(true)} className="flex items-center gap-2 bg-cyan-500 text-slate-950 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest"><Plus size={16}/> Publicar Nova Vaga</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vacancies.map(job => (
                <div key={job.id} className="p-8 bg-slate-950 border border-white/10 rounded-3xl group hover:border-cyan-500/50 transition-all flex flex-col h-full">
                  <h4 className="text-lg font-black italic uppercase text-cyan-500 mb-2">{job.title}</h4>
                  <p className="text-[10px] text-slate-500 mb-4 font-black uppercase tracking-widest">{job.area} • {job.seniority}</p>
                  <p className="text-xs text-slate-400 italic mb-6 line-clamp-3">{job.description}</p>
                  <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center">
                    <span className="text-white font-black text-sm uppercase italic">{job.salary}</span>
                    <span className="text-[8px] font-black uppercase text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">{job.status}</span>
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
          <div className="fixed inset-0 z-[120] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 text-left">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-cyan-500/30 p-10 rounded-[40px] max-w-lg w-full shadow-2xl relative">
              <button onClick={() => setEditingId(null)} className="absolute top-8 right-8 text-slate-500 hover:text-white"><X size={20}/></button>
              <h3 className="text-xl font-black italic uppercase mb-8 text-cyan-500 italic flex items-center gap-3"><Wallet className="text-white"/> Módulo ERP Lion</h3>
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                onUpdateERP(editingId, {
                  status: 'Contratado',
                  project_name: fd.get('proj'),
                  monthly_value: Number(fd.get('val')),
                  contract_start: fd.get('start'),
                  contract_end: fd.get('end'),
                  payment_status: 'Pendente'
                });
                setEditingId(null);
              }}>
                <div className="space-y-4">
                  <input name="proj" required placeholder="NOME DO PROJETO / ALOCAÇÃO" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-[10px] font-bold text-white uppercase outline-none focus:border-cyan-500" />
                  <input name="val" type="number" required placeholder="VALOR MENSAL (R$)" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-[10px] font-bold text-white uppercase outline-none focus:border-cyan-500" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase font-black text-slate-600 ml-2">Início</label>
                      <input name="start" type="date" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-[10px] font-bold text-white outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase font-black text-slate-600 ml-2">Término</label>
                      <input name="end" type="date" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-[10px] font-bold text-white outline-none" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 pt-8">
                  <button type="button" onClick={() => setEditingId(null)} className="w-1/3 text-[10px] font-black uppercase text-slate-600">Cancelar</button>
                  <button type="submit" className="w-2/3 bg-cyan-500 text-slate-950 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-cyan-500/20">Gravar no Contrato</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: NOVA VAGA */}
      <AnimatePresence>
        {showJobForm && (
          <div className="fixed inset-0 z-[120] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 text-left">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-cyan-500/30 p-10 rounded-[40px] max-w-lg w-full">
              <h3 className="text-xl font-black italic uppercase mb-6 text-cyan-500">Publicar Vaga de Elite</h3>
              <form className="space-y-4" onSubmit={(e) => {
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
                <input name="title" required placeholder="TÍTULO DA VAGA" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-[10px] font-bold text-white uppercase outline-none focus:border-cyan-500" />
                <div className="grid grid-cols-2 gap-4">
                  <input name="area" required placeholder="ÁREA (EX: DEV)" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-[10px] font-bold text-white uppercase outline-none focus:border-cyan-500" />
                  <input name="seniority" required placeholder="SENIORIDADE" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-[10px] font-bold text-white uppercase outline-none focus:border-cyan-500" />
                </div>
                <input name="salary" required placeholder="VALOR OU FAIXA" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-[10px] font-bold text-white uppercase outline-none focus:border-cyan-500" />
                <textarea name="desc" required placeholder="REQUISITOS E DETALHES" rows={3} className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-[10px] font-bold text-white uppercase outline-none focus:border-cyan-500" />
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowJobForm(false)} className="w-1/3 text-[10px] font-black uppercase text-slate-600">Cancelar</button>
                  <button type="submit" className="w-2/3 bg-cyan-500 text-slate-950 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest">Lançar Marketplace</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}