export default function AboutSection() {
  return (
    <section id="sobre" className="py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
        <div className="bg-white rounded-[40px] p-10 md:p-16 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-6">Nossa Missão</h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Acreditamos que o trabalho voluntário é a principal ferramenta para a construção de uma sociedade mais justa e solidária. 
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              O ConectaVoluntário nasceu da necessidade de facilitar o encontro entre pessoas dispostas a ajudar e instituições que precisam urgentemente de braços fortes, mentes criativas e corações abertos.
            </p>
          </div>
          <div className="flex-1 w-full rounded-[24px] overflow-hidden bg-slate-200 h-[300px]">
            {/* ATENÇÃO NESTA LINHA: */}
            <img 
              src="https://images.unsplash.com/photo-1533203444007-49526715f206?q=80&w=800&auto=format&fit=crop" 
              alt="Pessoa segurando recortes de papel representando união" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}