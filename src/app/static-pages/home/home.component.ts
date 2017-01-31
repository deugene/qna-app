import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Router } from '@angular/router';

import { UsersService } from '../../services/users.service';

import { User } from '../../classes/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewChecked {
  title = 'Welcome to the QnA App!';
  subtitle = 'Please enter your name to log in!';
  name = '';
  submitDisabled = true;

  formErrors = {
    'name': ''
  };

  validationMessages = {
    'name': {
      'required': 'Name is required.',
      'pattern': 'First Name must contain at least 3 and less than 51 characters',
    }
  };

  nameForm: NgForm;
  @ViewChild('nameForm') currentForm: NgForm;

  constructor(
    private usersService: UsersService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged(): void {
    if (this.currentForm === this.nameForm) { return; }
    this.nameForm = this.currentForm;
    if (this.nameForm) {
      this.nameForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
    }
  }

  onValueChanged(data?: any): void {
    if (!this.nameForm) { return; }
    const form = this.nameForm.form;
    if (form.valid) {
      this.submitDisabled = false;
    } else {
      this.submitDisabled = true;
    }

    // tslint:disable-next-line:forin
    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        // tslint:disable-next-line:forin
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  onSubmit(): void {
    if (this.nameForm.form.valid) {
      this.usersService.findByName(this.name)
        .then(user => {
          if (!user) {
            if (confirm('User Not Found. Create new user?')) {
              return this.usersService.create(new User(this.name));
            }
            return null;
          }
          return user;
        })
        .then(user => {
          if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.router.navigate([ 'questions' ]);
          }
        });
    }
  }

}
