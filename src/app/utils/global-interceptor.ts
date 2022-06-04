import {Injectable, Inject, Optional} from '@angular/core';
import {HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders} from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable()
export class GlobalInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req, next: HttpHandler) {
    req = req.clone({
      setHeaders: {
        'X-API-KEY': environment.API_KEY
      }
    });

    return next.handle(req);
  }
}
