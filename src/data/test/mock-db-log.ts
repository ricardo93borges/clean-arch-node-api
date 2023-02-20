import { LogErrorRepository } from "@/data/protocols/db/log-error-repository";

export const mockLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
      Promise.resolve();
    }
  }

  return new LogErrorRepositoryStub();
};
