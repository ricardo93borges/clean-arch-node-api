import { DbLoadAnswersSurvey } from "@/data/usecases/db-load-answers-by-survey";
import { LoadAnswersBySurvey } from "@/domain/usecases/load-answers-by-survey";
import { SurveyMongoRepository } from "@/infra/db";

export const makeDbLoadAnswersBySurvey = (): LoadAnswersBySurvey => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbLoadAnswersSurvey(surveyMongoRepository);
};
