import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AUTHORIZATION,
  BASIC_HEADER_PREFIX,
  CONTENT_TYPE,
  APP_X_WWW_FORM_URLENCODED,
} from '../../auth/constants';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  constructor(private readonly http: HttpClient) {}
  getAccessToken() {
    const url = 'https://accounts.spotify.com/api/token';
    let params = new HttpParams().set('grant_type', 'client_credentials');
    const bufferedStringClientSecret = Buffer.from(
      environment.client_id + ':' + environment.client_secret
    ).toString('base64');
    console.log(bufferedStringClientSecret);

    let headers = {
      [AUTHORIZATION]: BASIC_HEADER_PREFIX + bufferedStringClientSecret,
      [CONTENT_TYPE]: APP_X_WWW_FORM_URLENCODED,
    };
    return this.http.post(url, undefined, { headers: headers, params: params });
  }
}
