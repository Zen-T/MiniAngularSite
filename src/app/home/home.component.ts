import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <section class="hero is-primary is-bold is-fullheight">
      <div class="hero-body">
      <div class="container has-text-centered">
        <p class="title">
          Miku
        </p>
        <p class="subtitle">
          Miku
        </p>
      </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      background-image: url('/assets/bg/overview_bg.jpg') !important;
      background-size: cover;
      background-position: center center;
    }
    
  `]
})
export class HomeComponent {

}
