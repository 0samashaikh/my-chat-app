import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Room, User } from '../../home/home.page';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket;
  private url = 'http://localhost:3000';
  constructor() {
    this.socket = io();
  }

  login(user: string) {
    this.socket.emit('login');
  }

  userLoggedIn() {
    return new Observable<{ rooms: Room[] }>((observer) => {
      this.socket.on('created rooms', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  createRoom(data: any) {
    this.socket.emit('createRoom', data);
  }

  newRoomCreated() {
    return new Observable<{ rooms: Room[] }>((observer) => {
      this.socket.on('new room', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  joinRoom(data: any) {
    this.socket.emit('join', data);
  }

  newUserJoin() {
    return new Observable<{ name: User['user']; message: User['message'] }>(
      (observer) => {
        this.socket.on('new user joined', (data) => {
          observer.next(data);
        });
        return () => {
          this.socket.disconnect();
        };
      }
    );
  }

  leaveRoom(data: any) {
    this.socket.emit('leave', data);
  }

  userLeftRoom() {
    return new Observable<{ name: User['user']; message: User['message'] }>(
      (observer) => {
        this.socket.on('left room', (data) => {
          observer.next(data);
        });
        return () => {
          this.socket.disconnect();
        };
      }
    );
  }

  sendMessage(data: any) {
    this.socket.emit('message', data);
  }

  newMessageReceived() {
    return new Observable<{ name: User['user']; message: User['message'] }>(
      (observer) => {
        this.socket.on('new message', (data) => {
          observer.next(data);
        });
        return () => {
          this.socket.disconnect();
        };
      }
    );
  }
}
