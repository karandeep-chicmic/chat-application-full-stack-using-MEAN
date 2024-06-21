import { Component, inject } from '@angular/core';
import { dataBySearch } from '../../../Interfaces/user.interface';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ChatComponent } from '../chat/chat.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, JsonPipe } from '@angular/common';
import { NavbarComponent } from '../../home/navbar/navbar.component';
import { ApiCallsService } from '../../../Services/api-calls.service';
import { SocketEventsService } from '../../../Services/socket-events.service';
import Swal from 'sweetalert2';
import { ModalComponent } from '../../modal/modal.component';

@Component({
  selector: 'app-chat-home',
  standalone: true,
  imports: [
    ChatComponent,
    FormsModule,
    CommonModule,
    NavbarComponent,
    ModalComponent,
    ReactiveFormsModule,
    JsonPipe,
  ],
  templateUrl: './chat-home.component.html',
  styleUrl: './chat-home.component.css',
})
export class ChatHomeComponent {
  apiCalls: ApiCallsService = inject(ApiCallsService);
  sockets: SocketEventsService = inject(SocketEventsService);
  formBuilder: FormBuilder = inject(FormBuilder);

  //  the data from search as well as the previous chatted users
  dataBySearch: any[] = [];
  allUsers: any;
  defaultData: dataBySearch[] = [];
  chatData: any;
  selectedId: string | undefined = '';
  userPicture: any;
  alreadyChatWithUser: any;
  username: string | null = 'temp';
  altImgURl: string = '';
  isModalVisible = false;
  groupArray: string[] = [];
  idUser: string = '';
  groupsData: any[] = [];
  flag: boolean = false;

  form: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    addUsers: [''],
  });

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.setUsers(true);

    this.getAllUsers();
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

  getAllUsers() {
    this.apiCalls.searchUser('gmail').subscribe((data: any) => {
      this.allUsers = data;
    });
  }
  setUsers(option?: boolean) {
    this.apiCalls.getRooms().subscribe({
      next: (data: any) => {
        this.dataBySearch = [];
        const userLocal = sessionStorage.getItem('userId');

        data.forEach((room: any) => {
          if (room.users.length <= 2) {
            room.users.forEach((obj: any) => {
              this.sockets.joinRoom(obj._id, userLocal);

              if (String(obj._id) !== String(userLocal)) {
                this.dataBySearch.push(obj);
              }
            });
          } else if (!this.flag) {
            this.groupsData.push(room);
            this.sockets.joinByGroupName(room.roomName);
          }
        });

        // if(data.users.length>2){

        // }

        if (option == true) {
          this.chatData = this.dataBySearch[0].name;
          this.selectedId = this.createRoomName(
            this.dataBySearch[0]._id,
            userLocal
          );
          // this.allUsers = this.dataBySearch
          this.userPicture = this.dataBySearch[0].profilePicture;
          console.log(this.selectedId);
        }
        this.flag = true;
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
  getChat(id: string | undefined, name: string, userPicture: string) {
    console.log(id);
    const userId = sessionStorage.getItem('userId');

    const roomName = this.createRoomName(id, userId);

    this.userPicture = userPicture;
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

  selectedEmailForGc(id: string, email: string) {
    this.form.controls['addUsers'].setValue(email);

    this.idUser = id;
  }

  createGroup() {
    this.sockets.joinGroupRoom(
      this.form.controls['name'].value,
      this.groupArray
    );
    this.flag = false;
    this.setUsers();
  }

  addUsersToGroup() {
    if (!this.form.controls['addUsers'].value) {
      return;
    }
    this.groupArray.push(this.idUser);
    this.form.controls['addUsers'].reset();
    this.idUser = '';
  }

  setToDefault() {}
  getGroupChat() {}
}
