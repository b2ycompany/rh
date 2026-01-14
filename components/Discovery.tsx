"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Upload, MapPin, Linkedin, Globe, Users, ShieldCheck, FileText } from 'lucide-react';

export default function Discovery({ role, onSubmit }: any) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "", email: "", whatsapp: "", cep: "", cpf_cnpj: "",
    region: "", linkedinUrl: "", companySite: "", area: "", 
    customArea: "", seniority: "", quantity: 1, resumeName: ""
  });

  // Funções de Máscara (Melhores Práticas)
  const maskPhone = (v: string) => v.replace(/\D/g, "").replace(/^(\d{2})(\d)/g, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2").substring(0, 15);
  const maskCEP = (v: string) => v.replace(/\D/g, "").replace(/^(\d{5})(\d)/, "$1-$2").substring(0, 9);
  const maskCPFCNPJ = (v: string) => {
    const val = v.replace(/\D/g, "");
    if (val.length <= 11) return val.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4").substring(0, 14);
    return val.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5").substring(0, 18);
  };

  const handleNext = () => setStep(step + 1);

  return (
    <section className="container mx-auto px-6 max-w-3xl">
      <div className="bg-slate-900/50 p-10 rounded-[40px] border border-cyan-500/20 backdrop-blur-xl">
        <div className="mb-8 flex items-center gap-4 border-b border-white/5 pb-6">
          <BrainCircuit size={32} className="text-cyan-500" />
          <h2 className="text-xl font-bold uppercase tracking-tighter">Onboarding {role === 'client' ? 'Business' : 'Talent'}</h2>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div key="s1" className="space-y-4">
              <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nome completo" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl outline-none focus:border-cyan-500 text-white" />
              <div className="grid grid-cols-2 gap-4">
                <input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="E-mail profissional" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl outline-none focus:border-cyan-500 text-white" />
                <input value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: maskPhone(e.target.value)})} placeholder="WhatsApp (DDD)" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl outline-none focus:border-cyan-500 text-white font-mono" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input value={formData.cep} onChange={e => setFormData({...formData, cep: maskCEP(e.target.value)})} placeholder="CEP" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl outline-none focus:border-cyan-500 text-white font-mono" />
                <input value={formData.cpf_cnpj} onChange={e => setFormData({...formData, cpf_cnpj: maskCPFCNPJ(e.target.value)})} placeholder="CPF ou CNPJ" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl outline-none focus:border-cyan-500 text-white font-mono" />
              </div>
              <button onClick={handleNext} className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-cyan-500 transition-all mt-4">Continuar</button>
            </motion.div>
          ) : (
            <motion.div key="s2" className="space-y-6">
              <div className="grid grid-cols-2 gap-2">
                {["Desenvolvedor", "QA / Tester", "Gerente de Projetos", "Infraestrutura", "Outra"].map(a => (
                  <button key={a} onClick={() => setFormData({...formData, area: a})} className={`p-4 border rounded-xl text-[10px] font-bold transition-all ${formData.area === a ? 'bg-cyan-500 border-cyan-500 text-black' : 'bg-slate-950 border-white/10'}`}>{a}</button>
                ))}
              </div>

              {formData.area === 'Outra' && (
                <input value={formData.customArea} onChange={e => setFormData({...formData, customArea: e.target.value})} placeholder="Qual a vaga/especialidade?" className="w-full bg-slate-950 border border-cyan-500/50 p-5 rounded-2xl outline-none text-white text-xs" />
              )}

              {role === 'candidate' ? (
                <label className="cursor-pointer bg-white/5 border-2 border-dashed border-white/10 p-10 rounded-3xl flex flex-col items-center gap-2 hover:border-cyan-500 transition-all">
                  <Upload size={24} className="text-cyan-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {formData.resumeName ? `Arquivo: ${formData.resumeName}` : 'Anexar Currículo (PDF)'}
                  </span>
                  <input type="file" className="hidden" accept=".pdf" onChange={e => setFormData({...formData, resumeName: e.target.files?.[0]?.name || ""})} />
                </label>
              ) : (
                <div className="flex items-center gap-2 bg-slate-950 border border-white/10 p-5 rounded-2xl">
                  <Users size={18} className="text-cyan-500" />
                  <input type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} placeholder="Qtd. Profissionais" className="bg-transparent w-full outline-none text-white" />
                </div>
              )}

              <button onClick={() => onSubmit(formData)} className="w-full bg-cyan-500 text-black py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white transition-all">Finalizar Protocolo</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}