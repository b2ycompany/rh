"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, ShieldCheck, LogOut, Plus, Wallet, FileText, 
  Building2, UserCheck, X, Search, Edit3, MapPin, 
  UserCircle, Star, Target, Copy, CheckCircle2, ChevronRight, Settings
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
  // --- ESTADOS DE CONTROLE ---
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [creds, setCreds] = useState({ user: "", pass: "" });
  const [activeTab, setActiveTab] = useState<'tickets' | 'jobs'>('tickets');
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modais
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobData | null>(null);
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);
  const [viewReport, setViewReport] = useState<TicketData | null>(null);
  const [salaryNegotiable, setSalaryNegotiable] = useState(false);

  // --- LOGIN SEGURO (LION GOVERNANCE) ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const u = creds.user.trim().toUpperCase();
    const p = creds.pass.trim().toUpperCase();
    if (u === "LIONRISING" && p === "LE010584") {
      setIsAuthorized(true);
    } else {
      alert("ACESSO NEGADO: Autenticação de Operador Falhou.");
    }
  };

  // --- GESTÃO DE MARKETPLACE ---
  const handleSaveJob = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const jobPayload: any = {
      title: fd.get('title'), area: fd.get('area'), seniority: fd.get('seniority'),
      salary: salaryNegotiable ? "A combinar" : fd.get('salary'),
      description: fd.get('desc'), status: fd.get('status')
    };
    editingJob ? onUpdateJob(editingJob.id, jobPayload) : onAddJob({ id: `JOB-${Math.random().toString(36).substr(2, 5).toUpperCase()}`, ...jobPayload });
    setShowJobForm(false);
    setEditingJob(null);
  };

  // View: Login de Auditoria
  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto py-24 px-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 p-14 rounded-[70px] border border-white/5 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
          <div className="w-24 h-24 bg-cyan-500/10 rounded-[40px] flex items-center justify-center mx-auto mb-10 border border-cyan-500/20 shadow-glow">
            <Lock size={46} className="text-cyan-500" />
          </div>
          <h2 className="text-3xl font-black uppercase italic mb-12 text-white italic tracking-tighter">Lion <span className="text-cyan-500 font-black italic">Governance</span></h2>
          <form onSubmit={handleLogin} className="space-y-5">
            <input onChange={e => setCreds({...creds, user: e.target.value})} placeholder="OPERADOR" className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl text-[11px] font-black text-white uppercase outline-none focus:border-cyan-500 transition-all italic tracking-widest" />
            <input type="password" onChange={e => setCreds({...creds, pass: e.target.value})} placeholder="CHAVE DE ACESSO" className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl text-[11px] font-black text-white outline-none focus:border-cyan-500 font-mono italic tracking-widest" />
            <button className="w-full bg-cyan-500 text-slate-950 py-7 rounded-[40px] font-black uppercase text-xs tracking-[0.4em] shadow-xl shadow-cyan-500/20 hover:bg-white transition-all duration-500">Autenticar Auditoria</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-6">
      <div className="bg-slate-900 p-12 md:p-16 rounded-[80px] border border-white/5 shadow-2xl relative overflow-hidden">
        
        {/* HEADER ADMIN COM BUSCA E TABS */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-16 border-b border-white/5 pb-12 gap-10">
          <div className="flex bg-slate-950 p-2.5 rounded-[40px] border border-white/5 shadow-inner">
            <button onClick={() => setActiveTab('tickets')} className={`px-12 py-5 rounded-[35px] text-[10px] font-black uppercase tracking-widest transition-all duration-700 ${activeTab === 'tickets' ? 'bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-105' : 'text-slate-500 hover:text-white'}`}>Leads & Auditoria</button>
            <button onClick={() => setActiveTab('jobs')} className={`px-12 py-5 rounded-[35px] text-[10px] font-black uppercase tracking-widest transition-all duration-700 ${activeTab === 'jobs' ? 'bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-105' : 'text-slate-500 hover:text-white'}`}>Gestão Marketplace</button>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700" size={18} />
              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="FILTRAR NOME / PROTOCOLO..." className="bg-slate-950 border border-white/5 pl-16 pr-8 py-5 rounded-3xl text-[10px] font-black text-white uppercase outline-none focus:border-cyan-500 w-72 italic tracking-widest transition-all" />
            </div>
            <button onClick={() => setIsAuthorized(false)} className="p-5 bg-white/5 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all duration-500 group"><LogOut size={24} className="group-hover:-translate-x-1 transition-transform"/></button>
          </div>
        </div>

        {/* VIEW: TICKETS E LEADS DETALHADOS */}
        {activeTab === 'tickets' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] uppercase font-black text-slate-600 border-b border-white/10 italic text-center tracking-[0.3em] font-black">
                  <th className="pb-8 text-left">ID Protocolo</th>
                  <th className="pb-8 text-left">Entidade / Lead</th>
                  <th className="pb-8">CPF / CNPJ</th>
                  <th className="pb-8 text-left">Logradouro Auditado</th>
                  <th className="pb-8 text-right">Ação Consultiva</th>
                </tr>
              </thead>
              <tbody className="text-[12px]">
                {tickets.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.includes(searchTerm.toUpperCase())).map(t => (
                  <tr key={t.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-all text-center group">
                    <td className="py-10 font-mono text-cyan-500 font-black text-left text-sm tracking-tighter">{t.id}</td>
                    <td className="py-10 text-left uppercase font-black italic">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl shadow-inner ${t.role === 'client' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                          {t.role === 'client' ? <Building2 size={20} /> : <UserCheck size={20} />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white text-md tracking-tighter leading-none">{t.name}</span>
                          <span className="text-[9px] text-slate-600 font-mono not-italic mt-2 tracking-widest">{t.whatsapp} | {t.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-10 text-slate-500 font-mono tracking-tighter text-xs">{t.cpf_cnpj || "00.000.000-00"}</td>
                    <td className="py-10 text-left">
                      <div className="flex items-start gap-3">
                        <MapPin size={18} className="text-cyan-500 shrink-0 mt-1 opacity-50" />
                        <div className="flex flex-col text-[11px]">
                          <span className="text-slate-200 font-black uppercase italic">{t.logradouro || "BASE REMOTA"}, {t.numero}</span>
                          <span className="text-slate-600 italic uppercase font-bold text-[10px]">{t.bairro} — {t.cidade}/{t.uf}</span>
                          <span className="text-slate-700 font-mono text-[9px] mt-1">{t.cep}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-10 text-right flex gap-3 justify-end items-center">
                      <button onClick={() => setViewReport(t)} className="px-6 py-4 bg-cyan-500/10 text-cyan-500 rounded-2xl text-[10px] font-black uppercase border border-cyan-500/20 hover:bg-cyan-500 hover:text-slate-950 transition-all italic tracking-widest">Dossiê RH</button>
                      <button onClick={() => setEditingTicketId(t.id)} className="px-6 py-4 bg-white text-slate-950 rounded-2xl text-[10px] font-black uppercase shadow-xl hover:bg-cyan-500 transition-all italic tracking-widest">Atuar ERP</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* VIEW: HUB MARKETPLACE INTEGRAL */
          <div className="space-y-12 text-left">
            <div className="flex justify-between items-center bg-slate-950 p-12 rounded-[50px] border border-white/5 relative overflow-hidden">
               <div className="absolute right-0 top-0 p-12 opacity-5 pointer-events-none"><Settings size={180} className="text-cyan-500 animate-spin-slow" /></div>
               <div className="relative z-10">
                  <h3 className="text-3xl font-black italic uppercase text-white italic tracking-tighter">Marketplace de Elite</h3>
                  <p className="text-[12px] text-slate-600 uppercase mt-3 italic font-black tracking-[0.3em]">Gestão de Oportunidades e Publicação Dinâmica</p>
               </div>
               <button onClick={() => { setEditingJob(null); setShowJobForm(true); setSalaryNegotiable(false); }} className="relative z-10 flex items-center gap-4 bg-cyan-500 text-slate-950 px-14 py-6 rounded-[35px] text-[11px] font-black uppercase shadow-2xl shadow-cyan-500/30 hover:bg-white hover:scale-105 transition-all duration-700 italic tracking-[0.2em]"><Plus size={24}/> Publicar Vaga</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {vacancies.map(job => (
                <div key={job.id} className="p-12 bg-slate-950 border border-white/10 rounded-[65px] group hover:border-cyan-500/50 transition-all flex flex-col relative overflow-hidden shadow-2xl">
                  <div className="flex justify-between items-start mb-8">
                    <h4 className="text-2xl font-black italic uppercase text-cyan-500 italic leading-tight max-w-[80%]">{job.title}</h4>
                    <button onClick={() => { setEditingJob(job); setSalaryNegotiable(job.salary === "A combinar"); setShowJobForm(true); }} className="p-4 bg-white/5 rounded-2xl text-slate-600 hover:text-white hover:bg-cyan-500 transition-all duration-500 shadow-inner"><Edit3 size={20}/></button>
                  </div>
                  <p className="text-[11px] text-slate-600 mb-8 font-black uppercase tracking-[0.4em] italic font-bold">{job.area} • {job.seniority}</p>
                  <p className="text-[13px] text-slate-400 italic mb-12 line-clamp-5 leading-relaxed font-light">{job.description}</p>
                  <div className="mt-auto pt-10 border-t border-white/5 flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase text-slate-600 mb-2 tracking-widest italic">Remuneração Base</span>
                      <span className="text-white font-black text-xl uppercase italic tracking-tighter">{job.salary}</span>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-5 py-2.5 rounded-2xl border italic tracking-widest ${job.status === 'Ativa' ? 'text-green-500 border-green-500/20 bg-green-500/5 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'text-red-500 border-red-500/20 bg-red-500/5'}`}>{job.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: DOSSIÊ TÉCNICO E COMPORTAMENTAL (PARA O DIRETOR) */}
      <AnimatePresence>
        {viewReport && (
          <div className="fixed inset-0 z-[160] bg-slate-950/98 backdrop-blur-3xl flex items-center justify-center p-6 text-left overflow-y-auto py-24">
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="bg-slate-900 border border-cyan-500/30 p-12 md:p-20 rounded-[80px] max-w-4xl w-full relative shadow-[0_0_120px_rgba(6,182,212,0.15)] overflow-hidden">
              <button onClick={() => setViewReport(null)} className="absolute top-14 right-14 text-slate-600 hover:text-white transition-colors"><X size={36}/></button>
              
              <div className="flex flex-col md:flex-row items-center gap-10 mb-16 border-b border-white/5 pb-12">
                 <div className="p-8 bg-cyan-500 rounded-[45px] text-slate-950 shadow-[0_0_40px_rgba(6,182,212,0.4)]"><UserCircle size={64} /></div>
                 <div className="text-center md:text-left">
                    <h3 className="text-5xl font-black uppercase italic text-white italic tracking-tighter leading-none">{viewReport.name}</h3>
                    <p className="text-cyan-500 text-[12px] font-black uppercase tracking-[0.6em] italic mt-4">Talento Qualificado • Dossiê de Inteligência Lion Solution</p>
                 </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10 mb-14">
                 <div className="p-12 bg-white/5 rounded-[60px] border border-white/5 relative overflow-hidden group">
                    <Star className="absolute -right-10 -top-10 opacity-5 text-cyan-500 group-hover:opacity-15 transition-opacity duration-1000" size={200} />
                    <p className="text-[12px] font-black uppercase text-slate-500 mb-8 flex items-center gap-3 tracking-[0.2em] italic font-black"><Star size={20} className="text-cyan-500"/> Resumo de Expertise</p>
                    <p className="text-md text-slate-300 leading-relaxed italic font-light tracking-wide">{viewReport.skills_summary}</p>
                 </div>
                 <div className="p-12 bg-white/5 rounded-[60px] border border-white/5 relative overflow-hidden group">
                    <Target className="absolute -right-10 -top-10 opacity-5 text-purple-500 group-hover:opacity-15 transition-opacity duration-1000" size={200} />
                    <p className="text-[12px] font-black uppercase text-slate-500 mb-8 flex items-center gap-3 tracking-[0.2em] italic font-black"><Target size={20} className="text-purple-500"/> Análise Comportamental</p>
                    <p className="text-md text-slate-300 leading-relaxed italic font-light tracking-wide">{viewReport.behavioral_summary}</p>
                 </div>
              </div>

              <div className="bg-slate-950 p-12 rounded-[55px] border border-white/5 mb-14 italic text-slate-500 text-sm leading-relaxed font-light">
                 <p className="mb-6 font-black uppercase text-[10px] text-slate-700 tracking-[0.3em] italic flex items-center gap-3"><FileText size={16}/> Trajetória Profissional Detalhada:</p>
                 {viewReport.experience_bio || "Informação em análise pela governança."}
              </div>

              <button onClick={() => {
                const text = `DOSSIÊ LION SOLUTION & B2Y GROUP\n\nCandidato: ${viewReport.name}\nProtocolo: ${viewReport.id}\n\nRESUMO TÉCNICO:\n${viewReport.skills_summary}\n\nANÁLISE COMPORTAMENTAL:\n${viewReport.behavioral_summary}`;
                navigator.clipboard.writeText(text);
                alert("Dossiê de Elite copiado! Pronto para envio ao Diretor.");
              }} className="w-full bg-cyan-500 text-slate-950 py-9 rounded-[50px] font-black uppercase text-xs tracking-[0.6em] shadow-2xl flex items-center justify-center gap-5 italic hover:bg-white transition-all duration-700">
                <Copy size={24} /> Copiar Relatório para o Diretor de RH
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: FORMULÁRIO DE VAGA (GERENCIAMENTO INTEGRAL) */}
      <AnimatePresence>
        {showJobForm && (
          <div className="fixed inset-0 z-[160] bg-slate-950/98 backdrop-blur-2xl flex items-center justify-center p-6 text-left py-24 overflow-y-auto">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-cyan-500/30 p-12 md:p-16 rounded-[75px] max-w-2xl w-full shadow-2xl shadow-cyan-500/10">
              <button onClick={() => {setShowJobForm(false); setEditingJob(null);}} className="absolute top-12 right-12 text-slate-600 hover:text-white transition-colors"><X size={32}/></button>
              <h3 className="text-3xl font-black italic uppercase text-cyan-500 mb-12 italic tracking-tighter flex items-center gap-5">
                {editingJob ? <Edit3 size={32} className="text-white"/> : <Plus size={32} className="text-white"/>}
                {editingJob ? 'Editar Oportunidade' : 'Lançar Oportunidade'}
              </h3>
              <form className="space-y-6" onSubmit={handleSaveJob}>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-600 ml-6 italic tracking-widest">Título da Vaga / Squad</label>
                  <input name="title" defaultValue={editingJob?.title} required placeholder="EX: ARQUITETO DE SISTEMAS BANCÁRIOS" className="w-full bg-slate-950 border border-white/10 p-7 rounded-[30px] text-xs font-bold text-white uppercase outline-none focus:border-cyan-500 italic" />
                </div>
                <div className="grid grid-cols-2 gap-5">
                   <input name="area" defaultValue={editingJob?.area} required placeholder="ÁREA (DEV/QA)" className="w-full bg-slate-950 border border-white/10 p-7 rounded-[30px] text-[11px] font-bold text-white uppercase outline-none focus:border-cyan-500" />
                   <input name="seniority" defaultValue={editingJob?.seniority} required placeholder="SENIORIDADE" className="w-full bg-slate-950 border border-white/10 p-7 rounded-[30px] text-[11px] font-bold text-white uppercase outline-none focus:border-cyan-500" />
                </div>
                <div className="flex gap-5 items-center">
                  <input name="salary" defaultValue={editingJob?.salary !== "A combinar" ? editingJob?.salary : ""} disabled={salaryNegotiable} placeholder="REMUNERAÇÃO MENSAL" className={`w-2/3 bg-slate-950 border border-white/10 p-7 rounded-[30px] text-xs font-bold text-white outline-none focus:border-cyan-500 italic ${salaryNegotiable ? 'opacity-20 pointer-events-none' : ''}`} />
                  <button type="button" onClick={() => setSalaryNegotiable(!salaryNegotiable)} className={`w-1/3 p-6 rounded-[30px] border text-[11px] font-black uppercase transition-all duration-500 ${salaryNegotiable ? 'bg-cyan-500 border-cyan-500 text-slate-950 shadow-glow' : 'bg-slate-950 border-white/10 text-slate-500 hover:text-white'}`}>{salaryNegotiable ? <CheckCircle2 size={18}/> : <Wallet size={18}/>} A combinar</button>
                </div>
                <textarea name="desc" defaultValue={editingJob?.description} required rows={5} className="w-full bg-slate-950 border border-white/10 p-8 rounded-[40px] text-xs font-bold text-white uppercase outline-none focus:border-cyan-500 italic leading-relaxed" placeholder="DETALHE O ESCOPO TÉCNICO, STACK E REQUISITOS..." />
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-600 ml-6 italic tracking-widest">Visibilidade no Portal</label>
                  <select name="status" defaultValue={editingJob?.status || 'Ativa'} className="w-full bg-slate-950 border border-white/10 p-7 rounded-[30px] text-[11px] font-black text-white uppercase outline-none focus:border-cyan-500 appearance-none cursor-pointer">
                    <option value="Ativa">Publicada (Visível)</option>
                    <option value="Pausada">Oculta (Backup)</option>
                  </select>
                </div>
                <div className="flex gap-6 pt-10">
                  <button type="button" onClick={() => {setShowJobForm(false); setEditingJob(null);}} className="w-1/4 text-[11px] font-black uppercase text-slate-600 tracking-[0.3em] italic hover:text-white transition-colors">Cancelar</button>
                  <button type="submit" className="w-3/4 bg-cyan-500 text-slate-950 py-8 rounded-[45px] font-black uppercase text-xs tracking-[0.5em] shadow-2xl italic hover:bg-white transition-all duration-700">Efetivar Operação</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: ERP LION SOLUTION (CONTROLE FINANCEIRO) */}
      <AnimatePresence>
        {editingTicketId && (
          <div className="fixed inset-0 z-[160] bg-slate-950/98 backdrop-blur-2xl flex items-center justify-center p-6 text-left">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-cyan-500/30 p-14 md:p-16 rounded-[75px] max-w-lg w-full relative shadow-2xl">
              <button onClick={() => setEditingTicketId(null)} className="absolute top-12 right-12 text-slate-600 hover:text-white transition-colors"><X size={32}/></button>
              <h3 className="text-3xl font-black italic uppercase text-cyan-500 mb-12 italic flex items-center gap-5"><Wallet className="text-white" size={40}/> Módulo ERP Lion</h3>
              <form className="space-y-6" onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                onUpdateERP(editingTicketId, { 
                  status: 'Contratado', project_name: fd.get('p'), monthly_value: Number(fd.get('v')), 
                  contract_start: fd.get('s'), contract_end: fd.get('e'), payment_status: 'Auditado' 
                });
                setEditingTicketId(null);
              }}>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-600 ml-6 italic tracking-widest">Projeto de Alocação</label>
                  <input name="p" required placeholder="EX: BANCO DA AMAZÔNIA - BASA" className="w-full bg-slate-950 border border-white/10 p-7 rounded-[30px] text-xs font-bold text-white uppercase outline-none focus:border-cyan-500 italic" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-600 ml-6 italic tracking-widest">Remuneração Mensal (R$)</label>
                  <input name="v" type="number" required placeholder="EX: 20000" className="w-full bg-slate-950 border border-white/10 p-7 rounded-[30px] text-xs font-bold text-white outline-none focus:border-cyan-500" />
                </div>
                <div className="grid grid-cols-2 gap-5 pt-2">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-700 ml-6 tracking-widest">Início do Contrato</label>
                    <input name="s" type="date" className="w-full bg-slate-950 border border-white/10 p-6 rounded-[30px] text-[11px] font-bold text-white outline-none focus:border-cyan-500 cursor-pointer" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-700 ml-6 tracking-widest">Término Previsto</label>
                    <input name="e" type="date" className="w-full bg-slate-950 border border-white/10 p-6 rounded-[30px] text-[11px] font-bold text-white outline-none focus:border-cyan-500 cursor-pointer" />
                  </div>
                </div>
                <div className="flex gap-6 pt-10">
                  <button type="button" onClick={() => setEditingTicketId(null)} className="w-1/3 text-[11px] font-black uppercase text-slate-600 tracking-widest italic font-black">Voltar</button>
                  <button type="submit" className="w-2/3 bg-cyan-500 text-slate-950 py-8 rounded-[45px] font-black uppercase text-xs tracking-[0.4em] shadow-2xl italic hover:bg-white transition-all duration-700">Ativar Contrato</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}