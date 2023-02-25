import { Collection } from "mongodb";
import { MongoHelper } from "../helpers/mongo-helper";
import { SurveyMongoRepository } from "./survey-mongo-repository";
import { mockAccountParams, mockSurveyModels } from "@/domain/test";

let surveyCollection: Collection;
let surveyResultCollection: Collection;
let accountCollection: Collection;

const mockAccountId = async (): Promise<string> => {
  const res = await accountCollection.insertOne(mockAccountParams());
  return res.insertedId.toHexString();
};

describe("Survey Mongo Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection("surveys");
    await surveyCollection.deleteMany({});

    surveyResultCollection = await MongoHelper.getCollection("surveyResults");
    await surveyResultCollection.deleteMany({});

    accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  const makeSut = (): SurveyMongoRepository => {
    const sut = new SurveyMongoRepository();
    return sut;
  };

  describe("add()", () => {
    it("should add a survey on success", async () => {
      const sut = makeSut();

      await sut.add({
        question: "question",
        date: new Date(),
        answers: [{ image: "image", answer: "answer" }],
      });
      const survey = await surveyCollection.findOne({ question: "question" });

      expect(survey).toBeTruthy();
    });
  });

  describe("loadAll()", () => {
    it.skip("should loadAll surveys on success", async () => {
      const accountId = await mockAccountId();
      const surveyModels = mockSurveyModels();
      const answer = surveyModels[0].answers[0];
      const result = await surveyCollection.insertMany(surveyModels);

      const surveyId = result.insertedIds[0];

      await surveyResultCollection.insertOne({
        accountId,
        surveyId,
        answer,
        date: new Date(),
      });

      const sut = makeSut();

      const surveys = await sut.loadAll(accountId);

      expect(surveys.length).toBe(2);
      expect(surveys[0].didAnswer).toBe(true);
      expect(surveys[1].didAnswer).toBe(false);
    });

    it("should load empty list", async () => {
      const accountId = await mockAccountId();
      const sut = makeSut();

      const surveys = await sut.loadAll(accountId);

      expect(surveys.length).toBe(0);
    });
  });

  describe("loadById()", () => {
    it("should load survey by id on success", async () => {
      const res = await surveyCollection.insertOne({
        question: "question",
        date: new Date(),
        answers: [
          {
            image: "image",
            answer: "answer",
          },
        ],
      });
      const id = res.insertedId.toHexString();
      const sut = makeSut();

      const survey = await sut.loadById(id);

      expect(survey).toBeTruthy();
    });
  });
});
