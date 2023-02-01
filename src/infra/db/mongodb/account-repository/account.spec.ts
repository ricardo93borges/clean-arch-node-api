import { MongoHelper } from "../helpers/mongo-helper";
import { AccountMongoRepository } from "./account";

describe("Account Mongo Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  const makeSut = (): AccountMongoRepository => {
    const sut = new AccountMongoRepository();
    return sut;
  };

  it("should return account on success", async () => {
    const sut = makeSut();
    const account = await sut.add({
      name: "name",
      email: "email",
      password: "password",
    });

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toEqual("name");
    expect(account.email).toEqual("email");
    expect(account.password).toEqual("password");
  });
});
