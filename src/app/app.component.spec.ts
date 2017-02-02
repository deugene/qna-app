/* tslint:disable:no-unused-variable */

import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { UsersService } from './services/users.service';

import { UserServiceStub } from '../testing/services-stubs';

import { AppComponent } from './app.component';

@Component({
  template: ''
})
class DummyComponent {
}

const routes: Routes = [
  { path: '', component: DummyComponent }
];

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        DummyComponent
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      imports: [
        RouterTestingModule.withRoutes(routes),
        FormsModule
      ],
      providers: [
        { provide: UsersService, useClass: UserServiceStub }
      ]
    });
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'Q&A App'`, fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const appDom = fixture.debugElement.componentInstance;
    const app = fixture.componentInstance;
    app.ngOnInit();
    expect(appDom.title).toEqual('Q&A App');
  }));

  it('should have router-outlet tag', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  }));

  // it('should render title in a h1 tag', async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('h1').textContent).toContain('app works!');
  // }));

});
