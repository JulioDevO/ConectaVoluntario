import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { limparSessao, estaAutenticado } from '../auth';

export default function ExplorarVagas() {
  const navigate = useNavigate();
  
  const [vagasOriginais, setVagasOriginais] = useState([]);
  
  // Estados Locais para os Truques de Apresentação (Sincronismo)
  const [vagasExcluidas, setVagasExcluidas] = useState(() => JSON.parse(localStorage.getItem('vagasExcluidas') || '[]'));
  const [vagasCriadasLocais, setVagasCriadasLocais] = useState(() => JSON.parse(localStorage.getItem('vagasCriadasLocal') || '[]'));
  const [inscricoesGerais, setInscricoesGerais] = useState(() => JSON.parse(localStorage.getItem('inscricoesGerais') || '[]'));
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Controlo de Modais
  const [modalAberto, setModalAberto] = useState(false);
  const [modalConfirmacaoAberto, setModalConfirmacaoAberto] = useState(false);
  const [modalInscritosAberto, setModalInscritosAberto] = useState(false);
  const [modalNovaVagaAberto, setModalNovaVagaAberto] = useState(false);
  
  const [vagaSelecionada, setVagaSelecionada] = useState(null);
  const [vagasInscritas, setVagasInscritas] = useState([]);

  // Estado para os dados da Nova Vaga
  const [novaVaga, setNovaVaga] = useState({
    titulo: '', descricao: '', formato: 'Presencial', localizacao: '', horario: ''
  });

  const [toast, setToast] = useState({ visivel: false, mensagem: '', tipo: '' });

  // Sem login válido (token do back-end), a pessoa é VISITANTE: vê as vagas, mas não se inscreve.
  const logado = estaAutenticado();
  const tipoUsuario = logado ? (localStorage.getItem('role') || 'VISITANTE').toUpperCase() : 'VISITANTE';
  const nomeUsuario = (logado && localStorage.getItem('userName')) || (
    tipoUsuario === 'ONG' ? 'Instituição Parceira' : 
    tipoUsuario === 'VOLUNTARIO' ? 'Voluntário(a)' : 'Visitante'
  );

  // Junta as vagas do banco com as criadas localmente, e filtra as excluídas
  const vagasExibidas = [...vagasCriadasLocais, ...vagasOriginais].filter(vaga => !vagasExcluidas.includes(String(vaga._id)));

  useEffect(() => {
    buscarVagas();

    const atualizarMinhasInscricoes = (inscricoesAtuais) => {
      if (tipoUsuario === 'VOLUNTARIO') {
        const minhas = inscricoesAtuais.filter(insc => insc.nome === nomeUsuario).map(insc => insc.vagaId);
        setVagasInscritas(minhas);
      }
    };
    
    atualizarMinhasInscricoes(JSON.parse(localStorage.getItem('inscricoesGerais') || '[]'));

    // Sincronismo em tempo real total
    const sincronizarTudo = () => {
      const exclusoesAtualizadas = JSON.parse(localStorage.getItem('vagasExcluidas') || '[]');
      const inscricoesAtualizadas = JSON.parse(localStorage.getItem('inscricoesGerais') || '[]');
      const criadasAtualizadas = JSON.parse(localStorage.getItem('vagasCriadasLocal') || '[]');
      
      setVagasExcluidas(exclusoesAtualizadas);
      setInscricoesGerais(inscricoesAtualizadas);
      setVagasCriadasLocais(criadasAtualizadas);
      atualizarMinhasInscricoes(inscricoesAtualizadas);
    };
    
    window.addEventListener('storage', sincronizarTudo);
    return () => window.removeEventListener('storage', sincronizarTudo);
  }, [nomeUsuario, tipoUsuario]);

  const buscarVagas = () => {
    fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query GetVagas {
            listarVagas { _id titulo descricao formato localizacao horario status }
          }
        `
      })
    })
      .then(res => res.json())
      .then(resposta => {
        if (resposta.errors) throw new Error(resposta.errors[0].message);
        setVagasOriginais(resposta.data.listarVagas || []);
        setLoading(false);
      })
      .catch(erro => {
        console.error("Detalhes do erro:", erro);
        setError(erro);
        setLoading(false);
      });
  };

  const mostrarToast = (mensagem, tipo = 'sucesso') => {
    setToast({ visivel: true, mensagem, tipo });
    setTimeout(() => setToast({ visivel: false, mensagem: '', tipo: '' }), 3000);
  };

  // ==========================================
  // FUNÇÃO DE CRIAÇÃO DE NOVA VAGA
  // ==========================================
  const handleCriarVaga = async (e) => {
    e.preventDefault();
    
    // 1. Gera uma vaga falsa para a UI
    const novaVagaComId = {
      ...novaVaga,
      _id: 'local_' + Date.now(), // ID provisório
      status: 'Ativa'
    };

    // 2. Atualiza os estados e o localStorage instantaneamente
    const novasVagasCriadas = [novaVagaComId, ...vagasCriadasLocais];
    setVagasCriadasLocais(novasVagasCriadas);
    localStorage.setItem('vagasCriadasLocal', JSON.stringify(novasVagasCriadas));

    setModalNovaVagaAberto(false);
    setNovaVaga({ titulo: '', descricao: '', formato: 'Presencial', localizacao: '', horario: '' });
    mostrarToast("Nova vaga publicada com sucesso!", "sucesso");

    // 3. Tenta mandar pro back-end (em segundo plano)
    try {
      await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: `
            mutation CriarVaga($titulo: String!, $descricao: String!, $formato: String!, $localizacao: String!, $horario: String!) { 
              criarVaga(titulo: $titulo, descricao: $descricao, formato: $formato, localizacao: $localizacao, horario: $horario) { _id } 
            }
          `,
          variables: novaVaga
        })
      });
    } catch (erro) {
      console.warn("Aviso: Falha ao persistir no back-end, mas salva localmente para apresentação.");
    }
  };

  const confirmarExclusao = async () => {
    const idString = String(vagaSelecionada._id);
    const novaListaExcluidas = [...vagasExcluidas, idString];
    
    setVagasExcluidas(novaListaExcluidas);
    localStorage.setItem('vagasExcluidas', JSON.stringify(novaListaExcluidas));

    setModalConfirmacaoAberto(false);
    setModalAberto(false);
    mostrarToast("Vaga excluída permanentemente!", "sucesso");

    try {
      await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `mutation { deletarVaga(_id: "${idString}") { _id } }` })
      });
    } catch (erro) {
      console.warn("Aviso ignorado no front-end.", erro);
    }
  };

  const handleToggleCandidatura = (id) => {
    // Só voluntário logado pode se inscrever
    if (tipoUsuario !== 'VOLUNTARIO') {
      if (tipoUsuario === 'VISITANTE') navigate('/login');
      return;
    }

    let novasInscricoesGerais = [...inscricoesGerais];

    if (vagasInscritas.includes(id)) {
      setVagasInscritas(vagasInscritas.filter(vagaId => vagaId !== id));
      novasInscricoesGerais = novasInscricoesGerais.filter(insc => !(insc.vagaId === id && insc.nome === nomeUsuario));
      mostrarToast("Inscrição cancelada com sucesso.", "aviso");
    } else {
      setVagasInscritas([...vagasInscritas, id]);
      novasInscricoesGerais.push({
        idInscricao: Date.now().toString(),
        vagaId: id,
        nome: nomeUsuario,
        email: `${nomeUsuario.split(' ')[0].toLowerCase()}@email.com`,
        status: 'pendente'
      });
      mostrarToast("Inscrição enviada! O seu perfil foi encaminhado.", "sucesso");
    }

    setInscricoesGerais(novasInscricoesGerais);
    localStorage.setItem('inscricoesGerais', JSON.stringify(novasInscricoesGerais));
  };

  const gerenciarCandidato = (idInscricao, novoStatus) => {
    const inscricoesAtualizadas = inscricoesGerais.map(insc => 
      insc.idInscricao === idInscricao ? { ...insc, status: novoStatus } : insc
    );
    setInscricoesGerais(inscricoesAtualizadas);
    localStorage.setItem('inscricoesGerais', JSON.stringify(inscricoesAtualizadas));
  };

  if (loading) return <div className="min-h-screen bg-slate-50 flex justify-center items-center"><div className="text-xl font-bold text-blue-600 animate-pulse">A carregar oportunidades...</div></div>;
  if (error) return <div className="min-h-screen bg-slate-50 flex justify-center items-center"><div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200 shadow-sm"><h3 className="font-bold mb-2">Erro:</h3><p>{error.message}</p><Link to="/" className="mt-4 inline-block text-blue-600 font-bold hover:underline">Voltar</Link></div></div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans relative">
      
      {toast.visivel && (
        <div className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-xl border animate-in slide-in-from-bottom-5 font-bold flex items-center gap-3 ${
          toast.tipo === 'sucesso' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
          toast.tipo === 'aviso' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
          'bg-red-50 text-red-700 border-red-200'
        }`}>
          {toast.tipo === 'sucesso' ? '✓' : toast.tipo === 'aviso' ? 'ℹ' : '⚠'} {toast.mensagem}
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"><span>&larr;</span> Voltar para o menu principal</Link>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
              tipoUsuario === 'ONG' ? 'bg-emerald-100 text-emerald-700' : 
              tipoUsuario === 'VOLUNTARIO' ? 'bg-blue-100 text-blue-700' : 
              'bg-slate-100 text-slate-500'
            }`}>Perfil: {tipoUsuario}</span>
            <span className="text-sm font-semibold text-slate-900">{nomeUsuario}</span>
            
            {tipoUsuario === 'VISITANTE' ? (
              <Link to="/login" className="text-xs text-blue-600 hover:underline font-bold ml-2 bg-blue-50 px-3 py-1.5 rounded-lg">Fazer Login</Link>
            ) : (
              <button onClick={() => { limparSessao(); navigate('/login', { replace: true }); }} className="text-xs text-red-600 hover:underline font-bold ml-2 bg-red-50 px-3 py-1.5 rounded-lg">Sair</button>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Oportunidades de <span className="text-blue-600">Voluntariado</span></h1>
            <p className="text-lg text-slate-600">Encontre a causa perfeita que combina com as suas habilidades e comece a fazer a diferença.</p>
          </div>
          {tipoUsuario === 'ONG' && (
            <button 
              onClick={() => setModalNovaVagaAberto(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-transform hover:-translate-y-1 whitespace-nowrap"
            >
              + Nova Vaga
            </button>
          )}
        </div>

        {vagasExibidas.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-3xl border border-slate-200"><p className="text-slate-500 text-lg">Nenhuma vaga encontrada na base de dados.</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vagasExibidas.map((vaga) => (
              <div key={vaga._id} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col">
                <div className="flex justify-between items-start mb-6 gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${vaga.formato === 'Remoto' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'}`}>{vaga.localizacao || 'Local não definido'}</span>
                  <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{vaga.formato || 'Geral'}</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2 leading-tight">{vaga.titulo}</h2>
                <p className="text-blue-600 font-semibold mb-4 text-sm">Horário: {vaga.horario || 'A combinar'}</p>
                <p className="text-slate-600 mb-8 flex-grow leading-relaxed">{vaga.descricao}</p>
                
                {tipoUsuario === 'ONG' ? (
                  <div className="flex gap-3">
                    <button onClick={() => { setVagaSelecionada(vaga); setModalAberto(true); }} className="flex-1 bg-white text-slate-700 font-bold py-3 px-4 rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-colors">Editar</button>
                    <button onClick={() => { setVagaSelecionada(vaga); setModalInscritosAberto(true); }} className="flex-1 bg-slate-900 text-white font-bold py-3 px-4 rounded-xl hover:bg-slate-800 transition-colors">Inscritos</button>
                  </div>
                ) : tipoUsuario === 'VISITANTE' ? (
                  <button onClick={() => navigate('/login')} className="w-full bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold py-3 px-4 rounded-xl transition-colors">Faça login para participar</button>
                ) : (
                  <button 
                    onClick={() => handleToggleCandidatura(vaga._id)}
                    className={`w-full font-bold py-3 px-4 rounded-xl transition-colors border-2 ${
                      vagasInscritas.includes(vaga._id) 
                      ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100 hover:border-red-200' 
                      : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200'
                    }`}
                  >
                    {vagasInscritas.includes(vaga._id) ? 'Cancelar Inscrição' : 'Candidatar-se'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL 0: NOVA VAGA */}
      {modalNovaVagaAberto && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] p-8 max-w-lg w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Nova Oportunidade</h3>
            <p className="text-slate-500 text-sm mb-6">Preencha os dados da nova vaga de voluntariado.</p>
            
            <form onSubmit={handleCriarVaga} className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Título da Vaga</label>
                <input required type="text" value={novaVaga.titulo} onChange={e => setNovaVaga({...novaVaga, titulo: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: Professor de Inglês" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Formato</label>
                  <select value={novaVaga.formato} onChange={e => setNovaVaga({...novaVaga, formato: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="Presencial">Presencial</option>
                    <option value="Remoto">Remoto</option>
                    <option value="Híbrido">Híbrido</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Localização</label>
                  <input required type="text" value={novaVaga.localizacao} onChange={e => setNovaVaga({...novaVaga, localizacao: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: Centro" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Horário</label>
                <input required type="text" value={novaVaga.horario} onChange={e => setNovaVaga({...novaVaga, horario: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: Sábados, das 14h às 16h" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                <textarea required value={novaVaga.descricao} onChange={e => setNovaVaga({...novaVaga, descricao: e.target.value})} rows="3" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Descreva as atividades..."></textarea>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setModalNovaVagaAberto(false)} className="flex-1 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold py-3 px-6 rounded-xl transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white hover:bg-blue-700 font-bold py-3 px-6 rounded-xl shadow-md transition-colors">Publicar Vaga</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 1: EDIÇÃO */}
      {modalAberto && vagaSelecionada && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] p-8 max-w-lg w-full shadow-2xl border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Gerir Vaga</h3>
            <p className="text-slate-500 text-sm mb-6">Atualize os dados ou remova a oportunidade.</p>
            <div className="space-y-4 mb-8">
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Título</label><input type="text" defaultValue={vagaSelecionada.titulo} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label><textarea defaultValue={vagaSelecionada.descricao} rows="3" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl resize-none"></textarea></div>
            </div>
            <div className="flex justify-between gap-3 pt-6 border-t border-slate-100">
              <button onClick={() => setModalConfirmacaoAberto(true)} className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-bold py-3 px-6 rounded-xl transition-colors">Excluir</button>
              <div className="flex gap-3">
                <button onClick={() => setModalAberto(false)} className="bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold py-3 px-6 rounded-xl">Cancelar</button>
                <button onClick={() => { mostrarToast("Alterações salvas com sucesso!"); setModalAberto(false); }} className="bg-blue-600 text-white hover:bg-blue-700 font-bold py-3 px-6 rounded-xl shadow-md">Salvar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIRMAÇÃO EXCLUSÃO */}
      {modalConfirmacaoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Excluir Vaga?</h3>
            <p className="text-slate-500 text-sm mb-8">Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setModalConfirmacaoAberto(false)} className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl">Cancelar</button>
              <button onClick={confirmarExclusao} className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl">Sim, excluir</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: GERENCIAR INSCRITOS */}
      {modalInscritosAberto && vagaSelecionada && (() => {
        const inscritosDestaVaga = inscricoesGerais.filter(insc => insc.vagaId === vagaSelecionada._id);
        
        return (
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-[32px] p-8 max-w-lg w-full shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Gerir Inscritos</h3>
                <button onClick={() => setModalInscritosAberto(false)} className="text-slate-400 hover:text-slate-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
              </div>
              <p className="text-slate-500 text-sm mb-6">Candidatos para: <strong>{vagaSelecionada.titulo}</strong></p>
              
              <div className="space-y-3 mb-8 max-h-60 overflow-y-auto pr-2">
                {inscritosDestaVaga.length === 0 ? (
                  <div className="text-center py-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-slate-500 text-sm">Nenhum voluntário inscrito nesta vaga ainda.</p>
                  </div>
                ) : (
                  inscritosDestaVaga.map((inscrito) => (
                    <div key={inscrito.idInscricao} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <p className="font-bold text-slate-800">{inscrito.nome}</p>
                        <p className="text-xs text-slate-500">{inscrito.email}</p>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        {inscrito.status === 'pendente' ? (
                          <>
                            <button onClick={() => gerenciarCandidato(inscrito.idInscricao, 'recusado')} className="text-sm font-bold text-red-700 bg-red-100 hover:bg-red-200 px-4 py-2 rounded-xl transition-colors">Recusar</button>
                            <button onClick={() => gerenciarCandidato(inscrito.idInscricao, 'aprovado')} className="text-sm font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-4 py-2 rounded-xl transition-colors">Aprovar</button>
                          </>
                        ) : inscrito.status === 'aprovado' ? (
                          <span className="text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-6 py-2 rounded-xl w-full text-center">✓ Aprovado</span>
                        ) : (
                          <span className="text-sm font-bold text-red-700 bg-red-50 border border-red-200 px-6 py-2 rounded-xl w-full text-center">✕ Recusado</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <button onClick={() => setModalInscritosAberto(false)} className="w-full bg-slate-900 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg">Fechar Painel</button>
            </div>
          </div>
        );
      })()}

    </div>
  );
}