import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { limparSessao, getSessao } from '../auth';
import { graphql } from '../api';
import Toast from '../components/Toast';
import VagaCard from '../components/VagaCard';
import VagaFormModal from '../components/VagaFormModal';
import ModalInscritos from '../components/ModalInscritos';
import ModalConfirmacao from '../components/ModalConfirmacao';

const CAMPOS_DA_VAGA = `
  _id titulo descricao formato localizacao horario status ongId totalCandidatos
  ong { nomeFantasia }
  minhaCandidatura { statusInscricao }
`;

// De quanto em quanto tempo a lista é atualizada sozinha (mudanças feitas por outros usuários)
const INTERVALO_ATUALIZACAO_MS = 15000;

export default function ExplorarVagas() {
  const navigate = useNavigate();
  const { role: perfil, userName, userId } = getSessao();

  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erroCarga, setErroCarga] = useState(null);
  const [ocupado, setOcupado] = useState(false);
  const [toast, setToast] = useState({ visivel: false, mensagem: '', tipo: '' });
  const timerToast = useRef(null);

  // Modais: 'nova' | 'editar' | 'excluir' | 'inscritos' | null
  const [modal, setModal] = useState(null);
  const [vagaSelecionada, setVagaSelecionada] = useState(null);

  const mostrarToast = useCallback((mensagem, tipo = 'sucesso') => {
    clearTimeout(timerToast.current);
    setToast({ visivel: true, mensagem, tipo });
    timerToast.current = setTimeout(() => setToast({ visivel: false, mensagem: '', tipo: '' }), 3500);
  }, []);

  // Erros de API viram aviso na tela. Se a sessão expirou, volta para o login.
  const tratarErro = useCallback((erro) => {
    if (erro.codigo === 'UNAUTHENTICATED') {
      limparSessao();
      navigate('/login', { replace: true });
      return;
    }
    mostrarToast(erro.message, 'erro');
  }, [mostrarToast, navigate]);

  const carregarVagas = useCallback(async ({ silencioso = false } = {}) => {
    try {
      const dados = await graphql(`query Vagas { listarVagas { ${CAMPOS_DA_VAGA} } }`);
      setVagas(dados.listarVagas || []);
      setErroCarga(null);
    } catch (erro) {
      // Numa atualização automática, falhar em silêncio é melhor do que trocar a tela por um erro
      if (!silencioso) setErroCarga(erro);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Carga inicial de dados vindos da API (a atualização de estado acontece após o await)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregarVagas();

    const atualizar = () => {
      if (document.visibilityState === 'visible') carregarVagas({ silencioso: true });
    };
    const intervalo = setInterval(atualizar, INTERVALO_ATUALIZACAO_MS);
    document.addEventListener('visibilitychange', atualizar);

    return () => {
      clearInterval(intervalo);
      document.removeEventListener('visibilitychange', atualizar);
      clearTimeout(timerToast.current);
    };
  }, [carregarVagas]);

  // Executa uma ação no back-end e, se der certo, mostra o aviso e recarrega a lista.
  const executar = async (acao, mensagemSucesso, tipoToast = 'sucesso') => {
    setOcupado(true);
    try {
      await acao();
      mostrarToast(mensagemSucesso, tipoToast);
      setModal(null);
      setVagaSelecionada(null);
      await carregarVagas({ silencioso: true });
    } catch (erro) {
      tratarErro(erro);
    } finally {
      setOcupado(false);
    }
  };

  // ---------- Ações da ONG ----------

  const criarVaga = (dados) =>
    executar(
      () => graphql(
        `mutation CriarVaga($input: VagaInput!) { criarVaga(input: $input) { _id } }`,
        { input: dados }
      ),
      'Nova vaga publicada com sucesso!'
    );

  const salvarEdicao = (dados) =>
    executar(
      () => graphql(
        `mutation AtualizarVaga($id: ID!, $input: VagaAtualizacaoInput!) { atualizarVaga(id: $id, input: $input) { _id } }`,
        { id: vagaSelecionada._id, input: dados }
      ),
      'Alterações salvas com sucesso!'
    );

  const excluirVaga = () =>
    executar(
      () => graphql(`mutation RemoverVaga($id: ID!) { removerVaga(id: $id) { _id } }`, { id: vagaSelecionada._id }),
      'Vaga excluída com sucesso.'
    );

  // ---------- Ações do voluntário ----------

  const candidatar = (vagaId) =>
    executar(
      () => graphql(`mutation Candidatar($id: ID!) { candidatar(vagaId: $id) { _id } }`, { id: vagaId }),
      'Inscrição enviada! A instituição vai analisar o seu perfil.'
    );

  const cancelarInscricao = (vagaId) =>
    executar(
      () => graphql(`mutation Cancelar($id: ID!) { cancelarCandidatura(vagaId: $id) { _id } }`, { id: vagaId }),
      'Inscrição cancelada com sucesso.',
      'aviso'
    );

  const abrirModal = (tipo, vaga = null) => {
    setVagaSelecionada(vaga);
    setModal(tipo);
  };
  const fecharModal = () => {
    setModal(null);
    setVagaSelecionada(null);
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex justify-center items-center"><div className="text-xl font-bold text-blue-600 animate-pulse">A carregar oportunidades...</div></div>;
  }

  if (erroCarga) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center px-4">
        <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200 shadow-sm">
          <h3 className="font-bold mb-2">Erro:</h3>
          <p>{erroCarga.message}</p>
          <button onClick={() => { setLoading(true); carregarVagas(); }} className="mt-4 mr-4 text-blue-600 font-bold hover:underline">Tentar novamente</button>
          <Link to="/" className="mt-4 inline-block text-blue-600 font-bold hover:underline">Voltar</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans relative">
      <Toast toast={toast} />

      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"><span>&larr;</span> Voltar para o menu principal</Link>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
              perfil === 'ONG' ? 'bg-emerald-100 text-emerald-700' :
              perfil === 'VOLUNTARIO' ? 'bg-blue-100 text-blue-700' :
              'bg-slate-100 text-slate-500'
            }`}>Perfil: {perfil}</span>
            <span className="text-sm font-semibold text-slate-900">{userName}</span>

            {perfil === 'VISITANTE' ? (
              <Link to="/login" className="text-xs text-blue-600 hover:underline font-bold ml-2 bg-blue-50 px-3 py-1.5 rounded-lg">Fazer Login</Link>
            ) : (
              <button onClick={() => { limparSessao(); navigate('/login', { replace: true }); }} className="text-xs text-red-600 hover:underline font-bold ml-2 bg-red-50 px-3 py-1.5 rounded-lg">Sair</button>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Oportunidades de <span className="text-blue-600">Voluntariado</span></h1>
            <p className="text-lg text-slate-600">Encontre a causa perfeita que combina com as suas habilidades e comece a fazer a diferença.</p>
          </div>
          {perfil === 'ONG' && (
            <button
              onClick={() => abrirModal('nova')}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-transform hover:-translate-y-1 whitespace-nowrap"
            >
              + Nova Vaga
            </button>
          )}
        </div>

        {vagas.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-3xl border border-slate-200"><p className="text-slate-500 text-lg">Nenhuma vaga encontrada no momento.</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vagas.map((vaga) => (
              <VagaCard
                key={vaga._id}
                vaga={vaga}
                perfil={perfil}
                ehDonaDaVaga={perfil === 'ONG' && vaga.ongId === userId}
                ocupado={ocupado}
                onEditar={(v) => abrirModal('editar', v)}
                onInscritos={(v) => abrirModal('inscritos', v)}
                onCandidatar={candidatar}
                onCancelar={cancelarInscricao}
                onLogin={() => navigate('/login')}
              />
            ))}
          </div>
        )}
      </div>

      {modal === 'nova' && (
        <VagaFormModal vaga={null} salvando={ocupado} onSalvar={criarVaga} onCancelar={fecharModal} />
      )}

      {modal === 'editar' && vagaSelecionada && (
        <VagaFormModal
          vaga={vagaSelecionada}
          salvando={ocupado}
          onSalvar={salvarEdicao}
          onCancelar={fecharModal}
          onExcluir={() => setModal('excluir')}
        />
      )}

      {modal === 'excluir' && vagaSelecionada && (
        <ModalConfirmacao
          titulo="Excluir Vaga?"
          descricao="Esta ação não pode ser desfeita e remove também as inscrições dos voluntários."
          textoConfirmar="Sim, excluir"
          carregando={ocupado}
          onConfirmar={excluirVaga}
          onCancelar={() => setModal('editar')}
        />
      )}

      {modal === 'inscritos' && vagaSelecionada && (
        <ModalInscritos
          vaga={vagaSelecionada}
          onFechar={fecharModal}
          onAlterado={(mensagem) => mostrarToast(mensagem)}
          onErro={tratarErro}
        />
      )}
    </div>
  );
}
