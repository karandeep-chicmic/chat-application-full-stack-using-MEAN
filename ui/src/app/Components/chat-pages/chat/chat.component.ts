import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiCallsService } from '../../../Services/api-calls.service';
import { SocketEventsService } from '../../../Services/socket-events.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [DatePipe, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  formBuilder: FormBuilder = inject(FormBuilder);
  apiCalls: ApiCallsService = inject(ApiCallsService);
  sockets: SocketEventsService = inject(SocketEventsService);

  @Input() chatData: any;
  @Input() selectedId: any;
  @Input() userPicture: any;
  @ViewChild('chatHistory') chatHistoryContainer!: ElementRef;

  // All the chat messages associated with the selected user
  chatMessages: any;
  pageNumber: number = 0;
  fileToUpload: any;
  userLoggedIn: string | null = '';

  // Form for Sending msg
  form: FormGroup = this.formBuilder.group({
    inputChatMsg: [''],
    fileInput: [''],
  });

  previousMessages: any;
  messagesSubscription: Subscription | undefined;

  ngOnInit(): void {
    // this.chatMessages =
    this.userLoggedIn = sessionStorage.getItem('userId');
  }

  ngOnChanges(): void {
    this.loadPreviousMessages();
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {}

  loadPreviousMessages() {
    this.sockets.messages = [];
    this.apiCalls.getChat(this.selectedId).subscribe({
      next: (data: any) => {
        // this.chatMessages = data;
        data.forEach((element: any) => {
          this.sockets.messages.push(element);
        });
        this.chatMessages = this.sockets.messages;
      },
      error: (err) => {
        console.log('ERROR  is : ', err);
      },
    });
  }

  sendMsg() {
    const sendersId: string = sessionStorage.getItem('userId') ?? '';
    const str = this.selectedId.split('-');
    let receiversId: string = '';
    if (str[0] === sendersId) {
      receiversId = str[1];
    } else {
      receiversId = str[0];
    }
    const messageContent = this.form.controls['inputChatMsg'].value;

    const msg = this.sockets.sendMsg(
      sendersId,
      receiversId,
      this.selectedId,
      messageContent
    );

    this.chatMessages = this.sockets.messages;
    this.apiCalls.updateThePrevUsers(this.selectedId).subscribe({
      next: (data: any) => {
        this.sockets.trigger(Math.random());
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.form.reset();
  }

  scrollToBottom() {}

  loadMoreMsgs() {}

  onEnter(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMsg();
    }
  }

  fileUpload(event: any) {}
}
