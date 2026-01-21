"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, 
  Upload, 
  CheckCircle2, 
  ChevronRight, 
  Search, 
  ArrowLeft, 
  UserCircle, 
  Star, 
  Target, 
  MapPin, 
  Linkedin, 
  Globe, 
  Users, 
  ShieldCheck, 
  Zap, 
  Info,
  Briefcase,
  FileText,
  BadgeCheck,
  Cpu,
  Layers,
  Database,
  Link
} from 'lucide-react';

/**
 * @component Discovery
 * @description Onboarding de Elite para a plataforma RH Tammy.
 * @features Triagem 3 fases, ViaCEP, Máscaras de Dados, IA Comportamental.
 */

interface DiscoveryProps {
  role: 'candidate' | 'client' | null;
  initialData?: {
    area?: string;
    seniority?: string;
  };
  onSubmit: (data: any) => void;
}

export default function Discovery({ role, initialData, onSubmit }: DiscoveryProps) {
  // --- ESTADOS DE FLUXO E CARREGAMENTO ---
  const [step, setStep] = useState(0);
  const [isCepLoading, setIsCepLoading] = useState(false);
  
  // --- ESTADO INTEGRAL DO FORMULÁRIO (PADRÃO SNAKE_CASE) ---
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
    region: "",
    linkedin_url: "",
    company: "",
    company_site: "",
    area: initialData?.area || "",
    custom_area: "",
    seniority: initialData?.seniority || "",
    experience_bio: "",
    behavioral_profile: "",
    soft_skills: [] as string[],
    quantity: 1,
    resumeName: ""
  });

  // --- CONFIGURAÇÕES DE SOFT SKILLS ---
  const softSkillsOptions = [
    { label: "Liderança Estratégica", icon: <BadgeCheck size={14}/> },
    { label: "Resiliência Operacional", icon: <Cpu size={14}/> },
    { label: "Foco em Dados", icon: <Database size={14}/> },
    { label: "Trabalho em Equipe", icon: <Users size={14}/> },
    { label: "Agilidade Adaptativa", icon: <Zap size={14}/> },
    { label: "Comunicação Assertiva", icon: <Info size={14}/> },
    { label: "Pensamento Analítico", icon: <Search size={14}/> },
    { label: "Governança Ágil", icon: <Layers size={14}/> }
  ];

  // --- MOTORES DE MÁSCARA (PRECISÃO TÉCNICA) ---
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

  // --- INTEGRAÇÃO VIACEP COM MAPEAMENTO DE REGIÃO ---
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
          region: `${data.localidade} - ${data.uf}` // Sincroniza Região para o Dashboard
        }));
      }
    } catch (error) {
      console.error("Erro na geolocalização Lion:", error);
    } finally {
      setIsCepLoading(false);
    }
  };

  // --- MOTOR DE IA DE RH (GERAÇÃO DE DOSSIÊ) ---
  const generateRHAnalysis = () => {
    const skills = formData.soft_skills.join(", ");
    const areaFinal = formData.area === 'Outra' ? formData.custom_area : formData.area;
    
    // Resumo de Expertise para o Diretor
    const skills_summary = `Especialista ${formData.seniority} em ${areaFinal}. Demonstra domínio técnico com foco em ${skills || 'resultados complexos'}.`;
    
    // Resumo Comportamental para o Diretor
    const behavioral_summary = `Perfil ${formData.behavioral_profile}. Forte aptidão para ${formData.soft_skills[0] || 'gestão e entrega'}. ${formData.experience_bio.length > 80 ? "Demonstra visão sistêmica de carreira." : "Focado em eficiência técnica."}`;
    
    return { 
      skills_summary, 
      behavioral_summary, 
      soft_skills: skills,
      custom_area: formData.custom_area,
      area: areaFinal
    };
  };

  const handleFinalSubmit = () => {
    const analysis = generateRHAnalysis();
    onSubmit({ ...formData, ...analysis });
  };

  return (
    <section className="container mx-auto px-6 max-w-5xl py-12">
      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-slate-900/60 p-10 md:p-20 rounded-[80px] border border-cyan-500/20 backdrop-blur-3xl shadow-2xl relative overflow-hidden"
      >
        {/* Background Visual Lion */}
        <div className="absolute top-0 right-0 p-16 opacity-[0.02] pointer-events-none">
          <BrainCircuit size={300} className="text-cyan-500" />
        </div>

        {/* --- HEADER DO PROTOCOLO --- */}
        <div className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-12 gap-10 relative z-10">
          <div className="flex items-center gap-8">
            <div className="p-6 bg-cyan-500/10 rounded-[35px] border border-cyan-500/20 text-cyan-500 shadow-glow">
               <ShieldCheck size={40} />
            </div>
            <div className="text-left">
              <h2 className="text-4xl font-black uppercase italic text-white tracking-tighter">
                Protocolo <span className="text-cyan-500 font-black">Discovery</span>
              </h2>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] mt-2 italic flex items-center gap-2">
                <BadgeCheck size={14} className="text-cyan-500"/> Lion Solution • Onboarding Intelligence
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`h-2 rounded-full transition-all duration-700 ${step === i ? 'w-16 bg-cyan-500 shadow-[0_0_20px_#06b6d4]' : 'w-5 bg-white/10'}`} />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* --- PASSO 0: IDENTIFICAÇÃO E LOGÍSTICA --- */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} className="space-y-8 text-left relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase text-slate-600 ml-6 italic tracking-widest">Identificação Completa</label>
                  <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder={role === 'client' ? "Nome do Solicitante" : "Seu nome completo"} className="w-full bg-slate-950 border border-white/5 p-7 rounded-[30px] outline-none focus:border-cyan-500 text-white text-sm" />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase text-slate-600 ml-6 italic tracking-widest">Canal de E-mail</label>
                  <input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="exemplo@lionsolution.com" className="w-full bg-slate-950 border border-white/5 p-7 rounded-[30px] outline-none focus:border-cyan-500 text-white text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase text-slate-600 ml-6 italic tracking-widest">WhatsApp Direct</label>
                  <input value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: maskPhone(e.target.value)})} placeholder="(00) 00000-0000" className="w-full bg-slate-950 border border-white/5 p-7 rounded-[30px] outline-none focus:border-cyan-500 text-white text-sm font-mono" />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase text-slate-600 ml-6 italic tracking-widest">{role === 'client' ? 'CNPJ Institucional' : 'CPF Individual'}</label>
                  <input value={formData.cpf_cnpj} onChange={e => setFormData({...formData, cpf_cnpj: maskCPFCNPJ(e.target.value)})} placeholder="000.000.000-00" className="w-full bg-slate-950 border border-white/5 p-7 rounded-[30px] outline-none focus:border-cyan-500 text-white text-sm font-mono" />
                </div>
              </div>

              <div className="space-y-3 relative">
                <label className="text-[11px] font-black uppercase text-slate-600 ml-6 italic tracking-widest">CEP Residencial / Base</label>
                <div className="relative group">
                  <input value={formData.cep} onChange={e => setFormData({...formData, cep: maskCEP(e.target.value)})} onBlur={handleCepSearch} placeholder="00000-000" className="w-full bg-slate-950 border border-white/5 p-7 rounded-[30px] outline-none focus:border-cyan-500 text-white text-sm font-mono transition-all" />
                  <div className="absolute right-8 top-1/2 -translate-y-1/2">
                    {isCepLoading ? <div className="w-6 h-6 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" /> : <Search size={22} className="text-slate-800 group-hover:text-cyan-500 transition-colors" />}
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {formData.cidade && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6 pt-4 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <input value={formData.logradouro} readOnly className="md:col-span-3 bg-slate-900 border border-white/5 p-6 rounded-[28px] text-slate-500 text-xs italic" />
                      <input value={formData.numero} onChange={e => setFormData({...formData, numero: e.target.value})} placeholder="Nº" className="w-full bg-slate-950 border border-cyan-500/30 p-6 rounded-[28px] text-white text-xs font-bold outline-none focus:border-cyan-500 shadow-glow" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="p-6 bg-slate-900/50 rounded-[28px] text-center text-xs font-black text-slate-500 uppercase italic border border-white/5">{formData.bairro}</div>
                       <div className="p-6 bg-slate-900/50 rounded-[28px] text-center text-xs font-black text-slate-500 uppercase italic border border-white/5">{formData.cidade}</div>
                       <div className="p-6 bg-slate-900/50 rounded-[28px] text-center text-xs font-black text-slate-500 uppercase italic border border-white/5">{formData.uf}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button onClick={() => setStep(1)} className="w-full bg-white text-slate-950 py-8 rounded-[45px] font-black uppercase text-xs tracking-[0.5em] hover:bg-cyan-500 transition-all duration-700 mt-10 shadow-2xl flex items-center justify-center gap-4 group italic">
                Validar e Prosseguir <ChevronRight size={22} className="group-hover:translate-x-2 transition-transform duration-500" />
              </button>
            </motion.div>
          )}

          {/* --- PASSO 1: EXPERTISE TÉCNICA --- */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-10 text-left relative z-10">
              <div className="space-y-6">
                <label className="text-[12px] font-black uppercase text-slate-600 ml-6 italic tracking-widest flex items-center gap-2"><Cpu size={16} className="text-cyan-500"/> Core Technical Stack</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {["Desenvolvedor", "QA / Tester", "Gerente", "Infra", "Arquiteto", "Outra"].map(a => (
                    <button key={a} onClick={() => setFormData({...formData, area: a})} className={`p-6 border rounded-[30px] text-[10px] font-black uppercase transition-all duration-700 ${formData.area === a ? 'bg-cyan-500 border-cyan-500 text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.4)] scale-105' : 'bg-slate-950 border-white/10 text-slate-500 hover:border-cyan-500/50 hover:text-white'}`}>{a}</button>
                  ))}
                </div>
              </div>

              {formData.area === 'Outra' && (
                <div className="animate-in fade-in zoom-in-95">
                   <input value={formData.custom_area} onChange={e => setFormData({...formData, custom_area: e.target.value})} placeholder="Especifique a especialidade técnica..." className="w-full bg-slate-950 border border-cyan-500/40 p-8 rounded-[35px] outline-none text-white text-sm italic shadow-inner" />
                </div>
              )}

              <div className="space-y-4">
                <label className="text-[12px] font-black uppercase text-slate-600 ml-6 italic tracking-widest flex items-center gap-2"><FileText size={16} className="text-cyan-500"/> Trajetória e Desafios (Bio RH)</label>
                <textarea value={formData.experience_bio} onChange={e => setFormData({...formData, experience_bio: e.target.value})} placeholder="Resuma seus principais projetos e senioridade..." className="w-full bg-slate-950 border border-white/5 p-10 rounded-[50px] text-white text-xs h-48 italic outline-none focus:border-cyan-500 leading-relaxed shadow-inner" />
              </div>

              {role === 'candidate' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                     <label className="text-[11px] font-black uppercase text-slate-600 ml-6 italic tracking-widest">LinkedIn Público</label>
                     <div className="flex items-center gap-4 bg-slate-950 border border-white/5 p-6 rounded-[30px]"><Linkedin size={20} className="text-cyan-500" /><input value={formData.linkedin_url} onChange={e => setFormData({...formData, linkedin_url: e.target.value})} placeholder="linkedin.com/in/perfil" className="bg-transparent w-full outline-none text-white text-sm" /></div>
                  </div>
                  <label className="cursor-pointer bg-cyan-500/5 border-2 border-dashed border-cyan-500/20 p-12 rounded-[55px] flex flex-col items-center gap-4 hover:border-cyan-500 transition-all group duration-700 shadow-2xl">
                    <div className={`p-6 rounded-full transition-all duration-500 ${formData.resumeName ? 'bg-green-500/20 text-green-500 scale-110 shadow-[0_0_20px_#22c55e]' : 'bg-cyan-500/10 text-cyan-500'}`}>
                       {formData.resumeName ? <BadgeCheck size={40} /> : <Upload size={40} />}
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-white transition-colors text-center px-4">{formData.resumeName ? `Arquivo Detectado: ${formData.resumeName}` : 'Upload Currículo Profissional (PDF)'}</span>
                    <input type="file" className="hidden" accept=".pdf" onChange={e => setFormData({...formData, resumeName: e.target.files?.[0]?.name || ""})} />
                  </label>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase text-slate-600 ml-6 italic tracking-widest">Instituição</label>
                    <div className="flex items-center gap-5 bg-slate-950 border border-white/5 p-7 rounded-[35px] shadow-inner"><Globe size={20} className="text-cyan-500" /><input value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} placeholder="Ex: Deskcorp" className="bg-transparent w-full outline-none text-white text-sm font-black uppercase italic" /></div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase text-slate-600 ml-6 italic tracking-widest">Site Corporativo</label>
                    <div className="flex items-center gap-5 bg-slate-950 border border-white/5 p-7 rounded-[35px] shadow-inner"><Link size={20} className="text-cyan-500" /><input value={formData.company_site} onChange={e => setFormData({...formData, company_site: e.target.value})} placeholder="www.empresa.com" className="bg-transparent w-full outline-none text-white text-sm" /></div>
                  </div>
                </div>
              )}

              <div className="flex gap-8 pt-10">
                <button onClick={() => setStep(0)} className="w-1/4 text-slate-600 uppercase font-black text-[12px] tracking-widest flex items-center justify-center gap-3 hover:text-white transition-all duration-500 italic"><ArrowLeft size={18}/> Voltar</button>
                <button onClick={() => setStep(2)} className="w-3/4 bg-white text-slate-950 py-8 rounded-[45px] font-black uppercase text-xs tracking-[0.5em] shadow-2xl hover:bg-cyan-500 transition-all duration-700 italic">Próximo: Análise de Perfil</button>
              </div>
            </motion.div>
          )}

          {/* --- PASSO 2: PSICOMETRIA --- */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="space-y-14 text-left relative z-10">
              <div className="space-y-8">
                <p className="text-[12px] font-black uppercase text-slate-600 ml-6 italic tracking-widest flex items-center gap-3"><Target size={18} className="text-cyan-500"/> Qual seu Perfil Predominante?</p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {["Analítico", "Executor", "Comunicador", "Planejador"].map(p => (
                    <button key={p} onClick={() => setFormData({...formData, behavioral_profile: p})} className={`p-8 border rounded-[45px] text-[11px] font-black uppercase transition-all duration-700 shadow-xl ${formData.behavioral_profile === p ? 'bg-cyan-500 border-cyan-500 text-slate-950 shadow-[0_0_30px_#06b6d4] scale-110' : 'bg-slate-950 border-white/10 text-slate-600 hover:border-cyan-500/40 hover:text-white'}`}>{p}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <p className="text-[12px] font-black uppercase text-slate-600 ml-6 italic tracking-widest flex items-center gap-3"><Star size={18} className="text-purple-500"/> Soft Skills de Diferenciação</p>
                <div className="flex flex-wrap gap-4">
                  {softSkillsOptions.map(s => (
                    <button 
                      key={s.label} 
                      onClick={() => {
                        const skills = formData.soft_skills.includes(s.label) ? formData.soft_skills.filter(i => i !== s.label) : [...formData.soft_skills, s.label];
                        setFormData({...formData, soft_skills: skills});
                      }} 
                      className={`px-8 py-4 rounded-full text-[11px] font-bold uppercase transition-all duration-500 flex items-center gap-3 border ${formData.soft_skills.includes(s.label) ? 'bg-cyan-500 border-cyan-500 text-slate-950 shadow-glow' : 'bg-white/5 text-slate-600 border-white/10 hover:text-white'}`}
                    >
                      {s.icon} {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-10 bg-cyan-500/5 border border-cyan-500/20 rounded-[50px] flex gap-8 items-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                 <Zap className="text-cyan-500 shrink-0 animate-pulse" size={32} />
                 <p className="text-sm text-slate-400 font-light leading-relaxed italic relative z-10">Ao finalizar, nossa **IA de Governança Lion** processará seus dados e gerará um dossiê técnico e comportamental exaustivo para auditoria do comitê executivo.</p>
              </div>

              <div className="flex gap-8 pt-8">
                <button onClick={() => setStep(1)} className="w-1/4 text-slate-600 uppercase font-black text-[12px] tracking-widest hover:text-white transition-all italic duration-500">Voltar</button>
                <button onClick={handleFinalSubmit} className="w-3/4 bg-cyan-500 text-slate-950 py-9 rounded-[50px] font-black uppercase text-xs tracking-[0.6em] shadow-2xl italic hover:bg-white transition-all duration-1000 shadow-cyan-500/20">Finalizar Protocolo de Elite</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}