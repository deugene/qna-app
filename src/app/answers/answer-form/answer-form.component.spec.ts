/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { UsersService } from '../../services/users.service';
import { QuestionsService } from '../../services/questions.service';
import { AnswersService } from '../../services/answers.service';

import {
  UserServiceStub, QuestionsServiceStub, AnswersServiceStub
} from '../../../testing/services-stubs';

import { AnswerFormComponent } from './answer-form.component';

describe('AnswerFormComponent', () => {
  let component: AnswerFormComponent;
  let fixture: ComponentFixture<AnswerFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnswerFormComponent ],
      imports: [ FormsModule ],
      providers: [
        { provide: UsersService, useClass: UserServiceStub },
        { provide: QuestionsService, useClass: QuestionsServiceStub },
        { provide: AnswersService, useClass: AnswersServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
