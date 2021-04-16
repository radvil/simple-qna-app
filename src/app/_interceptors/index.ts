import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Provider } from '@angular/core';
import { FakeApiInterceptor } from './fake-api.interceptor';

export const FakeApiProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeApiInterceptor,
  multi: true,
};
