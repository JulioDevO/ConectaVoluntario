export default function WorksSection() {
  return (
    <section id="oportunidades" className="py-24 ">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 text-center">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">Como funciona</h2>
        <p className="text-slate-600 max-w-2xl mx-auto mb-16">Três passos simples para você começar a transformar a realidade ao seu redor.</p>
        
        <div className="grid md:grid-cols-3 gap-10">
          <div className="p-8 rounded-[32px] bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">1</div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Crie seu Perfil</h3>
            <p className="text-slate-600">Cadastre-se rapidamente e escolha as causas que mais tocam o seu coração.</p>
          </div>
          
          <div className="p-8 rounded-[32px] bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">2</div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Encontre Vagas</h3>
            <p className="text-slate-600">Nossa plataforma cruza seus interesses com as necessidades reais das ONGs.</p>
          </div>
          
          <div className="p-8 rounded-[32px] bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">3</div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Faça a Diferença</h3>
            <p className="text-slate-600">Inscreva-se na oportunidade, entre em contato com a instituição e comece a atuar.</p>
          </div>
        </div>
      </div>
    </section>
  );
}