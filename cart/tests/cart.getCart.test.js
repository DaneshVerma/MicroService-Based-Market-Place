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
  CartMock.__seed = (user, data) => {
    carts.set(user, data);
  };
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

const getEndpoint = "/api/cart";
const postEndpoint = "/api/cart/items";

describe("GET /api/cart", () => {
  const userId = generateObjectId();
  const productIdA = generateObjectId();
  const productIdB = generateObjectId();

  beforeEach(() => {
    CartModel.__reset();
  });

  test("returns cart with items and basic totals", async () => {
    const token = signToken({ _id: userId, role: "user" });
    // Seed via existing POST endpoint (ensures consistency with add logic)
    await request(app)
      .post(postEndpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({ productId: productIdA, qty: 2 });
    await request(app)
      .post(postEndpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({ productId: productIdB, qty: 3 });

    const res = await request(app)
      .get(getEndpoint)
      .set("Authorization", `Bearer ${token}`);

    // Expected shape once implemented:
    // status 200, body: { cart: { items: [...] }, totals: { itemCount, totalQuantity } }
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.cart.items)).toBe(true);
    expect(res.body.cart.items).toHaveLength(2);
    expect(res.body.totals).toMatchObject({ itemCount: 2, totalQuantity: 5 });
  });

  test("returns empty cart structure when none exists", async () => {
    const token = signToken({ _id: userId, role: "user" });
    const res = await request(app)
      .get(getEndpoint)
      .set("Authorization", `Bearer ${token}`);
    // Expectation once implemented:
    expect(res.status).toBe(200);
    expect(res.body.cart.items).toHaveLength(0);
    expect(res.body.totals).toMatchObject({ itemCount: 0, totalQuantity: 0 });
  });

  test("401 when no token", async () => {
    const res = await request(app).get(getEndpoint);
    expect(res.status).toBe(401);
  });

  test("403 when role not allowed", async () => {
    const token = signToken({ _id: userId, role: "admin" });
    const res = await request(app)
      .get(getEndpoint)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  test("401 when token invalid", async () => {
    const res = await request(app)
      .get(getEndpoint)
      .set("Authorization", "Bearer invalid.token.here");
    expect(res.status).toBe(401);
  });
});
