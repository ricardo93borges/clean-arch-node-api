import { Hasher } from "@/data/protocols/cryptography/hasher";
import { Decrypter } from "@/data/protocols/cryptography/decrypter";
import { HashComparer } from "@/data/protocols/cryptography/hash-comparer";
import { Encrypter } from "@/data/protocols/cryptography/encrypter";

export const mockHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return Promise.resolve("hashed_password");
    }
  }

  return new HasherStub();
};

export const mockDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt(value: string): Promise<string> {
      return Promise.resolve("value");
    }
  }

  return new DecrypterStub();
};

export const mockHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return Promise.resolve(true);
    }
  }
  return new HashComparerStub();
};

export const mockEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(id: string): Promise<string> {
      return Promise.resolve("token");
    }
  }
  return new EncrypterStub();
};
