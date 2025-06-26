# Sistema de Gestão de Eventos Acadêmicos

Sistema web para gestão de eventos acadêmicos com diferentes níveis de acesso.

## Stack Tecnológica
- **Frontend**: React.js com TypeScript
- **Backend**: Spring Boot (Java 17)
- **Banco de Dados**: MySQL 8.0

## Instalação

### Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Funcionalidades
- Login e cadastro de usuários
- Calendário de eventos
- Gestão de atividades acadêmicas
- Controle de acesso por tipo de usuário

## Pré-requisitos

- Node.js 18+
- Java JDK 17+
- MySQL 8.0+
- Maven 3.6+

## Instalação e Configuração

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd projeto_poo
```

### 2. Configuração do Banco de Dados
```bash
# Acesse o MySQL
sudo mysql -u root

# Crie o banco de dados
CREATE DATABASE eventos_academicos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Configuração do Backend
```bash
cd backend

# Compile o projeto
mvn clean install

# Execute o projeto
mvn spring-boot:run
```

O backend estará disponível em: http://localhost:8080/api

### 4. Configuração do Frontend
```bash
cd frontend

# Instale as dependências
npm install

# Execute o projeto
npm start
```

O frontend estará disponível em: http://localhost:3000

## Estrutura do Projeto

```
projeto_poo/
├── backend/                 # Projeto Spring Boot
│   ├── src/main/java/
│   │   └── com/eventosacademicos/
│   └── src/main/resources/
├── frontend/               # Projeto React
│   ├── src/
│   ├── public/
│   └── package.json
├── planning.md            # Requisitos funcionais
├── execution_planning.md  # Plano de execução
└── README.md
```

## Funcionalidades

### RF001 - Tela de Login
- Autenticação com username e senha
- Validação de credenciais
- Redirecionamento baseado no tipo de usuário

### RF002 - Tela de Cadastro
- Cadastro de usuários com aprovação pendente
- Campos: username, email, telefone, senha, matrícula, tipo
- Aprovação por administradores

### RF003 - Tela de Calendário
- Visualização mensal de eventos
- Filtros por tipo de usuário
- Miniaturas de membros dos eventos

### RF004 - Card de Atividade
- Exibição completa de informações do evento
- Ações conforme permissões do usuário

### RF005 - Modal de Criação
- Criação de eventos por tipo de usuário
- Professores: provas e trabalhos
- Alunos: eventos de festa
- Administradores: todos os tipos

## Tipos de Usuário

- **Alunos**: Podem ver eventos incluídos e criar eventos de festa
- **Professores**: Podem ver eventos da turma e criar provas/trabalhos
- **Administradores**: Podem ver todos os eventos e gerenciar tudo

## Desenvolvimento

### Backend
- API REST com Spring Boot
- Autenticação JWT
- Validação de dados
- Controle de acesso baseado em roles

### Frontend
- Interface React com TypeScript
- Roteamento com React Router
- Estilização com Styled Components
- Comunicação com API via Axios

## Testes

### Backend
```bash
cd backend
mvn test
```

### Frontend
```bash
cd frontend
npm test
```

## Deploy

### Backend
```bash
cd backend
mvn clean package
java -jar target/eventos-academicos-backend-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd frontend
npm run build
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. 