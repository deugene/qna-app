import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { UsersService } from './services/users.service';
import { User } from './models/user';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Q&A App';
  currentUser: User;
  subscription: Subscription;

  constructor(
    private _usersService: UsersService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.subscription = this._usersService.currentUser$
      .subscribe(currentUser => this.currentUser = currentUser);
  }

  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }

  changeUser() {
    this._usersService.changeUser()
      .then(() => this._router.navigate([ 'home' ]));
  }
}
