import { Component, OnInit } from '@angular/core';

import { User } from '../../classes/user';
import { Question } from '../../classes/question';

import { QuestionsService } from '../../services/questions.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {
  currentUser: User;
  showDropdown = false;

  constructor(private questionsService: QuestionsService) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

}
