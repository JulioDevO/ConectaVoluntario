import { Link, useNavigate } from "react-router-dom";
import { getSessao, estaAutenticado, limparSessao } from "../auth";

export default function Navbar() {
  const navigate = useNavigate();
  const logado = estaAutenticado();
  const { userName } = getSessao();

  const sair = () => {
    limparSessao();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 h-20 flex items-center justify-between">
        <Link
          to="/"
          onClick={() => window.scrollTo(0, 0)}
          className="text-xl font-bold text-slate-900 tracking-tight"
        >
          ConectaVoluntário<span className="text-blue-600">.</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link
            to="/"
            onClick={() => window.scrollTo(0, 0)}
            className="hover:text-slate-900 transition-colors"
          >
            Início
          </Link>
          <a
            href="#oportunidades"
            className="hover:text-slate-900 transition-colors"
          >
            Vagas
          </a>
          <a href="#sobre" className="hover:text-slate-900 transition-colors">
            Sobre
          </a>
          <a
            href="#depoimentos"
            className="hover:text-slate-900 transition-colors"
          >
            Impacto
          </a>
        </div>

        <div className="flex items-center gap-4">
          {logado ? (
            <>
              <span className="hidden md:block text-sm font-medium text-slate-600">
                Olá, <strong className="text-blue-600">{userName}</strong>
              </span>
              <Link
                to="/vagas"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm"
              >
                Ver Vagas
              </Link>
              <button
                onClick={sair}
                className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden md:block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Entrar
              </Link>
              <Link
                to="/cadastro-voluntario"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm"
              >
                Cadastre-se
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
