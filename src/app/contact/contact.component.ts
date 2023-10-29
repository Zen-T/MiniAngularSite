import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  template: `
    <section class="hero is-primary is-bold">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">contact us</h1>
      </div>
    </div>
    </section>

    <section class="section">
    <div class="container">
      <form (ngSubmit)="submitForm()" #contactForm="ngForm">
        <!-- name -->
        <div class="field">
          <label class="label">Name</label>
          <input 
            type="text" 
            name="name" 
            class="input" 
            [(ngModel)]="name" 
            #nameInput="ngModel"
            required>
          <div class="help is-error" *ngIf="nameInput.invalid && nameInput.touched">name can not be empty</div>
        </div>

        <!-- email -->
        <div class="field">
          <label class="label">Email</label>
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

        
        <!-- message -->
        <div class="field">
          <label class="label">Message</label>
          <textarea name="message" class="textarea" [(ngModel)]="message"></textarea>
        </div>

        <!-- submit button -->
        <button type="submit" class="button is-large is-warning" [disabled]="contactForm.invalid">Send</button>

      </form>
    </div>

    </section>

  `,
  styles: [
  ]
})
export class ContactComponent {

  name!: string;
  email!: string;
  message!: string;
  
  constructor(){}
  ngOnInit(){}

  submitForm() {
    const message = `my name is ${this.name}`;
    alert(message);
  }
}
