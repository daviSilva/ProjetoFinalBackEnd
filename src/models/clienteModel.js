const pool = require('../config/db'); // ajuste o caminho conforme seu projeto

const ClienteModel = {

    // Criar novo cliente
    /**
     * this.função cria um novo cliente no banco de dados
     * @param {string} nome_completo 
     * @param {*} cpf 
     * @param {*} email 
     * @param {*} logradouro 
     * @param {*} numero 
     * @param {*} bairro 
     * @param {*} cidade 
     * @param {*} estado 
     * @param {*} cep 
     * @param {*} telefones 
     * @returns promise<object> objeto com os dados do cliente e dos telefones cadastrados
     * @example
     * entrada de dados via json
     * {
     *  "nome_completo": "João Silva",
     *  "cpf": "123.456.789-00",
     *  "logradouro": "logradouro",
     * "numero": "100",
     * "bairro": "Bairro Exemplo",
     * "cidade": "Cidade Exemplo",
     * "estado": "Estado Exemplo",
     * "cep": "12345-678",
     * "telefones": ["(11) 91234-5678", "(11) 99876-5432"]
     * }
     * chamada da função
     * // Output:
     * {
     *   cliente: { insertId: 1, affectedRows: 1, ... },
     *  telefones: [ { insertId: 1, affectedRows: 1, ... }, { insertId: 2, affectedRows: 1, ... } ]
     * }
     * saida no insomnia 
     * {
     *  "cliente": {
     *    "insertId": 1,
     *   "affectedRows": 1,
     *   ...
     * },
     * "telefones": [
     *   { "insertId": 1, "affectedRows": 1, ... },
     *  { "insertId": 2, "affectedRows": 1, ... }
     * ]
     */
    criarCliente: async (nome_completo, cpf, email, logradouro, numero, bairro, cidade, estado, cep, telefones = []) => {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // Inserir cliente
            const sqlCliente = `
                INSERT INTO clientes 
                (nome_completo, cpf, email, logradouro, numero, bairro, cidade, estado, cep)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const valuesCliente = [
                nome_completo,
                cpf,
                email,
                logradouro,
                numero,
                bairro,
                cidade,
                estado,
                cep
            ];

            const [rowsCliente] = await connection.query(sqlCliente, valuesCliente);
            const clienteId = rowsCliente.insertId;

            // Inserir telefones (um ou vários)
            const resultadosTelefones = [];

            if (telefones.length > 0) {
                const sqlTelefone = `
                    INSERT INTO telefones (id_cliente_fk, telefone)
                    VALUES (?, ?)
                `;

                for (const tel of telefones) {
                    const [rowsTel] = await connection.query(sqlTelefone, [clienteId, tel]);
                    resultadosTelefones.push(rowsTel);
                }
            }

            await connection.commit();

            return {
                cliente: rowsCliente,
                telefones: resultadosTelefones
            };

        } catch (error) {
            await connection.rollback();
            throw error;
        }
    },


    // Selecionar todos os clientes
    /**
     * 
     * @returns {Promise<Array>} retorna uma lista com todos os clientes encontrados
     * @example
     * chamada da função
     * const clientes = await clienteModel.selecionaTodosClientes();
 * 
 * // Output esperado:
 * [
 *   {
 *     "id": 1,
 *     "nome_completo": "João Silva",
 *     "cpf": "123.456.789-00",
 *     "email": "joao@email.com",
 *     "logradouro": "Rua Exemplo",
 *     "numero": "100",
 *     "bairro": "Centro",
 *     "cidade": "Cidade Exemplo",
 *     "estado": "SP",
 *     "cep": "12345-678"
 *   },
 *   {
 *     "id": 2,
 *     "nome_completo": "Maria Souza",
 *     "cpf": "987.654.321-00",
 *     ...
 *   }
 * ]
 * 
 * Exemplo de saída no Insomnia:
 * [
 *   {
 *     "id": 1,
 *     "nome_completo": "João Silva",
 *     "cpf": "123.456.789-00",
 *     "email": "joao@email.com",
 *     "logradouro": "Rua Exemplo",
 *     "numero": "100",
 *     "bairro": "Centro",
 *     "cidade": "Cidade Exemplo",
 *     "estado": "SP",
 *     "cep": "12345-678"
 *   }
 * ]
 */
     
    selecionaTodosClientes: async () => {
        const connection = await pool.getConnection();

        try {
            const sql = 'SELECT * FROM clientes';
            const [rows] = await connection.query(sql);
            return rows;

        } catch (error) {
            await connection.rollback();
            throw error;
        }
    },

    //Atualizar cliente 
    /**
     * @param {number} id_cliente ID do cliente que será atualizado
     * @param {object} dadosAtualizados objeto contendo apenas os campos que devem ser modificados
     * @returns {Promise<object>} retorna o resultado da operação de atualização
     * @example
     * * entrada de dados via JSON:
 * {
 *   "nome_completo": "João Silva Atualizado",
 *   "email": "joao.atualizado@email.com",
 *   "cidade": "Nova Cidade",
 *   "estado": "RJ"
 * }
 * 
 * chamada da função:
 * const resultado = await clienteModel.atualizarCliente(1, {
 *   nome_completo: "João Silva Atualizado",
 *   email: "joao.atualizado@email.com",
 *   cidade: "Nova Cidade",
 *   estado: "RJ"
 * });
 * 
 * // Output:
 * {
 *   "affectedRows": 1,
 *   "changedRows": 1,
 *   "message": "Cliente atualizado com sucesso!"
 * }
 * 
 * Exemplo de saída no Insomnia:
 * {
 *   "message": "Cliente atualizado com sucesso!",
 *   "resultado": {
 *     "affectedRows": 1,
 *     "changedRows": 1
 *   }
 * }
 */

    atualizaCliente: async (id_cliente, nome_completo, cpf, email, logradouro, numero, bairro, cidade, estado, cep) => {
        const connection = await pool.getConnection();

        try {
            const sql = `
                UPDATE clientes
                SET nome_completo = ?, cpf = ?, email = ?, logradouro = ?, numero = ?, bairro = ?, cidade = ?, estado = ?, cep = ?
                WHERE IDCliente = ?
            `;

            const values = [
                nome_completo,
                cpf,
                email,
                logradouro,
                numero,
                bairro,
                cidade,
                estado,
                cep,
                id_cliente
            ];

            const [rows] = await connection.query(sql, values);
            await connection.commit();
            return rows;

        } catch (error) {
            await connection.rollback();
            throw error;
            
        }   
    },

    selecionarClientePorCpf: async (cpf) => {
        const connection = await pool.getConnection();

        try {
            const sql = 'SELECT * FROM clientes WHERE cpf = ?';
            const [rows] = await connection.query(sql, [cpf]);
            return rows[0];

        } catch (error) {
            throw error;
        }
    },
    /**
    
     * Seleciona um cliente específico no banco de dados utilizando seu ID.
     *
     * @async
     * @param {number} id - ID do cliente que deseja consultar.
     * 
     * @returns {Promise<object|null>} Retorna um objeto contendo os dados do cliente,
     * ou `null` caso o ID informado não exista na base.
     * 
     * @throws Lança um erro caso ocorra alguma falha durante a execução da consulta SQL.
     * 
     * @example
     * // Chamada:
     * const cliente = await selecionarClientePorId(3);
     * 
     * // Possível retorno:
     * {
     *   IDCliente: 3,
     *   nome_completo: "Renan Miazzo",
     *   cpf: "12345678900",
     *   email: "renan.miazzo@email.com",
     *   cidade: "São Paulo"
     * }
     * 
     * // Caso não exista:
     * null
     */

    selecionerClientePorId: async (id) => {
        const connection = await pool.getConnection();
        try {
            const sql = 'SELECT * FROM clientes WHERE IDCliente = ?';
            const [rows] = await connection.query(sql, [id]);
            connection.commit();
            return rows[0];
        } catch (error) {
            connection.rollback();
            throw error;
        }
    },
 /**
     * Deleta um cliente do banco de dados com base no ID informado.
     *
     * @async
     * @param {number} id_cliente - ID do cliente que será removido da tabela 'clientes'.
     * 
     * @returns {Promise<object>} Retorna o resultado da operação SQL, incluindo informações
     * sobre quantas linhas foram afetadas.
     * 
     * @throws Lança um erro caso a operação SQL falhe.
     * 
     * @example
     * // Chamada da função no Model:
     * await deleteCliente(4);
     * 
     * // Retorno esperado:
     * {
     *   affectedRows: 1,
     *   warningStatus: 0
     * }
     */

    deleteCliente: async (id_cliente) => {
        const connection = await pool.getConnection();
        try {
            const sql = 'DELETE FROM clientes WHERE IDCliente = ?';
            const [rows] = await connection.query(sql, [id_cliente]);
            connection.commit();
            return rows;
        } catch (error) {
            console.log(error);
            connection.rollback();
            throw error;
        }
    }

};

module.exports = {ClienteModel};
