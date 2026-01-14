"use client";

import { MapPin, Settings, User } from 'lucide-react';

export default function Navigation({ setView, activeTicket }: any) {
  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div className="text-xl font-black italic tracking-tighter cursor-pointer" onClick={() => setView('home')}>
          TAMMY <span className="text-cyan-500">RH & HUNTING</span>
        </div>
        <div className="flex gap-8 items-center">
          <div className="hidden lg:flex gap-4 items-center text-slate-500">
            <MapPin size={14} className="text-cyan-500" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Belém, PA - Reduto</span>
          </div>
          {activeTicket && (
            <button onClick={() => setView('home')} className="flex items-center gap-2 text-[10px] font-black uppercase text-cyan-500 bg-cyan-500/10 px-4 py-2 rounded-full border border-cyan-500/20 transition-all">
              <User size={12} /> Meu Ticket
            </button>
          )}
          <button onClick={() => setView('admin')} className="text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors flex items-center gap-2">
            <Settings size={14} /> Admin
          </button>
        </div>
      </div>
    </nav>
  );
}