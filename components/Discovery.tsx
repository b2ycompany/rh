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
  Link,
  Heart,
  Glasses,
  TrendingUp,
  BarChart3,
  Fingerprint,
  Rocket,
  Mail,
  Award,
  Users2
} from 'lucide-react';

/**
 * @component Discovery
 * @description Onboarding exaustivo com Matriz DISC e OCEAN (Big Five).
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
  const [step, setStep] = useState(0);
  const [isCepLoading, setIsCepLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "", email: "", whatsapp: "", cep: "", cpf_cnpj: "",
    marital_status: "Solteiro(a)", hobbies: "",
    logradouro: "", bairro: "", cidade: "", uf: "", numero: "", region: "",
    area: initialData?.area || "", custom_area: "", seniority: initialData?.seniority || "",
    experience_bio: "", behavioral_profile: "", soft_skills: [] as string[],
    company: "", company_site: "", quantity: 1, resumeName: "",
    tech_level: "3", market_segments: [] as string[], situational_response: "",
    // Psicometria OCEAN
    ocean_openness: 5, ocean_conscientiousness: 5, ocean_extraversion: 5, ocean_agreeableness: 5, ocean_neuroticism: 5
  });

  const softSkillsOptions = [
    { label: "Liderança Estratégica", icon: <BadgeCheck size={14}/> },
    { label: "Resiliência Operacional", icon: <Cpu size={14}/> },
    { label: "Foco em Dados", icon: <Database size={14}/> },
    { label: "Trabalho em Equipe", icon: <Users size={14}/> },
    { label: "Agilidade Adaptativa", icon: <Zap size={14}/> },
    { label: "Comunicação Assertiva", icon: <Info size={14}/> }
  ];

  const marketOptions = ["Bancário", "Indústria", "Varejo", "Saúde Digital", "Setor Público", "Logística"];

  const oceanTraits = [
    { key: "ocean_openness", label: "Abertura (Openness)", desc: "Nível de criatividade e busca por inovação." },
    { key: "ocean_conscientiousness", label: "Conscienciosidade", desc: "Nível de organização, foco e disciplina." },
    { key: "ocean_extraversion", label: "Extroversão", desc: "Nível de sociabilidade e energia externa." },
    { key: "ocean_agreeableness", label: "Amabilidade", desc: "Nível de cooperação e empatia com o time." },
    { key: "ocean_neuroticism", label: "Estabilidade", desc: "Resiliência emocional sob pressão intensa." }
  ];

  const maskPhone = (v: string) => v.replace(/\D/g, "").replace(/^(\d{2})(\d)/g, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2").substring(0, 15);
  const maskCEP = (v: string) => v.replace(/\D/g, "").replace(/^(\d{5})(\d)/, "$1-$2").substring(0, 9);
  const maskCPFCNPJ = (v: string) => {
    const val = v.replace(/\D/g, "");
    if (val.length <= 11) return val.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4").substring(0, 14);
    return val.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5").substring(0, 18);
  };

  const handleCepSearch = async () => {
    const cep = formData.cep.replace(/\D/g, "");
    if (cep.length !== 8) return;
    setIsCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setFormData(prev => ({...prev, logradouro: data.logradouro, bairro: data.bairro, cidade: data.localidade, uf: data.uf, region: `${data.localidade} - ${data.uf}`}));
      }
    } finally { setIsCepLoading(false); }
  };

  const generateRHAnalysis = () => {
    const skills = formData.soft_skills.join(", ");
    const areaFinal = formData.area === 'Outra' ? formData.custom_area : formData.area;
    const skills_summary = `Talento nível ${formData.tech_level}/5 em ${areaFinal}. Perfil OCEAN detalhado. Hobbies: ${formData.hobbies}.`;
    const behavioral_summary = `Perfil DISC ${formData.behavioral_profile}. Sob pressão: ${formData.situational_response}. Estado Civil: ${formData.marital_status}.`;
    
    return { 
      skills_summary, 
      behavioral_summary, 
      soft_skills: skills, 
      custom_area: formData.custom_area, 
      area: areaFinal,
      marital_status: formData.marital_status,
      hobbies: formData.hobbies
    };
  };

  const handleFinalSubmit = () => {
    const analysis = generateRHAnalysis();
    onSubmit({ ...formData, ...analysis });
  };

  return (
    <section className="container mx-auto px-6 max-w-6xl py-12 text-left">
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/60 p-10 md:p-20 rounded-[80px] border border-cyan-500/20 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
        
        <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none"><BrainCircuit size={450} className="text-cyan-500" /></div>

        <div className="mb-16 flex flex-col md:flex-row justify-between items-start border-b border-white/5 pb-12 gap-10 relative z-10">
          <div className="flex items-center gap-10">
            <div className="p-8 bg-cyan-500/10 rounded-[45px] border border-cyan-500/20 text-cyan-500 shadow-glow"><ShieldCheck size={48} /></div>
            <div className="text-left">
              <h2 className="text-4xl font-black uppercase italic text-white tracking-tighter leading-none">Protocolo <span className="text-cyan-500 font-black">Discovery Elite</span></h2>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.6em] mt-3 italic flex items-center gap-3"><Rocket size={14} className="text-cyan-500"/> Lion Solution • Governança Psicometria v6.5</p>
            </div>
          </div>
          <div className="flex gap-4">
            {[0, 1, 2, 3, 4].map((i) => (<div key={i} className={`h-2 rounded-full transition-all duration-700 ${step === i ? 'w-16 bg-cyan-500 shadow-glow' : 'w-5 bg-white/10'}`} />))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} className="space-y-10 text-left relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4"><label className="text-[11px] font-black uppercase text-slate-600 ml-8 tracking-widest italic flex items-center gap-3"><UserCircle size={14}/> Nome Completo</label><input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Seu nome" className="w-full bg-slate-950 border border-white/5 p-8 rounded-[35px] outline-none focus:border-cyan-500 text-white text-sm shadow-inner" /></div>
                <div className="space-y-4"><label className="text-[11px] font-black uppercase text-slate-600 ml-8 tracking-widest italic flex items-center gap-3"><Mail size={14}/> E-mail Profissional</label><input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="contato@empresa.com" className="w-full bg-slate-950 border border-white/5 p-8 rounded-[35px] outline-none focus:border-cyan-500 text-white text-sm shadow-inner" /></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4"><label className="text-[11px] font-black uppercase text-slate-600 ml-8 tracking-widest italic">WhatsApp Direct</label><input value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: maskPhone(e.target.value)})} placeholder="(00) 00000-0000" className="w-full bg-slate-950 border border-white/5 p-8 rounded-[35px] outline-none focus:border-cyan-500 text-white text-sm font-mono tracking-wider shadow-inner" /></div>
                <div className="space-y-4"><label className="text-[11px] font-black uppercase text-slate-600 ml-8 tracking-widest italic">Estado Civil</label>
                  <select value={formData.marital_status} onChange={e => setFormData({...formData, marital_status: e.target.value})} className="w-full bg-slate-950 border border-white/5 p-8 rounded-[35px] text-white text-sm outline-none appearance-none cursor-pointer"><option>Solteiro(a)</option><option>Casado(a)</option><option>União Estável</option><option>Divorciado(a)</option></select>
                </div>
                <div className="space-y-4"><label className="text-[11px] font-black uppercase text-slate-600 ml-8 tracking-widest italic flex items-center gap-3"><Heart size={14} className="text-red-500"/> Hobby / Paixão</label><input value={formData.hobbies} onChange={e => setFormData({...formData, hobbies: e.target.value})} placeholder="O que você ama fazer?" className="w-full bg-slate-950 border border-white/5 p-8 rounded-[35px] outline-none focus:border-cyan-500 text-white text-sm italic shadow-inner" /></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4"><label className="text-[11px] font-black uppercase text-slate-600 ml-8 tracking-widest italic">CPF / CNPJ</label><input value={formData.cpf_cnpj} onChange={e => setFormData({...formData, cpf_cnpj: maskCPFCNPJ(e.target.value)})} placeholder="Documento" className="w-full bg-slate-950 border border-white/5 p-8 rounded-[35px] outline-none focus:border-cyan-500 text-white text-sm font-mono tracking-widest" /></div>
                <div className="space-y-4 relative"><label className="text-[11px] font-black uppercase text-slate-600 ml-8 tracking-widest italic">CEP Base Localidade</label><div className="relative"><input value={formData.cep} onChange={e => setFormData({...formData, cep: maskCEP(e.target.value)})} onBlur={handleCepSearch} placeholder="00000-000" className="w-full bg-slate-950 border border-white/5 p-8 rounded-[35px] outline-none focus:border-cyan-500 text-white text-sm font-mono transition-all" /><div className="absolute right-8 top-1/2 -translate-y-1/2">{isCepLoading ? <div className="w-6 h-6 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" /> : <Search size={22} className="text-slate-800" />}</div></div></div>
              </div>

              {formData.cidade && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 animate-in slide-in-from-top-4 duration-1000">
                  <input value={formData.logradouro} readOnly className="md:col-span-3 bg-slate-900 border border-white/5 p-8 rounded-[35px] text-slate-500 text-xs italic outline-none shadow-inner" />
                  <input value={formData.numero} onChange={e => setFormData({...formData, numero: e.target.value})} placeholder="Nº" className="w-full bg-slate-950 border border-cyan-500/40 p-8 rounded-[35px] text-white text-xs font-black outline-none focus:border-cyan-500 shadow-glow" />
                </div>
              )}
              
              <button onClick={() => setStep(1)} className="w-full bg-white text-slate-950 py-10 rounded-[60px] font-black uppercase text-xs tracking-[0.7em] hover:bg-cyan-500 transition-all duration-1000 mt-12 shadow-2xl flex items-center justify-center gap-6 italic group">Efetivar Identificação <ChevronRight size={26} className="group-hover:translate-x-3 transition-transform" /></button>
            </motion.div>
          )}

          {/* PASSO 1: TÉCNICO E MERCADO */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-12 text-left relative z-10">
              <div className="space-y-8">
                <label className="text-[13px] font-black uppercase text-slate-600 ml-8 tracking-widest flex items-center gap-4 italic"><Briefcase size={20} className="text-cyan-500"/> Core technical stack vertical</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
                  {["Desenvolvedor", "QA / Tester", "Gerente", "Infra", "Arquiteto", "Outra"].map(a => (
                    <button key={a} onClick={() => setFormData({...formData, area: a})} className={`p-8 border rounded-[45px] text-[11px] font-black uppercase transition-all duration-1000 ${formData.area === a ? 'bg-cyan-500 border-cyan-500 text-slate-950 shadow-[0_0_40px_rgba(6,182,212,0.4)] scale-110' : 'bg-slate-950 border-white/10 text-slate-500 hover:border-cyan-500/50'}`}>{a}</button>
                  ))}
                </div>
              </div>
              {formData.area === 'Outra' && (<input value={formData.custom_area} onChange={e => setFormData({...formData, custom_area: e.target.value})} placeholder="Especifique a vertical técnica..." className="w-full bg-slate-950 border border-cyan-500/30 p-10 rounded-[50px] outline-none text-white text-md italic shadow-inner" />)}
              
              <div className="space-y-8">
                 <p className="text-[13px] font-black uppercase text-slate-600 ml-8 tracking-widest flex items-center gap-4 italic"><BarChart3 size={20} className="text-cyan-500"/> Nível de senioridade real (1-5)</p>
                 <div className="flex gap-6">{[1, 2, 3, 4, 5].map(n => (<button key={n} onClick={() => setFormData({...formData, tech_level: n.toString()})} className={`w-16 h-16 rounded-[25px] font-black text-lg transition-all duration-1000 ${formData.tech_level === n.toString() ? 'bg-cyan-500 text-slate-950 scale-125 shadow-glow' : 'bg-slate-950 border border-white/10 text-slate-500'}`}>{n}</button>))}</div>
              </div>

              <div className="space-y-8">
                 <p className="text-[13px] font-black uppercase text-slate-600 ml-8 tracking-widest flex items-center gap-4 italic"><Layers size={20} className="text-cyan-500"/> Segmentos de Domínio Estratégico</p>
                 <div className="flex flex-wrap gap-4">{marketOptions.map(m => (<button key={m} onClick={() => setFormData({...formData, market_segments: formData.market_segments.includes(m) ? formData.market_segments.filter(i => i !== m) : [...formData.market_segments, m]})} className={`px-10 py-5 rounded-full text-[11px] font-black uppercase border transition-all duration-1000 ${formData.market_segments.includes(m) ? 'bg-cyan-500 border-cyan-500 text-slate-950 shadow-glow' : 'bg-white/5 border-white/10 text-slate-500'}`}>{m}</button>))}</div>
              </div>

              <div className="flex gap-10 pt-10"><button onClick={() => setStep(0)} className="w-1/4 text-slate-600 uppercase font-black text-[14px] tracking-widest flex items-center justify-center gap-4 hover:text-white transition-all italic duration-500"><ArrowLeft size={22}/> Voltar</button><button onClick={() => setStep(2)} className="w-3/4 bg-white text-slate-950 py-10 rounded-[60px] font-black uppercase text-xs tracking-[0.6em] shadow-2xl hover:bg-cyan-500 transition-all duration-700 italic">Próximo: Perfil DISC</button></div>
            </motion.div>
          )}

          {/* PASSO 2: MATRIZ DISC */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="space-y-16 text-left relative z-10">
              <div className="space-y-10">
                 <p className="text-[14px] font-black uppercase text-slate-600 ml-10 tracking-widest flex items-center gap-5 italic"><Target size={24} className="text-cyan-500"/> Reação Crítica sob Pressão Extrema em Squad?</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {[
                     {id: "A", label: "Acelero a execução e foco no prazo", disc: "Executor"},
                     {id: "B", label: "Analiso detalhadamente os riscos antes", disc: "Analítico"},
                     {id: "C", label: "Comunico o time e busco consenso ágil", disc: "Comunicador"},
                     {id: "D", label: "Mantenho o plano e evito mudanças bruscas", disc: "Planejador"}
                   ].map(r => (
                     <button key={r.id} onClick={() => setFormData({...formData, situational_response: r.label, behavioral_profile: r.disc})} className={`p-10 border rounded-[60px] text-left text-sm font-bold transition-all duration-1000 ${formData.behavioral_profile === r.disc ? 'bg-cyan-500 border-cyan-500 text-slate-950 shadow-glow scale-105' : 'bg-slate-950 border-white/10 text-slate-500 hover:border-cyan-500/30'}`}><span className="opacity-40 mr-6 font-black italic">{r.id}.</span> {r.label}</button>
                   ))}
                </div>
              </div>
              <div className="flex gap-10 pt-10"><button onClick={() => setStep(1)} className="w-1/4 text-slate-600 uppercase font-black text-[14px] tracking-widest italic">Voltar</button><button onClick={() => setStep(3)} className="w-3/4 bg-white text-slate-950 py-10 rounded-[60px] font-black uppercase text-xs tracking-[0.4em] shadow-2xl hover:bg-cyan-500 transition-all italic">Próximo: Perfil OCEAN</button></div>
            </motion.div>
          )}

          {/* PASSO 3: BIG FIVE (OCEAN) */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12 text-left relative z-10">
              <div className="flex items-center gap-6 border-l-4 border-purple-500 pl-8 mb-10"><Glasses size={32} className="text-purple-500"/><h3 className="text-2xl font-black uppercase italic text-white tracking-tighter">Avaliação <span className="text-purple-500 font-black">OCEAN (Big Five)</span></h3></div>
              <div className="grid gap-8">{oceanTraits.map(t => (
                <div key={t.key} className="space-y-6 bg-slate-950/50 p-10 rounded-[60px] border border-white/5 group hover:border-cyan-500/20 transition-all duration-700 shadow-inner">
                   <div className="flex justify-between items-center"><div className="space-y-1"><p className="text-md font-black text-white uppercase italic tracking-widest">{t.label}</p><p className="text-[10px] text-slate-600 uppercase tracking-widest">{t.desc}</p></div><span className="text-2xl font-mono font-black text-cyan-500">{(formData as any)[t.key]}/10</span></div>
                   <input type="range" min="1" max="10" value={(formData as any)[t.key]} onChange={e => setFormData({...formData, [t.key]: parseInt(e.target.value)})} className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                   <div className="flex justify-between text-[9px] font-black uppercase text-slate-800 italic"><span>Baixo Domínio</span><span>Alta Proficiência</span></div>
                </div>
              ))}</div>
              <div className="flex gap-10 pt-10"><button onClick={() => setStep(2)} className="w-1/4 text-slate-600 uppercase font-black text-[14px] tracking-widest italic">Voltar</button><button onClick={() => setStep(4)} className="w-3/4 bg-white text-slate-950 py-10 rounded-[60px] font-black uppercase text-xs tracking-[0.4em] shadow-2xl hover:bg-cyan-500 transition-all italic">Fase Final: Dossiê Bio</button></div>
            </motion.div>
          )}

          {/* PASSO 4: BIO E FINALIZAÇÃO */}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12 text-left relative z-10">
               <div className="space-y-6"><p className="text-[14px] font-black uppercase text-slate-600 ml-10 tracking-widest flex items-center gap-5 italic"><Award size={24} className="text-cyan-500"/> Trajetória Consolidada (Bio Técnica de Elite)</p><textarea value={formData.experience_bio} onChange={e => setFormData({...formData, experience_bio: e.target.value})} placeholder="Descreva seus maiores desafios superados..." className="w-full bg-slate-950 border border-white/5 p-16 rounded-[80px] text-white text-md h-72 italic outline-none focus:border-cyan-500 leading-relaxed shadow-inner" /></div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
                  <label className="cursor-pointer bg-cyan-500/5 border-2 border-dashed border-cyan-500/20 p-20 rounded-[80px] flex flex-col items-center gap-6 hover:border-cyan-500 transition-all duration-1000 group shadow-2xl">
                    <div className={`p-10 rounded-full transition-all duration-1000 ${formData.resumeName ? 'bg-green-500/20 text-green-500 shadow-glow' : 'bg-cyan-500/10 text-cyan-500'}`}>{formData.resumeName ? <BadgeCheck size={70} /> : <Upload size={70} />}</div>
                    <span className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-400 group-hover:text-white transition-colors">{formData.resumeName ? `Auditado: ${formData.resumeName}` : 'Upload Currículo Profissional (PDF)'}</span>
                    <input type="file" className="hidden" accept=".pdf" onChange={e => setFormData({...formData, resumeName: e.target.files?.[0]?.name || ""})} />
                  </label>
                  <div className="p-16 bg-slate-950 border border-white/5 rounded-[80px] flex flex-col justify-center text-center relative overflow-hidden group"><Zap size={48} className="text-cyan-500 mx-auto mb-10 animate-pulse"/><p className="text-sm text-slate-500 italic leading-loose">Sua trilha discovery termina aqui. Nossa IA processará sua **Matriz comportamental** e fará o matching estratégico.</p></div>
               </div>
               <button onClick={handleFinalSubmit} className="w-full bg-cyan-500 text-slate-950 py-12 rounded-[70px] font-black uppercase text-xs tracking-[0.8em] shadow-2xl italic hover:bg-white transition-all duration-1000 shadow-cyan-500/30">Finalizar Protocolo de Elite</button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}