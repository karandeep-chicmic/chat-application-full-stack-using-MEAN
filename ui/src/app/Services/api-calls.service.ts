import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_ROUTES } from '../constants';
import { user } from '../Interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiCallsService {
  http = inject(HttpClient);

  constructor() {}

  loginUser(userData: user) {
    return this.http.post(API_ROUTES.BASE_URL + API_ROUTES.LOGIN, userData);
  }

  registerUser(userData: FormData) {
    return this.http.post(API_ROUTES.BASE_URL + API_ROUTES.REGISTER, userData);
  }
}
