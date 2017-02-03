import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class QuestionsGuardService implements CanActivate {

  constructor(private _router: Router) { }

  canActivate() {
    if (localStorage.getItem('currentUser')) { return true; }
    this._router.navigate([ 'home' ]);
    return false;
  }
}
