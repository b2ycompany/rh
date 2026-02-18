"use client";

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, Clock, ShieldCheck, MapPin, Briefcase, Star, Cpu, UserCircle, Search, Zap, Database, Wallet, Calendar, FileCheck, ShieldAlert, ArrowUpRight, TrendingUp, Activity, Award, Globe, Lock, FileText, Download, Target, Fingerprint, Mail, RefreshCw, Layers, Heart, Glasses
} from 'lucide-react';
import { TicketData } from '@/app/page';

export default function Dashboard({ ticket }: { ticket: TicketData }) {
  const steps = useMemo(() => [
    { label: "Discovery", active: ["Discovery", "Shortlist", "Aprovado", "Contratado"].includes(ticket.status) },
    { label: "Matching", active: ["Shortlist", "Aprovado", "Contratado"].includes(ticket.status) },
    { label: "Aprovação", active: ["Aprovado", "Contratado"].includes(ticket.status) },
    { label: "Alocação", active: ticket.status === "Contratado" }
  ], [ticket.status]);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.1 } }
  };

  return (
    <section className="container mx-auto px-6 max-w-6xl py-12 text-left">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="bg-slate-900/60 p-10 md:p-20 rounded-[100px] border border-cyan-500/20 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
        
        {/* HEADER */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-20 gap-12 border-b border-white/5 pb-16 relative z-10">
          <div className="flex items-center gap-10">
            <motion.div whileHover={{ scale: 1.05 }} className="p-8 bg-cyan-500 rounded-[45px] text-slate-950 shadow-glow relative">
               <UserCircle size={56} />
               <div className="absolute -bottom-2 -right-2 bg-slate-950 p-2 rounded-full border border-cyan-500/50"><ShieldCheck size={18} className="text-cyan-500" /></div>
            </motion.div>
            <div className="text-left space-y-2">
              <h2 className="text-5xl font-black uppercase italic text-white tracking-tighter leading-none">{ticket.name}</h2>
              <div className="flex flex-wrap gap-4 items-center"><span className="text-cyan-500 text-[12px] font-black uppercase tracking-[0.6em] italic">ID: {ticket.id}</span><span className="text-slate-500 text-[12px] font-black uppercase tracking-[0.4em] italic">• Lion Rising Digital</span></div>
            </div>
          </div>
          <div className="bg-slate-950 px-10 py-6 rounded-[35px] border border-white/5 shadow-inner group"><p className="text-[10px] uppercase text-slate-600 font-black tracking-widest mb-3 italic flex items-center gap-2"><Activity size={12} className="text-cyan-500"/> Status:</p><p className="text-cyan-500 font-black uppercase italic text-2xl tracking-tighter flex items-center gap-3">{ticket.status} <ArrowUpRight size={20} className="opacity-30 group-hover:opacity-100 transition-all" /></p></div>
        </div>

        {/* TIMELINE */}
        <div className="mb-24 px-6 md:px-12 relative z-10">
          <div className="flex justify-between relative">
            <div className="absolute top-[28px] left-0 w-full h-[2px] bg-white/5 z-0" />
            {steps.map((s, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center gap-6 group">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-1000 border-2 ${s.active ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-glow scale-110' : 'bg-slate-950 border-white/5 text-slate-800'}`}>{s.active ? <CheckCircle2 size={28} /> : <Clock size={28} />}</div>
                <p className={`text-[11px] font-black uppercase tracking-widest ${s.active ? 'text-white' : 'text-slate-700'}`}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* PSICOMETRIA VISUAL (OCEAN) */}
        <div className="grid lg:grid-cols-2 gap-10 mb-12 text-left relative z-10">
           <div className="bg-slate-950/50 p-10 rounded-[60px] border border-white/5 shadow-inner group hover:border-purple-500/20 transition-all">
              <p className="text-[10px] font-black text-purple-500 uppercase mb-8 tracking-[0.3em] italic flex items-center gap-3"><Glasses size={18}/> Perfil OCEAN Auditado</p>
              <div className="space-y-6">
                 {[{k: 'ocean_openness', l: 'Abertura'}, {k: 'ocean_conscientiousness', l: 'Foco'}, {k: 'ocean_extraversion', l: 'Social'}].map(o => (
                    <div key={o.k} className="space-y-2">
                       <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500"><span>{o.l}</span><span>{(ticket as any)[o.k] || 5}/10</span></div>
                       <div className="h-1 bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${((ticket as any)[o.k] || 5) * 10}%` }} transition={{ duration: 2 }} className="bg-purple-500 h-full rounded-full shadow-glow" /></div>
                    </div>
                 ))}
              </div>
           </div>
           <div className="bg-slate-950/50 p-10 rounded-[60px] border border-white/5 shadow-inner group hover:border-cyan-500/20 transition-all">
              <p className="text-[10px] font-black text-cyan-500 uppercase mb-8 tracking-[0.3em] italic flex items-center gap-3"><Target size={18}/> Match Comportamental DISC</p>
              <p className="text-white font-black text-2xl uppercase italic tracking-tighter mb-4">{ticket.behavioral_profile || "EM AUDITORIA"}</p>
              <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5"><p className="text-[10px] text-slate-500 italic leading-relaxed">Perfil validado para squads de alta pressão e entregas ágeis Lion Rising.</p></div>
           </div>
        </div>

        <motion.div className="mt-12 p-12 bg-white/5 border border-white/5 rounded-[60px] flex flex-col md:flex-row items-center gap-12 group relative overflow-hidden">
           <Zap className="text-cyan-500 animate-pulse shrink-0 shadow-glow" size={48} />
           <div className="text-left relative z-10 flex-grow">
              <p className="text-[10px] text-white font-black uppercase italic tracking-[0.4em] mb-3 flex items-center gap-3"><ShieldAlert size={14} className="text-cyan-500"/> Diretriz Lion Solution</p>
              <p className="text-sm text-slate-400 italic leading-loose font-light max-w-4xl">{ticket.status === 'Contratado' ? "Sua operação técnica está ativa e auditada. Mantenha seus registros de horas atualizados para faturamento." : "Seu protocolo discovery está em processamento de inteligência psicométrica."}</p>
           </div>
           <div className="shrink-0 flex gap-4"><button className="p-6 bg-slate-950 rounded-3xl border border-white/5 text-slate-500 hover:text-white transition-all shadow-2xl group/btn"><Mail size={26} className="group-hover/btn:scale-110 transition-transform"/></button><button className="px-10 py-6 bg-cyan-500 text-slate-950 rounded-[28px] font-black uppercase text-[10px] shadow-glow hover:bg-white transition-all italic">Suporte VIP</button></div>
        </motion.div>

        <div className="mt-16 pt-8 border-t border-white/5 flex justify-between items-center text-[8px] font-black uppercase text-slate-700 tracking-[0.5em] italic"><span>Auditado por B2Y Group Systems & Governance Belém/PA</span><span className="flex items-center gap-2"><Lock size={10}/> Conexão Segura SSL v5.0</span></div>
      </motion.div>
    </section>
  );
}