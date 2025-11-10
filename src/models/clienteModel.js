const pool = require('../config/db');

const clienteModel = {

    criarCliente: async () => {
        const sql = "INSERT INTO clientes (nomeCliente, cpfCliente, Telefone, endereco, email_cliente) VALUES (?, ?, ?, ?, ?)"
        const values = [nomeCliente, cpfCliente, Telefone, endereco, email_cliente]
        const rows = await pool.query(sql, values);
        return rows;
    },

    alterarCliente: async () => {
        const sql = "UPDATE clientes SET nomeCliente=?, cpfCliente=?, Telefone=?, endereco=?, email_cliente=? WHERE IDcliente=?"
        const values = [nomeCliente, cpfCliente, Telefone, endereco, email_cliente]
        const rows = await pool.query(sql, values)
        return rows;
    },

    deletaCliente : async () => {
        const sql = "DELETE FROM clientes WHERE IDcliente=?"
        const values = [IDcliente];
        const rows = await pool.query(sql, values);
        return rows;
    },

    selecionaTodosClientes :async () => {
        const sql = 'SELECT * FROM clientes';
        const [rows] = await pool.query(sql);
        return rows;

    },
    
     SelectionaClientePorId: async (id) => {
        const sql = 'SELECT * FROM clientes WHERE id_cliente = ?';
        const values = [id];
        const [rows] = await pool.query(sql, values);
        return rows[0];
    },
}
module.exports = {clienteModel}