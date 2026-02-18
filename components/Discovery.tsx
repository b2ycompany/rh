"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, Upload, ChevronRight, Search, ArrowLeft, UserCircle, ShieldCheck, Zap, 
  Briefcase, FileText, BadgeCheck, RefreshCw, Baby, Building2, Heart, Glasses, 
  Fingerprint, Rocket, Mail, Award, Sparkles, Lock as LockIcon, Home, Users2, MapPin, Calendar, Wallet, Clock
} from 'lucide-react';

interface DiscoveryProps {
  role: 'candidate' | 'client' | null;
  initialData?: { area?: string; seniority?: string; };
  onSubmit: (data: any) => void;
}

export default function Discovery({ role, initialData, onSubmit }: DiscoveryProps) {
  const [step, setStep] = useState(0);
  const [isCepLoading, setIsCepLoading] = useState(false);
  const themeColor = role === 'candidate' ? 'cyan' : 'purple';

  const [formData, setFormData] = useState({
    name: "", email: "", whatsapp: "", cep: "", cpf_cnpj: "",
    // --- DOSSIÊ RH DE ELITE ---
    birth_date: "", marital_status: "Solteiro(a)", has_children: "Não", num_children: 0, 
    hobbies: "", salary_expectation: "", availability: "Imediata",
    // --- ENDEREÇO TOTALMENTE EDITÁVEL ---
    logradouro: "", bairro: "", cidade: "", uf: "", numero: "",
    // --- INFRA PROFISSIONAL ---
    area: initialData?.area || "", seniority: initialData?.seniority || "Junior",
    experience_bio: "", company_name: "", job_title: "", job_description: "",
    // --- PSICOMETRIA (OCEAN + DISC) ---
    ocean_openness: 0, ocean_conscientiousness: 0, ocean_extraversion: 0, ocean_agreeableness: 0, ocean_neuroticism: 0,
    disc_q1: "", disc_q2: "", disc_q3: "", disc_q4: "", disc_q5: "", disc_q6: "", disc_q7: "", disc_q8: "", disc_q9: "", disc_q10: "",
    resumeName: ""
  });

  const techVerticals = ["Backend", "Frontend", "Fullstack", "Cloud Arch", "QA / Tester", "Gerente TI", "Data Science", "DevOps", "UI/UX", "Product Owner", "Cyber Sec"];

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
    { k: "ocean_openness", l: "Abertura Mental", d: "Criatividade e busca por inovação." },
    { k: "ocean_conscientiousness", l: "Foco", d: "Disciplina, organização e metas." },
    { k: "ocean_extraversion", l: "Social", d: "Energia em interações e squad." },
    { k: "ocean_agreeableness", l: "Amabilidade", d: "Empatia e cooperação mútua." },
    { k: "ocean_neuroticism", l: "Resiliência", d: "Estabilidade sob alta pressão." }
  ];

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
        
        {/* HEADER DE PROGRESSO */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 pb-10 border-b border-white/5 gap-8">
          <div className="flex items-center gap-6">
            <div className={`p-6 rounded-3xl bg-${themeColor}-500/10 border border-${themeColor}-500/20 text-${themeColor}-500 shadow-lg`}>
              {role === 'candidate' ? <ShieldCheck size={32} /> : <Building2 size={32}/>}
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">Discovery {role === 'candidate' ? 'Talento' : 'Empresa'}</h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2"><Rocket size={12}/> Lion Rising v8.8</p>
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
            <motion.div key="s0" className="space-y-8 animate-in fade-in slide-in-from-left duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 ml-4">Nome Completo</label><input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950/50 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-cyan-500 shadow-inner" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 ml-4">E-mail Profissional</label><input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-950/50 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-cyan-500 shadow-inner" /></div>
              </div>

              {/* ENDEREÇO COMPLETO UNIFICADO */}
              <div className="bg-slate-950/40 p-8 rounded-[40px] border border-white/5 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-4 flex items-center gap-2"><Search size={14}/> CEP</label>
                    <div className="relative">
                      <input value={formData.cep} onChange={e => setFormData({...formData, cep: e.target.value.replace(/\D/g, "").replace(/^(\d{5})(\d)/, "$1-$2").substring(0, 9)})} onBlur={handleCepSearch} placeholder="00000-000" className="w-full bg-slate-950/50 border border-white/10 p-5 rounded-2xl text-white outline-none font-mono" />
                      {isCepLoading && <RefreshCw className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-cyan-500" size={18}/>}
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-4">Logradouro (Rua/Avenida)</label>
                    <input value={formData.logradouro} onChange={e => setFormData({...formData, logradouro: e.target.value})} placeholder="Rua, Travessa..." className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-cyan-500" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-cyan-500 ml-4 italic">Número</label>
                    <input value={formData.numero} onChange={e => setFormData({...formData, numero: e.target.value})} placeholder="Ex: 123" className="w-full bg-slate-950 border-2 border-cyan-500/20 p-5 rounded-2xl text-white font-bold outline-none focus:border-cyan-500" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-4">Cidade</label>
                    <input value={formData.cidade} onChange={e => setFormData({...formData, cidade: e.target.value})} className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-white outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-4">Estado (UF)</label>
                    <input value={formData.uf} onChange={e => setFormData({...formData, uf: e.target.value})} maxLength={2} className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-white text-center outline-none" />
                  </div>
                </div>
              </div>

              {/* DOSSIÊ RH AVANÇADO */}
              {role === 'candidate' && (
                <div className="bg-slate-950/20 p-8 rounded-[40px] border border-white/5 space-y-8 animate-in fade-in duration-1000">
                   <p className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em] flex items-center gap-3 border-b border-white/5 pb-4"><Users2 size={16} className="text-cyan-500"/> Composição de Perfil e Dossiê Pessoal</p>
                   
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 ml-4 flex items-center gap-2"><Calendar size={12}/> Data de Nascimento</label>
                        <input type="date" value={formData.birth_date} onChange={e => setFormData({...formData, birth_date: e.target.value})} className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-white outline-none cursor-pointer" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 ml-4">Estado Civil</label>
                        <select value={formData.marital_status} onChange={e => setFormData({...formData, marital_status: e.target.value})} className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-white outline-none appearance-none cursor-pointer">
                          <option>Solteiro(a)</option><option>Casado(a)</option><option>União Estável</option><option>Divorciado(a)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 ml-4 flex items-center gap-2"><Baby size={14}/> Tem Filhos? / Quantos?</label>
                        <div className="flex gap-2">
                           <select value={formData.has_children} onChange={e => setFormData({...formData, has_children: e.target.value})} className="w-1/2 bg-slate-950 border border-white/10 p-5 rounded-2xl text-white outline-none appearance-none cursor-pointer"><option>Não</option><option>Sim</option></select>
                           <input type="number" disabled={formData.has_children === "Não"} value={formData.num_children} onChange={e => setFormData({...formData, num_children: parseInt(e.target.value)})} className="w-1/2 bg-slate-950 border border-white/10 p-5 rounded-2xl text-white outline-none disabled:opacity-20" />
                        </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2 md:col-span-1">
                        <label className="text-[10px] font-black uppercase text-slate-500 ml-4 flex items-center gap-2"><Wallet size={12} className="text-green-500"/> Pretensão Salarial (CLT)</label>
                        <input type="number" value={formData.salary_expectation} onChange={e => setFormData({...formData, salary_expectation: e.target.value})} placeholder="R$ 0.000" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-white outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 ml-4 flex items-center gap-2"><Clock size={12} className="text-cyan-500"/> Disponibilidade</label>
                        <select value={formData.availability} onChange={e => setFormData({...formData, availability: e.target.value})} className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-white outline-none appearance-none cursor-pointer">
                          <option>Imediata</option><option>15 Dias</option><option>30 Dias</option><option>A Combinar</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 ml-4 flex items-center gap-2"><Heart size={14} className="text-red-500"/> Hobby / Paixões</label>
                        <input value={formData.hobbies} onChange={e => setFormData({...formData, hobbies: e.target.value})} placeholder="Ex: Xadrez, Ciclismo, Piano..." className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-white outline-none italic shadow-inner" />
                      </div>
                   </div>
                </div>
              )}

              <button onClick={() => setStep(1)} className={`w-full bg-white text-slate-950 py-8 rounded-[40px] font-black uppercase text-[11px] tracking-[0.4em] hover:bg-${themeColor}-500 transition-all shadow-xl flex items-center justify-center gap-4`}>
                Próxima Etapa <ChevronRight size={18}/>
              </button>
            </motion.div>
          )}

          {/* PASSO 1 - VERTICAIS TÉCNICAS */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
              {role === 'candidate' ? (
                <>
                  <div className="space-y-6 text-left">
                    <label className="text-sm font-black uppercase text-slate-500 ml-4 tracking-widest flex items-center gap-3 italic"><Briefcase size={20} className={`text-${themeColor}-500`}/> Vertical Técnica Profissional</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {techVerticals.map(p => (
                        <button key={p} onClick={() => setFormData({...formData, area: p})} className={`p-6 border rounded-2xl text-[10px] font-bold uppercase transition-all ${formData.area === p ? `bg-${themeColor}-500 border-${themeColor}-400 text-slate-950 shadow-lg scale-105` : 'bg-slate-950 border-white/5 text-slate-500 hover:border-white/20'}`}>{p}</button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6 text-left">
                    <p className="text-sm font-black uppercase text-slate-500 ml-4 tracking-widest italic">Senioridade Técnica</p>
                    <div className="flex gap-4">
                      {["Junior", "Pleno", "Senior"].map(s => (
                        <button key={s} onClick={() => setFormData({...formData, seniority: s})} className={`flex-1 py-6 rounded-2xl font-black text-xs uppercase transition-all ${formData.seniority === s ? `bg-${themeColor}-500 text-slate-950 shadow-lg` : 'bg-slate-950 border border-white/5 text-slate-500'}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-6 text-left">
                  <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 ml-4">Empresa Contratante</label><input value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-white outline-none" /></div>
                  <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 ml-4">Título do Desafio</label><input value={formData.job_title} onChange={e => setFormData({...formData, job_title: e.target.value})} className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-white outline-none" /></div>
                  <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 ml-4">Descritivo da Oportunidade</label><textarea value={formData.job_description} onChange={e => setFormData({...formData, job_description: e.target.value})} className="w-full bg-slate-950 border border-white/10 p-8 rounded-[40px] text-white text-sm h-48 outline-none" /></div>
                </div>
              )}
              <div className="flex gap-4">
                <button onClick={() => setStep(0)} className="w-1/3 text-slate-500 uppercase font-black text-[10px] tracking-widest flex items-center justify-center gap-2 hover:text-white transition-all"><ArrowLeft size={16}/> Voltar</button>
                <button onClick={() => setStep(role === 'candidate' ? 2 : 4)} className={`w-2/3 bg-white text-slate-950 py-8 rounded-[40px] font-black uppercase text-[11px] tracking-[0.4em] hover:bg-${themeColor}-500 transition-all shadow-xl`}>Avançar</button>
              </div>
            </motion.div>
          )}

          {/* PASSO 2 - MATRIZ DISC (10 QUESTÕES) */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
              <div className="space-y-10">
                {discQuestions.map((q, idx) => (
                  <div key={q.id} className="space-y-6 border-l-2 border-white/5 pl-6 group hover:border-cyan-500 transition-all text-left">
                    <p className="text-sm font-black uppercase text-white tracking-widest flex items-center gap-4 italic"><Fingerprint size={24} className="text-cyan-500"/> {idx + 1}. {q.title}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {q.options.map(o => (
                        <button key={o.l} onClick={() => setFormData({...formData, [`disc_${q.id}`]: o.v})} className={`p-5 border rounded-2xl text-left text-xs font-bold transition-all ${(formData as any)[`disc_${q.id}`] === o.v ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-lg scale-105' : 'bg-slate-950 border-white/5 text-slate-500 hover:border-white/20'}`}>{o.l}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="w-1/4 text-slate-500 uppercase font-black text-[10px] tracking-widest italic">Voltar</button>
                <button disabled={!isDiscComplete} onClick={() => setStep(3)} className={`w-3/4 py-8 rounded-[40px] font-black uppercase text-[11px] tracking-[0.4em] transition-all ${isDiscComplete ? 'bg-white text-slate-950 hover:bg-cyan-500 shadow-xl' : 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50'}`}>Próximo: OCEAN</button>
              </div>
            </motion.div>
          )}

          {/* PASSO 3 - OCEAN BIG FIVE */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12 text-left">
              <div className="grid gap-6">
                {oceanTraits.map(t => (
                  <div key={t.k} className="bg-slate-950/50 p-8 rounded-[40px] border border-white/5 space-y-6 group hover:border-cyan-500/20 transition-all">
                    <div className="flex justify-between items-center">
                      <div><p className="text-lg font-black text-white uppercase italic tracking-widest leading-none">{t.l}</p><p className="text-[10px] text-slate-500 uppercase font-bold mt-2">{t.d}</p></div>
                      <span className="text-4xl font-black text-cyan-500 italic">{(formData as any)[t.k]}/10</span>
                    </div>
                    <input type="range" min="0" max="10" step="1" value={(formData as any)[t.k]} onChange={e => setFormData({...formData, [t.k]: parseInt(e.target.value)})} className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-cyan-500" />
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="w-1/4 text-slate-500 uppercase font-black text-[10px] tracking-widest italic">Voltar</button>
                <button disabled={!isOceanComplete} onClick={() => setStep(4)} className={`w-3/4 py-8 rounded-[40px] font-black uppercase text-[11px] tracking-[0.4em] transition-all ${isOceanComplete ? 'bg-white text-slate-950 hover:bg-cyan-500 shadow-xl' : 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50'}`}>Etapa Final</button>
              </div>
            </motion.div>
          )}

          {/* PASSO 4 - RESUMO E DOSSIÊ FINAL */}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 text-left">
              {role === 'candidate' && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-sm font-black uppercase text-slate-500 ml-4 flex items-center gap-3 italic"><Award size={20} className="text-cyan-500"/> Trajetória e Desafios Profissionais</label>
                    <textarea value={formData.experience_bio} onChange={e => setFormData({...formData, experience_bio: e.target.value})} placeholder="Resuma seus maiores impactos técnicos em squads..." className="w-full bg-slate-950 border border-white/10 p-8 rounded-[40px] text-white text-sm h-56 outline-none focus:border-cyan-500 leading-relaxed shadow-inner" />
                  </div>
                  <label className="cursor-pointer bg-cyan-500/5 border-2 border-dashed border-cyan-500/20 p-12 rounded-[40px] flex flex-col items-center gap-4 hover:border-cyan-500 transition-all group">
                    <div className={`p-5 rounded-full transition-all ${formData.resumeName ? 'bg-green-500/20 text-green-500 shadow-glow' : 'bg-cyan-500/10 text-cyan-500 shadow-glow'}`}>
                      {formData.resumeName ? <BadgeCheck size={48} /> : <Upload size={48} />}
                    </div>
                    <span className="text-xs font-black uppercase text-white">{formData.resumeName || 'Upload de Currículo Auditado (PDF)'}</span>
                    <input type="file" className="hidden" accept=".pdf" onChange={e => setFormData({...formData, resumeName: e.target.files?.[0]?.name || ""})} />
                  </label>
                </div>
              )}
              <div className="p-8 bg-slate-950/80 border border-white/5 rounded-[40px] text-center space-y-4">
                <Zap size={32} className={`text-${themeColor}-500 mx-auto animate-pulse`}/>
                <p className="text-[11px] text-slate-500 italic leading-relaxed px-6 italic">Ao clicar em finalizar, o protocolo será auditado pela Governança Lion Rising para validação estratégica.</p>
              </div>
              <button onClick={handleFinalSubmit} className={`w-full bg-${themeColor}-500 text-slate-950 py-10 rounded-[40px] font-black uppercase text-sm tracking-[0.8em] shadow-2xl hover:bg-white transition-all shadow-glow shadow-${themeColor}-500/20`}>
                Finalizar Protocolo de Elite
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}