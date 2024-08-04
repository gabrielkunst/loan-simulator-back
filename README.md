# Simulador de Empréstimo API

Este projeto é a API backend para o Simulador de Empréstimo. Foi criado com Fastify, testado com Vitest e Supertest, e documentado com Swagger. Utiliza PostgreSQL para o banco de dados, configurado e executado via Docker.

## Funcionalidades

- **API de Empréstimos:** Simule e crie empréstimos.
- **Documentação:** A documentação da API está disponível via Swagger.
- **Banco de Dados:** Utiliza PostgreSQL para armazenamento de dados.

## Estrutura do Projeto

- `src/`: Diretório principal do código fonte.
  - `types/`: Tipos e interfaces TypeScript.
  - `http/`: Configurações do servidor HTTP.
    - `routes/`: Rotas da API.
  - `repositories/`: Acesso ao banco de dados.
  - `use-cases/`: Regras de negócio da aplicação.
  - `utils/`: Utilitários e funções auxiliares.
- `tests/`: Testes automatizados usando Supertest.

## Swagger

A documentação da API está disponível em `/docs`.

## Como Baixar e Configurar

1. **Clone o Repositório:**

Clone o repositório do backend:

```bash
  git clone https://github.com/gabrielkunst/loan-simulator-back.git
```

2. **Instale as Dependências:**

Navegue para o diretório do projeto e instale as dependências:

```bash
  cd loan-simulator-back
  npm install
```

3. **Configure o Banco de Dados:**

O banco de dados PostgreSQL é executado via Docker. Certifique-se de ter o Docker e o Docker Compose instalados. Execute o Docker Compose para iniciar o banco de dados:

```bash
  docker-compose up -d
```

4. **Configure as Variáveis de Ambiente:**

Crie um arquivo `.env` na raiz do projeto seguindo o modelo do arquivo `.env.example`. Preencha as variáveis de ambiente com as informações do banco de dados.

5. **Execute as Migrações:**

Execute as migrações para criar as tabelas no banco de dados:

```bash
  npx prisma generate
  npx prisma migrate dev
```

6. **Inicie o Servidor:**

Inicie o servidor:

```bash
  npm run dev
```
