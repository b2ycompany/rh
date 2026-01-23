"use client";

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  Briefcase, 
  Star, 
  Cpu, 
  UserCircle, 
  Search, 
  Zap, 
  Database, 
  Wallet, 
  Calendar, 
  FileCheck, 
  ShieldAlert,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Award,
  Globe,
  Lock,
  FileText,
  Download,
  Target,
  Fingerprint,
  Mail
} from 'lucide-react';
import { TicketData } from '@/app/page';

/**
 * COMPONENTE: DASHBOARD ESTRATÉGICO DO CANDIDATO
 * Versão: 5.0 - Governança Lion Rising & B2Y Group
 * Descrição: Portal completo de acompanhamento, faturamento e status técnico.
 */

export default function Dashboard({ ticket }: { ticket: TicketData }) {
  // Lógica de Status da Timeline baseada na Governança
  const steps = useMemo(() => [
    { label: "Discovery", active: ["Discovery", "Shortlist", "Aprovado", "Contratado"].includes(ticket.status) },
    { label: "Matching", active: ["Shortlist", "Aprovado", "Contratado"].includes(ticket.status) },
    { label: "Aprovação", active: ["Aprovado", "Contratado"].includes(ticket.status) },
    { label: "Alocação", active: ticket.status === "Contratado" }
  ], [ticket.status]);

  // Variantes de Animação Densas
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.1 } 
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  return (
    <section className="container mx-auto px-6 max-w-6xl py-12 text-left">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-slate-900/60 p-10 md:p-20 rounded-[100px] border border-cyan-500/20 backdrop-blur-3xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-16 opacity-[0.02] pointer-events-none">
          <Database size={400} className="text-cyan-500" />
        </div>

        {/* --- HEADER DO PORTAL DO CANDIDATO --- */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-20 gap-12 border-b border-white/5 pb-16 relative z-10">
          <div className="flex items-center gap-10">
            <motion.div whileHover={{ scale: 1.05 }} className="p-8 bg-cyan-500 rounded-[45px] text-slate-950 shadow-glow relative">
               <UserCircle size={56} />
               <div className="absolute -bottom-2 -right-2 bg-slate-950 p-2 rounded-full border border-cyan-500/50">
                  <ShieldCheck size={18} className="text-cyan-500" />
               </div>
            </motion.div>
            <div className="text-left space-y-2">
              <h2 className="text-5xl font-black uppercase italic text-white tracking-tighter leading-none">
                {ticket.name}
              </h2>
              <div className="flex flex-wrap gap-4 items-center">
                 <span className="text-cyan-500 text-[12px] font-black uppercase tracking-[0.6em] italic">
                   Protocolo: {ticket.id}
                 </span>
                 <span className="text-slate-500 text-[12px] font-black uppercase tracking-[0.4em] italic">
                   • Lion Rising Ecosystem
                 </span>
              </div>
            </div>
          </div>
          <div className="bg-slate-950 px-10 py-6 rounded-[35px] border border-white/5 shadow-inner group">
             <p className="text-[10px] uppercase text-slate-600 font-black tracking-widest mb-3 italic flex items-center gap-2">
               <Activity size={12} className="text-cyan-500"/> Status de Processo:
             </p>
             <p className="text-cyan-500 font-black uppercase italic text-2xl tracking-tighter flex items-center gap-3">
               {ticket.status} 
               <ArrowUpRight size={20} className="opacity-30 group-hover:opacity-100 transition-all" />
             </p>
          </div>
        </div>

        {/* --- TIMELINE DE EVOLUÇÃO --- */}
        <div className="mb-24 px-6 md:px-12 relative z-10">
          <div className="flex justify-between relative">
            <div className="absolute top-[28px] left-0 w-full h-[2px] bg-white/5 z-0" />
            {steps.map((s, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center gap-6 group">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-1000 border-2 ${s.active ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-glow scale-110' : 'bg-slate-950 border-white/5 text-slate-800'}`}>
                  {s.active ? <CheckCircle2 size={28} /> : <Clock size={28} />}
                </div>
                <p className={`text-[11px] font-black uppercase tracking-widest ${s.active ? 'text-white' : 'text-slate-700'}`}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* --- GRID DE DADOS TÉCNICOS E PSICOMÉTRICOS --- */}
        <div className="grid lg:grid-cols-3 gap-8 text-left relative z-10">
           
           <motion.div variants={cardVariants} className="bg-slate-950 p-10 rounded-[60px] border border-white/5 shadow-inner group hover:border-cyan-500/20 transition-all">
              <div className="flex justify-between items-start mb-8">
                <div className="p-4 bg-cyan-500/5 rounded-2xl text-cyan-500"><MapPin size={24}/></div>
                <Globe size={16} className="text-slate-800 animate-spin-slow" />
              </div>
              <p className="text-[10px] font-black text-slate-600 uppercase mb-3 tracking-[0.3em] italic">Base Regional:</p>
              <p className="text-white font-black text-lg uppercase italic leading-tight tracking-tighter">
                {ticket.region || "Em Análise"}
              </p>
              <p className="text-[10px] text-slate-700 mt-4 font-mono uppercase tracking-widest italic">
                {ticket.logradouro ? `${ticket.logradouro}, ${ticket.numero}` : "Aguardando Endereço"}
              </p>
           </motion.div>

           <motion.div variants={cardVariants} className="bg-slate-950 p-10 rounded-[60px] border border-white/5 shadow-inner group hover:border-purple-500/20 transition-all">
              <div className="flex justify-between items-start mb-8">
                <div className="p-4 bg-purple-500/5 rounded-2xl text-purple-500"><Award size={24}/></div>
                <TrendingUp size={16} className="text-slate-800" />
              </div>
              <p className="text-[10px] font-black text-slate-600 uppercase mb-3 tracking-[0.3em] italic">Vertical Técnica:</p>
              <p className="text-white font-black text-lg uppercase italic leading-tight tracking-tighter">
                {ticket.area} • {ticket.seniority}
              </p>
              <div className="mt-6 flex items-center gap-4">
                 <div className="flex-grow bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(Number(ticket.tech_level) || 1) * 20}%` }}
                      transition={{ duration: 2 }}
                      className="bg-purple-500 h-full rounded-full shadow-glow" 
                    />
                 </div>
                 <span className="text-purple-500 font-black text-xs font-mono">{ticket.tech_level}/5</span>
              </div>
           </motion.div>

           <motion.div variants={cardVariants} className="bg-slate-950 p-10 rounded-[60px] border border-white/5 shadow-inner group hover:border-orange-500/20 transition-all">
              <div className="flex justify-between items-start mb-8">
                <div className="p-4 bg-orange-500/5 rounded-2xl text-orange-500"><Target size={24}/></div>
                <Fingerprint size={16} className="text-slate-800" />
              </div>
              <p className="text-[10px] font-black text-slate-600 uppercase mb-3 tracking-[0.3em] italic">Análise Comportamental:</p>
              <p className="text-white font-black text-xl uppercase italic tracking-tighter">
                {ticket.behavioral_profile || "Auditando..."}
              </p>
              <div className="mt-5 p-3 bg-white/[0.02] rounded-xl border border-white/5">
                <p className="text-[9px] text-slate-500 italic leading-relaxed">Match validado para squads de alta pressão bancária.</p>
              </div>
           </motion.div>
        </div>

        {/* --- SEÇÃO ESPECIAL: ALOCAÇÃO ERP (CONTRATADO) --- */}
        <AnimatePresence>
          {ticket.status === 'Contratado' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-12 grid md:grid-cols-2 gap-8 relative z-10"
            >
              <div className="bg-gradient-to-br from-green-500/10 to-transparent p-12 rounded-[70px] border border-green-500/20 relative overflow-hidden shadow-glow">
                <div className="absolute -right-10 -top-10 opacity-5 text-green-500 rotate-12"><FileCheck size={200} /></div>
                <h4 className="text-[11px] font-black text-green-500 uppercase mb-8 tracking-[0.4em] italic flex items-center gap-4">
                  <Briefcase size={18}/> Alocação Lion Rising
                </h4>
                <div className="space-y-8 relative z-10">
                   <div className="border-l-2 border-green-500/30 pl-8">
                      <p className="text-[9px] uppercase text-slate-500 font-bold tracking-widest mb-1 italic">Cliente & Squad Ativa:</p>
                      <p className="text-white font-black text-xl uppercase italic tracking-tighter">
                        {ticket.client_assigned} <span className="text-slate-600 mx-2">/</span> {ticket.project_name}
                      </p>
                   </div>
                   <div className="flex gap-12 border-l-2 border-green-500/30 pl-8">
                      <div>
                        <p className="text-[9px] uppercase text-slate-500 font-bold tracking-widest mb-1 italic">Vigência Início:</p>
                        <p className="text-white font-black text-md italic font-mono">{ticket.contract_start}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase text-slate-500 font-bold tracking-widest mb-1 italic">Vigência Término:</p>
                        <p className="text-white font-black text-md italic font-mono">{ticket.contract_end || "INDETERMINADO"}</p>
                      </div>
                   </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-cyan-500/10 to-transparent p-12 rounded-[70px] border border-cyan-500/20 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 opacity-5 text-cyan-500 -rotate-12"><Wallet size={200} /></div>
                <h4 className="text-[11px] font-black text-cyan-500 uppercase mb-8 tracking-[0.4em] italic flex items-center gap-4">
                  <ShieldCheck size={18}/> Backoffice & Auditoria
                </h4>
                <div className="space-y-8 relative z-10">
                   <div className="border-l-2 border-cyan-500/30 pl-8">
                      <p className="text-[9px] uppercase text-slate-500 font-bold tracking-widest mb-1 italic">Faturamento Mensal:</p>
                      <p className="text-white font-black text-2xl uppercase italic tracking-tighter flex items-center gap-3">
                        R$ {ticket.monthly_value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                   </div>
                   <div className="flex gap-10 border-l-2 border-cyan-500/30 pl-8">
                      <div>
                        <p className="text-[9px] uppercase text-slate-500 font-bold tracking-widest mb-1 italic">Status de Repasse:</p>
                        <p className="text-cyan-500 font-black text-md italic flex items-center gap-3">
                          <CheckCircle2 size={20} className="text-green-500 animate-pulse"/> {ticket.payment_status || "AUDITADO"}
                        </p>
                      </div>
                      <div className="flex items-end">
                         <button className="flex items-center gap-2 text-[9px] font-black uppercase text-white bg-white/5 px-5 py-3 rounded-2xl border border-white/5 hover:bg-cyan-500 hover:text-slate-950 transition-all italic tracking-widest shadow-xl">
                            <Download size={14}/> Docs
                         </button>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- ÁREA DE COMUNICAÇÃO DIRETA --- */}
        <motion.div variants={cardVariants} className="mt-12 p-12 bg-white/5 border border-white/5 rounded-[60px] flex flex-col md:flex-row items-center gap-12 group relative overflow-hidden">
           <Zap className="text-cyan-500 animate-pulse shrink-0" size={48} />
           <div className="text-left relative z-10 flex-grow">
              <p className="text-[10px] text-white font-black uppercase italic tracking-[0.4em] mb-3 flex items-center gap-3">
                 <ShieldAlert size={14} className="text-cyan-500"/> Diretriz de Governança Lion Solution
              </p>
              <p className="text-sm text-slate-400 italic leading-loose font-light max-w-4xl">
                {ticket.status === 'Contratado' 
                  ? "Sua operação técnica está ativa e auditada. O acesso aos repositórios e squads do cliente está liberado via VPN corporativa. Mantenha seus logs de horas atualizados para o fechamento mensal no ERP." 
                  : ticket.status === 'Aprovado' 
                  ? "Parabéns! Seu perfil superou as métricas de elite da Lion Solution. O contrato de alocação está em fase de geração digital via DocuSign para sua assinatura e posterior ativação de squad." 
                  : "Seu protocolo discovery está em processamento de inteligência. Estamos cruzando sua matriz comportamental DISC e seu nível técnico com as squads de alta performance da Deskcorp e Banco da Amazônia."}
              </p>
           </div>
           <div className="shrink-0 flex gap-4">
              <button className="p-6 bg-slate-950 rounded-3xl border border-white/5 text-slate-500 hover:text-white transition-all shadow-2xl group/btn">
                 <Mail size={26} className="group-hover/btn:scale-110 transition-transform"/>
              </button>
              <button className="px-10 py-6 bg-cyan-500 text-slate-950 rounded-[28px] font-black uppercase text-[10px] tracking-[0.2em] shadow-glow hover:bg-white transition-all italic">
                 Abrir Chamado
              </button>
           </div>
        </motion.div>

        {/* Footer do Dashboard */}
        <div className="mt-16 pt-8 border-t border-white/5 flex justify-between items-center text-[8px] font-black uppercase text-slate-700 tracking-[0.5em] italic">
           <span>Auditado por B2Y Group Systems & Governance Belém/PA</span>
           <span className="flex items-center gap-2"><Lock size={10}/> Conexão Segura SSL v5.0</span>
        </div>
      </motion.div>
    </section>
  );
}