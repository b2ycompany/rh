"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, Upload, CheckCircle2, ChevronRight, Search, ArrowLeft, UserCircle, Star, Target, MapPin, 
  Linkedin, Globe, Users, ShieldCheck, Zap, Info, Briefcase, FileText, BadgeCheck, Cpu, Layers, 
  Database, Link, Heart, Glasses, TrendingUp, BarChart3, Fingerprint, Rocket, Mail, Award, 
  Users2, Sparkles, Smile, ShieldAlert, Lock, Home, Map
} from 'lucide-react';

/**
 * @component Discovery
 * @description Onboarding exaustivo para plataforma RH Tammy.
 * @features ViaCEP Integral, DISC 4 Dimensões, OCEAN Big Five, Governança de Dados RH.
 */

interface DiscoveryProps {
  role: 'candidate' | 'client' | null;
  initialData?: { area?: string; seniority?: string; };
  onSubmit: (data: any) => void;
}

export default function Discovery({ role, initialData, onSubmit }: DiscoveryProps) {
  // --- ESTADOS DE FLUXO E GESTÃO DE DADOS ---
  const [step, setStep] = useState(0);
  const [isCepLoading, setIsCepLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "", email: "", whatsapp: "", cep: "", cpf_cnpj: "",
    marital_status: "Não Informado", hobbies: "",
    logradouro: "", bairro: "", cidade: "", uf: "", numero: "", region: "",
    area: initialData?.area || "", custom_area: "", seniority: initialData?.seniority || "Junior",
    experience_bio: "", behavioral_profile: "", soft_skills: [] as string[],
    company: "", company_site: "", quantity: 1, resumeName: "",
    tech_level: "3", market_segments: [] as string[], situational_response: "",
    // Psicometria OCEAN (Big Five)
    ocean_openness: 5, ocean_conscientiousness: 5, ocean_extraversion: 5, ocean_agreeableness: 5, ocean_neuroticism: 5,
    // Matriz DISC Situacional
    disc_q1: "", disc_q2: "", disc_q3: "", disc_q4: ""
  });

  const discQuestions = [
    { 
      id: "q1", 
      title: "Como você lida com metas agressivas e prazos curtos?", 
      options: [
        { label: "Foco total na execução técnica e no prazo final", val: "Executor" },
        { label: "Influencio e mobilizo o time para atingirmos juntos", val: "Comunicador" },
        { label: "Analiso o processo detalhadamente para evitar falhas", val: "Analítico" },
        { label: "Mantenho o planejamento e evito mudanças bruscas", val: "Planejador" }
      ] 
    },
    { 
      id: "q2", 
      title: "Qual seu comportamento em conflitos de squad?", 
      options: [
        { label: "Sou direto e resolvo o problema na hora", val: "Executor" },
        { label: "Uso a diplomacia para apaziguar os ânimos", val: "Comunicador" },
        { label: "Uso dados, fatos e lógica para decidir", val: "Analítico" },
        { label: "Escuto todos para buscar o consenso e harmonia", val: "Planejador" }
      ] 
    },
    { 
      id: "q3", 
      title: "O que mais te motiva em novos projetos?", 
      options: [
        { label: "O desafio de superar grandes obstáculos", val: "Executor" },
        { label: "A oportunidade de interagir com novas pessoas", val: "Comunicador" },
        { label: "A complexidade técnica e o aprendizado estruturado", val: "Analítico" },
        { label: "A clareza das metas e a organização do fluxo", val: "Planejador" }
      ] 
    },
    { 
      id: "q4", 
      title: "Como você prefere receber e dar feedback?", 
      options: [
        { label: "De forma rápida, direta e focada em metas", val: "Executor" },
        { label: "Em uma conversa aberta e inspiradora", val: "Comunicador" },
        { label: "Com evidências lógicas e documentação técnica", val: "Analítico" },
        { label: "De maneira calma, privada e tranquila", val: "Planejador" }
      ] 
    }
  ];

  const oceanTraits = [
    { key: "ocean_openness", label: "Openness (Abertura)", desc: "Busca por inovação e criatividade técnica." },
    { key: "ocean_conscientiousness", label: "Conscienciosidade", desc: "Organização, dever e autodisciplina em squads." },
    { key: "ocean_extraversion", label: "Extroversão", desc: "Sociabilidade e energia em interações externas." },
    { key: "ocean_agreeableness", label: "Amabilidade", desc: "Capacidade de empatia e cooperação mútua." },
    { key: "ocean_neuroticism", label: "Neuroticismo", desc: "Estabilidade emocional e resposta ao estresse." }
  ];

  const softSkillsOptions = [
    { label: "Liderança Estratégica", icon: <BadgeCheck size={14}/> },
    { label: "Resiliência Operacional", icon: <Cpu size={14}/> },
    { label: "Foco em Dados", icon: <Database size={14}/> },
    { label: "Trabalho em Equipe", icon: <Users size={14}/> },
    { label: "Agilidade Adaptativa", icon: <Zap size={14}/> },
    { label: "Comunicação Assertiva", icon: <Info size={14}/> }
  ];

  // --- MOTORES DE MÁSCARA ---
  const maskPhone = (v: string) => v.replace(/\D/g, "").replace(/^(\d{2})(\d)/g, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2").substring(0, 15);
  const maskCEP = (v: string) => v.replace(/\D/g, "").replace(/^(\d{5})(\d)/, "$1-$2").substring(0, 9);
  const maskCPFCNPJ = (v: string) => {
    const val = v.replace(/\D/g, "");
    if (val.length <= 11) return val.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4").substring(0, 14);
    return val.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5").substring(0, 18);
  };

  // --- MOTOR VIACEP INTEGRAL (RUA, BAIRRO, CIDADE, ESTADO) ---
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
          region: `${data.localidade} - ${data.uf}`
        }));
      }
    } finally { setIsCepLoading(false); }
  };

  const generateRHAnalysis = () => {
    const skills = formData.soft_skills.join(", ");
    const counts: any = { Executor: 0, Comunicador: 0, Analítico: 0, Planejador: 0 };
    [formData.disc_q1, formData.disc_q2, formData.disc_q3, formData.disc_q4].forEach(v => { if(v) counts[v]++ });
    const mainProfile = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);

    return { 
      behavioral_profile: mainProfile,
      skills_summary: `Talento nível ${formData.tech_level}/5 em ${formData.area}. OCEAN balanceado. Hobby: ${formData.hobbies}.`,
      behavioral_summary: `Perfil DISC: ${mainProfile}. Status: ${formData.marital_status}. Reage via ${formData.situational_response}.`,
      soft_skills: skills,
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
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.6em] mt-3 italic flex items-center gap-3"><Rocket size={14} className="text-cyan-500"/> Lion Solution • Deep Analysis v7.2</p>
            </div>
          </div>
          <div className="flex gap-4">
            {[0, 1, 2, 3, 4].map((i) => (<div key={i} className={`h-2.5 rounded-full transition-all duration-700 ${step === i ? 'w-16 bg-cyan-500 shadow-glow' : 'w-5 bg-white/10'}`} />))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* FASE 0: RH & LOCALIZAÇÃO INTEGRAL */}
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} className="space-y-12 text-left relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4"><label className="text-[11px] font-black uppercase text-slate-600 ml-8 tracking-widest italic flex items-center gap-3"><UserCircle size={14} className="text-cyan-500"/> Nome Completo</label><input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Identificação" className="w-full bg-slate-950 border border-white/5 p-8 rounded-[35px] outline-none focus:border-cyan-500 text-white text-sm shadow-inner" /></div>
                <div className="space-y-4"><label className="text-[11px] font-black uppercase text-slate-600 ml-8 tracking-widest italic flex items-center gap-3"><Mail size={14} className="text-cyan-500"/> E-mail Profissional</label><input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="contato@empresa.com" className="w-full bg-slate-950 border border-white/5 p-8 rounded-[35px] outline-none focus:border-cyan-500 text-white text-sm shadow-inner" /></div>
              </div>

              {/* DADOS RH: APENAS PARA CANDIDATO */}
              {role === 'candidate' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 animate-in fade-in duration-1000">
                  <div className="space-y-4"><label className="text-[11px] font-black uppercase text-slate-600 ml-8 tracking-widest italic">WhatsApp Direct</label><input value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: maskPhone(e.target.value)})} placeholder="(00) 00000-0000" className="w-full bg-slate-950 border border-white/5 p-8 rounded-[35px] outline-none focus:border-cyan-500 text-white text-sm font-mono tracking-wider shadow-inner" /></div>
                  <div className="space-y-4"><label className="text-[11px] font-black uppercase text-slate-600 ml-8 tracking-widest italic">Estado Civil</label><select value={formData.marital_status} onChange={e => setFormData({...formData, marital_status: e.target.value})} className="w-full bg-slate-950 border border-white/5 p-8 rounded-[35px] text-white text-sm outline-none appearance-none cursor-pointer"><option>Solteiro(a)</option><option>Casado(a)</option><option>União Estável</option><option>Divorciado(a)</option></select></div>
                  <div className="space-y-4"><label className="text-[11px] font-black uppercase text-slate-600 ml-8 tracking-widest italic flex items-center gap-3"><Heart size={14} className="text-red-500"/> Hobby / Paixão</label><input value={formData.hobbies} onChange={e => setFormData({...formData, hobbies: e.target.value})} placeholder="Ex: Chess, Surf..." className="w-full bg-slate-950 border border-white/5 p-8 rounded-[35px] outline-none focus:border-cyan-500 text-white text-sm italic shadow-inner" /></div>
                </div>
              )}

              {/* LOCALIZAÇÃO INTEGRAL VIACEP */}
              <div className="space-y-8 bg-slate-950/40 p-10 rounded-[60px] border border-white/5 shadow-inner">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="space-y-4"><label className="text-[11px] font-black uppercase text-slate-600 ml-8 tracking-widest italic flex items-center gap-3"><Search size={14} className="text-cyan-500"/> CEP Localidade</label><div className="relative"><input value={formData.cep} onChange={e => setFormData({...formData, cep: maskCEP(e.target.value)})} onBlur={handleCepSearch} placeholder="00000-000" className="w-full bg-slate-950 border border-white/5 p-8 rounded-[35px] outline-none focus:border-cyan-500 text-white text-sm font-mono transition-all" /><div className="absolute right-8 top-1/2 -translate-y-1/2">{isCepLoading && <div className="w-6 h-6 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" />}</div></div></div>
                  <div className="md:col-span-2 space-y-4"><label className="text-[11px] font-black uppercase text-slate-600 ml-8 tracking-widest italic flex items-center gap-3"><Home size={14} className="text-cyan-500"/> Logradouro Completo</label><input value={formData.logradouro} readOnly className="w-full bg-slate-900 border border-white/5 p-8 rounded-[35px] text-slate-500 text-xs italic outline-none cursor-not-allowed" /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="space-y-4"><label className="text-[11px] font-black uppercase text-slate-600 ml-8 tracking-widest italic">Número</label><input value={formData.numero} onChange={e => setFormData({...formData, numero: e.target.value})} placeholder="Ex: 123" className="w-full bg-slate-950 border border-cyan-500/40 p-8 rounded-[35px] text-white text-sm font-black outline-none focus:border-cyan-500 shadow-glow" /></div>
                  <div className="space-y-4"><label className="text-[11px] font-black uppercase text-slate-600 ml-8 tracking-widest italic">Bairro</label><input value={formData.bairro} readOnly className="w-full bg-slate-900 border border-white/5 p-8 rounded-[35px] text-slate-500 text-xs italic" /></div>
                  <div className="space-y-4"><label className="text-[11px] font-black uppercase text-slate-600 ml-8 tracking-widest italic">Cidade</label><input value={formData.cidade} readOnly className="w-full bg-slate-900 border border-white/5 p-8 rounded-[35px] text-slate-500 text-xs italic" /></div>
                  <div className="space-y-4"><label className="text-[11px] font-black uppercase text-slate-600 ml-8 tracking-widest italic">UF</label><input value={formData.uf} readOnly className="w-full bg-slate-900 border border-white/5 p-8 rounded-[35px] text-slate-500 text-xs italic text-center" /></div>
                </div>
              </div>

              <button onClick={() => setStep(1)} className="w-full bg-white text-slate-950 py-12 rounded-[70px] font-black uppercase text-xs tracking-[0.8em] hover:bg-cyan-500 transition-all duration-1000 mt-12 shadow-2xl flex items-center justify-center gap-8 italic">Efetivar Identificação <ChevronRight size={28}/></button>
            </motion.div>
          )}

          {/* FASE 1: TÉCNICO */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-14 text-left relative z-10">
              <div className="space-y-8"><label className="text-[14px] font-black uppercase text-slate-600 ml-10 tracking-[0.4em] flex items-center gap-5 italic"><Briefcase size={24} className="text-cyan-500"/> Vertical técnica</label><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">{["Desenvolvedor", "QA / Tester", "Gerente", "Infra", "Arquiteto", "Outra"].map(a => (<button key={a} onClick={() => setFormData({...formData, area: a})} className={`p-10 border rounded-[50px] text-[11px] font-black uppercase transition-all duration-1000 ${formData.area === a ? 'bg-cyan-500 border-cyan-500 text-slate-950 shadow-glow scale-110' : 'bg-slate-950 border-white/10 text-slate-500 hover:border-cyan-500/50'}`}>{a}</button>))}</div></div>
              <div className="space-y-10"><p className="text-[14px] font-black uppercase text-slate-600 ml-10 tracking-[0.4em] flex items-center gap-5 italic"><BarChart3 size={24} className="text-cyan-500"/> Rank de senioridade real (1-5)</p><div className="flex gap-8 px-4">{[1, 2, 3, 4, 5].map(n => (<button key={n} onClick={() => setFormData({...formData, tech_level: n.toString()})} className={`w-20 h-20 rounded-[35px] font-black text-2xl transition-all duration-1000 ${formData.tech_level === n.toString() ? 'bg-cyan-500 text-slate-950 scale-125 shadow-glow' : 'bg-slate-950 border border-white/10 text-slate-500 hover:text-white'}`}>{n}</button>))}</div></div>
              <div className="flex gap-10 pt-10"><button onClick={() => setStep(0)} className="w-1/4 text-slate-600 uppercase font-black text-[15px] tracking-widest italic flex items-center justify-center gap-5"><ArrowLeft size={22}/> Voltar</button><button onClick={() => setStep(2)} className="w-3/4 bg-white text-slate-950 py-12 rounded-[70px] font-black uppercase text-xs tracking-[0.7em] shadow-2xl hover:bg-cyan-500 transition-all italic">Fase Psicométrica (DISC)</button></div>
            </motion.div>
          )}

          {/* FASE 2: MATRIZ DISC EXAUSTIVA */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="space-y-20 text-left relative z-10">
              <div className="space-y-20">
                 {discQuestions.map((q, idx) => (
                   <div key={q.id} className="space-y-10 border-l-4 border-cyan-500/20 pl-10">
                      <p className="text-[18px] font-black uppercase text-white tracking-[0.2em] flex items-center gap-6 italic leading-relaxed"><Fingerprint size={32} className="text-cyan-500"/> {idx + 1}. {q.title}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {q.options.map(o => (
                          <button key={o.label} onClick={() => setFormData({...formData, [`disc_${q.id}`]: o.val})} className={`p-12 border rounded-[70px] text-left text-sm font-bold transition-all duration-1000 ${(formData as any)[`disc_${q.id}`] === o.val ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_0_40px_rgba(6,182,212,0.4)] scale-105' : 'bg-slate-950 border-white/10 text-slate-400 hover:border-cyan-500/30'}`}>{o.label}</button>
                        ))}
                      </div>
                   </div>
                 ))}
              </div>
              <div className="flex gap-10 pt-10"><button onClick={() => setStep(1)} className="w-1/4 text-slate-600 uppercase font-black text-[15px] tracking-widest italic">Voltar</button><button onClick={() => setStep(3)} className="w-3/4 bg-white text-slate-950 py-12 rounded-[70px] font-black uppercase text-xs tracking-[0.7em] shadow-2xl hover:bg-cyan-500 transition-all italic">Fase Big Five (OCEAN)</button></div>
            </motion.div>
          )}

          {/* FASE 3: OCEAN EXAUSTIVA */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-16 text-left relative z-10">
              <div className="flex items-center gap-8 border-l-8 border-purple-500 pl-10 mb-12 py-6 bg-purple-500/5 rounded-r-3xl shadow-inner"><Glasses size={56} className="text-purple-500"/><h3 className="text-4xl font-black uppercase italic text-white tracking-tighter leading-none">Avaliação <span className="text-purple-500 font-black italic">OCEAN (Big Five)</span></h3></div>
              <div className="grid gap-14">{oceanTraits.map(t => (
                <div key={t.key} className="space-y-10 bg-slate-950/60 p-12 rounded-[80px] border border-white/5 group hover:border-cyan-500/20 transition-all duration-1000 shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-purple-500"><Sparkles size={120}/></div>
                   <div className="flex justify-between items-center relative z-10"><div className="space-y-3"><p className="text-xl font-black text-white uppercase italic tracking-widest leading-none">{t.label}</p><p className="text-[12px] text-slate-600 uppercase tracking-widest font-bold leading-relaxed">{t.desc}</p></div><span className="text-5xl font-mono font-black text-cyan-500 italic">{(formData as any)[t.key]}/10</span></div>
                   <input type="range" min="1" max="10" step="1" value={(formData as any)[t.key]} onChange={e => setFormData({...formData, [t.key]: parseInt(e.target.value)})} className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-cyan-500 shadow-inner" />
                   <div className="flex justify-between text-[11px] font-black uppercase text-slate-800 italic tracking-[0.2em] px-6"><span>Baixa Presença</span><span>Domínio Absoluto</span></div>
                </div>
              ))}</div>
              <div className="flex gap-10 pt-10"><button onClick={() => setStep(2)} className="w-1/4 text-slate-600 uppercase font-black text-[15px] tracking-widest italic">Voltar</button><button onClick={() => setStep(4)} className="w-3/4 bg-white text-slate-950 py-12 rounded-[70px] font-black uppercase text-xs tracking-[0.7em] shadow-2xl hover:bg-cyan-500 transition-all italic">Fase Final: Dossiê Bio</button></div>
            </motion.div>
          )}

          {/* FASE 4: BIO FINAL */}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-16 text-left relative z-10">
               <div className="space-y-10"><p className="text-[18px] font-black uppercase text-slate-600 ml-12 tracking-[0.5em] flex items-center gap-6 italic font-black"><Award size={36} className="text-cyan-500"/> Trajetória Consolidada de Elite</p><textarea value={formData.experience_bio} onChange={e => setFormData({...formData, experience_bio: e.target.value})} placeholder="Resuma seus maiores desafios técnicos aplicados nos últimos 5 anos, impacto gerado em squads e senioridade..." className="w-full bg-slate-950 border border-white/5 p-20 rounded-[100px] text-white text-lg h-[450px] italic outline-none focus:border-cyan-500 leading-loose shadow-inner transition-all scrollbar-hide" /></div>
               <button onClick={handleFinalSubmit} className="w-full bg-cyan-500 text-slate-950 py-16 rounded-[80px] font-black uppercase text-[16px] tracking-[1.2em] shadow-2xl italic hover:bg-white transition-all duration-1000 shadow-cyan-500/40 border-b-8 border-cyan-700 active:border-b-0 active:translate-y-2">Finalizar Protocolo de Elite</button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}