import request from "supertest";
import app from "../app.js";

describe("Health API", () => {
  test("GET /api/health should return 200", async () => {
    const response = await request(app).get("/api/health");

    expect(response.statusCode).toBe(200);
  });
});
