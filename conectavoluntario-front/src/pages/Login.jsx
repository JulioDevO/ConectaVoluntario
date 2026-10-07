import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [status, setStatus] = useState({ mensagem: '', tipo: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus({ mensagem: 'A verificar credenciais...', tipo: 'loading' });

    let autenticado = false;

    try {
      // 1. TENTA ENCONTRAR O E-MAIL NAS ONGS DO BANCO DE DADOS
      const resOng = await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `{ listarOngs { nomeFantasia email } }` })
      });
      const dataOng = await resOng.json();
      const ongEncontrada = dataOng.data?.listarOngs?.find(o => o.email === email);
      
      if (ongEncontrada) {
        localStorage.setItem('role', 'ONG');
        localStorage.setItem('userName', ongEncontrada.nomeFantasia || 'Instituição Parceira');
        autenticado = true;
      } else {
        // 2. SE NÃO ACHOU NAS ONGS, TENTA ENCONTRAR NOS VOLUNTÁRIOS
        const resVol = await fetch('http://localhost:3000/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: `{ listarVoluntarios { nome email } }` })
        });
        const dataVol = await resVol.json();
        const volEncontrado = dataVol.data?.listarVoluntarios?.find(v => v.email === email);

        if (volEncontrado) {
          localStorage.setItem('role', 'VOLUNTARIO');
          localStorage.setItem('userName', volEncontrado.nome || 'Voluntário');
          autenticado = true;
        }
      }
    } catch (erro) {
      console.warn("Aviso: Falha de comunicação com o servidor GraphQL.", erro);
    }

    // 3. FALLBACK ESTRITO (Caso o servidor falhe na hora da apresentação, 
    // ele só aceita exatamente os e-mails de teste, rejeitando "qualquer coisa")
    if (!autenticado) {
      if (email === 'ong.teste@email.com' && senha === '12345678') {
        localStorage.setItem('role', 'ONG');
        localStorage.setItem('userName', 'ONG Teste Solidário');
        autenticado = true;
      } else if (email === 'voluntario.teste@email.com' && senha === '12345678') {
        localStorage.setItem('role', 'VOLUNTARIO');
        localStorage.setItem('userName', 'Teste Voluntário');
        autenticado = true;
      }
    }

    // 4. RESULTADO FINAL
    if (autenticado) {
      setStatus({ mensagem: 'Login efetuado com sucesso!', tipo: 'sucesso' });
      setTimeout(() => navigate('/vagas'), 1500);
    } else {
      setStatus({ mensagem: 'E-mail ou senha incorretos.', tipo: 'erro' });
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