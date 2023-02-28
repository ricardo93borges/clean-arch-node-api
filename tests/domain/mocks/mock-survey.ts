import { SurveyModel } from "@/domain/models/survey";
import { AddSurvey } from "@/domain/usecases/add-survey";

export const mockSurveyModel = (): SurveyModel => ({
  id: "surveyId",
  question: "question",
  date: new Date(),
  answers: [
    {
      image: "image",
      answer: "answer",
    },
    {
      image: "image",
      answer: "answer_2",
    },
  ],
});

export const mockAddSurveyParams = (): AddSurvey.Params => ({
  question: "question",
  date: new Date(),
  answers: [{ image: "image", answer: "answer" }],
});

export const mockSurveyModels = (): SurveyModel[] => {
  return [mockSurveyModel(), mockSurveyModel()];
};
