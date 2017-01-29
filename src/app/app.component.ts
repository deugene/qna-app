import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Q&A App';

  constructor(
    public usersService: UsersService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  changeUser() {
    this.usersService.changeUser()
      .then(() => this.router.navigate([ 'home' ]));
  }
}
