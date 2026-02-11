process.env.NODE_ENV = "test";

const chai = require("chai");
const request = require("supertest");
const app = require("../src/app");
const redis = require("../src/config/redis");

const {
  connectTestDB,
  closeTestDB,
} = require("./setup");

const expect = chai.expect;

describe("User APIs", function () {
  let userId;

  // ✅ DB Setup
  before(async function () {
    await connectTestDB();
  });

  // ✅ DB Cleanup
  after(async function () {
    await closeTestDB();
    if (redis.quit) {
    await redis.quit();
  }
  });

  // CREATE USER
  it("should create a user", async () => {
    const res = await request(app)
      .post("/api/users")
      .set("Idempotency-Key", "test-key-1")
      .send({
        name: "Test User",
        email: "test@test.com",
      });

    expect(res.status).to.equal(201);
    userId = res.body.data._id;
  });

  // GET ALL
  it("should get all users", async () => {
    const res = await request(app).get(
      "/api/users"
    );

    expect(res.status).to.equal(200);
  });

  // GET BY ID
  it("should get user by id", async () => {
    const res = await request(app).get(
      `/api/users/${userId}`
    );

    expect(res.status).to.equal(200);
  });
});
