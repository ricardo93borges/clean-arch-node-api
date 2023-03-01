import { AddAccountRepository } from "@/data/protocols/db/account/add-account-repository";
import { LoadAccountByTokenRepository } from "@/data/protocols/db/account/load-account-by-token-repository";
import { UpdateAccessTokenRepository } from "@/data/protocols/db/account/update-access-token-repository";
import { AccountModel } from "@/domain/models/account";
import { mockAccountModel } from "@/tests/domain/mocks";
import {
  CheckAccountByEmailRepository,
  LoadAccountByEmailRepository,
} from "@/data/protocols";

export const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(
      accountData: AddAccountRepository.Params
    ): Promise<AddAccountRepository.Result> {
      return Promise.resolve(true);
    }
  }

  return new AddAccountRepositoryStub();
};

export const mockLoadAccountByEmailRepository =
  (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub
      implements LoadAccountByEmailRepositoryStub
    {
      async loadByEmail(email: string): Promise<AccountModel> {
        return Promise.resolve(mockAccountModel());
      }
    }
    return new LoadAccountByEmailRepositoryStub();
  };

export const mockCheckAccountByEmailRepository =
  (): CheckAccountByEmailRepository => {
    class CheckAccountByEmailRepositoryStub
      implements CheckAccountByEmailRepository
    {
      async checkByEmail(email: string): Promise<boolean> {
        return Promise.resolve(false);
      }
    }
    return new CheckAccountByEmailRepositoryStub();
  };

export const mockLoadAccountByTokenRepository =
  (): LoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositoryStub
      implements LoadAccountByTokenRepository
    {
      async loadByToken(
        token: string,
        role?: string
      ): Promise<LoadAccountByTokenRepository.Result> {
        return Promise.resolve(mockAccountModel());
      }
    }

    return new LoadAccountByTokenRepositoryStub();
  };

export const mockUpdateAccessTokenRepository =
  (): UpdateAccessTokenRepository => {
    class UpdateAccessTokenRepositoryStub
      implements UpdateAccessTokenRepository
    {
      async updateAccessToken(id: string, token: string): Promise<void> {
        return Promise.resolve();
      }
    }
    return new UpdateAccessTokenRepositoryStub();
  };
