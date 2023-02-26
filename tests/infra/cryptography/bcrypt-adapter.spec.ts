import bcrypt from "bcrypt";
import { BcryptAdapter } from "../../../src/infra/criptography/bcrypt-adapter/bcrypt-adapter";

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return Promise.resolve("hash");
  },
  async compare(): Promise<boolean> {
    return Promise.resolve(true);
  },
}));

const salt = 12;
const makeSut = (): BcryptAdapter => {
  const sut = new BcryptAdapter(salt);
  return sut;
};

describe("Bcrypt Adapter", () => {
  describe("hash()", () => {
    it("should call hash with correct values", async () => {
      const sut = makeSut();
      const hashSpy = jest.spyOn(bcrypt, "hash");
      await sut.hash("value");
      expect(hashSpy).toHaveBeenCalledWith("value", salt);
    });

    it("should return a valid hash on success", async () => {
      const sut = makeSut();
      const hash = await sut.hash("value");
      expect(hash).toBe("hash");
    });

    it("should throw if hash throws", async () => {
      const sut = makeSut();
      //@ts-ignore
      jest.spyOn(bcrypt, "hash").mockRejectedValue(new Error("some error"));
      const promise = sut.hash("value");
      await expect(promise).rejects.toThrow();
    });
  });

  describe("compare()", () => {
    it("should call compare with correct values", async () => {
      const sut = makeSut();
      const compareSpy = jest.spyOn(bcrypt, "compare");
      await sut.compare("value", "hash");
      expect(compareSpy).toHaveBeenCalledWith("value", "hash");
    });

    it("should return true when compare succeeds", async () => {
      const sut = makeSut();
      const isEqual = await sut.compare("value", "hash");
      expect(isEqual).toBe(true);
    });

    it("should return false when compare fails", async () => {
      const sut = makeSut();
      jest
        .spyOn(bcrypt, "compare")
        .mockImplementation(() => Promise.resolve(false));
      const isEqual = await sut.compare("value", "hash");
      expect(isEqual).toBe(false);
    });

    it("should throw if compare throws", async () => {
      const sut = makeSut();
      //@ts-ignore
      jest.spyOn(bcrypt, "compare").mockRejectedValue(new Error("some error"));
      const promise = sut.compare("value", "hash");
      await expect(promise).rejects.toThrow();
    });
  });
});
