import {
    cambiarEstadoPedido,
    crearPedido,
    obtenerPedidos
} from "./firestoreService";

export { cambiarEstadoPedido, crearPedido, obtenerPedidos };

export function obtenerPedidosDeUsuario(usuarioId) {
    return obtenerPedidos(usuarioId, false);
}

export async function obtenerPedido(id) {
    const pedidos = await obtenerPedidos();
    return pedidos.find((pedido) => pedido.id === id) || null;
}
