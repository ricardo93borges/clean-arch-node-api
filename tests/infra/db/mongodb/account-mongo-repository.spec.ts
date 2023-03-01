import { Collection } from "mongodb";
import { mockAccountParams } from "@/tests/domain/mocks";
import { AccountMongoRepository, MongoHelper } from "@/infra/db/mongodb";

let accountCollection: Collection;
describe("Account Mongo Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  const makeSut = (): AccountMongoRepository => {
    const sut = new AccountMongoRepository();
    return sut;
  };

  describe("add()", () => {
    it("should return account on success", async () => {
      const sut = makeSut();
      const account = await sut.add(mockAccountParams());

      expect(account).toBeTruthy();
    });
  });

  describe("loadByEmail()", () => {
    it("should return an account on loadByEmail success", async () => {
      const sut = makeSut();
      await accountCollection.insertOne(mockAccountParams());
      const account = await sut.loadByEmail("any_email@email.com");

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
    });

    it("should return null if loadByEmail fails", async () => {
      const sut = makeSut();
      const account = await sut.loadByEmail("email@email.com");
      expect(account).toBeFalsy();
    });
  });

  describe("checkByEmail()", () => {
    it("should return true if checkByEmail returns true", async () => {
      const sut = makeSut();
      await accountCollection.insertOne(mockAccountParams());
      const exists = await sut.checkByEmail("any_email@email.com");

      expect(exists).toBe(true);
    });

    it("should return false if checkByEmail returns false", async () => {
      const sut = makeSut();

      const exists = await sut.checkByEmail("any_email@email.com");

      expect(exists).toBe(false);
    });
  });

  describe("loadByToken()", () => {
    it("should return an account on loadByToken without role", async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        ...mockAccountParams(),
        accessToken: "token",
      });
      const account = await sut.loadByToken("token");

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
    });

    it("should return an account on loadByToken with admin role", async () => {
      const role = "admin";
      const sut = makeSut();
      await accountCollection.insertOne({
        ...mockAccountParams(),
        accessToken: "token",
        role,
      });
      const account = await sut.loadByToken("token", role);

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      // expect(account.role).toEqual(role);
    });

    it("should return null on loadByToken with invalid role", async () => {
      const role = "admin";
      const sut = makeSut();
      await accountCollection.insertOne({
        ...mockAccountParams(),
        accessToken: "token",
      });
      const account = await sut.loadByToken("token", role);

      expect(account).toBeFalsy();
    });

    it("should return an account on loadByToken with if user is admin", async () => {
      const role = "admin";
      const sut = makeSut();
      await accountCollection.insertOne({
        ...mockAccountParams(),
        accessToken: "token",
        role,
      });
      const account = await sut.loadByToken("token");

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      // expect(account.role).toEqual(role);
    });

    it("should return null if loadByToken fails", async () => {
      const sut = makeSut();
      const account = await sut.loadByToken("token");
      expect(account).toBeFalsy();
    });
  });
});
