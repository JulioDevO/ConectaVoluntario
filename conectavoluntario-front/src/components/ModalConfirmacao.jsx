export default function ModalConfirmacao({ titulo, descricao, textoConfirmar, onConfirmar, onCancelar, carregando }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
        <h3 className="text-xl font-bold text-slate-900 mb-2">{titulo}</h3>
        <p className="text-slate-500 text-sm mb-8">{descricao}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onCancelar} disabled={carregando} className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl">
            Cancelar
          </button>
          <button onClick={onConfirmar} disabled={carregando} className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl disabled:opacity-60">
            {carregando ? 'Aguarde...' : textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
