# Calendário de Eventos - Frontend

## 📋 Visão Geral

Este é o frontend do Calendário de Eventos, desenvolvido em React com TypeScript. O projeto inclui:

- ✅ **Autenticação completa** com JWT (login imediato após registro)
- ✅ **Calendário responsivo** com filtro por tag
- ✅ **Criação de eventos** com tags livres e cor personalizada
- ✅ **Participantes e comentários** em cada evento
- ✅ **Visibilidade restrita**: cada usuário vê apenas os eventos dos quais participa
- ✅ **Menu lateral** com navegação
- ✅ **Tema personalizado** Material-UI
- ✅ **Proteção de rotas** para usuários autenticados
- ✅ **Interface responsiva** para mobile e desktop

## 🚀 Inicialização Rápida

> Recomendado: subir tudo via Docker. Veja [DESENVOLVIMENTO.md](../DESENVOLVIMENTO.md).

### Comandos Manuais (sem Docker)
```bash
# Instalar dependências (apenas na primeira vez)
npm install --legacy-peer-deps

# Iniciar o projeto
npm start
```

## 🌐 URLs de Acesso

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8080

## 📱 Funcionalidades

### 🔐 Autenticação
- **Login**: `/login` - Acesso com usuário e senha
- **Registro**: `/register` - Cadastro de novos usuários
- **Logout**: Botão no menu lateral

### 📅 Calendário
- **Visualização mensal** dos eventos
- **Filtro por tag**
- **Navegação entre meses**
- **Cor do evento** aplicada no calendário
- **Modal de detalhes** ao clicar no evento

### 📝 Eventos
- **Tags livres** para organizar cada evento
- **Cor personalizada** escolhida na criação/edição
- **Participantes** convidados pelo organizador
- **Comentários** entre os participantes

### 🎨 Interface
- **Menu lateral** com navegação
- **Tema personalizado**
- **Responsivo** para mobile e desktop
- **Loading states** e feedback visual

## 🛠️ Tecnologias Utilizadas

- **React 19** com TypeScript
- **Material-UI 5** para componentes
- **React Router 6** para navegação
- **TanStack Query** para gerenciamento de estado
- **Axios** para requisições HTTP
- **date-fns** para manipulação de datas

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Calendar.tsx          # Calendário principal
│   ├── AddEventModal.tsx     # Criação de evento
│   ├── EventDetailsModal.tsx # Detalhes, edição e comentários
│   ├── TagInput.tsx          # Campo de tags
│   ├── ColorPicker.tsx       # Seletor de cor
│   ├── LoadingSpinner.tsx
│   └── PrivateRoute.tsx      # Proteção de rotas
├── contexts/           # Contextos React
│   └── AuthContext.tsx # Contexto de autenticação
├── hooks/              # Hooks customizados
│   ├── useEvents.ts    # Eventos e mutations
│   └── useUserEvents.ts
├── pages/              # Páginas da aplicação
│   ├── Login.tsx       # Página de login
│   ├── Register.tsx    # Página de registro
│   ├── CalendarPage.tsx # Página principal
│   └── Profile.tsx     # Perfil
├── services/           # Serviços de API
│   └── api.ts          # Cliente HTTP
├── types/              # Tipos TypeScript
│   └── index.ts        # Definições de tipos
├── utils/              # Utilitários
│   └── tagColors.ts    # Cores de tags e contraste
└── App.tsx             # Componente raiz
```

## 🔧 Configurações

### Proxy
O projeto está configurado com proxy para evitar problemas de CORS:
- **Desenvolvimento**: http://localhost:3000 → http://localhost:8080
- **Produção**: Configurar variáveis de ambiente

### Variáveis de Ambiente
```bash
# .env (opcional)
REACT_APP_API_URL=http://localhost:8080/api
```

## 🐛 Solução de Problemas

### Erro de Dependências
```bash
# Se houver conflitos de versão
npm install --legacy-peer-deps
```

### Erro de CORS
- O proxy está configurado automaticamente
- Verifique se o backend está rodando na porta 8080

### Erro de Compilação
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Backend Não Conecta
1. Verifique se o backend Java está rodando
2. Teste: `curl http://localhost:8080/api/auth/test`
3. Verifique logs do backend

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique o arquivo `TROUBLESHOOTING.md`
2. Consulte os logs do console
3. Teste a conectividade com o backend
