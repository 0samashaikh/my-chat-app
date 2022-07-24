import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { share } from 'rxjs/operators';
import { Storage } from '@capacitor/storage';

export const DB_NAME = 'app_data';
export const APP_INIT = 'app_init';
export const PUT_DOC = 'put_doc';
export const GET_DOC = 'get_doc';
export const GET_ITEM = 'get_item';
export const REMOVE_ITEM = 'remove_item';
export const SET_ITEM = 'set_item';
export const SETTINGS_ID = 'settings_id';
export const CLEAR_STORAGE = 'clear_storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  public db = Storage;
  private onSubject = new BehaviorSubject<{ event: string; value: any }>({
    event: APP_INIT,
    value: true,
  });
  public changes = this.onSubject.asObservable().pipe(share());

  async getItem(key: string) {
    const value = await this.db.get({ key });
    this.onSubject.next({ event: GET_ITEM, value });
    return value?.value;
  }

  async removeItem(key: string) {
    this.onSubject.next({ event: REMOVE_ITEM, value: key });
    return await this.db.remove({ key });
  }

  async setItem(key: string, value: string) {
    this.onSubject.next({ event: SET_ITEM, value: { key, value } });
    return await this.db.set({ key, value });
  }

  async clear() {
    this.onSubject.next({
      event: CLEAR_STORAGE,
      value: { key: true, value: true },
    });
    return await this.db.clear();
  }
}
