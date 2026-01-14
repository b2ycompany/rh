"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, ArrowRight } from 'lucide-react';
import { JobData } from '@/app/page';

interface JobBoardProps {
  vacancies: JobData[];
  onApply: (job: JobData) => void;
}

export default function JobBoard({ vacancies, onApply }: JobBoardProps) {
  if (vacancies.length === 0) return null;

  return (
    <section id="jobs" className="py-24 container mx-auto px-6">
      <div className="flex items-center gap-4 mb-12">
        <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
          <Briefcase size={32} className="text-cyan-500" />
        </div>
        <h2 className="text-4xl font-black uppercase italic tracking-tighter italic">Oportunidades <span className="text-cyan-500 font-black italic">Lion Elite</span></h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {vacancies.map((job, idx) => (
          <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="p-8 bg-white/5 border border-white/10 rounded-[40px] hover:border-cyan-500/50 transition-all flex flex-col h-full group">
            <h3 className="text-2xl font-black uppercase italic text-white mb-2 leading-none group-hover:text-cyan-500 transition-colors tracking-tight italic">{job.title}</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-500/60 mb-6 font-black">{job.area} • {job.seniority}</p>
            <p className="text-xs text-slate-500 italic mb-8 flex-grow leading-relaxed italic">{job.description}</p>
            <div className="flex justify-between items-center border-t border-white/5 pt-6">
              <span className="text-white font-black text-sm italic tracking-widest">{job.salary}</span>
              <button onClick={() => onApply(job)} className="bg-white text-slate-950 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500 transition-all flex items-center gap-2">Candidatar <ArrowRight size={14}/></button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}