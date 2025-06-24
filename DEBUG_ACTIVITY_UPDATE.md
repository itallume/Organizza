# Debug Guide - Activity Update Issues

## Problema Identificado
- Erro 404 na rota `POST /activities/update/{id}`
- Erro "Usuário não encontrado"

## Alterações Feitas para Debug

### 1. ActivityService (`activity.service.ts`)
- ✅ Adicionado import do `catchError`
- ✅ Melhorado método `atualizarComPost` com logs detalhados
- ✅ Validação de usuário logado antes da requisição
- ✅ Tratamento específico para erros 404, 400 e outros
- ✅ Incluído o `id` no body da requisição (pode ser necessário para alguns backends)

### 2. UserService (`user.service.ts`)
- ✅ Adicionado logs detalhados em `getCurrentUser()`
- ✅ Melhorado `loadUserFromStorage()` com debug
- ✅ Criado método `debugLocalStorage()` para troubleshooting

### 3. ActivityRegisterComponent (`activity-register.component.ts`)
- ✅ Melhorado tratamento de erros com mensagens específicas
- ✅ Adicionado logs detalhados para debug
- ✅ Chamada para `debugLocalStorage()` antes da requisição

## Passos para Debugging

### Passo 1: Verificar Console do Navegador
1. Abra o DevTools (F12)
2. Vá para a aba Console
3. Tente editar uma atividade
4. Procure por logs que começam com "=== DEBUG"

### Passo 2: Verificar se o Usuário está Logado
Procure pelos logs:
```
=== DEBUG LOCALSTORAGE ===
localStorage currentUser: {"id":"...","name":"...","email":"..."}
Current user object: User {...}
Is logged in: true
```

Se `Is logged in: false`, o problema é de autenticação.

### Passo 3: Verificar os Dados da Requisição
Procure pelos logs:
```
=== DEBUG ATUALIZAÇÃO ===
Activity ID: 59fd13ac-5db5-4f78-b499-3cd35c1c188c
User ID: uuid-do-usuario
URL completa: http://localhost:8080/activities/update/59fd13ac-5db5-4f78-b499-3cd35c1c188c
Activity JSON a ser enviado: {...}
```

### Passo 4: Verificar Resposta do Backend
Procure por logs de erro:
- `Status: 404` = Endpoint não encontrado
- `Status: 400` = Dados inválidos ou usuário não encontrado
- `Status: 500` = Erro interno do servidor

## Possíveis Causas e Soluções

### Causa 1: Usuário não está logado
**Sintoma:** `Is logged in: false`
**Solução:** Faça login novamente

### Causa 2: LocalStorage corrompido
**Sintoma:** Erro ao parsear JSON do localStorage
**Solução:** Execute `localStorage.clear()` no console e faça login novamente

### Causa 3: UUID do usuário inválido
**Sintoma:** Erro 400 "Usuário não encontrado"
**Solução:** Verificar se o UUID no localStorage é válido

### Causa 4: Backend não está respondendo
**Sintoma:** Erro de conexão ou timeout
**Solução:** Verificar se o backend está rodando em localhost:8080

### Causa 5: Endpoint não implementado corretamente
**Sintoma:** Erro 404 persistente
**Solução:** Verificar se o endpoint `POST /activities/update/{id}` está funcionando

## Testando o Backend Manualmente

Use o seguinte comando curl para testar o endpoint:

```bash
curl -X POST "http://localhost:8080/activities/update/UUID_DA_ATIVIDADE" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "UUID_DA_ATIVIDADE",
    "userID": "UUID_DO_USUARIO",
    "title": "Título Teste",
    "description": "Descrição Teste",
    "date": "2025-06-24",
    "hour": "10:00",
    "address": "Endereço Teste",
    "clientNumber": "123456789",
    "clientName": "Cliente Teste",
    "price": 100.0,
    "pricePayed": 0.0,
    "done": false,
    "paied": false
  }'
```

## Próximos Passos

1. Teste a aplicação e verifique os logs no console
2. Identifique qual é o erro específico (404, 400, usuário não logado, etc.)
3. Aplique a solução correspondente
4. Se o problema persistir, verifique se o backend está processando os dados corretamente

## Fallback Local

Se o backend não estiver funcionando, o sistema usará uma simulação local que:
- Atualiza a atividade no array local
- Simula uma resposta HTTP de sucesso
- Mantém a interface funcionando até o backend ser corrigido
