export default function TestimonialsSection() {
  return (
    <section id="depoimentos" className="py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 text-center">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-16">O impacto que geramos juntos</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 bg-slate-50 rounded-3xl text-left border border-slate-100 relative">
            <span className="text-6xl text-blue-200 absolute top-4 left-6 leading-none">"</span>
            <p className="text-slate-600 italic relative z-10 pt-4 mb-6">
              Graças ao ConectaVoluntário, conseguimos dobrar o número de aulas de reforço na nossa ONG. A plataforma é fácil de usar e nos trouxe pessoas incríveis.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">IE</div>
              <div>
                <h4 className="font-bold text-slate-900">Instituto Educar</h4>
                <span className="text-sm text-slate-500">Instituição Parceira</span>
              </div>
            </div>
          </div>

          <div className="p-8 bg-slate-50 rounded-3xl text-left border border-slate-100 relative">
            <span className="text-6xl text-emerald-200 absolute top-4 left-6 leading-none">"</span>
            <p className="text-slate-600 italic relative z-10 pt-4 mb-6">
              Sempre quis ajudar a causa ambiental. Em 5 minutos criei meu perfil e no fim de semana já estava em um mutirão de limpeza!
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">MA</div>
              <div>
                <h4 className="font-bold text-slate-900">Mariana Alves</h4>
                <span className="text-sm text-slate-500">Voluntária</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}