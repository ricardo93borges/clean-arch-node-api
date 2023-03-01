import { AddAccount } from "@/domain/usecases";
import {
  AddAccountRepository,
  Hasher,
  CheckAccountByEmailRepository,
} from "@/data/protocols";

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository
  ) {}

  async add(accountData: AddAccount.Params): Promise<AddAccount.Result> {
    const { name, email, password } = accountData;
    const exists = await this.checkAccountByEmailRepository.checkByEmail(email);
    let isValid = false;

    if (!exists) {
      const hashedPassword = await this.hasher.hash(password);
      isValid = await this.addAccountRepository.add({
        name,
        email,
        password: hashedPassword,
      });
    }

    return isValid;
  }
}
