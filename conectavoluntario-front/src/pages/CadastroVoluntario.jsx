import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { limparSessao } from '../auth';
import { graphql } from '../api';

export default function CadastroVoluntario() {
  const navigate = useNavigate();
  
  const [tipoUsuario, setTipoUsuario] = useState('voluntario');
  const [interessesSelecionados, setInteressesSelecionados] = useState([]);
  const [status, setStatus] = useState({ mensagem: '', tipo: '' });
  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [cidade, setCidade] = useState('');
  const [descricao, setDescricao] = useState('');

  const causasDisponiveis = ['Educação', 'Meio Ambiente', 'Causa Animal', 'Saúde e Bem-estar', 'Inclusão Social', 'Combate à Fome'];

  const toggleInteresse = (causa) => {
    if (interessesSelecionados.includes(causa)) {
      setInteressesSelecionados(interessesSelecionados.filter(item => item !== causa));
    } else {
      setInteressesSelecionados([...interessesSelecionados, causa]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ mensagem: 'A processar cadastro...', tipo: 'loading' });

    try {
      if (tipoUsuario === 'voluntario') {
        await graphql(
          `mutation CriarVoluntario($input: VoluntarioInput!) {
            criarVoluntario(input: $input) { _id nome }
          }`,
          { input: { nome, email, senha, telefone, causas: interessesSelecionados } }
        );
      } else {
        await graphql(
          `mutation CriarOng($input: OngInput!) {
            criarOng(input: $input) { _id nomeFantasia }
          }`,
          { input: { nomeFantasia, razaoSocial, cnpj, email, senha, cidade, descricao } }
        );
      }

      setStatus({ mensagem: 'Cadastro realizado com sucesso! Faça login para entrar.', tipo: 'sucesso' });

      // Cadastro NÃO autentica: nenhuma sessão é criada aqui.
      // Limpa qualquer sessão anterior e envia o usuário para a tela de login.
      limparSessao();
      setSenha('');
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch (erro) {
      setStatus({ mensagem: erro.message, tipo: 'erro' });
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
        <h2 className="mt-6 text-3xl font-extrabold text-slate-900 tracking-tight">Crie sua conta</h2>
        <p className="mt-2 text-sm text-slate-600 mb-6">Junte-se a nós para transformar realidades.</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        <div className="bg-white/80 backdrop-blur-xl py-8 px-6 shadow-xl shadow-slate-200/50 sm:rounded-[32px] sm:px-10 border border-white">
          
          {status.mensagem && (
            <div className={`p-4 mb-6 rounded-2xl text-sm font-bold text-center ${status.tipo === 'erro' ? 'bg-red-50 text-red-600 border border-red-100' : status.tipo === 'sucesso' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-blue-600 animate-pulse'}`}>
              {status.mensagem}
            </div>
          )}

          <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
            <button 
              type="button"
              onClick={() => { setTipoUsuario('voluntario'); setStatus({mensagem: '', tipo: ''}); }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${tipoUsuario === 'voluntario' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Sou Voluntário
            </button>
            <button 
              type="button"
              onClick={() => { setTipoUsuario('ong'); setStatus({mensagem: '', tipo: ''}); }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${tipoUsuario === 'ong' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Represento uma ONG
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {tipoUsuario === 'voluntario' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nome completo</label>
                    <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required className="appearance-none block w-full px-4 py-3 bg-white/50 border border-slate-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Ex: Júlio César" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
                    <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} required className="appearance-none block w-full px-4 py-3 bg-white/50 border border-slate-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="(00) 00000-0000" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Áreas de interesse</label>
                  <div className="flex flex-wrap gap-2">
                    {causasDisponiveis.map((causa) => (
                      <button key={causa} type="button" onClick={() => toggleInteresse(causa)} className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${interessesSelecionados.includes(causa) ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white/60 text-slate-600 border-slate-200 hover:border-blue-400'}`}>
                        {causa}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Razão Social</label>
                    <input type="text" value={razaoSocial} onChange={(e) => setRazaoSocial(e.target.value)} required className="appearance-none block w-full px-4 py-3 bg-white/50 border border-slate-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" placeholder="Razão Social" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nome Fantasia</label>
                    <input type="text" value={nomeFantasia} onChange={(e) => setNomeFantasia(e.target.value)} required className="appearance-none block w-full px-4 py-3 bg-white/50 border border-slate-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" placeholder="Nome Fantasia" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">CNPJ</label>
                    <input type="text" value={cnpj} onChange={(e) => setCnpj(e.target.value)} required className="appearance-none block w-full px-4 py-3 bg-white/50 border border-slate-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" placeholder="00.000.000/0000-00" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Cidade</label>
                    <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} required className="appearance-none block w-full px-4 py-3 bg-white/50 border border-slate-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" placeholder="Ex: Campina Grande" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Breve Descrição</label>
                  <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows="2" className="appearance-none block w-full px-4 py-3 bg-white/50 border border-slate-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none" placeholder="Qual a missão da sua instituição?"></textarea>
                </div>
              </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="appearance-none block w-full px-4 py-3 bg-white/50 border border-slate-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all" placeholder="voce@exemplo.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
                <input type="password" minLength={6} value={senha} onChange={(e) => setSenha(e.target.value)} required className="appearance-none block w-full px-4 py-3 bg-white/50 border border-slate-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all" placeholder="••••••••" />
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-full shadow-md text-sm font-bold text-white transition-all hover:-translate-y-0.5 ${tipoUsuario === 'voluntario' ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 shadow-blue-200' : 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 shadow-emerald-200'}`}>
                {tipoUsuario === 'voluntario' ? 'Concluir Cadastro de Voluntário' : 'Cadastrar Instituição'}
              </button>
            </div>
          </form>
          
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200/60" /></div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-slate-500">Já tem uma conta? <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">Faça login</Link></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}