"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Ticket, CheckCircle2, Clock, Wallet, Calendar, 
  Briefcase, ShieldCheck, FileText, TrendingUp, Zap 
} from 'lucide-react';
import { TicketData } from '@/app/page';

export default function Dashboard({ ticket }: { ticket: TicketData }) {
  const steps = ["Discovery", "Hunting", "Shortlist", "Entrevista", "Contratado"];
  
  const getProgressWidth = () => {
    if (ticket.status === 'Contratado') return '100%';
    if (ticket.status === 'Entrevista') return '75%';
    if (ticket.status === 'Shortlist') return '50%';
    return '20%';
  };

  return (
    <section className="container mx-auto px-6 space-y-12">
      {/* HEADER PREMIUM */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="p-5 bg-cyan-500/10 rounded-[28px] border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
            <Ticket size={36} className="text-cyan-500" />
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
              Meu <span className="text-cyan-500 font-black">Protocolo</span>
            </h2>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">
              ID: {ticket.id} • {ticket.date}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-white/5 px-8 py-4 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
            Status: {ticket.status}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* COLUNA: RESUMO IA */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-10 rounded-[50px] border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Zap size={140} className="text-cyan-500" />
            </div>
            <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-8 italic">Dados do Discovery</h4>
            <div className="space-y-8">
              <div>
                <p className="text-[9px] uppercase font-bold text-cyan-500/60 mb-2">Entidade</p>
                <p className="text-xl font-black uppercase italic text-white leading-none">{ticket.company || ticket.name}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold text-cyan-500/60 mb-2">Especialidade / Região</p>
                <p className="text-sm font-bold text-slate-300 uppercase italic">{ticket.area} • {ticket.region || "Belém"}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold text-cyan-500/60 mb-2">Responsável</p>
                <p className="text-sm font-bold text-slate-300 uppercase">{ticket.name}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-8 bg-white/5 rounded-[40px] border border-white/5 text-center hover:border-cyan-500/20 transition-all">
              <TrendingUp size={24} className="text-cyan-500 mx-auto mb-3" />
              <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Match IA</p>
              <p className="text-2xl font-black text-white italic tracking-tighter">97%</p>
            </div>
            <div className="p-8 bg-white/5 rounded-[40px] border border-white/5 text-center hover:border-purple-500/20 transition-all">
              <Clock size={24} className="text-purple-500 mx-auto mb-3" />
              <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest">SLA Atendimento</p>
              <p className="text-2xl font-black text-white italic tracking-tighter">48h</p>
            </div>
          </div>
        </div>

        {/* COLUNA: PIPELINE E ERP */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* PIPELINE VISUAL */}
          <div className="bg-slate-900 p-12 rounded-[50px] border border-white/5 shadow-2xl">
            <h3 className="text-xl font-black uppercase italic mb-12 text-slate-400 tracking-widest flex items-center gap-3">
              <FileText size={20} className="text-cyan-500" /> Pipeline de Evolução
            </h3>
            
            <div className="relative pt-4 pb-8">
              <div className="absolute top-9 left-0 w-full h-[2px] bg-white/5 hidden md:block" />
              <div 
                className="absolute top-9 left-0 h-[2px] bg-cyan-500 shadow-[0_0_20px_#06b6d4] transition-all duration-1000 hidden md:block" 
                style={{ width: getProgressWidth() }}
              />

              <div className="relative flex flex-col md:flex-row justify-between gap-12">
                {steps.map((step, idx) => {
                  const isCompleted = ticket.status === 'Contratado' || (ticket.status === step) || (idx === 0);
                  return (
                    <div key={step} className="flex flex-col items-center group relative z-10">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-700 ${isCompleted ? 'bg-cyan-500 border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.5)] scale-110' : 'bg-slate-950 border-white/10'}`}>
                        {isCompleted ? <CheckCircle2 size={20} className="text-slate-950" /> : <span className="text-[10px] font-bold text-slate-700">{idx + 1}</span>}
                      </div>
                      <span className={`mt-5 text-[9px] font-black uppercase tracking-[0.2em] text-center max-w-[80px] leading-tight ${isCompleted ? 'text-white' : 'text-slate-600'}`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* MÓDULO ERP DE CONTRATO */}
          <AnimatePresence>
            {ticket.status === 'Contratado' && (
              <motion.div 
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                className="bg-cyan-500/5 border border-cyan-500/20 p-12 rounded-[50px] relative overflow-hidden"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
                  <div className="space-y-8 flex-grow">
                    <div className="flex items-center gap-4">
                      <ShieldCheck className="text-cyan-500 shadow-glow" size={32} />
                      <h3 className="text-3xl font-black uppercase italic text-white tracking-tighter">Contrato <span className="text-cyan-500">Ativado</span></h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="flex items-center gap-5">
                        <div className="p-3 bg-white/5 rounded-2xl"><Briefcase className="text-slate-400" size={24} /></div>
                        <div>
                          <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-1">Projeto Alocado</p>
                          <p className="text-sm font-black text-white uppercase italic">{ticket.project_name || "Alocação Direta Lion"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-5">
                        <div className="p-3 bg-white/5 rounded-2xl"><Wallet className="text-slate-400" size={24} /></div>
                        <div>
                          <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-1">Valor Mensal (R$)</p>
                          <p className="text-lg font-black text-cyan-500 italic">R$ {ticket.monthly_value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-5">
                        <div className="p-3 bg-white/5 rounded-2xl"><Calendar className="text-slate-400" size={24} /></div>
                        <div>
                          <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-1">Vigência Ativa</p>
                          <p className="text-sm font-bold text-white uppercase">{ticket.contract_start} » {ticket.contract_end || "Indeterminado"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-5">
                        <div className="p-3 bg-white/5 rounded-2xl"><CheckCircle2 className="text-green-500" size={24} /></div>
                        <div>
                          <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-1">Status de Pagamento</p>
                          <p className="text-[10px] font-black text-green-500 uppercase px-3 py-1 bg-green-500/10 rounded-lg inline-block">{ticket.payment_status || "Em Processamento"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-950 p-10 rounded-[40px] border border-white/10 text-center min-w-[220px] shadow-2xl relative z-10">
                    <p className="text-[10px] font-black uppercase text-slate-500 mb-4 tracking-widest">Próxima Fatura</p>
                    <p className="text-4xl font-black text-white italic tracking-tighter mb-6">05/FEV</p>
                    <button className="w-full text-[10px] font-black uppercase text-cyan-500 border border-cyan-500/30 px-6 py-4 rounded-2xl hover:bg-cyan-500 hover:text-slate-950 transition-all duration-500 tracking-[0.2em]">
                      Baixar Invoice
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MENSAGEM DE AUDITORIA */}
          {ticket.status !== 'Contratado' && (
            <div className="p-12 bg-white/5 rounded-[50px] border border-white/5 text-center italic relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-30" />
               <p className="text-slate-500 text-sm font-light relative z-10 leading-relaxed">
                Os dados deste protocolo estão sob auditoria TAMMY RH | HUNTING. <br />
                As informações financeiras e contratuais serão liberadas automaticamente após a validação do RH.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}