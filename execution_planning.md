# Plano de Execução - Sistema de Gestão de Eventos Acadêmicos

## Visão Geral do Projeto

Sistema web para gestão de eventos acadêmicos com diferentes níveis de acesso (Alunos, Professores e Administradores), incluindo calendário de atividades, criação e gestão de eventos.

### Stack Tecnológica
- **Frontend**: React.js
- **Backend**: Spring Boot (Java)
- **Banco de Dados**: MySQL

## Fase 1: Configuração e Estrutura Base ✅ CONCLUÍDA

### 1.1 Configuração do Ambiente de Desenvolvimento
- [x] Instalar Node.js e npm
- [x] Instalar Java JDK 17+
- [x] Instalar MySQL 8.0+
- [x] Instalar IDE (VS Code recomendado)
- [x] Configurar Git e repositório

**Checkpoint 1.1**: ✅ CONCLUÍDO
- [x] Verificar versões instaladas: `node --version`, `java --version`, `mysql --version`
- [x] Teste: Criar repositório Git e fazer primeiro commit

### 1.2 Estrutura do Projeto
- [x] Criar estrutura de pastas do projeto
- [x] Configurar projeto Spring Boot
- [x] Configurar projeto React
- [x] Configurar banco de dados MySQL

**Checkpoint 1.2**: ✅ CONCLUÍDO
- [x] Teste: Spring Boot inicia sem erros
- [x] Teste: React inicia sem erros (`npm start`)
- [x] Teste: Conexão com MySQL estabelecida

## Fase 2: Backend - Spring Boot ✅ CONCLUÍDA

### 2.1 Configuração do Banco de Dados
- [x] Criar schema do banco de dados
- [x] Definir entidades JPA:
  - [x] User (id, username, email, phone, password, registrationNumber, userType, approved)
  - [x] Event (id, title, description, eventType, date, createdBy, members)
  - [x] EventMember (id, eventId, userId)
- [x] Configurar application.properties
- [x] Criar migrations iniciais

**Checkpoint 2.1**: ✅ CONCLUÍDO
- [x] Teste: Tabelas criadas no MySQL
- [x] Teste: Conexão JPA funcionando
- [x] Teste: Inserção de dados de teste

### 2.2 Autenticação e Autorização
- [x] Implementar Spring Security
- [x] Configurar JWT para autenticação
- [x] Criar endpoints de login e registro
- [x] Implementar controle de acesso baseado em roles

**Checkpoint 2.2**: ✅ CONCLUÍDO
- [x] Teste: Endpoint de login retorna JWT válido
- [x] Teste: Endpoint de registro cria usuário pendente
- [x] Teste: Acesso negado para rotas protegidas sem token
- [x] Teste: Diferentes roles têm acessos diferentes

### 2.3 APIs de Usuários
- [x] CRUD completo de usuários
- [x] Endpoint de aprovação de cadastros (apenas admin)
- [x] Endpoint de listagem de usuários por tipo
- [x] Validações de dados

**Checkpoint 2.3**: ✅ CONCLUÍDO
- [x] Teste: Criação de usuário com dados válidos
- [x] Teste: Validação de email único
- [x] Teste: Aprovação de cadastro por admin
- [x] Teste: Listagem filtrada por tipo de usuário

### 2.4 APIs de Eventos
- [x] CRUD completo de eventos
- [x] Endpoint de listagem de eventos por usuário
- [x] Endpoint de adição/remoção de membros
- [x] Filtros por tipo de evento e data

**Checkpoint 2.4**: ✅ CONCLUÍDO
- [x] Teste: Criação de evento por professor
- [x] Teste: Criação de evento de festa por aluno
- [x] Teste: Edição de evento pelo criador
- [x] Teste: Listagem de eventos por permissão

## Fase 3: Frontend - React 🚧 EM ANDAMENTO

### 3.1 Configuração e Estrutura
- [x] Configurar React com TypeScript
- [x] Instalar dependências: react-router-dom, axios, styled-components
- [x] Configurar estrutura de pastas
- [x] Configurar proxy para API

**Checkpoint 3.1**: ✅ CONCLUÍDO
- [x] Teste: React inicia sem erros
- [x] Teste: Roteamento funcionando
- [x] Teste: Requisições para API funcionando

### 3.2 Componentes de Autenticação
- [x] Componente de Login (RF001)
- [x] Componente de Cadastro (RF002)
- [x] Context de autenticação
- [x] Proteção de rotas

**Checkpoint 3.2**: ✅ CONCLUÍDO
- [x] Teste: Login com credenciais válidas
- [x] Teste: Cadastro com dados válidos
- [x] Teste: Redirecionamento após login
- [x] Teste: Proteção de rotas privadas

### 3.3 Componente de Calendário (RF003) 🚧 EM ANDAMENTO
- [ ] Calendário mensal
- [ ] Exibição de eventos por dia
- [ ] Filtros por tipo de usuário
- [ ] Miniaturas de membros

**Checkpoint 3.3**:
- [ ] Teste: Calendário exibe mês atual
- [ ] Teste: Eventos aparecem nos dias corretos
- [ ] Teste: Alunos veem apenas eventos incluídos
- [ ] Teste: Professores veem eventos da turma
- [ ] Teste: Admins veem todos os eventos

### 3.4 Cards de Atividade (RF004)
- [ ] Componente de card de evento
- [ ] Exibição de informações completas
- [ ] Ações de edição/exclusão
- [ ] Modal de detalhes

**Checkpoint 3.4**:
- [ ] Teste: Card exibe todas as informações
- [ ] Teste: Ações aparecem conforme permissão
- [ ] Teste: Modal de detalhes abre corretamente

### 3.5 Modal de Criação de Atividade (RF005)
- [ ] Formulário de criação de evento
- [ ] Validações de campos
- [ ] Upload de imagens
- [ ] Seleção de membros

**Checkpoint 3.5**:
- [ ] Teste: Professores podem criar provas/trabalhos
- [ ] Teste: Alunos podem criar eventos de festa
- [ ] Teste: Validações impedem dados inválidos
- [ ] Teste: Upload de imagens funciona

## Fase 4: Integração e Testes

### 4.1 Integração Frontend-Backend
- [ ] Configurar interceptors para JWT
- [ ] Tratamento de erros global
- [ ] Loading states
- [ ] Feedback visual para usuário

**Checkpoint 4.1**:
- [ ] Teste: Token JWT enviado automaticamente
- [ ] Teste: Erros exibidos adequadamente
- [ ] Teste: Loading states funcionando
- [ ] Teste: Feedback de sucesso/erro

### 4.2 Testes de Integração
- [ ] Testes end-to-end dos fluxos principais
- [ ] Testes de permissões
- [ ] Testes de validação de dados
- [ ] Testes de performance

**Checkpoint 4.2**:
- [ ] Teste: Fluxo completo de cadastro → aprovação → login
- [ ] Teste: Criação → visualização → edição → exclusão de eventos
- [ ] Teste: Diferentes níveis de acesso funcionando
- [ ] Teste: Aplicação responde em < 3 segundos

### 4.3 Testes de Usabilidade
- [ ] Testes de navegação
- [ ] Testes de responsividade
- [ ] Testes de acessibilidade
- [ ] Testes de compatibilidade

**Checkpoint 4.3**:
- [ ] Teste: Navegação intuitiva
- [ ] Teste: Interface responsiva em mobile
- [ ] Teste: Contraste adequado
- [ ] Teste: Funciona em Chrome, Firefox, Safari

## Fase 5: Deploy e Documentação

### 5.1 Preparação para Produção
- [ ] Configurar variáveis de ambiente
- [ ] Otimizar build do React
- [ ] Configurar CORS
- [ ] Configurar SSL

**Checkpoint 5.1**:
- [ ] Teste: Build de produção sem erros
- [ ] Teste: Aplicação funciona em ambiente de produção
- [ ] Teste: Conexão segura com HTTPS

### 5.2 Documentação
- [ ] README do projeto
- [ ] Documentação da API
- [ ] Manual do usuário
- [ ] Documentação de deploy

**Checkpoint 5.2**:
- [ ] Teste: README contém instruções completas
- [ ] Teste: API documentada com Swagger
- [ ] Teste: Manual do usuário compreensível

## Critérios de Aceitação por RF

### RF001 - Tela de Login
- [ ] Campos username e senha funcionando
- [ ] Validação de credenciais
- [ ] Redirecionamento após login
- [ ] Tratamento de erros

### RF002 - Tela de Cadastro
- [ ] Todos os campos obrigatórios
- [ ] Validação de dados
- [ ] Usuário criado como pendente
- [ ] Aprovação por administrador

### RF003 - Tela de Calendário
- [ ] Visualização mensal
- [ ] Eventos exibidos por dia
- [ ] Filtros por tipo de usuário
- [ ] Miniaturas de membros

### RF004 - Card de Atividade
- [ ] Informações completas do evento
- [ ] Tipo, data, membros, título, descrição
- [ ] Ações conforme permissão

### RF005 - Modal de Criação
- [ ] Professores: provas e trabalhos
- [ ] Alunos: eventos de festa
- [ ] Administradores: todos os tipos
- [ ] Permissões de edição/exclusão

## Cronograma Estimado

- **Fase 1**: 1-2 dias
- **Fase 2**: 5-7 dias
- **Fase 3**: 7-10 dias
- **Fase 4**: 3-5 dias
- **Fase 5**: 2-3 dias

**Total estimado**: 18-27 dias

## Riscos e Mitigações

### Riscos Técnicos
- **Problema**: Compatibilidade entre versões
- **Mitigação**: Usar versões LTS e documentar dependências

- **Problema**: Performance do calendário com muitos eventos
- **Mitigação**: Implementar paginação e lazy loading

### Riscos de Negócio
- **Problema**: Mudanças nos requisitos
- **Mitigação**: Desenvolvimento iterativo com feedback contínuo

- **Problema**: Complexidade das permissões
- **Mitigação**: Testes rigorosos de cada nível de acesso

## Próximos Passos

1. Revisar e aprovar este plano
2. Configurar ambiente de desenvolvimento
3. Iniciar Fase 1 - Configuração e Estrutura Base
4. Estabelecer reuniões de acompanhamento semanais
5. Definir critérios de qualidade e revisão de código 

## Observações de Implementação

- Todas as entidades, repositórios e serviços do backend foram implementados.
- Controllers REST para autenticação, usuários e eventos criados.
- Segurança JWT e controle de acesso por roles funcionando.
- Banco de dados MySQL integrado e tabelas criadas automaticamente.
- Backend pronto para integração com o frontend React. 