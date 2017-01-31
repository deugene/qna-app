import {
  Component, OnInit, Input, Output, ViewChild, AfterViewChecked, EventEmitter
} from '@angular/core';
import { NgForm } from '@angular/forms';

import { Question } from '../../classes/question';
import { QuestionsService, QuestionSearchOpts } from '../../services/questions.service';

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.css']
})
export class QuestionFormComponent implements OnInit, AfterViewChecked {
  userId: number;
  @Input() mode: string;
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
      'minlength': 'Question must contain at least 3 characters',
      'maxlength': 'Question must contain less than 5001 characters'
    },
    'title': {
      'required': 'Content is required.',
      'pattern': 'Title must contain at least 3 and less than 101 characters'
    }
  };

  constructor(private questionsService: QuestionsService) { }

  ngOnInit() {
    if (!this.question.userId) {
      this.question.userId = JSON.parse(localStorage.getItem('currentUser')).id;
    }
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
        switch (this.mode) {
          case 'create':
            res(this.questionsService.create(this.question));
            break;
          case 'update':
            const updates = {
              title: this.question.title,
              body: this.question.body
            };
            res(this.questionsService.update(this.question.id, updates));
            break;
          default:
            throw new Error('Unknown Mode');
        }
      })
        .then(() => {
          this.questionForm.reset();
          this.questionsChange.emit();
        })
        .catch(err => {
          if (err) { console.error(err.message); }
        });
    }
  }

// TODO: remove later
  test() {
    return JSON.stringify(this.question);
  }

}
