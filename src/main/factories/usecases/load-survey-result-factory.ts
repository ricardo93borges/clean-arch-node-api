import { DbLoadSurveyResult } from "@/data/usecases";
import { LoadSurveyResult } from "@/domain/usecases/load-survey-result";
import { SurveyMongoRepository, SurveyResultMongoRepository } from "@/infra/db";

export const makeDbLoadSurveyResult = (): LoadSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository();
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbLoadSurveyResult(
    surveyResultMongoRepository,
    surveyMongoRepository
  );
};
