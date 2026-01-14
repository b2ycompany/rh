"use client";

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Ticket, 
  CheckCircle2, 
  Clock, 
  Wallet, 
  Calendar, 
  Briefcase, 
  ShieldCheck, 
  FileText,
  TrendingUp,
  Zap
} from 'lucide-react';
import { TicketData } from '@/app/page';

interface DashboardProps {
  ticket: TicketData;
}

export default function Dashboard({ ticket }: DashboardProps) {
  // Definição das etapas de evolução baseadas no papel (Candidato vs Cliente)
  const steps = ticket.role === 'client' 
    ? ["Discovery", "Hunting Ativo", "Shortlist VIP", "Entrevistas", "Contratação"]
    : ["Triagem IA", "QA Técnica", "Afinidade Cultural", "Validação Lion", "Hired"];

  // Lógica para determinar o progresso visual
  const getProgressWidth = () => {
    if (ticket.status === 'Contratado') return '100%';
    if (ticket.status === 'Entrevista') return '60%';
    return '20%'; // Default: Discovery/Triagem
  };

  return (
    <section className="container mx-auto px-6 space-y-8">
      {/* HEADER DO DASHBOARD */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-cyan-500/10 rounded-3xl border border-cyan-500/20">
            <Ticket size={32} className="text-cyan-500" />
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
              Meu <span className="text-cyan-500">Protocolo</span>
            </h2>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">
              ID: {ticket.id} • Criado em {ticket.date}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
            Status: {ticket.status}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* COLUNA ESQUERDA: RESUMO DO PERFIL/DEMANDA */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Zap size={120} />
            </div>
            <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-6 italic">Dados do Discovery</h4>
            <div className="space-y-6">
              <div>
                <p className="text-[9px] uppercase font-bold text-cyan-500/60 mb-1">Nome / Instituição</p>
                <p className="text-lg font-black uppercase italic text-white">{ticket.company || ticket.name}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold text-cyan-500/60 mb-1">Área de Atuação</p>
                <p className="text-sm font-bold text-slate-300 uppercase">{ticket.area}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold text-cyan-500/60 mb-1">Senioridade</p>
                <p className="text-sm font-bold text-slate-300 uppercase">{ticket.seniority}</p>
              </div>
            </div>
          </div>

          {/* INDICADORES DINÂMICOS */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-white/5 rounded-[30px] border border-white/5 text-center">
              <TrendingUp size={20} className="text-cyan-500 mx-auto mb-2" />
              <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Aderência</p>
              <p className="text-xl font-black text-white italic">94%</p>
            </div>
            <div className="p-6 bg-white/5 rounded-[30px] border border-white/5 text-center">
              <Clock size={20} className="text-purple-500 mx-auto mb-2" />
              <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest">SLA Restante</p>
              <p className="text-xl font-black text-white italic">48h</p>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: TIMELINE E MÓDULO ERP */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* TIMELINE DE EVOLUÇÃO */}
          <div className="bg-slate-900 p-10 rounded-[40px] border border-white/5 shadow-2xl">
            <h3 className="text-xl font-black uppercase italic mb-12 text-slate-400 tracking-widest flex items-center gap-3">
              <FileText size={18} className="text-cyan-500" /> Pipeline de Evolução
            </h3>
            
            <div className="relative">
              {/* Linha de fundo da progressão */}
              <div className="absolute top-5 left-0 w-full h-[2px] bg-white/5 hidden md:block" />
              <div 
                className="absolute top-5 left-0 h-[2px] bg-cyan-500 shadow-[0_0_15px_#06b6d4] transition-all duration-1000 hidden md:block" 
                style={{ width: getProgressWidth() }}
              />

              <div className="relative flex flex-col md:flex-row justify-between gap-10">
                {steps.map((step, idx) => {
                  const isCompleted = ticket.status === 'Contratado' || (ticket.status === 'Entrevista' && idx <= 2) || idx === 0;
                  return (
                    <div key={step} className="flex flex-col items-center group relative z-10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isCompleted ? 'bg-cyan-500 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'bg-slate-950 border-white/10'}`}>
                        {isCompleted ? <CheckCircle2 size={16} className="text-slate-950" /> : <span className="text-[10px] font-bold text-slate-700">{idx + 1}</span>}
                      </div>
                      <span className={`mt-4 text-[9px] font-black uppercase tracking-widest text-center max-w-[80px] leading-tight ${isCompleted ? 'text-white' : 'text-slate-600'}`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* MÓDULO ERP: VISÍVEL APENAS SE CONTRATADO */}
          <AnimatePresence>
            {ticket.status === 'Contratado' && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-cyan-500/5 border border-cyan-500/20 p-10 rounded-[40px] relative overflow-hidden"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="text-cyan-500" size={24} />
                      <h3 className="text-2xl font-black uppercase italic text-white">Contrato <span className="text-cyan-500">Ativo</span></h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                      <div className="flex items-center gap-4">
                        <Briefcase className="text-slate-500" size={20} />
                        <div>
                          <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Projeto Alocado</p>
                          <p className="text-xs font-bold text-white uppercase">{ticket.projectName || "Projeto Dedicado Tammy"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Wallet className="text-slate-500" size={20} />
                        <div>
                          <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Remuneração Mensal</p>
                          <p className="text-sm font-black text-cyan-500 italic">R$ {ticket.monthlyValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Calendar className="text-slate-500" size={20} />
                        <div>
                          <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Vigência do Contrato</p>
                          <p className="text-xs font-bold text-white uppercase">{ticket.contractStart} • {ticket.contractEnd || "Indeterminado"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <CheckCircle2 className="text-green-500" size={20} />
                        <div>
                          <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Status Pagamento</p>
                          <p className="text-[10px] font-black text-green-500 uppercase px-2 py-1 bg-green-500/10 rounded-lg inline-block mt-1">
                            {ticket.paymentStatus || "Em Processamento"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-950 p-6 rounded-3xl border border-white/5 text-center min-w-[150px]">
                    <p className="text-[8px] font-black uppercase text-slate-500 mb-2">Próximo Faturamento</p>
                    <p className="text-2xl font-black text-white italic tracking-tighter">05/FEV</p>
                    <button className="mt-4 text-[8px] font-black uppercase text-cyan-500 border border-cyan-500/30 px-4 py-2 rounded-xl hover:bg-cyan-500 hover:text-slate-950 transition-all">
                      Baixar Invoice
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MENSAGEM DE AGUARDANDO (SE NÃO CONTRATADO) */}
          {ticket.status !== 'Contratado' && (
            <div className="p-10 bg-white/5 rounded-[40px] border border-white/5 text-center italic">
              <p className="text-slate-500 text-sm font-light">
                O seu processo está sendo auditado pelo nosso PMO. <br />
                As informações de contrato e faturamento serão liberadas após a validação final da **Lion Solution & B2Y Group**.
              </p>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}