import {
  Component, OnInit, Input, Output, ViewChild, AfterViewChecked, EventEmitter,
  OnDestroy
} from '@angular/core';
import { NgForm } from '@angular/forms';

import { Question } from '../../models/question';
import {
  QuestionsService, QuestionSearchOpts
} from '../../services/questions.service';
import { UsersService } from '../../services/users.service';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.css']
})
export class QuestionFormComponent implements OnInit, AfterViewChecked, OnDestroy {
  userId: number;
  subscription: Subscription;
  @Input() question: Question = new Question('', '');

  @Output() questionsChange = new EventEmitter<boolean>();

  questionForm: NgForm;
  @ViewChild('questionForm') currentForm: NgForm;

  submitDisabled = true;

  formErrors = {
    'title': '',
    'body': ''
  };

  validationMessages = {
    'body': {
      'required': 'Content is required.',
      'minlength': 'Question must contain at least 3 characters.',
      'maxlength': 'Question must contain less than 5001 characters.'
    },
    'title': {
      'required': 'Content is required.',
      'pattern': 'Title must contain at least 3 and less than 101 characters.'
    }
  };

  constructor(
    private _questionsService: QuestionsService,
    private _usersService: UsersService
  ) { }

  ngOnInit() {
    if (!this.question.userId) {
      this.subscription = this._usersService.currentUser$
        .subscribe(currentUser => {
          if (currentUser) { this.question.userId = currentUser.id; }
        });
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged(): void {
    if (this.currentForm === this.questionForm) { return; }
    this.questionForm = this.currentForm;
    if (this.questionForm) {
      this.questionForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
    }
  }

  onValueChanged(data?: any): void {
    if (!this.questionForm) { return; }
    const form = this.questionForm.form;
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
    if (this.questionForm.form.valid) {
      new Promise(res => {
        if (!this.question.id) {
          res(this._questionsService.create(this.question));
          return;
        }
        const updates = {
          title: this.question.title,
          body: this.question.body
        };
        res(this._questionsService.update(this.question.id, updates));
      })
        .then(() => {
          this.questionsChange.emit();
          this.questionForm.reset();
        })
        .catch(err => {
          if (err) { console.error(err.message); }
        });
    }
  }

  back() {
    this.questionsChange.emit();
    this.questionForm.reset();
  }

}
