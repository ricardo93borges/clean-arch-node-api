import { DbLoadSurveyById } from "@/data/usecases/db-load-survey-by-id";
import { LoadSurveyById } from "@/domain/usecases/load-survey-by-id";
import { SurveyMongoRepository } from "@/infra/db";

export const makeDbLoadSurveyById = (): LoadSurveyById => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbLoadSurveyById(surveyMongoRepository);
};
