import { Component, OnInit, OnDestroy } from '@angular/core';

import { User } from '../../models/user';
import { Question } from '../../models/question';

import {
  QuestionsService, QuestionSearchOpts
} from '../../services/questions.service';
import { UsersService } from '../../services/users.service';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit, OnDestroy {
  title = 'Questions:';
  currentUserId: number;
  questions: Question[];
  subscription: Subscription;
  showOnlyCurrentUserQuestions = false;

  // pagination
  currentPage: number;
  totalItems: number;

  searchOpts: QuestionSearchOpts = {
    offset: 0,
    limit: 10
  };

  constructor(
    private _questionsService: QuestionsService,
    private _usersService: UsersService
  ) { }

  ngOnInit() {
    this.subscription = this._usersService.currentUser$
      .subscribe(currentUser => {
        if (currentUser) {
          this.currentUserId = currentUser.id;
          this.all();
        }
      });
  }

  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }

  all() {
    this.searchOpts.userId = this.showOnlyCurrentUserQuestions
      ? this.currentUserId
      : null;
    this._questionsService.all(this.searchOpts)
      .then(result => {
        this.questions = result.count ? result.data : null;
        this.totalItems = result.count;
      });
  }

  filter(by: string) {
    this.searchOpts.status = by;
    this.all();
  }

  postedAt(date: string): string {
    const time = new Date(date).toTimeString().slice(0, 9);
    date = new Date(date).toDateString();
    return time + ' ' + date;
  }

  toggleOnlyCurrentUserQuestions() {
    this.showOnlyCurrentUserQuestions = !this.showOnlyCurrentUserQuestions;
    this.all();
  }

  answersCount(question: Question): string {
    return (question.answers ? question.answers.length : 0) + ' answers';
  }

  pageChanged(newPage: number): void {
    this.searchOpts.offset = (newPage - 1) * this.searchOpts.limit;
    this.currentPage = newPage;
    this.all();
  }

}
