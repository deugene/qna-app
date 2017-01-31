import { Component, OnInit } from '@angular/core';

import { User } from '../../classes/user';
import { Question } from '../../classes/question';

import { QuestionsService, QuestionSearchOpts } from '../../services/questions.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {
  currentUser: User;
  questions: Question[];
  showDropdown = false;
  showOnlyCurrentUserQuestions = false;

  // pagination
  currentPage: number;
  totalItems: number;

  searchOpts: QuestionSearchOpts = {
    offset: 0,
    limit: 10
  };

  constructor(private questionsService: QuestionsService) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.all();
  }

  all() {
    this.searchOpts.userId = this.showOnlyCurrentUserQuestions
      ? this.currentUser.id
      : null;
    this.questionsService.all(this.searchOpts)
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


}
