"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Upload, MapPin, Linkedin, Globe, Users, PlusCircle } from 'lucide-react';

export default function Discovery({ role, initialData, onSubmit }: any) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "", email: "", whatsapp: "", region: "", 
    linkedinUrl: "", companySite: "", area: initialData?.area || "", 
    customArea: "", seniority: initialData?.seniority || "", 
    quantity: 1, resumeName: ""
  });

  const areas = ["Tester / QA", "Arquiteto", "Infraestrutura", "Analista de Sistemas", "Gerente de Projetos", "Desenvolvedor", "Outra"];

  const handleNext = () => setStep(step + 1);

  return (
    <section className="container mx-auto px-6 max-w-3xl">
      <div className="bg-slate-900/50 p-10 rounded-[40px] border border-cyan-500/20 backdrop-blur-xl">
        <div className="mb-8 flex items-center gap-4 border-b border-white/5 pb-6">
          <BrainCircuit size={32} className="text-cyan-500" />
          <h2 className="text-xl font-bold">PROTOCOLO DISCOVERY - {role === 'client' ? 'CONTRATANTE' : 'TALENTO'}</h2>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div key="s1" className="space-y-4">
              <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-4 italic">Informações de Contato</p>
              <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nome completo" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl outline-none focus:border-cyan-500 text-white" />
              <div className="grid grid-cols-2 gap-4">
                <input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="E-mail profissional" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl outline-none focus:border-cyan-500 text-white" />
                <input value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} placeholder="WhatsApp (DDD)" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl outline-none focus:border-cyan-500 text-white" />
              </div>
              <div className="flex items-center gap-2 bg-slate-950 border border-white/10 p-5 rounded-2xl">
                <MapPin size={18} className="text-cyan-500" />
                <input value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} placeholder="Região / Cidade (Ex: Belém - PA ou Remoto)" className="bg-transparent w-full outline-none text-white" />
              </div>
              <button onClick={handleNext} className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-cyan-500 transition-all mt-4">Continuar</button>
            </motion.div>
          ) : (
            <motion.div key="s2" className="space-y-6">
              <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-4 italic">Especificações Técnicas</p>
              
              <div className="grid grid-cols-2 gap-2">
                {areas.map(a => (
                  <button key={a} onClick={() => setFormData({...formData, area: a})} className={`p-4 border rounded-xl text-[10px] font-bold transition-all ${formData.area === a ? 'bg-cyan-500 border-cyan-500 text-black' : 'bg-slate-950 border-white/10'}`}>{a}</button>
                ))}
              </div>

              {formData.area === 'Outra' && (
                <div className="flex items-center gap-2 bg-slate-950 border border-cyan-500/50 p-4 rounded-xl">
                  <PlusCircle size={18} className="text-cyan-500" />
                  <input value={formData.customArea} onChange={e => setFormData({...formData, customArea: e.target.value})} placeholder="Digite o nome da vaga/especialidade" className="bg-transparent w-full outline-none text-white text-sm" />
                </div>
              )}

              {role === 'client' ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 bg-slate-950 border border-white/10 p-5 rounded-2xl">
                    <Users size={18} className="text-cyan-500" />
                    <input type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} placeholder="Quantidade de profissionais" className="bg-transparent w-full outline-none text-white" />
                  </div>
                  <div className="flex items-center gap-2 bg-slate-950 border border-white/10 p-5 rounded-2xl">
                    <Globe size={18} className="text-cyan-500" />
                    <input value={formData.companySite} onChange={e => setFormData({...formData, companySite: e.target.value})} placeholder="Site da Empresa ou LinkedIn" className="bg-transparent w-full outline-none text-white" />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-slate-950 border border-white/10 p-5 rounded-2xl">
                  <Linkedin size={18} className="text-cyan-500" />
                  <input value={formData.linkedinUrl} onChange={e => setFormData({...formData, linkedinUrl: e.target.value})} placeholder="Link do seu LinkedIn" className="bg-transparent w-full outline-none text-white" />
                </div>
              )}

              <button onClick={() => onSubmit(formData)} className="w-full bg-cyan-500 text-black py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white transition-all">Finalizar Scan</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}