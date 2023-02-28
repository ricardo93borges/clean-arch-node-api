import { AddAccount } from "@/domain/usecases";
import {
  AddAccountRepository,
  Hasher,
  LoadAccountByEmailRepository,
} from "@/data/protocols";

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add(accountData: AddAccount.Params): Promise<AddAccount.Result> {
    const { name, email, password } = accountData;
    const account = await this.loadAccountByEmailRepository.loadByEmail(email);
    let newAccount = null;

    if (!account) {
      const hashedPassword = await this.hasher.hash(password);
      newAccount = await this.addAccountRepository.add({
        name,
        email,
        password: hashedPassword,
      });
    }

    return newAccount !== null;
  }
}
