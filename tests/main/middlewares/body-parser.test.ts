import request from "supertest";
import app from "@/main/config/app";

describe("Body parser middleware", () => {
  it("should parse body as json", async () => {
    app.post("/test", (req, res) => {
      res.send(req.body);
    });

    await request(app)
      .post("/test")
      .send({ name: "name" })
      .expect({ name: "name" });
  });
});
