import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [userData, setUserData] = useState({ userName: '', role: '' });

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const storedRole = localStorage.getItem('role');

    if (storedName) {
      setUserData({
        userName: storedName,
        role: storedRole
      });
    }
  }, []);

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
          {userData.userName ? (
            <>
              <span className="hidden md:block text-sm font-medium text-slate-600">
                Olá, <strong className="text-blue-600">{userData.userName}</strong>
              </span>
              <Link
                to="/perfil"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm"
              >
                Meu Perfil
              </Link>
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