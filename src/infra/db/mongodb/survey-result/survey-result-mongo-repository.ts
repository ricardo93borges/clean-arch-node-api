import { ObjectId } from "mongodb";
import { MongoHelper } from "../helpers/mongo-helper";
import {
  SaveSurveyResultModel,
  SaveSurveyResultRepository,
  SurveyResultModel,
} from "@/data/usecases/save-survey-result/db-save-survey-result-protocols";

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection(
      "surveyResults"
    );

    const surveyResult = await surveyResultCollection.findOne({
      surveyId: new ObjectId(data.surveyId),
      accountId: new ObjectId(data.accountId),
    });

    if (surveyResult) {
      await surveyResultCollection.findOneAndUpdate(
        {
          surveyId: new ObjectId(data.surveyId),
          accountId: new ObjectId(data.accountId),
        },
        {
          $set: {
            answer: data.answer,
            date: data.date,
          },
        }
      );
    } else {
      await surveyResultCollection.insertOne({
        surveyId: new ObjectId(data.surveyId),
        accountId: new ObjectId(data.accountId),
        answer: data.answer,
        date: data.date,
      });
    }

    const survey = await surveyResultCollection.findOne({
      surveyId: new ObjectId(data.surveyId),
      accountId: new ObjectId(data.accountId),
    });

    return survey && MongoHelper.map(survey);
  }
}
