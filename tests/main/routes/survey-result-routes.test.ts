import request from "supertest";
import { sign } from "jsonwebtoken";
import app from "@/main/config/app";
import { Collection } from "mongodb";
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

  describe("POST /surveys/:surveyId/results", () => {
    it("should return 403 on save survey result without access token", async () => {
      await request(app)
        .put("/api/surveys/1/results")
        .send({ answer: "answer" })
        .expect(403);
    });

    it.skip("should return 204 on save survey result with access token", async () => {
      const { accessToken } = await makeAccountWithToken("admin");

      const survey = await surveyCollection.insertOne({
        question: "question",
        date: new Date(),
        answers: [{ image: "image", answer: "answer" }],
      });

      const surveyId = survey.insertedId.toHexString();

      await request(app)
        .put(`/api/surveys/${surveyId}/results`)
        .set("x-access-token", accessToken)
        .send({ answer: "answer" })
        .expect(204);
    });
  });

  describe("GET /surveys/:surveyId/results", () => {
    it("should return 403 on load survey result without access token", async () => {
      await request(app).get("/api/surveys/1/results").expect(403);
    });

    it.skip("should return 200 on load survey result with access token", async () => {
      const { accessToken } = await makeAccountWithToken("admin");

      const survey = await surveyCollection.insertOne({
        question: "question",
        date: new Date(),
        answers: [{ image: "image", answer: "answer" }],
      });

      const surveyId = survey.insertedId.toHexString();

      await request(app)
        .get(`/api/surveys/${surveyId}/results`)
        .set("x-access-token", accessToken)
        .expect(200);
    });
  });
});
