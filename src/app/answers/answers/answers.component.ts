import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { User } from '../../models/user';
import { Answer } from '../../models/answer';

import { AnswersService } from '../../services/answers.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.css']
})
export class AnswersComponent implements OnInit, OnDestroy {
  @Input() questionId: number;
  currentUserId: number;
  answers: Answer[];
  showOnlyCurrentUserAnswers = false;
  subscription: Subscription;

  // pagination
  currentPage: number;
  totalItems: number;

  searchOpts = {
    offset: 0,
    limit: 10
  };

  constructor(
    private _answersService: AnswersService,
    private _usersService: UsersService,
  ) { }

  ngOnInit() {
    this.subscription = this._usersService.currentUser$
      .subscribe(currentUser => {
        if (currentUser) {
          this.currentUserId = currentUser.id;
          this.findAllByQuestionId();
        }
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  findAllByQuestionId() {
    this._answersService.findAllByQuestionId(this.questionId, this.searchOpts)
      .then(result => {
        this.answers = result.count ? result.data : [];
        this.totalItems = result.count;
      });
  }

  postedAt(date: string): string {
    const time = new Date(date).toTimeString().slice(0, 9);
    date = new Date(date).toDateString();
    return time + ' ' + date;
  }

  pageChanged(newPage: number): void {
    this.searchOpts.offset = (newPage - 1) * this.searchOpts.limit;
    this.currentPage = newPage;
    this.findAllByQuestionId();
  }

}
