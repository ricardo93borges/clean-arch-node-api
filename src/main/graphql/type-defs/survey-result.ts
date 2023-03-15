import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    surveyResult(surveyId: String!): SurveyResult! @auth
  }

  extend type Mutation {
    surveyResult(surveyId: String!, answer: String!): SurveyResult! @auth
  }

  type SurveyResult {
    surveyId: String!
    question: String!
    answers: [Answer!]!
    date: String!
  }

  type Answer {
    image: String
    answer: String!
    count: Int!
    percent: Int!
    IsCurrentAccountAnswer: Boolean!
  }
`;