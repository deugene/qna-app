/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Routes } from '@angular/router';

import { DummyComponent } from '../../testing/components-stubs';
import { QuestionsGuardService } from './questions-guard.service';

const routes: Routes = [
  { path: 'questions', component: DummyComponent }
];

describe('QuestionsGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ QuestionsGuardService ],
      imports: [ RouterTestingModule.withRoutes(routes) ],
      declarations: [ DummyComponent ]
    });
  });

  it('should ...', inject([QuestionsGuardService], (service: QuestionsGuardService) => {
    expect(service).toBeTruthy();
  }));
});
