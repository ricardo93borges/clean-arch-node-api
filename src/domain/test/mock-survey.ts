import { SurveyModel } from "@/domain/models/survey";
import { AddSurveyParams } from "@/domain/usecases/add-survey";

export const mockSurveyModel = (): SurveyModel => ({
  id: "id",
  question: "question",
  date: new Date(),
  answers: [
    {
      image: "image",
      answer: "answer",
    },
  ],
});

export const mockAddSurveyParams = (): AddSurveyParams => ({
  question: "question",
  date: new Date(),
  answers: [{ image: "image", answer: "answer" }],
});

export const mockSurveyModels = (): SurveyModel[] => {
  return [mockSurveyModel(), mockSurveyModel()];
};
