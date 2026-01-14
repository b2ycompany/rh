"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, BrainCircuit, Bug, Layers, Server, Code2, BarChart3, Terminal, CheckCircle2 } from 'lucide-react';
import { UserRole } from '@/app/page';

interface DiscoveryProps {
  role: UserRole;
  initialData?: { name: string; company: string; area: string; seniority: string };
  onSubmit: (data: any) => void;
}

export default function Discovery({ role, initialData, onSubmit }: DiscoveryProps) {
  const [step, setStep] = useState(0);
  const [resumeName, setResumeName] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    company: initialData?.company || "",
    area: initialData?.area || "",
    seniority: initialData?.seniority || ""
  });

  useEffect(() => {
    if (initialData) setFormData(prev => ({ ...prev, ...initialData }));
  }, [initialData]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setResumeName(file.name);
  };

  const areasTech = [
    { label: "Tester / QA", icon: <Bug size={18} /> },
    { label: "Arquiteto", icon: <Layers size={18} /> },
    { label: "Infraestrutura", icon: <Server size={18} /> },
    { label: "Analista de Sistemas", icon: <Code2 size={18} /> },
    { label: "Gerente de Projetos", icon: <BarChart3 size={18} /> },
    { label: "Desenvolvedor", icon: <Terminal size={18} /> }
  ];

  const senioridades = ["Junior", "Pleno", "Senior", "Especialista"];

  return (
    <section className="container mx-auto px-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900/50 p-12 rounded-[50px] border border-cyan-500/20 shadow-2xl backdrop-blur-xl">
        <div className="mb-10 flex items-center gap-4 border-b border-white/5 pb-6">
          <div className="p-3 bg-cyan-500/20 rounded-2xl text-cyan-400 animate-pulse"><BrainCircuit size={32} /></div>
          <h2 className="text-2xl font-black uppercase italic text-white tracking-tighter uppercase">Protocolo Discovery</h2>
        </div>
        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div key="s0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="NOME COMPLETO" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-xs font-bold text-white uppercase outline-none focus:border-cyan-500" />
              {role === 'client' && <input value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} placeholder="EMPRESA / PROJETO" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-xs font-bold text-white uppercase outline-none focus:border-cyan-500" />}
              <button onClick={() => setStep(1)} className="w-full bg-white text-slate-950 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-cyan-500 transition-all">Próximo</button>
            </motion.div>
          ) : (
            <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="grid grid-cols-2 gap-3">
                {areasTech.map(area => (
                  <button key={area.label} onClick={() => setFormData({...formData, area: area.label})} className={`p-4 border rounded-2xl text-[10px] font-bold uppercase transition-all flex justify-between items-center ${formData.area === area.label ? 'bg-cyan-500 border-cyan-500 text-slate-950' : 'bg-slate-950 border-white/10 hover:border-cyan-500'}`}>
                    {area.label} {area.icon}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {senioridades.map(s => (
                  <button key={s} onClick={() => setFormData({...formData, seniority: s})} className={`p-3 border rounded-xl text-[8px] font-bold uppercase transition-all ${formData.seniority === s ? 'bg-white text-slate-950' : 'bg-slate-950 border-white/10'}`}>{s}</button>
                ))}
              </div>
              {role === 'candidate' && (
                <label className="cursor-pointer bg-white/5 border border-dashed border-white/10 p-8 rounded-3xl flex flex-col items-center gap-2 hover:border-cyan-500 transition-all">
                  {resumeName ? <CheckCircle2 size={24} className="text-green-500" /> : <Upload size={24} className="text-cyan-500" />}
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">{resumeName || 'Anexar Currículo (PDF)'}</span>
                  <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} />
                </label>
              )}
              <div className="flex gap-4">
                 <button onClick={() => setStep(0)} className="w-1/3 text-slate-600 uppercase font-black text-[10px]">Voltar</button>
                 <button onClick={() => onSubmit({...formData, resumeName})} className="w-2/3 bg-cyan-500 text-slate-950 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white transition-all shadow-lg shadow-cyan-500/20">Finalizar Scan</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}