import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
            ConectaVoluntário<span className="text-blue-500">.</span>
          </h2>
          <p className="text-sm">Transformando vontade em ação.</p>
        </div>
        
        <div className="flex gap-6 text-sm">
          <a href="#sobre" className="hover:text-white transition-colors">Sobre</a>
          <a href="#oportunidades" className="hover:text-white transition-colors">Vagas</a>
          <Link to="/cadastro-voluntario" className="hover:text-white transition-colors">Cadastre-se</Link>
        </div>
        
        <div className="text-sm text-slate-500">
          © {new Date().getFullYear()} ConectaVoluntário. Projeto de grupo.
        </div>
      </div>
    </footer>
  );
}