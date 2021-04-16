import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { IQuestion } from '../_models/question.interface';
import { AnswerStore } from '../_services/answer.store';
import { QuestionService } from '../_services/question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit, OnDestroy {
  private _questionId!: string;
  private _destroy$ = new Subject();
  public selectedQuestion!: IQuestion;
  public form!: FormGroup;
  public isLoading!: boolean;

  constructor(
    private _route: ActivatedRoute,
    private _fb: FormBuilder,
    private _questionService: QuestionService,
    private _answerStore: AnswerStore,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._route.paramMap
      .pipe(
        map((param) => param.get('questionId')!),
        takeUntil(this._destroy$)
      )
      .subscribe((questionId) => {
        this._questionId = questionId;
        this._questionService.getQuestionById(this._questionId);
      });

    this._questionService.currentQuestion$
      .pipe(takeUntil(this._destroy$))
      .subscribe((q) => {
        if (q) {
          this.selectedQuestion = q;
          this._initFormAndSetValidators();
        }
      });

    this._questionService.isLoading$
      .pipe(takeUntil(this._destroy$))
      .subscribe((isLoading) => {
        this.isLoading = isLoading;
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /**
   *
   * custom getters
   *
   */
  get idInt() {
    return parseInt(this.selectedQuestion.id, 10);
  }

  get answerControl(): AbstractControl {
    return this.form.get('answer')!;
  }

  get errorMessage(): string {
    return this.answerControl.hasError('min')
      ? 'Minimum 1 karakter'
      : this.answerControl.hasError('maxlength')
      ? 'Maksimum 50 karakter'
      : this.answerControl.hasError('max')
      ? 'Maximum 200'
      : this.answerControl.hasError('email')
      ? 'Format email tidak benar'
      : 'Jawaban diperlukan';
  }

  get inputType() {
    return this.selectedQuestion ? this.selectedQuestion.inputType : 'text';
  }

  get nextButtonText() {
    return this.isLoading ? 'Loading...' : 'Berikutnya';
  }

  get radioOptions() {
    return this.selectedQuestion.options;
  }

  private _initFormAndSetValidators(): void {
    this.form = this._fb.group({
      answer: [null],
    });

    if (this.inputType === 'text') {
      this.answerControl.setValidators([
        Validators.required,
        Validators.maxLength(50),
      ]);
    } else if (this.inputType === 'number') {
      this.answerControl.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(200),
      ]);
    } else if (this.inputType === 'radio') {
      this.answerControl.setValidators(Validators.required);
    } else if (this.inputType === 'email') {
      this.answerControl.setValidators([Validators.required, Validators.email]);
    }

    this.answerControl.updateValueAndValidity();
  }

  nextOrFinish() {
    if (this.form.valid) {
      this._answerStore.updateAnswer(
        this.selectedQuestion,
        this.answerControl.value
      );
      if (this.idInt < 5) {
        this._router.navigate([`${this.idInt + 1}`]);
      } else {
        this._router.navigate(['/result']);
      }
    }
  }
}
