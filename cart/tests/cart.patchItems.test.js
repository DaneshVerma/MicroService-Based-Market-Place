const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/app");

jest.mock("../src/models/cart.model.js", () => {
  function mockGenerateObjectId() {
    return Array.from({ length: 24 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
  }
  const carts = new Map();
  class CartMock {
    constructor({ user, items }) {
      this._id = mockGenerateObjectId();
      this.user = user;
      this.items = items || [];
    }
    static async findOne(query) {
      return carts.get(query.user) || null;
    }
    async save() {
      carts.set(this.user, this);
      return this;
    }
  }
  CartMock.__reset = () => carts.clear();
  return CartMock;
});

const CartModel = require("../src/models/cart.model.js");

function generateObjectId() {
  return Array.from({ length: 24 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
}
function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
}

const postEndpoint = "/api/cart/items";
const patchBase = "/api/cart/items";

describe("PATCH /api/cart/items/:productId", () => {
  const userId = generateObjectId();
  const existingProductId = generateObjectId();
  const otherProductId = generateObjectId();

  beforeEach(() => {
    CartModel.__reset();
  });

  test("updates quantity of existing item", async () => {
    const token = signToken({ _id: userId, role: "user" });
    // create cart + item
    await request(app)
      .post(postEndpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({ productId: existingProductId, qty: 2 });

    const res = await request(app)
      .patch(`${patchBase}/${existingProductId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ qty: 5 });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Item updated");
    expect(res.body.cart.items[0]).toMatchObject({
      productId: existingProductId,
      quantity: 5,
    });
  });

  test("404 when cart not found", async () => {
    const token = signToken({ _id: userId, role: "user" });
    const res = await request(app)
      .patch(`${patchBase}/${existingProductId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ qty: 3 });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Cart not found");
  });

  test("404 when item not in cart", async () => {
    const token = signToken({ _id: userId, role: "user" });
    await request(app)
      .post(postEndpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({ productId: existingProductId, qty: 1 });

    const res = await request(app)
      .patch(`${patchBase}/${otherProductId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ qty: 4 });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Item not found");
  });

  test("validation error invalid productId param", async () => {
    const token = signToken({ _id: userId, role: "user" });
    const res = await request(app)
      .patch(`${patchBase}/not-a-valid-id`)
      .set("Authorization", `Bearer ${token}`)
      .send({ qty: 2 });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  test("validation error invalid qty", async () => {
    const token = signToken({ _id: userId, role: "user" });
    await request(app)
      .post(postEndpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({ productId: existingProductId, qty: 1 });

    const res = await request(app)
      .patch(`${patchBase}/${existingProductId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ qty: 0 });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  test("401 when no token", async () => {
    const res = await request(app)
      .patch(`${patchBase}/${existingProductId}`)
      .send({ qty: 2 });
    expect(res.status).toBe(401);
  });

  test("403 when role not allowed", async () => {
    const token = signToken({ _id: userId, role: "admin" });
    const res = await request(app)
      .patch(`${patchBase}/${existingProductId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ qty: 2 });
    expect(res.status).toBe(403);
  });

  test("401 when token invalid", async () => {
    const res = await request(app)
      .patch(`${patchBase}/${existingProductId}`)
      .set("Authorization", "Bearer invalid.token.here")
      .send({ qty: 2 });
    expect(res.status).toBe(401);
  });
});
