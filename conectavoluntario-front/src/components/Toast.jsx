const ESTILOS = {
  sucesso: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  aviso: 'bg-amber-50 text-amber-700 border-amber-200',
  erro: 'bg-red-50 text-red-700 border-red-200',
};

const ICONES = { sucesso: '✓', aviso: 'ℹ', erro: '⚠' };

export default function Toast({ toast }) {
  if (!toast.visivel) return null;

  return (
    <div
      role="status"
      className={`fixed bottom-6 right-6 left-6 sm:left-auto z-50 px-6 py-4 rounded-2xl shadow-xl border font-bold flex items-center gap-3 ${ESTILOS[toast.tipo] || ESTILOS.erro}`}
    >
      {ICONES[toast.tipo] || ICONES.erro} {toast.mensagem}
    </div>
  );
}
