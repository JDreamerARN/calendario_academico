# Sistema de Eventos Acadêmicos - Frontend

## 📋 Visão Geral

Este é o frontend do Sistema de Eventos Acadêmicos, desenvolvido em React com TypeScript. O projeto inclui:

- ✅ **Autenticação completa** com JWT
- ✅ **Calendário responsivo** com filtros
- ✅ **Modal de detalhes** dos eventos
- ✅ **Menu lateral** com navegação
- ✅ **Tema personalizado** Material-UI
- ✅ **Proteção de rotas** para usuários autenticados
- ✅ **Interface responsiva** para mobile e desktop

## 🚀 Inicialização Rápida

### Opção 1: Script Automático (Recomendado)
```bash
./start-quick.sh
```

### Opção 2: Comandos Manuais
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
- **Login**: `/login` - Acesso com username e senha
- **Registro**: `/register` - Cadastro de novos usuários
- **Logout**: Botão no menu lateral

### 📅 Calendário
- **Visualização mensal** dos eventos
- **Filtros por tipo**: Acadêmico, Festa, Todos
- **Filtros por usuário**: Aluno, Professor, Administrador
- **Navegação entre meses**
- **Modal de detalhes** ao clicar no evento

### 🎨 Interface
- **Menu lateral** com navegação
- **Tema personalizado** com cores acadêmicas
- **Responsivo** para mobile e desktop
- **Loading states** e feedback visual

## 🛠️ Tecnologias Utilizadas

- **React 18** com TypeScript
- **Material-UI 5** para componentes
- **React Router 6** para navegação
- **TanStack Query** para gerenciamento de estado
- **Axios** para requisições HTTP
- **date-fns** para manipulação de datas

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Calendar.tsx     # Calendário principal
│   ├── LoadingSpinner.tsx
│   └── PrivateRoute.tsx # Proteção de rotas
├── contexts/           # Contextos React
│   └── AuthContext.tsx # Contexto de autenticação
├── hooks/              # Hooks customizados
│   └── useEvents.ts    # Hook para eventos
├── pages/              # Páginas da aplicação
│   ├── Login.tsx       # Página de login
│   ├── Register.tsx    # Página de registro
│   └── CalendarPage.tsx # Página principal
├── services/           # Serviços de API
│   └── api.ts          # Cliente HTTP
├── types/              # Tipos TypeScript
│   └── index.ts        # Definições de tipos
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

## 📊 Status do Projeto

### ✅ Concluído
- [x] Setup inicial do projeto
- [x] Configuração do Material-UI
- [x] Sistema de autenticação
- [x] Páginas de login e registro
- [x] Calendário com filtros
- [x] Modal de detalhes
- [x] Menu lateral
- [x] Proteção de rotas
- [x] Tema personalizado
- [x] Responsividade
- [x] Integração com API
- [x] Tratamento de erros
- [x] Loading states

### 🔄 Em Desenvolvimento
- [ ] Adição de eventos
- [ ] Edição de eventos
- [ ] Gerenciamento de membros
- [ ] Notificações
- [ ] Testes unitários

## 🎯 Próximos Passos

1. **Implementar CRUD completo** de eventos
2. **Adicionar testes** unitários e de integração
3. **Melhorar UX** com animações e feedback
4. **Implementar cache** offline
5. **Adicionar PWA** capabilities

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique o arquivo `TROUBLESHOOTING.md`
2. Consulte os logs do console
3. Teste a conectividade com o backend

---

**Desenvolvido com ❤️ para o Sistema de Eventos Acadêmicos** 