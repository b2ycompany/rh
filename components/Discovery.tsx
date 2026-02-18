"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, Upload, CheckCircle2, ChevronRight, Search, ArrowLeft, UserCircle, Star, Target, MapPin, 
  ShieldCheck, Zap, Briefcase, FileText, BadgeCheck, RefreshCw, Baby, ClipboardList, Building2, Heart, Glasses, TrendingUp, Fingerprint, Rocket, Mail, Award, Sparkles, Lock as LockIcon, Home
} from 'lucide-react';

interface DiscoveryProps {
  role: 'candidate' | 'client' | null;
  initialData?: { area?: string; seniority?: string; };
  onSubmit: (data: any) => void;
}

export default function Discovery({ role, initialData, onSubmit }: DiscoveryProps) {
  const [step, setStep] = useState(0);
  const [isCepLoading, setIsCepLoading] = useState(false);
  
  // Cores dinâmicas baseadas no Role para melhor UX
  const themeColor = role === 'candidate' ? 'cyan' : 'purple';
  const themeHex = role === 'candidate' ? '#06b6d4' : '#a855f7';

  const [formData, setFormData] = useState({
    name: "", email: "", whatsapp: "", cep: "", cpf_cnpj: "",
    marital_status: "Solteiro(a)", hobbies: "", has_children: "Não", num_children: 0,
    logradouro: "", bairro: "", cidade: "", uf: "", numero: "",
    area: initialData?.area || "", seniority: initialData?.seniority || "Junior",
    experience_bio: "", behavioral_profile: "", soft_skills: [] as string[],
    company_name: "", company_site: "", job_title: "", job_description: "",
    situational_response: "",
    ocean_openness: 0, ocean_conscientiousness: 0, ocean_extraversion: 0, ocean_agreeableness: 0, ocean_neuroticism: 0,
    disc_q1: "", disc_q2: "", disc_q3: "", disc_q4: "", disc_q5: "", disc_q6: "", disc_q7: "", disc_q8: "", disc_q9: "", disc_q10: "",
    resumeName: ""
  });

  const techVerticals = [
    "Backend", "Frontend", "Fullstack", "Cloud Arch", "QA / Tester", 
    "Gerente TI", "Data Science", "DevOps", "UI/UX", "Product Owner", "Cyber Sec"
  ];

  const discQuestions = [
    { id: "q1", title: "Como você reage a metas agressivas e prazos curtos?", options: [{l: "Foco total no resultado técnico", v: "Executor"}, {l: "Envolvo o time para atingirmos juntos", v: "Comunicador"}, {l: "Analiso detalhadamente os riscos", v: "Analítico"}, {l: "Mantenho o plano estável e seguro", v: "Planejador"}] },
    { id: "q2", title: "Qual seu comportamento em conflitos de squad?", options: [{l: "Sou direto e resolvo o impasse na hora", v: "Executor"}, {l: "Uso a diplomacia para apaziguar", v: "Comunicador"}, {l: "Uso dados e fatos para decidir", v: "Analítico"}, {l: "Escuto todos para buscar harmonia", v: "Planejador"}] },
    { id: "q3", title: "O que mais te motiva em novos projetos?", options: [{l: "O desafio de superar obstáculos", v: "Executor"}, {l: "A troca de experiências social", v: "Comunicador"}, {l: "A complexidade lógica do desafio", v: "Analítico"}, {l: "A clareza e organização das tarefas", v: "Planejador"}] },
    { id: "q4", title: "Como você prefere receber e dar feedbacks?", options: [{l: "Rápido e focado em melhorias", v: "Executor"}, {l: "Conversa inspiradora e franca", v: "Comunicador"}, {l: "Com evidências lógicas e logs", v: "Analítico"}, {l: "Privado, calmo e sem exposição", v: "Planejador"}] },
    { id: "q5", title: "Em reuniões de decisão técnica, você...", options: [{l: "Decido o caminho mais rápido", v: "Executor"}, {l: "Garantido que todos deem ideias", v: "Comunicador"}, {l: "Reviso cada detalhe técnico antes", v: "Analítico"}, {l: "Organizo os próximos passos lógicos", v: "Planejador"}] },
    { id: "q6", title: "Ao delegar uma tarefa complexa...", options: [{l: "Passo o comando e o prazo final", v: "Executor"}, {l: "Explico o propósito inspirador", v: "Comunicador"}, {l: "Forneço o manual técnico completo", v: "Analítico"}, {l: "Ofereço apoio total no progresso", v: "Planejador"}] },
    { id: "q7", title: "Em mudanças de última hora no escopo...", options: [{l: "Adapto e executo imediatamente", v: "Executor"}, {l: "Mantenho o time animado com o novo", v: "Comunicador"}, {l: "Questiono a lógica da mudança", v: "Analítico"}, {l: "Ajusto os prazos com segurança", v: "Planejador"}] },
    { id: "q8", title: "Para convencer alguém, você prefere usar...", options: [{l: "Autoridade e convicção técnica", v: "Executor"}, {l: "Carisma e conexão pessoal", v: "Comunicador"}, {l: "Dados, estatísticas e evidências", v: "Analítico"}, {l: "Segurança e paciência no processo", v: "Planejador"}] },
    { id: "q9", title: "Qual seu estilo de liderança em squad?", options: [{l: "Focado em metas e performance", v: "Executor"}, {l: "Focado em pessoas e engajamento", v: "Comunicador"}, {l: "Focado em qualidade e perfeição", v: "Analítico"}, {l: "Focado em processos e estabilidade", v: "Planejador"}] },
    { id: "q10", title: "Sob estresse extremo, qual seu comportamento?", options: [{l: "Fico impaciente e autoritário", v: "Executor"}, {l: "Fico impulsivo e falo demais", v: "Comunicador"}, {l: "Fico retraído e hipercrítico", v: "Analítico"}, {l: "Fico hesitante e cauteloso", v: "Planejador"}] }
  ];

  const oceanTraits = [
    { k: "ocean_openness", l: "Abertura Mental", d: "Criatividade e inovação." },
    { k: "ocean_conscientiousness", l: "Foco", d: "Disciplina e organização." },
    { k: "ocean_extraversion", l: "Social", d: "Energia e sociabilidade." },
    { k: "ocean_agreeableness", l: "Amabilidade", d: "Empatia e cooperação." },
    { k: "ocean_neuroticism", l: "Resiliência", d: "Controle sob pressão." }
  ];

  const maskCEP = (v: string) => v.replace(/\D/g, "").replace(/^(\d{5})(\d)/, "$1-$2").substring(0, 9);
  const maskTax = (v: string) => {
    const val = v.replace(/\D/g, "");
    if (val.length <= 11) return val.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4").substring(0, 14);
    return val.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5").substring(0, 18);
  };

  const handleCepSearch = async () => {
    const cleanCep = formData.cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return;
    setIsCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setFormData(prev => ({ ...prev, logradouro: data.logradouro, bairro: data.bairro, cidade: data.localidade, uf: data.uf }));
      }
    } finally { setIsCepLoading(false); }
  };

  const isDiscComplete = Object.keys(formData).filter(k => k.startsWith('disc_q')).every(k => (formData as any)[k] !== "");
  const isOceanComplete = oceanTraits.every(t => (formData as any)[t.k] > 0);

  const handleFinalSubmit = () => {
    const counts: any = { Executor: 0, Comunicador: 0, Analítico: 0, Planejador: 0 };
    Object.keys(formData).filter(k => k.startsWith('disc_q')).forEach(k => { const v = (formData as any)[k]; if(v) counts[v]++ });
    const mainProfile = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    onSubmit({ ...formData, behavioral_profile: mainProfile });
  };

  return (
    <section className="container mx-auto px-6 max-w-5xl py-12 text-left">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/80 border border-white/5 backdrop-blur-xl p-8 md:p-16 rounded-[60px] shadow-2xl relative overflow-hidden">
        
        {/* Header Consolidado */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 pb-10 border-b border-white/5 gap-8">
          <div className="flex items-center gap-6">
            <div className={`p-6 rounded-3xl bg-${themeColor}-500/10 border border-${themeColor}-500/20 text-${themeColor}-500 shadow-lg`}>
              {role === 'candidate' ? <ShieldCheck size={32} /> : <Building2 size={32}/>}
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
                {role === 'candidate' ? 'Talent Discovery' : 'Enterprise Discovery'}
              </h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                <Rocket size={12} className={`text-${themeColor}-500`}/> Protocolo Lion v8.8
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? `w-12 bg-${themeColor}-500 shadow-glow` : 'w-4 bg-white/10'}`} />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-4 flex items-center gap-2"><UserCircle size={14}/> Nome Completo</label>
                  <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Como devemos te chamar?" className="w-full bg-slate-950/50 border border-white/10 p-5 rounded-2xl outline-none focus:border-cyan-500 text-white transition-all shadow-inner" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-4 flex items-center gap-2"><Mail size={14}/> E-mail</label>
                  <input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="seu@email.com" className="w-full bg-slate-950/50 border border-white/10 p-5 rounded-2xl outline-none focus:border-cyan-500 text-white transition-all shadow-inner" />
                </div>
              </div>

              {/* ENDEREÇO UX MELHORADO */}
              <div className="bg-slate-950/30 p-8 rounded-[40px] border border-white/5 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-4 flex items-center gap-2"><LockIcon size={14}/> {role === 'candidate' ? 'CPF' : 'CNPJ'}</label>
                    <input value={formData.cpf_cnpj} onChange={e => setFormData({...formData, cpf_cnpj: maskTax(e.target.value)})} placeholder="000.000.000-00" className="w-full bg-slate-950/50 border border-white/10 p-5 rounded-2xl outline-none text-white font-mono shadow-inner" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-4 flex items-center gap-2"><Search size={14}/> CEP</label>
                    <div className="relative">
                      <input value={formData.cep} onChange={e => setFormData({...formData, cep: maskCEP(e.target.value)})} onBlur={handleCepSearch} placeholder="00000-000" className="w-full bg-slate-950/50 border border-white/10 p-5 rounded-2xl outline-none focus:border-cyan-500 text-white font-mono shadow-inner" />
                      {isCepLoading && <RefreshCw className="absolute right-5 top-1/2 -translate-y-1/2 animate-spin text-cyan-500" size={18}/>}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-8 space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-600 ml-4">Rua / Logradouro</label>
                    <input value={formData.logradouro || ""} readOnly placeholder="Busca automática via CEP" className="w-full bg-slate-900/50 border border-white/5 p-5 rounded-2xl text-slate-400 text-sm outline-none cursor-not-allowed" />
                  </div>
                  <div className="col-span-12 md:col-span-4 space-y-2">
                    <label className={`text-[10px] font-black uppercase text-${themeColor}-500 ml-4 italic`}>Nº / Complemento *</label>
                    <input value={formData.numero} onChange={e => setFormData({...formData, numero: e.target.value})} placeholder="Obrigatório" className={`w-full bg-slate-950 border-2 border-${themeColor}-500/30 p-5 rounded-2xl text-white font-bold outline-none focus:border-${themeColor}-500 shadow-glow-sm`} />
                  </div>
                </div>
              </div>

              <button onClick={() => setStep(1)} className={`w-full bg-white text-slate-950 py-8 rounded-[40px] font-black uppercase text-[11px] tracking-[0.4em] hover:bg-${themeColor}-500 transition-all duration-500 shadow-xl flex items-center justify-center gap-4`}>
                Próxima Etapa <ChevronRight size={18}/>
              </button>
            </motion.div>
          )}

          {/* MANTENDO TODA A LÓGICA DO STEP 1, 2, 3 e 4 (DISC/OCEAN) IGUAL À ANTERIOR, MAS COM O THEMECOLOR DINÂMICO */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
              {role === 'candidate' ? (
                <>
                  <div className="space-y-6">
                    <label className="text-sm font-black uppercase text-slate-500 ml-4 tracking-widest flex items-center gap-3 italic"><Briefcase size={20} className={`text-${themeColor}-500`}/> Vertical Técnica</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {techVerticals.map(p => (
                        <button key={p} onClick={() => setFormData({...formData, area: p})} className={`p-6 border rounded-2xl text-[10px] font-bold uppercase transition-all ${formData.area === p ? `bg-${themeColor}-500 border-${themeColor}-400 text-slate-950 shadow-lg scale-105` : 'bg-slate-950 border-white/5 text-slate-500 hover:border-white/20'}`}>{p}</button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <p className="text-sm font-black uppercase text-slate-500 ml-4 tracking-widest italic">Senioridade</p>
                    <div className="flex gap-4">
                      {["Junior", "Pleno", "Senior"].map(s => (
                        <button key={s} onClick={() => setFormData({...formData, seniority: s})} className={`flex-1 py-6 rounded-2xl font-black text-xs uppercase transition-all ${formData.seniority === s ? `bg-${themeColor}-500 text-slate-950 shadow-lg` : 'bg-slate-950 border border-white/5 text-slate-500'}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-4 tracking-widest">Instituição Contratante</label>
                    <input value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} placeholder="Sua Empresa" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl outline-none text-white shadow-inner" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-4 tracking-widest">Título da Vaga</label>
                    <input value={formData.job_title} onChange={e => setFormData({...formData, job_title: e.target.value})} placeholder="Ex: Lead Developer" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl outline-none text-white shadow-inner" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-4 tracking-widest">Descritivo Técnico</label>
                    <textarea value={formData.job_description} onChange={e => setFormData({...formData, job_description: e.target.value})} placeholder="Requisitos e Stack..." className="w-full bg-slate-950 border border-white/10 p-8 rounded-[40px] text-white text-sm h-48 outline-none shadow-inner resize-none" />
                  </div>
                </div>
              )}
              <div className="flex gap-4 pt-4">
                <button onClick={() => setStep(0)} className="w-1/3 text-slate-500 uppercase font-black text-[10px] tracking-widest flex items-center justify-center gap-2 hover:text-white transition-all"><ArrowLeft size={16}/> Voltar</button>
                <button onClick={() => setStep(role === 'candidate' ? 2 : 4)} className={`w-2/3 bg-white text-slate-950 py-8 rounded-[40px] font-black uppercase text-[11px] tracking-[0.4em] hover:bg-${themeColor}-500 transition-all`}>Avançar</button>
              </div>
            </motion.div>
          )}

          {/* STEPS 2 e 3 (DISC e OCEAN) mantêm as mesmas lógicas, apenas o visual mais limpo */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
              <div className="space-y-10">
                {discQuestions.map((q, idx) => (
                  <div key={q.id} className="space-y-6 border-l-2 border-white/5 pl-6 group hover:border-cyan-500 transition-all">
                    <p className="text-sm font-black uppercase text-white tracking-widest flex items-center gap-4 italic"><Fingerprint size={24} className="text-cyan-500"/> {idx + 1}. {q.title}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {q.options.map(o => (
                        <button key={o.l} onClick={() => setFormData({...formData, [`disc_${q.id}`]: o.v})} className={`p-5 border rounded-2xl text-left text-xs font-bold transition-all ${(formData as any)[`disc_${q.id}`] === o.v ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-lg' : 'bg-slate-950 border-white/5 text-slate-500 hover:border-white/20'}`}>{o.l}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="w-1/4 text-slate-500 uppercase font-black text-[10px] tracking-widest italic">Voltar</button>
                <button disabled={!isDiscComplete} onClick={() => setStep(3)} className={`w-3/4 py-8 rounded-[40px] font-black uppercase text-[11px] tracking-[0.4em] transition-all ${isDiscComplete ? 'bg-white text-slate-950 hover:bg-cyan-500' : 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50'}`}>Próximo: OCEAN</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
              <div className="grid gap-6">
                {oceanTraits.map(t => (
                  <div key={t.k} className="bg-slate-950/50 p-8 rounded-[40px] border border-white/5 space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-black text-white uppercase italic tracking-widest">{t.l}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">{t.d}</p>
                      </div>
                      <span className="text-4xl font-black text-cyan-500 italic">{(formData as any)[t.k]}/10</span>
                    </div>
                    <input type="range" min="0" max="10" step="1" value={(formData as any)[t.k]} onChange={e => setFormData({...formData, [t.k]: parseInt(e.target.value)})} className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-cyan-500" />
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="w-1/4 text-slate-500 uppercase font-black text-[10px] tracking-widest italic">Voltar</button>
                <button disabled={!isOceanComplete} onClick={() => setStep(4)} className={`w-3/4 py-8 rounded-[40px] font-black uppercase text-[11px] tracking-[0.4em] transition-all ${isOceanComplete ? 'bg-white text-slate-950 hover:bg-cyan-500' : 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50'}`}>Finalizar Discovery</button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
              {role === 'candidate' && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-sm font-black uppercase text-slate-500 ml-4 tracking-widest flex items-center gap-3 italic"><Award size={20} className="text-cyan-500"/> Bio Profissional</label>
                    <textarea value={formData.experience_bio} onChange={e => setFormData({...formData, experience_bio: e.target.value})} placeholder="Resuma seus últimos desafios..." className="w-full bg-slate-950 border border-white/10 p-8 rounded-[40px] text-white text-sm h-56 outline-none focus:border-cyan-500 leading-relaxed shadow-inner" />
                  </div>
                  <label className="cursor-pointer bg-cyan-500/5 border-2 border-dashed border-cyan-500/20 p-12 rounded-[40px] flex flex-col items-center gap-4 hover:border-cyan-500 transition-all group">
                    <div className={`p-5 rounded-full transition-all ${formData.resumeName ? 'bg-green-500/20 text-green-500' : 'bg-cyan-500/10 text-cyan-500'}`}>
                      {formData.resumeName ? <BadgeCheck size={48} /> : <Upload size={48} />}
                    </div>
                    <div className="text-center">
                      <span className="block text-xs font-black uppercase text-white">{formData.resumeName || 'Upload CV (PDF)'}</span>
                      <span className="text-[10px] text-slate-500">Clique para selecionar</span>
                    </div>
                    <input type="file" className="hidden" accept=".pdf" onChange={e => setFormData({...formData, resumeName: e.target.files?.[0]?.name || ""})} />
                  </label>
                </div>
              )}
              <div className="p-8 bg-slate-950/80 border border-white/5 rounded-[40px] text-center space-y-4">
                <Zap size={32} className={`text-${themeColor}-500 mx-auto animate-pulse`}/>
                <p className="text-[11px] text-slate-500 italic leading-relaxed px-6">Ao finalizar, o protocolo será auditado pela Governança Lion Rising para validação estratégica.</p>
              </div>
              <button onClick={handleFinalSubmit} className={`w-full bg-${themeColor}-500 text-slate-950 py-10 rounded-[40px] font-black uppercase text-sm tracking-[0.8em] shadow-2xl hover:bg-white transition-all`}>
                Finalizar Protocolo
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}