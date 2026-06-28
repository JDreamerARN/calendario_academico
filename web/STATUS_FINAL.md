# ✅ Status - Calendário de Eventos

## 🎉 Projeto Funcional

O projeto é um calendário compartilhado de uso geral, com autenticação, eventos com tags e cores, participantes e comentários.

## 🚀 Como Executar

> Recomendado: usar Docker. Veja [DESENVOLVIMENTO.md](../DESENVOLVIMENTO.md).

### Comandos Manuais (sem Docker)
```bash
cd web
npm install --legacy-peer-deps
npm start
```

## 🌐 URLs de Acesso
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8080

## 📱 Funcionalidades Disponíveis

### 🔐 Autenticação
- ✅ Login com usuário e senha
- ✅ Registro de novos usuários (login imediato, sem aprovação)
- ✅ Logout funcional
- ✅ Proteção de rotas

### 📅 Calendário
- ✅ Visualização mensal
- ✅ Filtro por tag
- ✅ Cor do evento aplicada no calendário
- ✅ Navegação entre meses
- ✅ Modal de detalhes

### 📝 Eventos
- ✅ Criação com tags livres e cor personalizada
- ✅ Edição (apenas o organizador)
- ✅ Exclusão (apenas o organizador)
- ✅ Participantes
- ✅ Comentários
- ✅ Visibilidade restrita a criador e participantes

### 🎨 Interface
- ✅ Menu lateral responsivo
- ✅ Tema personalizado
- ✅ Loading states
- ✅ Tratamento de erros
- ✅ Design responsivo

## 🛠️ Tecnologias

- ✅ **React 19** com TypeScript
- ✅ **Material-UI 5** para componentes
- ✅ **React Router 6** para navegação
- ✅ **TanStack Query** para estado
- ✅ **Axios** para requisições HTTP
- ✅ **date-fns** para datas

## 📁 Arquivos de Documentação

- `INSTRUCOES.md` - Instruções completas de uso
- `COMO_USAR.md` - Guia de uso
- `MODAL_ADICIONAR_EVENTOS.md` - Detalhes do modal de eventos
- `AUTENTICACAO_JWT.md` - Autenticação JWT
- `TROUBLESHOOTING.md` - Solução de problemas
- `TESTE_AUTENTICACAO.md` - Teste de autenticação

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm start

# Build de produção
npm run build

# Verificar qualidade do código
npm run lint

# Limpar cache (se necessário)
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

## 📞 Suporte

Para qualquer problema:
1. Consulte `TROUBLESHOOTING.md`
2. Verifique logs do console
3. Teste conectividade com backend: `curl http://localhost:8080/api/auth/test`
