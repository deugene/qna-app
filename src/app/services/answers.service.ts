import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Answer } from '../models/answer';

import 'rxjs/add/operator/toPromise';

export interface PaginationResult {
  count: number;
  data: Answer[];
}

@Injectable()
export class AnswersService {
  private _headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private _http: Http) { }

  // api interface

  findAllByQuestionId(questionId: number, paginagionOpts: any): Promise<PaginationResult> {
    return this._http
      .post(
        `api/questions/${questionId}/answers`,
        JSON.stringify(paginagionOpts),
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

  create(answer: Answer): Promise<Answer> {
    return this._http
      .post(`api/answers`, JSON.stringify(answer), { headers: this._headers })
      .toPromise()
      .then(res => {
        const result = res.json();
        if (result.err) { throw result.err; }
        return result.data as Answer;
      })
      .catch(this.errorHandler);
  }

  update(id: number, updates: any): Promise<Answer> {
    return this._http
      .put(`api/answers/${id}`, JSON.stringify(updates), { headers: this._headers })
      .toPromise()
      .then(res => {
        const result = res.json();
        if (result.err) { throw result.err; }
        return result.data as Answer;
      })
      .catch(this.errorHandler);
  }

  destroy(id: number): Promise<Answer> {
    return this._http
      .delete(`api/answers/${id}`)
      .toPromise()
      .then(res => {
        const result = res.json();
        if (result.err) { throw result.err; }
        return result.data as Answer;
      })
      .catch(this.errorHandler);
  }

  errorHandler(err: any): void {
    console.error(err);
  }

}
