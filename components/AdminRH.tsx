"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, ShieldCheck, LogOut, Plus, Wallet, FileText, 
  Building2, UserCheck, X, Search, Edit3, MapPin, 
  ChevronRight, ArrowRight, CheckCircle2, Filter, Settings, Database
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
  
  // Modais e Edição
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobData | null>(null);
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);
  const [salaryNegotiable, setSalaryNegotiable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // --- LÓGICA DE ACESSO ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const u = creds.user.trim().toUpperCase();
    const p = creds.pass.trim().toUpperCase();

    if (u === "LIONRISING" && p === "LE010584") {
      setIsAuthorized(true);
    } else {
      alert("ACESSO NEGADO: Credenciais de Operador Inválidas.");
    }
  };

  // --- GESTÃO DE MARKETPLACE ---
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
    setSalaryNegotiable(false);
  };

  // Filtro de Busca
  const filteredTickets = tickets.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- VIEW: LOGIN ---
  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto py-24 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 p-12 rounded-[60px] border border-white/5 text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
          <div className="w-20 h-20 bg-cyan-500/10 rounded-3xl flex items-center justify-center mx-auto mb-10 border border-cyan-500/20">
            <Lock size={40} className="text-cyan-500" />
          </div>
          <h2 className="text-3xl font-black uppercase italic mb-10 text-white tracking-tighter italic">Lion <span className="text-cyan-500">Governance</span></h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              onChange={e => setCreds({...creds, user: e.target.value})} 
              placeholder="OPERADOR" 
              className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl text-[10px] font-bold text-white uppercase outline-none focus:border-cyan-500 transition-all italic" 
            />
            <input 
              type="password" 
              onChange={e => setCreds({...creds, pass: e.target.value})} 
              placeholder="CHAVE DE ACESSO" 
              className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl text-[10px] font-bold text-white outline-none focus:border-cyan-500 font-mono italic" 
            />
            <button className="w-full bg-cyan-500 text-slate-950 py-6 rounded-[30px] font-black uppercase text-xs tracking-[0.4em] hover:bg-white transition-all duration-500 shadow-xl shadow-cyan-500/20">
              Autenticar Sistema
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-6">
      <div className="bg-slate-900 p-12 rounded-[60px] border border-white/5 shadow-2xl relative overflow-hidden">
        
        {/* HEADER ADMIN */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-12 border-b border-white/5 pb-10 gap-8">
          <div className="flex bg-slate-950 p-2 rounded-[30px] border border-white/5 shadow-inner">
            <button 
              onClick={() => setActiveTab('tickets')} 
              className={`px-10 py-4 rounded-[25px] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${activeTab === 'tickets' ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 scale-105' : 'text-slate-500 hover:text-white'}`}
            >
              Base de Leads
            </button>
            <button 
              onClick={() => setActiveTab('jobs')} 
              className={`px-10 py-4 rounded-[25px] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${activeTab === 'jobs' ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 scale-105' : 'text-slate-500 hover:text-white'}`}
            >
              Gestão de Vagas
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
              <input 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="BUSCAR PROTOCOLO..." 
                className="bg-slate-950 border border-white/10 pl-12 pr-6 py-4 rounded-2xl text-[9px] font-black text-white uppercase outline-none focus:border-cyan-500 w-64 italic"
              />
            </div>
            <button 
              onClick={() => setIsAuthorized(false)} 
              className="p-4 bg-white/5 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all duration-500 group"
            >
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* CONTEÚDO: LEADS E TICKETS */}
        {activeTab === 'tickets' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase font-black text-slate-500 border-b border-white/10 italic text-center tracking-[0.2em]">
                  <th className="pb-6 text-left">ID Protocolo</th>
                  <th className="pb-6 text-left">Entidade / Lead Info</th>
                  <th className="pb-6">CPF / CNPJ</th>
                  <th className="pb-6 text-left">Logradouro Completo</th>
                  <th className="pb-6">Docs</th>
                  <th className="pb-6 text-right">Ação ERP</th>
                </tr>
              </thead>
              <tbody className="text-[11px]">
                {filteredTickets.map(t => (
                  <tr key={t.id} className="border-b border-white/5 hover:bg-white/5 transition-all group text-center">
                    <td className="py-8 font-mono text-cyan-500 font-bold text-left">{t.id}</td>
                    <td className="py-8 text-left uppercase font-black italic">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${t.role === 'client' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                          {t.role === 'client' ? <Building2 size={16} /> : <UserCheck size={16} />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white text-sm tracking-tighter">{t.name}</span>
                          <span className="text-[9px] text-slate-600 font-mono not-italic mt-1 leading-none">{t.whatsapp} | {t.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-8 text-slate-400 font-mono tracking-tighter">{t.cpf_cnpj || "NÃO INFORMADO"}</td>
                    <td className="py-8 text-left">
                      <div className="flex items-start gap-3">
                        <MapPin size={16} className="text-cyan-500 shrink-0 mt-1 opacity-50" />
                        <div className="flex flex-col text-[10px]">
                          <span className="text-slate-200 font-bold uppercase">{t.logradouro || "ENDEREÇO REMOTO"}, {t.numero}</span>
                          <span className="text-slate-600 italic uppercase">{t.bairro} — {t.cidade}/{t.uf}</span>
                          <span className="text-slate-700 font-mono text-[9px] mt-1">{t.cep}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-8">
                      {t.resume_url ? (
                        <div className="p-3 bg-cyan-500/10 rounded-2xl inline-block text-cyan-500 shadow-inner group-hover:scale-110 transition-transform">
                          <FileText size={18}/>
                        </div>
                      ) : <span className="text-slate-800 font-black">—</span>}
                    </td>
                    <td className="py-8 text-right">
                      <button 
                        onClick={() => setEditingTicketId(t.id)} 
                        className="px-6 py-3 bg-white text-slate-950 rounded-2xl text-[10px] font-black uppercase shadow-xl hover:bg-cyan-500 hover:shadow-cyan-500/20 transition-all italic tracking-widest"
                      >
                        Atuar ERP
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTickets.length === 0 && (
              <div className="py-20 text-center text-slate-700 font-black uppercase text-xs tracking-widest italic">
                Nenhum protocolo localizado na base de dados.
              </div>
            )}
          </div>
        )}

        {/* CONTEÚDO: MARKETPLACE DE VAGAS */}
        {activeTab === 'jobs' && (
          <div className="space-y-10 text-left">
            <div className="flex justify-between items-center bg-slate-950 p-10 rounded-[40px] border border-white/5 relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-5">
                <Database size={120} className="text-cyan-500" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black italic uppercase text-white tracking-widest italic">Hub de Oportunidades</h3>
                <p className="text-[10px] text-slate-600 uppercase mt-2 tracking-[0.2em] font-black italic">Gestão e Publicação de Vagas em Tempo Real</p>
              </div>
              <button 
                onClick={() => { setEditingJob(null); setShowJobForm(true); setSalaryNegotiable(false); }} 
                className="relative z-10 flex items-center gap-3 bg-cyan-500 text-slate-950 px-10 py-5 rounded-[28px] text-[10px] font-black uppercase shadow-lg shadow-cyan-500/20 hover:bg-white hover:scale-105 transition-all duration-500 italic"
              >
                <Plus size={20}/> Publicar Nova Vaga
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vacancies.map(job => (
                <div 
                  key={job.id} 
                  className="p-10 bg-slate-950 border border-white/10 rounded-[55px] group hover:border-cyan-500/50 transition-all flex flex-col relative overflow-hidden shadow-2xl"
                >
                  <div className="flex justify-between items-start mb-6">
                    <h4 className="text-xl font-black italic uppercase text-cyan-500 leading-tight italic max-w-[80%]">{job.title}</h4>
                    <button 
                      onClick={() => { setEditingJob(job); setSalaryNegotiable(job.salary === "A combinar"); setShowJobForm(true); }} 
                      className="p-4 bg-white/5 rounded-2xl text-slate-500 hover:text-white hover:bg-cyan-500 transition-all duration-500"
                    >
                      <Edit3 size={18}/>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-600 mb-8 font-black uppercase tracking-[0.3em] italic">{job.area} • {job.seniority}</p>
                  <p className="text-xs text-slate-400 italic mb-10 line-clamp-4 leading-relaxed">{job.description}</p>
                  
                  <div className="mt-auto pt-8 border-t border-white/5 flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase text-slate-600 mb-1 tracking-widest">Remuneração</span>
                      <span className="text-white font-black text-md uppercase italic tracking-tighter">{job.salary}</span>
                    </div>
                    <span className={`text-[9px] font-black uppercase px-4 py-2 rounded-xl border tracking-widest italic ${job.status === 'Ativa' ? 'text-green-500 border-green-500/20 bg-green-500/5' : 'text-red-500 border-red-500/20 bg-red-500/5'}`}>
                      {job.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: FORMULÁRIO DE VAGA (EDIÇÃO INTEGRAL) */}
      <AnimatePresence>
        {showJobForm && (
          <div className="fixed inset-0 z-[150] bg-slate-950/98 backdrop-blur-2xl flex items-center justify-center p-6 text-left overflow-y-auto py-20">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="bg-slate-900 border border-cyan-500/30 p-12 rounded-[65px] max-w-2xl w-full shadow-2xl relative shadow-[0_0_100px_rgba(6,182,212,0.15)]"
            >
              <button 
                onClick={() => {setShowJobForm(false); setEditingJob(null);}} 
                className="absolute top-12 right-12 text-slate-600 hover:text-white transition-colors p-2"
              >
                <X size={28}/>
              </button>
              
              <h3 className="text-2xl font-black italic uppercase mb-12 text-cyan-500 italic flex items-center gap-4">
                {editingJob ? <Edit3 size={32} className="text-white"/> : <Plus size={32} className="text-white"/>}
                {editingJob ? 'Editar Oportunidade' : 'Publicar Oportunidade'}
              </h3>
              
              <form className="space-y-6" onSubmit={handleSaveJob}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-slate-600 ml-4 italic tracking-widest">Título da Vaga</label>
                    <input name="title" defaultValue={editingJob?.title} required placeholder="EX: FULLSTACK DEVELOPER SENIOR" className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl text-xs font-bold text-white uppercase outline-none focus:border-cyan-500 transition-all italic" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-600 ml-4 italic tracking-widest">Área Técnica</label>
                    <input name="area" defaultValue={editingJob?.area} required placeholder="DEV / QA / PM / ARQ" className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl text-[11px] font-bold text-white uppercase outline-none focus:border-cyan-500" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-600 ml-4 italic tracking-widest">Senioridade</label>
                    <input name="seniority" defaultValue={editingJob?.seniority} required placeholder="PLENO / SENIOR" className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl text-[11px] font-bold text-white uppercase outline-none focus:border-cyan-500" />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-slate-600 ml-4 italic tracking-widest">Oferta Salarial</label>
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                      <input 
                        name="salary" 
                        defaultValue={editingJob?.salary !== "A combinar" ? editingJob?.salary : ""} 
                        disabled={salaryNegotiable}
                        placeholder="EX: R$ 18.000,00" 
                        className={`w-full md:w-2/3 bg-slate-950 border border-white/10 p-6 rounded-3xl text-xs font-bold text-white uppercase outline-none focus:border-cyan-500 transition-all ${salaryNegotiable ? 'opacity-20 pointer-events-none grayscale' : ''}`} 
                      />
                      <button 
                        type="button" 
                        onClick={() => setSalaryNegotiable(!salaryNegotiable)}
                        className={`w-full md:w-1/3 flex items-center justify-center gap-3 p-6 rounded-3xl border text-[10px] font-black uppercase transition-all duration-500 ${salaryNegotiable ? 'bg-cyan-500 border-cyan-500 text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.4)]' : 'bg-slate-950 border-white/10 text-slate-600 hover:border-cyan-500/50 hover:text-white'}`}
                      >
                        {salaryNegotiable ? <CheckCircle2 size={18}/> : <Wallet size={18}/>} A combinar
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-slate-600 ml-4 italic tracking-widest">Requisitos & Escopo</label>
                    <textarea name="desc" defaultValue={editingJob?.description} required rows={5} className="w-full bg-slate-950 border border-white/10 p-7 rounded-[35px] text-xs font-bold text-white uppercase outline-none focus:border-cyan-500 italic leading-relaxed" placeholder="DETALHE O ESCOPO TÉCNICO E REQUISITOS..." />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-slate-600 ml-4 italic tracking-widest">Visibilidade</label>
                    <select name="status" defaultValue={editingJob?.status || 'Ativa'} className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl text-[10px] font-black text-white uppercase outline-none focus:border-cyan-500 appearance-none cursor-pointer">
                      <option value="Ativa">Publicada (Ativa)</option>
                      <option value="Pausada">Pausada (Oculta)</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-6 pt-10">
                  <button type="button" onClick={() => {setShowJobForm(false); setEditingJob(null);}} className="w-1/4 text-[11px] font-black uppercase text-slate-600 tracking-[0.3em] hover:text-white transition-colors italic">Cancelar</button>
                  <button type="submit" className="w-3/4 bg-cyan-500 text-slate-950 py-8 rounded-[40px] font-black uppercase text-xs tracking-[0.5em] shadow-2xl shadow-cyan-500/20 italic hover:scale-[1.02] transition-all duration-500">
                    {editingJob ? 'Confirmar Alterações' : 'Publicar Marketplace'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL ERP: ATUAÇÃO E CONTRATO */}
      <AnimatePresence>
        {editingTicketId && (
          <div className="fixed inset-0 z-[150] bg-slate-950/98 backdrop-blur-2xl flex items-center justify-center p-6 text-left">
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900 border border-cyan-500/30 p-12 rounded-[65px] max-w-lg w-full relative shadow-2xl">
              <button onClick={() => setEditingTicketId(null)} className="absolute top-10 right-10 text-slate-600 hover:text-white"><X size={24}/></button>
              <h3 className="text-2xl font-black italic uppercase mb-10 text-cyan-500 italic flex items-center gap-4">
                <Wallet className="text-white" size={32}/> Módulo ERP Lion
              </h3>
              <form className="space-y-6" onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                onUpdateERP(editingTicketId, {
                  status: 'Contratado',
                  project_name: fd.get('p'),
                  monthly_value: Number(fd.get('v')),
                  contract_start: fd.get('s'),
                  contract_end: fd.get('e'),
                  payment_status: 'Auditado'
                });
                setEditingTicketId(null);
              }}>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-600 ml-4 italic tracking-widest">Projeto de Alocação</label>
                    <input name="p" required placeholder="EX: BANCO DA AMAZÔNIA - BASA" className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl text-xs font-bold text-white uppercase outline-none focus:border-cyan-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-600 ml-4 italic tracking-widest">Valor do Contrato (Mensal)</label>
                    <input name="v" type="number" required placeholder="EX: 20000" className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl text-xs font-bold text-white uppercase outline-none focus:border-cyan-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-600 ml-4 italic tracking-widest">Início</label>
                      <input name="s" type="date" className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl text-[10px] font-bold text-white outline-none focus:border-cyan-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-600 ml-4 italic tracking-widest">Término</label>
                      <input name="e" type="date" className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl text-[10px] font-bold text-white outline-none focus:border-cyan-500" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 pt-10">
                   <button type="button" onClick={() => setEditingTicketId(null)} className="w-1/3 text-[10px] font-black uppercase text-slate-600 tracking-widest italic font-black">Cancelar</button>
                   <button type="submit" className="w-2/3 bg-cyan-500 text-slate-950 py-7 rounded-[35px] font-black uppercase text-xs tracking-[0.4em] shadow-2xl shadow-cyan-500/20 italic hover:bg-white transition-all duration-500">Efetivar Contrato</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}