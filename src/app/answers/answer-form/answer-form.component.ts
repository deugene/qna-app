import {
  Component, OnInit, Input, Output, ViewChild, AfterViewChecked, EventEmitter,
  OnDestroy
} from '@angular/core';
import { NgForm } from '@angular/forms';

import { Answer } from '../../classes/answer';
import { AnswersService } from '../../services/answers.service';
import { QuestionsService } from '../../services/questions.service';
import { UsersService } from '../../services/users.service';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-answer-form',
  templateUrl: './answer-form.component.html',
  styleUrls: ['./answer-form.component.css']
})
export class AnswerFormComponent implements OnInit, AfterViewChecked, OnDestroy {
  userId: number;
  subscriptionUser: Subscription;
  subscriptionQuestion: Subscription;
  @Input() answer: Answer = new Answer('');

  @Output() answersChange = new EventEmitter<boolean>();

  answerForm: NgForm;
  @ViewChild('answerForm') currentForm: NgForm;

  submitDisabled = true;

  formErrors = {
    'body': ''
  };

  validationMessages = {
    'body': {
      'required': 'Content is required.',
      'minlength': 'Answer must contain at least 3 characters.',
      'maxlength': 'Answer must contain less than 5001 characters.'
    }
  };

  constructor(
    private _answersService: AnswersService,
    private _questionsService: QuestionsService,
    private _usersService: UsersService
  ) { }

  ngOnInit() {
    if (!this.answer.userId) {
      this.subscriptionUser = this._usersService.currentUser$
        .subscribe(currentUser => {
          if (currentUser) { this.answer.userId = currentUser.id; }
        });
    }
    if (!this.answer.questionId) {
      this.subscriptionQuestion = this._questionsService.currentQuestion$
        .subscribe(currentQuestion => {
          if (currentQuestion) { this.answer.questionId = currentQuestion.id; }
        });
    }
  }

  ngOnDestroy() {
    this.subscriptionUser.unsubscribe();
    this.subscriptionQuestion.unsubscribe();
  }

  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged(): void {
    if (this.currentForm === this.answerForm) { return; }
    this.answerForm = this.currentForm;
    if (this.answerForm) {
      this.answerForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
    }
  }

  onValueChanged(data?: any): void {
    if (!this.answerForm) { return; }
    const form = this.answerForm.form;
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
    if (this.answerForm.form.valid) {
      new Promise(res => {
        if (!this.answer.id) {
          res(this._answersService.create(this.answer));
          return;
        }
        const updates = { body: this.answer.body };
        res(this._answersService.update(this.answer.id, updates));
      })
        .then(() => {
          this.answersChange.emit();
          this.answerForm.reset();
        })
        .catch(err => {
          if (err) { console.error(err.message); }
        });
    }
  }

  back() {
    this.answersChange.emit();
    this.answerForm.reset();
  }
}
