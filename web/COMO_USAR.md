# 🚀 Como Usar o Frontend - Sistema de Eventos Acadêmicos

## ✅ Status do Projeto

O projeto está **FUNCIONANDO** e rodando em: **http://localhost:3000**

## 🎯 Funcionalidades Implementadas

### ✅ Autenticação
- [x] Login com validação
- [x] Registro de usuários
- [x] Proteção de rotas
- [x] Logout

### ✅ Calendário Acadêmico
- [x] Visualização mensal
- [x] Filtros por tipo de evento
- [x] Filtros por tipo de usuário
- [x] Modal de detalhes do evento
- [x] Responsividade total

### ✅ Interface
- [x] Design moderno com Material-UI
- [x] Menu lateral responsivo
- [x] Loading states
- [x] Tratamento de erros

## 🛠️ Como Executar

### Método 1: Script Automático (Recomendado)
```bash
cd frontend
./start.sh
```

### Método 2: Comandos Manuais
```bash
cd frontend
npm install --legacy-peer-deps
npm start
```

### Método 3: Se houver problemas
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm start
```

## 🌐 Acessando o Sistema

1. **Abra o navegador**
2. **Acesse:** http://localhost:3000
3. **Faça login ou registre-se**

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

## 🔧 Configuração do Backend

Para que o frontend funcione completamente, o backend deve estar rodando:

```bash
# No diretório backend
mvn spring-boot:run
```

**URL do Backend:** http://localhost:8080

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
- [ ] Filtros funcionam
- [ ] Modal de evento abre
- [ ] Responsividade funciona

### Interface
- [ ] Menu lateral abre/fecha
- [ ] Logout funciona
- [ ] Loading states aparecem
- [ ] Erros são exibidos

## 🎨 Recursos Visuais

- **Tema:** Material-UI personalizado
- **Cores:** Azul primário, rosa secundário
- **Tipografia:** Roboto
- **Ícones:** Material Icons
- **Responsividade:** Total

## 📊 Tecnologias

- **React 19** + TypeScript
- **Material-UI** (MUI)
- **React Router**
- **TanStack Query**
- **Axios**
- **date-fns**

## 🚀 Próximos Passos

1. **Teste todas as funcionalidades**
2. **Verifique responsividade**
3. **Teste integração com backend**
4. **Reporte bugs se encontrar**

## 📞 Suporte

Se encontrar problemas:

1. **Consulte:** `TROUBLESHOOTING.md`
2. **Verifique logs:** Console do navegador
3. **Teste API:** `curl http://localhost:8080/api/auth/test`

---

**🎉 O projeto está pronto para uso!** 