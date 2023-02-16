import { Collection } from "mongodb";
import { MongoHelper } from "../helpers/mongo-helper";
import { AccountMongoRepository } from "./account-mongo-repository";

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

  describe("loadByEmail()", () => {
    it("should return an account on loadByEmail success", async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name: "name",
        email: "email@email.com",
        password: "password",
      });
      const account = await sut.loadByEmail("email@email.com");

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toEqual("name");
      expect(account.email).toEqual("email@email.com");
      expect(account.password).toEqual("password");
    });

    it("should return null if loadByEmail fails", async () => {
      const sut = makeSut();
      const account = await sut.loadByEmail("email@email.com");
      expect(account).toBeFalsy();
    });
  });

  describe("loadByToken()", () => {
    it("should return an account on loadByToken without role", async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name: "name",
        email: "email@email.com",
        password: "password",
        accessToken: "token",
      });
      const account = await sut.loadByToken("token");

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toEqual("name");
      expect(account.email).toEqual("email@email.com");
      expect(account.password).toEqual("password");
      expect(account.accessToken).toEqual("token");
    });

    it("should return an account on loadByToken with admin role", async () => {
      const role = "admin";
      const sut = makeSut();
      await accountCollection.insertOne({
        name: "name",
        email: "email@email.com",
        password: "password",
        accessToken: "token",
        role,
      });
      const account = await sut.loadByToken("token", role);

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toEqual("name");
      expect(account.email).toEqual("email@email.com");
      expect(account.password).toEqual("password");
      expect(account.accessToken).toEqual("token");
      expect(account.role).toEqual(role);
    });

    it("should return null on loadByToken with invalid role", async () => {
      const role = "admin";
      const sut = makeSut();
      await accountCollection.insertOne({
        name: "name",
        email: "email@email.com",
        password: "password",
        accessToken: "token",
      });
      const account = await sut.loadByToken("token", role);

      expect(account).toBeFalsy();
    });

    it("should return an account on loadByToken with if user is admin", async () => {
      const role = "admin";
      const sut = makeSut();
      await accountCollection.insertOne({
        name: "name",
        email: "email@email.com",
        password: "password",
        accessToken: "token",
        role,
      });
      const account = await sut.loadByToken("token");

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toEqual("name");
      expect(account.email).toEqual("email@email.com");
      expect(account.password).toEqual("password");
      expect(account.accessToken).toEqual("token");
      expect(account.role).toEqual(role);
    });

    it("should return null if loadByToken fails", async () => {
      const sut = makeSut();
      const account = await sut.loadByToken("token");
      expect(account).toBeFalsy();
    });
  });
});
