# Ambiente de desenvolvimento local

Este guia descreve como subir o **Sistema de Eventos Acadêmicos** com Docker para desenvolvimento, com hot reload no frontend e no backend.

## Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e em execução
- Portas livres na máquina:
  - `3000` — frontend
  - `3306` — MySQL (apenas em `localhost`, para ferramentas como DBeaver)

Não é necessário instalar Java, Maven ou Node.js na máquina host: tudo roda dentro dos containers.

## Início rápido

Na raiz do repositório:

```powershell
# Primeira vez, ou após mudanças em pom.xml / package.json
docker compose up --build

# Uso diário (sem rebuild)
docker compose up
```

Acesse o sistema em **http://localhost:3000**.

Para rodar em segundo plano:

```powershell
docker compose up -d
```

Parar os serviços:

```powershell
docker compose down
```

Remover também os dados do banco (cuidado: apaga tudo):

```powershell
docker compose down -v
```

## Arquitetura

```
Sua máquina
    │
    ├── localhost:3000  ──► frontend (React dev server)
    │                            │
    │                            └── proxy /api ──► backend:8080 (rede interna)
    │                                                      │
    └── localhost:3306  ──► mysql:3306 (rede interna) ◄────┘
```

| Serviço   | Porta exposta no host | Descrição                          |
|-----------|------------------------|------------------------------------|
| Frontend  | `3000`                 | React + TypeScript (CRA)           |
| Backend   | —                      | Spring Boot 3 (Java 17)            |
| MySQL     | `127.0.0.1:3306`       | Banco `eventos_academicos`         |

O backend **não** é exposto diretamente no host. As chamadas à API passam pelo proxy do frontend em `/api`.

## Hot reload

O `docker-compose.yml` está configurado para desenvolvimento. Alterações no código são refletidas sem rebuild do container, exceto quando dependências mudam.

| O que mudou              | Comportamento                                      | Ação necessária              |
|--------------------------|----------------------------------------------------|------------------------------|
| Arquivos `.java`         | Reinício automático via Spring DevTools (~segundos) | Nenhuma                      |
| Arquivos React/TS/CSS    | Hot reload no navegador                            | Nenhuma                      |
| `backend/pom.xml`        | Novas dependências Maven                           | `docker compose restart backend` ou rebuild |
| `web/package.json`       | Novas dependências npm                             | `docker compose up --build frontend` |
| `web/src/setupProxy.js`  | Configuração do proxy                              | `docker compose restart frontend` |

## Credenciais do banco

| Campo    | Valor                 |
|----------|-----------------------|
| Host     | `localhost`           |
| Porta    | `3306`                |
| Banco    | `eventos_academicos`  |
| Usuário  | `root`                |
| Senha    | `root123`             |

Esses valores estão definidos em `docker-compose.yml` e em `backend/src/main/resources/application.properties`.

## Acessar o banco com DBeaver

1. Certifique-se de que o MySQL está rodando: `docker compose up -d mysql`
2. No DBeaver, crie uma conexão **MySQL** com os dados da tabela acima.
3. Se aparecer erro de *Public Key Retrieval*, adicione nas propriedades do driver:
   - `allowPublicKeyRetrieval` = `true`
   - `useSSL` = `false`

Se a porta `3306` já estiver em uso por outro MySQL local, altere o mapeamento em `docker-compose.yml`:

```yaml
ports:
  - "127.0.0.1:3307:3306"
```

E use a porta `3307` no DBeaver.

### Aprovar usuário manualmente via SQL

Usuários do tipo **ALUNO** e **PROFESSOR** precisam de aprovação de um administrador antes de fazer login. Para aprovar pelo DBeaver ou terminal:

```sql
UPDATE users SET approved = 1 WHERE username = 'nome_do_usuario';
```

Ou pelo terminal:

```powershell
docker compose exec mysql mysql -uroot -proot123 eventos_academicos -e "UPDATE users SET approved = 1 WHERE username = 'nome_do_usuario';"
```

**Administradores** (`ADMINISTRADOR`) são aprovados automaticamente no registro.

## Autenticação e registro

- **Registro:** http://localhost:3000/register
- **Login:** http://localhost:3000/login
- A API de autenticação fica em `/api/auth/*` (proxied pelo frontend)

Mensagens comuns no login:

| Mensagem                                              | Significado                                      |
|-------------------------------------------------------|--------------------------------------------------|
| `Credenciais inválidas`                               | Usuário ou senha incorretos                      |
| `Conta pendente de aprovação pelo administrador.`     | Senha correta, mas conta ainda não aprovada      |

Documentação completa da API: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## Comandos úteis

```powershell
# Ver status dos containers
docker compose ps

# Logs de todos os serviços
docker compose logs -f

# Logs só do backend
docker compose logs -f backend

# Reiniciar um serviço
docker compose restart backend
docker compose restart frontend

# Rebuild forçado
docker compose up --build
```

## Estrutura do projeto

```
calendario_academico/
├── backend/          # API Spring Boot
├── web/              # Frontend React
├── docker-compose.yml          # Desenvolvimento (hot reload)
├── docker-compose.prod.yml     # Produção (build estático + nginx)
└── API_DOCUMENTATION.md
```

## Ambiente de produção (opcional)

Para testar o build de produção (sem hot reload):

```powershell
docker compose -f docker-compose.prod.yml up --build
```

Nesse modo, o frontend é servido pelo nginx na porta `3000` e as imagens usam `Dockerfile.prod` em `backend/` e `web/`.

## Solução de problemas

### Erro 403 em `/api/auth/*`

O proxy do CRA remove o prefixo `/api` ao encaminhar requisições. O arquivo `web/src/setupProxy.js` já corrige isso com `pathRewrite`. Se o problema persistir, reinicie o frontend:

```powershell
docker compose restart frontend
```

### Login falha após registro bem-sucedido

Verifique a coluna `approved` na tabela `users`. Alunos e professores começam com `approved = false`. Veja a seção [Aprovar usuário manualmente via SQL](#aprovar-usuário-manualmente-via-sql).

### Backend não conecta ao MySQL

Aguarde o healthcheck do MySQL concluir. Verifique os logs:

```powershell
docker compose logs mysql
docker compose logs backend
```

### Frontend não detecta alterações (Windows)

O compose já define `CHOKIDAR_USEPOLLING` e `WATCHPACK_POLLING`. Se ainda falhar, reinicie o container do frontend.

### Docker Desktop não está rodando

Erro típico: `open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified.`

Abra o Docker Desktop e aguarde iniciar completamente antes de rodar `docker compose up`.
