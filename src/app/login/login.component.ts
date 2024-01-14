import { Component, OnInit } from '@angular/core';
import { AuthFirebaseService } from '../core/service/auth-firebase.service';
import { onAuthStateChanged, onIdTokenChanged } from "firebase/auth";
import { FirestoreService } from '../core/service/firestore.service';

@Component({
  selector: 'app-login',
  template: `
    
    <section class="section">
    <div class="container">
      <form #contactForm="ngForm">
        <!-- email -->
        <div class="field">
          <label class="label">Email address</label>
          <input 
            type="email" 
            name="email" 
            class="email" 
            [(ngModel)]="email"
            #emailInput="ngModel"
            required
            email
            >
            <div class="help is-error" *ngIf="emailInput.invalid && emailInput.touched">email address not valid</div>
        </div>
        
        <!-- password -->
        <div class="field">
          <label class="label">Password</label>
          <input 
            type="text" 
            name="Password" 
            class="input" 
            [(ngModel)]="password" 
            #passwordInput="ngModel"
            required>
          <div class="help is-error" *ngIf="passwordInput.invalid && passwordInput.touched">name can not be empty</div>
        </div>

        <!-- user name -->
        <div class="field">
          <label class="label">user name</label>
          <input 
            type="text" 
            name="userName" 
            class="input" 
            [(ngModel)]="userName" 
            #passwordInput="ngModel"
            placeholder={{userName}}
            >
          <div class="help is-error" *ngIf="passwordInput.invalid && passwordInput.touched">name can not be empty</div>
        </div>

        <!-- button -->
        <button (click)="signUp()" type="submit" class="button is-large is-warning" [disabled]="contactForm.invalid || userID">Sign up</button>
        <button (click)="logIn()" type="submit" class="button is-large is-warning" [disabled]="contactForm.invalid || userID">Log in</button>
        <button (click)="logOut()" type="submit" class="button is-large is-warning" [disabled]="!userID">Log out</button>
        <button (click)="updateUserName()" type="submit" class="button is-large is-warning" [disabled]="!userID">update user name</button>

        {{ userID }}
      </form>
    </div>

    </section>

    `,
    styles: [
    ]
})
export class LoginComponent implements OnInit {
  email!: string;
  password!: string;
  userID!: string | null;
  userName!: string;

  constructor(private authService: AuthFirebaseService, private dbService: FirestoreService){};

  ngOnInit(){
    onIdTokenChanged(this.authService.auth, async (user) => {
      if (user) {
        this.userID = user.uid;
        const userInfo = await this.dbService.retrieveDocDate("");
        this.userName = userInfo.userName;
      } else {
        this.userID = null;
      }
    });
  }

  async signUp(){
    await this.authService.userSignUp(this.email, this.password);
  }

  async logIn() {
    await this.authService.userLogIn(this.email, this.password);
  }

  async logOut(){
    await this.authService.userLogOut();
  }

  async updateUserName(){
    await this.dbService.addMapInDoc("",{userName: this.userName});
  }
}
