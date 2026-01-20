"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, Upload, CheckCircle2, ChevronRight, Search, 
  ArrowLeft, UserCircle, Star, Target, MapPin, Linkedin, 
  Globe, Users, ShieldCheck, Zap, Info
} from 'lucide-react';

interface DiscoveryProps {
  role: 'candidate' | 'client' | null;
  initialData?: { area?: string; seniority?: string; };
  onSubmit: (data: any) => void;
}

export default function Discovery({ role, initialData, onSubmit }: DiscoveryProps) {
  const [step, setStep] = useState(0);
  const [isCepLoading, setIsCepLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "", email: "", whatsapp: "", cep: "", cpf_cnpj: "",
    logradouro: "", bairro: "", cidade: "", uf: "", numero: "", region: "",
    area: initialData?.area || "", customArea: "", seniority: initialData?.seniority || "",
    experience_bio: "", behavioral_profile: "", soft_skills: [] as string[],
    company: "", companySite: "", quantity: 1, resumeName: ""
  });

  const softSkillsOptions = [
    "Liderança", "Resiliência", "Foco em Dados", 
    "Trabalho em Equipe", "Agilidade", "Comunicação Assertiva",
    "Pensamento Analítico", "Adaptabilidade"
  ];

  // --- MOTORES DE MÁSCARA (PRECISÃO LION) ---
  const maskPhone = (v: string) => v.replace(/\D/g, "").replace(/^(\d{2})(\d)/g, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2").substring(0, 15);
  const maskCEP = (v: string) => v.replace(/\D/g, "").replace(/^(\d{5})(\d)/, "$1-$2").substring(0, 9);
  const maskCPFCNPJ = (v: string) => {
    const val = v.replace(/\D/g, "");
    if (val.length <= 11) return val.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4").substring(0, 14);
    return val.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5").substring(0, 18);
  };

  // --- BUSCA CEP INTELIGENTE + MAPEAMENTO DE REGIÃO ---
  const handleCepSearch = async () => {
    const cleanCep = formData.cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return;
    setIsCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          logradouro: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          uf: data.uf,
          region: `${data.localidade} - ${data.uf}` // Alimenta automaticamente o Dashboard
        }));
      }
    } catch (err) {
      console.error("Erro na geolocalização:", err);
    } finally {
      setIsCepLoading(false);
    }
  };

  // --- MOTOR DE INTELIGÊNCIA DE RH (RESUMO PARA O DIRETOR) ---
  const generateRHAnalysis = () => {
    const skills = formData.soft_skills.join(", ");
    const skills_summary = `Talento ${formData.seniority} em ${formData.area || formData.customArea}. Especialista com domínio validado em ${skills}.`;
    const behavioral_summary = `Perfil identificado como ${formData.behavioral_profile}. Apresenta forte inclinação para ${formData.soft_skills[0] || 'resolução de problemas'}. ${formData.experience_bio.length > 80 ? "Demonstra visão sistêmica e narrativa de carreira orientada a resultados complexos." : "Perfil direto, focado em execução e entregas técnicas."}`;
    
    return { skills_summary, behavioral_summary, soft_skills: skills };
  };

  const handleFinalSubmit = () => {
    const analysis = generateRHAnalysis();
    onSubmit({ ...formData, ...analysis });
  };

  return (
    <section className="container mx-auto px-6 max-w-4xl">
      <motion.div 
        initial={{ opacity: 0, y: 40 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-slate-900/60 p-10 md:p-16 rounded-[70px] border border-cyan-500/20 backdrop-blur-3xl shadow-[0_0_100px_rgba(6,182,212,0.05)] relative overflow-hidden"
      >
        {/* Camada Estética de Governança */}
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
          <BrainCircuit size={200} className="text-cyan-500" />
        </div>

        {/* Header de Progresso */}
        <div className="mb-14 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-10 gap-8 relative z-10">
          <div className="flex items-center gap-6">
            <div className="p-5 bg-cyan-500/10 rounded-[30px] border border-cyan-500/20 text-cyan-500 shadow-glow animate-pulse">
               <ShieldCheck size={36} />
            </div>
            <div className="text-left">
              <h2 className="text-3xl font-black uppercase italic text-white tracking-tighter italic">
                Protocolo <span className="text-cyan-500 font-black">Discovery</span>
              </h2>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1 italic">
                Lion Solution • Talent Intelligence Unit
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-700 ${step === i ? 'w-12 bg-cyan-500 shadow-[0_0_15px_#06b6d4]' : 'w-4 bg-white/10'}`} />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* PASSO 1: IDENTIFICAÇÃO E GEOLOCALIZAÇÃO */}
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} className="space-y-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-600 ml-5 italic tracking-widest">Nome Completo / Social</label>
                  <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Leonardo Alves" className="w-full bg-slate-950 border border-white/5 p-6 rounded-[28px] outline-none focus:border-cyan-500 text-white text-sm transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-600 ml-5 italic tracking-widest">E-mail Corporativo</label>
                  <input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="contato@lionsolution.com" className="w-full bg-slate-950 border border-white/5 p-6 rounded-[28px] outline-none focus:border-cyan-500 text-white text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-600 ml-5 italic tracking-widest">WhatsApp (DDD)</label>
                  <input value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: maskPhone(e.target.value)})} placeholder="(91) 98888-8888" className="w-full bg-slate-950 border border-white/5 p-6 rounded-[28px] outline-none focus:border-cyan-500 text-white text-sm font-mono" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-600 ml-5 italic tracking-widest">{role === 'client' ? 'CNPJ Institucional' : 'CPF Individual'}</label>
                  <input value={formData.cpf_cnpj} onChange={e => setFormData({...formData, cpf_cnpj: maskCPFCNPJ(e.target.value)})} placeholder="00.000.000/0000-00" className="w-full bg-slate-950 border border-white/5 p-6 rounded-[28px] outline-none focus:border-cyan-500 text-white text-sm font-mono" />
                </div>
              </div>

              <div className="space-y-2 relative">
                <label className="text-[10px] font-black uppercase text-slate-600 ml-5 italic tracking-widest">CEP Residencial / Base</label>
                <div className="relative">
                  <input value={formData.cep} onChange={e => setFormData({...formData, cep: maskCEP(e.target.value)})} onBlur={handleCepSearch} placeholder="66000-000" className="w-full bg-slate-950 border border-white/5 p-6 rounded-[28px] outline-none focus:border-cyan-500 text-white text-sm font-mono" />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2">
                    {isCepLoading ? <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" /> : <Search size={20} className="text-slate-800" />}
                  </div>
                </div>
              </div>

              {/* Endereço Dinâmico */}
              <AnimatePresence>
                {formData.cidade && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 overflow-hidden pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-3">
                        <input value={formData.logradouro} readOnly className="w-full bg-slate-900 border border-white/5 p-6 rounded-[25px] text-slate-500 text-xs italic outline-none" />
                      </div>
                      <input value={formData.numero} onChange={e => setFormData({...formData, numero: e.target.value})} placeholder="Nº" className="w-full bg-slate-950 border border-cyan-500/40 p-6 rounded-[25px] text-white text-xs font-bold outline-none focus:border-cyan-500" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold text-slate-500">
                      <div className="bg-slate-900 p-5 rounded-[22px] border border-white/5 text-center">{formData.bairro}</div>
                      <div className="bg-slate-900 p-5 rounded-[22px] border border-white/5 text-center">{formData.cidade}</div>
                      <div className="bg-slate-900 p-5 rounded-[22px] border border-white/5 text-center">{formData.uf}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button onClick={() => setStep(1)} className="w-full bg-white text-slate-950 py-7 rounded-[40px] font-black uppercase text-xs tracking-[0.5em] hover:bg-cyan-500 transition-all duration-500 mt-8 shadow-2xl flex items-center justify-center gap-3 group italic">
                Avançar para Expertise <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {/* PASSO 2: EXPERTISE TÉCNICA E BIO */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-8 text-left">
              <div className="space-y-4">
                <label className="text-[11px] font-black uppercase text-slate-600 ml-5 italic tracking-widest">Área de Atuação Primária</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {["Desenvolvedor", "QA / Tester", "Gerente", "Infra", "Arquiteto", "Outra"].map(a => (
                    <button key={a} onClick={() => setFormData({...formData, area: a})} className={`p-6 border rounded-[35px] text-[10px] font-black uppercase transition-all duration-500 ${formData.area === a ? 'bg-cyan-500 border-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'bg-slate-950 border-white/10 text-slate-500 hover:border-cyan-500/50'}`}>{a}</button>
                  ))}
                </div>
              </div>

              {formData.area === 'Outra' && (
                <div className="animate-in fade-in zoom-in-95">
                   <input value={formData.customArea} onChange={e => setFormData({...formData, customArea: e.target.value})} placeholder="Especifique seu cargo ou especialidade técnica..." className="w-full bg-slate-950 border border-cyan-500/40 p-7 rounded-[30px] outline-none text-white text-sm italic" />
                </div>
              )}

              <div className="space-y-4">
                <label className="text-[11px] font-black uppercase text-slate-600 ml-5 italic tracking-widest">Trajetória e Desafios (Bio)</label>
                <textarea value={formData.experience_bio} onChange={e => setFormData({...formData, experience_bio: e.target.value})} placeholder="Resuma sua senioridade e os principais projetos complexos que já liderou ou participou..." className="w-full bg-slate-950 border border-white/5 p-8 rounded-[40px] text-white text-xs h-40 italic outline-none focus:border-cyan-500 leading-relaxed" />
              </div>

              {role === 'candidate' ? (
                <label className="cursor-pointer bg-cyan-500/5 border-2 border-dashed border-cyan-500/20 p-12 rounded-[55px] flex flex-col items-center gap-4 hover:border-cyan-500 transition-all group duration-500">
                  <div className="p-6 bg-cyan-500/10 rounded-full text-cyan-500 group-hover:scale-110 transition-transform">
                     {formData.resumeName ? <CheckCircle2 size={40} className="text-green-500" /> : <Upload size={40} />}
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-white transition-colors">
                    {formData.resumeName ? `Arquivo: ${formData.resumeName}` : 'Upload Currículo Profissional (PDF)'}
                  </span>
                  <input type="file" className="hidden" accept=".pdf" onChange={e => setFormData({...formData, resumeName: e.target.files?.[0]?.name || ""})} />
                </label>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-600 ml-5 italic tracking-widest">Nome da Instituição</label>
                    <div className="flex items-center gap-4 bg-slate-950 border border-white/5 p-6 rounded-[30px]"><Globe size={20} className="text-cyan-500" /><input value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} placeholder="Ex: Deskcorp / BASA" className="bg-transparent w-full outline-none text-white text-sm font-bold uppercase" /></div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-600 ml-5 italic tracking-widest">Volume de Demanda</label>
                    <div className="flex items-center gap-4 bg-slate-950 border border-white/5 p-6 rounded-[30px]"><Users size={20} className="text-cyan-500" /><input type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} placeholder="Qtd. Profissionais" className="bg-transparent w-full outline-none text-white text-sm" /></div>
                  </div>
                </div>
              )}

              <div className="flex gap-6 pt-8">
                <button onClick={() => setStep(0)} className="w-1/4 text-slate-600 uppercase font-black text-[11px] tracking-widest flex items-center justify-center gap-2 hover:text-white transition-colors"><ArrowLeft size={16}/> Voltar</button>
                <button onClick={() => setStep(2)} className="w-3/4 bg-white text-slate-950 py-7 rounded-[40px] font-black uppercase text-xs tracking-[0.4em] shadow-2xl hover:bg-cyan-500 transition-all duration-500 italic">Análise Comportamental</button>
              </div>
            </motion.div>
          )}

          {/* PASSO 3: PERFIL PSICOMÉTRICO E SOFT SKILLS */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 text-left">
              <div className="space-y-6">
                <p className="text-[11px] font-black uppercase text-slate-600 ml-5 italic tracking-widest flex items-center gap-2"><Target size={16} className="text-cyan-500"/> Qual seu Perfil Predominante?</p>
                <div className="grid grid-cols-2 gap-4">
                  {["Analítico", "Executor", "Comunicador", "Planejador"].map(p => (
                    <button key={p} onClick={() => setFormData({...formData, behavioral_profile: p})} className={`p-7 border rounded-[40px] text-[11px] font-black uppercase transition-all duration-700 ${formData.behavioral_profile === p ? 'bg-cyan-500 border-cyan-500 text-slate-950 shadow-[0_0_25px_#06b6d4]' : 'bg-slate-950 border-white/10 text-slate-500 hover:border-cyan-500/30'}`}>{p}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-[11px] font-black uppercase text-slate-600 ml-5 italic tracking-widest flex items-center gap-2"><Star size={16} className="text-purple-500"/> Soft Skills de Diferenciação</p>
                <div className="flex flex-wrap gap-3">
                  {softSkillsOptions.map(s => (
                    <button key={s} onClick={() => setFormData({...formData, soft_skills: formData.soft_skills.includes(s) ? formData.soft_skills.filter(i => i !== s) : [...formData.soft_skills, s]})} className={`px-7 py-4 rounded-full text-[10px] font-black uppercase transition-all duration-500 ${formData.soft_skills.includes(s) ? 'bg-cyan-500 text-slate-950 shadow-lg' : 'bg-white/5 text-slate-600 border border-white/5 hover:text-white'}`}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-cyan-500/5 border border-cyan-500/20 rounded-[40px] flex gap-5 items-start">
                 <Zap className="text-cyan-500 shrink-0" size={24} />
                 <p className="text-xs text-slate-400 font-light leading-relaxed italic">Ao finalizar, nossa **IA de Governança** irá consolidar seu dossiê técnico e comportamental para apresentação direta ao conselho executivo.</p>
              </div>

              <div className="flex gap-6 pt-6">
                <button onClick={() => setStep(1)} className="w-1/4 text-slate-600 uppercase font-black text-[11px] tracking-widest hover:text-white transition-colors">Voltar</button>
                <button onClick={handleFinalSubmit} className="w-3/4 bg-cyan-500 text-slate-950 py-8 rounded-[45px] font-black uppercase text-xs tracking-[0.5em] shadow-2xl shadow-cyan-500/30 italic hover:bg-white transition-all duration-500">Gerar Protocolo de Elite</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}