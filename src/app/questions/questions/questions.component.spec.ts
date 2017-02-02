/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Routes } from '@angular/router';
import { By } from '@angular/platform-browser';
import { DebugElement, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { QuestionsComponent } from './questions.component';
import { QuestionFormComponent } from '../question-form/question-form.component';

import { UsersService } from '../../services/users.service';
import {
  QuestionsService,
  PaginationResult,
  QuestionSearchOpts
} from '../../services/questions.service';

import {
  UserServiceStub, QuestionsServiceStub
} from '../../../testing/services-stubs';

import { Ng2PaginationModule } from 'ng2-pagination';

import { Question } from '../../models/question';
import { Answer } from '../../models/answer';

@Component({
  template: ''
})
class DummyComponent {
}

const routes: Routes = [
  { path: 'questions/:questionId', component: DummyComponent }
];

describe('QuestionsComponent', () => {
  let component: QuestionsComponent;
  let fixture: ComponentFixture<QuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        Ng2PaginationModule
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [
        QuestionsComponent,
        DummyComponent
      ],
      providers: [
        { provide: QuestionsService, useClass: QuestionsServiceStub },
        { provide: UsersService, useClass: UserServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'Questions:'`, async(() => {
    const compiled = fixture.debugElement.componentInstance;
    expect(compiled.title).toEqual('Questions:');
  }));

  it('should filter questions', fakeAsync(() => {
    const compiled = fixture.debugElement.nativeElement;

    component.ngOnInit();
    tick();
    fixture.detectChanges();

    expect(compiled.textContent.includes('lorem0')).toBe(true);
    expect(compiled.textContent.includes('lorem1')).toBe(true);
    expect(compiled.textContent.includes('lorem2')).toBe(true);

    const dropdown = compiled.querySelector('.dropdown-toggle');
    expect(dropdown.textContent).toMatch('Filter by answers');
    const all = compiled.querySelector('#allQuestions');
    expect(all.textContent).toMatch('All');
    const answered = compiled.querySelector('#answeredQuestions');
    expect(answered.textContent).toMatch('Answered');
    const unanswered = compiled.querySelector('#unansweredQuestions');
    expect(unanswered.textContent).toMatch('Unanswered');
    const button = compiled.querySelector('#onlyUsersQuestionsSwitch');
    expect(button.textContent).toMatch('Show only my questions');

    answered.click();
    tick();
    fixture.detectChanges();

    expect(compiled.textContent.includes('lorem0')).toBe(false);
    expect(compiled.textContent.includes('lorem1')).toBe(true);

    unanswered.click();
    tick();
    fixture.detectChanges();

    expect(compiled.textContent.includes('lorem0')).toBe(true);
    expect(compiled.textContent.includes('lorem1')).toBe(false);

    all.click();
    tick();
    fixture.detectChanges();

    expect(compiled.textContent.includes('lorem0')).toBe(true);
    expect(compiled.textContent.includes('lorem1')).toBe(true);
    expect(compiled.textContent.includes('lorem2')).toBe(true);

    button.click();
    tick();
    fixture.detectChanges();

    expect(compiled.textContent.includes('lorem0')).toBe(true);
    expect(compiled.textContent.includes('lorem2')).toBe(false);

    button.click();
    tick();
    fixture.detectChanges();

    expect(compiled.textContent.includes('lorem0')).toBe(true);
    expect(compiled.textContent.includes('lorem2')).toBe(true);
  }));

  // it('should render title in a h1 tag', async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('h1').textContent).toContain('app works!');
  // }));

});
