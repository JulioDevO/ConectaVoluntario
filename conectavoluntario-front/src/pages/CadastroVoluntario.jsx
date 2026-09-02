import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Cadastro() {
  const [tipoUsuario, setTipoUsuario] = useState('voluntario'); // 'voluntario' ou 'ong'
  const [interessesSelecionados, setInteressesSelecionados] = useState([]);
  
  const causasDisponiveis = ['Educação', 'Meio Ambiente', 'Causa Animal', 'Saúde e Bem-estar', 'Inclusão Social', 'Combate à Fome'];

  const toggleInteresse = (causa) => {
    if (interessesSelecionados.includes(causa)) {
      setInteressesSelecionados(interessesSelecionados.filter(item => item !== causa));
    } else {
      setInteressesSelecionados([...interessesSelecionados, causa]);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      
      {/* Efeitos de Fundo */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-400/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-400/10 blur-[120px] pointer-events-none"></div>

      {/* Botão Voltar */}
      <div className="absolute top-6 left-6 md:top-8 md:left-10 z-50">
        <Link to="/" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors bg-white/60 backdrop-blur-md px-5 py-2.5 rounded-full border border-slate-200/50 shadow-sm">
          <span>&larr;</span> Voltar para o início
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 mt-10 sm:mt-0">
        <Link to="/" className="text-2xl font-bold text-slate-900 tracking-tight">ConectaVoluntário<span className="text-blue-600">.</span></Link>
        <h2 className="mt-6 text-3xl font-extrabold text-slate-900 tracking-tight">Crie sua conta</h2>
        <p className="mt-2 text-sm text-slate-600 mb-6">Junte-se a nós para transformar realidades.</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        <div className="bg-white/80 backdrop-blur-xl py-8 px-6 shadow-xl shadow-slate-200/50 sm:rounded-[32px] sm:px-10 border border-white">
          
          {/* Chave Seletora (Toggle) */}
          <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
            <button 
              type="button"
              onClick={() => setTipoUsuario('voluntario')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${tipoUsuario === 'voluntario' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Sou Voluntário
            </button>
            <button 
              type="button"
              onClick={() => setTipoUsuario('ong')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${tipoUsuario === 'ong' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Represento uma ONG
            </button>
          </div>

          <form className="space-y-5" action="#" method="POST">
            
            {/* Campos Dinâmicos: Mudam conforme a seleção */}
            {tipoUsuario === 'voluntario' ? (
              // FORMULÁRIO DO VOLUNTÁRIO
              <>
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-slate-700 mb-1">Nome completo</label>
                  <input id="nome" name="nome" type="text" required className="appearance-none block w-full px-4 py-3 bg-white/50 border border-slate-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Ex: Júlio César" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Áreas de interesse</label>
                  <div className="flex flex-wrap gap-2">
                    {causasDisponiveis.map((causa) => (
                      <button key={causa} type="button" onClick={() => toggleInteresse(causa)} className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${interessesSelecionados.includes(causa) ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white/60 text-slate-600 border-slate-200 hover:border-blue-400'}`}>
                        {causa}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              // FORMULÁRIO DA ONG
              <>
                <div>
                  <label htmlFor="nomeFantasia" className="block text-sm font-medium text-slate-700 mb-1">Nome da ONG / Instituição</label>
                  <input id="nomeFantasia" name="nomeFantasia" type="text" required className="appearance-none block w-full px-4 py-3 bg-white/50 border border-slate-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" placeholder="Ex: Instituto Educar" />
                </div>
                <div>
                  <label htmlFor="cnpj" className="block text-sm font-medium text-slate-700 mb-1">CNPJ</label>
                  <input id="cnpj" name="cnpj" type="text" required className="appearance-none block w-full px-4 py-3 bg-white/50 border border-slate-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" placeholder="00.000.000/0000-00" />
                </div>
                <div>
                  <label htmlFor="descricao" className="block text-sm font-medium text-slate-700 mb-1">Breve Descrição</label>
                  <textarea id="descricao" name="descricao" rows="2" className="appearance-none block w-full px-4 py-3 bg-white/50 border border-slate-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none" placeholder="Qual a missão da sua instituição?"></textarea>
                </div>
              </>
            )}

            {/* Campos Comuns (Sempre aparecem) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">E-mail corporativo/pessoal</label>
                <input id="email" name="email" type="email" required className="appearance-none block w-full px-4 py-3 bg-white/50 border border-slate-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all" placeholder="voce@exemplo.com" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
                <input id="password" name="password" type="password" required className="appearance-none block w-full px-4 py-3 bg-white/50 border border-slate-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all" placeholder="••••••••" />
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-full shadow-md text-sm font-medium text-white transition-all hover:-translate-y-0.5 ${tipoUsuario === 'voluntario' ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' : 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500'}`}>
                {tipoUsuario === 'voluntario' ? 'Concluir Cadastro de Voluntário' : 'Cadastrar Instituição'}
              </button>
            </div>
          </form>
          
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200/60" /></div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-slate-500">Já tem uma conta? <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">Faça login</Link></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}