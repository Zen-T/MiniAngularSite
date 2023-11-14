import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
    <div class="navbar is-dark">
      
      <!-- logo -->
      <div class="navbar-brand">
        <a class="navbar-item" routerLink="">
          <img src="assets/logo/logo_miku.svg">
        </a>
      </div>

      <!-- login -->
      <div>
        <a class="" routerLink="login">login</a>
      </div>
      
      <!-- menu -->
      <div class="navbar-menu">
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


    </div>
  `,
  styles: [
  ]
})
export class HeaderComponent {

}
