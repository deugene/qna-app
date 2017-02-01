import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Question } from '../classes/question';

import 'rxjs/add/operator/toPromise';

export interface PaginationResult {
  count: number;
  data: Question[];
}

export interface QuestionSearchOpts {
  offset: number;
  limit: number;
  userId?: number;
  status?: string;
}

@Injectable()
export class QuestionsService {
  private _headers = new Headers({ 'Content-Type': 'application/json' });

  private _currentQuestion = new BehaviorSubject<Question>(null);
  currentQuestion$ = this._currentQuestion.asObservable();

  constructor(private _http: Http) { }

  setCurrentQuestion(question: Question) {
    this._currentQuestion.next(question);
  }

  // api interface

  all(searchOpts: QuestionSearchOpts): Promise<PaginationResult> {
    return this._http
      .post(
        `api/questions/all`,
        JSON.stringify(searchOpts),
        { headers: this._headers }
      )
      .toPromise()
      .then(res => {
        const result = res.json();
        if (result.err) { throw result.err; }
        return result as PaginationResult;
      })
      .catch(this.errorHandler);
  }

  findById(id: number): Promise<Question> {
    return this._http
      .get(`api/questions/${id}`)
      .toPromise()
      .then(res => {
        const result = res.json();
        if (result.err && result.err.message !== 'Question Not Found') {
          throw result.err;
        } else if (result.err && result.err.message === 'Question Not Found') {
          result.data = null;
        }
        return result.data as Question;
      })
      .catch(this.errorHandler);
  }

  create(question: Question): Promise<Question> {
    return this._http
      .post(`api/questions`, JSON.stringify(question), { headers: this._headers })
      .toPromise()
      .then(res => {
        const result = res.json();
        if (result.err) { throw result.err; }
        return result.data as Question;
      })
      .catch(this.errorHandler);
  }

  update(id: number, updates: any): Promise<Question> {
    return this._http
      .put(`api/questions/${id}`, JSON.stringify(updates), { headers: this._headers })
      .toPromise()
      .then(res => {
        const result = res.json();
        if (result.err) { throw result.err; }
        return result.data as Question;
      })
      .catch(this.errorHandler);
  }

  destroy(id: number): Promise<Question> {
    return this._http
      .delete(`api/questions/${id}`)
      .toPromise()
      .then(res => {
        const result = res.json();
        if (result.err) { throw result.err; }
        return result.data as Question;
      })
      .catch(this.errorHandler);
  }

  errorHandler(err: any): void {
    console.error(err);
  }

}
