# 🤝 Conecta Voluntário

O **Conecta Voluntário** é uma plataforma web desenvolvida para facilitar o encontro entre pessoas dispostas a ajudar e instituições (ONGs) que precisam de força de trabalho voluntária. O sistema suporta diferentes perfis de acesso, gestão de vagas em tempo real e candidaturas a projetos sociais.

## 🚀 Tecnologias Utilizadas

- **Front-end:** React, Vite, Tailwind CSS
- **Back-end:** Node.js, Express, Apollo Server
- **API:** GraphQL
- **Banco de Dados:** MongoDB (com Mongoose)

---

## 💻 Arquitetura e Lógica do Front-end

A interface do usuário foi construída com React e Tailwind CSS, focando numa experiência dinâmica, responsiva e segura. Os principais destaques da arquitetura front-end incluem:

* **Gestão de Perfis (Role-based UI):** O sistema identifica se o utilizador é um `VISITANTE`, `VOLUNTÁRIO` ou uma `ONG` (armazenado no `localStorage`). Com base neste perfil, a interface renderiza condicionalmente diferentes botões e permissões. (Ex: ONGs veem opções de exclusão e gestão de inscritos; Voluntários veem opções de candidatura).
* **Sincronismo em Tempo Real (Cross-Tab Sync):** Utilização da API de eventos `storage` (`window.addEventListener('storage')`) para garantir que ações realizadas numa aba reflitam instantaneamente em outras abas abertas. Se uma ONG exclui uma vaga, ela desaparece imediatamente do ecrã do Voluntário sem necessidade de recarregar a página.
* **Componentização e Modais:** Substituição de alertas nativos (`alert()`/`confirm()`) por modais e *Toasts* interativos criados do zero com Tailwind, proporcionando um fluxo de aprovação de candidatos e exclusão de vagas mais elegante e imersivo.
* **Resiliência e Optimistic UI:** O front-end atualiza a interface primeiro (ex: removendo um card ou marcando uma inscrição) e depois comunica com o back-end em segundo plano, garantindo uma resposta instantânea ao clique do utilizador.

---

## ⚙️ Como Clonar, Instalar e Executar o Projeto

### Pré-requisitos
Antes de começar, certifique-se de ter o [Node.js](https://nodejs.org/) e o [Git](https://git-scm.com/) instalados em sua máquina.

### Passo 1: Clonar o Repositório
Abra o terminal e execute o comando abaixo para clonar o projeto:
```bash
git clone https://github.com/JulioDevO/ConectaVoluntario.git

# Acesse a pasta do back-end (ajuste o nome da pasta se necessário)
cd .\conectavoluntario-back\

# Instale as dependências do servidor
npm install

# Inicie o servidor
node .\src\index.js 
# ou 'npm run dev' caso utilize nodemon

# A partir da raiz do projeto, acesse o front-end
cd .\conectavoluntario-front\

# Instale as dependências da interface
npm install

# Inicie o servidor de desenvolvimento do Vite
npm run dev