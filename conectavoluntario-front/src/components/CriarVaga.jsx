import { useState } from 'react';

export default function CriarVaga({ onClose, onVagaCriada }) {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    localizacao: '',
    formato: 'Presencial',
    horario: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ongIdLogada = localStorage.getItem('userId') || localStorage.getItem('id') || '64f1234567890abcdef12345';

    try {
      const response = await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          query: `
            mutation CriarVaga($titulo: String!, $descricao: String!, $localizacao: String!, $formato: String!, $horario: String!, $status: String!, $ongId: ID!) {
              criarVaga(titulo: $titulo, descricao: $descricao, localizacao: $localizacao, formato: $formato, horario: $horario, status: $status, ongId: $ongId) {
                _id
              }
            }
          `,
          variables: {
            titulo: formData.titulo,
            descricao: formData.descricao,
            localizacao: formData.localizacao,
            formato: formData.formato,
            horario: formData.horario,
            status: "Aberta", // Alterado de "Ativa" para "Aberta"
            ongId: ongIdLogada
          }
        })
      });

      const result = await response.json();

      if (result.errors) {
        alert("Erro ao criar vaga: " + result.errors[0].message);
      } else {
        onVagaCriada();
        onClose();
      }
    } catch (error) {
      alert("Erro de comunicação com o servidor.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Nova Vaga</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="titulo"
            placeholder="Título da vaga"
            value={formData.titulo}
            onChange={handleChange}
            className="border border-slate-300 p-2 rounded"
            required
          />
          <textarea
            name="descricao"
            placeholder="Descrição"
            value={formData.descricao}
            onChange={handleChange}
            className="border border-slate-300 p-2 rounded"
            required
          />
          <input
            type="text"
            name="localizacao"
            placeholder="Localização"
            value={formData.localizacao}
            onChange={handleChange}
            className="border border-slate-300 p-2 rounded"
            required
          />
          <input
            type="text"
            name="horario"
            placeholder="Horário (ex: Sábados 09h às 11h)"
            value={formData.horario}
            onChange={handleChange}
            className="border border-slate-300 p-2 rounded"
            required
          />
          <select
            name="formato"
            value={formData.formato}
            onChange={handleChange}
            className="border border-slate-300 p-2 rounded"
          >
            <option value="Presencial">Presencial</option>
            <option value="Remoto">Remoto</option>
          </select>
          <div className="flex gap-4 mt-4">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded flex-1 hover:bg-blue-700">
              Salvar
            </button>
            <button type="button" onClick={onClose} className="bg-slate-200 px-4 py-2 rounded flex-1 hover:bg-slate-300">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}