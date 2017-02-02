/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { QuestionSingleComponent } from './question-single.component';

import { UsersService } from '../../services/users.service';
import { AnswersService } from '../../services/answers.service';
import {
  QuestionsService,
  PaginationResult,
  QuestionSearchOpts
} from '../../services/questions.service';

import {
  UserServiceStub, QuestionsServiceStub, AnswersServiceStub
} from '../../../testing/services-stubs';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

class LocationStub {
  back = jasmine.createSpy('back');
}

describe('QuestionSingleComponent', () => {
  let component: QuestionSingleComponent;
  let fixture: ComponentFixture<QuestionSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionSingleComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        { provide: QuestionsService, useClass: QuestionsServiceStub },
        { provide: UsersService, useClass: UserServiceStub },
        { provide: AnswersService, useClass: AnswersServiceStub },
        { provide: ActivatedRoute, useValue: { params: Observable.of({ id: 2 }) } },
        { provide: Location, useClass: LocationStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
