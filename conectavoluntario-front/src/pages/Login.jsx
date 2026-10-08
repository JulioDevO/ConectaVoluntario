import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { salvarSessao, limparSessao } from '../auth';

const API_URL = 'http://localhost:3000';

export default function Login() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [status, setStatus] = useState({ mensagem: '', tipo: '' });

  // Envia e-mail e senha para uma rota de login do back-end.
  // A senha é conferida no servidor (bcrypt), nunca no navegador.
  const tentarLogin = async (url) => {
    const resposta = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });
    const dados = await resposta.json().catch(() => ({}));
    return { ok: resposta.ok, status: resposta.status, dados };
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus({ mensagem: 'A verificar credenciais...', tipo: 'loading' });
    limparSessao();

    try {
      // 1. Tenta autenticar como ONG
      let resultado = await tentarLogin(`${API_URL}/api/ongs/login`);
      let sessao = null;

      if (resultado.ok) {
        sessao = {
          token: resultado.dados.token,
          role: 'ONG',
          userName: resultado.dados.ong?.nomeFantasia || 'Instituição Parceira',
          userId: resultado.dados.ong?.id
        };
      } else if (resultado.status === 401) {
        // 2. Não é ONG (ou a senha não confere): tenta como voluntário
        resultado = await tentarLogin(`${API_URL}/api/voluntarios/login`);

        if (resultado.ok) {
          sessao = {
            token: resultado.dados.token,
            role: 'VOLUNTARIO',
            userName: resultado.dados.voluntario?.nome || 'Voluntário',
            userId: resultado.dados.voluntario?.id
          };
        }
      }

      // 3. Resultado final
      if (sessao && sessao.token) {
        salvarSessao(sessao);
        setSenha('');
        setStatus({ mensagem: 'Login efetuado com sucesso!', tipo: 'sucesso' });
        setTimeout(() => navigate('/vagas', { replace: true }), 1500);
      } else if (resultado.status === 401) {
        setStatus({ mensagem: 'E-mail ou senha incorretos.', tipo: 'erro' });
      } else {
        setStatus({ mensagem: 'Não foi possível fazer login. Tente novamente.', tipo: 'erro' });
      }
    } catch (erro) {
      console.error('Falha de comunicação com o servidor:', erro);
      setStatus({ mensagem: 'Erro de ligação com o servidor.', tipo: 'erro' });
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-400/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-400/10 blur-[120px] pointer-events-none"></div>

      <div className="absolute top-6 left-6 md:top-8 md:left-10 z-50">
        <Link to="/" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors bg-white/60 backdrop-blur-md px-5 py-2.5 rounded-full border border-slate-200/50 shadow-sm">
          <span>&larr;</span> Voltar para o início
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 mt-10 sm:mt-0">
        <Link to="/" className="text-2xl font-bold text-slate-900 tracking-tight">ConectaVoluntário<span className="text-blue-600">.</span></Link>
        <h2 className="mt-6 text-3xl font-extrabold text-slate-900 tracking-tight">Faça o seu login</h2>
        <p className="mt-2 text-sm text-slate-600 mb-6">Entre para gerir vagas ou candidatar-se.</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-xl py-8 px-6 shadow-xl shadow-slate-200/50 sm:rounded-[32px] sm:px-10 border border-white">
          
          {status.mensagem && (
            <div className={`p-4 mb-6 rounded-2xl text-sm font-bold text-center ${status.tipo === 'erro' ? 'bg-red-50 text-red-600 border border-red-100' : status.tipo === 'sucesso' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-blue-600 animate-pulse'}`}>
              {status.mensagem}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="appearance-none block w-full px-4 py-3 bg-white/50 border border-slate-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                placeholder="voce@exemplo.com" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
              <input 
                type="password" 
                value={senha} 
                onChange={(e) => setSenha(e.target.value)} 
                required 
                className="appearance-none block w-full px-4 py-3 bg-white/50 border border-slate-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                placeholder="••••••••" 
              />
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-full shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 shadow-blue-200 transition-all hover:-translate-y-0.5"
              >
                Entrar na Conta
              </button>
            </div>
          </form>
          
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200/60" /></div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-slate-500">Ainda não tem conta? <Link to="/cadastro-voluntario" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">Cadastre-se</Link></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}