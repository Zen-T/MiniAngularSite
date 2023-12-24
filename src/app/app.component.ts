import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <link rel="stylesheet" href="app.component.css">

    <div class="app-page">

      <!--header-->
      <div class="app-header">
        <app-header></app-header>
      </div>

      <!-- routes get injected here -->
      <div class="app-content">
        <router-outlet></router-outlet>
      </div>

    </div>

    <!-- footer-->
    <div class="app-footer">
      <app-footer></app-footer>
    </div>

  `,
  styles: []
})
export class AppComponent {
  title = 'angular_site';
}
