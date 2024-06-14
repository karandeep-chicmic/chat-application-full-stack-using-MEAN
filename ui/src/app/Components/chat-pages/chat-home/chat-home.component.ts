import { Component, inject } from '@angular/core';
import { dataBySearch } from '../../../Interfaces/user.interface';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ChatComponent } from '../chat/chat.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../home/navbar/navbar.component';
import { ApiCallsService } from '../../../Services/api-calls.service';
import { SocketEventsService } from '../../../Services/socket-events.service';
import Swal from 'sweetalert2';
import { ModalComponent } from '../../modal/modal.component';

@Component({
  selector: 'app-chat-home',
  standalone: true,
  imports: [ChatComponent, FormsModule, CommonModule, NavbarComponent,ModalComponent],
  templateUrl: './chat-home.component.html',
  styleUrl: './chat-home.component.css',
})
export class ChatHomeComponent {
  apiCalls: ApiCallsService = inject(ApiCallsService);
  sockets: SocketEventsService = inject(SocketEventsService);

  dataBySearch: any[] = [];
  defaultData: dataBySearch[] = [];
  chatData: any;
  selectedId: string | undefined = '';
  alreadyChatWithUser: any;
  username: string | null = 'temp';
  altImgURl: string = '';
  isModalVisible = false;

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.setUsers(true);
    this.sockets.subjectToUpdate.subscribe(() => {
      this.setUsers();
    });
    this.searchSubject
      .pipe(
        debounceTime(300), // 300ms debounce time
        distinctUntilChanged() // Only emit when the value changes
      )
      .subscribe((searchText) => {
        this.apiCalls.searchUser(searchText).subscribe((data: any) => {
          console.log(data);

          this.dataBySearch = data;
        });

        console.log(searchText);
      });
  }

  openModal() {
    this.isModalVisible = !this.isModalVisible;
  }
  
  setUsers(option?: boolean) {
    this.apiCalls.getRooms().subscribe({
      next: (data: any) => {
        this.dataBySearch = [];
        const userLocal = sessionStorage.getItem('userId');

        data.forEach((room: any) => {
          room.users.forEach((obj: any) => {
            this.sockets.joinRoom(obj._id, userLocal);

            if (String(obj._id) !== String(userLocal)) {
              this.dataBySearch.push(obj);
            }
          });
        });

        if (option == true) {
          this.chatData = this.dataBySearch[0].name;
          this.selectedId = this.createRoomName(
            this.dataBySearch[0]._id,
            userLocal
          );
          console.log(this.selectedId);
        }
      },
      error: (err) => {
        console.log('ERROR is : ', err);
      },
    });
  }

  // search the user on basis of user input
  searchUser(event: any) {
    const searchText = event.target.value;
    if (searchText === '') {
      this.setUsers();
      return;
    }
    this.searchSubject.next(searchText);
  }

  // To find the Image of particular user
  findImage(profileImagePath: string | undefined, err?: string) {}

  // Get Chat of user on Click
  getChat(id: string | undefined, name: string) {
    console.log(id);
    const userId = sessionStorage.getItem('userId');

    const roomName = this.createRoomName(id, userId);

    this.selectedId = roomName;
    this.chatData = name;

    // joining the room
    this.sockets.joinRoom(userId, id);
  }
  createRoomName(senderId: string | undefined, receiverId: string | null) {
    console.log([senderId, receiverId].sort().join('-'));
    return [senderId, receiverId].sort().join('-');
  }

  async addToGroup() {
    const { value: password } = await Swal.fire({
      title: 'Enter group people',
      input: 'text',
      inputPlaceholder: 'Enter your password',
      inputAttributes: {
        maxlength: '10',
        autocapitalize: 'off',
        autocorrect: 'off',
      },
    });
    if (password) {
      Swal.fire(`Entered password: ${password}`);
    }
  }
  // Image error
  onImageError() {}

  setToDefault() {}
}
