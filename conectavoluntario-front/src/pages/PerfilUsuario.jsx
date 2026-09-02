import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function PerfilUsuario() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-6 py-12 sm:px-12">
        
        {/* Cabeçalho do Perfil */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
          <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-bold shrink-0">
            JC
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Júlio César</h1>
            <p className="text-slate-500 mb-6">julio.cesar@exemplo.com • Voluntário desde Julho de 2026</p>
            
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3">Minhas Causas</h3>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">Educação</span>
                <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">Meio Ambiente</span>
              </div>
            </div>
          </div>
          <div>
            <button className="px-6 py-2 bg-slate-100 text-slate-700 font-medium rounded-full text-sm hover:bg-slate-200 transition-colors">
              Editar Perfil
            </button>
          </div>
        </div>

        {/* Minhas Vagas */}
        <div>
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Minhas Inscrições</h2>
            <Link to="/" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
              Buscar mais vagas &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex gap-4">
              <div className="w-24 h-24 rounded-2xl bg-slate-200 overflow-hidden shrink-0">
                <img src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=400&auto=format&fit=crop" alt="Educação" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">Aprovado</span>
                <h3 className="font-bold text-lg leading-tight mb-1">Reforço Escolar Comunitário</h3>
                <p className="text-sm text-slate-500">Instituto Educar • São Paulo</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex gap-4">
              <div className="w-24 h-24 rounded-2xl bg-slate-200 overflow-hidden shrink-0">
                <img src="https://images.unsplash.com/photo-1621451537084-482c73073e0f?auto=format&fit=crop&w=400&q=80" alt="Meio Ambiente" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Em Análise</span>
                <h3 className="font-bold text-lg leading-tight mb-1">Mutirão de Limpeza</h3>
                <p className="text-sm text-slate-500">Projeto Mar Limpo • Rio de Janeiro</p>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}