import { Component, OnInit } from '@angular/core';
import { AuthFirebaseService } from '../core/service/auth-firebase.service';
import { AuthErrorCodes, onIdTokenChanged } from "firebase/auth";
import { FirestoreService } from '../core/service/firestore.service';
import { FirebaseError } from '@firebase/app';

@Component({
  selector: 'app-login',
  template: `
    <link rel="stylesheet" href="login.component.css">
    
    <div class="container">
      <!-- warning message -->
      <div class="message is-danger error-chat" *ngIf="errorMessage">
        <div class="message-header">
          <p>发生错误</p>
          <button class="delete" aria-label="delete" (click)="clearErrorMess()"></button>
        </div>
        <div class="message-body">
          {{ errorMessage | json }}
        </div>
      </div>

      <!-- welcome info -->
      <h1 *ngIf="userID">欢迎回来,{{userName}} </h1>
      <!-- login form -->
      <form #contactForm="ngForm">
        <!-- email -->
        <div *ngIf="!userID" class="field">
          <label class="label">邮箱地址</label>
          <input 
            type="email" 
            name="email" 
            class="email" 
            [(ngModel)]="email"
            #emailInput="ngModel"
            required
            email
            >
            <div class="help is-error" *ngIf="emailInput.invalid && emailInput.touched">邮箱格式错误</div>
        </div>
        
        <!-- password -->
        <div *ngIf="!userID" class="field">
          <label class="label">密码</label>
          <input 
            type="text" 
            name="Password" 
            class="input" 
            [(ngModel)]="password" 
            #passwordInput="ngModel"
            required>
          <div class="help is-error" *ngIf="passwordInput.invalid && passwordInput.touched">密码不能为空</div>
        </div>

        <!-- user name -->
        <div class="field">
          <label class="label">用户昵称</label>
          <input 
            type="text" 
            name="newUserName" 
            class="input" 
            [(ngModel)]="newUserName" 
            #newUserNameInput="ngModel"
            placeholder={{userName}}
            >
        </div>

        <!-- button -->
        <div class="buttons">
          <button *ngIf="!userID" (click)="logIn()" type="submit" class="button is-large is-warning" [disabled]="contactForm.invalid">登录</button>
          <button *ngIf="!userID" (click)="signUp()" type="submit" class="button is-large is-warning" [disabled]="contactForm.invalid || !newUserName">注册账户</button>
          <button *ngIf="userID" (click)="updateUserName()" type="submit" class="button is-large is-warning" [disabled]="!userID">更新用户名</button>
          <button *ngIf="userID" (click)="logOut()" type="submit" class="button is-large is-warning" [disabled]="!userID">退出登录</button>
        </div>
      </form>
    </div>


    `,
    styles: [
    ]
})
export class LoginComponent implements OnInit {
  email!: string;
  password!: string;
  userID!: string | null;
  userName!: string;
  newUserName!: string;
  errorMessage!:any;

  constructor(private authService: AuthFirebaseService, private dbService: FirestoreService){};

  ngOnInit(){
    onIdTokenChanged(this.authService.auth, async (user) => {
      if (user) {
        this.userID = user.uid;
        const userInfo = await this.dbService.retrieveDocDate("");
        this.userName = userInfo.userName;
      } else {
        this.userID = null;
        this.userName = "";
      }
    });
  }

  async signUp(){
    try{
      const cred = await this.authService.userSignUp(this.email, this.password);
      this.updateUserName()
      this.clearErrorMess()
    }
    catch(error){
      this.errorMessage = error;
      if(error instanceof FirebaseError){
        if(error.code == "auth/email-already-in-use"){
          this.errorMessage = "用户已存在";
        }
      }
     }
  }

  async logIn() {
    try{
      const cred = await this.authService.userLogIn(this.email, this.password);
      this.clearErrorMess()
    }
    catch(error){
      this.errorMessage = error;
      console.log(error)
      if(error instanceof FirebaseError){
        if(error.code == AuthErrorCodes.INVALID_PASSWORD){
          this.errorMessage = "密码错误";
        }
      }
    }
  }

  async logOut(){
    try{
      const cred = await this.authService.userLogOut();
      this.clearErrorMess()
    }
    catch(error){
      this.errorMessage = error;
    }
  }

  async updateUserName(){
    if(this.userName != this.newUserName){
      try{
        await this.dbService.addMapInDoc("",{userName: this.newUserName});
        this.newUserName = "";
        const userInfo = await this.dbService.retrieveDocDate("");
        this.userName = userInfo.userName;
      }
      catch(error){}
    }
    
  }

  clearErrorMess(){
    this.errorMessage = false;
  }
}
