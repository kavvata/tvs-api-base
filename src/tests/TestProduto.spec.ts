const request = require("supertest");
import * as server from "../server";
import { app } from "../server"; // Certifique-se de que o caminho está correto
import { Request, Response } from "express";
import { Produto } from "../models/Produto";

describe("Teste da Rota incluirProduto", () => {
  let produtoId: number;

  it("Deve incluir um novo produto com sucesso", async () => {
    const novoProduto = {
      descricao: "novo Produto"
    };

    const response = await request(app).post("/incluirProduto").send(novoProduto);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.descricao).toBe(novoProduto.descricao);

    produtoId = response.body.id;
  });

  afterAll(async () => {
    if (produtoId) {
      await Produto.destroy({ where: { id: produtoId } });
    }
  });
});

describe("Teste da Rota GetProdutoById", () => {

  let produtoId: number;

  beforeAll(async () => {
    const produto = await Produto.create({ descricao: "Produto Teste" })
    produtoId = produto.id
  })

  it("Deve retornar o produto correto quando o id é valido", async () => {

    const response = await request(app).get(`/produtos/${produtoId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", produtoId);
  });

  it("Deve retornar um status 404 quando o Id do produto nao existe", async () => {
    produtoId = produtoId + 1

    const response = await request(app).get(`/produtos/${produtoId}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Produto não encontrado");
  });

  afterAll(async () => {
    if (produtoId) {
      await Produto.destroy({ where: { id: produtoId } });
    }
  });
});

describe("Teste da Rota listarProdutos", () => {
  it("Deve retornar uma lista de produtos", async () => {
    const response = await request(app).get("/produtos");

    expect(response.status).toBe(200);
    expect(response.body.produtos).toBeInstanceOf(Array);
  });

  it("Deve retornar a lista de produtos dentro de um tempo aceitavel", async () => {
    const start = Date.now();
    const response = await request(app).get("/produtos");
    const duration = Date.now() - start;

    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(100); // Verifica se a resposta é retornada em menos de 500ms
  });
});

describe("Teste da Rota excluirProduto", () => {
  beforeAll(async () => {
    await Produto.create({ id: 420, descricao: "Produto Teste" });
    // Adicione lógica para garantir que não há pedidos vinculados, se necessário
  });

  afterAll(async () => {
    // Limpa o banco de dados após os testes
    await Produto.destroy({ where: { id: 420 } });
  });

  it("Deve excluir um produto existente", async () => {
    const response = await request(app).delete("/excluirProduto/420");

    // Verifica se a resposta da API está correta
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Produto excluído com sucesso");

    const produtoExcluido = await Produto.findByPk(420);
    expect(produtoExcluido).toBeNull(); // Deve retornar null se o produto foi excluído
  });
});

describe("Teste da Rota atualizarProduto", () => {
  let produtoId: number;

  beforeAll(async () => {
    const produto = await Produto.create({ descricao: "Produto Teste" })
    produtoId = produto.id
  })

  it("Deve atualizar produto com sucesso", async () => {
    const produtoAtualizado = {
      descricao: "Produto teste Atualizado!"
    }

    const response = await request(app).put(`/atualizarProduto/${produtoId}`).send(produtoAtualizado)
    expect(response.status).toBe(200)
    expect(response.body.descricao).toBe(produtoAtualizado.descricao)
  })

  afterAll(async () => {
    if (produtoId) {
      await Produto.destroy({ where: { id: produtoId } });
    }
  });
});
