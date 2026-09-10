# 🤝 Conecta Voluntário - Backend

Backend desenvolvido para a aplicação **Conecta Voluntário**, integrando uma arquitetura híbrida robusta com rotas **RESTful** tradicionais e uma API **GraphQL** moderna, utilizando **Node.js**, **Express** e **MongoDB (Mongoose)**.

---

## 🛠️ Tecnologias Utilizadas

* **Node.js** & **Express**: Ambiente de execução e framework para o servidor web.
* **MongoDB & Mongoose**: Banco de dados NoSQL e modelagem de dados orientada a objetos.
* **Apollo Server / Express**: Implementação de API GraphQL integrada ao ecossistema Express.
* **CORS**: Gerenciamento de compartilhamento de recursos de origem cruzada.
* **Dotenv**: Gerenciamento de variáveis de ambiente sensíveis.

---

## 📂 Estrutura do Projeto

```text
conectavoluntario-back/
│
├── src/
│   ├── config/
│   │   └── db.js            # Conexão centralizada com o MongoDB
│   ├── controllers/         # Lógica de negócio das rotas REST
│   ├── graphql/
│   │   ├── resolvers.js     # Cozinheiro: Funções que buscam os dados do GraphQL
│   │   └── typeDefs.js      # Cardápio: Definição dos tipos e esquemas GraphQL
│   ├── models/              # Schemas do Mongoose (Ong, Voluntário, Vaga)
│   ├── routes/              # Endpoints REST (RESTful APIs)
│   └── index.js             # Ponto de entrada e junção do Express com Apollo
│
├── .env                     # Variáveis de ambiente (Excluído do Git)
├── .gitignore               # Arquivos ignorados pelo controle de versão
├── package.json             # Dependências e scripts do projeto
└── README.md