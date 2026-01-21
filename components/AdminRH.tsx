"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, 
  ShieldCheck, 
  LogOut, 
  Plus, 
  Wallet, 
  FileText, 
  Building2, 
  UserCheck, 
  X, 
  Search, 
  Edit3, 
  MapPin, 
  UserCircle, 
  Star, 
  Target, 
  Copy, 
  CheckCircle2, 
  ChevronRight, 
  Settings,
  Database,
  Briefcase,
  Monitor,
  Activity,
  Filter,
  RefreshCw,
  Mail,
  Smartphone,
  BadgeCheck,
  Link
} from 'lucide-react';
import { TicketData, JobData } from '@/app/page';

/**
 * @component AdminRH
 * @description Painel de Governança e Auditoria Lion Rising.
 * @features Gestão de Leads, Hub Marketplace, Auditoria ERP e Dossiê Comportamental.
 */

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
  
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobData | null>(null);
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);
  const [viewReport, setViewReport] = useState<TicketData | null>(null);
  const [salaryNegotiable, setSalaryNegotiable] = useState(false);

  // --- LÓGICA DE AUTENTICAÇÃO ---
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
    const salaryValue = salaryNegotiable ? "A combinar" : fd.get('salary') as string;

    const jobPayload: any = {
      title: fd.get('title'),
      area: fd.get('area'),
      seniority: fd.get('seniority'),
      salary: salaryValue,
      description: fd.get('desc'),
      status: fd.get('status')
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
    setSalaryNegotiable(false);
  };

  // --- FILTRAGEM DINÂMICA ---
  const filteredTickets = useMemo(() => {
    return tickets.filter(t => 
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.id.includes(searchTerm.toUpperCase())
    );
  }, [tickets, searchTerm]);

  // --- VIEW: LOGIN DE AUDITORIA ---
  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto py-24 px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="bg-slate-900 p-14 rounded-[80px] border border-white/5 text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
          <div className="w-28 h-28 bg-cyan-500/10 rounded-[45px] flex items-center justify-center mx-auto mb-12 border border-cyan-500/20 shadow-glow">
            <Lock size={50} className="text-cyan-500" />
          </div>
          <h2 className="text-4xl font-black uppercase italic mb-12 text-white italic tracking-tighter">
            Lion <span className="text-cyan-500 font-black">Governance</span>
          </h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input onChange={e => setCreds({...creds, user: e.target.value})} placeholder="ID DE ACESSO" className="w-full bg-slate-950 border border-white/10 p-7 rounded-[30px] text-[11px] font-black text-white uppercase outline-none focus:border-cyan-500 transition-all italic tracking-widest shadow-inner" />
            <input type="password" onChange={e => setCreds({...creds, pass: e.target.value})} placeholder="CHAVE MESTRA" className="w-full bg-slate-950 border border-white/10 p-7 rounded-[30px] text-[11px] font-black text-white outline-none focus:border-cyan-500 font-mono tracking-widest italic shadow-inner" />
            <button className="w-full bg-cyan-500 text-slate-950 py-8 rounded-[45px] font-black uppercase text-xs tracking-[0.4em] shadow-xl shadow-cyan-500/30 hover:bg-white transition-all duration-700">Acessar Auditoria</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-6 py-12">
      <div className="bg-slate-900 p-12 md:p-20 rounded-[100px] border border-white/5 shadow-2xl relative overflow-hidden">
        
        {/* --- NAVBAR --- */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-16 border-b border-white/5 pb-14 gap-12 relative z-10">
          <div className="flex bg-slate-950 p-2.5 rounded-[45px] border border-white/5 shadow-inner">
            <button onClick={() => setActiveTab('tickets')} className={`px-14 py-6 rounded-[40px] text-[11px] font-black uppercase tracking-widest transition-all duration-700 ${activeTab === 'tickets' ? 'bg-cyan-500 text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.4)] scale-105' : 'text-slate-500 hover:text-white'}`}>Base de Leads & Auditoria</button>
            <button onClick={() => setActiveTab('jobs')} className={`px-14 py-6 rounded-[40px] text-[11px] font-black uppercase tracking-widest transition-all duration-700 ${activeTab === 'jobs' ? 'bg-cyan-500 text-slate-950 shadow-lg scale-105' : 'text-slate-500 hover:text-white'}`}>Gestão Marketplace</button>
          </div>

          <div className="flex items-center gap-8">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-hover:text-cyan-500 transition-colors" size={20} />
              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="FILTRAR NOME OU PROTOCOLO..." className="bg-slate-950 border border-white/5 pl-16 pr-10 py-6 rounded-[35px] text-[10px] font-black text-white uppercase outline-none focus:border-cyan-500 w-80 italic shadow-inner tracking-widest" />
            </div>
            <button onClick={() => setIsAuthorized(false)} className="p-6 bg-white/5 rounded-3xl text-red-500 hover:bg-red-500 hover:text-white transition-all duration-700 border border-white/5"><LogOut size={26} className="group-hover:-translate-x-2 transition-transform duration-500"/></button>
          </div>
        </div>

        {/* --- CONTEÚDO: LEADS --- */}
        {activeTab === 'tickets' ? (
          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] uppercase font-black text-slate-600 border-b border-white/10 italic text-center tracking-[0.4em] pb-10 font-black">
                  <th className="pb-10 text-left">Protocolo</th>
                  <th className="pb-10 text-left">Lead de Elite</th>
                  <th className="pb-10">CPF / CNPJ</th>
                  <th className="pb-10 text-left">Logradouro Auditado</th>
                  <th className="pb-10 text-right">Ação Consultiva</th>
                </tr>
              </thead>
              <tbody className="text-[13px]">
                {filteredTickets.map(t => (
                  <tr key={t.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-all text-center group">
                    <td className="py-12 font-mono text-cyan-500 font-black text-md tracking-tighter text-left italic">{t.id}</td>
                    <td className="py-12 text-left uppercase font-black italic">
                      <div className="flex items-center gap-5">
                        <div className={`p-4 rounded-[22px] border border-white/5 ${t.role === 'client' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                          {t.role === 'client' ? <Building2 size={22} /> : <UserCheck size={22} />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white text-lg tracking-tighter leading-none">{t.name}</span>
                          <span className="text-[10px] text-slate-600 font-mono not-italic mt-2 tracking-[0.2em] flex items-center gap-2">
                             <Mail size={12}/> {t.email} | <Smartphone size={12}/> {t.whatsapp}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-12 text-slate-500 font-mono tracking-tighter text-sm italic">{t.cpf_cnpj || "000.000.000-00"}</td>
                    <td className="py-12 text-left">
                      <div className="flex items-start gap-4">
                        <MapPin size={20} className="text-cyan-500 shrink-0 mt-1 opacity-40 group-hover:opacity-100 transition-opacity" />
                        <div className="flex flex-col text-[11px]">
                          <span className="text-slate-200 font-black uppercase italic tracking-wider">{t.logradouro || "BASE REMOTA"}, {t.numero}</span>
                          <span className="text-slate-600 italic uppercase font-bold text-[10px] mt-1">{t.bairro} — {t.cidade}/{t.uf}</span>
                          <span className="text-slate-800 font-mono text-[9px] mt-1 tracking-widest">{t.cep}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-12 text-right flex gap-4 justify-end items-center">
                      <button onClick={() => setViewReport(t)} className="px-7 py-4 bg-cyan-500/10 text-cyan-500 rounded-2xl text-[10px] font-black uppercase border border-cyan-500/20 hover:bg-cyan-500 hover:text-slate-950 transition-all duration-700 italic tracking-widest shadow-lg">Dossiê RH</button>
                      <button onClick={() => setEditingTicketId(t.id)} className="px-7 py-4 bg-white text-slate-950 rounded-2xl text-[10px] font-black uppercase shadow-2xl hover:bg-cyan-500 transition-all duration-700 italic tracking-widest">Atuar ERP</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* HUB MARKETPLACE */
          <div className="space-y-14 text-left relative z-10">
            <div className="flex justify-between items-center bg-slate-950 p-14 rounded-[70px] border border-white/5 relative overflow-hidden shadow-inner">
               <div className="absolute right-0 top-0 p-16 opacity-5 pointer-events-none"><Settings size={220} className="text-cyan-500 animate-spin-slow" /></div>
               <div className="relative z-10">
                  <h3 className="text-4xl font-black italic uppercase text-white italic tracking-tighter">Marketplace Hub</h3>
                  <p className="text-[13px] text-slate-600 uppercase mt-4 italic font-black tracking-[0.4em] flex items-center gap-3"><Activity size={16} className="text-cyan-500"/> Gestão de Vagas e Auditoria</p>
               </div>
               <button onClick={() => { setEditingJob(null); setShowJobForm(true); setSalaryNegotiable(false); }} className="relative z-10 flex items-center gap-5 bg-cyan-500 text-slate-950 px-16 py-7 rounded-[40px] text-[12px] font-black uppercase shadow-2xl shadow-cyan-500/40 hover:bg-white transition-all duration-1000 italic tracking-[0.3em]"><Plus size={28}/> Publicar Vaga</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {vacancies.map(job => (
                <div key={job.id} className="p-14 bg-slate-950 border border-white/10 rounded-[80px] group hover:border-cyan-500/50 transition-all flex flex-col relative overflow-hidden shadow-2xl">
                  <div className="flex justify-between items-start mb-10">
                    <h4 className="text-3xl font-black italic uppercase text-cyan-500 italic leading-tight max-w-[85%] tracking-tighter">{job.title}</h4>
                    <button onClick={() => { setEditingJob(job); setSalaryNegotiable(job.salary === "A combinar"); setShowJobForm(true); }} className="p-5 bg-white/5 rounded-3xl text-slate-600 hover:text-white hover:bg-cyan-500 transition-all duration-700 shadow-inner border border-white/5"><Edit3 size={24}/></button>
                  </div>
                  <p className="text-[12px] text-slate-600 mb-10 font-black uppercase tracking-[0.5em] italic font-bold border-l-2 border-cyan-500/30 pl-6">{job.area} • {job.seniority}</p>
                  <p className="text-[14px] text-slate-400 italic mb-14 line-clamp-6 leading-relaxed font-light">{job.description}</p>
                  <div className="mt-auto pt-12 border-t border-white/5 flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase text-slate-700 mb-3 tracking-[0.3em] italic">Salário</span>
                      <span className="text-white font-black text-2xl uppercase italic tracking-tighter leading-none">{job.salary}</span>
                    </div>
                    <span className={`text-[11px] font-black uppercase px-6 py-3 rounded-2xl border italic tracking-[0.2em] shadow-inner ${job.status === 'Ativa' ? 'text-green-500 border-green-500/20 bg-green-500/5' : 'text-red-500 border-red-500/20 bg-red-500/5'}`}>{job.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: DOSSIÊ RH PARA O CONTRATANTE */}
      <AnimatePresence>
        {viewReport && (
          <div className="fixed inset-0 z-[160] bg-slate-950/99 backdrop-blur-3xl flex items-center justify-center p-6 text-left overflow-y-auto py-24">
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-cyan-500/30 p-14 md:p-24 rounded-[100px] max-w-5xl w-full relative shadow-2xl overflow-hidden shadow-cyan-500/10">
              <button onClick={() => setViewReport(null)} className="absolute top-16 right-16 text-slate-600 hover:text-white transition-all border border-white/5 p-4 rounded-full"><X size={40}/></button>
              
              <div className="flex flex-col md:flex-row items-center gap-14 mb-20 border-b border-white/5 pb-16">
                 <div className="p-10 bg-cyan-500 rounded-[55px] text-slate-950 shadow-[0_0_60px_rgba(6,182,212,0.5)] scale-110"><UserCircle size={80} /></div>
                 <div className="text-center md:text-left space-y-4">
                    <h3 className="text-6xl font-black uppercase italic text-white italic tracking-tighter leading-none">{viewReport.name}</h3>
                    <p className="text-cyan-500 text-[13px] font-black uppercase tracking-[0.6em] italic mt-4 flex items-center gap-3">
                       <ShieldCheck size={18}/> Protocolo: {viewReport.id} • Dossiê de Inteligência Lion Rising
                    </p>
                 </div>
              </div>

              <div className="grid md:grid-cols-2 gap-12 mb-16">
                 <div className="p-14 bg-white/5 rounded-[70px] border border-white/5 relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-700">
                    <Star className="absolute -right-14 -top-14 opacity-5 text-cyan-500 scale-150 transition-transform duration-1000" size={250} />
                    <p className="text-[13px] font-black uppercase text-slate-500 mb-10 flex items-center gap-4 tracking-[0.3em] italic font-black"><Star size={24} className="text-cyan-500"/> Resumo de Expertise Técnica</p>
                    <p className="text-lg text-slate-300 leading-relaxed italic font-light tracking-wide">{viewReport.skills_summary}</p>
                 </div>
                 <div className="p-14 bg-white/5 rounded-[70px] border border-white/5 relative overflow-hidden group hover:border-purple-500/30 transition-all duration-700">
                    <Target className="absolute -right-14 -top-14 opacity-5 text-purple-500 scale-150 transition-transform duration-1000" size={250} />
                    <p className="text-[13px] font-black uppercase text-slate-500 mb-10 flex items-center gap-4 tracking-[0.3em] italic font-black"><Target size={24} className="text-purple-500"/> Análise Comportamental</p>
                    <p className="text-lg text-slate-300 leading-relaxed italic font-light tracking-wide">{viewReport.behavioral_summary}</p>
                 </div>
              </div>

              <div className="bg-slate-950 p-14 rounded-[70px] border border-white/5 mb-16 italic text-slate-500 text-md leading-relaxed font-light shadow-inner">
                 <p className="mb-8 font-black uppercase text-[12px] text-slate-700 tracking-[0.4em] italic flex items-center gap-4 border-b border-white/5 pb-4"><FileText size={20}/> Trajetória Profissional Expandida</p>
                 <p className="leading-loose">{viewReport.experience_bio || "Relatório técnico em fase de auditoria final pela governança RH Tammy."}</p>
              </div>

              <button onClick={() => {
                const text = `DOSSIÊ LION SOLUTION & B2Y GROUP\n\nCandidato: ${viewReport.name}\nProtocolo: ${viewReport.id}\nRegião: ${viewReport.region}\n\nRESUMO TÉCNICO:\n${viewReport.skills_summary}\n\nANÁLISE COMPORTAMENTAL:\n${viewReport.behavioral_summary}\n\nTRAJETÓRIA PROFISSIONAL:\n${viewReport.experience_bio}\n\nSite: rhtammy.vercel.app`;
                navigator.clipboard.writeText(text);
                alert("Dossiê de Alta Performance copiado com sucesso. Pronto para despacho ao Diretor.");
              }} className="w-full bg-cyan-500 text-slate-950 py-10 rounded-[60px] font-black uppercase text-[15px] tracking-[0.7em] shadow-2xl flex items-center justify-center gap-6 italic hover:bg-white transition-all duration-1000 group shadow-cyan-500/20">
                <Copy size={30} className="group-hover:rotate-12 transition-transform"/> Copiar Relatório para o Diretor de RH
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FORMULÁRIO DE VAGA */}
      <AnimatePresence>
        {showJobForm && (
          <div className="fixed inset-0 z-[160] bg-slate-950/98 backdrop-blur-3xl flex items-center justify-center p-6 text-left py-24 overflow-y-auto">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-cyan-500/30 p-16 md:p-24 rounded-[90px] max-w-3xl w-full shadow-2xl shadow-cyan-500/10">
              <button onClick={() => {setShowJobForm(false); setEditingJob(null);}} className="absolute top-16 right-16 text-slate-600 hover:text-white transition-all border border-white/5 p-4 rounded-full"><X size={32}/></button>
              <h3 className="text-4xl font-black italic uppercase text-cyan-500 mb-16 italic tracking-tighter flex items-center gap-8 border-b border-white/5 pb-10">
                {editingJob ? <Edit3 size={40} className="text-white"/> : <Plus size={40} className="text-white"/>}
                {editingJob ? 'Editar Oportunidade' : 'Lançar Oportunidade'}
              </h3>
              <form className="space-y-10" onSubmit={handleSaveJob}>
                <input name="title" defaultValue={editingJob?.title} required placeholder="TÍTULO PÚBLICO DA VAGA" className="w-full bg-slate-950 border border-white/10 p-8 rounded-[35px] text-xs font-bold text-white uppercase outline-none focus:border-cyan-500 italic shadow-inner" />
                <div className="grid grid-cols-2 gap-8">
                   <input name="area" defaultValue={editingJob?.area} required placeholder="ÁREA TÉCNICA" className="w-full bg-slate-950 border border-white/10 p-8 rounded-[35px] text-[12px] font-bold text-white uppercase outline-none focus:border-cyan-500 shadow-inner" />
                   <input name="seniority" defaultValue={editingJob?.seniority} required placeholder="SENIORIDADE EXIGIDA" className="w-full bg-slate-950 border border-white/10 p-8 rounded-[35px] text-[12px] font-bold text-white uppercase outline-none focus:border-cyan-500 shadow-inner" />
                </div>
                <div className="flex gap-6 items-center">
                  <input name="salary" defaultValue={editingJob?.salary !== "A combinar" ? editingJob?.salary : ""} disabled={salaryNegotiable} placeholder="REMUNERAÇÃO MENSAL" className={`w-2/3 bg-slate-950 border border-white/10 p-8 rounded-[35px] text-xs font-bold text-white outline-none focus:border-cyan-500 italic shadow-inner ${salaryNegotiable ? 'opacity-20 pointer-events-none' : ''}`} />
                  <button type="button" onClick={() => setSalaryNegotiable(!salaryNegotiable)} className={`w-1/3 p-7 rounded-[35px] border text-[12px] font-black uppercase transition-all duration-700 ${salaryNegotiable ? 'bg-cyan-500 border-cyan-500 text-slate-950 shadow-glow scale-105' : 'bg-slate-950 border-white/10 text-slate-500 hover:text-white shadow-inner'}`}>{salaryNegotiable ? <BadgeCheck size={20}/> : <Wallet size={20}/>} A combinar</button>
                </div>
                <textarea name="desc" defaultValue={editingJob?.description} required rows={6} className="w-full bg-slate-950 border border-white/10 p-10 rounded-[50px] text-xs font-bold text-white uppercase outline-none focus:border-cyan-500 italic shadow-inner leading-relaxed" placeholder="DETALHE O ESCOPO TÉCNICO, STACK E REQUISITOS..." />
                <div className="flex gap-8 pt-12">
                  <button type="button" onClick={() => {setShowJobForm(false); setEditingJob(null);}} className="w-1/4 text-[12px] font-black uppercase text-slate-600 tracking-[0.4em] italic font-black hover:text-white transition-all duration-500">Cancelar</button>
                  <button type="submit" className="w-3/4 bg-cyan-500 text-slate-950 py-9 rounded-[50px] font-black uppercase text-xs tracking-[0.6em] shadow-2xl italic hover:bg-white transition-all duration-1000 shadow-cyan-500/20">Efetivar Operação Marketplace</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingTicketId && (
          <div className="fixed inset-0 z-[160] bg-slate-950/98 backdrop-blur-2xl flex items-center justify-center p-6 text-left py-24 overflow-y-auto">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-cyan-500/30 p-16 md:p-24 rounded-[100px] max-w-2xl w-full relative shadow-2xl">
              <button onClick={() => setEditingTicketId(null)} className="absolute top-16 right-16 text-slate-600 hover:text-white transition-all border border-white/5 p-4 rounded-full"><X size={40}/></button>
              <h3 className="text-4xl font-black italic uppercase text-cyan-500 mb-16 italic flex items-center gap-8 border-b border-white/5 pb-10"><Wallet className="text-white" size={46}/> Módulo ERP Lion</h3>
              <form className="space-y-10" onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                onUpdateERP(editingTicketId, { status: 'Contratado', project_name: fd.get('p'), monthly_value: Number(fd.get('v')), contract_start: fd.get('s'), contract_end: fd.get('e'), payment_status: 'Auditado' });
                setEditingTicketId(null);
              }}>
                <input name="p" required placeholder="PROJETO DE ALOCAÇÃO / SQUAD" className="w-full bg-slate-950 border border-white/10 p-8 rounded-[35px] text-xs font-bold text-white uppercase outline-none focus:border-cyan-500 italic shadow-inner" />
                <input name="v" type="number" required placeholder="VALOR MENSAL (R$)" className="w-full bg-slate-950 border border-white/10 p-8 rounded-[35px] text-xs font-bold text-white outline-none focus:border-cyan-500 shadow-inner" />
                <div className="grid grid-cols-2 gap-8 pt-4">
                  <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-700 ml-8 tracking-widest italic font-bold">Início</label><input name="s" type="date" className="w-full bg-slate-950 border border-white/10 p-8 rounded-[35px] text-[12px] font-bold text-white outline-none focus:border-cyan-500 cursor-pointer shadow-inner" /></div>
                  <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-700 ml-8 tracking-widest italic font-bold">Término</label><input name="e" type="date" className="w-full bg-slate-950 border border-white/10 p-8 rounded-[35px] text-[12px] font-bold text-white outline-none focus:border-cyan-500 cursor-pointer shadow-inner" /></div>
                </div>
                <div className="flex gap-8 pt-12">
                  <button type="button" onClick={() => setEditingTicketId(null)} className="w-1/3 text-[12px] font-black uppercase text-slate-600 tracking-[0.4em] italic font-black hover:text-white transition-all duration-500">Voltar</button>
                  <button type="submit" className="w-2/3 bg-cyan-500 text-slate-950 py-10 rounded-[55px] font-black uppercase text-xs tracking-[0.5em] shadow-2xl italic hover:bg-white transition-all duration-1000 shadow-cyan-500/20">Ativar Contrato de Operação</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}