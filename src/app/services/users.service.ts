import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { User } from '../classes/user';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class UsersService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  currentUser: User;

  constructor(private http: Http) { }

  // api interface

  findByName(name: string): Promise<User> {
    return this.http
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
      .catch(this.errorHandler);
  }

  create(user: User): Promise<User> {
    return this.http
      .post(`api/users`, JSON.stringify(user), { headers: this.headers })
      .toPromise()
      .then(res => {
        const result = res.json();
        if (result.err) { throw result.err; }
        return result.data as User;
      })
      .catch(this.errorHandler);
  }

  update(id: number, updates: any): Promise<User> {
    return this.http
      .put(`api/users/${id}`, JSON.stringify(updates), { headers: this.headers })
      .toPromise()
      .then(res => {
        const result = res.json();
        if (result.err) { throw result.err; }
        return result.data as User;
      })
      .catch(this.errorHandler);
  }

  destroy(id: number): Promise<User> {
    return this.http
      .delete(`api/users/${id}`)
      .toPromise()
      .then(res => {
        const result = res.json();
        if (result.err) { throw result.err; }
        return result.data as User;
      })
      .catch(this.errorHandler);
  }

  // change user

  changeUser(): Promise<void> {
    localStorage.removeItem('currentUser');
    return Promise.resolve();
  }

  private errorHandler(err: any): void {
    console.error(err);
  }

}
