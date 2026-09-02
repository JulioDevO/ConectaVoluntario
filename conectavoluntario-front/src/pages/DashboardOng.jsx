import Navbar from '../components/Navbar';

export default function DashboardOng() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-12 sm:px-12">
        
        {/* Cabeçalho da ONG */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
          <div className="w-32 h-32 rounded-3xl bg-emerald-100 flex items-center justify-center text-emerald-600 text-4xl font-bold shrink-0">
            IE
          </div>
          <div className="text-center md:text-left flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2 justify-center md:justify-start">
              <h1 className="text-3xl font-bold tracking-tight">Instituto Educar</h1>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-full border border-emerald-200">
                Conta Verificada
              </span>
            </div>
            <p className="text-slate-500 mb-6">CNPJ: 12.345.678/0001-90 • contato@institutoeducar.org</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <button className="px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-full text-sm hover:bg-emerald-700 transition-colors shadow-sm">
                + Criar Nova Vaga
              </button>
              <button className="px-6 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-full text-sm hover:bg-slate-200 transition-colors">
                Editar Perfil
              </button>
            </div>
          </div>
        </div>

        {/* Grid do Painel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coluna Principal: Vagas Ativas */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Nossas Vagas Ativas</h2>
            
            {/* Vaga 1 */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-xl mb-1">Professor(a) de Matemática</h3>
                  <p className="text-sm text-slate-500">Reforço para turmas do Ensino Fundamental II</p>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100">Presencial</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-slate-600 mb-6">
                <span className="flex items-center gap-1">📍 São Paulo, SP</span>
                <span className="flex items-center gap-1">⏱️ Sábados, 09h às 12h</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors">
                  Editar Vaga
                </button>
                <button className="flex-1 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors">
                  Ver Inscritos (2)
                </button>
              </div>
            </div>

            {/* Vaga 2 */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-xl mb-1">Mentor(a) de Carreira</h3>
                  <p className="text-sm text-slate-500">Orientação vocacional para jovens do Ensino Médio</p>
                </div>
                <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full border border-purple-100">Remoto</span>
              </div>
              <div className="flex items-center gap-6 text-sm text-slate-600 mb-6">
                <span className="flex items-center gap-1">📍 Online</span>
                <span className="flex items-center gap-1">⏱️ Horário Flexível</span>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors">
                  Editar Vaga
                </button>
                <button className="flex-1 py-2 border border-slate-200 text-slate-400 rounded-xl text-sm font-medium cursor-not-allowed">
                  Sem inscritos ainda
                </button>
              </div>
            </div>
          </div>

          {/* Coluna Lateral: Candidaturas Recentes */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Candidaturas</h2>
            
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-4">
              
              {/* Candidato 1 */}
              <div className="pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                    JC
                  </div>
                  <div>
                    <h4 className="font-bold text-sm leading-none mb-1">Júlio César</h4>
                    <p className="text-xs text-slate-500">Vaga: Prof. de Matemática</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-medium hover:bg-emerald-600 transition-colors">Aprovar</button>
                  <button className="flex-1 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors">Perfil</button>
                </div>
              </div>

              {/* Candidato 2 */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm shrink-0">
                    MA
                  </div>
                  <div>
                    <h4 className="font-bold text-sm leading-none mb-1">Mariana Alves</h4>
                    <p className="text-xs text-slate-500">Vaga: Prof. de Matemática</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-medium hover:bg-emerald-600 transition-colors">Aprovar</button>
                  <button className="flex-1 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors">Perfil</button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}