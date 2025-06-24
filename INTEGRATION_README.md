# Integração Frontend Angular com Backend Spring Boot

## Configuração realizada

### 1. Modelos e DTOs atualizados
- **User**: Atualizado para usar `id: string` (UUID) em vez de `number`
- **UserRequestDTO**: Para criação de usuários
- **UserResponseDTO**: Para respostas do servidor (com id como string/UUID)
- **UserLoginRequestDTO**: Para requisições de login

### 2. UserService atualizado
- URL base configurada para `http://localhost:8080/users`
- Métodos adaptados para as rotas do backend:
  - `POST /users/login` - Login
  - `POST /users/create` - Registro
  - `GET /users/{id}` - Buscar usuário por ID
  - `GET /users` - Listar usuários

### 3. Interceptor HTTP
- Criado interceptor para tratar erros globalmente
- Adiciona headers padrão (Content-Type e Accept)
- Traduz códigos de erro HTTP para mensagens amigáveis

### 4. Configuração de Environment
- Variável `apiUrl` configurada para `http://localhost:8080`

## Como testar

### 1. Inicie seu backend Spring Boot
```bash
# Certifique-se de que está rodando na porta 8080
mvn spring-boot:run
```

### 2. Configure CORS no seu backend
Adicione esta configuração no seu backend Spring Boot:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### 3. Inicie o frontend Angular
```bash
npm start
```

### 4. Teste as funcionalidades
- **Registro**: Acesse a página de registro e crie um usuário
- **Login**: Acesse a página de login com as credenciais criadas

## Estrutura dos dados

### Requisição de Registro (POST /users/create)
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
```

### Requisição de Login (POST /users/login)
```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

### Resposta do Backend (UserResponseDTO)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Silva",
  "email": "joao@email.com"
}
```

## Tratamento de Erros

O interceptor HTTP traduz os códigos de erro:
- **400**: Dados inválidos fornecidos
- **401**: Email ou senha incorretos
- **404**: Usuário não encontrado
- **409**: Email já está em uso
- **500**: Erro interno do servidor

## Observações

1. Certifique-se de que o backend está rodando na porta 8080
2. Configure o CORS no backend para permitir requisições do frontend
3. Os componentes de login e registro já foram atualizados para usar os novos métodos
4. A validação de usuário logado agora verifica se `id !== ''` em vez de `id !== 0`
5. O sistema está preparado para trabalhar com UUIDs como identificadores únicos
