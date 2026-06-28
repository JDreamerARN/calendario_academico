# 🚀 Como Usar o Calendário de Eventos

## ✅ Visão Geral

Calendário compartilhado de uso geral, acessível em: **http://localhost:3000**

Crie uma conta, crie eventos, convide participantes, organize com tags e cores e converse por comentários. Cada usuário vê apenas os eventos dos quais participa.

## 🎯 Funcionalidades

### ✅ Autenticação
- [x] Login com validação
- [x] Registro de usuários (login imediato, sem aprovação)
- [x] Proteção de rotas
- [x] Logout

### ✅ Calendário
- [x] Visualização mensal
- [x] Filtro por tag
- [x] Cor do evento aplicada no calendário
- [x] Modal de detalhes do evento
- [x] Responsividade total

### ✅ Eventos
- [x] Tags livres
- [x] Cor personalizada
- [x] Participantes
- [x] Comentários

### ✅ Interface
- [x] Design moderno com Material-UI
- [x] Menu lateral responsivo
- [x] Loading states
- [x] Tratamento de erros

## 🛠️ Como Executar

> Recomendado: usar Docker. Veja [DESENVOLVIMENTO.md](../DESENVOLVIMENTO.md).

### Comandos Manuais
```bash
cd web
npm install --legacy-peer-deps
npm start
```

### Se houver problemas
```bash
cd web
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm start
```

## 🌐 Acessando o Sistema

1. **Abra o navegador**
2. **Acesse:** http://localhost:3000
3. **Registre-se e faça login**

## 📝 Fluxo de Uso

1. **Crie sua conta** em `/register` e faça login.
2. **Crie um evento** pelo botão "+": informe título, descrição, tags, cor, data e participantes.
3. **Convide participantes** — eles passam a ver o evento no próprio calendário.
4. **Comente** dentro do evento para combinar detalhes.
5. **Filtre por tag** para encontrar eventos rapidamente.

## 📱 Testando Responsividade

### Desktop (> 1024px)
- Interface completa com menu lateral
- Calendário amplo

### Tablet (768px - 1024px)
- Menu lateral colapsável
- Layout adaptado

### Mobile (< 768px)
- Menu hambúrguer
- Interface otimizada

## 🔧 Backend

Para que o frontend funcione, o backend deve estar rodando em **http://localhost:8080**.

```bash
# Via Docker (recomendado), na raiz do projeto
docker compose up
```

## 🐛 Problemas Comuns

### 1. Erro de CORS
- Verifique se o backend está rodando
- O proxy está configurado automaticamente

### 2. Erro de dependências
```bash
npm install --legacy-peer-deps
```

### 3. Porta 3000 ocupada
```bash
PORT=3001 npm start
```

### 4. Erro de autenticação
- Verifique se o backend está rodando
- Teste: `curl http://localhost:8080/api/auth/test`

## 📋 Checklist de Teste

### Login/Registro
- [ ] Página de login carrega
- [ ] Página de registro carrega
- [ ] Validação de campos funciona
- [ ] Redirecionamento após login

### Calendário
- [ ] Calendário mensal exibe
- [ ] Navegação entre meses funciona
- [ ] Filtro por tag funciona
- [ ] Cor do evento aparece corretamente
- [ ] Modal de evento abre
- [ ] Comentários funcionam
- [ ] Responsividade funciona

### Interface
- [ ] Menu lateral abre/fecha
- [ ] Logout funciona
- [ ] Loading states aparecem
- [ ] Erros são exibidos

## 📊 Tecnologias

- **React 19** + TypeScript
- **Material-UI** (MUI)
- **React Router**
- **TanStack Query**
- **Axios**
- **date-fns**

## 📞 Suporte

Se encontrar problemas:

1. **Consulte:** `TROUBLESHOOTING.md`
2. **Verifique logs:** Console do navegador
3. **Teste API:** `curl http://localhost:8080/api/auth/test`
