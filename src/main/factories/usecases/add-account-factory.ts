import { DbAddAccount } from "@/data/usecases";
import { AddAccount } from "@/domain/usecases/add-account";
import { BcryptAdapter } from "@/infra/cryptography";
import { AccountMongoRepository } from "@/infra/db";

export const makeDbAddAccount = (): AddAccount => {
  const salt = 12;
  const hasher = new BcryptAdapter(salt);
  const addAccountRepository = new AccountMongoRepository();
  return new DbAddAccount(hasher, addAccountRepository, addAccountRepository);
};
