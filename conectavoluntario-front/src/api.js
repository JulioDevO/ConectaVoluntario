// Cliente único da API. Todas as telas falam com o back-end por aqui.
import { getToken } from './auth';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Erro de API com o código devolvido pelo back-end (ex.: UNAUTHENTICATED, FORBIDDEN).
export class ErroApi extends Error {
  constructor(mensagem, codigo) {
    super(mensagem);
    this.codigo = codigo;
  }
}

async function enviar(url, corpo) {
  const token = getToken();
  let resposta;
  try {
    resposta = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(corpo),
    });
  } catch {
    throw new ErroApi('Não foi possível conectar ao servidor. Verifique se o back-end está rodando.', 'REDE');
  }
  const dados = await resposta.json().catch(() => ({}));
  return { resposta, dados };
}

// Executa uma query/mutation GraphQL e devolve apenas o campo "data".
export async function graphql(query, variables = {}) {
  const { dados } = await enviar(`${API_URL}/graphql`, { query, variables });

  if (dados.errors?.length) {
    const erro = dados.errors[0];
    throw new ErroApi(erro.message, erro.extensions?.code);
  }
  return dados.data;
}

// Login pelo REST: POST /api/auth/login
export async function login(email, senha) {
  const { resposta, dados } = await enviar(`${API_URL}/api/auth/login`, { email, senha });
  if (!resposta.ok) {
    throw new ErroApi(dados.erro || 'Não foi possível fazer login.', resposta.status === 401 ? 'UNAUTHENTICATED' : 'ERRO');
  }
  return dados;
}
