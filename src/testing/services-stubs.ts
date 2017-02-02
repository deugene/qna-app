import {
  PaginationResult,
  QuestionSearchOpts
} from '../app/services/questions.service';

import { User } from '../app/models/user';
import { Question } from '../app/models/question';
import { Answer } from '../app/models/answer';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class UserServiceStub {
  private _users: User[] = [
    new User('Tony', 1, 'today', 'today'),
    new User('Bruce', 2, 'today', 'today')
  ];

  private _currentUser = new BehaviorSubject<User>(this._users[0]);

  currentUser$ = this._currentUser.asObservable();

  setCurrentUser(user: User) {
    this._currentUser.next(user);
  }

  findByName(name: string): Promise<User> {
    return Promise.resolve(this._users.find(u => u.name === name));
  }
  create(user: User): Promise<User> {
    const newUser = new User(user.name);
    Object.assign(newUser, user);
    return Promise.resolve(newUser);
  }
  update(id: number, updates: User): Promise<User> {
    const updatedUser = this._users.find(u => u.id === id);
    Object.assign(updatedUser, updates);
    return Promise.resolve(updatedUser);
  }
  destroy(id: number): Promise<User> {
    const deletedUser = this._users.find(u => u.id === id);
    return Promise.resolve(deletedUser);
  }
};

export class QuestionsServiceStub {
  private _questions = [
    new Question('lorem0', 'lorem0', 1, [ ]              , 1, 'today', 'today', { name: 'Tony' }),
    new Question('lorem1', 'lorem1', 1, [ { body: '1' } ], 2, 'today', 'today', { name: 'Tony' }),
    new Question('lorem2', 'lorem2', 2, [ { body: '1' } ], 3, 'today', 'today', { name: 'Tony' }),
    new Question('lorem3', 'lorem3', 2, [ { body: '1' } ], 4, 'today', 'today', { name: 'Tony' }),
    new Question('lorem4', 'lorem4', 2, [ ]              , 5, 'today', 'today', { name: 'Tony' }),
    new Question('lorem5', 'lorem5', 1, [ { body: '1' } ], 6, 'today', 'today', { name: 'Tony' })
  ];

  private _currentQuestion = new BehaviorSubject<Question>(this._questions[1]);
  currentQuestion$ = this._currentQuestion.asObservable();

  setCurrentQuestion(question: Question) {
    this._currentQuestion.next(question);
  }

  all(searchOpts: QuestionSearchOpts): Promise<PaginationResult> {
    let res = this._questions;
    if (searchOpts.userId) {
      res = res.filter(q => q.userId === searchOpts.userId);
    }
    if (searchOpts.status === 'answered') {
      res = res.filter(q => q.answers.length > 0);
    }
    if (searchOpts.status === 'unanswered') {
      res = res.filter(q => q.answers.length === 0);
    }

    return Promise.resolve({
      count: res.length,
      data: res.slice(searchOpts.offset, searchOpts.limit + 1)
    });
  }
  findById(id: number): Promise<Question> {
    return Promise.resolve(new Question('lorem', 'lorem', 1, [], id));
  }
  create(question: Question): Promise<Question> {
    const id = this._questions.reduce((curr, max) => curr > max ? curr : max).id + 1;
    return Promise.resolve(new Question('lorem', 'lorem', 1, [], id));
  }
  update(id: number, updates: Question): Promise<Question> {
    const updatedQuestion = new Question('lorem', 'lorem', 1, [], id);
    Object.assign(updatedQuestion, updates);
    return Promise.resolve(updatedQuestion);
  }
  destroy(id: number): Promise<Question> {
    return Promise.resolve(new Question('lorem', 'lorem', 1, [], id));
  }
}

export class AnswersServiceStub {
  private _answers = [
    new Answer('lorem0', 1, 1, 1, 'today', 'today'),
    new Answer('lorem1', 1, 1, 2, 'today', 'today'),
    new Answer('lorem2', 1, 1, 3, 'today', 'today')
  ];

  findAllByQuestionId(questionId: number, paginagionOpts: any): Promise<PaginationResult> {
    let res = this._answers;
    if (questionId) {
      res = res.filter(a => a.questionId === questionId);
    }

    return Promise.resolve({
      count: res.length,
      data: res.slice(paginagionOpts.offset, paginagionOpts.limit + 1)
    });
  }
  create(answer: Answer): Promise<Answer> {
    const id = this._answers.reduce((curr, max) => curr > max ? curr : max).id + 1;
    return Promise.resolve(new Answer(`lorem${id + 1}`, 1, 1, id));
  }
  update(id: number, updates: Answer): Promise<Answer> {
    const updatedAnswer = new Answer('lorem', 1, 1, id);
    Object.assign(updatedAnswer, updates);
    return Promise.resolve(updatedAnswer);
  }
  destroy(id: number): Promise<Answer> {
    return Promise.resolve(new Answer('lorem', 1, 1, id));
  }
}
