/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import {
  Headers, BaseRequestOptions, Response, HttpModule, Http, XHRBackend,
  ResponseOptions
} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import 'rxjs/add/operator/toPromise';

import { AnswersService } from './answers.service';
import { Answer } from '../classes/answer';

describe('AnswersService', () => {

  beforeEach(async() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Http,
          useFactory: (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [ MockBackend, BaseRequestOptions ]
        },
        MockBackend,
        BaseRequestOptions,
        AnswersService
      ],
      imports: [ HttpModule ]
    });
  });

  it('should ...', inject([AnswersService], (service: AnswersService) => {
    expect(service).toBeTruthy();
  }));

  it('should find all answers on current question', async() => {
    async(inject([ AnswersService, MockBackend ], (service: AnswersService, backend: MockBackend) => {
      backend.connections
        .subscribe((connection: MockConnection) => {
          expect(connection.request.url).toMatch('/api/questions/1/answers');
          expect(connection.request.getBody().offset).toEqual(0);
          expect(connection.request.getBody().limit).toEqual(10);
          expect(connection.request.method).toEqual('POST');

          const data = [
            { id: 1, body: 'lorem0', createdAt: 'today', updatedAt: 'today' },
            { id: 2, body: 'lorem1', createdAt: 'today', updatedAt: 'today' }
          ];
          connection.mockRespond(
            new Response(
              new ResponseOptions({
                body: {
                count: data.length,
                body: data
              }})
            )
          );
        });

      service.findAllByQuestionId(1, { offset: 0, limit: 10 })
        .then(answer => {
          expect(answer.data[0].id).toEqual(1);
          expect(answer.data.length).toEqual(2);
          expect(answer.data[0].body).toMatch('lorem0');
          expect(answer.count).toEqual(2);
        });
    }));
  });

  it('should create new answer', async() => {
    async(inject([ AnswersService, MockBackend ], (service: AnswersService, backend: MockBackend) => {
      backend.connections
        .subscribe((connection: MockConnection) => {
          expect(connection.request.url).toMatch('/api/answers');
          expect(connection.request.getBody().body).toMatch('lorem');
          expect(connection.request.method).toEqual('POST');

          connection.mockRespond(
            new Response(
              new ResponseOptions({
                body: {
                  id: 1,
                  body: 'lorem',
                  createdAt: 'today',
                  updatedAt: 'today'
                }
              })
            )
          );
        });

      service.create(new Answer('lorem'))
        .then(answer => {
          expect(answer.id).toEqual(1);
          expect(answer.body).toMatch('lorem');
        });
    }));
  });

  it('should update existing answer', async() => {
    async(inject([ AnswersService, MockBackend ], (service: AnswersService, backend: MockBackend) => {
      backend.connections
        .subscribe((connection: MockConnection) => {
          expect(connection.request.url).toMatch('/api/answers/1');
          expect(connection.request.getBody().body).toMatch('update');
          expect(connection.request.method).toEqual('PUT');

          connection.mockRespond(
            new Response(
              new ResponseOptions({
                body: {
                  id: 1,
                  body: 'update',
                  createdAt: 'today',
                  updatedAt: 'today'
                }
              })
            )
          );
        });

      service.update(1, { body: 'update' })
        .then(answer => {
          expect(answer.id).toEqual(1);
          expect(answer.body).toMatch('update');
        });
    }));
  });

  it('should delete answer', async() => {
    async(inject([ AnswersService, MockBackend ], (service: AnswersService, backend: MockBackend) => {
      backend.connections
        .subscribe((connection: MockConnection) => {
          expect(connection.request.url).toMatch('/api/answers/1');
          expect(connection.request.method).toEqual('DELETE');

          connection.mockRespond(
            new Response(
              new ResponseOptions({
                body: {
                  id: 1,
                  body: 'lorem',
                  createdAt: 'today',
                  updatedAt: 'today'
                }
              })
            )
          );
        });

      service.destroy(1)
        .then(answer => {
          expect(answer.id).toEqual(1);
          expect(answer.body).toMatch('lorem');
        });
    }));
  });

});
