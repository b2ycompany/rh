"use client";

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, Clock, ShieldCheck, MapPin, Briefcase, Star, Cpu, UserCircle, Search, Zap, 
  Database, Wallet, Calendar, FileCheck, ShieldAlert, ArrowUpRight, TrendingUp, Activity, Award, Globe, Lock, FileText, Download, Target, Fingerprint, Mail, RefreshCw, Layers, Heart, Glasses, Users2, Baby
} from 'lucide-react';
import { TicketData } from '@/app/page';

export default function Dashboard({ ticket }: { ticket: TicketData }) {
  const steps = useMemo(() => [
    { label: "Discovery", active: ["Discovery", "Shortlist", "Aprovado", "Contratado"].includes(ticket.status) },
    { label: "Matching", active: ["Shortlist", "Aprovado", "Contratado"].includes(ticket.status) },
    { label: "Aprovação", active: ["Aprovado", "Contratado"].includes(ticket.status) },
    { label: "Alocação", active: ticket.status === "Contratado" }
  ], [ticket.status]);

  return (
    <section className="container mx-auto px-6 max-w-6xl py-12 text-left">
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/60 p-10 md:p-20 rounded-[100px] border border-cyan-500/20 backdrop-blur-3xl shadow-2xl relative overflow-hidden text-left">
        
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-20 gap-12 border-b border-white/5 pb-16 relative z-10 text-left">
          <div className="flex items-center gap-10 text-left">
            <div className="p-8 bg-cyan-500 rounded-[45px] text-slate-950 shadow-glow relative text-left">
               <UserCircle size={56} /><div className="absolute -bottom-2 -right-2 bg-slate-950 p-2 rounded-full border border-cyan-500/50"><ShieldCheck size={18} className="text-cyan-500" /></div>
            </div>
            <div className="text-left space-y-2 text-left">
              <h2 className="text-5xl font-black uppercase italic text-white tracking-tighter leading-none text-left">{ticket.name}</h2>
              <div className="flex flex-wrap gap-4 items-center text-left"><span className="text-cyan-500 text-[12px] font-black uppercase tracking-[0.6em] italic text-left">Protocolo: {ticket.id}</span></div>
            </div>
          </div>
          <div className="bg-slate-950 px-10 py-6 rounded-[35px] border border-white/5 text-left"><p className="text-cyan-500 font-black uppercase italic text-2xl tracking-tighter flex items-center gap-3 text-left">{ticket.status} <ArrowUpRight size={20}/></p></div>
        </div>

        <div className="mb-24 px-6 md:px-12 relative z-10 text-left">
          <div className="flex justify-between relative text-left">
            <div className="absolute top-[28px] left-0 w-full h-[2px] bg-white/5 z-0" />
            {steps.map((s, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center gap-6 text-left">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-1000 ${s.active ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-glow' : 'bg-slate-950 border-white/5 text-slate-800'}`}>{s.active ? <CheckCircle2 size={28} /> : <Clock size={28} />}</div>
                <p className={`text-[11px] font-black uppercase tracking-widest ${s.active ? 'text-white' : 'text-slate-700'}`}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10 mb-12 relative z-10 text-left">
           {/* DOSSIÊ RH AUDITADO */}
           <div className="bg-slate-950/50 p-10 rounded-[60px] border border-white/5 shadow-inner text-left">
              <p className="text-[10px] font-black text-cyan-500 uppercase mb-8 tracking-[0.3em] italic flex items-center gap-3 text-left"><Users2 size={18}/> Dossiê Auditado</p>
              <div className="space-y-4 text-left">
                 <div className="flex justify-between text-[11px] text-slate-500 uppercase font-black text-left"><span>Estado Civil:</span> <span className="text-white italic text-left">{ticket.marital_status}</span></div>
                 <div className="flex justify-between text-[11px] text-slate-500 uppercase font-black text-left"><span>Dependentes:</span> <span className="text-white italic text-left">{ticket.has_children === "Sim" ? ticket.num_children : "Nenhum"}</span></div>
                 <div className="flex justify-between text-[11px] text-slate-500 uppercase font-black text-left"><span>Hobby:</span> <span className="text-white italic text-left">{ticket.hobbies || "Nenhum"}</span></div>
              </div>
           </div>

           <div className="bg-slate-950/50 p-10 rounded-[60px] border border-white/5 shadow-inner text-left">
              <p className="text-[10px] font-black text-purple-500 uppercase mb-8 tracking-[0.3em] italic flex items-center gap-3 text-left"><Glasses size={18}/> Perfil OCEAN</p>
              <div className="space-y-6 text-left">
                 {[{k: 'ocean_openness', l: 'Abertura'}, {k: 'ocean_conscientiousness', l: 'Foco'}].map(o => (
                    <div key={o.k} className="space-y-2 text-left">
                       <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500 text-left"><span>{o.l}</span><span>{(ticket as any)[o.k] || 5}/10</span></div>
                       <div className="h-1 bg-white/5 rounded-full overflow-hidden text-left"><motion.div initial={{ width: 0 }} animate={{ width: `${((ticket as any)[o.k] || 5) * 10}%` }} className="bg-purple-500 h-full shadow-glow" /></div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="bg-slate-950/50 p-10 rounded-[60px] border border-white/5 shadow-inner text-left">
              <p className="text-[10px] font-black text-cyan-500 uppercase mb-8 tracking-[0.3em] italic flex items-center gap-3 text-left"><Target size={18}/> Match DISC</p>
              <p className="text-white font-black text-2xl uppercase italic tracking-tighter mb-4 text-left">{ticket.behavioral_profile || "EM AUDITORIA"}</p>
              <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 text-left"><p className="text-[10px] text-slate-500 italic leading-relaxed text-left">Validação estratégica para projetos de elite.</p></div>
           </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex justify-between items-center text-[8px] font-black uppercase text-slate-700 tracking-[0.5em] italic text-left"><span>Lion Solution & B2Y Group Systems</span><span className="flex items-center gap-2"><Lock size={10}/> SSL v7.0</span></div>
      </motion.div>
    </section>
  );
}