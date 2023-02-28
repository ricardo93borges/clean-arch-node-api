import { AddAccount } from "@/domain/usecases/add-account";
import { LoadAccountByToken } from "@/domain/usecases/load-account-by-token";
import { AccountModel } from "@/domain/models/account";
import { Authentication } from "@/domain/usecases/authentication";
import { mockAccountModel } from "@/tests/domain/mocks";

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccount.Params): Promise<AddAccount.Result> {
      return new Promise((resolve) => resolve(true));
    }
  }
  return new AddAccountStub();
};

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    auth(
      authentication: Authentication.Params
    ): Promise<Authentication.Result> {
      return Promise.resolve({ accessToken: "token", name: "any_name" });
    }
  }
  return new AuthenticationStub();
};

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(accessToken: string, role?: string): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel());
    }
  }

  return new LoadAccountByTokenStub();
};
