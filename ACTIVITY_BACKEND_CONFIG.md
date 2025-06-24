# Configuração de Rotas para Activities no Backend Spring Boot

## ⚠️ SOLUÇÃO APLICADA NO FRONTEND
**O frontend foi configurado para usar POST em rota específica para atualização.**

## Problema identificado
O erro 404 (Not Found) indica que seu backend não possui a rota PATCH configurada para atualizar atividades.

## ✅ Solução Implementada: POST para Update
O frontend agora usa: `POST /activities/update/{id}` para atualizações.

## Rotas que você DEVE implementar no seu backend:

```java
@RestController
@RequestMapping("/activities")
public class ActivityController {

    @Autowired
    ActivityService activityService;

    // Rota para listar atividades por usuário e data (GET)
    @GetMapping
    public ResponseEntity<List<ActivityResponseDTO>> getActivitiesByUserAndDate(
            @RequestParam String userID, 
            @RequestParam String date) {
        // Implementar lógica
        return ResponseEntity.ok(activities);
    }

    // Rota para criar atividade (POST)
    @PostMapping
    public ResponseEntity<ActivityResponseDTO> createActivity(
            @RequestBody ActivityRequestDTO activityRequest) {
        // Implementar lógica de criação
        return ResponseEntity.status(HttpStatus.CREATED).body(createdActivity);
    }

    // ✅ PRIORITÁRIO: Rota para atualizar atividade (POST - IMPLEMENTAR ESTA PRIMEIRO!)
    @PostMapping("/update/{id}")
    public ResponseEntity<ActivityResponseDTO> updateActivityWithPost(
            @PathVariable String id, 
            @RequestBody ActivityRequestDTO activityRequest) {
        // Implementar lógica de atualização via POST
        Activity updatedActivity = activityService.updateActivity(id, activityRequest);
        return ResponseEntity.ok(new ActivityResponseDTO(updatedActivity));
    }

    // Rota para buscar atividade por ID (GET)
    @GetMapping("/{id}")
    public ResponseEntity<ActivityResponseDTO> getActivityById(@PathVariable String id) {
        // Implementar lógica
        return ResponseEntity.ok(activity);
    }

    // OPCIONAL: Usar PATCH para atualização (alternativa)
    @PatchMapping("/{id}")
    public ResponseEntity<ActivityResponseDTO> updateActivity(
            @PathVariable String id, 
            @RequestBody ActivityRequestDTO activityRequest) {
        // Implementar lógica de atualização
        return ResponseEntity.ok(updatedActivity);
    }

    // OPCIONAL: Usar PUT para atualização completa (alternativa)
    @PutMapping("/{id}")
    public ResponseEntity<ActivityResponseDTO> replaceActivity(
            @PathVariable String id, 
            @RequestBody ActivityRequestDTO activityRequest) {
        // Implementar lógica de substituição completa
        return ResponseEntity.ok(replacedActivity);
    }

    // Rota para deletar atividade (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActivity(@PathVariable String id) {
        // Implementar lógica de deleção
        return ResponseEntity.noContent().build();
    }
}
```

## DTOs necessários

```java
// ActivityRequestDTO.java
public class ActivityRequestDTO {
    private String userID;
    private String title;
    private String description;
    private String date; // formato: "YYYY-MM-DD"
    private String hour;
    private String address;
    private String clientNumber;
    private String clientName;
    private Double price;
    private Boolean pricePayed;
    private Boolean done;
    private Boolean paied;
    
    // construtores, getters e setters
}

// ActivityResponseDTO.java
public class ActivityResponseDTO {
    private String id;
    private String userID;
    private String title;
    private String description;
    private String date;
    private String hour;
    private String address;
    private String clientNumber;
    private String clientName;
    private Double price;
    private Boolean pricePayed;
    private Boolean done;
    private Boolean paied;
    
    // construtores, getters e setters
}
```

## Configuração CORS (se ainda não tiver)

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

## Teste das rotas

✅ **FRONTEND CONFIGURADO PARA:** `POST /activities/update/{id}`

Após implementar a rota POST no backend, o sistema deve funcionar corretamente.

## ⚠️ IMPORTANTE: Status Atual do Frontend

O frontend foi alterado para usar o método `atualizarComPost()` que faz:
- **POST** para `/activities/update/{id}` 
- Com os dados da atividade no body da requisição

**Você DEVE implementar esta rota no seu backend Spring Boot:**

```java
@PostMapping("/update/{id}")
public ResponseEntity<ActivityResponseDTO> updateActivityWithPost(
        @PathVariable String id, 
        @RequestBody ActivityRequestDTO activityRequest) {
    
    // Sua lógica de atualização aqui
    // Exemplo:
    Activity updatedActivity = activityService.updateActivity(id, activityRequest);
    
    return ResponseEntity.ok(new ActivityResponseDTO(
        updatedActivity.getId(),
        updatedActivity.getUserID(), 
        updatedActivity.getTitle(),
        updatedActivity.getDescription(),
        updatedActivity.getDate().toString(),
        updatedActivity.getHour(),
        updatedActivity.getAddress(),
        updatedActivity.getClientNumber(),
        updatedActivity.getClientName(),
        updatedActivity.getPrice(),
        updatedActivity.getPricePayed(),
        updatedActivity.getDone(),
        updatedActivity.getPaied()
    ));
}
```

## Como modificar o frontend se necessário

Se você escolher usar POST para update, modifique o componente:

```typescript
// No activity-register.component.ts, linha ~58
if (this.data && this.data.activity) {
  // Use o método alternativo
  this.activityService.atualizarComPost(this.activity).subscribe(() => {
    this.activityService.updateActivities();
    this.dialogRef.close(true);
  });
}
```
