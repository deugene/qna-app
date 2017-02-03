/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Routes } from '@angular/router';

import { DummyComponent } from '../../testing/components-stubs';
import { HomeGuardService } from './home-guard.service';

const routes: Routes = [
  { path: 'questions', component: DummyComponent }
];

describe('HomeGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ HomeGuardService ],
      imports: [ RouterTestingModule.withRoutes(routes) ],
      declarations: [ DummyComponent ]
    });
  });

  it('should ...', inject([HomeGuardService], (service: HomeGuardService) => {
    expect(service).toBeTruthy();
  }));
});
