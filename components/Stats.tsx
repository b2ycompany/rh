"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Counter from './Counter';

const stats = [
  { label: "Match Rate IA", value: 98, suffix: "%" },
  { label: "Vagas Tech Fechadas", value: 450, suffix: "+" },
  { label: "Talentos na Base", value: 12, suffix: "k+" },
  { label: "Retenção de Talentos", value: 94, suffix: "%" }
];

export default function Stats() {
  return (
    <section className="py-24 bg-slate-900/20 border-y border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.05),transparent_70%)]" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
              className="text-center"
            >
              <div className="text-5xl md:text-7xl font-black text-white italic tracking-tighter mb-4 flex justify-center items-baseline gap-1">
                <span className="text-cyan-500">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </span>
              </div>
              <p className="text-[10px] md:text-[11px] uppercase font-black text-slate-500 tracking-[0.4em] max-w-[150px] mx-auto leading-relaxed">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}