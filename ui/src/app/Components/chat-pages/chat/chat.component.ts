import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [DatePipe, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  formBuilder: FormBuilder = inject(FormBuilder);
  @Input() chatData: any;
  @Input() selectedId: any;
  @ViewChild('chatHistory') chatHistoryContainer!: ElementRef;

  // All the chat messages associated with the selected user
  chatMessages: any;
  pageNumber: number = 0;
  fileToUpload: any;

  // Form for Sending msg
  form: FormGroup = this.formBuilder.group({
    inputChatMsg: [''],
    fileInput: [''],
  });

  previousMessages: any;
  messagesSubscription: Subscription | undefined;

  ngOnInit(): void {}

  ngOnChanges(): void {}

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {}

  loadPreviousMessages(): void {}

  sendMsg() {}

  scrollToBottom() {}

  loadMoreMsgs() {}

  onEnter(event: KeyboardEvent) {}

  fileUpload(event: any) {}
}
