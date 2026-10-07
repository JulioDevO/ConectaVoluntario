import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ExplorarVagas() {
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lê quem está logado e normaliza para maiúsculas (evita conflitos de case)
  const tipoUsuario = (localStorage.getItem('role') || 'VOLUNTARIO').toUpperCase();
  const nomeUsuario = localStorage.getItem('userName') || (tipoUsuario === 'ONG' ? 'Instituição Parceira' : 'Voluntário(a)');

  useEffect(() => {
    fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query GetVagas {
            listarVagas {
              _id
              titulo
              descricao
              formato
              localizacao
              horario
              status
            }
          }
        `
      })
    })
      .then(res => res.json())
      .then(resposta => {
        if (resposta.errors) {
          throw new Error(resposta.errors[0].message);
        }
        setVagas(resposta.data.listarVagas || []);
        setLoading(false);
      })
      .catch(erro => {
        console.error("Detalhes do erro:", erro);
        setError(erro);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="text-xl font-bold text-blue-600 animate-pulse">A carregar oportunidades...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200 shadow-sm">
          <h3 className="font-bold mb-2">Erro de ligação:</h3>
          <p>{error.message}</p>
          <Link to="/" className="mt-4 inline-block text-blue-600 font-bold hover:underline">Voltar para o início</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Barra superior com Voltar e Identificação de Perfil Ativo */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
            <span>&larr;</span> Voltar para o menu principal
          </Link>
          
          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${tipoUsuario === 'ONG' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
              Perfil: {tipoUsuario}
            </span>
            <span className="text-sm font-semibold text-slate-900">
              {nomeUsuario}
            </span>
            <button 
              onClick={() => { localStorage.clear(); window.location.reload(); }}
              className="text-xs text-red-600 hover:underline font-semibold ml-2 bg-red-50 px-2.5 py-1 rounded-lg"
            >
              Sair
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Oportunidades de <span className="text-blue-600">Voluntariado</span>
            </h1>
            <p className="text-lg text-slate-600">
              Encontre a causa perfeita que combina com as suas habilidades e comece a fazer a diferença.
            </p>
          </div>
          
          {/* RENDERIZAÇÃO CONDICIONAL: Só aparece se o perfil logado for ONG */}
          {tipoUsuario === 'ONG' && (
            <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-transform hover:-translate-y-1 whitespace-nowrap">
              + Nova Vaga
            </button>
          )}
        </div>

        {vagas.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-3xl border border-slate-200">
            <p className="text-slate-500 text-lg">Nenhuma vaga encontrada na base de dados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vagas.map((vaga) => (
              <div key={vaga._id} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col">
                <div className="flex justify-between items-start mb-6 gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${vaga.formato === 'Remoto' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {vaga.localizacao || 'Local não definido'}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                    {vaga.formato || 'Geral'}
                  </span>
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 mb-2 leading-tight">{vaga.titulo}</h2>
                <p className="text-blue-600 font-semibold mb-4 text-sm">
                  Horário: {vaga.horario || 'A combinar'}
                </p>
                <p className="text-slate-600 mb-8 flex-grow leading-relaxed">
                  {vaga.descricao}
                </p>
                
                {/* RENDERIZAÇÃO CONDICIONAL DOS BOTÕES DE AÇÃO */}
                {tipoUsuario === 'ONG' ? (
                  <div className="flex gap-3">
                    <button className="flex-1 bg-white text-slate-700 font-bold py-3 px-4 rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-colors">Editar</button>
                    <button className="flex-1 bg-slate-900 text-white font-bold py-3 px-4 rounded-xl hover:bg-slate-800 transition-colors">Inscritos</button>
                  </div>
                ) : (
                  <button className="w-full bg-blue-600 text-white hover:bg-blue-700 font-bold py-3 px-4 rounded-xl shadow-md shadow-blue-200 transition-colors">Candidatar-se</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}