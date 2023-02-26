import { LoadAccountByToken } from "@/domain/usecases";
import { Decrypter, LoadAccountByTokenRepository } from "@/data/protocols";
import { AccountModel } from "@/domain/models/account";

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load(accessToken: string, role?: string): Promise<AccountModel> {
    let token: string;

    try {
      token = await this.decrypter.decrypt(accessToken);
    } catch (err) {
      return null;
    }

    if (token) {
      const account = await this.loadAccountByTokenRepository.loadByToken(
        accessToken,
        role
      );
      if (account) {
        return account;
      }
    }

    return null;
  }
}
