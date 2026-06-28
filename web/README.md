# Frontend - Calendário de Eventos

Este é o frontend do Calendário de Eventos, desenvolvido em React com TypeScript e Material-UI.

É um calendário compartilhado de uso geral: usuários criam eventos entre si, organizam com tags livres e uma cor personalizada, conversam por comentários e veem apenas os eventos dos quais participam.

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
│   ├── Calendar.tsx          # Calendário mensal
│   ├── AddEventModal.tsx     # Modal de criação de evento
│   ├── EventDetailsModal.tsx # Detalhes, edição e comentários
│   ├── TagInput.tsx          # Campo de tags livres
│   ├── ColorPicker.tsx       # Seletor de cor do evento
│   └── PrivateRoute.tsx      # Rota protegida
├── contexts/            # Contextos React
│   └── AuthContext.tsx  # Contexto de autenticação
├── hooks/               # Hooks customizados
│   ├── useEvents.ts     # Eventos e mutations
│   └── useUserEvents.ts # Eventos do usuário
├── pages/               # Páginas da aplicação
│   ├── Login.tsx        # Página de login
│   ├── Register.tsx     # Página de registro
│   ├── CalendarPage.tsx # Página principal do calendário
│   └── Profile.tsx      # Perfil do usuário
├── services/            # Serviços de API
│   └── api.ts           # Cliente da API
├── types/               # Definições de tipos TypeScript
│   └── index.ts         # Interfaces e tipos
├── utils/               # Utilitários
│   └── tagColors.ts     # Cores de tags e contraste
└── App.tsx              # Componente principal
```

## 🎨 Funcionalidades

### Autenticação
- **Login**: Autenticação de usuários com JWT
- **Registro**: Cadastro de novos usuários (login imediato, sem aprovação)
- **Proteção de Rotas**: Rotas protegidas por autenticação

### Calendário
- **Visualização Mensal**: Calendário com navegação entre meses
- **Cor do evento**: Cada evento tem uma cor escolhida na criação, usada no calendário e nos detalhes
- **Filtro por tag**: Filtra os eventos do mês por tag
- **Modal de Detalhes**: Exibe dados completos, participantes e comentários
- **Responsividade**: Interface adaptada para mobile e desktop

### Eventos
- **Tags livres**: Organize cada evento com quantas tags quiser
- **Participantes**: Convide outros usuários para o evento
- **Comentários**: Converse com os participantes dentro do evento
- **Visibilidade**: Cada usuário vê apenas os eventos dos quais participa

### Interface
- **Design Moderno**: Interface limpa e intuitiva
- **Tema Personalizado**: Cores e estilos customizados
- **Navegação**: Menu lateral com opções do sistema
- **Loading States**: Indicadores de carregamento

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm
- Backend rodando na porta 8080

> A forma recomendada de subir todo o ambiente é via Docker. Veja [DESENVOLVIMENTO.md](../DESENVOLVIMENTO.md).

### Instalação
```bash
# Instalar dependências
npm install --legacy-peer-deps

# Executar em modo de desenvolvimento
npm start

# Build para produção
npm run build
```

### Variáveis de Ambiente
O frontend se conecta ao backend pela variável:
```
REACT_APP_API_URL=http://localhost:8080/api
```

Em desenvolvimento com Docker, o valor padrão é `/api` (proxied para o backend).

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

2. Os arquivos estarão na pasta `build/`.

3. Faça o upload dos arquivos para seu servidor web (ou use o `Dockerfile.prod` com nginx).
