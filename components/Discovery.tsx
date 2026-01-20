"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Upload, MapPin, Search, CheckCircle2, ChevronRight } from 'lucide-react';

export default function Discovery({ role, onSubmit }: any) {
  const [step, setStep] = useState(0);
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", whatsapp: "", cep: "", cpf_cnpj: "",
    logradouro: "", bairro: "", cidade: "", uf: "", numero: "",
    linkedinUrl: "", companySite: "", company: "", area: "", 
    customArea: "", seniority: "", quantity: 1, resumeName: ""
  });

  // MÁSCARAS
  const maskPhone = (v: string) => v.replace(/\D/g, "").replace(/^(\d{2})(\d)/g, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2").substring(0, 15);
  const maskCEP = (v: string) => v.replace(/\D/g, "").replace(/^(\d{5})(\d)/, "$1-$2").substring(0, 9);
  const maskCPFCNPJ = (v: string) => {
    const val = v.replace(/\D/g, "");
    if (val.length <= 11) return val.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4").substring(0, 14);
    return val.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5").substring(0, 18);
  };

  // BUSCA CEP
  const handleCepSearch = async () => {
    const cep = formData.cep.replace(/\D/g, "");
    if (cep.length !== 8) return;
    
    setIsCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setFormData({
          ...formData,
          logradouro: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          uf: data.uf
        });
      }
    } finally {
      setIsCepLoading(false);
    }
  };

  return (
    <section className="container mx-auto px-6 max-w-3xl text-left">
      <div className="bg-slate-900/50 p-12 rounded-[60px] border border-cyan-500/20 backdrop-blur-3xl shadow-2xl">
        <div className="mb-10 flex items-center gap-6 border-b border-white/5 pb-8">
          <BrainCircuit size={32} className="text-cyan-500" />
          <h2 className="text-2xl font-black uppercase italic text-white italic">Protocolo <span className="text-cyan-500">Discovery</span></h2>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div key="s1" className="space-y-4">
              <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nome completo" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl outline-none text-white text-sm" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="E-mail profissional" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl outline-none text-white text-sm" />
                <input value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: maskPhone(e.target.value)})} placeholder="WhatsApp (DDD)" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl outline-none text-white text-sm font-mono" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input value={formData.cep} onChange={e => setFormData({...formData, cep: maskCEP(e.target.value)})} onBlur={handleCepSearch} placeholder="CEP" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl outline-none text-white text-sm font-mono" />
                  <button onClick={handleCepSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-500">{isCepLoading ? "..." : <Search size={18}/>}</button>
                </div>
                <input value={formData.cpf_cnpj} onChange={e => setFormData({...formData, cpf_cnpj: maskCPFCNPJ(e.target.value)})} placeholder="CPF ou CNPJ" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl outline-none text-white text-sm font-mono" />
              </div>

              {/* CAMPOS DE ENDEREÇO QUE APARECEM APÓS O CEP */}
              {formData.cidade && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input value={formData.logradouro} readOnly className="md:col-span-2 w-full bg-slate-900/50 border border-white/5 p-5 rounded-2xl text-slate-400 text-xs" placeholder="Rua" />
                    <input value={formData.numero} onChange={e => setFormData({...formData, numero: e.target.value})} placeholder="Nº" className="w-full bg-slate-950 border border-cyan-500/50 p-5 rounded-2xl text-white text-xs outline-none focus:border-cyan-500" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input value={formData.bairro} readOnly className="w-full bg-slate-900/50 border border-white/5 p-5 rounded-2xl text-slate-400 text-xs" placeholder="Bairro" />
                    <input value={formData.cidade} readOnly className="w-full bg-slate-900/50 border border-white/5 p-5 rounded-2xl text-slate-400 text-xs" placeholder="Cidade" />
                    <input value={formData.uf} readOnly className="w-full bg-slate-900/50 border border-white/5 p-5 rounded-2xl text-slate-400 text-xs text-center" placeholder="UF" />
                  </div>
                </motion.div>
              )}

              <button onClick={() => setStep(1)} className="w-full bg-white text-slate-950 py-6 rounded-3xl font-black uppercase text-xs tracking-[0.4em] hover:bg-cyan-500 transition-all mt-6 shadow-xl">Continuar</button>
            </motion.div>
          ) : (
            <motion.div key="s2" className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {["Desenvolvedor", "QA / Tester", "Gerente de Projetos", "Infraestrutura", "Outra"].map(a => (
                  <button key={a} onClick={() => setFormData({...formData, area: a})} className={`p-4 border rounded-2xl text-[10px] font-black uppercase transition-all ${formData.area === a ? 'bg-cyan-500 border-cyan-500 text-slate-950' : 'bg-slate-950 border-white/10 text-slate-500'}`}>{a}</button>
                ))}
              </div>

              {role === 'candidate' ? (
                <label className="cursor-pointer bg-cyan-500/5 border-2 border-dashed border-cyan-500/20 p-12 rounded-[40px] flex flex-col items-center gap-4 hover:border-cyan-500 transition-all group">
                  <div className="p-4 bg-cyan-500/10 rounded-full text-cyan-500">
                     {formData.resumeName ? <CheckCircle2 size={32} className="text-green-500" /> : <Upload size={32} />}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {formData.resumeName ? `Arquivo: ${formData.resumeName}` : 'Anexar Currículo (PDF)'}
                  </span>
                  <input type="file" className="hidden" accept=".pdf" onChange={e => setFormData({...formData, resumeName: e.target.files?.[0]?.name || ""})} />
                </label>
              ) : (
                <div className="space-y-4">
                  <input value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} placeholder="Nome da Empresa / Instituição" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-white text-sm outline-none" />
                  <div className="flex items-center gap-4 bg-slate-950 border border-white/10 p-5 rounded-2xl">
                    <input type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} placeholder="Quantidade de Profissionais" className="bg-transparent w-full outline-none text-white text-sm" />
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-6">
                <button onClick={() => setStep(0)} className="w-1/4 text-slate-600 uppercase font-black text-[10px]">Voltar</button>
                <button onClick={() => onSubmit(formData)} className="w-3/4 bg-cyan-500 text-slate-950 py-7 rounded-[35px] font-black uppercase text-xs tracking-[0.4em] shadow-2xl italic">Finalizar Protocolo</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}