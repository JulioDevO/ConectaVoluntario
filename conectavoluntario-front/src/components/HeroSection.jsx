import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-16 md:pt-24 pb-32">
      {/* Efeito circular suave no fundo */}
      <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full bg-slate-50 rounded-[100%] scale-[1.5] -translate-y-[20%] pointer-events-none"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 text-center z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
          Conectando quem quer <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">ajudar</span><br /> a quem precisa.
        </h1>
        <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          A plataforma perfeita para unir voluntários engajados a ONGs e projetos sociais. Faça parte dessa rede do bem.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/cadastro-voluntario" className="px-8 py-4 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-600/30">
            Quero ser voluntário
          </Link>
          <a href="#oportunidades" className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-medium hover:bg-slate-50 transition-all">
            Explorar Vagas
          </a>
        </div>
      </div>
    </section>
  );
}