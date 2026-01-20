"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, Upload, MapPin, Linkedin, Globe, 
  Users, ShieldCheck, FileText, CheckCircle2, ChevronRight, 
  DollarSign, Briefcase 
} from 'lucide-react';

export default function Discovery({ role, initialData, onSubmit }: any) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "", email: "", whatsapp: "", cep: "", cpf_cnpj: "",
    region: "", linkedinUrl: "", companySite: "", area: initialData?.area || "", 
    customArea: "", seniority: initialData?.seniority || "", quantity: 1, resumeName: ""
  });

  const maskPhone = (v: string) => v.replace(/\D/g, "").replace(/^(\d{2})(\d)/g, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2").substring(0, 15);
  const maskCEP = (v: string) => v.replace(/\D/g, "").replace(/^(\d{5})(\d)/, "$1-$2").substring(0, 9);
  const maskCPFCNPJ = (v: string) => {
    const val = v.replace(/\D/g, "");
    if (val.length <= 11) return val.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4").substring(0, 14);
    return val.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5").substring(0, 18);
  };

  const areas = ["Desenvolvedor", "QA / Tester", "Gerente de Projetos", "Infraestrutura", "Arquiteto", "Outra"];

  return (
    <section className="container mx-auto px-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/50 p-12 rounded-[60px] border border-cyan-500/20 backdrop-blur-3xl shadow-[0_0_100px_rgba(6,182,212,0.1)]">
        
        {/* PROGRESS HEADER */}
        <div className="mb-12 flex justify-between items-center border-b border-white/5 pb-8">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-cyan-500/20 rounded-3xl text-cyan-400">
               <BrainCircuit size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase italic text-white tracking-tighter">
                {role === 'client' ? 'Escritório de ' : 'Protocolo '} 
                <span className="text-cyan-500">{role === 'client' ? 'Cotação' : 'Discovery'}</span>
              </h2>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Etapa {step + 1} de 2 • Governança Lion Solution
              </p>
            </div>
          </div>
          <div className="hidden md:flex gap-2">
            <div className={`w-3 h-3 rounded-full ${step === 0 ? 'bg-cyan-500' : 'bg-white/10'}`} />
            <div className={`w-3 h-3 rounded-full ${step === 1 ? 'bg-cyan-500' : 'bg-white/10'}`} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div key="s1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5 text-left">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-600 ml-4">Dados de Identificação</label>
                <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder={role === 'client' ? "Nome do Solicitante / Gestor" : "Nome completo"} className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl outline-none focus:border-cyan-500 text-white text-sm" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-600 ml-4">E-mail</label>
                  <input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="exemplo@empresa.com.br" className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl outline-none focus:border-cyan-500 text-white text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-600 ml-4">WhatsApp</label>
                  <input value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: maskPhone(e.target.value)})} placeholder="(00) 00000-0000" className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl outline-none focus:border-cyan-500 text-white text-sm font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-600 ml-4">CEP</label>
                  <input value={formData.cep} onChange={e => setFormData({...formData, cep: maskCEP(e.target.value)})} placeholder="00000-000" className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl outline-none focus:border-cyan-500 text-white text-sm font-mono" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-600 ml-4">{role === 'client' ? 'CNPJ Institucional' : 'CPF Individual'}</label>
                  <input value={formData.cpf_cnpj} onChange={e => setFormData({...formData, cpf_cnpj: maskCPFCNPJ(e.target.value)})} placeholder="00.000.000/0000-00" className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl outline-none focus:border-cyan-500 text-white text-sm font-mono" />
                </div>
              </div>

              <button onClick={() => setStep(1)} className="w-full bg-white text-slate-950 py-6 rounded-[35px] font-black uppercase text-xs tracking-[0.4em] hover:bg-cyan-500 transition-all duration-500 mt-6 shadow-xl flex items-center justify-center gap-2 group">
                Próximo Passo <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ) : (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 text-left">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-600 ml-4 italic">{role === 'client' ? 'Especificação da Demanda B2B' : 'Especificação Técnica'}</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {areas.map(a => (
                    <button key={a} onClick={() => setFormData({...formData, area: a})} className={`p-5 border rounded-[30px] text-[10px] font-black uppercase transition-all duration-500 ${formData.area === a ? 'bg-cyan-500 border-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] scale-105' : 'bg-slate-950 border-white/10 hover:border-cyan-500/50 text-slate-400'}`}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {formData.area === 'Outra' && (
                <div className="animate-in fade-in slide-in-from-top-4">
                  <input value={formData.customArea} onChange={e => setFormData({...formData, customArea: e.target.value})} placeholder="Qual o escopo ou especialidade?" className="w-full bg-slate-950 border border-cyan-500/30 p-6 rounded-3xl outline-none text-white text-sm italic" />
                </div>
              )}

              {role === 'candidate' ? (
                <div className="space-y-5">
                   <div className="flex items-center gap-4 bg-slate-950 border border-white/10 p-6 rounded-3xl">
                    <Linkedin size={20} className="text-cyan-500" />
                    <input value={formData.linkedinUrl} onChange={e => setFormData({...formData, linkedinUrl: e.target.value})} placeholder="URL do seu LinkedIn" className="bg-transparent w-full outline-none text-white text-sm" />
                  </div>
                  <label className="cursor-pointer bg-cyan-500/5 border-2 border-dashed border-cyan-500/20 p-12 rounded-[50px] flex flex-col items-center gap-4 hover:border-cyan-500 transition-all group">
                    <div className="p-4 bg-cyan-500/10 rounded-full text-cyan-500 group-hover:rotate-12 transition-transform">
                       {formData.resumeName ? <CheckCircle2 size={32} className="text-green-500" /> : <Upload size={32} />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {formData.resumeName ? `Arquivo: ${formData.resumeName}` : 'Anexar Currículo (PDF)'}
                    </span>
                    <input type="file" className="hidden" accept=".pdf" onChange={e => setFormData({...formData, resumeName: e.target.files?.[0]?.name || ""})} />
                  </label>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex items-center gap-4 bg-slate-950 border border-white/10 p-6 rounded-3xl">
                    <Users size={20} className="text-cyan-500" />
                    <input type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} placeholder="Quantidade de Profissionais / Squads" className="bg-transparent w-full outline-none text-white text-sm" />
                  </div>
                  <div className="flex items-center gap-4 bg-slate-950 border border-white/10 p-6 rounded-3xl">
                    <Globe size={20} className="text-cyan-500" />
                    <input value={formData.companySite} onChange={e => setFormData({...formData, companySite: e.target.value})} placeholder="Site da Empresa ou Instituição" className="bg-transparent w-full outline-none text-white text-sm" />
                  </div>
                  <div className="p-6 bg-cyan-500/10 rounded-3xl border border-cyan-500/20 flex gap-4 items-center">
                    <DollarSign size={24} className="text-cyan-500 shrink-0" />
                    <p className="text-[10px] text-slate-300 font-bold uppercase italic leading-tight">Ao finalizar, nossa equipe comercial preparará uma proposta técnica baseada no budget e escopo informado.</p>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-6">
                <button onClick={() => setStep(0)} className="w-1/4 text-slate-600 uppercase font-black text-[10px] tracking-widest hover:text-white transition-colors">Voltar</button>
                <button onClick={() => onSubmit(formData)} className="w-3/4 bg-cyan-500 text-slate-950 py-7 rounded-[35px] font-black uppercase text-xs tracking-[0.4em] hover:bg-white transition-all duration-500 shadow-2xl shadow-cyan-500/20 italic">
                  {role === 'client' ? 'Solicitar Cotação' : 'Finalizar Scan'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}