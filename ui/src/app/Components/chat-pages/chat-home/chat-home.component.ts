import { Component, inject } from '@angular/core';
import { dataBySearch } from '../../../Interfaces/user.interface';
import { Subject } from 'rxjs';
import { ChatComponent } from '../chat/chat.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../home/navbar/navbar.component';
import { ApiCallsService } from '../../../Services/api-calls.service';

@Component({
  selector: 'app-chat-home',
  standalone: true,
  imports: [ChatComponent, FormsModule, CommonModule, NavbarComponent],
  templateUrl: './chat-home.component.html',
  styleUrl: './chat-home.component.css',
})
export class ChatHomeComponent {
  apiCalls: ApiCallsService = inject(ApiCallsService);

  dataBySearch: any[] = [];
  defaultData: dataBySearch[] = [];
  chatData: any;
  selectedId: string | undefined = '';
  alreadyChatWithUser: any;
  username: string | null = 'temp';
  altImgURl: string = '';
  private searchSubject = new Subject<string>();
  ngOnInit(): void {
    this.apiCalls.getRooms().subscribe({
      next: (data: any) => {
        // this.dataBySearch = data;
        const userLocal = localStorage.getItem('userId');

        data.forEach((room: any) => {
          room.users.forEach((obj: any) => {
            console.log(obj);
            
            if (String(obj._id) !== String(userLocal)) {
              this.dataBySearch.push(obj);
            }
          });

        });

        console.log(this.dataBySearch);
      },
      error: (err) => {
        console.log('ERROR is : ', err);
      },
    });
  }

  setUsers(flag: boolean): void {}

  // search the user on basis of user input
  searchUser(event: any) {}

  // To find the Image of particular user
  findImage(profileImagePath: string | undefined, err?: string) {}

  // Get Chat of user on Click
  getChat(id: string | undefined) {
    console.log(id);
    this.selectedId = id
    
  }

  // Image error
  onImageError() {}

  setToDefault() {}
}
