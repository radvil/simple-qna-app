import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { IQuestion } from '../_models/question.interface';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private readonly _questions = new BehaviorSubject<IQuestion[]>([]);
  private readonly _selectedId = new BehaviorSubject<string>('');
  private readonly _isLoading = new BehaviorSubject<boolean>(false);
  private readonly _error = new BehaviorSubject<any>(null);

  /**
   *
   * Question Store selectors
   *
   */
  public readonly questions$ = this._questions.asObservable();
  public readonly selectedId$ = this._selectedId.asObservable();
  public readonly currentQuestion$ = this._questions
    .asObservable()
    .pipe(
      map((questions) => questions.find((q) => q.id === this._selectedId.value))
    );
  public readonly isLoading$ = this._isLoading.asObservable();
  public readonly error$ = this._error.asObservable();

  constructor(private _http: HttpClient) {}

  /**
   * 
   * Action dispatchers and effects
   * 
   */
  getQuestions(): void {
    this._isLoading.next(true);
    this._http
      .get<IQuestion[]>('/api/questions')
      .pipe(shareReplay())
      .subscribe(
        (resData) => {
          this._questions.next(resData);
          this._isLoading.next(false);
        },
        (error) => {
          this._error.next(error);
          this._isLoading.next(false);
        }
      );
  }

  getQuestionById(id: string): void {
    this._isLoading.next(true);
    this._selectedId.next(id);
    this._http
      .get<IQuestion>('/api/questions', { params: { id } })
      .pipe(shareReplay())
      .subscribe(
        (resData) => {
          const entity = this._questions.value;
          if (resData) {
            const foundIdx = entity.findIndex((q) => q.id === resData.id);
            if (~foundIdx) entity[foundIdx] = resData;
            else entity.push(resData);
          }
          this._questions.next(entity);
          this._isLoading.next(false);
        },
        (error) => {
          this._error.next(error);
          this._isLoading.next(false);
        }
      );
  }
}
