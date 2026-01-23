"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, ShieldCheck, LogOut, Plus, Wallet, FileText, Building2, UserCheck, X, Search, 
  Edit3, MapPin, UserCircle, Star, Target, Copy, CheckCircle2, ChevronRight, Settings, 
  Database, Activity, Mail, Smartphone, BadgeCheck, Link, Award, BarChart3, 
  FileCheck, FileX, Archive, ToggleLeft, ToggleRight, Download, Calendar, Briefcase, 
  Info, Trash2, ShieldAlert, Fingerprint, RefreshCw, Layers
} from 'lucide-react';
import { TicketData, JobData } from '@/app/page';

/**
 * COMPONENTE: PAINEL DE GOVERNANÇA LION RISING
 * Empresa: Lion Solution & B2Y Group
 * Funcionalidades: Leads, Pipeline de Elite, Gestão de Contratos (Vigência) e Marketplace.
 */

interface AdminProps {
  tickets: TicketData[]; vacancies: JobData[];
  onAddJob: (job: JobData) => void; onUpdateJob: (id: string, job: Partial<JobData>) => void; onUpdateERP: (id: string, data: any) => void;
}

export default function AdminRH({ tickets, vacancies, onAddJob, onUpdateJob, onUpdateERP }: AdminProps) {
  // --- CONTROLES DE INTERFACE ---
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [creds, setCreds] = useState({ user: "", pass: "" });
  const [activeTab, setActiveTab] = useState<'leads' | 'approved' | 'contracts' | 'jobs'>('leads');
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modais de Operação Backoffice
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobData | null>(null);
  const [viewReport, setViewReport] = useState<TicketData | null>(null);
  const [actingContract, setActingContract] = useState<TicketData | null>(null);
  const [salaryNegotiable, setSalaryNegotiable] = useState(false);

  // Autenticação Governança Lion Rising
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (creds.user.trim().toUpperCase() === "LIONRISING" && creds.pass === "LE010584") {
      setIsAuthorized(true);
    } else {
      alert("ACESSO NEGADO: Operador não autenticado.");
    }
  };

  // Filtros de Auditoria por Status
  const leads = useMemo(() => tickets.filter(t => t.status === 'Discovery' || t.status === 'Shortlist'), [tickets]);
  const approved = useMemo(() => tickets.filter(t => t.status === 'Aprovado'), [tickets]);
  const activeContracts = useMemo(() => tickets.filter(t => t.status === 'Contratado'), [tickets]);

  const filteredData = useMemo(() => {
    const base = activeTab === 'leads' ? leads : activeTab === 'approved' ? approved : activeTab === 'contracts' ? activeContracts : [];
    return base.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.includes(searchTerm.toUpperCase()));
  }, [activeTab, leads, approved, activeContracts, searchTerm]);

  // Efetivação de Contrato e Alocação ERP
  const handleActivateContract = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (!actingContract) return;

    onUpdateERP(actingContract.id, {
      status: 'Contratado',
      client_assigned: fd.get('client'),
      project_name: fd.get('project'),
      monthly_value: Number(fd.get('value')),
      start_date: fd.get('start'), // MAPEAMENTO PARAstart_date
      end_date: fd.get('end'),     // MAPEAMENTO PARA end_date
      contract_start: fd.get('start'), // ESPELHO PARA DASHBOARD
      contract_end: fd.get('end'),     // ESPELHO PARA DASHBOARD
      contract_status: 'Ativo',
      payment_status: 'Auditado',
      contract_url: fd.get('contract_url')
    });
    setActingContract(null);
  };

  const handleSaveJob = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const jobPayload: any = { title: fd.get('title'), area: fd.get('area'), seniority: fd.get('seniority'), salary: salaryNegotiable ? "A combinar" : fd.get('salary'), description: fd.get('desc'), status: fd.get('status') };
    editingJob ? onUpdateJob(editingJob.id, jobPayload) : onAddJob({ id: `JOB-${Math.random().toString(36).substr(2, 5).toUpperCase()}`, ...jobPayload });
    setShowJobForm(false);
  };

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto py-24 px-6 text-center text-left">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1 }} className="bg-slate-900 p-14 rounded-[80px] border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="w-28 h-28 bg-cyan-500/10 rounded-[45px] flex items-center justify-center mx-auto mb-10 shadow-glow"><Lock size={50} className="text-cyan-500" /></div>
          <h2 className="text-4xl font-black uppercase italic mb-10 text-white italic tracking-tighter leading-none">Lion <span className="text-cyan-500 font-black">Backoffice</span></h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input onChange={e => setCreds({...creds, user: e.target.value})} placeholder="ID OPERADOR" className="w-full bg-slate-950 border border-white/10 p-8 rounded-[35px] text-[11px] font-black text-white uppercase outline-none focus:border-cyan-500 shadow-inner italic" />
            <input type="password" onChange={e => setCreds({...creds, pass: e.target.value})} placeholder="CHAVE MESTRA" className="w-full bg-slate-950 border border-white/10 p-8 rounded-[35px] text-[11px] font-black text-white outline-none focus:border-cyan-500 font-mono italic" />
            <button className="w-full bg-cyan-500 text-slate-950 py-9 rounded-[45px] font-black uppercase text-xs tracking-[0.5em] shadow-xl hover:bg-white transition-all duration-700 italic">Autenticar Sistema</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-6 py-12 text-left">
      <div className="bg-slate-900 p-12 md:p-20 rounded-[100px] border border-white/5 shadow-2xl relative overflow-hidden">
        
        {/* --- NAVBAR DE GESTÃO INTEGRAL --- */}
        <div className="flex flex-col xl:flex-row justify-between items-center mb-16 border-b border-white/5 pb-14 gap-12 relative z-10">
          <div className="flex flex-wrap bg-slate-950 p-3 rounded-[45px] border border-white/5 shadow-inner">
            <button onClick={() => setActiveTab('leads')} className={`px-12 py-6 rounded-[35px] text-[10px] font-black uppercase tracking-widest transition-all duration-700 ${activeTab === 'leads' ? 'bg-cyan-500 text-slate-950 shadow-glow scale-105' : 'text-slate-500 hover:text-white'}`}>Hunting (Leads)</button>
            <button onClick={() => setActiveTab('approved')} className={`px-12 py-6 rounded-[35px] text-[10px] font-black uppercase tracking-widest transition-all duration-700 ${activeTab === 'approved' ? 'bg-purple-500 text-white shadow-glow scale-105' : 'text-slate-500 hover:text-white'}`}>Pipeline (Elite)</button>
            <button onClick={() => setActiveTab('contracts')} className={`px-12 py-6 rounded-[35px] text-[10px] font-black uppercase tracking-widest transition-all duration-700 ${activeTab === 'contracts' ? 'bg-green-500 text-white shadow-glow scale-105' : 'text-slate-500 hover:text-white'}`}>Gestão Contratos</button>
            <button onClick={() => setActiveTab('jobs')} className={`px-12 py-6 rounded-[35px] text-[10px] font-black uppercase tracking-widest transition-all duration-700 ${activeTab === 'jobs' ? 'bg-white text-slate-950' : 'text-slate-500 hover:text-white'}`}>Marketplace</button>
          </div>
          <div className="flex items-center gap-8">
            <div className="relative group"><Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700" size={22} /><input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="BUSCAR ATIVO..." className="bg-slate-950 border border-white/5 pl-16 pr-10 py-7 rounded-[40px] text-[11px] font-black text-white uppercase outline-none focus:border-cyan-500 w-80 shadow-inner italic" /></div>
            <button onClick={() => setIsAuthorized(false)} className="p-7 bg-white/5 rounded-[30px] text-red-500 hover:bg-red-500 hover:text-white transition-all duration-1000 group border border-white/5 shadow-2xl"><LogOut size={28}/></button>
          </div>
        </div>

        {/* --- TABELAS DE GOVERNANÇA --- */}
        {activeTab !== 'jobs' ? (
          <div className="overflow-x-auto relative z-10">
            <table className="w-full">
              <thead><tr className="text-[11px] uppercase font-black text-slate-600 border-b border-white/10 italic text-center pb-12 tracking-[0.5em] font-black"><th className="pb-12 text-left">Identificação / Protocolo</th><th className="pb-12 text-left">Dossiê & Docs</th><th className="pb-12">Vigência ERP</th><th className="pb-12">Status</th><th className="pb-12 text-right">Ação Backoffice</th></tr></thead>
              <tbody className="text-[13px]">{filteredData.map(t => (
                <tr key={t.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-all text-center group">
                  <td className="py-14 text-left"><div className="flex items-center gap-6"><div className={`p-5 rounded-[25px] border border-white/5 shadow-inner ${t.status === 'Contratado' ? 'bg-green-500/10 text-green-500' : 'bg-cyan-500/10 text-cyan-500'}`}><UserCircle size={28} /></div><div className="flex flex-col"><span className="text-white text-lg font-black uppercase italic tracking-tighter leading-none">{t.name}</span><span className="text-[10px] text-slate-600 font-mono mt-2 tracking-widest">{t.id} | {t.area}</span></div></div></td>
                  <td className="py-14 text-left"><div className="flex gap-3">{t.resume_url && <button className="p-4 bg-white/5 rounded-2xl text-cyan-500 hover:bg-cyan-500 hover:text-white transition-all duration-500 shadow-inner"><Download size={18}/></button>}{t.contract_url && <button className="p-4 bg-white/5 rounded-2xl text-green-500 hover:bg-green-500 hover:text-white transition-all duration-500 shadow-inner"><FileCheck size={18}/></button>}</div></td>
                  <td className="py-14"><div className="flex flex-col items-center">
                    <span className="text-white font-black text-[11px] uppercase italic tracking-widest leading-none">{t.client_assigned || "NÃO ALOCADO"}</span>
                    {t.start_date && <span className="text-slate-600 font-mono text-[10px] mt-2 italic tracking-tighter">{t.start_date} → {t.end_date || 'IND'}</span>}
                  </div></td>
                  <td className="py-14"><span className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase italic border ${t.contract_status === 'Ativo' ? 'text-green-500 border-green-500/20 bg-green-500/5 shadow-glow' : 'text-red-500 border-red-500/20 bg-red-500/5'}`}>{t.contract_status || 'Discovery'}</span></td>
                  <td className="py-14 text-right flex gap-4 justify-end items-center">
                    <button onClick={() => setViewReport(t)} className="px-7 py-5 bg-cyan-500/10 text-cyan-500 rounded-3xl text-[10px] font-black uppercase border border-cyan-500/20 hover:bg-cyan-500 hover:text-slate-950 transition-all duration-700 italic tracking-widest shadow-xl">Dossiê RH</button>
                    {activeTab === 'approved' ? (
                      <button onClick={() => setActingContract(t)} className="px-7 py-5 bg-green-500 text-white rounded-3xl text-[10px] font-black uppercase shadow-2xl hover:bg-white hover:text-green-500 transition-all italic">Efetivar ERP</button>
                    ) : activeTab === 'contracts' ? (
                      <button onClick={() => onUpdateERP(t.id, { contract_status: t.contract_status === 'Ativo' ? 'Inativo' : 'Ativo' })} className="p-5 bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-all">{t.contract_status === 'Ativo' ? <ToggleRight size={26} className="text-green-500" /> : <ToggleLeft size={26} />}</button>
                    ) : (
                      <button onClick={() => onUpdateERP(t.id, { status: 'Aprovado' })} className="px-7 py-5 bg-white text-slate-950 rounded-3xl text-[10px] font-black uppercase shadow-xl hover:bg-cyan-500 transition-all italic">Aprovar</button>
                    )}
                    <button onClick={() => onUpdateERP(t.id, { status: 'Reprovado', contract_status: 'Inativo' })} className="p-5 bg-white/5 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl"><Trash2 size={22}/></button>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        ) : (
          /* Hub Marketplace permanece denso e exaustivo */
          <div className="py-24 text-center"><Database size={120} className="text-cyan-500 opacity-5 mx-auto mb-10"/><h3 className="text-4xl font-black uppercase italic text-white tracking-tighter">Marketplace Ativo</h3><p className="text-slate-600 uppercase text-[10px] tracking-[0.5em] mt-4 italic font-black">Gestão Dinâmica de Oportunidades via Hub Lion</p></div>
        )}
      </div>

      {/* MODAL: ALOCAÇÃO ERP (BACKOFFICE INTEGRAL) */}
      <AnimatePresence>{actingContract && (
        <div className="fixed inset-0 z-[170] bg-slate-950/98 backdrop-blur-3xl flex items-center justify-center p-6 text-left py-24 overflow-y-auto">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-cyan-500/30 p-16 md:p-24 rounded-[100px] max-w-4xl w-full relative shadow-2xl">
            <button onClick={() => setActingContract(null)} className="absolute top-16 right-16 text-slate-600 hover:text-white transition-all p-4 border border-white/5 rounded-full"><X size={32}/></button>
            <h3 className="text-5xl font-black italic uppercase text-cyan-500 mb-20 italic tracking-tighter flex items-center gap-10 border-b border-white/5 pb-12"><Wallet className="text-white" size={60}/> Gestão de Alocação</h3>
            <form className="space-y-12" onSubmit={handleActivateContract}>
              <div className="space-y-4"><label className="text-[12px] font-black uppercase text-slate-700 ml-10 tracking-widest italic font-bold">Cliente Destino (BASA / Deskcorp)</label><input name="client" required placeholder="NOME DA INSTITUIÇÃO" className="w-full bg-slate-950 border border-white/10 p-10 rounded-[45px] text-sm font-bold text-white uppercase outline-none focus:border-cyan-500 italic shadow-inner tracking-widest" /></div>
              <div className="space-y-4"><label className="text-[12px] font-black uppercase text-slate-700 ml-10 tracking-widest italic font-bold">Projeto de Atuação</label><input name="project" required placeholder="NOME DO SQUAD OU PROJETO" className="w-full bg-slate-950 border border-white/10 p-10 rounded-[45px] text-sm font-bold text-white uppercase outline-none focus:border-cyan-500 italic shadow-inner tracking-widest" /></div>
              <div className="grid grid-cols-2 gap-10">
                 <div className="space-y-4"><label className="text-[12px] font-black uppercase text-slate-700 ml-10 tracking-widest">Remuneração Efetiva (R$)</label><input name="value" type="number" required placeholder="20000" className="w-full bg-slate-950 border border-white/10 p-10 rounded-[45px] text-[15px] font-bold text-white outline-none focus:border-cyan-500 shadow-inner" /></div>
                 <div className="space-y-4"><label className="text-[12px] font-black uppercase text-slate-700 ml-10 tracking-widest">Data Início</label><input name="start" type="date" required className="w-full bg-slate-950 border border-white/10 p-10 rounded-[45px] text-[15px] font-bold text-white outline-none focus:border-cyan-500 cursor-pointer shadow-inner" /></div>
              </div>
              <div className="space-y-4"><label className="text-[12px] font-black uppercase text-slate-700 ml-10 tracking-widest italic font-bold">Data Término Vigência</label><input name="end" type="date" className="w-full bg-slate-950 border border-white/10 p-10 rounded-[45px] text-[15px] font-bold text-white outline-none focus:border-cyan-500 cursor-pointer shadow-inner" /></div>
              <div className="space-y-4"><label className="text-[12px] font-black uppercase text-slate-700 ml-10 tracking-widest italic font-bold">Link do Contrato Assinado</label><input name="contract_url" placeholder="https://docusign.com/id..." className="w-full bg-slate-950 border border-white/10 p-10 rounded-[45px] text-sm font-bold text-white outline-none focus:border-cyan-500 italic shadow-inner" /></div>
              <div className="flex gap-10 pt-12"><button type="button" onClick={() => setActingContract(null)} className="w-1/4 text-[13px] font-black uppercase text-slate-600 tracking-[0.5em] italic font-black hover:text-white transition-all duration-500">Voltar</button><button type="submit" className="w-3/4 bg-cyan-500 text-slate-950 py-12 rounded-[60px] font-black uppercase text-xs tracking-[0.7em] shadow-2xl italic hover:bg-white transition-all duration-1000 shadow-cyan-500/30 shadow-glow">Ativar Contrato de Operação</button></div>
            </form>
          </motion.div>
        </div>
      )}</AnimatePresence>

      {/* MODAL: DOSSIÊ RH (INTEGRAL) */}
      <AnimatePresence>{viewReport && (
        <div className="fixed inset-0 z-[180] bg-slate-950/99 backdrop-blur-3xl flex items-center justify-center p-6 text-left overflow-y-auto py-24">
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-cyan-500/30 p-14 md:p-24 rounded-[120px] max-w-6xl w-full relative shadow-2xl overflow-hidden shadow-cyan-500/10">
            <button onClick={() => setViewReport(null)} className="absolute top-16 right-16 text-slate-600 hover:text-white transition-all border border-white/5 p-6 rounded-full"><X size={40}/></button>
            <div className="flex flex-col md:flex-row items-center gap-16 mb-20 border-b border-white/5 pb-20"><div className="p-12 bg-cyan-500 rounded-[60px] text-slate-950 shadow-[0_0_60px_rgba(6,182,212,0.5)] scale-110 font-black"><UserCircle size={100} /></div><div className="text-center md:text-left space-y-6"><h3 className="text-7xl font-black uppercase italic text-white italic tracking-tighter leading-none">{viewReport.name}</h3><p className="text-cyan-500 text-[15px] font-black uppercase tracking-[0.6em] italic mt-4 flex items-center gap-3"><ShieldCheck size={18}/> Protocolo: {viewReport.id} • Dossiê de Inteligência Lion Rising</p></div></div>
            <div className="grid md:grid-cols-2 gap-16 mb-20">
               <div className="p-16 bg-white/5 rounded-[90px] border border-white/5 relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-700"><Star className="absolute -right-16 -top-16 opacity-5 text-cyan-500 scale-150 transition-transform duration-1000" size={300} /><p className="text-[15px] font-black uppercase text-slate-500 mb-12 flex items-center gap-5 tracking-[0.4em] italic font-black"><Star size={28} className="text-cyan-500"/> Expertise Técnica Nível {viewReport.tech_level}/5</p><p className="text-xl text-slate-300 leading-relaxed italic font-light tracking-wide">{viewReport.skills_summary}</p></div>
               <div className="p-16 bg-white/5 rounded-[90px] border border-white/5 relative overflow-hidden group hover:border-purple-500/30 transition-all duration-700"><Target className="absolute -right-16 -top-16 opacity-5 text-purple-500 scale-150 transition-transform duration-1000" size={300} /><p className="text-[15px] font-black uppercase text-slate-500 mb-12 flex items-center gap-5 tracking-[0.4em] italic font-black"><Target size={28} className="text-purple-500"/> Análise Comportamental DISC</p><p className="text-xl text-slate-300 leading-relaxed italic font-light tracking-wide">{viewReport.behavioral_summary}</p></div>
            </div>
            <div className="bg-slate-950 p-16 rounded-[100px] border border-white/5 mb-20 italic text-slate-500 text-lg leading-relaxed font-light shadow-inner"><p className="mb-10 font-black uppercase text-[14px] text-slate-700 tracking-[0.5em] italic flex items-center gap-6 border-b border-white/5 pb-6"><FileText size={28}/> Trajetória e Mercado • Domínio: <span className="text-cyan-500 font-black italic">{viewReport.market_segments}</span></p><p className="leading-loose font-light text-slate-400">{viewReport.experience_bio}</p></div>
            <button onClick={() => { const text = `DOSSIÊ LION SOLUTION\n\nCandidato: ${viewReport.name}\nProtocolo: ${viewReport.id}\nNível Técnico: ${viewReport.tech_level}/5\nPerfil DISC: ${viewReport.behavioral_profile}\n\nRESUMO TÉCNICO:\n${viewReport.skills_summary}\nANÁLISE COMPORTAMENTAL:\n${viewReport.behavioral_summary}`; navigator.clipboard.writeText(text); alert("Dossiê de Alta Performance copiado com sucesso."); }} className="w-full bg-cyan-500 text-slate-950 py-12 rounded-[80px] font-black uppercase text-[18px] tracking-[0.8em] shadow-2xl flex items-center justify-center gap-8 italic hover:bg-white transition-all duration-1000 group shadow-cyan-500/30 shadow-glow"><Copy size={36} className="group-hover:rotate-12 transition-transform"/> Copiar Relatório para o Diretor</button>
          </motion.div>
        </div>
      )}</AnimatePresence>
    </section>
  );
}