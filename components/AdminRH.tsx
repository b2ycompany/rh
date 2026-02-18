"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, ShieldCheck, LogOut, Plus, Wallet, FileText, Building2, UserCheck, X, Search, Edit3, MapPin, 
  UserCircle, Star, Target, Copy, CheckCircle2, ChevronRight, Settings, Database, Activity, Mail, Smartphone, BadgeCheck, Link, Award, BarChart3, Download, FileCheck, Archive, ToggleLeft, ToggleRight,
  Briefcase, Calendar, Info, Trash2, ShieldAlert, Fingerprint, RefreshCw, Layers, TrendingUp, Heart, Glasses
} from 'lucide-react';
import { TicketData, JobData } from '@/app/page';

interface AdminProps {
  tickets: TicketData[]; vacancies: JobData[];
  onAddJob: (job: JobData) => void; onUpdateJob: (id: string, job: Partial<JobData>) => void; onUpdateERP: (id: string, data: any) => void;
}

export default function AdminRH({ tickets, vacancies, onAddJob, onUpdateJob, onUpdateERP }: AdminProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [creds, setCreds] = useState({ user: "", pass: "" });
  const [activeTab, setActiveTab] = useState<'leads' | 'management' | 'jobs'>('leads');
  const [searchTerm, setSearchTerm] = useState("");
  const [actingContract, setActingContract] = useState<TicketData | null>(null);
  const [viewReport, setViewReport] = useState<TicketData | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (creds.user.trim().toUpperCase() === "LIONRISING" && creds.pass === "LE010584") setIsAuthorized(true);
    else alert("ACESSO NEGADO.");
  };

  const calculateHiringFee = (salary: number, seniority: string) => {
    const s = seniority?.toLowerCase() || "";
    if (s.includes('junior')) return salary * 0.50;
    if (s.includes('pleno')) return salary * 0.65;
    if (s.includes('senior')) return salary * 0.75;
    return salary * 0.50; 
  };

  const handleFinalizeHire = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const salary = Number(fd.get('salary'));
    if (!actingContract) return;

    const commission = calculateHiringFee(salary, actingContract.seniority || 'Junior');

    onUpdateERP(actingContract.id, {
      status: 'Contratado',
      client_assigned: fd.get('client'),
      project_name: fd.get('project'),
      first_salary: salary,
      hiring_fee: commission,
      contract_start: fd.get('start'),
      contract_status: 'Ativo',
      employment_status: 'Empregado'
    });
    setActingContract(null);
  };

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto py-24 px-6 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1 }} className="bg-slate-900 p-14 rounded-[80px] border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="w-28 h-28 bg-cyan-500/10 rounded-[45px] flex items-center justify-center mx-auto mb-10 shadow-glow"><Lock size={50} className="text-cyan-500" /></div>
          <h2 className="text-4xl font-black uppercase italic mb-10 text-white italic tracking-tighter leading-none">Lion <span className="text-cyan-500 font-black">Backoffice</span></h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input onChange={e => setCreds({...creds, user: e.target.value})} placeholder="ID OPERADOR" className="w-full bg-slate-950 border border-white/10 p-8 rounded-[35px] text-[11px] font-black text-white uppercase outline-none focus:border-cyan-500 italic shadow-inner" />
            <input type="password" onChange={e => setCreds({...creds, pass: e.target.value})} placeholder="CHAVE MESTRA" className="w-full bg-slate-950 border border-white/10 p-8 rounded-[35px] text-[11px] font-black text-white outline-none focus:border-cyan-500 font-mono italic shadow-inner" />
            <button className="w-full bg-cyan-500 text-slate-950 py-9 rounded-[45px] font-black uppercase text-xs tracking-[0.5em] shadow-xl hover:bg-white transition-all duration-700 italic">Autenticar Sistema</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-6 py-12 text-left">
      <div className="bg-slate-900 p-12 md:p-20 rounded-[100px] border border-white/5 shadow-2xl relative overflow-hidden">
        
        <div className="flex flex-col xl:flex-row justify-between items-center mb-16 border-b border-white/5 pb-14 gap-12 relative z-10">
          <div className="flex flex-wrap bg-slate-950 p-3 rounded-[45px] border border-white/5 shadow-inner">
            <button onClick={() => setActiveTab('leads')} className={`px-12 py-6 rounded-[35px] text-[10px] font-black uppercase tracking-widest transition-all duration-700 ${activeTab === 'leads' ? 'bg-cyan-500 text-slate-950 shadow-glow scale-105' : 'text-slate-500 hover:text-white'}`}>Hunting (Triagem)</button>
            <button onClick={() => setActiveTab('management')} className={`px-12 py-6 rounded-[35px] text-[10px] font-black uppercase tracking-widest transition-all duration-700 ${activeTab === 'management' ? 'bg-green-500 text-white shadow-glow scale-105' : 'text-slate-500 hover:text-white'}`}>Contratos ERP</button>
          </div>
          <div className="relative group"><Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700" size={22} /><input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="BUSCAR ATIVO..." className="bg-slate-950 border border-white/5 pl-16 pr-10 py-7 rounded-[40px] text-[11px] font-black text-white uppercase outline-none focus:border-cyan-500 w-80 shadow-inner italic" /></div>
        </div>

        {activeTab === 'management' ? (
          <div className="overflow-x-auto relative z-10 text-left">
            <table className="w-full">
              <thead><tr className="text-[11px] uppercase font-black text-slate-600 border-b border-white/10 italic text-center pb-12 tracking-[0.5em] font-black"><th className="pb-12 text-left">Talento Alocado</th><th className="pb-12 text-left">Dossiê & Docs</th><th className="pb-12">Remuneração Fee</th><th className="pb-12">Status Emprego</th><th className="pb-12 text-right">Ação</th></tr></thead>
              <tbody className="text-[13px]">{tickets.filter(t => t.status === 'Contratado').map(t => (
                <tr key={t.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-all text-center group">
                  <td className="py-14 text-left flex items-center gap-6"><div className="p-5 rounded-[25px] border border-white/5 bg-green-500/10 text-green-500 shadow-inner"><UserCircle size={28} /></div><div className="flex flex-col"><span className="text-white text-lg font-black uppercase italic tracking-tighter leading-none">{t.name}</span><span className="text-[10px] text-slate-600 font-mono mt-2 tracking-widest">{t.client_assigned} | {t.project_name}</span></div></td>
                  <td className="py-14 text-left"><button onClick={() => setViewReport(t)} className="p-5 bg-white/5 rounded-3xl text-cyan-500 shadow-glow"><FileText size={22}/></button></td>
                  <td className="py-14"><p className="text-cyan-500 font-black text-xl italic tracking-tighter">R$ {t.hiring_fee?.toLocaleString('pt-BR')}</p><p className="text-[8px] text-slate-700 font-black uppercase mt-1">Fee: {t.seniority}</p></td>
                  <td className="py-14">
                    <button onClick={() => onUpdateERP(t.id, { employment_status: t.employment_status === 'Empregado' ? 'Desligado' : 'Empregado' })} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase italic border ${t.employment_status === 'Empregado' ? 'text-green-500 border-green-500/20 bg-green-500/5 shadow-glow' : 'text-red-500 border-red-500/20 bg-red-500/5'}`}>{t.employment_status || 'Empregado'}</button>
                  </td>
                  <td className="py-14 text-right flex gap-4 justify-end items-center"><button onClick={() => onUpdateERP(t.id, { contract_status: t.contract_status === 'Ativo' ? 'Inativo' : 'Ativo' })} className="p-5 bg-white/5 rounded-2xl text-slate-500">{t.contract_status === 'Ativo' ? <ToggleRight size={26} className="text-green-500" /> : <ToggleLeft size={26} />}</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-left">
              <thead><tr className="text-[11px] uppercase font-black text-slate-600 border-b border-white/10 italic pb-12 tracking-[0.4em]"><th className="pb-12">Ativo / Protocolo</th><th className="pb-12 text-center">Senioridade / DISC</th><th className="pb-12 text-right">Ação Consultiva</th></tr></thead>
              <tbody className="text-[13px]">{tickets.filter(t => t.status !== 'Contratado').map(t => (
                <tr key={t.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-all group">
                  <td className="py-14"><div className="flex items-center gap-6"><div className="p-5 rounded-[25px] border border-white/5 bg-cyan-500/10 text-cyan-500 shadow-inner"><UserCheck size={28} /></div><div className="flex flex-col"><span className="text-white text-lg font-black uppercase italic tracking-tighter leading-none">{t.name}</span><span className="text-[10px] text-slate-600 font-mono mt-2 tracking-widest">{t.whatsapp} | {t.region}</span></div></div></td>
                  <td className="py-14 text-center"><span className="text-[10px] font-black uppercase text-purple-500 tracking-widest">{t.behavioral_profile || 'TRIAGEM'}</span><div className="w-32 bg-white/5 h-1 rounded-full mt-3 mx-auto shadow-inner"><div className="bg-cyan-500 h-full rounded-full shadow-glow" style={{ width: `${(Number(t.tech_level) || 1) * 20}%` }} /></div></td>
                  <td className="py-14 text-right flex gap-4 justify-end items-center"><button onClick={() => setViewReport(t)} className="px-8 py-5 bg-cyan-500/10 text-cyan-500 rounded-3xl text-[10px] font-black uppercase border border-cyan-500/20 hover:bg-cyan-500 transition-all italic shadow-xl">Dossiê RH</button><button onClick={() => setActingContract(t)} className="px-8 py-5 bg-green-500 text-white rounded-3xl text-[10px] font-black uppercase shadow-2xl hover:bg-white transition-all italic shadow-glow">Efetivar ERP</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>{actingContract && (
        <div className="fixed inset-0 z-[170] bg-slate-950/99 backdrop-blur-3xl flex items-start justify-center p-6 text-left py-24 overflow-y-auto">
          <motion.div initial={{ scale: 0.95, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="bg-slate-900 border border-cyan-500/30 p-16 md:p-24 rounded-[100px] max-w-4xl w-full relative shadow-[0_0_150px_rgba(6,182,212,0.1)] mb-20">
            <button onClick={() => setActingContract(null)} className="absolute top-16 right-16 text-slate-600 hover:text-white border border-white/5 p-4 rounded-full z-50 bg-slate-950/50 shadow-2xl"><X size={32}/></button>
            <h3 className="text-5xl font-black italic uppercase text-cyan-500 mb-20 italic tracking-tighter flex items-center gap-10 border-b border-white/5 pb-12"><Wallet className="text-white" size={60}/> Efetivar Alocação</h3>
            <form className="space-y-12" onSubmit={handleFinalizeHire}>
              <div className="space-y-4"><label className="text-[12px] font-black uppercase text-slate-700 ml-10 tracking-widest italic font-bold">Cliente Destino (BASA/Deskcorp)</label><input name="client" required placeholder="NOME DO CLIENTE" className="w-full bg-slate-950 border border-white/10 p-10 rounded-[45px] text-sm font-bold text-white uppercase outline-none focus:border-cyan-500 italic shadow-inner" /></div>
              <div className="space-y-4"><label className="text-[12px] font-black uppercase text-slate-700 ml-10 tracking-widest italic font-bold">Projeto Vinculado</label><input name="project" required placeholder="EX: CORE BANCÁRIO" className="w-full bg-slate-950 border border-white/10 p-10 rounded-[45px] text-sm font-bold text-white uppercase outline-none focus:border-cyan-500 italic shadow-inner" /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-4"><label className="text-[12px] font-black uppercase text-slate-700 ml-10 tracking-widest font-bold">Salário Base (R$)</label><input name="salary" type="number" required placeholder="EX: 10000" className="w-full bg-slate-950 border border-white/10 p-10 rounded-[45px] text-[15px] font-bold text-white outline-none focus:border-cyan-500 shadow-inner" /></div>
                 <div className="space-y-4"><label className="text-[12px] font-black uppercase text-slate-700 ml-10 tracking-widest font-bold">Data de Início</label><input name="start" type="date" required className="w-full bg-slate-950 border border-white/10 p-10 rounded-[45px] text-[15px] font-bold text-white outline-none focus:border-cyan-500 cursor-pointer shadow-inner" /></div>
              </div>
              <div className="p-12 bg-cyan-500/5 rounded-[60px] border border-cyan-500/20 flex gap-10 items-center"><TrendingUp className="text-cyan-500 shrink-0 shadow-glow" size={40} /><p className="text-sm text-slate-500 italic leading-relaxed">Regra Lion Solution: Nível **{actingContract.seniority}** = Hiring Fee de **{actingContract.seniority === 'Junior' ? '50%' : actingContract.seniority === 'Pleno' ? '65%' : '75%'}**.</p></div>
              <button type="submit" className="w-3/4 bg-cyan-500 text-slate-950 py-12 rounded-[60px] font-black uppercase text-[12px] tracking-[0.7em] shadow-2xl italic hover:bg-white transition-all duration-1000 shadow-cyan-500/30 shadow-glow">Confirmar Alocação ERP</button>
            </form>
          </motion.div>
        </div>
      )}</AnimatePresence>

      <AnimatePresence>{viewReport && (
        <div className="fixed inset-0 z-[180] bg-slate-950/99 backdrop-blur-3xl flex items-center justify-center p-6 text-left overflow-y-auto py-24 text-left">
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-cyan-500/30 p-14 md:p-24 rounded-[120px] max-w-6xl w-full relative shadow-2xl overflow-hidden">
            <button onClick={() => setViewReport(null)} className="absolute top-16 right-16 text-slate-600 hover:text-white border border-white/5 p-6 rounded-full"><X size={40}/></button>
            <div className="flex flex-col md:flex-row items-center gap-16 mb-20 border-b border-white/5 pb-20 text-center md:text-left"><div className="p-12 bg-cyan-500 rounded-[60px] text-slate-950 shadow-[0_0_60px_rgba(6,182,212,0.5)] scale-110 font-black"><UserCircle size={100} /></div><div className="space-y-6"><h3 className="text-7xl font-black uppercase italic text-white italic tracking-tighter leading-none">{viewReport.name}</h3><p className="text-cyan-500 text-[15px] font-black uppercase tracking-[0.6em] italic mt-4 flex items-center gap-3 justify-center md:justify-start"><ShieldCheck size={18}/> Dossiê Deep Analysis • Protocolo: {viewReport.id}</p></div></div>
            <div className="grid md:grid-cols-2 gap-16 mb-20 text-left">
               <div className="p-16 bg-white/5 rounded-[90px] border border-white/5 relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-700">
                  <Star className="absolute -right-16 -top-16 opacity-5 text-cyan-500 scale-150 transition-transform duration-1000" size={300} /><p className="text-[15px] font-black uppercase text-slate-500 mb-12 flex items-center gap-5 tracking-[0.4em] italic font-black"><Star size={28} className="text-cyan-500"/> Expertise Técnica Nível {viewReport.tech_level}/5</p><p className="text-xl text-slate-300 leading-relaxed italic font-light tracking-wide">{viewReport.skills_summary}</p>
               </div>
               <div className="p-16 bg-white/5 rounded-[90px] border border-white/5 relative overflow-hidden group hover:border-purple-500/30 transition-all duration-700">
                  <Target className="absolute -right-16 -top-16 opacity-5 text-purple-500 scale-150 transition-transform duration-1000" size={300} /><p className="text-[15px] font-black uppercase text-slate-500 mb-12 flex items-center gap-5 tracking-[0.4em] italic font-black"><Target size={28} className="text-purple-500"/> Análise comportamental DISC & RH</p><p className="text-lg text-slate-500 font-black uppercase tracking-widest mb-6">Status Civil: {viewReport.marital_status} • Hobby: {viewReport.hobbies}</p><p className="text-xl text-slate-300 leading-relaxed italic font-light tracking-wide">{viewReport.behavioral_summary}</p>
               </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-20 text-center">
               {[{k: 'ocean_openness', l: 'Abertura'}, {k: 'ocean_conscientiousness', l: 'Consciência'}, {k: 'ocean_extraversion', l: 'Extroversão'}, {k: 'ocean_agreeableness', l: 'Amabilidade'}, {k: 'ocean_neuroticism', l: 'Estabilidade'}].map(o => (
                 <div key={o.k} className="bg-slate-950 p-8 rounded-[40px] border border-white/5 shadow-inner">
                    <p className="text-[10px] font-black uppercase text-slate-700 mb-4 italic">{o.l}</p>
                    <p className="text-3xl font-black text-cyan-500 italic">{(viewReport as any)[o.k] || 5}/10</p>
                 </div>
               ))}
            </div>
            <button onClick={() => { navigator.clipboard.writeText(`DOSSIÊ LION\nCandidato: ${viewReport.name}\nNível: ${viewReport.tech_level}/5\nDISC: ${viewReport.behavioral_profile}\nHobby: ${viewReport.hobbies}`); alert("Copiado."); }} className="w-full bg-cyan-500 text-slate-950 py-12 rounded-[80px] font-black uppercase text-[18px] tracking-[0.8em] shadow-2xl flex items-center justify-center gap-8 hover:bg-white transition-all duration-1000 group shadow-cyan-500/30 shadow-glow"><Copy size={36}/> Copiar Relatório para o Diretor</button>
          </motion.div>
        </div>
      )}</AnimatePresence>
    </section>
  );
}