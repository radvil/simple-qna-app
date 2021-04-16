import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { delay, shareReplay } from 'rxjs/operators';
import { IQuestion } from '../_models/question.interface';
import { IQuizResult } from '../_models/result.interface';

@Injectable({ providedIn: 'root' })
export class AnswerStore {
  private _quizResults = new BehaviorSubject<IQuizResult[]>([]);

  constructor() {}

  public quizResults$ = this._quizResults.asObservable();

  updateAnswer(question: IQuestion, answer: string) {
    const newState = [
      ...this._quizResults.value,
      {
        ...question,
        answer,
      },
    ];
    this._quizResults.next(newState);
    return of({ status: 200 }).pipe(shareReplay(), delay(1000)).subscribe();
  }
}
