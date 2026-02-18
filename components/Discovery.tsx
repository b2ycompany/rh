"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, Upload, CheckCircle2, ChevronRight, Search, ArrowLeft, UserCircle, Star, Target, MapPin, 
  Linkedin, Globe, Users, ShieldCheck, Zap, Info, Briefcase, FileText, BadgeCheck, Cpu, Layers, 
  Database, Link, Heart, Glasses, TrendingUp, BarChart3, Fingerprint, Rocket, Mail, Award, 
  Users2, Sparkles, Smile, ShieldAlert, Lock, Home, Map, RefreshCw, Baby, ClipboardList, Building2
} from 'lucide-react';

/**
 * @component Discovery
 * @description Onboarding exaustivo para plataforma RH Lion Solution.
 * @features ViaCEP Integral, DISC 4 Dimensões (Obrigatório), OCEAN Big Five (Obrigatório).
 */

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
    marital_status: "Solteiro(a)", hobbies: "", has_children: "Não", num_children: 0,
    logradouro: "", bairro: "", cidade: "", uf: "", numero: "",
    area: initialData?.area || "", custom_area: "", seniority: initialData?.seniority || "Junior",
    experience_bio: "", behavioral_profile: "", soft_skills: [] as string[],
    company_name: "", company_site: "", job_title: "", job_description: "",
    // OCEAN - Escala 1 a 10 (Inicia em 0 para forçar obrigatoriedade)
    ocean_openness: 0, ocean_conscientiousness: 0, ocean_extraversion: 0, ocean_agreeableness: 0, ocean_neuroticism: 0,
    // DISC Situacional
    disc_q1: "", disc_q2: "", disc_q3: "", disc_q4: "",
    resumeName: ""
  });

  // --- VALIDAÇÕES DE TRAVA ---
  const isDiscComplete = formData.disc_q1 && formData.disc_q2 && formData.disc_q3 && formData.disc_q4;
  const isOceanComplete = formData.ocean_openness > 0 && formData.ocean_conscientiousness > 0 && formData.ocean_extraversion > 0 && formData.ocean_agreeableness > 0 && formData.ocean_neuroticism > 0;

  const discQuestions = [
    { id: "q1", title: "Como você reage a prazos curtos e alta pressão?", options: [{label: "Acelero a execução para bater a meta", val: "Executor"}, {label: "Mobilizo as pessoas para apoio mútuo", val: "Comunicador"}, {label: "Analiso detalhadamente os riscos técnicos", val: "Analítico"}, {label: "Mantenho o plano estável e seguro", val: "Planejador"}] },
    { id: "q2", title: "Qual seu papel em conflitos de squad?", options: [{label: "Sou direto e resolvo o impasse", val: "Executor"}, {label: "Tento mediar com diplomacia e conversa", val: "Comunicador"}, {label: "Uso dados lógicos para convencer", val: "Analítico"}, {label: "Escuto todos para buscar o consenso", val: "Planejador"}] },
    { id: "q3", title: "O que te motiva em novos projetos?", options: [{label: "A superação de obstáculos complexos", val: "Executor"}, {label: "A interação constante com o time", val: "Comunicador"}, {label: "A profundidade técnica e lógica", val: "Analítico"}, {label: "A clareza e organização das tarefas", val: "Planejador"}] },
    { id: "q4", title: "Como você lida com mudanças de escopo?", options: [{label: "Adapto rápido e busco o resultado", val: "Executor"}, {label: "Influencio o time a aceitar o novo", val: "Comunicador"}, {label: "Avalio o impacto técnico e os logs", val: "Analítico"}, {label: "Organizo os novos prazos de forma calma", val: "Planejador"}] }
  ];

  const oceanTraits = [
    { key: "ocean_openness", label: "Abertura (Openness)", desc: "Busca por inovação e criatividade técnica." },
    { key: "ocean_conscientiousness", label: "Conscienciosidade", desc: "Organização, dever e autodisciplina." },
    { key: "ocean_extraversion", label: "Extroversão", desc: "Sociabilidade e energia em interações sociais." },
    { key: "ocean_agreeableness", label: "Amabilidade", desc: "Capacidade de empatia e cooperação mútua." },
    { key: "ocean_neuroticism", label: "Neuroticismo", desc: "Estabilidade emocional sob pressão de bugs." }
  ];

  // --- MOTOR VIACEP INTEGRAL ---
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
          region: `${data.localidade}/${data.uf}`
        }));
      }
    } finally { setIsCepLoading(false); }
  };

  const handleFinalSubmit = () => {
    const counts: any = { Executor: 0, Comunicador: 0, Analítico: 0, Planejador: 0 };
    [formData.disc_q1, formData.disc_q2, formData.disc_q3, formData.disc_q4].forEach(v => { if(v) counts[v]++ });
    const mainProfile = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    onSubmit({ ...formData, behavioral_profile: mainProfile });
  };

  return (
    <section className="container mx-auto px-6 max-w-6xl py-12 text-left">
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/60 p-10 md:p-20 rounded-[80px] border border-cyan-500/20 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none"><BrainCircuit size={450} className="text-cyan-500" /></div>

        <div className="mb-16 flex flex-col md:flex-row justify-between items-start border-b border-white/5 pb-12 gap-10 relative z-10">
          <div className="flex items-center gap-10">
            <div className="p-8 bg-cyan-500/10 rounded-[45px] border border-cyan-500/20 text-cyan-500 shadow-glow">{role === 'candidate' ? <ShieldCheck size={48} /> : <Building2 size={48}/>}</div>
            <div className="text-left">
              <h2 className="text-4xl font-black uppercase italic text-white tracking-tighter leading-none">{role === 'candidate' ? 'Protocolo Candidato' : 'Protocolo Contratante'}</h2>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.6em] mt-3 italic flex items-center gap-3"><Rocket size={14} className="text-cyan-500"/> Lion Rising • Dossiê v8.0</p>
            </div>
          </div>
          <div className="flex gap-4">
            {[0, 1, 2, 3, 4].map((i) => (<div key={i} className={`h-2.5 rounded-full transition-all duration-700 ${step === i ? 'w-16 bg-cyan-500 shadow-glow' : 'w-5 bg-white/10'}`} />))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* FASE 0: RH & LOCALIZAÇÃO TOTAL */}
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} className="space-y-12 text-left relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4"><label className="text-[11px] font-black uppercase text-slate-600 ml-8 tracking-widest italic flex items-center gap-3"><UserCircle size={14} className="text-cyan-500"/> Nome Completo</label><input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Identificação" className="w-full bg-slate-950 border border-white/5 p-8 rounded-[35px] outline-none focus:border-cyan-500 text-white text-sm shadow-inner" /></div>
                <div className="space-y-4"><label className="text-[11px] font-black uppercase text-slate-600 ml-8 tracking-widest italic flex items-center gap-3"><Mail size={14} className="text-cyan-500"/> E-mail Profissional</label><input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="contato@empresa.com" className="w-full bg-slate-950 border border-white/5 p-8 rounded-[35px] outline-none focus:border-cyan-500 text-white text-sm shadow-inner" /></div>
              </div>

              {role === 'candidate' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 animate-in fade-in duration-1000">
                  <div className="space-y-4"><label className="text-[11px] font-black uppercase text-slate-600 ml-8 tracking-widest italic">Estado Civil</label><select value={formData.marital_status} onChange={e => setFormData({...formData, marital_status: e.target.value})} className="w-full bg-slate-950 border border-white/5 p-8 rounded-[35px] text-white text-sm outline-none appearance-none cursor-pointer"><option>Solteiro(a)</option><option>Casado(a)</option><option>União Estável</option><option>Divorciado(a)</option></select></div>
                  <div className="space-y-4"><label className="text-[11px] font-black uppercase text-slate-600 ml-8 tracking-widest italic flex items-center gap-3"><Baby size={14} className="text-cyan-500"/> Tem Filhos?</label><select value={formData.has_children} onChange={e => setFormData({...formData, has_children: e.target.value})} className="w-full bg-slate-950 border border-white/5 p-8 rounded-[35px] text-white text-sm outline-none appearance-none"><option>Não</option><option>Sim</option></select></div>
                  <div className="space-y-4"><label className="text-[11px] font-black uppercase text-slate-600 ml-8 tracking-widest italic flex items-center gap-3"><Heart size={14} className="text-red-500"/> Hobby</label><input value={formData.hobbies} onChange={e => setFormData({...formData, hobbies: e.target.value})} placeholder="Ex: Chess, Surf..." className="w-full bg-slate-950 border border-white/5 p-8 rounded-[35px] outline-none focus:border-cyan-500 text-white text-sm italic shadow-inner" /></div>
                </div>
              )}

              <div className="space-y-8 bg-slate-950/40 p-10 rounded-[60px] border border-white/5 shadow-inner">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="space-y-4"><label className="text-[11px] font-black uppercase text-slate-600 ml-8 tracking-widest italic flex items-center gap-3"><Search size={14} className="text-cyan-500"/> CEP Localidade</label><div className="relative"><input value={formData.cep} onChange={e => setFormData({...formData, cep: e.target.value})} onBlur={handleCepSearch} placeholder="00000-000" className="w-full bg-slate-950 border border-white/5 p-8 rounded-[35px] outline-none focus:border-cyan-500 text-white text-sm font-mono tracking-widest transition-all shadow-inner" /><div className="absolute right-8 top-1/2 -translate-y-1/2">{isCepLoading && <RefreshCw size={22} className="text-cyan-500 animate-spin" />}</div></div></div>
                  <div className="md:col-span-2 space-y-4"><label className="text-[11px] font-black uppercase text-slate-600 ml-8 tracking-widest italic flex items-center gap-3"><Map size={14} className="text-cyan-500"/> Endereço Completo (Fetch)</label><input value={formData.logradouro ? `${formData.logradouro}, ${formData.bairro} - ${formData.cidade}/${formData.uf}` : ""} readOnly className="w-full bg-slate-900 border border-white/5 p-8 rounded-[35px] text-slate-600 text-xs italic outline-none cursor-not-allowed" /></div>
                </div>
                <div className="space-y-4"><label className="text-[11px] font-black uppercase text-slate-600 ml-8 tracking-widest italic flex items-center gap-3"><Home size={14} className="text-cyan-500"/> Número da Residência / Sede</label><input value={formData.numero} onChange={e => setFormData({...formData, numero: e.target.value})} placeholder="Preencha o número manual" className="w-full bg-slate-950 border border-cyan-500/40 p-8 rounded-[35px] text-white text-sm font-black outline-none focus:border-cyan-500 shadow-glow" /></div>
              </div>

              <button onClick={() => setStep(1)} className="w-full bg-white text-slate-950 py-12 rounded-[70px] font-black uppercase text-xs tracking-[0.8em] hover:bg-cyan-500 transition-all duration-1000 shadow-2xl flex items-center justify-center gap-8 italic">Avançar Identificação <ChevronRight size={28}/></button>
            </motion.div>
          )}

          {/* FASE 1: EXPERTISE OU VAGA */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-14 text-left relative z-10">
              {role === 'candidate' ? (
                <>
                  <div className="space-y-8"><label className="text-[14px] font-black uppercase text-slate-600 ml-10 tracking-[0.4em] flex items-center gap-5 italic"><Briefcase size={24} className="text-cyan-500"/> Vertical técnica</label><div className="grid grid-cols-2 md:grid-cols-6 gap-6">{["Desenvolvedor", "QA / Tester", "Gerente", "Infra", "Arquiteto", "Outra"].map(a => (<button key={a} onClick={() => setFormData({...formData, area: a})} className={`p-10 border rounded-[50px] text-[11px] font-black uppercase transition-all duration-1000 ${formData.area === a ? 'bg-cyan-500 border-cyan-500 text-slate-950 shadow-glow scale-110' : 'bg-slate-950 border-white/10 text-slate-500 hover:border-cyan-500/50'}`}>{a}</button>))}</div></div>
                  <div className="space-y-10"><p className="text-[14px] font-black uppercase text-slate-600 ml-10 tracking-[0.4em] flex items-center gap-5 italic"><TrendingUp size={24} className="text-cyan-500"/> Senioridade de Carreira</p><div className="flex gap-8 px-4">{["Junior", "Pleno", "Senior"].map(s => (<button key={s} onClick={() => setFormData({...formData, seniority: s})} className={`w-32 h-20 rounded-[35px] font-black text-xs uppercase transition-all duration-1000 ${formData.seniority === s ? 'bg-cyan-500 text-slate-950 scale-125 shadow-glow' : 'bg-slate-950 border border-white/10 text-slate-500 hover:border-white'}`}>{s}</button>))}</div></div>
                </>
              ) : (
                <div className="space-y-10">
                  <div className="space-y-4"><label className="text-[11px] font-black uppercase text-slate-600 ml-8 tracking-widest italic flex items-center gap-3"><ClipboardList size={14} className="text-cyan-500"/> Título da Oportunidade</label><input value={formData.job_title} onChange={e => setFormData({...formData, job_title: e.target.value})} placeholder="Ex: Arquiteto de Soluções" className="w-full bg-slate-950 border border-white/5 p-8 rounded-[35px] outline-none focus:border-cyan-500 text-white text-sm shadow-inner" /></div>
                  <div className="space-y-4"><label className="text-[11px] font-black uppercase text-slate-600 ml-8 tracking-widest italic flex items-center gap-3"><FileText size={14} className="text-cyan-500"/> Descritivo Técnico</label><textarea value={formData.job_description} onChange={e => setFormData({...formData, job_description: e.target.value})} placeholder="Requisitos e Stack..." className="w-full bg-slate-950 border border-white/5 p-12 rounded-[60px] text-white text-sm h-56 italic outline-none focus:border-cyan-500" /></div>
                  <div className="space-y-6"><p className="text-[11px] font-black uppercase text-slate-600 ml-8 tracking-widest italic">Senioridade Desejada</p><div className="flex gap-6">{["Junior", "Pleno", "Senior"].map(s => (<button key={s} onClick={() => setFormData({...formData, seniority: s})} className={`px-12 py-5 rounded-[40px] font-black text-xs uppercase transition-all ${formData.seniority === s ? 'bg-cyan-500 text-slate-950' : 'bg-slate-950 border border-white/5 text-slate-500'}`}>{s}</button>))}</div></div>
                </div>
              )}
              <div className="flex gap-10 pt-10"><button onClick={() => setStep(0)} className="w-1/4 text-slate-600 uppercase font-black text-[15px] tracking-widest italic flex items-center justify-center gap-5 hover:text-white transition-all duration-500"><ArrowLeft size={22}/> Voltar</button><button onClick={() => setStep(role === 'candidate' ? 2 : 4)} className="w-3/4 bg-white text-slate-950 py-12 rounded-[70px] font-black uppercase text-xs tracking-[0.7em] shadow-2xl hover:bg-cyan-500 transition-all italic">{role === 'candidate' ? 'Fase DISC (Obrigatória)' : 'Revisão do Protocolo'}</button></div>
            </motion.div>
          )}

          {/* FASE 2: DISC (OBRIGATÓRIO) */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="space-y-20 text-left relative z-10">
              <div className="space-y-20">
                 {discQuestions.map((q, idx) => (
                   <div key={q.id} className="space-y-10 border-l-4 border-cyan-500/20 pl-10 group hover:border-cyan-500 transition-colors duration-1000">
                      <p className="text-[18px] font-black uppercase text-white tracking-widest flex items-center gap-6 italic leading-relaxed"><Fingerprint size={32} className="text-cyan-500"/> {idx + 1}. {q.title}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {q.options.map(o => (
                          <button key={o.label} onClick={() => setFormData({...formData, [`disc_${q.id}`]: o.val})} className={`p-10 border rounded-[70px] text-left text-sm font-bold transition-all duration-1000 ${(formData as any)[`disc_${q.id}`] === o.val ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-glow scale-105' : 'bg-slate-950 border-white/10 text-slate-400 hover:border-cyan-500/30'}`}>{o.label}</button>
                        ))}
                      </div>
                   </div>
                 ))}
              </div>
              <div className="flex gap-10 pt-10"><button onClick={() => setStep(1)} className="w-1/4 text-slate-600 uppercase font-black text-[15px] tracking-widest italic">Voltar</button><button disabled={!isDiscComplete} onClick={() => setStep(3)} className={`w-3/4 py-12 rounded-[70px] font-black uppercase text-xs tracking-[0.7em] transition-all italic ${isDiscComplete ? 'bg-white text-slate-950 hover:bg-cyan-500 shadow-2xl shadow-cyan-500/20' : 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50'}`}>{isDiscComplete ? 'Próximo: OCEAN (Obrigatório)' : 'Responda todas para prosseguir'}</button></div>
            </motion.div>
          )}

          {/* FASE 3: OCEAN (OBRIGATÓRIO) */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-16 text-left relative z-10">
              <div className="flex items-center gap-8 border-l-8 border-purple-500 pl-10 py-6 bg-purple-500/5 rounded-r-3xl shadow-inner"><Glasses size={56} className="text-purple-500"/><h3 className="text-4xl font-black uppercase italic text-white tracking-tighter leading-none">Avaliação <span className="text-purple-500 font-black italic">OCEAN (Big Five)</span></h3></div>
              <div className="grid gap-14">{oceanTraits.map(t => (
                <div key={t.key} className="space-y-10 bg-slate-950/60 p-12 rounded-[80px] border border-white/5 group hover:border-cyan-500/20 transition-all duration-1000 shadow-2xl relative">
                   <div className="flex justify-between items-center relative z-10"><div className="space-y-3"><p className="text-xl font-black text-white uppercase italic tracking-widest leading-none">{t.label}</p><p className="text-[12px] text-slate-600 uppercase tracking-widest font-bold leading-relaxed">{t.desc}</p></div><span className="text-5xl font-mono font-black text-cyan-500 italic">{(formData as any)[t.key]}/10</span></div>
                   <input type="range" min="1" max="10" step="1" value={(formData as any)[t.key]} onChange={e => setFormData({...formData, [t.key]: parseInt(e.target.value)})} className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-cyan-500 shadow-inner" />
                </div>
              ))}</div>
              <div className="flex gap-10 pt-10"><button onClick={() => setStep(2)} className="w-1/4 text-slate-600 uppercase font-black text-[15px] tracking-widest italic">Voltar</button><button disabled={!isOceanComplete} onClick={() => setStep(4)} className={`w-3/4 py-12 rounded-[70px] font-black uppercase text-xs tracking-[0.7em] transition-all italic ${isOceanComplete ? 'bg-white text-slate-950 hover:bg-cyan-500 shadow-2xl' : 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50'}`}>{isOceanComplete ? 'Fase Final: Dossiê Bio' : 'Avalie os traços para prosseguir'}</button></div>
            </motion.div>
          )}

          {/* FASE 4: BIO FINAL & UPLOAD CV */}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-16 text-left relative z-10">
               {role === 'candidate' && (
                 <div className="space-y-12 animate-in fade-in duration-1000">
                    <div className="space-y-8"><p className="text-[18px] font-black uppercase text-slate-600 ml-12 tracking-[0.5em] flex items-center gap-6 italic font-black"><Award size={36} className="text-cyan-500"/> Trajetória Consolidada de Elite</p><textarea value={formData.experience_bio} onChange={e => setFormData({...formData, experience_bio: e.target.value})} placeholder="Resuma seus maiores desafios técnicos, impactos em squads e senioridade aplicada..." className="w-full bg-slate-950 border border-white/5 p-20 rounded-[100px] text-white text-lg h-96 italic outline-none focus:border-cyan-500 leading-loose shadow-inner transition-all scrollbar-hide" /></div>
                    <label className="cursor-pointer bg-cyan-500/5 border-2 border-dashed border-cyan-500/20 p-24 rounded-[100px] flex flex-col items-center gap-8 hover:border-cyan-500 transition-all duration-1000 group shadow-2xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-cyan-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-1000" />
                      <div className={`p-12 rounded-full transition-all duration-1000 relative z-10 ${formData.resumeName ? 'bg-green-500/20 text-green-500 shadow-[0_0_50px_rgba(34,197,94,0.3)]' : 'bg-cyan-500/10 text-cyan-500 shadow-glow'}`}>{formData.resumeName ? <BadgeCheck size={80} /> : <Upload size={80} />}</div>
                      <div className="text-center relative z-10"><span className="block text-[14px] font-black uppercase tracking-[0.4em] text-white mb-2">{formData.resumeName ? 'Documento Carregado' : 'Upload CV Profissional (PDF)'}</span><span className="text-[10px] text-slate-500 uppercase tracking-widest">{formData.resumeName || 'Clique para selecionar seu currículo'}</span></div>
                      <input type="file" className="hidden" accept=".pdf" onChange={e => setFormData({...formData, resumeName: e.target.files?.[0]?.name || ""})} />
                    </label>
                 </div>
               )}
               <div className="p-16 bg-slate-950 border border-white/5 rounded-[100px] flex flex-col justify-center text-center shadow-2xl border-l-4 border-l-cyan-500"><Zap size={56} className="text-cyan-500 mx-auto mb-10 animate-pulse"/><p className="text-md text-slate-500 italic leading-loose font-light px-8">Ao clicar em finalizar, o protocolo será auditado pela **Governança Lion Solution** para matching estratégico.</p></div>
               <button onClick={handleFinalSubmit} className="w-full bg-cyan-500 text-slate-950 py-16 rounded-[80px] font-black uppercase text-[16px] tracking-[1.2em] shadow-2xl italic hover:bg-white transition-all duration-1000 shadow-cyan-500/40">Finalizar Protocolo de Elite</button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}