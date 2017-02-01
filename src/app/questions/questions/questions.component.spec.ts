/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { QuestionsComponent } from './questions.component';
import { Question } from '../../classes/question';
import { Answer } from '../../classes/answer';

import {
  QuestionsService,
  PaginationResult,
  QuestionSearchOpts
} from '../../services/questions.service';

class MockQuestionsService {
  private _questions = [
    new Question('lorem0', 'lorem0', 1, [ ]              , 1, 'today', 'today'),
    new Question('lorem1', 'lorem1', 1, [ { body: '1' } ], 2, 'today', 'today'),
    new Question('lorem2', 'lorem2', 2, [ { body: '1' } ], 3, 'today', 'today'),
    new Question('lorem3', 'lorem3', 2, [ { body: '1' } ], 4, 'today', 'today'),
    new Question('lorem4', 'lorem4', 2, [ ]              , 5, 'today', 'today'),
    new Question('lorem5', 'lorem5', 1, [ { body: '1' } ], 6, 'today', 'today'),
  ];

  all(searchOpts: QuestionSearchOpts): Promise<PaginationResult> {
    let res = this._questions;
    if (searchOpts.userId) {
      res = res.filter(q => q.userId === searchOpts.userId);
    }
    if (searchOpts.status === 'answered') {
      res = res.filter(q => q.answers.length > 0);
    }
    if (searchOpts.status === 'unnswered') {
      res = res.filter(q => q.answers.length === 0);
    }

    return Promise.resolve({
      count: res.length,
      data: res.slice(searchOpts.offset, searchOpts.limit)
    });
  }
  findById(id: number): Promise<Question> {
    return Promise.resolve(new Question('lorem', 'lorem', 1, [], id));
  }
  create(question: Question): Promise<Question> {
    return Promise.resolve(new Question('lorem', 'lorem'));
  }
  update(id: number, updates: Question): Promise<Question> {
    const newQuestion = new Question('lorem', 'lorem');
    Object.assign(newQuestion, updates);
    return Promise.resolve(newQuestion);
  }
  destroy(id: number): Promise<Question> {
    return Promise.resolve(new Question('lorem', 'lorem', 1, [], id));
  }
}

fdescribe('QuestionsComponent', () => {
  let component: QuestionsComponent;
  let fixture: ComponentFixture<QuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionsComponent ],
      providers: [
        { provide: QuestionsService, useClass: MockQuestionsService }
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

  it(`should have as title 'Questions'`, async(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Questions');
  }));

  // it('should render title in a h1 tag', async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('h1').textContent).toContain('app works!');
  // }));

  it('should have bottons All, Answered and Unanswered', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#all').textContent).toMatch('All');
    expect(compiled.querySelector('#answered').textContent).toMatch('Answered');
    expect(compiled.querySelector('#unanswered').textContent).toMatch('Unanswered');
    expect(compiled.querySelector('#myQuestions').textContent).toMatch('Show only my questions');
    component.myOrAllUsersQuestionsSwitch();
    expect(compiled.querySelector('#myQuestions')).toBeFalsy();
    expect(compiled.querySelector('#allUsersQuestions').textContent).toMatch('Show only my questions');
    component.myOrAllUsersQuestionsSwitch();
    expect(compiled.querySelector('#allUsersQuestions')).toBeFalsy();
    expect(compiled.querySelector('#myQuestions').textContent).toMatch('Show only my questions');
  }));

  describe('All, Answered and Unanswered buttons', () => {
    it('should change questions content', async(() => {
      component.ngOnInit();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('#all').classList.contains('active')).toBeTruthy();
      expect(compiled.textContent).toContain('lorem0');
      expect(compiled.textContent).toContain('lorem2');
      const answeredSearchOpts: QuestionSearchOpts = {
        offset: 0, limit: 10, status: 'answered'
      };
      component.all(answeredSearchOpts);
      expect(compiled.textContent).toContain('lorem1');
      expect(compiled.textContent.includes('lorem0')).toBe(false);
      const unansweredSearchOpts: QuestionSearchOpts = {
        offset: 0, limit: 10, status: 'unanswered'
      };
      component.all(unansweredSearchOpts);
      expect(compiled.textContent).toContain('lorem0');
      expect(compiled.textContent.includes('lorem1')).toBe(false);
      component.all({ offset: 0, limit: 10 });
      component.myOrAllUsersQuestionsSwitch();
      expect(compiled.textContent).toContain('lorem0');
      expect(compiled.textContent.includes('lorem1')).toBe(false);
    }));
  });



});
