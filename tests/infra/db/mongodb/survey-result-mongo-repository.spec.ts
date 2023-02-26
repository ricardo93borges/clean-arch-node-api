import { Collection, ObjectId } from "mongodb";
import { SurveyModel } from "@/domain/models/survey";
import { AccountModel } from "@/domain/models/account";
import { mockAccountParams, mockAddSurveyParams } from "@/tests/domain/mocks";
import { MongoHelper, SurveyResultMongoRepository } from "@/infra/db/mongodb";

let surveyCollection: Collection;
let surveyResultCollection: Collection;
let accountCollection: Collection;

const mockSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne(mockAddSurveyParams());
  const survey = await surveyCollection.findOne({ _id: res.insertedId });
  return MongoHelper.map(survey);
};

const mockAccountId = async (): Promise<string> => {
  const res = await accountCollection.insertOne(mockAccountParams());
  return res.insertedId.toHexString();
};

describe("SurveyResultMongoRepository", () => {
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

  describe("loadBySurveyId()", () => {
    test.skip("Should load survey result", async () => {
      const survey = await mockSurvey();
      const accountId = await mockAccountId();
      const accountId2 = await mockAccountId();
      await surveyResultCollection.insertMany([
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId2),
          answer: survey.answers[0].answer,
          date: new Date(),
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId),
          answer: survey.answers[0].answer,
          date: new Date(),
        },
      ]);
      const sut = makeSut();
      const surveyResult = await sut.loadBySurveyId(survey.id, accountId);
      expect(surveyResult).toBeTruthy();
      expect(surveyResult.surveyId).toEqual(survey.id);
      expect(surveyResult.answers[0].count).toBe(2);
      expect(surveyResult.answers[0].percent).toBe(100);
      // expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(true);
      expect(surveyResult.answers[1].count).toBe(0);
      expect(surveyResult.answers[1].percent).toBe(0);
      // expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false);
      expect(surveyResult.answers.length).toBe(survey.answers.length);
    });

    test.skip("Should load survey result 2", async () => {
      const survey = await mockSurvey();
      const accountId = await mockAccountId();
      const accountId2 = await mockAccountId();
      const accountId3 = await mockAccountId();
      await surveyResultCollection.insertMany([
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId),
          answer: survey.answers[0].answer,
          date: new Date(),
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId2),
          answer: survey.answers[1].answer,
          date: new Date(),
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId3),
          answer: survey.answers[1].answer,
          date: new Date(),
        },
      ]);
      const sut = makeSut();
      const surveyResult = await sut.loadBySurveyId(survey.id, accountId2);
      expect(surveyResult).toBeTruthy();
      expect(surveyResult.surveyId).toEqual(survey.id);
      expect(surveyResult.answers[0].count).toBe(2);
      expect(surveyResult.answers[0].percent).toBe(67);
      // expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(true);
      expect(surveyResult.answers[1].count).toBe(1);
      expect(surveyResult.answers[1].percent).toBe(33);
      // expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false);
      expect(surveyResult.answers.length).toBe(survey.answers.length);
    });

    test.skip("Should load survey result 3", async () => {
      const survey = await mockSurvey();
      const accountId = await mockAccountId();
      const accountId2 = await mockAccountId();
      const accountId3 = await mockAccountId();
      await surveyResultCollection.insertMany([
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId),
          answer: survey.answers[0].answer,
          date: new Date(),
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId2),
          answer: survey.answers[1].answer,
          date: new Date(),
        },
      ]);
      const sut = makeSut();
      const surveyResult = await sut.loadBySurveyId(survey.id, accountId3);
      expect(surveyResult).toBeTruthy();
      expect(surveyResult.surveyId).toEqual(survey.id);
      expect(surveyResult.answers[0].count).toBe(1);
      expect(surveyResult.answers[0].percent).toBe(50);
      // expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(false);
      expect(surveyResult.answers[1].count).toBe(1);
      expect(surveyResult.answers[1].percent).toBe(50);
      // expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false);
      expect(surveyResult.answers.length).toBe(survey.answers.length);
    });

    test("Should return null if there is no survey result", async () => {
      const survey = await mockSurvey();
      const accountId = await mockAccountId();
      const sut = makeSut();
      const surveyResult = await sut.loadBySurveyId(survey.id, accountId);
      expect(surveyResult).toBeNull();
    });
  });
});
