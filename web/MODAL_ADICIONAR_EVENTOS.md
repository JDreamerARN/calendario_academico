# Modal de Adicionar Eventos

## Visão Geral

O modal de adicionar eventos é um componente React reutilizável que permite aos usuários criar novos eventos no calendário. Inclui validação de formulário, tags livres, seleção de cor, seleção de participantes e integração com a API.

## Funcionalidades

### ✅ Campos do Formulário

1. **Título do Evento** (obrigatório)
   - Campo de texto simples
   - Validação: não pode estar vazio

2. **Descrição** (obrigatório)
   - Campo de texto multilinha (4 linhas)
   - Validação: não pode estar vazio

3. **Tags** (opcional)
   - Tags livres digitadas pelo usuário
   - Adicione com Enter ou pelo botão "Adicionar"
   - Exibidas como chips coloridos e removíveis
   - Componente: `TagInput`

4. **Cor do Evento** (obrigatório)
   - Seletor de cor com cores pré-definidas e seletor livre
   - A cor é usada no calendário e nos detalhes do evento
   - Componente: `ColorPicker`

5. **Data e Hora** (obrigatório)
   - DateTimePicker com localização em português
   - Formato: dd/MM/yyyy HH:mm

6. **Participantes** (opcional)
   - Autocomplete com busca de usuários
   - Exibe chips com os nomes selecionados
   - O criador é adicionado automaticamente como organizador

### ✅ Validações

- **Título**: obrigatório
- **Descrição**: obrigatória
- **Feedback visual**: campos com erro ficam destacados
- **Limpeza automática**: erros são limpos quando o usuário começa a digitar

### ✅ Integração com API

- **Busca de usuários**: carrega a lista de usuários (`GET /api/users/summary`) ao abrir o modal
- **Criação de evento**: envia dados para `POST /api/events`
- **Cache**: usa React Query para cache e invalidação automática
- **Loading states**: indicadores de carregamento

### ✅ UX/UI

- **Design responsivo**
- **Feedback visual**: snackbar com mensagens de sucesso/erro
- **Reset automático**: formulário é limpo ao fechar
- **Localização**: interface em português brasileiro

## Estrutura dos Arquivos

```
web/src/
├── components/
│   ├── AddEventModal.tsx     # Modal principal
│   ├── TagInput.tsx          # Campo de tags
│   └── ColorPicker.tsx       # Seletor de cor
├── hooks/
│   └── useEvents.ts          # Hook com mutations
├── pages/
│   └── CalendarPage.tsx      # Página que usa o modal
└── types/
    └── index.ts              # Tipos TypeScript
```

## Como Usar

### 1. Importar o Componente

```tsx
import AddEventModal from '../components/AddEventModal';
```

### 2. Usar na Página

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

## Dados Enviados para API

```json
{
  "title": "Reunião de planejamento",
  "description": "Alinhamento das próximas entregas",
  "tags": ["reunião", "trabalho"],
  "color": "#1976d2",
  "date": "2026-01-15T14:00:00.000Z",
  "memberIds": [1, 2, 3]
}
```

## Estados do Modal

### Loading States
- `isLoading`: durante a criação do evento
- `isLoadingUsers`: durante o carregamento da lista de usuários

### Error States
- Validação de formulário
- Erro na busca de usuários
- Erro na criação do evento

### Success States
- Evento criado com sucesso
- Modal fecha automaticamente
- Snackbar de confirmação

## Dependências

### Material-UI
- `@mui/material`: componentes base
- `@mui/icons-material`: ícones
- `@mui/x-date-pickers`: seletor de data/hora

### React Query
- `@tanstack/react-query`: cache e mutations

### Date-fns
- `date-fns`: manipulação de datas
- `date-fns/locale/ptBR`: localização brasileira

## Edição e Comentários

A edição de eventos e os comentários ficam no componente `EventDetailsModal`, aberto ao clicar em um evento do calendário:

- **Edição** (apenas o organizador): título, descrição, tags, cor, data e participantes
- **Comentários**: qualquer participante pode adicionar; apenas o autor exclui o próprio comentário

## Melhorias Futuras

- [ ] Upload de imagem para o evento
- [ ] Recorrência de eventos
- [ ] Limite de participantes
- [ ] Notificações
- [ ] Validação de conflitos de horário

## Troubleshooting

### Modal não abre
- Verificar se `open={true}`
- Verificar se não há erros no console

### Usuários não carregam
- Verificar se o token está válido
- Verificar se a API está rodando

### Erro ao criar evento
- Verificar se título e descrição estão preenchidos
- Verificar se o backend está acessível
