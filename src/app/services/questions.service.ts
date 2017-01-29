import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

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
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http) { }

  // api interface

  all(searchOpts: QuestionSearchOpts): Promise<PaginationResult> {
    return this.http
      .post(
        `api/questions`,
        JSON.stringify(searchOpts),
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

  findById(id: number): Promise<Question> {
    return this.http
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
    return this.http
      .post(`api/questions`, JSON.stringify(question), { headers: this.headers })
      .toPromise()
      .then(res => {
        const result = res.json();
        if (result.err) { throw result.err; }
        return result.data as Question;
      })
      .catch(this.errorHandler);
  }

  update(id: number, updates: any): Promise<Question> {
    return this.http
      .put(`api/questions/${id}`, JSON.stringify(updates), { headers: this.headers })
      .toPromise()
      .then(res => {
        const result = res.json();
        if (result.err) { throw result.err; }
        return result.data as Question;
      })
      .catch(this.errorHandler);
  }

  destroy(id: number): Promise<Question> {
    return this.http
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
