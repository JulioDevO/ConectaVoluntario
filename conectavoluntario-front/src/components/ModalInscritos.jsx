import { useEffect, useState } from 'react';
import { graphql } from '../api';

// Lista os voluntários inscritos numa vaga (somente a ONG dona da vaga) e permite aprovar/recusar.
export default function ModalInscritos({ vaga, onFechar, onAlterado, onErro }) {
  const [candidatos, setCandidatos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    graphql(
      `query Candidatos($vagaId: ID!) {
        listarCandidatos(vagaId: $vagaId) {
          voluntarioId
          statusInscricao
          voluntario { nome email telefone }
        }
      }`,
      { vagaId: vaga._id }
    )
      .then((dados) => ativo && setCandidatos(dados.listarCandidatos || []))
      .catch((erro) => ativo && onErro(erro))
      .finally(() => ativo && setCarregando(false));
    return () => { ativo = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaga._id]);

  const alterarStatus = async (voluntarioId, status) => {
    try {
      await graphql(
        `mutation Status($vagaId: ID!, $voluntarioId: ID!, $status: String!) {
          atualizarStatusCandidatura(vagaId: $vagaId, voluntarioId: $voluntarioId, status: $status) { _id }
        }`,
        { vagaId: vaga._id, voluntarioId, status }
      );
      setCandidatos((atuais) => atuais.map((c) => (c.voluntarioId === voluntarioId ? { ...c, statusInscricao: status } : c)));
      onAlterado(`Candidato ${status === 'Aprovado' ? 'aprovado' : 'recusado'} com sucesso.`);
    } catch (erro) {
      onErro(erro);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-[32px] p-6 sm:p-8 max-w-lg w-full shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-slate-900">Gerir Inscritos</h3>
          <button onClick={onFechar} aria-label="Fechar" className="text-slate-400 hover:text-slate-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <p className="text-slate-500 text-sm mb-6">Candidatos para: <strong>{vaga.titulo}</strong></p>

        <div className="space-y-3 mb-8 max-h-60 overflow-y-auto pr-2">
          {carregando ? (
            <p className="text-center text-slate-500 text-sm py-6 animate-pulse">A carregar candidatos...</p>
          ) : candidatos.length === 0 ? (
            <div className="text-center py-6 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-slate-500 text-sm">Nenhum voluntário inscrito nesta vaga ainda.</p>
            </div>
          ) : (
            candidatos.map((c) => (
              <div key={c.voluntarioId} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="min-w-0">
                  <p className="font-bold text-slate-800">{c.voluntario?.nome || 'Voluntário'}</p>
                  <p className="text-xs text-slate-500 break-all">{c.voluntario?.email}</p>
                  {c.voluntario?.telefone && <p className="text-xs text-slate-500">{c.voluntario.telefone}</p>}
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  {c.statusInscricao === 'Pendente' ? (
                    <>
                      <button onClick={() => alterarStatus(c.voluntarioId, 'Recusado')} className="text-sm font-bold text-red-700 bg-red-100 hover:bg-red-200 px-4 py-2 rounded-xl transition-colors">Recusar</button>
                      <button onClick={() => alterarStatus(c.voluntarioId, 'Aprovado')} className="text-sm font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-4 py-2 rounded-xl transition-colors">Aprovar</button>
                    </>
                  ) : c.statusInscricao === 'Aprovado' ? (
                    <span className="text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-6 py-2 rounded-xl w-full text-center">✓ Aprovado</span>
                  ) : (
                    <span className="text-sm font-bold text-red-700 bg-red-50 border border-red-200 px-6 py-2 rounded-xl w-full text-center">✕ Recusado</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        <button onClick={onFechar} className="w-full bg-slate-900 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg">Fechar Painel</button>
      </div>
    </div>
  );
}
