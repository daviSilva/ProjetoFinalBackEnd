const pool = require ('../config/db')

const pedidosModel  = {

    criarPedido: async ({dataPedido, entrega, distancia, peso_carga, valor_km, valor_por_kg }) => {
        const sql = "INSERT INTO clientes (dataPedido, entrega, distancia, peso, valor_km, valor_por_kg ) VALUES (?, ?, ?, ?, ?)"
        const values = [dataPedido, entrega, distancia, peso, valor_km, valor_por_kg ]
        const rows = await pool.query(sql, values);
        return rows;
    },

   buscarTodosPedidos: async ({dataPedido, entrega, distancia, peso_carga, valor_km, valor_por_kg }) => {
    const sql = "SELECT FROM pedidos (dataPedido, entrega, distancia, peso_carga, valor_km, valor_por_kg)";
    const [result] = await pool.query(sql, [idPedido]);
    return rows;

   },

   excluirPedido: async ({dataPedido, entrega, distancia, peso_carga, valor_km, valor_por_kg }) => {
     const [result] = await pool.query(sql, [idPedido]);
     return result;

   },


}
    module.exports = { pedidosModel}