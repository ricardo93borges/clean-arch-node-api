import request from "supertest";
import app from "../config/app";

describe("CORS middleware", () => {
  it("should enable CORS", async () => {
    app.post("/test", (req, res) => {
      res.send();
    });

    await request(app)
      .post("/test")
      .expect("access-control-allow-origin", "*")
      .expect("access-control-allow-methods", "*")
      .expect("access-control-allow-headers", "*");
  });
});
