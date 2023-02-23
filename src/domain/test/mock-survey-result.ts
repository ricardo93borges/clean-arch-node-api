import { SurveyResultModel } from "@/domain/models/survey-result";
import { SaveSurveyResultParams } from "@/domain/usecases/save-survey-result";

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: "surveyId",
  question: "question",
  answers: [
    {
      answer: "answer",
      count: 1,
      percent: 1,
    },
    {
      answer: "answer_2",
      count: 10,
      percent: 80,
    },
  ],
  date: new Date(),
});

export const mockFakeSurveyResultParams = (): SaveSurveyResultParams => ({
  surveyId: "surveyId",
  accountId: "accountId",
  answer: "answer",
  date: new Date(),
});
