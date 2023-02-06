import jwt from "jsonwebtoken";
import { JwtAdapter } from "./jwt-adapter";

jest.mock("jsonwebtoken", () => ({
  async sign(): Promise<string> {
    return Promise.resolve("token");
  },
}));

const mekeSut = (): JwtAdapter => {
  const sut = new JwtAdapter("secret");
  return sut;
};

describe("JWT Adapter", () => {
  it("should call sign with correct values", async () => {
    const sut = mekeSut();
    const signSpy = jest.spyOn(jwt, "sign");
    await sut.encrypt("id");
    expect(signSpy).toHaveBeenCalledWith({ id: "id" }, "secret");
  });

  it("should return a token on sign success", async () => {
    const sut = mekeSut();
    const token = await sut.encrypt("value");
    expect(token).toBe("token");
  });

  it("should throw if sign throws", async () => {
    const sut = mekeSut();
    jest.spyOn(jwt, "sign").mockImplementation(() => {
      throw new Error();
    });
    const promise = sut.encrypt("id");
    await expect(promise).rejects.toThrow();
  });
});
