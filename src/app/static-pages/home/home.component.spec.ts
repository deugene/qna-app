/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';

import { HomeComponent } from './home.component';
import { UsersService } from '../../services/users.service';

import { User } from '../../classes/user';


const MockUserService = {
  findByname(name: string): Promise<User> {
    return Promise.resolve(new User(name));
  },
  create(user: User): Promise<User> {
    const newUser = new User(user.name);
    Object.assign(newUser, user);
    return Promise.resolve(newUser);
  },
  update(id: number, updates: User): Promise<User> {
    const updatedUser = new User('Tony');
    Object.assign(updatedUser, updates);
    return Promise.resolve(updatedUser);
  },
  destroy(id: number): Promise<User> {
    return Promise.resolve(new User('Tony', id));
  }
};

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      imports: [ FormsModule ],
      providers: [ { provide: UsersService, useValue: MockUserService } ]
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

  it(`should have as title 'Welcome to the QnA App! Please enter your name to start!'`, async(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual(
      'Welcome to the QnA App! Please enter your name to start!'
    );
  }));

  // it('should render title in a h1 tag', async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('h1').textContent).toContain('app works!');
  // }));

  it('should have form tag with single name input', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('form')).toBeTruthy();
    expect(compiled.querySelectorAll('input').length).toEqual(1);
  }));
});
