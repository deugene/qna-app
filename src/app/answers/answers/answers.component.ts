import { Component, OnInit, Input } from '@angular/core';

import { User } from '../../classes/user';
import { Answer } from '../../classes/answer';

import { AnswersService } from '../../services/answers.service';

@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.css']
})
export class AnswersComponent implements OnInit {
  @Input() questionId: number;
  currentUserId: number;
  answers: Answer[];
  showOnlyCurrentUserAnswers = false;

  // pagination
  currentPage: number;
  totalItems: number;

  searchOpts = {
    offset: 0,
    limit: 10
  };

  constructor(private _answersService: AnswersService) { }

  ngOnInit() {
    this.currentUserId = JSON.parse(localStorage.getItem('currentUser')).id;
    this.findAllByQuestionId();
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
