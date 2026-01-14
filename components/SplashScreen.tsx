"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Fingerprint } from 'lucide-react';

export default function SplashScreen({ finishLoading }: { finishLoading: () => void }) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setPercent(p => (p < 100 ? p + 1 : 100)), 25);
    const timeout = setTimeout(finishLoading, 4000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [finishLoading]);

  return (
    <motion.div exit={{ opacity: 0, scale: 1.1 }} className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="mb-10 relative inline-block">
          <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full" />
          <Fingerprint size={80} className="text-cyan-500 relative" />
        </motion.div>
        <h1 className="text-3xl font-black text-white tracking-[0.4em] mb-4 uppercase italic">
          TAMMY <span className="text-cyan-500 font-light tracking-normal">RH & HUNTING</span>
        </h1>
        <div className="w-64 h-[2px] bg-slate-800 mx-auto rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} className="h-full bg-cyan-500 shadow-[0_0_15px_#06b6d4]" />
        </div>
        <p className="mt-4 font-mono text-cyan-500/60 text-[10px] tracking-widest uppercase italic">Iniciando Protocolos de Discovery...</p>
      </motion.div>
    </motion.div>
  );
}