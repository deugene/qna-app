/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import {
  Headers, BaseRequestOptions, Response, HttpModule, Http, XHRBackend,
  ResponseOptions
} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import 'rxjs/add/operator/toPromise';

import { UsersService } from './users.service';
import { User } from '../models/user';

describe('UsersService', () => {

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
        UsersService
      ],
      imports: [ HttpModule ]
    });
  });

  it('should ...', inject([UsersService], (service: UsersService) => {
    expect(service).toBeTruthy();
  }));

  it('should find user by name', async() => {
    async(inject([ UsersService, MockBackend ], (service: UsersService, backend: MockBackend) => {
      backend.connections
        .subscribe((connection: MockConnection) => {
          expect(connection.request.url).toMatch('/api/users/Tony');
          expect(connection.request.method).toEqual('GET');

          connection.mockRespond(
            new Response(
              new ResponseOptions({
                body: {
                  id: 1,
                  name: 'Tony',
                  createdAt: 'today',
                  updatedAt: 'today'
                }
              })
            )
          );
        });

      service.findByName('Tony')
        .then(user => {
          expect(user.id).toEqual(1);
          expect(user.name).toMatch('Tony');
        });
    }));
  });

  it('should create new user', async() => {
    async(inject([ UsersService, MockBackend ], (service: UsersService, backend: MockBackend) => {
      backend.connections
        .subscribe((connection: MockConnection) => {
          expect(connection.request.url).toMatch('/api/users');
          expect(connection.request.getBody().name).toMatch('Tony');
          expect(connection.request.method).toEqual('POST');

          connection.mockRespond(
            new Response(
              new ResponseOptions({
                body: {
                  id: 1,
                  name: 'Tony',
                  createdAt: 'today',
                  updatedAt: 'today'
                }
              })
            )
          );
        });

      service.create(new User('Tony'))
        .then(user => {
          expect(user.id).toEqual(1);
          expect(user.name).toMatch('Tony');
        });
    }));
  });

  it('should update existing user', async() => {
    async(inject([ UsersService, MockBackend ], (service: UsersService, backend: MockBackend) => {
      backend.connections
        .subscribe((connection: MockConnection) => {
          expect(connection.request.url).toMatch('/api/users/1');
          expect(connection.request.getBody().name).toMatch('Bruce');
          expect(connection.request.method).toEqual('PUT');

          connection.mockRespond(
            new Response(
              new ResponseOptions({
                body: {
                  id: 1,
                  name: 'Bruce',
                  createdAt: 'today',
                  updatedAt: 'today'
                }
              })
            )
          );
        });

      service.update(1, { name: 'Bruce' })
        .then(user => {
          expect(user.id).toEqual(1);
          expect(user.name).toMatch('Bruce');
        });
    }));
  });

  it('should delete user', async() => {
    async(inject([ UsersService, MockBackend ], (service: UsersService, backend: MockBackend) => {
      backend.connections
        .subscribe((connection: MockConnection) => {
          expect(connection.request.url).toMatch('/api/users/1');
          expect(connection.request.method).toEqual('DELETE');

          connection.mockRespond(
            new Response(
              new ResponseOptions({
                body: {
                  id: 1,
                  name: 'Tony',
                  createdAt: 'today',
                  updatedAt: 'today'
                }
              })
            )
          );
        });

      service.destroy(1)
        .then(user => {
          expect(user.id).toEqual(1);
          expect(user.name).toMatch('Tony');
        });
    }));
  });

});
