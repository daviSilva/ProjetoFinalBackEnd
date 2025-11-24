IF DB_ID(N'sistema_entregas') IS NULL
    CREATE DATABASE sistema_entregas;
GO
USE sistema_entregas;
GO

IF OBJECT_ID(N'dbo.Clientes', N'U') IS NULL
BEGIN
CREATE TABLE dbo.Clientes (
    IDCliente INT IDENTITY(1,1) PRIMARY KEY,

    nome_completo VARCHAR(150) NOT NULL,
    cpf CHAR(11) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,

    logradouro VARCHAR(150) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    bairro VARCHAR(80) NOT NULL,
    cidade VARCHAR(80) NOT NULL,
    estado CHAR(2) NOT NULL,
    cep CHAR(8) NOT NULL
);
END
GO

IF OBJECT_ID(N'dbo.Telefones', N'U') IS NULL
BEGIN
CREATE TABLE dbo.Telefones (
    IDTelefone INT IDENTITY(1,1) PRIMARY KEY,

    id_cliente_fk INT NOT NULL,
    telefone CHAR(12) NOT NULL,

    CONSTRAINT fk_telefones_clientes
        FOREIGN KEY (id_cliente_fk) REFERENCES dbo.Clientes(IDCliente)
        ON DELETE CASCADE
);
END
GO

IF OBJECT_ID(N'dbo.Pedidos', N'U') IS NULL
BEGIN
CREATE TABLE dbo.Pedidos (
    IDPedido INT IDENTITY(1,1) PRIMARY KEY,

    id_cliente_fk INT NOT NULL,
    data_pedido DATE NOT NULL,
    
    tipo_entrega VARCHAR(10) NOT NULL,  -- 'normal' ou 'urgente'

    distancia_km DECIMAL(10,2) NOT NULL,
    peso_kg DECIMAL(10,2) NOT NULL,

    valor_km DECIMAL(10,2) NOT NULL,
    valor_kg DECIMAL(10,2) NOT NULL,

    CONSTRAINT fk_pedidos_clientes
        FOREIGN KEY (id_cliente_fk) REFERENCES dbo.Clientes(IDCliente)
        ON DELETE CASCADE
);
END
GO


IF OBJECT_ID(N'dbo.Entregas', N'U') IS NULL
BEGIN
CREATE TABLE dbo.Entregas (
    IDEntrega INT IDENTITY(1,1) PRIMARY KEY,

    id_pedido_fk INT NOT NULL,

    valor_distancia DECIMAL(10,2) NOT NULL,
    valor_peso DECIMAL(10,2) NOT NULL,
    acrescimo DECIMAL(10,2) NOT NULL DEFAULT (0),
    desconto DECIMAL(10,2) NOT NULL DEFAULT (0),
    taxa_extra DECIMAL(10,2) NOT NULL DEFAULT (0),
    valor_final DECIMAL(10,2) NOT NULL,

    status_entrega VARCHAR(20) NOT NULL,  
    -- 'calculado', 'em_transito', 'entregue', 'cancelado'

    CONSTRAINT fk_entregas_pedidos
        FOREIGN KEY (id_pedido_fk) REFERENCES dbo.Pedidos(IDPedido)
        ON DELETE CASCADE
);
END
GO