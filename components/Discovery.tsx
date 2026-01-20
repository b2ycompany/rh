"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, Upload, MapPin, Linkedin, Globe, 
  Users, ShieldCheck, FileText, CheckCircle2, Search, 
  ChevronRight, ArrowLeft, PlusCircle 
} from 'lucide-react';

interface DiscoveryProps {
  role: 'candidate' | 'client' | null;
  initialData?: {
    area?: string;
    seniority?: string;
  };
  onSubmit: (data: any) => void;
}

export default function Discovery({ role, initialData, onSubmit }: DiscoveryProps) {
  const [step, setStep] = useState(0);
  const [isCepLoading, setIsCepLoading] = useState(false);
  
  // Estado completo do formulário com todos os campos de Lead e Endereço
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    cep: "",
    cpf_cnpj: "",
    logradouro: "",
    bairro: "",
    cidade: "",
    uf: "",
    numero: "",
    region: "", // Campo que alimenta "Especialidade / Região" no Dashboard
    linkedinUrl: "",
    companySite: "",
    company: "",
    area: initialData?.area || "",
    customArea: "",
    seniority: initialData?.seniority || "",
    quantity: 1,
    resumeName: ""
  });

  // --- SISTEMA DE MÁSCARAS ---
  const maskPhone = (v: string) => {
    return v.replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .substring(0, 15);
  };

  const maskCEP = (v: string) => {
    return v.replace(/\D/g, "")
      .replace(/^(\d{5})(\d)/, "$1-$2")
      .substring(0, 9);
  };

  const maskCPFCNPJ = (v: string) => {
    const val = v.replace(/\D/g, "");
    if (val.length <= 11) {
      return val.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4").substring(0, 14);
    }
    return val.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5").substring(0, 18);
  };

  // --- LÓGICA DE BUSCA DE CEP (ViaCEP) ---
  const handleCepSearch = async () => {
    const cleanCep = formData.cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return;

    setIsCepLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          logradouro: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          uf: data.uf,
          // Preenche a Região automaticamente para o Dashboard (Ex: Belém - PA)
          region: `${data.localidade} - ${data.uf}`
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    } finally {
      setIsCepLoading(false);
    }
  };

  const areas = ["Desenvolvedor", "QA / Tester", "Gerente de Projetos", "Infraestrutura", "Arquiteto", "Outra"];

  return (
    <section className="container mx-auto px-6 max-w-3xl">
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-slate-900/50 p-10 md:p-14 rounded-[60px] border border-cyan-500/20 backdrop-blur-3xl shadow-2xl relative overflow-hidden"
      >
        {/* Decoração de Fundo */}
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <BrainCircuit size={120} className="text-cyan-500" />
        </div>

        {/* Cabeçalho do Onboarding */}
        <div className="mb-12 flex justify-between items-center border-b border-white/5 pb-8 relative z-10">
          <div className="flex items-center gap-6 text-left">
            <div className="p-4 bg-cyan-500/10 rounded-3xl border border-cyan-500/20 text-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
               <ShieldCheck size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase italic text-white tracking-tighter">
                Protocolo <span className="text-cyan-500 font-black">Discovery</span>
              </h2>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">
                Lion Solution • {role === 'client' ? 'Business Intelligence' : 'Talent Acquisition'}
              </p>
            </div>
          </div>
          <div className="hidden sm:flex gap-2">
            <div className={`w-2 h-2 rounded-full transition-all duration-500 ${step === 0 ? 'bg-cyan-500 scale-125 shadow-[0_0_10px_#06b6d4]' : 'bg-white/10'}`} />
            <div className={`w-2 h-2 rounded-full transition-all duration-500 ${step === 1 ? 'bg-cyan-500 scale-125 shadow-[0_0_10px_#06b6d4]' : 'bg-white/10'}`} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div 
              key="step0" 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 20 }}
              className="space-y-5 text-left"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-600 ml-4 tracking-widest italic">Identificação Principal</label>
                <input 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  placeholder={role === 'client' ? "Nome do Gestor / Solicitante" : "Seu nome completo"} 
                  className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl outline-none focus:border-cyan-500 text-white text-sm transition-all" 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-600 ml-4 italic">E-mail Corporativo</label>
                  <input 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    placeholder="exemplo@lionsolution.com" 
                    className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl outline-none focus:border-cyan-500 text-white text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-600 ml-4 italic">WhatsApp</label>
                  <input 
                    value={formData.whatsapp} 
                    onChange={e => setFormData({...formData, whatsapp: maskPhone(e.target.value)})} 
                    placeholder="(91) 98888-8888" 
                    className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl outline-none focus:border-cyan-500 text-white text-sm font-mono" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 relative">
                  <label className="text-[10px] font-black uppercase text-slate-600 ml-4 italic">CEP para Logística</label>
                  <div className="relative">
                    <input 
                      value={formData.cep} 
                      onChange={e => setFormData({...formData, cep: maskCEP(e.target.value)})} 
                      onBlur={handleCepSearch}
                      placeholder="66000-000" 
                      className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl outline-none focus:border-cyan-500 text-white text-sm font-mono" 
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2">
                      {isCepLoading ? (
                        <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Search size={18} className="text-slate-700" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-600 ml-4 italic">{role === 'client' ? 'CNPJ' : 'CPF'}</label>
                  <input 
                    value={formData.cpf_cnpj} 
                    onChange={e => setFormData({...formData, cpf_cnpj: maskCPFCNPJ(e.target.value)})} 
                    placeholder="000.000.000-00" 
                    className="w-full bg-slate-950 border border-white/10 p-6 rounded-3xl outline-none focus:border-cyan-500 text-white text-sm font-mono" 
                  />
                </div>
              </div>

              {/* ENDEREÇO EXPANSÍVEL (ViaCEP) */}
              <AnimatePresence>
                {formData.cidade && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    className="space-y-4 pt-2 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-3 space-y-1">
                        <label className="text-[8px] font-black uppercase text-slate-700 ml-4 tracking-widest">Rua / Logradouro</label>
                        <input value={formData.logradouro} readOnly className="w-full bg-slate-900 border border-white/5 p-5 rounded-2xl text-slate-500 text-xs italic outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-black uppercase text-cyan-500/50 ml-4 tracking-widest">Número</label>
                        <input 
                          value={formData.numero} 
                          onChange={e => setFormData({...formData, numero: e.target.value})} 
                          placeholder="Ex: 450" 
                          className="w-full bg-slate-950 border border-cyan-500/30 p-5 rounded-2xl text-white text-xs font-bold outline-none focus:border-cyan-500" 
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input value={formData.bairro} readOnly className="w-full bg-slate-900 border border-white/5 p-5 rounded-2xl text-slate-500 text-xs italic outline-none" />
                      <input value={formData.cidade} readOnly className="w-full bg-slate-900 border border-white/5 p-5 rounded-2xl text-slate-500 text-xs italic outline-none" />
                      <input value={formData.uf} readOnly className="w-full bg-slate-900 border border-white/5 p-5 rounded-2xl text-slate-500 text-xs text-center italic outline-none" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                onClick={() => setStep(1)} 
                className="w-full bg-white text-slate-950 py-6 rounded-[35px] font-black uppercase text-xs tracking-[0.4em] hover:bg-cyan-500 transition-all duration-500 mt-8 shadow-2xl flex items-center justify-center gap-2 group italic"
              >
                Próximo Passo <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="step1" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 text-left"
            >
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-600 ml-4 italic tracking-widest">Área de Atuação / Demanda</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {areas.map(a => (
                    <button 
                      key={a} 
                      type="button"
                      onClick={() => setFormData({...formData, area: a})} 
                      className={`p-5 border rounded-[30px] text-[10px] font-black uppercase transition-all duration-500 ${formData.area === a ? 'bg-cyan-500 border-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] scale-105' : 'bg-slate-950 border-white/10 hover:border-cyan-500/50 text-slate-500'}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {formData.area === 'Outra' && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                   <label className="text-[9px] font-black uppercase text-cyan-500 ml-4 tracking-widest italic">Especifique o Cargo/Vaga</label>
                   <input 
                    value={formData.customArea} 
                    onChange={e => setFormData({...formData, customArea: e.target.value})} 
                    placeholder="Digite a especialidade técnica..." 
                    className="w-full bg-slate-950 border border-cyan-500/40 p-6 rounded-3xl outline-none text-white text-sm italic" 
                  />
                </motion.div>
              )}

              {role === 'candidate' ? (
                <div className="space-y-5">
                   <div className="flex items-center gap-4 bg-slate-950 border border-white/10 p-6 rounded-3xl">
                    <Linkedin size={20} className="text-cyan-500" />
                    <input 
                      value={formData.linkedinUrl} 
                      onChange={e => setFormData({...formData, linkedinUrl: e.target.value})} 
                      placeholder="Link do seu LinkedIn Profissional" 
                      className="bg-transparent w-full outline-none text-white text-sm" 
                    />
                  </div>
                  
                  <label className="cursor-pointer bg-cyan-500/5 border-2 border-dashed border-cyan-500/20 p-12 rounded-[50px] flex flex-col items-center gap-4 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all group">
                    <div className="p-5 bg-cyan-500/10 rounded-full text-cyan-500 group-hover:scale-110 transition-transform duration-500">
                       {formData.resumeName ? <CheckCircle2 size={32} className="text-green-500 shadow-[0_0_15px_#22c55e]" /> : <Upload size={32} />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">
                      {formData.resumeName ? `Arquivo Detectado: ${formData.resumeName}` : 'Upload Currículo Estratégico (PDF)'}
                    </span>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".pdf" 
                      onChange={e => setFormData({...formData, resumeName: e.target.files?.[0]?.name || ""})} 
                    />
                  </label>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-600 ml-4 italic tracking-widest">Nome da Empresa / Instituição</label>
                    <div className="flex items-center gap-4 bg-slate-950 border border-white/10 p-6 rounded-3xl">
                      <Globe size={20} className="text-cyan-500" />
                      <input 
                        value={formData.company} 
                        onChange={e => setFormData({...formData, company: e.target.value})} 
                        placeholder="Ex: Deskcorp / BASA" 
                        className="bg-transparent w-full outline-none text-white text-sm uppercase font-bold" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-4 bg-slate-950 border border-white/10 p-6 rounded-3xl">
                      <Users size={20} className="text-cyan-500" />
                      <input 
                        type="number" 
                        value={formData.quantity} 
                        onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} 
                        placeholder="Qtd. Profissionais" 
                        className="bg-transparent w-full outline-none text-white text-sm" 
                      />
                    </div>
                    <div className="flex items-center gap-4 bg-slate-950 border border-white/10 p-6 rounded-3xl">
                      <Globe size={20} className="text-cyan-500" />
                      <input 
                        value={formData.companySite} 
                        onChange={e => setFormData({...formData, companySite: e.target.value})} 
                        placeholder="Site Institucional" 
                        className="bg-transparent w-full outline-none text-white text-sm" 
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-6">
                <button 
                  onClick={() => setStep(0)} 
                  className="w-1/4 text-slate-600 uppercase font-black text-[10px] tracking-widest hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={14} /> Voltar
                </button>
                <button 
                  onClick={() => onSubmit(formData)} 
                  className="w-3/4 bg-cyan-500 text-slate-950 py-7 rounded-[35px] font-black uppercase text-xs tracking-[0.5em] hover:bg-white transition-all duration-500 shadow-2xl shadow-cyan-500/30 italic"
                >
                  Finalizar Protocolo
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}