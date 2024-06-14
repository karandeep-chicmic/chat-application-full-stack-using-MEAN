import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_ROUTES } from '../constants';
import { user } from '../Interfaces/user.interface';
import { ROUTES } from '@angular/router';

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

  getRooms() {
    return this.http.get(API_ROUTES.BASE_URL + API_ROUTES.ROOM_GET);
  }

  getChat(roomId: string) {
    return this.http.get(
      `${API_ROUTES.BASE_URL}${API_ROUTES.GET_CHAT}/${roomId}`
    );
  }

  searchUser(searchText: string) {
    return this.http.get(
      `${API_ROUTES.BASE_URL}${API_ROUTES.SEARCH}/${searchText}`
    );
  }

  updateThePrevUsers(roomId: string) {
    return this.http.put(
      `${API_ROUTES.BASE_URL}${API_ROUTES.MESSAGES}/${roomId}`,
      {}
    );
  }
}
