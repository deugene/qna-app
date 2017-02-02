import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { QuestionsService } from '../../services/questions.service';
import { AnswersService } from '../../services/answers.service';
import { UsersService } from '../../services/users.service';

import { Answer } from '../../models/answer';
import { Question } from '../../models/question';

import 'rxjs/add/operator/switchMap';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-question-single',
  templateUrl: './question-single.component.html',
  styleUrls: ['./question-single.component.css']
})
export class QuestionSingleComponent implements OnInit, OnDestroy {
  question: Question;
  currentUserId: number;
  isCurrent: boolean;
  edit = false;
  subscription: Subscription;


  constructor(
    private _questionsService: QuestionsService,
    private _answersService: AnswersService,
    private _route: ActivatedRoute,
    private _location: Location,
    private _usersService: UsersService
  ) { }

  ngOnInit() {
    this.subscription = this._usersService.currentUser$
      .subscribe(currentUser => {
        if (currentUser) { this.currentUserId = currentUser.id; }
        this._route.params
          .switchMap((params: Params) => {
            return this._questionsService.findById(+params[ 'questionId' ]);
          })
          .subscribe(question => {
            this.question = question;
            this._questionsService.setCurrentQuestion(this.question);
            this.isCurrent = this.question.author.id === this.currentUserId;
          });
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  postedAt(date: string): string {
    const time = new Date(date).toTimeString().slice(0, 9);
    date = new Date(date).toDateString();
    return time + ' ' + date;
  }

  refresh() {
    this._questionsService.findById(this.question.id)
      .then(question => {
        this.question = question;
        this.edit = false;
      });
  }

  goBack() {
    this._location.back();
  }

}
