import { MongoHelper as sut } from "@/infra/db/mongodb/index";

describe("Mongo Helper", () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await sut.disconnect();
  });

  it("should reconnect if mongodb is down", async () => {
    let accountCollection = await sut.getCollection("collection");
    expect(accountCollection).toBeTruthy();

    await sut.disconnect();
    accountCollection = await sut.getCollection("collection");
    expect(accountCollection).toBeTruthy();
  });
});
