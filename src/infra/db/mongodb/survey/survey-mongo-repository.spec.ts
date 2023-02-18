import { Collection } from "mongodb";
import { MongoHelper } from "../helpers/mongo-helper";
import { SurveyMongoRepository } from "./survey-mongo-repository";
import { SurveyModel } from "@/domain/models/survey";

const makeFakeSurveys = (): SurveyModel[] => {
  return [
    {
      id: "id",
      question: "question",
      date: new Date(),
      answers: [
        {
          image: "image",
          answer: "answer",
        },
      ],
    },
  ];
};

let collection: Collection;
describe("Survey Mongo Repository", () => {
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
      const survey = await collection.findOne({ question: "question" });

      expect(survey).toBeTruthy();
    });
  });

  describe("loadAll()", () => {
    it("should loadAll surveys on success", async () => {
      await collection.insertMany(makeFakeSurveys());
      const sut = makeSut();

      const surveys = await sut.loadAll();

      expect(surveys.length).toBe(1);
    });

    it("should load empty list", async () => {
      const sut = makeSut();

      const surveys = await sut.loadAll();

      expect(surveys.length).toBe(0);
    });
  });

  describe("loadById()", () => {
    it.only("should load survey by id on success", async () => {
      const res = await collection.insertOne({
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
