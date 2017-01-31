import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { QuestionsComponent } from '../questions/questions/questions.component';
import { QuestionFormComponent } from '../questions/question-form/question-form.component';
import { QuestionSingleComponent } from '../questions/question-single/question-single.component';
import { HomeComponent } from '../static-pages/home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'questions', component: QuestionsComponent },
  { path: 'home', component: HomeComponent },
  { path: 'questions/:questionId', component: QuestionSingleComponent },
  { path: 'questions/:questionId/edit', component: QuestionFormComponent }

]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
