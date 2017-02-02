import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { Ng2PaginationModule } from 'ng2-pagination';

import { UsersService } from './services/users.service';
import { QuestionsService } from './services/questions.service';
import { AnswersService } from './services/answers.service';

import { AppRoutingModule } from './app-routing/app-routing.module';

import { AppComponent } from './app.component';
import { QuestionsComponent } from './questions/questions/questions.component';
import { HomeComponent } from './static-pages/home/home.component';
import { QuestionSingleComponent } from './questions/question-single/question-single.component';
import { QuestionFormComponent } from './questions/question-form/question-form.component';
import { AnswerFormComponent } from './answers/answer-form/answer-form.component';
import { AnswersComponent } from './answers/answers/answers.component';

@NgModule({
  declarations: [
    AppComponent,
    QuestionsComponent,
    HomeComponent,
    QuestionSingleComponent,
    QuestionFormComponent,
    AnswerFormComponent,
    AnswersComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    Ng2PaginationModule
  ],
  providers: [
    UsersService,
    QuestionsService,
    AnswersService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
