const ESTILO_STATUS = {
  Pendente: 'bg-amber-50 text-amber-700 border-amber-200',
  Aprovado: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Recusado: 'bg-red-50 text-red-700 border-red-200',
};

export default function VagaCard({ vaga, perfil, ehDonaDaVaga, ocupado, onEditar, onInscritos, onCandidatar, onCancelar, onLogin }) {
  const inscricao = vaga.minhaCandidatura;
  const fechada = vaga.status === 'Fechada';

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col">
      <div className="flex justify-between items-start mb-6 gap-2">
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${vaga.formato === 'Remoto' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'}`}>
          {vaga.localizacao || 'Local não definido'}
        </span>
        <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{vaga.formato || 'Geral'}</span>
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-1 leading-tight">{vaga.titulo}</h2>
      {vaga.ong?.nomeFantasia && <p className="text-sm text-slate-500 mb-2">{vaga.ong.nomeFantasia}</p>}
      <p className="text-blue-600 font-semibold mb-4 text-sm">Horário: {vaga.horario || 'A combinar'}</p>
      <p className="text-slate-600 mb-6 flex-grow leading-relaxed">{vaga.descricao}</p>

      <div className="flex items-center gap-2 mb-4 text-xs font-semibold">
        {fechada && <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-600">Vaga fechada</span>}
        <span className="text-slate-400">{vaga.totalCandidatos} inscrito(s)</span>
      </div>

      {perfil === 'ONG' ? (
        ehDonaDaVaga ? (
          <div className="flex gap-3">
            <button onClick={() => onEditar(vaga)} className="flex-1 bg-white text-slate-700 font-bold py-3 px-4 rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-colors">Editar</button>
            <button onClick={() => onInscritos(vaga)} className="flex-1 bg-slate-900 text-white font-bold py-3 px-4 rounded-xl hover:bg-slate-800 transition-colors">Inscritos</button>
          </div>
        ) : (
          <p className="text-center text-xs text-slate-400 font-semibold py-3">Vaga de outra instituição</p>
        )
      ) : perfil === 'VISITANTE' ? (
        <button onClick={onLogin} className="w-full bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold py-3 px-4 rounded-xl transition-colors">
          Faça login para participar
        </button>
      ) : inscricao ? (
        <div className="space-y-3">
          <span className={`block text-center text-sm font-bold border px-4 py-2 rounded-xl ${ESTILO_STATUS[inscricao.statusInscricao] || ESTILO_STATUS.Pendente}`}>
            Inscrição: {inscricao.statusInscricao}
          </span>
          <button
            onClick={() => onCancelar(vaga._id)}
            disabled={ocupado}
            className="w-full font-bold py-3 px-4 rounded-xl transition-colors border-2 bg-red-50 text-red-600 border-red-100 hover:bg-red-100 hover:border-red-200 disabled:opacity-60"
          >
            Cancelar Inscrição
          </button>
        </div>
      ) : (
        <button
          onClick={() => onCandidatar(vaga._id)}
          disabled={ocupado || fechada}
          className="w-full font-bold py-3 px-4 rounded-xl transition-colors border-2 bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {fechada ? 'Inscrições encerradas' : 'Candidatar-se'}
        </button>
      )}
    </div>
  );
}
