import { IQuestion } from "./question.interface";

export interface IQuizResult extends Omit<IQuestion, 'options'> {
  answer: string;
}