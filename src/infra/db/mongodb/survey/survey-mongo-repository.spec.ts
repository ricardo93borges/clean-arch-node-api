import { Collection } from "mongodb";
import { MongoHelper } from "../helpers/mongo-helper";
import { SurveyMongoRepository } from "./survey-mongo-repository";

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
