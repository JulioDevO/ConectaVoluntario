// Sessão do usuário no front-end.
// A sessão só existe depois de um login validado pelo back-end (token JWT).
// Atenção: isto serve para ajustar a interface. Quem de fato barra acessos indevidos é o back-end.

const CHAVES = ['token', 'role', 'userName', 'userId'];

export function salvarSessao({ token, role, userName, userId }) {
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
  localStorage.setItem('userName', userName);
  localStorage.setItem('userId', userId);
}

export function limparSessao() {
  CHAVES.forEach((chave) => localStorage.removeItem(chave));
}

// Lê a data de expiração (exp) de dentro do token JWT.
function tokenExpirado(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return !payload.exp || payload.exp * 1000 <= Date.now();
  } catch {
    return true; // token malformado conta como inválido
  }
}

export function estaAutenticado() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  return Boolean(token && role && !tokenExpirado(token));
}

// Token da sessão atual (ou null se não há sessão válida).
export function getToken() {
  return estaAutenticado() ? localStorage.getItem('token') : null;
}

// Dados da sessão atual. role: 'ONG' | 'VOLUNTARIO' | 'VISITANTE'
export function getSessao() {
  if (!estaAutenticado()) {
    return { role: 'VISITANTE', userName: 'Visitante', userId: null };
  }
  return {
    role: (localStorage.getItem('role') || 'VISITANTE').toUpperCase(),
    userName: localStorage.getItem('userName') || '',
    userId: localStorage.getItem('userId'),
  };
}
