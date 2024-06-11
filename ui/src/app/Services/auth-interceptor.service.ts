import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = localStorage.getItem('token');

    let authReq = req.clone();
    if (authToken) {
      authReq = req.clone({
        headers: req.headers.set('token', authToken),
      });
    }
    console.log('INSIDE INTERCEPTOR');

    return next.handle(authReq);
  }
  constructor() {}
}
