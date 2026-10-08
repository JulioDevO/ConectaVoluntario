# 🤝 Conecta Voluntário

O **Conecta Voluntário** é uma plataforma web desenvolvida para facilitar o encontro entre pessoas dispostas a ajudar e instituições (ONGs) que precisam de força de trabalho voluntária. O sistema suporta diferentes perfis de acesso, gestão de vagas e candidaturas a projetos sociais.

## 🚀 Tecnologias Utilizadas

- **Front-end:** React, Vite, Tailwind CSS
- **Back-end:** Node.js, Express, Apollo Server
- **API:** REST **e** GraphQL (os dois expõem as mesmas regras de negócio)
- **Banco de Dados:** MongoDB (com Mongoose)
- **Segurança:** JWT (autenticação), bcrypt (senhas), controle de permissões por perfil, rate limit no login e helmet

---

## 🔐 Autenticação e Autorização

O login (`POST /api/auth/login` ou a mutation `login`) devolve um **token JWT** válido por 1 dia. Ele deve ser enviado no header `Authorization: Bearer <token>`.

| Ação | Visitante | Voluntário | ONG |
|---|:-:|:-:|:-:|
| Cadastrar-se, fazer login, ver vagas e ONGs | ✅ | ✅ | ✅ |
| Candidatar-se / cancelar candidatura | ❌ | ✅ | ❌ |
| Criar vaga | ❌ | ❌ | ✅ |
| Editar / excluir / fechar vaga | ❌ | ❌ | ✅ (só as suas) |
| Ver candidatos de uma vaga e aprovar/recusar | ❌ | ❌ | ✅ (só nas suas vagas) |
| Listar voluntários | ❌ | ❌ | ✅ |
| Editar / excluir a própria conta | ❌ | ✅ | ✅ |

O dono de uma vaga é sempre a ONG do **token** (nunca um `ongId` enviado no corpo da requisição).

---

## 🛣️ Principais Endpoints REST

| Método | Rota | Quem acessa |
|---|---|---|
| POST | `/api/auth/login` | público |
| POST | `/api/ongs` · `/api/voluntarios` | público (cadastro) |
| GET | `/api/ongs` · `/api/ongs/:id` | público |
| GET | `/api/vagas` · `/api/vagas/:id` | público |
| POST/PUT/DELETE | `/api/vagas` · `/api/vagas/:id` | ONG dona |
| POST/DELETE | `/api/vagas/:id/candidaturas` | voluntário |
| GET | `/api/vagas/minhas-candidaturas` | voluntário |
| GET | `/api/vagas/:id/candidaturas` | ONG dona |
| PATCH | `/api/vagas/:id/candidaturas/:voluntarioId` | ONG dona |
| GET | `/api/voluntarios` | ONG |
| GET/PUT/DELETE | `/api/voluntarios/:id` · `/api/ongs/:id` | o próprio usuário |

A API **GraphQL** fica em `/graphql` (queries `listarVagas`, `minhasCandidaturas`, `listarCandidatos`...; mutations `criarVaga`, `candidatar`, `atualizarStatusCandidatura`...). O schema completo pode ser explorado na própria página do `/graphql`.

A coleção do **Postman** (`postman/requConecta.postman_collection.json`) cobre todos os endpoints e guarda os tokens automaticamente depois do login.

---

## 💻 Arquitetura e Lógica do Front-end

- **Gestão de perfis (Role-based UI):** a interface identifica se o usuário é `VISITANTE`, `VOLUNTARIO` ou `ONG` (a partir do login validado pelo back-end) e mostra os botões adequados. Isso é só conforto visual: **quem realmente barra acessos indevidos é o back-end**.
- **Tudo persiste no banco:** criar, editar, excluir vagas, candidaturas e aprovações passam pela API GraphQL e ficam salvas no MongoDB.
- **Atualização automática:** a lista de vagas é recarregada a cada 15 segundos e sempre que o usuário volta para a aba, refletindo mudanças feitas por outras pessoas.
- **Componentização e modais:** modais e *toasts* próprios em Tailwind (`Toast`, `ModalConfirmacao`, `VagaFormModal`, `ModalInscritos`), sem `alert()`/`confirm()` nativos. O layout é responsivo (mobile, tablet e desktop).
- **Cliente de API único:** `src/api.js` concentra a URL do back-end e o envio do token.

---

## ⚙️ Como Clonar, Instalar e Executar o Projeto

### Pré-requisitos
[Node.js](https://nodejs.org/) (v18 ou superior) e [Git](https://git-scm.com/).

### Passo 1: Clonar o repositório
```bash
git clone https://github.com/JulioDevO/ConectaVoluntario.git
```

### Passo 2: Variáveis de ambiente do back-end
Dentro de `conectavoluntario-back`, copie o modelo e preencha com os valores enviados junto da entrega:
```bash
cp .env.example .env
```

| Variável | Descrição | Obrigatória |
|---|---|:-:|
| `MONGO_URI` | String de conexão do MongoDB | ✅ |
| `JWT_SECRET` | Chave usada para assinar os tokens JWT | ✅ |
| `PORT` | Porta do servidor (padrão `3000`) | ❌ |
| `CORS_ORIGIN` | Origens liberadas no CORS, separadas por vírgula (vazio = qualquer origem) | ❌ |

> O arquivo `.env` **não** é versionado. Se uma variável obrigatória faltar, o servidor avisa qual é e não inicia.

### Passo 3: Back-end
```bash
cd conectavoluntario-back
npm install
npm run dev      # ou: npm start
```
O servidor sobe em `http://localhost:3000` (REST em `/api/...` e GraphQL em `/graphql`).

### Passo 4: Front-end
```bash
cd conectavoluntario-front
npm install
npm run dev
```
O front abre em `http://localhost:5173` e fala com o back-end em `http://localhost:3000`. Se o back-end estiver em outro endereço, copie `.env.example` para `.env` e ajuste `VITE_API_URL`.
