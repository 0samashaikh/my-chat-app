import { Component } from '@angular/core';
import { SpotifyService } from './shared/services/spotify.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'my-chat-app';
  constructor(private readonly spotify: SpotifyService) {}

  getAccessToken() {
    this.spotify.getAccessToken().subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
