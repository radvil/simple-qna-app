import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, dematerialize, materialize, mergeMap } from 'rxjs/operators';
import * as database from 'src/assets/db/questions.json';
import { IQuestion } from '../_models/question.interface';

@Injectable()
export class FakeApiInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { url, method, params } = req;
    // TO simulate the api call we're going to wrap it in obsevable with delayed
    return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize(), delay(500), dematerialize());

    function handleRoute() {
      switch (true) {
        case !!params.get('id') && method === 'GET':
          return getById();
        case url.endsWith('/api/questions') && method === 'GET':
          return getAll();
        default:
          return next.handle(req);
      }
    }

    function getAll() {
      if (!database) return error('Not found!', 404);
      const questions = (database as any).default;
      return ok(questions);
    }

    function getById() {
      const questions: IQuestion[] = (database as any).default;
      const question = questions.find(q => q.id == params.get('id'));
      if (!question) error('Not Found', 404);
      return ok(question);
    }

    function ok(body?: any) {
      return of(new HttpResponse({ status: 200, body }));
    }

    function error(message: any, status?: number) {
      return throwError({ error: { message }, status: 500 });
    }
  }
}
