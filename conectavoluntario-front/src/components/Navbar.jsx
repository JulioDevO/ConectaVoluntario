import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [utilizador, setUtilizador] = useState(null);
  const navigate = useNavigate();

  // Busca os dados do localStorage assim que o componente é montado
  useEffect(() => {
    const userName = localStorage.getItem("userName");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");

    // Também verifica se foi guardado como um objeto "user" único (boa prática comum)
    const userObject = localStorage.getItem("user");

    if (userName) {
      setUtilizador({ userName, email, role });
    } else if (userObject) {
      setUtilizador(JSON.parse(userObject));
    }
  }, []);

  // Função para terminar sessão e limpar os dados
  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("user"); // Limpa também caso usem o objeto
    setUtilizador(null);
    navigate("/");
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
          <a href="#oportunidades" className="hover:text-slate-900 transition-colors">
            Vagas
          </a>
          <a href="#sobre" className="hover:text-slate-900 transition-colors">
            Sobre
          </a>
          <a href="#depoimentos" className="hover:text-slate-900 transition-colors">
            Impacto
          </a>
        </div>

        <div className="flex items-center gap-4">
          {utilizador ? (
            /* O que aparece quando o utilizador ESTÁ logado */
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-sm font-bold text-slate-800">
                  Olá, {utilizador.userName || utilizador.nome}
                </span>
                <span className="text-xs text-blue-600 font-medium capitalize">
                  {utilizador.role || utilizador.perfil || 'Voluntário'}
                </span>
              </div>
              
              <Link
                to="/perfil"
                className="hidden md:block text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                Meu Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
              >
                Sair
              </button>
            </div>
          ) : (
            /* O que aparece quando o utilizador NÃO ESTÁ logado */
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