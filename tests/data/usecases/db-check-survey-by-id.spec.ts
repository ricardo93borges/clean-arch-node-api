import MockDate from "mockdate";
import { mockCheckSurveyByIdRepository } from "@/tests/data/mocks";
import { DbCheckSurveyById } from "@/data/usecases/";
import { CheckSurveyByIdRepository } from "@/data/protocols";

type SutTypes = {
  sut: DbCheckSurveyById;
  checkSurveyByIdRepositoryStub: CheckSurveyByIdRepository;
};

const makeSut = (): SutTypes => {
  const checkSurveyByIdRepositoryStub = mockCheckSurveyByIdRepository();
  const sut = new DbCheckSurveyById(checkSurveyByIdRepositoryStub);
  return { sut, checkSurveyByIdRepositoryStub };
};

describe("DbCheckSurveyById Usecase", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it("should call CheckSurveyByIdRepository", async () => {
    const { sut, checkSurveyByIdRepositoryStub } = makeSut();

    const loadByIdSpy = jest.spyOn(checkSurveyByIdRepositoryStub, "checkById");
    await sut.checkById("id");

    expect(loadByIdSpy).toHaveBeenCalledWith("id");
  });

  it("should return true on success", async () => {
    const { sut } = makeSut();
    const survey = await sut.checkById("id");
    expect(survey).toEqual(true);
  });

  it("should throw if CheckSurveyByIdRepository throws", async () => {
    const { sut, checkSurveyByIdRepositoryStub } = makeSut();

    jest
      .spyOn(checkSurveyByIdRepositoryStub, "checkById")
      .mockRejectedValueOnce(new Error());

    const promise = sut.checkById("id");

    expect(promise).rejects.toThrow();
  });
});
