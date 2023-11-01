import { Component } from '@angular/core';
import { LoginFirebaseService } from '../core/service/login-firebase.service';
// var firebase = require('firebase');
// var firebaseui = require('firebaseui');
import * as firebaseui from 'firebaseui';
import { getAuth } from 'firebase/auth';


@Component({
  selector: 'app-login',
  template: `
    <h1 (click)="check()">Welcome to My Awesome App</h1>
    <div id="firebaseui-auth-container"></div>
    <div id="loader">Loading...</div>
      `,
      styles: [
      ]
})
export class LoginComponent {
  


  constructor(private loginService: LoginFirebaseService){};

  check(){
    //const ui = new firebaseui.auth.AuthUI(getAuth());
    this.loginService.checkState();
    console.log('Log check!');

  }


}
