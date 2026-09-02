import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-400/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-400/20 blur-[120px] pointer-events-none"></div>

      <div className="absolute top-6 left-6 md:top-8 md:left-10 z-50">
        <Link to="/" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors bg-white/60 backdrop-blur-md px-5 py-2.5 rounded-full border border-slate-200/50 shadow-sm">
          <span>&larr;</span> Voltar para o início
        </Link>
      </div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 mt-10 sm:mt-0">
        <Link to="/" className="text-2xl font-bold text-slate-900 tracking-tight">
          ConectaVoluntário<span className="text-blue-600">.</span>
        </Link>
        <h2 className="mt-6 text-3xl font-extrabold text-slate-900 tracking-tight">Acesse sua conta</h2>
        <p className="mt-2 text-sm text-slate-600 mb-8">Bem-vindo de volta! Faça login para continuar.</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-xl py-8 px-6 shadow-xl shadow-slate-200/50 sm:rounded-[32px] sm:px-10 border border-white">
          <form className="space-y-6" action="#" method="POST">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Endereço de e-mail</label>
              <input id="email" name="email" type="email" required className="appearance-none block w-full px-4 py-3 bg-white/50 border border-slate-300 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" placeholder="voce@exemplo.com" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">Senha</label>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">Esqueceu a senha?</a>
              </div>
              <input id="password" name="password" type="password" required className="appearance-none block w-full px-4 py-3 bg-white/50 border border-slate-300 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" placeholder="••••••••" />
            </div>

            <div className="pt-2">
              <Link to="/" className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-full shadow-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:-translate-y-0.5">
                Entrar
              </Link>
            </div>
          </form>
          
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200/60" /></div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-slate-500">Ainda não tem conta? <Link to="/cadastro-voluntario" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">Cadastre-se</Link></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}