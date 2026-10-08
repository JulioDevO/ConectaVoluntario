import { useState } from 'react';

const CLASSE_CAMPO = 'w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500';

// Modal único para criar (vaga = null) e editar (vaga = objeto) uma vaga.
export default function VagaFormModal({ vaga, salvando, onSalvar, onCancelar, onExcluir }) {
  const editando = Boolean(vaga);
  const [dados, setDados] = useState({
    titulo: vaga?.titulo || '',
    descricao: vaga?.descricao || '',
    formato: vaga?.formato || 'Presencial',
    localizacao: vaga?.localizacao || '',
    horario: vaga?.horario || '',
    status: vaga?.status || 'Aberta',
  });

  const alterar = (campo) => (e) => setDados({ ...dados, [campo]: e.target.value });

  const enviar = (e) => {
    e.preventDefault();
    // Na criação o status é definido pelo back-end (nasce "Aberta")
    const { titulo, descricao, formato, localizacao, horario } = dados;
    onSalvar(editando ? dados : { titulo, descricao, formato, localizacao, horario });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-[32px] p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 my-auto">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">{editando ? 'Gerir Vaga' : 'Nova Oportunidade'}</h3>
        <p className="text-slate-500 text-sm mb-6">
          {editando ? 'Atualize os dados ou remova a oportunidade.' : 'Preencha os dados da nova vaga de voluntariado.'}
        </p>

        <form onSubmit={enviar} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Título da Vaga</label>
            <input required maxLength={120} type="text" value={dados.titulo} onChange={alterar('titulo')} className={CLASSE_CAMPO} placeholder="Ex: Professor de Inglês" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Formato</label>
              <select value={dados.formato} onChange={alterar('formato')} className={CLASSE_CAMPO}>
                <option value="Presencial">Presencial</option>
                <option value="Remoto">Remoto</option>
                <option value="Híbrido">Híbrido</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Localização</label>
              <input required maxLength={120} type="text" value={dados.localizacao} onChange={alterar('localizacao')} className={CLASSE_CAMPO} placeholder="Ex: Centro" />
            </div>
          </div>

          <div className={`grid grid-cols-1 gap-4 ${editando ? 'sm:grid-cols-2' : ''}`}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Horário</label>
              <input required maxLength={120} type="text" value={dados.horario} onChange={alterar('horario')} className={CLASSE_CAMPO} placeholder="Ex: Sábados, das 14h às 16h" />
            </div>
            {editando && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Situação</label>
                <select value={dados.status} onChange={alterar('status')} className={CLASSE_CAMPO}>
                  <option value="Aberta">Aberta (recebe inscrições)</option>
                  <option value="Fechada">Fechada</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
            <textarea required maxLength={2000} value={dados.descricao} onChange={alterar('descricao')} rows="3" className={`${CLASSE_CAMPO} resize-none`} placeholder="Descreva as atividades..."></textarea>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-4 border-t border-slate-100">
            {editando ? (
              <button type="button" onClick={onExcluir} disabled={salvando} className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-bold py-3 px-6 rounded-xl transition-colors">
                Excluir
              </button>
            ) : <span />}
            <div className="flex gap-3">
              <button type="button" onClick={onCancelar} disabled={salvando} className="flex-1 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold py-3 px-6 rounded-xl transition-colors">
                Cancelar
              </button>
              <button type="submit" disabled={salvando} className="flex-1 bg-blue-600 text-white hover:bg-blue-700 font-bold py-3 px-6 rounded-xl shadow-md transition-colors disabled:opacity-60">
                {salvando ? 'Salvando...' : editando ? 'Salvar' : 'Publicar Vaga'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
