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
  name!: string;
  email!: string;
  message!: string;

  submitForm() {
    const message = `my name is ${this.name}`;
    alert(message);
  }


  constructor(private loginService: LoginFirebaseService){};
  ngOnInit(){}

  check(){
    this.loginService.checkState();
    console.log('Log check!');

  }


}
