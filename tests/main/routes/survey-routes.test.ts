import { Collection } from "mongodb";
import request from "supertest";
import { sign } from "jsonwebtoken";
import app from "@/main/config/app";
import env from "@/main/config/env";
import { MongoHelper } from "@/infra/db";

let surveyCollection: Collection;
let accountCollection: Collection;

const makeAccountWithToken = async (role: string) => {
  const email = "email@gmail.com";
  await accountCollection.insertOne({
    email,
    role,
    name: "name",
    password: "password",
  });

  const account = await accountCollection.findOne({ email });

  const id = account!._id.toHexString();
  const accessToken = sign({ id }, env.jwtSecret);

  await accountCollection.updateOne({ _id: id }, { $set: { accessToken } });

  return { id, accessToken };
};

describe("Survey Routes", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection("surveys");
    accountCollection = await MongoHelper.getCollection("accounts");
    await surveyCollection.deleteMany({});
    await accountCollection.deleteMany({});
  });

  describe("POST /surveys", () => {
    it("should return 403 on add survey without access token", async () => {
      await request(app)
        .post("/api/surveys")
        .send({
          question: "question",
          answers: [
            { image: "image", answer: "answer" },
            { answer: "answer_2" },
          ],
        })
        .expect(403);
    });

    it("should return 204 on add survey with access token", async () => {
      const { accessToken } = await makeAccountWithToken("admin");

      await request(app)
        .post("/api/surveys")
        .set("x-access-token", accessToken)
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

  describe("GET /surveys", () => {
    it("should return 403 on load survey without access token", async () => {
      await request(app).get("/api/surveys").expect(403);
    });

    it("should return 204 on load surveys with access token", async () => {
      const { accessToken } = await makeAccountWithToken("");

      await request(app)
        .get("/api/surveys")
        .set("x-access-token", accessToken)
        .expect(204);
    });
  });
});
