import { Injectable, Signal, inject, signal } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { ApiCallsService } from './api-calls.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_ROUTES } from '../constants';
import { SweetAlertService } from './sweet-alert.service';

@Injectable({
  providedIn: 'root',
})
export class SocketEventsService {
  apiCalls: ApiCallsService = inject(ApiCallsService);
  http: HttpClient = inject(HttpClient);
  sweetAlert: SweetAlertService = inject(SweetAlertService);

  private socket: Socket;
  selectedUser = signal('');
  messages: any[] = [];
  subjectToUpdate = new Subject();

  constructor() {
    this.socket = io('http://localhost:3030/chat');
    this.socket.on('connection', () => {
      console.log('connected');
    });

    this.socket.on('receive-message', (data) => {
      console.log('received message', data, this.selectedUser());

      if (data.receiversId === this.selectedUser()) {
        this.subjectToUpdate.next(Math.random());
        this.sweetAlert.success('message received : ' + data.messageContent);
        this.messages.push(data);
      }
    });
  }

  // getChat(roomId: string) {
  //   return this.http.get(
  //     `${API_ROUTES.BASE_URL}${API_ROUTES.GET_CHAT}/${roomId}`
  //   );
  // }

  trigger(data: any) {
    this.subjectToUpdate.next(data);
  }

  sendMsg(
    sendersId: string,
    receiversId: string,
    roomId: string,
    messageContent: string
  ) {
    this.socket.emit(
      'send-message',
      sendersId,
      receiversId,
      roomId,
      messageContent,
      (data: any) => {
        this.messages.push(data.messageSent);
      }
    );
  }

  joinRoom(
    sendersId: string | null | undefined,
    receieversId: string | undefined | null
  ) {
    this.socket.emit('join-room', sendersId, receieversId, (data: any) => {});
  }

  joinGroupRoom(name: string, users: any[]) {
    this.socket.emit('group-join', users, name, (data: any) => {});
  }

  joinByGroupName(name: string) {
    this.socket.emit('join-by-group-name', name);
  }
}
