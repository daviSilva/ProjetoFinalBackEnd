<img width="852" height="621" alt="DIAGRAMA_ULTIMA_ATIVIDADE drawio" src="https://github.com/user-attachments/assets/f376276b-2ff5-43ef-9ae9-0f7ecd8a7462" />

# Sistema de Gerenciamento de Logística e Entregas

## Visão Geral

Sistema backend completo para gerenciamento de pedidos, clientes e entregas, desenvolvido com Node.js, Express e MySQL. O projeto implementa um modelo de negócio logístico com cálculo automático de valores de entrega baseado em distância, peso e tipo de entrega (normal ou urgente).

---

## Funcionalidades Principais

### Gestão de Clientes
- Criar, listar, atualizar e deletar clientes
- Vinculação de múltiplos telefones por cliente
- Validação de CPF duplicado
- Armazenamento de endereço completo com normalização

### Gestão de Pedidos
- Criar pedidos com cálculo automático de valores
- Cálculo inteligente baseado em:
  - Distância: R$ 10,00 por km
  - Peso: R$ 20,00 por kg
  - Acréscimo urgente: +30% para entregas urgentes
  - Taxa extra: +R$ 15,00 se peso > 50kg
  - Desconto: -10% se valor total > R$ 500,00
- Atualização de pedidos com recálculo automático

### Gestão de Entregas
- Criar entregas vinculadas a pedidos
- Atualizar status de entrega (pendente, em andamento, entregue)
- Cálculo automático de valores baseado no pedido
- Controle de acréscimos, descontos e taxas extras

### Gestão de Telefones
- Criar e atualizar números de telefone
- Vinculação direta com clientes
- Listagem de todos os telefones cadastrados

---

## Arquitetura do Projeto

```
PROJETOFINAL/
├── src/
│   ├── config/
│   │   └── db.js                    # Configuração do pool MySQL
│   ├── controllers/
│   │   ├── clienteController.js     # Lógica de clientes
│   │   ├── pedidoController.js      # Lógica de pedidos
│   │   ├── entregaController.js     # Lógica de entregas
│   │   └── telefoneController.js    # Lógica de telefones
│   ├── models/
│   │   ├── clienteModel.js          # Operações BD - Clientes
│   │   ├── pedidoModel.js           # Operações BD - Pedidos
│   │   ├── entregaModel.js          # Operações BD - Entregas
│   │   └── telefoneModel.js         # Operações BD - Telefones
│   ├── routes/
│   │   ├── routes.js                # Router principal
│   │   ├── clienteRoutes.js         # Rotas de clientes
│   │   ├── pedidoRoutes.js          # Rotas de pedidos
│   │   ├── entregaRoutes.js         # Rotas de entregas
│   │   └── telefoneRoutes.js        # Rotas de telefones
│   └── views/                       # Pasta para frontend (vazia)
├── docs/
│   ├── bd.sql                       # Script de criação do banco
│   ├── Insomnia_2025-12-01.yaml     # Coleção de requisições
│   └── Insomnia_2025-11-10.yaml     # Coleção alternativa
├── server.js                        # Servidor principal
├── package.json                     # Dependências
├── .gitignore                       # Arquivos ignorados
└── README.md                        # Este arquivo
```

---

## Modelo de Dados

### Tabela: clientes
| Campo | Tipo | Constraints |
|-------|------|-------------|
| IDCliente | INT | PRIMARY KEY, AUTO_INCREMENT |
| nome_completo | VARCHAR(150) | NOT NULL |
| cpf | CHAR(11) | NOT NULL, UNIQUE |
| email | VARCHAR(100) | NOT NULL |
| logradouro | VARCHAR(150) | NOT NULL |
| numero | VARCHAR(10) | NOT NULL |
| bairro | VARCHAR(80) | NOT NULL |
| cidade | VARCHAR(80) | NOT NULL |
| estado | CHAR(2) | NOT NULL |
| cep | CHAR(8) | NOT NULL |

### Tabela: pedidos
| Campo | Tipo | Constraints |
|-------|------|-------------|
| IDPedido | INT | PRIMARY KEY, AUTO_INCREMENT |
| id_cliente_fk | INT | FOREIGN KEY (clientes) |
| data_pedido | DATE | NOT NULL |
| tipo_entrega | VARCHAR(10) | NOT NULL ('normal' ou 'urgente') |
| distancia_km | DECIMAL(10,2) | NOT NULL |
| peso_kg | DECIMAL(10,2) | NOT NULL |
| valor_km | DECIMAL(10,2) | NOT NULL |
| valor_kg | DECIMAL(10,2) | NOT NULL |
| valor_total | DECIMAL(10,2) | NOT NULL |

### Tabela: entregas
| Campo | Tipo | Constraints |
|-------|------|-------------|
| IDEntrega | INT | PRIMARY KEY, AUTO_INCREMENT |
| id_pedido_fk | INT | FOREIGN KEY (pedidos) |
| valor_distancia | DECIMAL(10,2) | NOT NULL |
| valor_peso | DECIMAL(10,2) | NOT NULL |
| acrescimo | DECIMAL(10,2) | NOT NULL |
| desconto | DECIMAL(10,2) | NOT NULL |
| taxa_extra | DECIMAL(10,2) | NOT NULL |
| valor_final | DECIMAL(10,2) | NOT NULL |
| status_entrega | VARCHAR(20) | NOT NULL ('pendente', 'em andamento', 'entregue') |

### Tabela: telefones
| Campo | Tipo | Constraints |
|-------|------|-------------|
| IDTelefone | INT | PRIMARY KEY, AUTO_INCREMENT |
| id_cliente_fk | INT | FOREIGN KEY (clientes) |
| telefone | CHAR(12) | NOT NULL |

---

## Como Executar

### Pré-requisitos
- Node.js versão 14 ou superior
- MySQL versão 5.7 ou superior
- npm ou yarn

### Instalação

1. Extraia o projeto
```bash
cd PROJETOFINAL
```

2. Instale as dependências
```bash
npm install
```

3. Configure o banco de dados
   - Abra o MySQL
   - Execute o script em `docs/bd.sql`:
```sql
SOURCE docs/bd.sql
```

4. Configure a conexão no arquivo `src/config/db.js`:
```javascript
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'sistema_entregas',
  port: 3308,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

5. Inicie o servidor
```bash
npm start
```

O servidor estará rodando em `http://localhost:8081`

---

## Endpoints da API

### CLIENTES

#### GET /clientes
Retorna lista de todos os clientes.

**Resposta (200 OK):**
```json
[
  {
    "IDCliente": 1,
    "nome_completo": "João Silva",
    "cpf": "12345678900",
    "email": "joao@email.com",
    "logradouro": "Rua das Flores",
    "numero": "100",
    "bairro": "Centro",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01001000"
  }
]
```

#### POST /clientes
Cria novo cliente com telefones.

**Body (application/json):**
```json
{
  "nome_completo": "João Silva",
  "cpf": "12345678900",
  "email": "joao@email.com",
  "logradouro": "Rua das Flores",
  "numero": "100",
  "bairro": "Centro",
  "cidade": "São Paulo",
  "estado": "SP",
  "cep": "01001000",
  "telefones": ["11999999999", "11988888888"]
}
```

**Resposta (201 Created):**
```json
{
  "mensagem": "Cliente cadastrado com sucesso!",
  "id_cliente": 1,
  "telefones_cadastrados": 2
}
```

#### PUT /clientes/atualizacliente/:id
Atualiza dados do cliente.

**Body (application/json):**
```json
{
  "nome_completo": "Maria Silva",
  "cpf": "12345678900",
  "email": "maria@email.com",
  "logradouro": "Rua nova",
  "numero": "200",
  "bairro": "Bairro novo",
  "cidade": "Rio de Janeiro",
  "estado": "RJ",
  "cep": "20001000"
}
```

**Resposta (200 OK):**
```json
{
  "mensagem": "Cliente atualizado com sucesso!"
}
```

#### DELETE /clientes/deletarcliente/:id
Remove cliente e seus registros associados.

**Resposta (200 OK):**
```json
{
  "mensagem": "Cliente deletado com sucesso!"
}
```

---

### PEDIDOS

#### GET /pedidos
Retorna lista de todos os pedidos.

**Resposta (200 OK):**
```json
[
  {
    "IDPedido": 1,
    "id_cliente_fk": 1,
    "data_pedido": "2025-01-20",
    "tipo_entrega": "urgente",
    "distancia_km": 50,
    "peso_kg": 30,
    "valor_km": 500,
    "valor_kg": 600,
    "valor_total": 1287
  }
]
```

#### POST /pedidos
Cria novo pedido com cálculo automático de valores.

**Body (application/json):**
```json
{
  "id_cliente": 1,
  "data_pedido": "2025-01-20",
  "tipo_entrega": "urgente",
  "distancia_km": 50,
  "peso_kg": 30
}
```

**Resposta (201 Created):**
```json
{
  "mensagem": "Pedido cadastrado com sucesso!",
  "resultado": {
    "id_pedido": 1,
    "valor_total": 1287,
    "valor_km": 500,
    "valor_kg": 600
  }
}
```

#### PUT /pedidos?id_pedido=1
Atualiza pedido com recálculo de valores.

**Body (application/json):**
```json
{
  "tipo_entrega": "normal",
  "distancia_km": 40,
  "peso_kg": 25
}
```

**Resposta (200 OK):**
```json
{
  "mensagem": "Pedido atualizado com sucesso!"
}
```

---

### ENTREGAS

#### GET /entregas
Retorna lista de todas as entregas.

**Resposta (200 OK):**
```json
[
  {
    "IDEntrega": 1,
    "id_pedido_fk": 1,
    "valor_distancia": 500,
    "valor_peso": 600,
    "acrescimo": 330,
    "desconto": 143,
    "taxa_extra": 0,
    "valor_final": 1287,
    "status_entrega": "pendente"
  }
]
```

#### POST /entregas
Cria nova entrega baseada em pedido.

**Body (application/json):**
```json
{
  "id_pedido_fk": 1,
  "status_entrega": "pendente"
}
```

**Resposta (201 Created):**
```json
{
  "id_entrega": 1,
  "id_pedido_fk": 1,
  "valor_distancia": 500,
  "valor_peso": 600,
  "acrescimo": 330,
  "desconto": 143,
  "taxa_extra": 0,
  "valor_final": 1287,
  "status_entrega": "pendente"
}
```

#### PUT /entregas?id=1
Atualiza status da entrega.

**Body (application/json):**
```json
{
  "status_entrega": "em andamento"
}
```

**Resposta (200 OK):**
```json
{
  "mensagem": "Status atualizado com sucesso!"
}
```

#### DELETE /entregas?id=1
Remove entrega.

**Resposta (200 OK):**
```json
{
  "mensagem": "Entrega deletada com sucesso!"
}
```

---

### TELEFONES

#### GET /telefones
Retorna lista de todos os telefones.

**Resposta (200 OK):**
```json
[
  {
    "IDTelefone": 1,
    "id_cliente_fk": 1,
    "telefone": "11999999999"
  }
]
```

#### POST /telefones
Cria novo telefone para cliente.

**Body (application/json):**
```json
{
  "id_cliente_fk": 1,
  "numero_telefone": "11999999999"
}
```

**Resposta (201 Created):**
```json
{
  "mensagem": "Telefone cadastrado com sucesso!"
}
```

#### PUT /telefones?id=1
Atualiza número de telefone.

**Body (application/json):**
```json
{
  "numero_telefone": "11988888888"
}
```

**Resposta (200 OK):**
```json
{
  "mensagem": "Telefone atualizado com sucesso!"
}
```

---

## Cálculo de Valores - Exemplo Prático

### Cenário: Entrega Urgente

**Entrada:**
- Distância: 50 km
- Peso: 30 kg
- Tipo: Urgente

**Processamento:**
```
Valor distância: 50 km × R$ 10/km = R$ 500,00
Valor peso: 30 kg × R$ 20/kg = R$ 600,00
Subtotal: R$ 500,00 + R$ 600,00 = R$ 1.100,00

Acréscimo urgente (30%): R$ 1.100,00 × 0,30 = R$ 330,00
Valor antes desconto: R$ 1.100,00 + R$ 330,00 = R$ 1.430,00

Desconto (10%, pois > R$ 500,00): R$ 1.430,00 × 0,10 = R$ 143,00
Valor após desconto: R$ 1.430,00 - R$ 143,00 = R$ 1.287,00

Taxa extra (peso ≤ 50 kg): R$ 0,00

Valor Final: R$ 1.287,00
```

---

## Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
|-----------|--------|-----------|
| Node.js | 14+ | Runtime JavaScript |
| Express | 5.1.0+ | Framework web |
| MySQL2 | 3.15.3+ | Driver MySQL com suporte a Promises |
| MySQL | 5.7+ | Banco de dados relacional |

---

## Tratamento de Erros

A API retorna mensagens de erro estruturadas com códigos HTTP apropriados.

### Códigos HTTP
- **200 OK** - Requisição bem-sucedida
- **201 Created** - Recurso criado com sucesso
- **400 Bad Request** - Dados de entrada inválidos
- **404 Not Found** - Recurso não encontrado
- **409 Conflict** - Conflito de dados (ex: CPF duplicado)
- **500 Internal Server Error** - Erro do servidor

### Formato de Erro
```json
{
  "erro": "Descrição do erro",
  "detalhes": "Informações técnicas adicionais"
}
```

---

## Documentação de Requisições

Para testar todos os endpoints, use a coleção do Insomnia disponível em:
- `docs/Insomnia_2025-12-01.yaml` (versão atual)
- `docs/Insomnia_2025-11-10.yaml` (versão anterior)

### Importar no Insomnia:
1. Abra o Insomnia
2. Menu: Design > Import
3. Selecione o arquivo YAML
4. Os endpoints estarão disponíveis para uso

---

## Estrutura de Camadas

### Model Layer (Acesso a Dados)
- Operações CRUD no banco de dados
- Transações ACID garantidas com beginTransaction()
- Validações de regras de negócio
- Liberação de conexões em finally{}

### Controller Layer (Lógica de Negócio)
- Tratamento de requisições HTTP
- Validações de entrada
- Orquestração de chamadas ao Model
- Formatação de respostas JSON

### Routes Layer (Roteamento)
- Definição de endpoints RESTful
- Mapeamento de métodos HTTP
- Integração com Controllers

---

## Observações Importantes

- Transações ACID garantem integridade dos dados em operações complexas
- Pool de conexões MySQL limitado a 10 conexões simultâneas para otimizar recursos
- Todas as conexões são liberadas no bloco finally para evitar vazamento de memória
- Pasta `src/views` criada para integração futura de frontend
- Sistema foi desenvolvido com foco em backend; frontend pode ser integrado separadamente

---

## Scripts Disponíveis

```bash
# Iniciar servidor em http://localhost:8081
npm start
```

---

## Fluxo de Dados

```
Cliente (HTTP Request)
    ↓
Routes (Validação de rota)
    ↓
Controller (Validação de dados)
    ↓
Model (Operações BD + Transações)
    ↓
MySQL Database
    ↓
Model (Retorna resultado)
    ↓
Controller (Formata resposta)
    ↓
Routes (Status HTTP)
    ↓
Cliente (HTTP Response)
```

---

## Próximos Passos para Melhoria

- Implementar autenticação e autorização (JWT)
- Adicionar validação com middleware
- Implementar paginação para listagens
- Criar testes unitários e de integração
- Documentação com Swagger/OpenAPI
- Implementar frontend com React/Vue
- Cache com Redis
- Logging estruturado

---

**Desenvolvido para gerenciamento eficiente de logística e entregas**

**DCS e Miazzo**