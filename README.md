# 🐼 PandaFit Frontend

Sistema pessoal de gerenciamento de treinos e plano alimentar desenvolvido com React + TypeScript.

## 🚀 Tecnologias Utilizadas

- **React 19.1.0** com TypeScript
- **Vite** como ferramenta de build
- **TailwindCSS** para estilização
- **React Router DOM v6+** para navegação
- **TanStack Query (React Query)** para gerenciamento de estado e cache
- **Fetch API** para comunicação com o backend

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis (vazio por enquanto)
├── pages/              # Páginas da aplicação
│   ├── Login.tsx       # Tela de login com autenticação mockada
│   ├── Dashboard.tsx   # Dashboard com resumo dos dados
│   ├── Treinos.tsx     # Listagem e criação de treinos
│   ├── TreinoDetalhe.tsx # Detalhes de um treino específico
│   ├── Exercicios.tsx  # Catálogo de exercícios com vídeos
│   ├── Dieta.tsx       # Plano alimentar e refeições
│   ├── Historico.tsx   # Histórico de atividades
│   └── Configuracoes.tsx # Configurações do sistema
├── services/
│   └── api.ts          # Serviços de API com React Query
├── context/
│   └── AuthContext.tsx # Contexto de autenticação
├── router/
│   └── index.tsx       # Configuração de rotas protegidas
├── App.tsx             # Componente principal
└── main.tsx            # Ponto de entrada
```

## 🔧 Como Executar

### Pré-requisitos

1. **Backend rodando**: Certifique-se de que o backend PandaFit está rodando em `http://localhost:8000`
2. **Node.js**: Versão 18+ recomendada

### Instalação e Execução

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Executar em modo de desenvolvimento:**
   ```bash
   npm run dev
   ```
   A aplicação estará disponível em `http://localhost:5173`

3. **Build para produção:**
   ```bash
   npm run build
   ```

## 🔐 Autenticação

- **Login Mockado**: Use qualquer ID de usuário e senha para fazer login
- **Token**: Armazenado no localStorage para persistência
- **Rotas Protegidas**: Todas as rotas exceto `/login` são protegidas

## 📱 Funcionalidades Implementadas

### 🏠 Dashboard
- Resumo de treinos e refeições
- Estatísticas gerais
- Atalhos rápidos para todas as seções

### 🏋️ Treinos
- ✅ Listar todos os treinos
- ✅ Criar novo treino
- ✅ Ver detalhes do treino
- ✅ Marcar treino como feito
- ✅ Excluir treino

### 💪 Exercícios
- ✅ Catálogo de exercícios
- ✅ Criar novo exercício
- ✅ Embed de vídeos do YouTube
- ✅ Organização por grupo muscular

### 🍽️ Dieta
- ✅ Listar refeições por horário
- ✅ Criar nova refeição
- ✅ Adicionar múltiplos alimentos
- ✅ Calcular calorias totais
- ✅ Marcar refeição como feita

### 📜 Histórico
- ✅ Visualizar atividades realizadas
- ✅ Filtrar por tipo (treino/refeição)
- ✅ Filtrar por data
- ✅ Estatísticas de atividades

### ⚙️ Configurações
- ✅ Informações da conta
- ✅ Reset do banco de dados
- ✅ Logout
- ✅ Informações do sistema

## 🔗 Integração com Backend

### Endpoints Utilizados

- `POST /api/usuarios/login` - Login do usuário
- `GET /api/treinos` - Listar treinos
- `POST /api/treinos` - Criar treino
- `GET /api/treinos/:id` - Detalhes do treino
- `PUT /api/treinos/:id` - Atualizar treino
- `DELETE /api/treinos/:id` - Excluir treino
- `GET /api/exercicios` - Listar exercícios
- `POST /api/exercicios` - Criar exercício
- `GET /api/dieta` - Listar refeições
- `POST /api/dieta` - Criar refeição
- `GET /api/historico` - Listar histórico
- `POST /api/historico` - Marcar atividade como feita
- `POST /api/reset` - Reset do banco de dados

### Configuração da API

- **Base URL**: `http://localhost:8000/api`
- **Headers**: `Content-Type: application/json`
- **Autenticação**: Token no header `Authorization: Bearer {token}` (preparado para o futuro)

## 🎨 Interface e UX

- **Design Responsivo**: Funciona em desktop e mobile
- **TailwindCSS**: Estilização moderna e consistente
- **Loading States**: Indicadores de carregamento em todas as operações
- **Error Handling**: Tratamento adequado de erros
- **Feedback Visual**: Confirmações e alertas para ações importantes

## 🚦 Status do Projeto

✅ **COMPLETO E FUNCIONAL**

Todas as funcionalidades especificadas foram implementadas:

- [x] Sistema de autenticação mockada
- [x] Proteção de rotas
- [x] Dashboard com resumo
- [x] CRUD completo de treinos
- [x] CRUD completo de exercícios
- [x] CRUD completo de dieta
- [x] Sistema de histórico
- [x] Configurações do sistema
- [x] Integração total com backend via React Query
- [x] Interface responsiva
- [x] Tratamento de erros
- [x] Estados de loading

## 🧪 Como Testar

1. **Fazer Login**: Use qualquer ID e senha
2. **Navegar pelo Dashboard**: Verificar estatísticas e atalhos
3. **Criar Treino**: Adicionar um novo treino
4. **Adicionar Exercícios**: Criar exercícios com vídeos do YouTube
5. **Criar Dieta**: Adicionar refeições com alimentos
6. **Marcar Atividades**: Marcar treinos e refeições como feitos
7. **Ver Histórico**: Verificar atividades realizadas
8. **Testar Filtros**: Filtrar histórico por tipo e data
9. **Reset**: Usar configurações para resetar dados

## 📞 Troubleshooting

### Problemas Comuns

1. **"Erro ao carregar dados"**
   - Verifique se o backend está rodando em `http://localhost:8000`
   - Confirme se todas as rotas da API estão funcionando

2. **"Token inválido"**
   - Faça logout e login novamente
   - Limpe o localStorage se necessário

3. **Vídeos do YouTube não aparecem**
   - Verifique se a URL está no formato correto
   - Exemplo: `https://www.youtube.com/watch?v=XXXXXXXXX`

## 📝 Notas de Desenvolvimento

- Token de autenticação é mockado para desenvolvimento
- localStorage é usado para persistir o login
- React Query implementa cache automático e refresh
- Todas as requisições usam fetch (não Axios)
- Sistema preparado para futuras implementações de autenticação real

---

**Desenvolvido com ❤️ usando React + TypeScript**