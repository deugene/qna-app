import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { User } from '../classes/user';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class UsersService {
  private _headers = new Headers({ 'Content-Type': 'application/json' });

  private _currentUser = new BehaviorSubject<User>(
    JSON.parse(localStorage.getItem('currentUser')) || null
  );
  currentUser$ = this._currentUser.asObservable();

  constructor(private _http: Http) { }

  setCurrentUser(user: User) {
    this._currentUser.next(user);
  }

  // api interface

  findByName(name: string): Promise<User> {
    return this._http
      .get(`api/users/${name}`)
      .toPromise()
      .then(res => {
        const result = res.json();
        if (result.err && result.err.message !== 'User Not Found') {
          throw result.err;
        } else if (result.err && result.err.message === 'User Not Found') {
          result.data = null;
        }
        return result.data as User;
      })
      .catch(this._errorHandler);
  }

  create(user: User): Promise<User> {
    return this._http
      .post(`api/users`, JSON.stringify(user), { headers: this._headers })
      .toPromise()
      .then(res => {
        const result = res.json();
        if (result.err) { throw result.err; }
        return result.data as User;
      })
      .catch(this._errorHandler);
  }

  update(id: number, updates: any): Promise<User> {
    return this._http
      .put(`api/users/${id}`, JSON.stringify(updates), { headers: this._headers })
      .toPromise()
      .then(res => {
        const result = res.json();
        if (result.err) { throw result.err; }
        return result.data as User;
      })
      .catch(this._errorHandler);
  }

  destroy(id: number): Promise<User> {
    return this._http
      .delete(`api/users/${id}`)
      .toPromise()
      .then(res => {
        const result = res.json();
        if (result.err) { throw result.err; }
        return result.data as User;
      })
      .catch(this._errorHandler);
  }

  // change user

  changeUser(): Promise<void> {
    localStorage.removeItem('currentUser');
    this.setCurrentUser(null);
    return Promise.resolve();
  }

  private _errorHandler(err: any): void {
    console.error(err);
  }

}
