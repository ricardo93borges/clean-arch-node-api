import { AddAccount, AddAccountParams } from "@/domain/usecases";
import {
  AddAccountRepository,
  Hasher,
  LoadAccountByEmailRepository,
} from "@/data/protocols";
import { AccountModel } from "@/domain/models/account";

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add(accountData: AddAccountParams): Promise<AccountModel> {
    const { name, email, password } = accountData;
    const account = await this.loadAccountByEmailRepository.loadByEmail(email);
    if (!account) {
      const hashedPassword = await this.hasher.hash(password);
      const newAccount = await this.addAccountRepository.add({
        name,
        email,
        password: hashedPassword,
      });
      return newAccount;
    }
    return null;
  }
}
