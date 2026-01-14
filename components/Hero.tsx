"use client";

import { motion } from 'framer-motion';
import { Building2, User } from 'lucide-react';

interface HeroProps {
  setUserRole: (role: 'candidate' | 'client') => void;
}

export default function Hero({ setUserRole }: HeroProps) {
  return (
    <section className="container mx-auto px-6 text-center py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <h1 className="text-6xl md:text-9xl font-black mb-10 italic uppercase tracking-tighter leading-none">
          Discovery <br /><span className="text-cyan-500 italic">Protocol</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-xl mb-16 font-light leading-relaxed italic">
          Lion Solution & B2Y Group apresentam Tammy RH & Hunting. Localizamos mentes brilhantes através de inteligência de dados aplicada ao recrutamento de elite.
        </p>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <button onClick={() => setUserRole('client')} className="group p-10 bg-white/5 border border-white/10 rounded-[40px] hover:border-cyan-500/50 transition-all text-center">
            <Building2 size={48} className="text-cyan-500 mx-auto mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-black uppercase mb-2 italic">Sou Contratante</h3>
            <p className="text-slate-500 text-sm italic">Mapeamos especialistas para escalar sua operação com governança.</p>
          </button>
          <button onClick={() => setUserRole('candidate')} className="group p-10 bg-white/5 border border-white/10 rounded-[40px] hover:border-purple-500/50 transition-all text-center">
            <User size={48} className="text-purple-500 mx-auto mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-black uppercase mb-2 italic">Sou Candidato</h3>
            <p className="text-slate-500 text-sm italic">Seja caçado pelas melhores oportunidades em projetos de alta tecnologia.</p>
          </button>
        </div>
      </motion.div>
    </section>
  );
}