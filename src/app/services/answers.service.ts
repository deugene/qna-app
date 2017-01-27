import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Answer } from '../classes/answer';

import 'rxjs/add/operator/toPromise';

export interface PaginationResult {
  count: number;
  data: Answer[];
}

@Injectable()
export class AnswersService {
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http) { }

  // api interface

  findAllByQuestionId(questionId: number, paginagionOpts: any): Promise<PaginationResult> {
    return this.http
      .post(
        `api/questions/${questionId}/answers`,
        JSON.stringify(paginagionOpts),
        { headers: this.headers }
      )
      .toPromise()
      .then(res => {
        const result = res.json();
        if (result.err) { throw result.err; }
        return result.data as PaginationResult;
      })
      .catch(this.errorHandler);
  }

  create(answer: Answer): Promise<Answer> {
    return this.http
      .post(`api/answers`, JSON.stringify(answer), { headers: this.headers })
      .toPromise()
      .then(res => {
        const result = res.json();
        if (result.err) { throw result.err; }
        return result.data as Answer;
      })
      .catch(this.errorHandler);
  }

  update(id: number, updates: Answer): Promise<Answer> {
    return this.http
      .put(`api/answers/${id}`, JSON.stringify(updates), { headers: this.headers })
      .toPromise()
      .then(res => {
        const result = res.json();
        if (result.err) { throw result.err; }
        return result.data as Answer;
      })
      .catch(this.errorHandler);
  }

  destroy(id: number): Promise<Answer> {
    return this.http
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
