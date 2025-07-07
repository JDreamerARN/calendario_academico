# Frontend - Sistema de Eventos Acadêmicos

Este é o frontend do Sistema de Eventos Acadêmicos, desenvolvido em React com TypeScript e Material-UI.

## 🚀 Tecnologias Utilizadas

- **React 19** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Material-UI (MUI)** - Biblioteca de componentes React
- **React Router** - Roteamento para aplicações React
- **TanStack Query** - Gerenciamento de estado e cache de dados
- **Axios** - Cliente HTTP para requisições à API
- **date-fns** - Biblioteca para manipulação de datas

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Calendar.tsx     # Componente do calendário
│   └── PrivateRoute.tsx # Rota protegida
├── contexts/            # Contextos React
│   └── AuthContext.tsx  # Contexto de autenticação
├── pages/               # Páginas da aplicação
│   ├── Login.tsx        # Página de login
│   ├── Register.tsx     # Página de registro
│   └── CalendarPage.tsx # Página principal do calendário
├── services/            # Serviços de API
│   └── api.ts           # Cliente da API
├── types/               # Definições de tipos TypeScript
│   └── index.ts         # Interfaces e tipos
└── App.tsx              # Componente principal
```

## 🎨 Funcionalidades

### Autenticação
- **Login**: Autenticação de usuários com JWT
- **Registro**: Cadastro de novos usuários
- **Proteção de Rotas**: Rotas protegidas por autenticação

### Calendário Acadêmico
- **Visualização Mensal**: Calendário com navegação entre meses
- **Filtros**: Por tipo de evento (Acadêmico/Festa) e tipo de usuário
- **Modal de Detalhes**: Exibição completa dos dados do evento
- **Responsividade**: Interface adaptada para mobile e desktop

### Interface
- **Design Moderno**: Interface limpa e intuitiva
- **Tema Personalizado**: Cores e estilos customizados
- **Navegação**: Menu lateral com opções do sistema
- **Loading States**: Indicadores de carregamento

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn
- Backend rodando na porta 8080

### Instalação
```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm start

# Build para produção
npm run build
```

### Variáveis de Ambiente
O frontend está configurado para se conectar ao backend na URL:
```
http://localhost:8080/api
```

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- **Desktop**: Interface completa com menu lateral
- **Tablet**: Layout adaptado para telas médias
- **Mobile**: Interface otimizada para dispositivos móveis

## 🔧 Configuração do Tema

O tema está configurado em `src/App.tsx` com:
- Cores primárias e secundárias personalizadas
- Tipografia Roboto
- Bordas arredondadas
- Localização em português brasileiro

## 🚀 Deploy

Para fazer o deploy:

1. Execute o build de produção:
```bash
npm run build
```

2. Os arquivos estarão na pasta `build/`

3. Faça o upload dos arquivos para seu servidor web

## 📄 Licença

Este projeto faz parte do Sistema de Eventos Acadêmicos.
