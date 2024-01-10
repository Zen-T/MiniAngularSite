import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FirestoreService } from '../../service/firestore.service';
import { AuthFirebaseService } from '../../service/auth-firebase.service';
import { onIdTokenChanged } from 'firebase/auth';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  template: `
    <link rel="stylesheet" href="header.component.css">

    <nav class="navbar is-dark top-navbar">
      
      <!-- logo -->
      <div class="navbar-brand">
        <a class="navbar-item navbar-logo" routerLink="">
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
          <a class="navbar-item" routerLink="display">开奔驰</a>
        </div>
      </div>

      <!-- menu -->
      <!-- navbar-burger visible on touch devices, hidden on desktop -->
      <button mat-button [matMenuTriggerFor]="menu" class="navbar-burger" (click)="highLightSelectedNavRoute(currentUrl)">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <mat-menu #menu="matMenu">
          <a class="navUrl" mat-menu-item routerLink="">Home</a>
          <a class="navUrl" mat-menu-item routerLink="contact">Contact</a>
          <a class="navUrl" mat-menu-item routerLink="users">Github User</a>
          <a class="navUrl" mat-menu-item routerLink="cars">Cars</a>
          <a class="navUrl" mat-menu-item routerLink="pricewatch">PriceWatch</a>
          <a class="navUrl" mat-menu-item routerLink="reconstruct3d">3D reconstruction</a>
          <a class="navUrl" mat-menu-item routerLink="mindmap">Mind Map</a>
          <a class="navUrl" mat-menu-item routerLink="todolist">To Do</a>
          <a class="navUrl" mat-menu-item routerLink="bot">聊天</a>
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
export class HeaderComponent implements OnInit{
  userName: string = "";
  currentUrl: string = "";
  
  constructor(
    private dbService: FirestoreService,
    private authService: AuthFirebaseService,
    private router: Router,
    private renderer: Renderer2, 
    private el: ElementRef
    ){
      onIdTokenChanged(this.authService.auth, async (user) => {
        if (user) {
          // subscribe database user name changes
          onSnapshot(doc(this.dbService.db, "Users", user.uid), async (doc) => {
            const userInfo = await this.dbService.retrieveDocDate("");
            this.userName = userInfo.userName;
          });
        } else {
          this.userName = "";
        }
      });
  }

  ngOnInit(){
    // 高亮选中的链接按钮
    this.router.events.subscribe(event => {
      // 在路由变化时，检查当前路由路径并更新样式
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
        this.highLightSelectedNavRoute(this.currentUrl);
      }
    });
  }

  highLightSelectedNavRoute(currentUrl: string){    
    // 选取所有 routerLink 元素
    this.el.nativeElement.querySelectorAll('[routerLink]').forEach((element: HTMLElement) => {

      // 获取 routerLink 值
      const routerUrl = '/' + element.getAttribute('routerLink');

      // 对目标元素进行样式修改
      if (routerUrl === currentUrl && element.className.includes("navUrl")) {
        this.renderer.addClass(element, 'select-highlight');
      }
      else{
        this.renderer.removeClass(element, 'select-highlight');
      }
    });
  }
}