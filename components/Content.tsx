import { 
  BarChart3, 
  Workflow, 
  Database, 
  MapPin, 
  ShieldCheck, 
  Zap, 
  Terminal, 
  Globe, 
  Search, 
  BrainCircuit 
} from 'lucide-react';

export default function Content() {
  return (
    <section className="py-24 space-y-32">
      {/* SEÇÃO: FLUXO DE GOVERNANÇA */}
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-end mb-20">
          <div className="lg:w-2/3">
            <h2 className="text-4xl md:text-6xl font-black uppercase italic mb-8 leading-none">
              Gestão de <br /><span className="text-cyan-500 font-black italic">Fluxo ERP/CRM</span>
            </h2>
            <p className="text-slate-400 font-light text-lg leading-relaxed italic border-l-2 border-cyan-500/30 pl-8">
              Nossa plataforma opera como um motor de busca ativa que integra o **CRM de Candidatos** ao **ERP de Contratação** do cliente. Atuamos com transparência total via Dashboards de evolução.
            </p>
          </div>
          <div className="lg:w-1/3 grid grid-cols-2 gap-4">
             <div className="p-6 bg-white/5 rounded-3xl border border-white/5 text-center">
                <p className="text-2xl font-black text-white italic">24h</p>
                <p className="text-[8px] uppercase text-slate-500 font-bold tracking-widest mt-1">SLA de Triagem</p>
             </div>
             <div className="p-6 bg-cyan-500 rounded-3xl text-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                <p className="text-2xl font-black text-slate-950 italic">48h</p>
                <p className="text-[8px] uppercase text-slate-950 font-bold tracking-widest mt-1">Primeiro Match</p>
             </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Discovery Ativo", desc: "Mapeamento inicial de perfis e cultura organizacional.", icon: <Search size={24}/>, color: "text-cyan-500" },
            { title: "QA Técnica", desc: "Avaliação rigorosa por arquitetos e testers seniores.", icon: <Terminal size={24}/>, color: "text-blue-500" },
            { title: "Matching IA", desc: "Cruzamento de dados entre talentos e sua demanda.", icon: <BrainCircuit size={24}/>, color: "text-purple-500" },
            { title: "Shortlist VIP", desc: "Apresentação de candidatos com 95%+ de aderência.", icon: <ShieldCheck size={24}/>, color: "text-green-500" }
          ].map((item, idx) => (
            <div key={idx} className="p-8 bg-white/5 border border-white/5 rounded-[32px] hover:bg-white/[0.07] transition-all group">
               <div className={`${item.color} mb-6 group-hover:scale-110 transition-transform`}>{item.icon}</div>
               <h4 className="text-sm font-black uppercase tracking-widest mb-3 italic">{item.title}</h4>
               <p className="text-slate-500 text-[11px] leading-relaxed italic">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SEÇÃO: MAPA E PRESENÇA LOCAL BELÉM */}
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-6">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-tight italic">
            Tammy <span className="text-cyan-500 font-black">Belém Base</span>
          </h2>
          <div className="flex items-start gap-4 text-slate-400">
            <MapPin className="text-cyan-400 shrink-0" size={24} />
            <div className="space-y-1">
              <p className="font-black text-white uppercase tracking-wider text-xs italic">Rogélio Fernandez Business Center</p>
              <p className="text-sm tracking-widest leading-relaxed uppercase italic">
                Tv. Quintino Bocaiúva, 2301 - Reduto, Belém - PA
              </p>
            </div>
          </div>
          
          <div className="h-80 w-full rounded-[40px] overflow-hidden border border-white/10 grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl relative">
            <div className="absolute top-4 right-4 z-10 bg-slate-950/80 backdrop-blur px-4 py-2 rounded-full border border-white/10 text-[8px] font-black uppercase tracking-widest text-cyan-400">
              Sede Administrativa
            </div>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3990.540121!2d-48.4902!3d-1.4586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x92a48eb62!2sTv.%20Quintino%20Bocai%C3%BAva%2C%202301%20-%20Reduto%2C%20Bel%C3%A9m%20-%20PA%2C%2066045-315!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-slate-900/50 p-10 rounded-[40px] border border-white/5">
            <div className="flex gap-4 items-center mb-6">
               <Globe className="text-cyan-500" size={32} />
               <h3 className="text-xl font-black uppercase italic">Alcance Global</h3>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed italic font-light italic">
              Conectamos o talento tech da Amazônia com empresas globais. Nossa metodologia quebra barreiras geográficas através de governança ágil e PMO de alta performance.
            </p>
          </div>
          <div className="bg-white/5 p-10 rounded-[40px] border border-white/5">
            <div className="flex gap-4 items-center mb-6">
               <Database className="text-blue-500" size={32} />
               <h3 className="text-xl font-black uppercase italic">Dados Auditados</h3>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed italic font-light italic">
              Todos os indicadores de contratação são auditados e disponibilizados no painel do contratante, garantindo compliance e transparência total.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}