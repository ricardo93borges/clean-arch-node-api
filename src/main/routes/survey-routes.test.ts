import request from "supertest";
import app from "../config/app";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import { Collection } from "mongodb";

let collection: Collection;

describe("Survey Routes", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    collection = await MongoHelper.getCollection("surveys");
    await collection.deleteMany({});
  });

  describe("POST /surveys", () => {
    it("should return 200 on add survey success", async () => {
      await request(app)
        .post("/api/surveys")
        .send({
          question: "question",
          answers: [
            { image: "image", answer: "answer" },
            { answer: "answer_2" },
          ],
        })
        .expect(204);
    });
  });
});
