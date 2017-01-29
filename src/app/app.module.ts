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
import { DialogComponent } from './dialog/dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    QuestionsComponent,
    HomeComponent,
    DialogComponent
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
