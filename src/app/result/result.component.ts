import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IQuizResult } from '../_models/result.interface';
import { AnswerStore } from '../_services/answer.store';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  public results!: IQuizResult[];

  constructor(private _answerStore: AnswerStore) { }

  ngOnInit(): void {
    this._answerStore.quizResults$.subscribe((results) => {
      this.results = results;
      console.log(this.results);
    });
  }

}
