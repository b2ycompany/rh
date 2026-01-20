"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, ShieldCheck, LogOut, Plus, Wallet, FileText, 
  Building2, UserCheck, X, Edit3, CheckCircle2 
} from 'lucide-react';
import { TicketData, JobData } from '@/app/page';

interface AdminProps {
  tickets: TicketData[];
  vacancies: JobData[];
  onAddJob: (job: JobData) => void;
  onUpdateJob: (id: string, job: Partial<JobData>) => void;
  onUpdateERP: (id: string, data: any) => void;
}

export default function AdminRH({ tickets, vacancies, onAddJob, onUpdateJob, onUpdateERP }: AdminProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [creds, setCreds] = useState({ user: "", pass: "" });
  const [activeTab, setActiveTab] = useState<'tickets' | 'jobs'>('tickets');
  
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobData | null>(null);
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);
  
  const [salaryNegotiable, setSalaryNegotiable] = useState(false);

  // Login Seguro
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const u = creds.user.trim().toUpperCase();
    const p = creds.pass.trim().toUpperCase();
    if (u === "LIONRISING" && p === "LE010584") setIsAuthorized(true);
    else alert("ACESSO NEGADO: Verifique suas credenciais de operador.");
  };

  // Salvar Criação ou Edição
  const handleSaveJob = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const salaryValue = salaryNegotiable ? "A combinar" : fd.get('salary') as string;

    const jobPayload: any = {
      title: fd.get('title') as string,
      area: fd.get('area') as string,
      seniority: fd.get('seniority') as string,
      salary: salaryValue,
      description: fd.get('desc') as string,
      status: fd.get('status') as any || 'Ativa'
    };

    if (editingJob) {
      onUpdateJob(editingJob.id, jobPayload);
    } else {
      onAddJob({
        id: `JOB-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        ...jobPayload
      });
    }
    
    setShowJobForm(false);
    setEditingJob(null);
  };

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto py-24 bg-slate-900 p-12 rounded-[60px] border border-white/5 text-center shadow-2xl">
        <Lock size={40} className="text-cyan-500 mx-auto mb-8" />
        <h2 className="text-2xl font-black uppercase italic mb-10 text-white italic">Lion <span className="text-cyan-500 font-black">Governance</span></h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input onChange={e => setCreds({...creds, user: e.target.value})} placeholder="OPERADOR" className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl text-[10px] font-bold text-white uppercase outline-none focus:border-cyan-500 transition-all" />
          <input type="password" onChange={e => setCreds({...creds, pass: e.target.value})} placeholder="CHAVE DE ACESSO" className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl text-[10px] font-bold text-white outline-none focus:border-cyan-500 font-mono" />
          <button className="w-full bg-cyan-500 text-slate-950 py-6 rounded-3xl font-black uppercase text-xs tracking-[0.4em] shadow-xl shadow-cyan-500/20">Autenticar Sistema</button>
        </form>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-6">
      <div className="bg-slate-900 p-12 rounded-[60px] border border-white/5 shadow-2xl">
        
        {/* CABEÇALHO DO PAINEL */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-12 border-b border-white/5 pb-10 gap-8">
          <div className="flex bg-slate-950 p-2 rounded-[30px] border border-white/5">
            <button onClick={() => setActiveTab('tickets')} className={`px-10 py-4 rounded-[25px] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${activeTab === 'tickets' ? 'bg-cyan-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}>Leads & Cotações</button>
            <button onClick={() => setActiveTab('jobs')} className={`px-10 py-4 rounded-[25px] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${activeTab === 'jobs' ? 'bg-cyan-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}>Gestão Marketplace</button>
          </div>
          <button onClick={() => setIsAuthorized(false)} className="text-red-500 text-[10px] font-black uppercase flex items-center gap-2 hover:text-white transition-all italic"><LogOut size={16}/> Sair do Sistema</button>
        </div>

        {activeTab === 'tickets' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase font-black text-slate-500 border-b border-white/10 italic text-center">
                  <th className="pb-6 text-left">Protocolo</th>
                  <th className="pb-6 text-left">Entidade</th>
                  <th className="pb-6">Região</th>
                  <th className="pb-6 text-right">Atuação ERP</th>
                </tr>
              </thead>
              <tbody className="text-[11px]">
                {tickets.map(t => (
                  <tr key={t.id} className="border-b border-white/5 hover:bg-white/5 transition-all text-center">
                    <td className="py-8 font-mono text-cyan-500 font-bold text-left">{t.id}</td>
                    <td className="py-8 text-left">
                      <div className="flex flex-col uppercase font-black italic">
                        <span className="flex items-center gap-2 italic">
                           {t.role === 'client' ? <Building2 size={12} className="text-blue-400" /> : <UserCheck size={12} className="text-purple-400" />}
                           {t.name}
                        </span>
                        <span className="text-[9px] text-slate-600 font-mono not-italic mt-1">{t.whatsapp}</span>
                      </div>
                    </td>
                    <td className="py-8 text-slate-400 font-bold uppercase">{t.region || "Remoto"}</td>
                    <td className="py-8 text-right">
                      <button onClick={() => setEditingTicketId(t.id)} className="px-6 py-3 bg-white text-slate-950 rounded-2xl text-[10px] font-black uppercase shadow-xl hover:bg-cyan-500 transition-all">Abrir Contrato</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-10 text-left">
            <div className="flex justify-between items-center bg-slate-950 p-8 rounded-[40px] border border-white/5">
              <div>
                <h3 className="text-xl font-black italic uppercase text-white italic tracking-widest">Marketplace Dinâmico</h3>
                <p className="text-[10px] text-slate-600 uppercase mt-1 italic">Edite, pause ou publique novas vagas em tempo real</p>
              </div>
              <button onClick={() => { setEditingJob(null); setShowJobForm(true); setSalaryNegotiable(false); }} className="flex items-center gap-3 bg-cyan-500 text-slate-950 px-10 py-4 rounded-[25px] text-[10px] font-black uppercase shadow-lg hover:bg-white transition-all"><Plus size={18}/> Nova Oportunidade</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vacancies.map(job => (
                <div key={job.id} className="p-10 bg-slate-950 border border-white/10 rounded-[50px] group hover:border-cyan-500 transition-all flex flex-col relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-black italic uppercase text-cyan-500 italic leading-tight">{job.title}</h4>
                    <button onClick={() => { setEditingJob(job); setSalaryNegotiable(job.salary === "A combinar"); setShowJobForm(true); }} className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-white hover:bg-cyan-500 transition-all"><Edit3 size={18}/></button>
                  </div>
                  <p className="text-[10px] text-slate-500 mb-6 font-black uppercase tracking-widest italic">{job.area} • {job.seniority}</p>
                  <p className="text-xs text-slate-400 italic mb-8 line-clamp-3 leading-relaxed">{job.description}</p>
                  <div className="mt-auto pt-8 border-t border-white/5 flex justify-between items-center">
                    <span className="text-white font-black text-md uppercase italic tracking-tighter">{job.salary}</span>
                    <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-lg border ${job.status === 'Ativa' ? 'text-green-500 border-green-500/20 bg-green-500/5' : 'text-red-500 border-red-500/20 bg-red-500/5'}`}>{job.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: FORMULÁRIO DE VAGA (EDIÇÃO INTEGRADA) */}
      <AnimatePresence>
        {showJobForm && (
          <div className="fixed inset-0 z-[120] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-6 text-left overflow-y-auto py-20">
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="bg-slate-900 border border-cyan-500/30 p-12 rounded-[60px] max-w-2xl w-full shadow-2xl relative">
              <button onClick={() => {setShowJobForm(false); setEditingJob(null);}} className="absolute top-10 right-10 text-slate-500 hover:text-white transition-colors"><X size={24}/></button>
              <h3 className="text-2xl font-black italic uppercase mb-12 text-cyan-500 italic flex items-center gap-4">
                {editingJob ? <Edit3 size={28} className="text-white"/> : <Plus size={28} className="text-white"/>}
                {editingJob ? 'Editar Oportunidade' : 'Publicar Oportunidade'}
              </h3>
              
              <form className="space-y-6" onSubmit={handleSaveJob}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2 md:col-span-2">
                    <label className="text-[9px] font-black uppercase text-slate-600 ml-4 italic">Título Público da Vaga</label>
                    <input name="title" defaultValue={editingJob?.title} required placeholder="EX: FULLSTACK DEVELOPER SENIOR" className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl text-xs font-bold text-white uppercase outline-none focus:border-cyan-500" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-600 ml-4 italic">Área Técnica</label>
                    <input name="area" defaultValue={editingJob?.area} required placeholder="DEV / QA / PM / ARQ" className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl text-[10px] font-bold text-white uppercase outline-none focus:border-cyan-500" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-600 ml-4 italic">Senioridade</label>
                    <input name="seniority" defaultValue={editingJob?.seniority} required placeholder="PLENO / SENIOR / ESPECIALISTA" className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl text-[10px] font-bold text-white uppercase outline-none focus:border-cyan-500" />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[9px] font-black uppercase text-slate-600 ml-4 italic">Remuneração Ofertada</label>
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                      <input 
                        name="salary" 
                        defaultValue={editingJob?.salary !== "A combinar" ? editingJob?.salary : ""} 
                        disabled={salaryNegotiable}
                        placeholder="EX: R$ 18.000,00" 
                        className={`w-full md:w-2/3 bg-slate-950 border border-white/10 p-6 rounded-3xl text-xs font-bold text-white uppercase outline-none focus:border-cyan-500 ${salaryNegotiable ? 'opacity-20 grayscale' : ''}`} 
                      />
                      <button 
                        type="button" 
                        onClick={() => setSalaryNegotiable(!salaryNegotiable)}
                        className={`w-full md:w-1/3 flex items-center justify-center gap-3 p-6 rounded-3xl border text-[10px] font-black uppercase transition-all duration-500 ${salaryNegotiable ? 'bg-cyan-500 border-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'bg-slate-950 border-white/10 text-slate-500 hover:border-cyan-500/50'}`}
                      >
                        {salaryNegotiable ? <CheckCircle2 size={16}/> : <Wallet size={16}/>} A combinar
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[9px] font-black uppercase text-slate-600 ml-4 italic">Descrição Detalhada</label>
                    <textarea name="desc" defaultValue={editingJob?.description} required rows={5} className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl text-xs font-bold text-white uppercase outline-none focus:border-cyan-500 italic leading-relaxed" placeholder="DETALHE O ESCOPO TÉCNICO E REQUISITOS..." />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[9px] font-black uppercase text-slate-600 ml-4 italic">Governança (Status)</label>
                    <select name="status" defaultValue={editingJob?.status || 'Ativa'} className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl text-[10px] font-black text-white uppercase outline-none focus:border-cyan-500 appearance-none cursor-pointer">
                      <option value="Ativa">Publicada no Marketplace (Ativa)</option>
                      <option value="Pausada">Ocultar do Marketplace (Pausada)</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-6 pt-10">
                  <button type="button" onClick={() => {setShowJobForm(false); setEditingJob(null);}} className="w-1/4 text-[10px] font-black uppercase text-slate-600 tracking-[0.3em] hover:text-white transition-colors italic font-black">Cancelar</button>
                  <button type="submit" className="w-3/4 bg-cyan-500 text-slate-950 py-7 rounded-[35px] font-black uppercase text-xs tracking-[0.5em] shadow-2xl shadow-cyan-500/20 italic hover:bg-white transition-all duration-500">
                    {editingJob ? 'Salvar Modificações' : 'Lançar no Marketplace'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL ERP: GESTÃO DE CONTRATO */}
      <AnimatePresence>
        {editingTicketId && (
          <div className="fixed inset-0 z-[120] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-6 text-left">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-cyan-500/30 p-12 rounded-[60px] max-w-lg w-full relative">
              <button onClick={() => setEditingTicketId(null)} className="absolute top-10 right-10 text-slate-500 hover:text-white"><X size={24}/></button>
              <h3 className="text-2xl font-black italic uppercase mb-10 text-cyan-500 italic flex items-center gap-4"><Wallet className="text-white" size={28}/> Atuação ERP</h3>
              <form className="space-y-6" onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                onUpdateERP(editingTicketId, {
                  status: 'Contratado',
                  project_name: fd.get('p'),
                  monthly_value: Number(fd.get('v')),
                  contract_start: fd.get('s'),
                  contract_end: fd.get('e')
                });
                setEditingTicketId(null);
              }}>
                <div className="space-y-5">
                  <input name="p" required placeholder="NOME DO PROJETO / ALOCAÇÃO" className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl text-xs font-bold text-white uppercase outline-none focus:border-cyan-500" />
                  <input name="v" type="number" required placeholder="VALOR MENSAL (R$)" className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl text-xs font-bold text-white uppercase outline-none focus:border-cyan-500" />
                  <div className="grid grid-cols-2 gap-4">
                    <input name="s" type="date" className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl text-[10px] font-bold text-white outline-none" />
                    <input name="e" type="date" className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl text-[10px] font-bold text-white outline-none" />
                  </div>
                </div>
                <div className="flex gap-4 pt-10">
                   <button type="button" onClick={() => setEditingTicketId(null)} className="w-1/3 text-[10px] font-black uppercase text-slate-600 tracking-widest italic">Cancelar</button>
                   <button type="submit" className="w-2/3 bg-cyan-500 text-slate-950 py-7 rounded-[35px] font-black uppercase text-xs tracking-[0.4em] shadow-2xl italic">Efetivar Contrato</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}