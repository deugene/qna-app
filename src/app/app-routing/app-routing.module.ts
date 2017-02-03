import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { QuestionsComponent } from '../questions/questions/questions.component';
import { QuestionFormComponent } from '../questions/question-form/question-form.component';
import { QuestionSingleComponent } from '../questions/question-single/question-single.component';
import { HomeComponent } from '../static-pages/home/home.component';

import { UsersService } from '../services/users.service';

import { QuestionsGuardService } from '../services/questions-guard.service';
import { HomeGuardService } from '../services/home-guard.service';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'questions',
    component: QuestionsComponent,
    canActivate: [ QuestionsGuardService ]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [ HomeGuardService ]
  },
  {
    path: 'questions/:questionId',
    component: QuestionSingleComponent,
    canActivate: [ QuestionsGuardService ]
  },
  {
    path: 'questions/:questionId/edit',
    component: QuestionFormComponent,
    canActivate: [ QuestionsGuardService ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  providers: [
    QuestionsGuardService,
    HomeGuardService
  ]
})
export class AppRoutingModule { }
