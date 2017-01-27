/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import {
  Headers, BaseRequestOptions, Response, HttpModule, Http, XHRBackend,
  ResponseOptions
} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import 'rxjs/add/operator/toPromise';

import { QuestionsService } from './questions.service';
import { Question } from '../classes/question';

describe('QuestionsService', () => {

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
        QuestionsService
      ],
      imports: [ HttpModule ]
    });
  });

  it('should ...', inject([QuestionsService], (service: QuestionsService) => {
    expect(service).toBeTruthy();
  }));

  it('should find all questions', async() => {
    async(inject([ QuestionsService, MockBackend ], (service: QuestionsService, backend: MockBackend) => {
      backend.connections
        .subscribe((connection: MockConnection) => {
          expect(connection.request.url).toMatch('/api/questions/all');
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

      service.all({ offset: 0, limit: 10 })
        .then(question => {
          expect(question.data[0].id).toEqual(1);
          expect(question.data.length).toEqual(2);
          expect(question.data[0].body).toMatch('lorem0');
          expect(question.count).toEqual(2);
        });
    }));
  });

  it('should find question by id', async() => {
    async(inject([ QuestionsService, MockBackend ], (service: QuestionsService, backend: MockBackend) => {
      backend.connections
        .subscribe((connection: MockConnection) => {
          expect(connection.request.url).toMatch('/api/questions/1');
          expect(connection.request.method).toEqual('GET');
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

      service.findById(1)
        .then(question => {
          expect(question.id).toEqual(1);
          expect(question.body).toMatch('lorem');
        });
    }));
  });

  it('should create new question', async() => {
    async(inject([ QuestionsService, MockBackend ], (service: QuestionsService, backend: MockBackend) => {
      backend.connections
        .subscribe((connection: MockConnection) => {
          expect(connection.request.url).toMatch('/api/questions');
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

      service.create(new Question('lorem'))
        .then(question => {
          expect(question.id).toEqual(1);
          expect(question.body).toMatch('lorem');
        });
    }));
  });

  it('should update existing question', async() => {
    async(inject([ QuestionsService, MockBackend ], (service: QuestionsService, backend: MockBackend) => {
      backend.connections
        .subscribe((connection: MockConnection) => {
          expect(connection.request.url).toMatch('/api/questions/1');
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
        .then(question => {
          expect(question.id).toEqual(1);
          expect(question.body).toMatch('update');
        });
    }));
  });

  it('should delete question', async() => {
    async(inject([ QuestionsService, MockBackend ], (service: QuestionsService, backend: MockBackend) => {
      backend.connections
        .subscribe((connection: MockConnection) => {
          expect(connection.request.url).toMatch('/api/questions/1');
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
        .then(question => {
          expect(question.id).toEqual(1);
          expect(question.body).toMatch('lorem');
        });
    }));
  });

});
