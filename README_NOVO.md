# Organizza - Sistema de Gerenciamento de Atividades

Um sistema completo para gerenciar suas atividades profissionais, desenvolvido em Angular com Material Design.

## 🚀 Funcionalidades

### ✅ Implementadas
- **Dashboard Principal**: Visão geral com estatísticas e navegação rápida
- **Gerenciamento de Atividades**: 
  - ✅ Cadastro de novas atividades
  - ✅ Listagem de todas as atividades
  - ✅ Edição de atividades existentes
  - ✅ Exclusão de atividades
  - ✅ Filtros por status (pendente, concluída, hoje)
  - ✅ Busca por título, descrição, cliente ou endereço
- **Calendário**: Visualização de atividades por data
- **Autenticação**: Sistema de login e registro de usuários
- **Interface Responsiva**: Design adaptável para diferentes dispositivos

### 📋 Campos de Atividade
- Título e descrição
- Data e horário
- Endereço
- Dados do cliente (nome e telefone)
- Valores (total e pago)
- Status (concluída/pendente e paga/não paga)

## 🛠️ Tecnologias Utilizadas

- **Angular 19** - Framework principal
- **Angular Material** - Componentes UI
- **TypeScript** - Linguagem de programação
- **RxJS** - Programação reativa
- **JSON Server** - Backend para desenvolvimento
- **Bootstrap** - Grid system e utilitários CSS

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### 1. Clone o repositório
```bash
git clone https://github.com/itallume/organizza.git
cd organizza
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Inicie o servidor backend (JSON Server)
```bash
npm run server
```
O servidor backend estará rodando em `http://localhost:8080`

### 4. Em outro terminal, inicie o frontend
```bash
npm start
```
A aplicação estará disponível em `http://localhost:4200`

### 5. Opção alternativa - Executar ambos simultaneamente
Primeiro instale o concurrently:
```bash
npm install --save-dev concurrently
```

Depois execute:
```bash
npm run dev
```

## 🎯 Como Usar

### 1. Primeiro Acesso
1. Acesse `http://localhost:4200`
2. Clique em "Registrar" para criar uma nova conta
3. Preencha os dados e faça o registro
4. Faça login com suas credenciais

### 2. Dashboard
- Visualize estatísticas rápidas
- Navegue pelas diferentes seções usando os cards
- Veja as próximas atividades

### 3. Gerenciar Atividades
- **Listar**: Acesse "Minhas Atividades" para ver todas
- **Filtrar**: Use os filtros por status ou busque por texto
- **Criar**: Clique em "Nova Atividade" ou use o botão "+"
- **Editar**: Clique em uma atividade ou use o menu de contexto
- **Excluir**: Use o menu de contexto de cada atividade

### 4. Calendário
- Selecione uma data para ver atividades específicas
- Clique em uma atividade para editá-la
- Crie atividades diretamente para datas específicas

## 🗂️ Estrutura do Projeto

```
src/
├── app/
│   ├── home/                    # Módulo principal
│   │   ├── activity-list/       # Lista de atividades
│   │   ├── activity-form/       # Formulário de atividade
│   │   ├── activity-register/   # Modal de registro
│   │   ├── activity-delete/     # Modal de exclusão
│   │   ├── calendar/           # Componente de calendário
│   │   └── calendar-card/      # Dashboard principal
│   ├── shared/                 # Componentes e serviços compartilhados
│   │   ├── services/          # Serviços (activity, user)
│   │   ├── model/            # Modelos de dados
│   │   ├── guards/           # Guards de autenticação
│   │   └── components/       # Header, Footer, etc.
│   └── user/                  # Módulo de usuário
│       ├── login/            # Tela de login
│       └── register/         # Tela de registro
```

## 🎨 Design System

### Cores Principais
- **Primary**: #64b5f6 (Azul)
- **Background**: #0a0a0a (Preto)
- **Cards**: #1a1a1a (Cinza escuro)
- **Borders**: #333 (Cinza médio)

### Status Colors
- **Concluída**: #4caf50 (Verde)
- **Pendente**: #ff9800 (Laranja)
- **Hoje**: #2196f3 (Azul)
- **Atrasada**: #f44336 (Vermelho)

## 🔄 Rotas da Aplicação

- `/` - Login
- `/register` - Registro de usuário
- `/home` - Dashboard principal
- `/activities` - Lista de atividades
- `/calendar` - Visualização em calendário
- `/activity-register` - Formulário de nova atividade

## 🌐 API Endpoints (JSON Server)

### Usuários
- `GET /users` - Listar usuários
- `POST /users` - Criar usuário

### Atividades
- `GET /activities` - Listar todas as atividades
- `GET /activities?userID={id}` - Atividades de um usuário
- `GET /activities?userID={id}&date={date}` - Atividades por data
- `POST /activities` - Criar atividade
- `PATCH /activities/{id}` - Atualizar atividade
- `DELETE /activities/{id}` - Excluir atividade

## 🧪 Dados de Teste

O arquivo `db.json` contém dados de exemplo com usuários e atividades para teste:

### Usuários de Teste
- **Email**: lauro@email, **Senha**: 1234
- **Email**: itallo@email, **Senha**: 1234
- **Email**: paulo@email, **Senha**: 1234

## 🚀 Deploy

### Build para Produção
```bash
npm run build
```

Os arquivos estarão na pasta `dist/`

### Configuração para Produção
- Altere a URL da API em `src/environments/environment.prod.ts`
- Configure um servidor real para substituir o JSON Server

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Autores

- **Itallo** - [itallume](https://github.com/itallume)

---

**Feito com ❤️ e Angular**
