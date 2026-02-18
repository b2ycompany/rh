"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, ShieldCheck, LogOut, Plus, Wallet, FileText, Building2, UserCheck, X, Search, Edit3, MapPin, UserCircle, Star, Target, Copy, CheckCircle2, ChevronRight, Settings, Database, Activity, Mail, Smartphone, BadgeCheck, Link, Award, BarChart3, Download, FileCheck, Archive, ToggleLeft, ToggleRight, Briefcase, Calendar, Info, Trash2, ShieldAlert, Fingerprint, RefreshCw, Layers, TrendingUp, Heart, Glasses, BarChart
} from 'lucide-react';
import { TicketData, JobData } from '@/app/page';

interface AdminProps {
  tickets: TicketData[]; vacancies: JobData[];
  onAddJob: (job: JobData) => void; onUpdateJob: (id: string, job: Partial<JobData>) => void; onUpdateERP: (id: string, data: any) => void;
}

export default function AdminRH({ tickets, vacancies, onAddJob, onUpdateJob, onUpdateERP }: AdminProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [creds, setCreds] = useState({ user: "", pass: "" });
  const [activeTab, setActiveTab] = useState<'leads' | 'management' | 'balance'>('leads');
  const [searchTerm, setSearchTerm] = useState("");
  
  const [viewReport, setViewReport] = useState<TicketData | null>(null);
  const [actingContract, setActingContract] = useState<TicketData | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (creds.user.trim().toUpperCase() === "LIONRISING" && creds.pass === "LE010584") setIsAuthorized(true);
    else alert("ACESSO NEGADO.");
  };

  const calculateCommission = (salary: number, seniority: string) => {
    const s = seniority?.toLowerCase() || "";
    if (s.includes('senior')) return salary * 0.75;
    if (s.includes('pleno')) return salary * 0.65;
    return salary * 0.50; 
  };

  const totalBalance = useMemo(() => tickets.reduce((acc, t) => acc + (t.hiring_fee || 0), 0), [tickets]);

  const handleFinalizeHire = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const salary = Number(fd.get('salary'));
    if (!actingContract) return;

    const fee = calculateCommission(salary, actingContract.seniority || 'Junior');

    onUpdateERP(actingContract.id, {
      status: 'Contratado',
      client_assigned: fd.get('client'),
      project_name: fd.get('project'),
      first_salary: salary,
      hiring_fee: fee,
      hiring_notes: fd.get('notes'),
      contract_start: fd.get('start'),
      contract_status: 'Ativo',
      employment_status: 'Empregado'
    });
    setActingContract(null);
  };

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto py-24 px-6 text-center text-left">
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
        
        {/* NAVBAR */}
        <div className="flex flex-col xl:flex-row justify-between items-center mb-16 border-b border-white/5 pb-14 gap-12 relative z-10">
          <div className="flex flex-wrap bg-slate-950 p-3 rounded-[45px] border border-white/5 shadow-inner">
            <button onClick={() => setActiveTab('leads')} className={`px-12 py-6 rounded-[35px] text-[10px] font-black uppercase tracking-widest transition-all duration-700 ${activeTab === 'leads' ? 'bg-cyan-500 text-slate-950 shadow-glow scale-105' : 'text-slate-500 hover:text-white'}`}>Hunting (Triagem)</button>
            <button onClick={() => setActiveTab('management')} className={`px-12 py-6 rounded-[35px] text-[10px] font-black uppercase tracking-widest transition-all duration-700 ${activeTab === 'management' ? 'bg-purple-500 text-white shadow-glow scale-105' : 'text-slate-500 hover:text-white'}`}>Contratos ERP</button>
            <button onClick={() => setActiveTab('balance')} className={`px-12 py-6 rounded-[35px] text-[10px] font-black uppercase tracking-widest transition-all duration-700 ${activeTab === 'balance' ? 'bg-green-500 text-white shadow-glow scale-105' : 'text-slate-500 hover:text-white'}`}>Balanço Gestão</button>
          </div>
          <div className="relative group"><Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700" size={22} /><input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="BUSCAR..." className="bg-slate-950 border border-white/5 pl-16 pr-10 py-7 rounded-[40px] text-[11px] font-black text-white uppercase outline-none focus:border-cyan-500 w-80 shadow-inner" /></div>
        </div>

        {activeTab === 'balance' ? (
           <div className="space-y-10 relative z-10 animate-in fade-in duration-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="bg-slate-950 p-12 rounded-[60px] border border-white/5 shadow-inner group hover:border-green-500/20 transition-all">
                    <p className="text-[10px] font-black uppercase text-slate-600 mb-4 tracking-[0.4em] italic flex items-center gap-3"><Wallet size={16} className="text-green-500"/> Faturamento Acumulado (Hiring Fee)</p>
                    <p className="text-4xl font-black text-white italic tracking-tighter leading-none">R$ {totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                 </div>
                 <div className="bg-slate-950 p-12 rounded-[60px] border border-white/5 shadow-inner group hover:border-cyan-500/20 transition-all">
                    <p className="text-[10px] font-black uppercase text-slate-600 mb-4 tracking-[0.4em] italic flex items-center gap-3"><Activity size={16} className="text-cyan-500"/> Candidatos Alocados</p>
                    <p className="text-4xl font-black text-white italic tracking-tighter leading-none">{tickets.filter(t => t.status === 'Contratado').length}</p>
                 </div>
              </div>
              <div className="overflow-x-auto bg-slate-950 p-10 rounded-[60px] border border-white/5">
                <table className="w-full text-left">
                  <thead><tr className="text-[10px] uppercase font-black text-slate-700 border-b border-white/5 pb-8 italic tracking-[0.5em]"><th className="pb-8">Talento</th><th className="pb-8">Cliente</th><th className="pb-8">Fee Aplicado</th><th className="pb-8">Valor Líquido</th><th className="pb-8">Histórico / Nota</th></tr></thead>
                  <tbody className="text-[12px]">{tickets.filter(t => t.status === 'Contratado').map(t => (
                    <tr key={t.id} className="border-b border-white/5 hover:bg-white/[0.01] transition-all">
                      <td className="py-10 text-white font-black uppercase italic">{t.name}</td>
                      <td className="py-10 text-slate-500 uppercase italic">{t.client_assigned}</td>
                      <td className="py-10"><span className="px-5 py-2 bg-white/5 rounded-full text-purple-500 font-black text-[10px] uppercase">{t.seniority}</span></td>
                      <td className="py-10 text-green-500 font-black italic">R$ {t.hiring_fee?.toLocaleString()}</td>
                      <td className="py-10 text-slate-600 italic text-[11px]">{t.hiring_notes || 'Sem observações'}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
           </div>
        ) : activeTab === 'management' ? (
          <div className="overflow-x-auto relative z-10 text-left">
            <table className="w-full">
              <thead><tr className="text-[11px] uppercase font-black text-slate-600 border-b border-white/10 italic pb-12 tracking-[0.5em] font-black"><th className="pb-12">Ativo Alocado</th><th className="pb-12">Cliente / Squad</th><th className="pb-12 text-center">Status Emprego</th><th className="pb-12 text-right">Ação Backoffice</th></tr></thead>
              <tbody className="text-[13px]">{tickets.filter(t => t.status === 'Contratado').map(t => (
                <tr key={t.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-all group">
                  <td className="py-14 text-left flex items-center gap-6"><div className="p-5 rounded-[25px] border border-white/5 bg-green-500/10 text-green-500 shadow-inner"><UserCircle size={28} /></div><div className="flex flex-col"><span className="text-white text-lg font-black uppercase italic tracking-tighter leading-none">{t.name}</span><span className="text-[10px] text-slate-600 font-mono mt-2 tracking-widest">{t.id} | {t.area}</span></div></td>
                  <td className="py-14 text-left"><span className="text-white font-black text-[11px] uppercase italic tracking-widest">{t.client_assigned}</span><p className="text-slate-600 text-[9px] uppercase italic mt-1">{t.project_name}</p></td>
                  <td className="py-14 text-center">
                    <button onClick={() => onUpdateERP(t.id, { employment_status: t.employment_status === 'Empregado' ? 'Desligado' : 'Empregado' })} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase italic border ${t.employment_status === 'Empregado' ? 'text-green-500 border-green-500/20 bg-green-500/5 shadow-glow' : 'text-red-500 border-red-500/20 bg-red-500/5'}`}>{t.employment_status || 'Empregado'}</button>
                  </td>
                  <td className="py-14 text-right flex gap-4 justify-end items-center"><button onClick={() => setViewReport(t)} className="p-5 bg-white/5 rounded-3xl text-cyan-500 shadow-glow"><FileText size={22}/></button><button onClick={() => onUpdateERP(t.id, { contract_status: t.contract_status === 'Ativo' ? 'Inativo' : 'Ativo' })} className="p-5 bg-white/5 rounded-2xl text-slate-500">{t.contract_status === 'Ativo' ? <ToggleRight size={26} className="text-green-500" /> : <ToggleLeft size={26} />}</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto relative z-10 text-left">
            <table className="w-full">
              <thead><tr className="text-[11px] uppercase font-black text-slate-600 border-b border-white/10 italic pb-12 tracking-[0.4em]"><th className="pb-12">Protocolo / Talento</th><th className="pb-12 text-center">Senioridade / DISC</th><th className="pb-12 text-right">Ação Consultiva</th></tr></thead>
              <tbody className="text-[13px]">{tickets.filter(t => t.status !== 'Contratado').map(t => (
                <tr key={t.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-all group">
                  <td className="py-14"><div className="flex items-center gap-6"><div className="p-5 rounded-[25px] border border-white/5 bg-cyan-500/10 text-cyan-500 shadow-inner"><UserCheck size={28} /></div><div className="flex flex-col"><span className="text-white text-lg font-black uppercase italic tracking-tighter leading-none">{t.name}</span><span className="text-[10px] text-slate-600 font-mono mt-2 tracking-widest">{t.whatsapp} | {t.region}</span></div></div></td>
                  <td className="py-14 text-center"><span className="text-[10px] font-black uppercase text-purple-500 tracking-widest">{t.behavioral_profile || 'TRIAGEM'}</span><div className="w-32 bg-white/5 h-1 rounded-full mt-3 mx-auto shadow-inner"><div className="bg-cyan-500 h-full rounded-full shadow-glow" style={{ width: `${(Number(t.tech_level) || 1) * 20}%` }} /></div></td>
                  <td className="py-14 text-right flex gap-4 justify-end items-center"><button onClick={() => setViewReport(t)} className="px-8 py-5 bg-cyan-500/10 text-cyan-500 rounded-3xl text-[10px] font-black uppercase border border-cyan-500/20 hover:bg-cyan-500 transition-all shadow-xl">Dossiê RH</button><button onClick={() => setActingContract(t)} className="px-8 py-5 bg-green-500 text-white rounded-3xl text-[10px] font-black uppercase shadow-2xl hover:bg-white transition-all shadow-glow">Efetivar ERP</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL ERP COM SCROLL E CÁLCULO DE TAXA */}
      <AnimatePresence>{actingContract && (
        <div className="fixed inset-0 z-[170] bg-slate-950/99 backdrop-blur-3xl flex items-start justify-center p-6 text-left py-24 overflow-y-auto">
          <motion.div initial={{ scale: 0.95, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="bg-slate-900 border border-cyan-500/30 p-16 md:p-24 rounded-[100px] max-w-4xl w-full relative shadow-[0_0_150px_rgba(6,182,212,0.1)] mb-20">
            <button onClick={() => setActingContract(null)} className="absolute top-16 right-16 text-slate-600 hover:text-white border border-white/5 p-4 rounded-full z-50 bg-slate-950/50 shadow-2xl"><X size={32}/></button>
            <h3 className="text-5xl font-black italic uppercase text-cyan-500 mb-20 italic tracking-tighter flex items-center gap-10 border-b border-white/5 pb-12"><Wallet className="text-white" size={60}/> Efetivar Alocação</h3>
            <form className="space-y-12" onSubmit={handleFinalizeHire}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-4"><label className="text-[12px] font-black uppercase text-slate-700 ml-10 tracking-widest italic font-bold">Cliente (BASA/Deskcorp)</label><input name="client" required placeholder="NOME DO CLIENTE" className="w-full bg-slate-950 border border-white/10 p-10 rounded-[45px] text-sm font-bold text-white uppercase outline-none focus:border-cyan-500 shadow-inner" /></div>
                 <div className="space-y-4"><label className="text-[12px] font-black uppercase text-slate-700 ml-10 tracking-widest italic font-bold">Projeto Vinculado</label><input name="project" required placeholder="EX: CORE BANCÁRIO" className="w-full bg-slate-950 border border-white/10 p-10 rounded-[45px] text-sm font-bold text-white uppercase outline-none focus:border-cyan-500 shadow-inner" /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-4"><label className="text-[12px] font-black uppercase text-slate-700 ml-10 tracking-widest font-bold">Salário Base (R$)</label><input name="salary" type="number" required placeholder="EX: 10000" className="w-full bg-slate-950 border border-white/10 p-10 rounded-[45px] text-[15px] font-bold text-white outline-none focus:border-cyan-500 shadow-inner" /></div>
                 <div className="space-y-4"><label className="text-[12px] font-black uppercase text-slate-700 ml-10 tracking-widest font-bold">Data Início</label><input name="start" type="date" required className="w-full bg-slate-950 border border-white/10 p-10 rounded-[45px] text-[15px] font-bold text-white outline-none focus:border-cyan-500 cursor-pointer shadow-inner" /></div>
              </div>
              <div className="space-y-4"><label className="text-[12px] font-black uppercase text-slate-700 ml-10 tracking-widest italic font-bold">Notas do Balanço Mensal</label><textarea name="notes" placeholder="Descreva notas históricas ou número da NF..." className="w-full bg-slate-950 border border-white/10 p-10 rounded-[55px] text-sm text-slate-400 italic outline-none focus:border-cyan-500 h-32 shadow-inner" /></div>
              <div className="p-12 bg-cyan-500/5 rounded-[60px] border border-cyan-500/20 flex gap-10 items-center shadow-inner"><TrendingUp className="text-cyan-500 shrink-0 shadow-glow" size={40} /><p className="text-sm text-slate-500 italic leading-relaxed">Taxa Lion (Senioridade **{actingContract.seniority}**): O balanço registrará **{actingContract.seniority === 'Junior' ? '50%' : actingContract.seniority === 'Pleno' ? '65%' : '75%'}** do salário como Hiring Fee bruto.</p></div>
              <button type="submit" className="w-3/4 bg-cyan-500 text-slate-950 py-12 rounded-[60px] font-black uppercase text-[12px] tracking-[0.7em] shadow-2xl italic hover:bg-white transition-all duration-1000 shadow-cyan-500/30 shadow-glow">Confirmar Efetivação ERP</button>
            </form>
          </motion.div>
        </div>
      )}</AnimatePresence>

      {/* DOSSIÊ RH DEEP ANALYSIS (DISC/OCEAN) */}
      <AnimatePresence>{viewReport && (
        <div className="fixed inset-0 z-[180] bg-slate-950/99 backdrop-blur-3xl flex items-center justify-center p-6 text-left overflow-y-auto py-24 text-left">
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-cyan-500/30 p-14 md:p-24 rounded-[120px] max-w-6xl w-full relative shadow-2xl overflow-hidden shadow-cyan-500/10 text-left">
            <button onClick={() => setViewReport(null)} className="absolute top-16 right-16 text-slate-600 hover:text-white border border-white/5 p-6 rounded-full"><X size={40}/></button>
            <div className="flex flex-col md:flex-row items-center gap-16 mb-20 border-b border-white/5 pb-20 text-center md:text-left"><div className="p-12 bg-cyan-500 rounded-[60px] text-slate-950 shadow-[0_0_60px_rgba(6,182,212,0.5)] scale-110 font-black"><UserCircle size={100} /></div><div className="space-y-6"><h3 className="text-7xl font-black uppercase italic text-white italic tracking-tighter leading-none">{viewReport.name}</h3><p className="text-cyan-500 text-[15px] font-black uppercase tracking-[0.6em] italic mt-4 flex items-center gap-3 justify-center md:justify-start"><ShieldCheck size={18}/> Dossiê Psicometria Lion Rising • Protocolo: {viewReport.id}</p></div></div>
            <div className="grid md:grid-cols-2 gap-16 mb-20 text-left">
               <div className="p-16 bg-white/5 rounded-[90px] border border-white/5 relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-700"><Star className="absolute -right-16 -top-16 opacity-5 text-cyan-500 scale-150 transition-transform duration-1000" size={300} /><p className="text-[15px] font-black uppercase text-slate-500 mb-12 flex items-center gap-5 tracking-[0.4em] italic font-black"><Star size={28} className="text-cyan-500"/> Expertise Nível {viewReport.tech_level}/5</p><p className="text-xl text-slate-300 leading-relaxed italic font-light tracking-wide">{viewReport.skills_summary}</p></div>
               <div className="p-16 bg-white/5 rounded-[90px] border border-white/5 relative overflow-hidden group hover:border-purple-500/30 transition-all duration-700"><Target className="absolute -right-16 -top-16 opacity-5 text-purple-500 scale-150 transition-transform duration-1000" size={300} /><p className="text-[15px] font-black uppercase text-slate-500 mb-12 flex items-center gap-5 tracking-[0.4em] italic font-black"><Target size={28} className="text-purple-500"/> Comportamental DISC</p><p className="text-lg text-slate-500 font-black uppercase tracking-widest mb-6">Estado Civil: {viewReport.marital_status} • Hobby: {viewReport.hobbies}</p><p className="text-xl text-slate-300 leading-relaxed italic font-light tracking-wide">{viewReport.behavioral_summary}</p></div>
            </div>
            {/* Bloco OCEAN Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-20 text-center">
               {[{k: 'ocean_openness', l: 'Abertura'}, {k: 'ocean_conscientiousness', l: 'Consciência'}, {k: 'ocean_extraversion', l: 'Extroversão'}, {k: 'ocean_agreeableness', l: 'Amabilidade'}, {k: 'ocean_neuroticism', l: 'Estabilidade'}].map(o => (
                 <div key={o.k} className="bg-slate-950 p-8 rounded-[40px] border border-white/5 shadow-inner group hover:border-purple-500/30 transition-all">
                    <p className="text-[10px] font-black uppercase text-slate-700 mb-4 italic tracking-widest">{o.l}</p>
                    <p className="text-3xl font-black text-cyan-500 italic tracking-tighter">{(viewReport as any)[o.k] || 5}/10</p>
                 </div>
               ))}
            </div>
            <button onClick={() => { navigator.clipboard.writeText(`DOSSIÊ LION\nCandidato: ${viewReport.name}\nNível: ${viewReport.tech_level}/5\nDISC: ${viewReport.behavioral_profile}\nOCEAN: Openness ${(viewReport as any).ocean_openness}/10`); alert("Copiado com sucesso."); }} className="w-full bg-cyan-500 text-slate-950 py-12 rounded-[80px] font-black uppercase text-[18px] tracking-[0.8em] shadow-2xl flex items-center justify-center gap-8 italic hover:bg-white transition-all duration-1000 group shadow-cyan-500/30 shadow-glow"><Copy size={36}/> Copiar Dossiê Completo para Diretor</button>
          </motion.div>
        </div>
      )}</AnimatePresence>
    </section>
  );
}