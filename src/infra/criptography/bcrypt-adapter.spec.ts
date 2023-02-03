import bcrypt from "bcrypt";
import { BcryptAdapter } from "./bcrypt-adapter";

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve("hash"));
  },
}));

const salt = 12;
const makeSut = (): BcryptAdapter => {
  const sut = new BcryptAdapter(salt);
  return sut;
};

describe("Bcrypt Adapter", () => {
  it("should call bcrypt with correct values", async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await sut.hash("value");
    expect(hashSpy).toHaveBeenCalledWith("value", salt);
  });

  it("should return a hash on success", async () => {
    const sut = makeSut();
    const hash = await sut.hash("value");
    expect(hash).toBe("hash");
  });

  it("should throw if bcrypt throws", async () => {
    const sut = makeSut();
    //@ts-ignore
    jest.spyOn(bcrypt, "hash").mockRejectedValue(new Error("some error"));
    const promise = sut.hash("value");
    await expect(promise).rejects.toThrow();
  });
});
