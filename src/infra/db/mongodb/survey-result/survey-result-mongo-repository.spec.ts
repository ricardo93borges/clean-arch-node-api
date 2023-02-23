import { Collection } from "mongodb";
import { MongoHelper } from "../helpers/mongo-helper";
import { SurveyResultMongoRepository } from "./survey-result-mongo-repository";
import { SurveyModel } from "@/domain/models/survey";
import { AccountModel } from "@/domain/models/account";

let surveyCollection: Collection;
let surveyResultCollection: Collection;
let accountCollection: Collection;

describe("Survey Result Mongo Repository", () => {
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

  const makeSurvey = async (): Promise<SurveyModel> => {
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

    const survey = await surveyCollection.findOne(res.insertedId);
    return { ...survey, id: survey._id.toHexString() } as any as SurveyModel;
  };

  const makeAccount = async (): Promise<AccountModel> => {
    const res = await accountCollection.insertOne({
      name: "name",
      email: "email@email.com",
      password: "password",
    });

    const account = await accountCollection.findOne(res.insertedId);
    return { ...account, id: account._id.toHexString() } as any as AccountModel;
  };

  const makeSut = (): SurveyResultMongoRepository => {
    const sut = new SurveyResultMongoRepository();
    return sut;
  };

  describe("save()", () => {
    it.skip("should add a survey result if it does not exist", async () => {
      const sut = makeSut();
      const account = await makeAccount();
      const survey = await makeSurvey();
      const answer = survey.answers[0].answer;

      await sut.save({
        answer,
        surveyId: survey.id,
        accountId: account.id,
        date: new Date(),
      });

      const surveyResult = await surveyResultCollection.findOne({
        surveyId: survey.id,
        accountId: account.id,
      });

      expect(surveyResult).toBeTruthy();
    });

    // TODO fix: it should not add a new survey result
    it.skip("should update survey result if it exist", async () => {
      const sut = makeSut();
      const account = await makeAccount();
      const survey = await makeSurvey();

      await surveyResultCollection.insertOne({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date(),
      });

      await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date(),
      });

      const surveyResult = await surveyResultCollection
        .find({
          surveyId: survey.id,
          accountId: account.id,
        })
        .toArray();

      expect(surveyResult).toBeTruthy();
      expect(surveyResult.length).toBe(1);
    });
  });
});
