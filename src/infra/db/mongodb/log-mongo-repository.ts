import { LogErrorRepository } from "@/data/protocols";
import { MongoHelper } from "./mongo-helper";

export class LogMongoRepository implements LogErrorRepository {
  async logError(stack: string): Promise<void> {
    const collection = await MongoHelper.getCollection("errors");
    await collection.insertOne({
      stack,
      date: new Date(),
    });
  }
}
