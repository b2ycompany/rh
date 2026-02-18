"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, ShieldCheck, X, Search, MapPin, UserCircle, Star, Target, Copy, 
  CheckCircle2, ChevronRight, Wallet, FileText, Building2, UserCheck, 
  TrendingUp, Heart, Baby, Check, Ban, Zap, Info, Map, Users2, Calendar, Clock
} from 'lucide-react';
import { TicketData, JobData } from '@/app/page';

interface AdminProps {
  tickets: TicketData[]; vacancies: any[];
  onAddJob: (job: any) => void; onUpdateJob: (id: string, data: any) => void; onUpdateERP: (id: string, data: any) => void;
}

export default function AdminRH({ tickets, vacancies, onAddJob, onUpdateJob, onUpdateERP }: AdminProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [creds, setCreds] = useState({ user: "", pass: "" });
  const [activeTab, setActiveTab] = useState<'leads' | 'jobs_approval' | 'management' | 'balance'>('leads');
  const [searchTerm, setSearchTerm] = useState("");
  const [viewReport, setViewReport] = useState<TicketData | null>(null);
  const [actingContract, setActingContract] = useState<TicketData | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (creds.user.trim().toUpperCase() === "LIONRISING" && creds.pass === "LE010584") setIsAuthorized(true);
    else alert("ACESSO NEGADO.");
  };

  const calculateCommission = (salary: number, seniority: string) => {
    if (seniority === 'Senior') return salary * 0.75;
    if (seniority === 'Pleno') return salary * 0.65;
    return salary * 0.50; 
  };

  const totalRevenue = useMemo(() => tickets.reduce((acc, t) => acc + (t.hiring_fee || 0), 0), [tickets]);

  const handleFinalizeHire = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const salary = Number(fd.get('salary'));
    if (!actingContract) return;

    onUpdateERP(actingContract.id, {
      status: 'Contratado',
      client_assigned: fd.get('client'),
      project_name: fd.get('project'),
      first_salary: salary,
      hiring_fee: calculateCommission(salary, actingContract.seniority || 'Junior'),
      hiring_notes: fd.get('notes'),
      contract_start: fd.get('start'),
      contract_status: 'Ativo',
      employment_status: 'Empregado'
    });
    setActingContract(null);
  };

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto py-24 px-6 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1 }} className="bg-slate-900 p-14 rounded-[80px] border border-white/5 shadow-2xl relative overflow-hidden text-left">
          <div className="w-28 h-28 bg-cyan-500/10 rounded-[45px] flex items-center justify-center mx-auto mb-10 shadow-glow"><Lock size={50} className="text-cyan-500" /></div>
          <h2 className="text-4xl font-black uppercase italic mb-10 text-white tracking-tighter leading-none">Lion <span className="text-cyan-500 font-black">Backoffice</span></h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input onChange={e => setCreds({...creds, user: e.target.value})} placeholder="ID OPERADOR" className="w-full bg-slate-950 border border-white/10 p-8 rounded-[35px] text-[11px] font-black text-white outline-none focus:border-cyan-500 shadow-inner" />
            <input type="password" onChange={e => setCreds({...creds, pass: e.target.value})} placeholder="CHAVE MESTRA" className="w-full bg-slate-950 border border-white/10 p-8 rounded-[35px] text-[11px] font-black text-white outline-none focus:border-cyan-500 font-mono italic shadow-inner" />
            <button className="w-full bg-cyan-500 text-slate-950 py-9 rounded-[45px] font-black uppercase text-xs tracking-[0.5em] shadow-xl hover:bg-white transition-all duration-700 italic">Autenticar Auditoria</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-6 py-12 text-left">
      <div className="bg-slate-900 p-12 md:p-20 rounded-[80px] border border-white/5 shadow-2xl relative overflow-hidden text-left">
        
        {/* NAV TABS */}
        <div className="flex flex-col xl:flex-row justify-between items-center mb-16 border-b border-white/5 pb-14 gap-12 relative z-10">
          <div className="flex flex-wrap bg-slate-950 p-3 rounded-[45px] border border-white/5 shadow-inner">
            <button onClick={() => setActiveTab('leads')} className={`px-12 py-6 rounded-[35px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'leads' ? 'bg-cyan-500 text-slate-950 shadow-glow' : 'text-slate-500 hover:text-white'}`}>Candidatos</button>
            <button onClick={() => setActiveTab('jobs_approval')} className={`px-12 py-6 rounded-[35px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'jobs_approval' ? 'bg-orange-500 text-white' : 'text-slate-500 hover:text-white'}`}>Vagas</button>
            <button onClick={() => setActiveTab('management')} className={`px-12 py-6 rounded-[35px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'management' ? 'bg-purple-500 text-white' : 'text-slate-500 hover:text-white'}`}>Gestão ERP</button>
            <button onClick={() => setActiveTab('balance')} className={`px-12 py-6 rounded-[35px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'balance' ? 'bg-green-500 text-white' : 'text-slate-500 hover:text-white'}`}>Balanço</button>
          </div>
          <div className="relative"><Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700" size={22} /><input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="BUSCAR TALENTO..." className="bg-slate-950 border border-white/5 pl-16 pr-10 py-7 rounded-[40px] text-[11px] font-black text-white outline-none focus:border-cyan-500 w-80 shadow-inner italic" /></div>
        </div>

        {/* LISTA DE CANDIDATOS */}
        {activeTab === 'leads' && (
          <div className="overflow-x-auto relative z-10 animate-in fade-in duration-700">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] uppercase font-black text-slate-600 border-b border-white/10 italic pb-8 tracking-[0.4em]">
                  <th className="pb-8">Talento / Protocolo</th>
                  <th className="pb-8 text-center">Perfil / Local</th>
                  <th className="pb-8 text-right">Ação Consultiva</th>
                </tr>
              </thead>
              <tbody className="text-[13px]">
                {tickets.filter(t => t.role === 'candidate' && t.status !== 'Contratado' && t.name.toLowerCase().includes(searchTerm.toLowerCase())).map(t => (
                  <tr key={t.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-all group">
                    <td className="py-12">
                      <div className="flex items-center gap-6">
                        <div className="p-5 rounded-[25px] border border-white/5 bg-cyan-500/10 text-cyan-500 shadow-inner"><UserCheck size={28} /></div>
                        <div className="flex flex-col">
                          <span className="text-white text-lg font-black uppercase italic tracking-tighter leading-none">{t.name}</span>
                          <span className="text-[10px] text-slate-600 font-mono mt-2 tracking-widest">{t.seniority} • {t.area}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-12 text-center">
                      <span className="text-[10px] font-black uppercase text-purple-500 tracking-widest">{t.behavioral_profile || 'Discovery'}</span>
                      <p className="text-[9px] text-slate-700 uppercase mt-2 font-bold flex items-center justify-center gap-1"><MapPin size={10}/> {t.cidade}/{t.uf}</p>
                    </td>
                    <td className="py-12 text-right flex gap-4 justify-end items-center">
                      <button onClick={() => setViewReport(t)} className="px-8 py-5 bg-cyan-500/10 text-cyan-500 rounded-3xl text-[10px] font-black uppercase border border-cyan-500/20 hover:bg-cyan-500 transition-all shadow-xl">Dossiê RH</button>
                      <button onClick={() => setActingContract(t)} className="px-8 py-5 bg-green-500 text-white rounded-3xl text-[10px] font-black uppercase shadow-2xl hover:bg-white transition-all shadow-glow">Efetivar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB VAGAS */}
        {activeTab === 'jobs_approval' && (
          <div className="overflow-x-auto animate-in fade-in duration-700">
             <table className="w-full text-left">
                <thead><tr className="text-[11px] uppercase font-black text-slate-600 border-b border-white/5 pb-12 tracking-[0.5em]"><th className="pb-12">Solicitante</th><th className="pb-12">Título</th><th className="pb-12">Decisão</th></tr></thead>
                <tbody>{tickets.filter(t => t.role === 'client' && t.status === 'Pendente').map(v => (
                  <tr key={v.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="py-10"><div className="flex items-center gap-6 text-white font-black uppercase italic">{v.company_name}</div></td>
                    <td className="py-10 text-slate-400 font-bold uppercase italic">{v.job_title}</td>
                    <td className="py-10 flex gap-4">
                      <button onClick={() => onUpdateERP(v.id, { status: 'Aprovado' })} className="p-3 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 transition-all"><Check size={18}/></button>
                      <button onClick={() => onUpdateERP(v.id, { status: 'Reprovado' })} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 transition-all"><Ban size={18}/></button>
                    </td>
                  </tr>
                ))}</tbody>
             </table>
          </div>
        )}

        {/* TAB GESTÃO ERP (CONTRATADOS) */}
        {activeTab === 'management' && (
          <div className="overflow-x-auto animate-in fade-in duration-700">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] uppercase font-black text-slate-600 border-b border-white/5 pb-8 tracking-[0.4em]">
                  <th className="pb-8">Colaborador</th>
                  <th className="pb-8">Cliente / Projeto</th>
                  <th className="pb-8 text-right">Remuneração</th>
                </tr>
              </thead>
              <tbody>
                {tickets.filter(t => t.status === 'Contratado').map(t => (
                  <tr key={t.id} className="border-b border-white/5 group">
                    <td className="py-8 text-white font-black uppercase italic">{t.name}</td>
                    <td className="py-8 text-slate-500 font-bold uppercase text-[10px]">{t.client_assigned} • {t.project_name}</td>
                    <td className="py-8 text-right text-green-500 font-mono font-black italic">R$ {t.first_salary?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB BALANÇO FINANCEIRO */}
        {activeTab === 'balance' && (
          <div className="grid md:grid-cols-2 gap-10 animate-in fade-in duration-1000">
            <div className="bg-slate-950 p-12 rounded-[60px] border border-white/5 shadow-inner">
               <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest mb-6 italic">Receita Total de Alocação</p>
               <h3 className="text-6xl font-black text-green-500 italic tracking-tighter">R$ {totalRevenue.toLocaleString()}</h3>
               <div className="mt-10 flex items-center gap-4 text-[10px] text-slate-700 uppercase font-black tracking-widest italic border-t border-white/5 pt-6"><TrendingUp size={16} className="text-green-500"/> Performance Lion Rising</div>
            </div>
            <div className="bg-slate-950 p-12 rounded-[60px] border border-white/5 shadow-inner flex flex-col justify-center">
               <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest mb-4 italic">Total de Talentos Alocados</p>
               <p className="text-5xl font-black text-white italic tracking-tighter">{tickets.filter(t => t.status === 'Contratado').length} SQUADS</p>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DOSSIÊ RH DEEP ANALYSIS (ATUALIZADO) */}
      <AnimatePresence>
        {viewReport && (
          <div className="fixed inset-0 z-[180] bg-slate-950/98 backdrop-blur-3xl flex items-center justify-center p-6 text-left overflow-y-auto py-24">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-cyan-500/30 p-12 md:p-20 rounded-[80px] max-w-6xl w-full relative shadow-2xl">
              <button onClick={() => setViewReport(null)} className="absolute top-12 right-12 text-slate-600 hover:text-white border border-white/5 p-4 rounded-full transition-all"><X size={32}/></button>
              
              <div className="flex flex-col md:flex-row items-center gap-12 mb-16 border-b border-white/5 pb-16">
                <div className="p-10 bg-cyan-500 rounded-[50px] text-slate-950 shadow-glow"><UserCircle size={80} /></div>
                <div className="text-center md:text-left">
                  <h3 className="text-6xl font-black uppercase italic text-white tracking-tighter leading-none">{viewReport.name}</h3>
                  <div className="flex flex-wrap gap-4 mt-6 items-center justify-center md:justify-start">
                    <span className="text-cyan-500 text-[12px] font-black uppercase tracking-[0.4em] italic">Dossiê v8.8 • {viewReport.id}</span>
                    <span className="text-slate-600 font-black text-[12px]">• {viewReport.area} • {viewReport.seniority}</span>
                  </div>
                </div>
              </div>

              {/* GRID DE INFORMAÇÕES PESSOAIS E COMPORTAMENTAIS */}
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                 {/* INFO PESSOAL */}
                 <div className="p-10 bg-slate-950/50 rounded-[60px] border border-white/5 space-y-6">
                    <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest flex items-center gap-3"><Users2 size={16}/> Dossiê Pessoal</p>
                    <div className="space-y-4">
                       <div className="flex justify-between border-b border-white/5 pb-2 text-left"><span className="text-slate-500 text-[10px] uppercase font-bold text-left">Nascimento:</span> <span className="text-white text-[12px] font-black italic">{viewReport.birth_date ? new Date(viewReport.birth_date).toLocaleDateString('pt-BR') : "Auditando"}</span></div>
                       <div className="flex justify-between border-b border-white/5 pb-2 text-left"><span className="text-slate-500 text-[10px] uppercase font-bold text-left">Estado Civil:</span> <span className="text-white text-[12px] font-black italic">{viewReport.marital_status || "Não informado"}</span></div>
                       <div className="flex justify-between border-b border-white/5 pb-2 text-left"><span className="text-slate-500 text-[10px] uppercase font-bold text-left">Hobby:</span> <span className="text-white text-[12px] font-black italic uppercase tracking-tighter">{viewReport.hobbies || "Não informado"}</span></div>
                    </div>
                 </div>

                 {/* ENDEREÇO */}
                 <div className="p-10 bg-slate-950/50 rounded-[60px] border border-white/5 space-y-6">
                    <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest flex items-center gap-3"><Map size={16}/> Localidade Auditada</p>
                    <div className="text-white font-black italic space-y-2">
                       <p className="text-lg leading-none">{viewReport.logradouro}, {viewReport.numero}</p>
                       <p className="text-[11px] text-slate-500 uppercase tracking-widest">{viewReport.bairro} • {viewReport.cidade}/{viewReport.uf}</p>
                    </div>
                 </div>

                 {/* DISC / DISPONIBILIDADE */}
                 <div className="p-10 bg-slate-950/50 rounded-[60px] border border-white/5 space-y-6">
                    <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest flex items-center gap-3"><Target size={16}/> DISC / Disponibilidade</p>
                    <p className="text-3xl text-white font-black italic uppercase tracking-tighter">{viewReport.behavioral_profile || "Auditando"}</p>
                    <div className="flex items-center gap-3 text-cyan-500 font-black uppercase text-[10px]"><Clock size={12}/> {viewReport.availability || "Imediata"}</div>
                 </div>
              </div>

              {/* TRAJETÓRIA PROFISSIONAL */}
              <div className="bg-slate-950 p-12 rounded-[60px] border border-white/5 mb-16 relative overflow-hidden text-left">
                <p className="text-[12px] font-black uppercase text-slate-700 tracking-[0.5em] italic flex items-center gap-6 border-b border-white/5 pb-6 mb-8 text-left"><FileText size={20}/> Trajetória Profissional</p>
                <p className="text-xl text-slate-400 leading-loose italic font-light text-left">{viewReport.experience_bio || "Nenhuma bio enviada."}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-16">
                 {[{k: 'ocean_openness', l: 'Abertura'}, {k: 'ocean_conscientiousness', l: 'Foco'}, {k: 'ocean_extraversion', l: 'Social'}, {k: 'ocean_agreeableness', l: 'Amabilidade'}, {k: 'ocean_neuroticism', l: 'Estabilidade'}].map(o => (
                   <div key={o.k} className="bg-slate-950 p-6 rounded-[35px] border border-white/5 text-center shadow-inner group hover:border-cyan-500/20 transition-all">
                      <p className="text-[9px] font-black uppercase text-slate-700 mb-3 tracking-widest text-center">{o.l}</p>
                      <p className="text-3xl font-black text-cyan-500 italic text-center">{(viewReport as any)[o.k] || 5}/10</p>
                   </div>
                 ))}
              </div>

              <button onClick={() => { navigator.clipboard.writeText(`RELATÓRIO LION: ${viewReport.name}\nPerfil: ${viewReport.behavioral_profile}\nPretensão: R$ ${viewReport.salary_expectation}`); alert("Dossiê Copiado!"); }} className="w-full bg-cyan-500 text-slate-950 py-12 rounded-[60px] font-black uppercase text-[15px] tracking-[0.8em] shadow-2xl flex items-center justify-center gap-8 italic hover:bg-white transition-all shadow-glow"><Copy size={32}/> Copiar Dossiê Completo</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL ERP (CONTROLE FINANCEIRO) */}
      <AnimatePresence>
        {actingContract && (
          <div className="fixed inset-0 z-[190] bg-slate-950/99 backdrop-blur-3xl flex items-center justify-center p-6 text-left">
             <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="bg-slate-900 border border-green-500/30 p-16 rounded-[80px] max-w-4xl w-full relative">
                <button onClick={() => setActingContract(null)} className="absolute top-12 right-12 text-slate-600 hover:text-white border border-white/5 p-4 rounded-full"><X size={32}/></button>
                <h3 className="text-5xl font-black italic uppercase text-green-500 mb-12 tracking-tighter flex items-center gap-8 border-b border-white/5 pb-10">Efetivar Alocação</h3>
                <form className="space-y-10 text-left" onSubmit={handleFinalizeHire}>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                      <div className="space-y-3"><label className="text-[11px] font-black uppercase text-slate-700 ml-8 tracking-widest">Instituição Cliente</label><input name="client" required placeholder="Ex: Deskcorp" className="w-full bg-slate-950 border border-white/10 p-8 rounded-[35px] text-white font-bold uppercase outline-none focus:border-green-500 shadow-inner" /></div>
                      <div className="space-y-3"><label className="text-[11px] font-black uppercase text-slate-700 ml-8 tracking-widest">Projeto</label><input name="project" required placeholder="Ex: SQUAD CORE" className="w-full bg-slate-950 border border-white/10 p-8 rounded-[35px] text-white font-bold uppercase outline-none focus:border-green-500 shadow-inner" /></div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                      <div className="space-y-3 text-left"><label className="text-[11px] font-black uppercase text-slate-700 ml-8 tracking-widest">Salário Bruto (R$)</label><input name="salary" type="number" required placeholder="10000" className="w-full bg-slate-950 border border-white/10 p-8 rounded-[35px] text-white font-bold outline-none focus:border-green-500 shadow-inner" /></div>
                      <div className="space-y-3 text-left"><label className="text-[11px] font-black uppercase text-slate-700 ml-8 tracking-widest">Início</label><input name="start" type="date" required className="w-full bg-slate-950 border border-white/10 p-8 rounded-[35px] text-white font-bold outline-none focus:border-green-500 shadow-inner" /></div>
                   </div>
                   <button type="submit" className="w-full bg-green-500 text-white py-10 rounded-[45px] font-black uppercase text-xs tracking-[0.6em] shadow-2xl hover:bg-white hover:text-slate-950 transition-all italic">Confirmar Efetivação ERP</button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}