/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { HomeComponent } from './home.component';
import { UsersService } from '../../services/users.service';

import { UserServiceStub } from '../../../testing/services-stubs';

import { User } from '../../models/user';

class MockRouter {
  navigate = jasmine.createSpy('navigate');
};

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      imports: [ FormsModule ],
      providers: [
        { provide: UsersService, useClass: UserServiceStub },
        { provide: Router, useClass: MockRouter }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'Welcome to the QnA App!'`, async(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual(
      'Welcome to the QnA App!'
    );
  }));

  it('should have form tag with single name input', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('form')).toBeTruthy();
    expect(compiled.querySelectorAll('input').length).toEqual(1);
  }));

  it('should navigate to all questions if name is valid and user exists',
    async(inject([Router], (router: Router) => {
      fixture.whenStable()
        .then(() => {
          component.nameForm.controls['name'].setValue('Tony');
          expect(component.nameForm.form.valid).toBe(true);
          component.onSubmit();
          setTimeout(() => {
            expect(router.navigate).toHaveBeenCalledWith([ 'questions' ]);
          }, 10);
        });
    })));

  it('should confirm creation of new user',
    async(inject([Router], (router: Router) => {
      fixture.whenStable()
        .then(() => {
          const spy = spyOn(window, 'confirm').and.returnValue(true);
          component.nameForm.controls['name'].setValue('Steve');
          expect(component.nameForm.form.valid).toBe(true);
          component.onSubmit();
          setTimeout(() => {
            const confirmationMessage = spy.calls.first().args[0];
            expect(confirmationMessage).toMatch('User Not Found. Create new user?');
            expect(router.navigate).toHaveBeenCalledWith([ 'questions' ]);
          }, 10);
        });
    })));

  it('should not navigate to all questions if name is invalid',
    async(inject([Router], (router: Router) => {
      fixture.whenStable()
        .then(() => {
          component.nameForm.controls['name'].setValue('To');
          component.name = 'To';
          expect(component.nameForm.form.valid).toBe(false);
          component.onSubmit();
          setTimeout(() => {
            expect(router.navigate).toHaveBeenCalledTimes(0);
          }, 10);
        });
    })));

  // it('should render title in a h1 tag', async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('h1').textContent).toContain('app works!');
  // }));

  // it('should not navigate to all questions if name is invalid',
  //   async(inject([Router], (router: Router) => {
  //     fixture.whenStable()
  //       .then(() => {
  //         const compiled = fixture.debugElement.nativeElement;
  //         const nameField = compiled.querySelector('#name');
  //         nameField.value = 'To';
  //         nameField.dispatchEvent(new Event('input'));
  //         fixture.whenStable()
  //           .then(() => {
  //             component.nameForm.controls['name'].setValue('To');
  //             expect(component.nameForm.form.valid).toBe(false);
  //             compiled.querySelector('#submit').classList;
  //             setTimeout(() => {
  //               expect(router.navigate).toHaveBeenCalledTimes(0);
  //             }, 10);
  //           });
  //       });
  //   })));

});
