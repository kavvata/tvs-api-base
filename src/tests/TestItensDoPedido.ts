const request = require("supertest");
import { Cliente } from "../models/Cliente";
import { ItemDoPedido } from "../models/ItemDoPedido";
import { Pedido } from "../models/Pedido";
import { Produto } from "../models/Produto";
import * as server from "../server";
import { app } from "../server"; // Certifique-se de que o caminho está correto
import { Request, Response } from "express";

describe("Teste Rota incluirItemDoPedido", () => {
  const cliente = {
    nome: "Cliente",
    sobrenome: "Cliente",
    cpf: "1111111111",
    id: 1
  }
  const produto = {
    descricao: "Produto",
    id: 2
  }

  const pedido = {
    data: "2024-01-01",
    id_cliente: 0,
    id: 3
  }

  const itemDoPedido = {
    id_pedido: pedido.id,
    id_produto: produto.id,
    id: 4
  }

  beforeEach(async () => {
    Cliente.create(cliente)
    Produto.create(produto)
    Pedido.create(pedido)
    ItemDoPedido.create(itemDoPedido)
  })

  afterEach(async () => {
    await Cliente.destroy({ where: { id: [cliente.id] } });
    await Produto.destroy({ where: { id: [produto.id] } });
    await Pedido.destroy({ where: { id: [pedido.id] } });
  })

  let itemDoPedidoId: number

  it("Deve possuir informações do cliente, pedido e produto", async () => {
    const response = await request(app).get(`/ItensDoPedido/${itemDoPedidoId}`)

    expect(response.status).toBe(201)
  })

});

describe("Teste da Rota excluirCliente", () => {


});

describe("Teste da Rota atualizarCliente", () => {

});
