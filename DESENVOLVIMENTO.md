# Ambiente de desenvolvimento local

Este guia descreve como subir o **Calendário de Eventos** com Docker para desenvolvimento, com hot reload no frontend e no backend.

O projeto é um calendário compartilhado de uso geral: usuários criam eventos entre si, organizam com tags e cores, conversam por comentários e veem apenas os eventos dos quais participam.

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
| MySQL     | `127.0.0.1:3306`       | Banco `calendario`                 |

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
| Banco    | `calendario`          |
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

## Autenticação e registro

- **Registro:** http://localhost:3000/register
- **Login:** http://localhost:3000/login
- A API de autenticação fica em `/api/auth/*` (proxied pelo frontend)

Não há papéis de usuário nem aprovação: ao se registrar, o usuário já pode fazer login imediatamente.

Mensagens comuns no login:

| Mensagem                  | Significado                  |
|---------------------------|------------------------------|
| `Credenciais inválidas`   | Usuário ou senha incorretos  |

Documentação completa da API: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## Schema do banco

O backend usa `spring.jpa.hibernate.ddl-auto=update`, que cria e atualiza as tabelas automaticamente a partir das entidades JPA na inicialização. Não é necessário rodar migrações manualmente em desenvolvimento.

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
calendario/
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

## Acesso pela rede local

Para que outras pessoas na mesma rede acessem o sistema:

1. Suba o projeto normalmente (`docker compose up`).
2. Descubra o IP da sua máquina (`ipconfig` no Windows; use o IPv4 da rede Wi-Fi/Ethernet).
3. Acesse de outro dispositivo: `http://SEU_IP:3000`.
4. Se necessário, libere a porta no firewall do Windows (PowerShell como administrador):
   ```powershell
   New-NetFirewallRule -DisplayName "Calendario Eventos 3000" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
   ```

Apenas a porta `3000` precisa estar acessível; backend e MySQL permanecem na rede interna do Docker.

## Solução de problemas

### Erro 403 em `/api/auth/*`

O proxy do CRA remove o prefixo `/api` ao encaminhar requisições. O arquivo `web/src/setupProxy.js` já corrige isso com `pathRewrite`. Se o problema persistir, reinicie o frontend:

```powershell
docker compose restart frontend
```

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
