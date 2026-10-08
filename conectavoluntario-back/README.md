# ConectaVoluntario - Backend 

Backend desenvolvido em **Node.js**, **Express**, **Apollo Server (GraphQL)** e **Mongoose (MongoDB)** para a aplicação *ConectaVoluntario*.

---

## Pré-requisitos

Certifique-se de ter instalado em sua máquina:
* [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
* [Git](https://git-scm.com/)
* Uma conta ou instância do **MongoDB** (Atlas ou local)

---

## Como Instalar e Executar

1. Abra o terminal na pasta do backend (`conectavoluntario-back`).
2. Instale as dependências do projeto:
   npm install

3. Crie um arquivo .env na raiz da pasta do backend e configure a sua conexão com o banco de dados e a porta:
    PORT=4000
    MONGO_URI=sua_string_de_conexao_do_mongodb_aqui

4. Inicie o servidor em modo de desenvolvimento:
    npm start

# Como Testar as Rotas e Mutações (GraphQL)

Como o projeto utiliza GraphQL, todas as operações (Consultas e Mutações) são feitas através de um único endpoint (geralmente http://localhost:4000/graphql) ou pelo Apollo Sandbox / GraphQL Playground integrado.

1. Gestão de Voluntários
Cadastrar Voluntário (criarVoluntario)

mutation {
  criarVoluntario(
    nome: "Maria Silva"
    email: "maria@email.com"
    senha: "123"
    telefone: "83999999999"
  ) {
    id
    nome
    email
  }
}

Remover Voluntário (removerVoluntario)

mutation {
  removerVoluntario(id: "ID_DO_VOLUNTARIO_AQUI") {
    id
    nome
  }
}

2. Gestão de ONGs

Cadastrar ONG (criarOng)

mutation {
  criarOng(
    nome: "ONG Esperança"
    nomeFantasia: "Esperança Viva"
    email: "contato@esperanca.com"
    cidade: "Campina Grande"
    senha: "123"
    cnpj: "00.000.000/0001-00"
  ) {
    id
    nome
    nomeFantasia
  }
}

Remover ONG (removerOng)

GraphQL
mutation {
  removerOng(id: "ID_DA_ONG_AQUI") {
    id
    nome
  }
}

3. Gestão de Vagas

Criar Vaga (criarVaga)

mutation {
  criarVaga(
    titulo: "Apoio Escolar"
    descricao: "Dar aulas de reforço de matemática."
    ong: "ID_DA_ONG_AQUI"
    cidade: "Campina Grande"
    status: "Aberta"
  ) {
    id
    titulo
    status
  }
}

Atualizar Vaga (atualizarVaga)

mutation {
  atualizarVaga(
    id: "ID_DA_VAGA_AQUI"
    titulo: "Apoio Escolar e Leitura"
    status: "Aberta"
  ) {
    id
    titulo
    status
  }
}

Remover Vaga (removerVaga)

mutation {
  removerVaga(id: "ID_DA_VAGA_AQUI") {
    id
    titulo
  }
}

# Tecnologias Utilizadas
- Node.js & Express.js
- GraphQL (Apollo Server)
- Mongoose (ODM para MongoDB)
- Cors & Dotenv