import { SurveyResultModel } from "@/domain/models/survey-result";
import { SaveSurveyResultParams } from "@/domain/usecases/save-survey-result";

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: "surveyId",
  question: "question",
  answers: [
    {
      answer: "answer",
      count: 0,
      percent: 0,
      image: "image",
      //isCurrentAccountAnswer: false,
    },
    {
      answer: "answer_2",
      count: 0,
      percent: 0,
      image: "image",
      //isCurrentAccountAnswer: false,
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
