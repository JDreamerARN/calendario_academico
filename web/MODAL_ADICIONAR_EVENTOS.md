# Modal de Adicionar Eventos

## Visão Geral

O modal de adicionar eventos foi implementado como um componente React reutilizável que permite aos usuários criar novos eventos no sistema. O modal inclui validação de formulário, seleção de membros e integração com a API.

## Funcionalidades

### ✅ **Campos do Formulário**

1. **Título do Evento** (obrigatório)
   - Campo de texto simples
   - Validação: não pode estar vazio

2. **Descrição** (obrigatório)
   - Campo de texto multilinha (4 linhas)
   - Validação: não pode estar vazio

3. **Tipo de Evento** (obrigatório)
   - Select com opções: Acadêmico ou Festa
   - Valor padrão: Acadêmico

4. **Data e Hora** (obrigatório)
   - DateTimePicker com localização em português
   - Validação: não pode ser no passado
   - Formato: dd/MM/yyyy HH:mm

5. **Membros** (opcional)
   - Select múltiplo com busca de usuários
   - Exibe chips com nomes dos usuários selecionados
   - Mostra tipo de usuário (ALUNO, PROFESSOR, ADMINISTRADOR)

### ✅ **Validações**

- **Título**: Campo obrigatório
- **Descrição**: Campo obrigatório
- **Data**: Não pode ser no passado
- **Feedback visual**: Campos com erro ficam vermelhos
- **Limpeza automática**: Erros são limpos quando o usuário começa a digitar

### ✅ **Integração com API**

- **Busca de usuários**: Carrega lista de usuários apenas quando o modal abre
- **Criação de evento**: Envia dados para `POST /api/events`
- **Cache**: Usa React Query para cache e invalidação automática
- **Loading states**: Mostra indicadores de carregamento

### ✅ **UX/UI**

- **Design responsivo**: Adapta-se a diferentes tamanhos de tela
- **Feedback visual**: Snackbar com mensagens de sucesso/erro
- **Reset automático**: Formulário é limpo ao fechar
- **Acessibilidade**: Labels, tooltips e navegação por teclado
- **Localização**: Interface em português brasileiro

## Estrutura dos Arquivos

```
frontend/src/
├── components/
│   └── AddEventModal.tsx          # Modal principal
├── hooks/
│   └── useEvents.ts               # Hook com mutations
├── pages/
│   └── CalendarPage.tsx           # Página que usa o modal
└── types/
    └── index.ts                   # Tipos TypeScript
```

## Como Usar

### 1. **Importar o Componente**

```tsx
import AddEventModal from '../components/AddEventModal';
```

### 2. **Usar na Página**

```tsx
const [modalOpen, setModalOpen] = useState(false);
const { createEvent, isCreating } = useEvents();

const handleCreateEvent = (eventData: CreateEventRequest) => {
  createEvent(eventData, {
    onSuccess: () => {
      setModalOpen(false);
      // Mostrar mensagem de sucesso
    },
    onError: (error) => {
      // Mostrar mensagem de erro
    },
  });
};

// No JSX
<AddEventModal
  open={modalOpen}
  onClose={() => setModalOpen(false)}
  onSubmit={handleCreateEvent}
  isLoading={isCreating}
/>
```

### 3. **Abrir o Modal**

```tsx
const handleAddEvent = () => {
  setModalOpen(true);
};

// Botão ou FAB
<Button onClick={handleAddEvent}>
  Adicionar Evento
</Button>
```

## Dados Enviados para API

```json
{
  "title": "Palestra sobre React",
  "description": "Palestra introdutória sobre React e seus conceitos fundamentais",
  "eventType": "ACADEMICO",
  "date": "2024-01-15T14:00:00.000Z",
  "memberIds": [1, 2, 3]
}
```

## Estados do Modal

### **Loading States**
- `isLoading`: Durante a criação do evento
- `isLoadingUsers`: Durante o carregamento da lista de usuários

### **Error States**
- Validação de formulário
- Erro na busca de usuários
- Erro na criação do evento

### **Success States**
- Evento criado com sucesso
- Modal fecha automaticamente
- Snackbar de confirmação

## Dependências

### **Material-UI**
- `@mui/material`: Componentes base
- `@mui/icons-material`: Ícones
- `@mui/x-date-pickers`: Seletor de data/hora

### **React Query**
- `@tanstack/react-query`: Cache e mutations

### **Date-fns**
- `date-fns`: Manipulação de datas
- `date-fns/locale/ptBR`: Localização brasileira

## Melhorias Futuras

### **Funcionalidades Adicionais**
- [ ] Upload de imagem para o evento
- [ ] Recorrência de eventos
- [ ] Limite de participantes
- [ ] Categorias personalizadas
- [ ] Tags para eventos

### **UX/UI**
- [ ] Animações de entrada/saída
- [ ] Drag & drop para membros
- [ ] Busca em tempo real
- [ ] Preview do evento
- [ ] Templates de eventos

### **Validações**
- [ ] Limite de caracteres
- [ ] Validação de conflitos de horário
- [ ] Permissões por tipo de usuário
- [ ] Validação de capacidade do local

## Troubleshooting

### **Problemas Comuns**

1. **Modal não abre**
   - Verificar se `open={true}`
   - Verificar se não há erros no console

2. **Usuários não carregam**
   - Verificar se o token está válido
   - Verificar se a API está rodando
   - Verificar permissões do usuário

3. **Erro ao criar evento**
   - Verificar se todos os campos obrigatórios estão preenchidos
   - Verificar se a data não é no passado
   - Verificar se o usuário tem permissão

4. **Problemas de data**
   - Verificar se o timezone está correto
   - Verificar se a data está no formato correto

### **Logs de Debug**

```tsx
// Adicionar logs para debug
console.log('Dados do formulário:', formData);
console.log('Usuários carregados:', users);
console.log('Token atual:', token);
```

## Exemplo Completo

```tsx
import React, { useState } from 'react';
import { Button, Snackbar, Alert } from '@mui/material';
import { useEvents } from '../hooks/useEvents';
import AddEventModal from '../components/AddEventModal';
import { CreateEventRequest } from '../types';

const EventPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const { createEvent, isCreating } = useEvents();

  const handleCreateEvent = (eventData: CreateEventRequest) => {
    createEvent(eventData, {
      onSuccess: () => {
        setModalOpen(false);
        setSnackbar({
          open: true,
          message: 'Evento criado com sucesso!',
          severity: 'success',
        });
      },
      onError: (error) => {
        setSnackbar({
          open: true,
          message: error.message || 'Erro ao criar evento',
          severity: 'error',
        });
      },
    });
  };

  return (
    <>
      <Button onClick={() => setModalOpen(true)}>
        Adicionar Evento
      </Button>

      <AddEventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateEvent}
        isLoading={isCreating}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EventPage;
```

---

**Data de Criação**: Janeiro 2024  
**Versão**: 1.0.0  
**Autor**: Sistema de Eventos Acadêmicos 