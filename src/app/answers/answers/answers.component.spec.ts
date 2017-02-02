/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { Ng2PaginationModule } from 'ng2-pagination';

import { UsersService } from '../../services/users.service';
import { AnswersService } from '../../services/answers.service';

import {
  UserServiceStub,
  AnswersServiceStub
} from '../../../testing/services-stubs';

import { AnswersComponent } from './answers.component';

describe('AnswersComponent', () => {
  let component: AnswersComponent;
  let fixture: ComponentFixture<AnswersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnswersComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      imports: [ Ng2PaginationModule ],
      providers: [
        { provide: UsersService, useClass: UserServiceStub },
        { provide: AnswersService, useClass: AnswersServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
