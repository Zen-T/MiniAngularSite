import { Component } from '@angular/core';
import { FirestoreService } from '../../service/firestore.service';
import { AuthFirebaseService } from '../../service/auth-firebase.service';
import { onIdTokenChanged } from 'firebase/auth';

@Component({
  selector: 'app-header',
  template: `
    <link rel="stylesheet" href="header.component.css">

    <nav class="navbar is-dark top-navbar">
      
      <!-- logo -->
      <div class="navbar-brand">
        <a class="navbar-item" routerLink="">
          <img src="assets/logo/logo_miku.svg">
        </a>
      </div>
      
      <!-- menu -->
      <!-- navbar-menu the right side, hidden on touch devices, visible on desktop (>= 1024px) -->
      <div class="navbar-menu" id="navbarBasicExample">
        <div class="navbar-end">
          <a class="navbar-item" routerLink="">Home</a>
          <a class="navbar-item" routerLink="contact">Contact</a>
          <a class="navbar-item" routerLink="users">Github User</a>
          <a class="navbar-item" routerLink="cars">Cars</a>
          <a class="navbar-item" routerLink="pricewatch">PriceWatch</a>
          <a class="navbar-item" routerLink="reconstruct3d">3D reconstruction</a>
          <a class="navbar-item" routerLink="mindmap">Mind Map</a>
          <a class="navbar-item" routerLink="todolist">To Do</a>
          <a class="navbar-item" routerLink="bot">聊天</a>
        </div>
      </div>

      <!-- menu -->
      <!-- navbar-burger visible on touch devices, hidden on desktop -->
      <button mat-button [matMenuTriggerFor]="menu" class="navbar-burger">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <mat-menu #menu="matMenu">
          <a mat-menu-item routerLink="">Home</a>
          <a mat-menu-item routerLink="contact">Contact</a>
          <a mat-menu-item routerLink="users">Github User</a>
          <a mat-menu-item routerLink="cars">Cars</a>
          <a mat-menu-item routerLink="pricewatch">PriceWatch</a>
          <a mat-menu-item routerLink="reconstruct3d">3D reconstruction</a>
          <a mat-menu-item routerLink="mindmap">Mind Map</a>
          <a mat-menu-item routerLink="todolist">To Do</a>
          <a mat-menu-item routerLink="bot">聊天</a>
        </mat-menu>
      </button>

      <!-- user item -->
      <a mat-button class="user-item" routerLink="login">
        <img class="user-icon" src="assets/icon/miku.png">
        <span> {{userName}} </span>
      </a>


    </nav>
  `,
  styles: [
  ]
})
export class HeaderComponent {
  userName: string = "";
  userID: string | null= "";
  
  constructor(
    private dbService: FirestoreService,
    private authService: AuthFirebaseService
    ){
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


  
}
