import { SurveyResultModel } from "@/domain/models/survey-result";
import { SaveSurveyResultParams } from "@/domain/usecases/save-survey-result";

export const mockSurveyResultModel = (): SurveyResultModel => ({
  id: "id",
  surveyId: "surveyId",
  accountId: "accountId",
  answer: "answer",
  date: new Date(),
});

export const mockFakeSurveyResultParams = (): SaveSurveyResultParams => {
  const { id, ...rest } = mockSurveyResultModel();
  return rest;
};
