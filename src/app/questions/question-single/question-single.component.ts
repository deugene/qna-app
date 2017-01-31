import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { QuestionsService } from '../../services/questions.service';
import { AnswersService } from '../../services/answers.service';
import { UsersService } from '../../services/users.service';

import { Answer } from '../../classes/answer';
import { Question } from '../../classes/question';
import { User } from '../../classes/user';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-question-single',
  templateUrl: './question-single.component.html',
  styleUrls: ['./question-single.component.css']
})
export class QuestionSingleComponent implements OnInit {
  question: Question;
  currentUser: User;

  constructor(
    private questionsService: QuestionsService,
    private answersService: AnswersService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.route.params
      .switchMap((params: Params) => {
        return this.questionsService.findById(+params[ 'questionId' ]);
      })
      .subscribe(question => this.question = question)
  }

  postedAt(date: string): string {
    const time = new Date(date).toTimeString().slice(0, 9);
    date = new Date(date).toDateString();
    return time + ' ' + date;
  }

}
