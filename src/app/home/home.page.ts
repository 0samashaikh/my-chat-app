import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { StorageService } from '../auth/storage.service';
import { ChatService } from '../shared/services/chat.service';

export interface User {
  user?: string;
  message?: string;
}

export interface Room {
  room?: string;
  admin?: string;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  isMessageBoxVisible: boolean = false;
  userName: string = '';

  rooms: any[] = [];
  person: User[] = [];

  userForm = new UntypedFormGroup({
    userName: new UntypedFormControl('', [Validators.required]),
  });

  chatForm = new UntypedFormGroup({
    newRoom: new UntypedFormControl('', [Validators.required]),
    existingRoom: new UntypedFormControl('', [Validators.required]),
    message: new UntypedFormControl(''),
  });

  isUserActive: boolean = false;

  constructor(
    private chatService: ChatService,
    private readonly store: StorageService
  ) {
    this.chatService.newUserJoin().subscribe({
      next: (res) => {
        this.person.push(res);
      },
    });
    this.chatService.userLeftRoom().subscribe({
      next: (res) => {
        this.person.push(res);
      },
    });
    this.chatService.newMessageReceived().subscribe({
      next: (res) => {
        this.person.push(res);
      },
    });
    this.chatService.newRoomCreated().subscribe({
      next: (res) => {
        this.getRoomsOption(res.rooms);
      },
    });
  }

  ngOnInit() {
    this.getUser();
  }

  get f() {
    return this.chatForm.controls;
  }

  getUser() {
    this.store.getItem('username').then((user) => {
      if (user) {
        this.userName = user ? user : '';
        this.login();
        // this.chatService.login(this.userName);
      }
    });
  }

  createUser() {
    this.store.setItem('username', this.userForm.controls['userName'].value);
    this.userName = this.userForm.controls['userName'].value;
    this.login();
  }

  join() {
    this.chatService.joinRoom({
      user: this.userName,
      room: this.f['existingRoom']['value'],
    });
    this.isMessageBoxVisible = true;
  }

  leave() {
    this.chatService.leaveRoom({
      user: this.userName,
      room: this.f['existingRoom']['value'],
    });
    this.person = [];
    this.isMessageBoxVisible = false;
  }

  sendMessage() {
    this.chatService.sendMessage({
      user: this.userName,
      room: this.f['existingRoom']['value'],
      message: this.f['message']['value'],
    });
    this.f['message'].setValue('');

  }

  login() {
    this.chatService.login(this.userName);
    if (!this.isUserActive) {
      this.chatService.userLoggedIn().subscribe({
        next: (res) => {
          console.log(res);

          this.rooms = [];
          this.isUserActive = true;
          // res.rooms.forEach((element) => {
          //   this.rooms.push(element.room);
          // });
          this.getRoomsOption(res.rooms);
          // res.forEach(element => {

          // });
        },
      });
    }
  }

  createRoom() {
    this.chatService.createRoom({
      room: this.f['newRoom']['value'],
      admin: this.userName,
    });

    this.f['existingRoom'].setValue(this.f['newRoom']['value']);
    this.f['newRoom'].setValue('');
    this.join();
  }

  getRoomsOption(options: any[]) {
    this.rooms = [];
    options.forEach((element) => {
      this.rooms.push(element.room);
    });
  }
}
